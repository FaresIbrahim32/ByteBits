from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from dotenv import load_dotenv
from models import User, FoodItem, Restaurant, Order
from here import search_halal_restaurants, build_restaurant_from_here
from similarity import rank_restaurants
from menu_fetcher import fetch_menu_for_category
from auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, user_credentials
)

load_dotenv()

app = FastAPI(title="ByteBites API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-memory stores ---
users: dict[str, User] = {}
restaurants: dict[str, Restaurant] = {}
food_items: dict[str, FoodItem] = {}
orders: dict[str, Order] = {}


# --- Schemas ---
class RegisterBody(BaseModel):
    username: str
    password: str
    name: str

class FoodItemCreate(BaseModel):
    item_id: str
    name: str
    price: float
    category: str
    popularity_rating: float

class RestaurantCreate(BaseModel):
    restaurant_id: str

class OrderCreate(BaseModel):
    order_id: str

class AddItemToOrder(BaseModel):
    item_id: str


# --- Auth routes ---
@app.post("/auth/register", status_code=201)
def register(body: RegisterBody):
    if body.username in user_credentials:
        raise HTTPException(status_code=400, detail="Username already taken.")
    user_credentials[body.username] = hash_password(body.password)
    users[body.username] = User(name=body.name)
    return {"username": body.username, "name": body.name}

@app.post("/auth/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    hashed = user_credentials.get(form.username)
    if not hashed or not verify_password(form.password, hashed):
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    token = create_access_token(form.username)
    return {"access_token": token, "token_type": "bearer"}


# --- User routes ---
@app.get("/users/me/orders")
def get_my_orders(username: str = Depends(get_current_user)):
    user = users.get(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    orders_list = user.get_orders()
    return [
        {"items": [i.name for i in o.items], "total": o.compute_total()}
        for o in orders_list
    ]


# --- Restaurant routes ---
@app.post("/restaurants", status_code=201)
def create_restaurant(body: RestaurantCreate, username: str = Depends(get_current_user)):
    if body.restaurant_id in restaurants:
        raise HTTPException(status_code=400, detail="Restaurant already exists.")
    restaurants[body.restaurant_id] = Restaurant()
    return {"restaurant_id": body.restaurant_id}

@app.post("/restaurants/{restaurant_id}/menu", status_code=201)
def add_item_to_menu(restaurant_id: str, body: FoodItemCreate, username: str = Depends(get_current_user)):
    restaurant = restaurants.get(restaurant_id)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found.")
    item = FoodItem(
        name=body.name,
        price=body.price,
        category=body.category,
        popularity_rating=body.popularity_rating
    )
    food_items[body.item_id] = item
    restaurant.add_item(item)
    return {"item_id": body.item_id, "name": body.name}

@app.get("/restaurants/{restaurant_id}/menu")
def get_menu(restaurant_id: str, category: str = None, username: str = Depends(get_current_user)):
    restaurant = restaurants.get(restaurant_id)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found.")

    # If only placeholder exists, fetch real meals from TheMealDB
    if len(restaurant.menu) <= 1 and restaurant.menu and restaurant.menu[0].name.startswith("Featured item"):
        cat = restaurant.menu[0].category
        restaurant.menu.clear()
        for meal in fetch_menu_for_category(cat):
            item = FoodItem(
                name=meal["name"],
                price=meal["price"],
                category=meal["category"],
                popularity_rating=meal["popularity_rating"]
            )
            food_items[meal["item_id"]] = item  # register so orders can reference them
            restaurant.add_item(item)

    items = restaurant.filter_by_category(category) if category else restaurant.menu
    return [
        {
            "item_id": next((k for k, v in food_items.items() if v is i), None),
            "name": i.name,
            "price": i.price,
            "category": i.category,
            "popularity_rating": i.popularity_rating
        }
        for i in items
    ]

@app.delete("/restaurants/{restaurant_id}/menu/{item_id}")
def remove_item_from_menu(restaurant_id: str, item_id: str, username: str = Depends(get_current_user)):
    restaurant = restaurants.get(restaurant_id)
    item = food_items.get(item_id)
    if not restaurant or not item:
        raise HTTPException(status_code=404, detail="Restaurant or item not found.")
    restaurant.remove_item(item)
    return {"detail": "Item removed from menu."}


# --- Order routes ---
@app.post("/orders", status_code=201)
def create_order(body: OrderCreate, username: str = Depends(get_current_user)):
    user = users.get(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    try:
        order = Order(customer=user)
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    orders[body.order_id] = order
    return {"order_id": body.order_id, "customer": user.name}

@app.post("/orders/{order_id}/items", status_code=201)
def add_item_to_order(order_id: str, body: AddItemToOrder, username: str = Depends(get_current_user)):
    order = orders.get(order_id)
    item = food_items.get(body.item_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found.")
    order.add_item(item)
    return {"detail": f"{item.name} added to order."}

@app.delete("/orders/{order_id}/items/{item_id}")
def remove_item_from_order(order_id: str, item_id: str, username: str = Depends(get_current_user)):
    order = orders.get(order_id)
    item = food_items.get(item_id)
    if not order or not item:
        raise HTTPException(status_code=404, detail="Order or item not found.")
    order.remove_item(item)
    return {"detail": f"{item.name} removed from order."}

@app.get("/orders/{order_id}/total")
def get_order_total(order_id: str, username: str = Depends(get_current_user)):
    order = orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return {"order_id": order_id, "total": order.compute_total()}


# --- Search routes ---
@app.get("/search/restaurants")
def search_restaurants(location: str, limit: int = 10, username: str = Depends(get_current_user)):
    try:
        results = search_halal_restaurants(location=location, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"OSM error: {str(e)}")
    for r in results:
        if r["here_id"] not in restaurants:
            restaurants[r["here_id"]] = build_restaurant_from_here(r)
    return rank_restaurants(results)

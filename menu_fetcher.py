import httpx
import random

BASE_URL = "https://www.themealdb.com/api/json/v1/1"

# Map restaurant categories to TheMealDB cuisine areas
CATEGORY_TO_CUISINE = {
    "turkish": "Turkish",
    "mediterranean": "Greek",
    "middle eastern": "Moroccan",
    "pakistani": "Indian",
    "indian": "Indian",
    "kebab": "Turkish",
    "shawarma": "Moroccan",
    "gyro": "Greek",
    "falafel": "Moroccan",
    "halal": "Turkish",
    "restaurant": "Turkish",
}

FALLBACK_CUISINES = ["Turkish", "Moroccan", "Greek", "Indian"]

PRICE_RANGES = {
    "main": (10.99, 18.99),
    "side": (3.99, 6.99),
    "drink": (1.99, 3.99),
}


def _detect_cuisine(category: str) -> str:
    cat = category.lower()
    for keyword, cuisine in CATEGORY_TO_CUISINE.items():
        if keyword in cat:
            return cuisine
    return random.choice(FALLBACK_CUISINES)


def _assign_price(meal_name: str) -> float:
    name = meal_name.lower()
    if any(w in name for w in ["juice", "tea", "coffee", "drink", "water"]):
        lo, hi = PRICE_RANGES["drink"]
    elif any(w in name for w in ["salad", "bread", "rice", "side", "dip", "hummus"]):
        lo, hi = PRICE_RANGES["side"]
    else:
        lo, hi = PRICE_RANGES["main"]
    return round(random.uniform(lo, hi), 2)


def fetch_menu_for_category(category: str, limit: int = 8) -> list[dict]:
    """Fetch real meal names from TheMealDB matching the restaurant's cuisine."""
    cuisine = _detect_cuisine(category)
    try:
        res = httpx.get(f"{BASE_URL}/filter.php", params={"a": cuisine}, timeout=10)
        res.raise_for_status()
        meals = res.json().get("meals") or []
        selected = random.sample(meals, min(limit, len(meals)))
        return [
            {
                "item_id": meal["idMeal"],
                "name": meal["strMeal"],
                "category": cuisine,
                "price": _assign_price(meal["strMeal"]),
                "popularity_rating": round(random.uniform(3.5, 5.0), 1),
                "thumbnail": meal.get("strMealThumb", ""),
            }
            for meal in selected
        ]
    except Exception:
        return []

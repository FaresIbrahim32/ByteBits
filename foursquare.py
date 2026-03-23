import os
import httpx
from dotenv import load_dotenv
from models import FoodItem, Restaurant

load_dotenv()

FOURSQUARE_API_KEY = os.getenv("FOURSQUARE_API_KEY")
HEADERS = {
    "Authorization": FOURSQUARE_API_KEY,
    "Accept": "application/json"
}
BASE_URL = "https://api.foursquare.com/v3"


def search_halal_restaurants(location: str, limit: int = 10) -> list[dict]:
    """Search for halal restaurants near a location string."""
    response = httpx.get(
        f"{BASE_URL}/places/search",
        headers=HEADERS,
        params={
            "query": "halal restaurant",
            "near": location,
            "limit": limit,
            "categories": "13065"  # Foursquare category ID for restaurants
        }
    )
    response.raise_for_status()
    results = response.json().get("results", [])

    restaurants = []
    for place in results:
        restaurants.append({
            "fsq_id": place["fsq_id"],
            "name": place["name"],
            "address": place.get("location", {}).get("formatted_address", ""),
            "category": place["categories"][0]["name"] if place.get("categories") else "Restaurant"
        })
    return restaurants


def build_restaurant_from_fsq(fsq_data: dict) -> Restaurant:
    """Convert a Foursquare place result into a Restaurant model."""
    restaurant = Restaurant()
    # Foursquare free tier doesn't include menu data,
    # so we seed a placeholder item from the place category
    placeholder = FoodItem(
        name=f"Featured item at {fsq_data['name']}",
        price=0.0,
        category=fsq_data.get("category", "General"),
        popularity_rating=0.0
    )
    restaurant.add_item(placeholder)
    return restaurant

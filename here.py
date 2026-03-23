import os
import httpx
from dotenv import load_dotenv
from models import FoodItem, Restaurant

load_dotenv()

HERE_API_KEY = os.getenv("HERE_API_KEY")
BASE_URL = "https://discover.search.hereapi.com/v1/discover"

HALAL_QUERIES = [
    "halal restaurant",
    "shawarma",
    "kebab",
    "mediterranean restaurant",
    "middle eastern restaurant",
    "turkish restaurant",
    "chicken over rice",
    "halal cart",
    "kabob",
    "gyro",
    "falafel",
    "pakistani restaurant",
]


def search_halal_restaurants(location: str, limit: int = 10) -> list[dict]:
    """Search HERE with multiple halal-related queries and merge results."""
    geo_url = "https://geocode.search.hereapi.com/v1/geocode"
    geo_res = httpx.get(geo_url, params={"q": location, "apiKey": HERE_API_KEY}, timeout=10)
    geo_res.raise_for_status()
    items = geo_res.json().get("items", [])
    if not items:
        return []

    pos = items[0]["position"]
    at = f"{pos['lat']},{pos['lng']}"

    seen_ids = set()
    results = []

    for query in HALAL_QUERIES:
        if len(results) >= limit * 3:
            break
        try:
            res = httpx.get(BASE_URL, params={
                "at": at,
                "q": query,
                "limit": limit,
                "apiKey": HERE_API_KEY
            }, timeout=10)
            res.raise_for_status()
            for item in res.json().get("items", []):
                if item["id"] not in seen_ids:
                    seen_ids.add(item["id"])
                    results.append({
                        "here_id": item["id"],
                        "name": item["title"],
                        "address": item.get("address", {}).get("label", ""),
                        "category": item.get("categories", [{}])[0].get("name", "Restaurant")
                    })
        except Exception:
            continue

    return results


def build_restaurant_from_here(data: dict) -> Restaurant:
    restaurant = Restaurant()
    placeholder = FoodItem(
        name=f"Featured item at {data['name']}",
        price=0.0,
        category=data.get("category", "General"),
        popularity_rating=0.0
    )
    restaurant.add_item(placeholder)
    return restaurant

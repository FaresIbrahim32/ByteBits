import httpx
from models import FoodItem, Restaurant

OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.ru/api/interpreter",
]


def search_halal_restaurants(location: str, limit: int = 10) -> list[dict]:
    """Search for halal restaurants using OpenStreetMap Overpass API."""
    query = f"""
    [out:json][timeout:25];
    area[name="{location}"]->.searchArea;
    (
      node["amenity"="restaurant"]["diet:halal"="yes"](area.searchArea);
      node["amenity"="restaurant"]["cuisine"~"halal|kebab|middle_eastern|turkish|pakistani|indian",i](area.searchArea);
    );
    out {limit};
    """
    last_error = None
    for url in OVERPASS_URLS:
        try:
            response = httpx.post(url, data={"data": query}, timeout=30)
            response.raise_for_status()
            elements = response.json().get("elements", [])
            break
        except Exception as e:
            last_error = e
            continue
    else:
        raise last_error

    restaurants = []
    for el in elements:
        tags = el.get("tags", {})
        restaurants.append({
            "osm_id": str(el["id"]),
            "name": tags.get("name", "Unnamed Restaurant"),
            "address": tags.get("addr:street", "") + " " + tags.get("addr:city", ""),
            "category": tags.get("cuisine", "Restaurant")
        })
    return restaurants


def build_restaurant_from_osm(osm_data: dict) -> Restaurant:
    """Convert an OSM result into a Restaurant model."""
    restaurant = Restaurant()
    placeholder = FoodItem(
        name=f"Featured item at {osm_data['name']}",
        price=0.0,
        category=osm_data.get("category", "General"),
        popularity_rating=0.0
    )
    restaurant.add_item(placeholder)
    return restaurant

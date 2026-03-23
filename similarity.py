from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

# Anchor concepts that define "halal-style" food
HALAL_ANCHORS = [
    "halal food",
    "shawarma",
    "turkish food",
    "chicken over rice",
    "lamb over rice",
    "beef over rice",
    "kebab",
    "kabob",
    "middle eastern food",
    "pakistani cuisine",
    "falafel",
    "lamb gyro",
    "doner kebab",
    "mediterranean food",
    "halal cart",
    "gyro",
    "kofta",
    "hummus",
    "pita",
    "biryani",
]

anchor_embeddings = model.encode(HALAL_ANCHORS, normalize_embeddings=True)
anchor_mean = np.mean(anchor_embeddings, axis=0)


def score_restaurant(name: str, category: str) -> float:
    """Return a 0-1 similarity score against halal food anchors."""
    text = f"{name} {category}"
    embedding = model.encode([text], normalize_embeddings=True)[0]
    return float(np.dot(embedding, anchor_mean))


def rank_restaurants(restaurants: list[dict]) -> list[dict]:
    """Sort restaurants by halal similarity score, highest first."""
    for r in restaurants:
        r["similarity_score"] = score_restaurant(r["name"], r.get("category", ""))
    return sorted(restaurants, key=lambda r: r["similarity_score"], reverse=True)

"""
Generate mock Zomato-style restaurant data for analytics pipeline.
Produces 500 restaurant records with cluster features and mock reviews.
"""

import json
import random
from pathlib import Path

import numpy as np
import pandas as pd

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
NUM_RESTAURANTS = 500
RANDOM_SEED = 42
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

CITIES = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow",
]

CUISINES = [
    "North Indian", "South Indian", "Chinese", "Italian",
    "Mexican", "Thai", "Japanese", "Continental", "Fast Food",
    "Biryani", "Cafe", "Desserts", "Street Food", "Mughlai",
]

RESTAURANT_PREFIXES = [
    "Spice", "Royal", "Golden", "Urban", "Classic", "Fusion",
    "Heritage", "Modern", "Taste", "Flavors", "Cafe", "Kitchen",
    "Bistro", "House", "Palace", "Corner", "Garden", "Express",
]

RESTAURANT_SUFFIXES = [
    "Delight", "Hub", "Kitchen", "Lounge", "Grill", "Bites",
    "Eatery", "Corner", "Garden", "Express", "House", "Point",
    "Junction", "Spot", "Zone", "World", "Story", "Tales",
]

POSITIVE_REVIEW_TEMPLATES = [
    "Amazing {cuisine} food! The {dish} was perfectly cooked and full of flavor.",
    "Great ambiance and friendly staff. Highly recommend the {dish}.",
    "Best {cuisine} restaurant in {city}. Worth every rupee!",
    "Loved the {dish}. Fresh ingredients and generous portions.",
    "Excellent service and quick delivery. The {dish} is a must-try.",
    "Cozy place with authentic {cuisine} flavors. Will visit again!",
    "Five stars for the {dish} and the warm hospitality.",
    "Outstanding quality. The {dish} exceeded my expectations.",
]

NEGATIVE_REVIEW_TEMPLATES = [
    "Disappointing experience. The {dish} was cold and bland.",
    "Overpriced for the portion size. Not worth visiting again.",
    "Long wait times and rude staff. Food quality was mediocre.",
    "The {dish} tasted stale. Hygiene standards need improvement.",
    "Expected better {cuisine} food. Very underwhelming.",
    "Poor service and the {dish} was nothing special.",
    "Not recommended. Found hair in my food during visit.",
    "Average at best. There are better {cuisine} places in {city}.",
]

NEUTRAL_REVIEW_TEMPLATES = [
    "Decent {cuisine} food. The {dish} was okay, nothing extraordinary.",
    "Standard restaurant experience. Prices are reasonable.",
    "The {dish} was fine. Ambiance could use some improvement.",
    "Average place for a quick meal. {dish} was acceptable.",
    "Nothing special but not bad either. Typical {cuisine} fare.",
]

DISHES = [
    "butter chicken", "biryani", "dosa", "pizza", "pasta", "sushi",
    "tacos", "noodles", "thali", "kebab", "burger", "momos",
    "paneer tikka", "dal makhani", "fried rice", "curry",
]


def generate_restaurant_name(rng: random.Random) -> str:
    """Generate a plausible restaurant name."""
    prefix = rng.choice(RESTAURANT_PREFIXES)
    suffix = rng.choice(RESTAURANT_SUFFIXES)
    if rng.random() < 0.3:
        return f"{prefix} {suffix}"
    return f"{prefix}'s {rng.choice(CUISINES)} {suffix}"


def generate_reviews(
    rng: random.Random,
    cuisine: str,
    city: str,
    rating: float,
    num_reviews: int = 3,
) -> list[dict]:
    """Generate mock reviews with sentiment aligned to restaurant rating."""
    reviews = []
    for _ in range(num_reviews):
        dish = rng.choice(DISHES)
        # Higher-rated restaurants get more positive reviews
        if rating >= 4.0:
            weights = [0.7, 0.1, 0.2]
        elif rating >= 3.0:
            weights = [0.4, 0.3, 0.3]
        else:
            weights = [0.15, 0.55, 0.3]

        template_pool = rng.choices(
            [POSITIVE_REVIEW_TEMPLATES, NEGATIVE_REVIEW_TEMPLATES, NEUTRAL_REVIEW_TEMPLATES],
            weights=weights,
            k=1,
        )[0]
        text = rng.choice(template_pool).format(cuisine=cuisine, city=city, dish=dish)
        reviews.append({"text": text})
    return reviews


def generate_restaurants(n: int = NUM_RESTAURANTS, seed: int = RANDOM_SEED) -> pd.DataFrame:
    """Generate n mock restaurant records with cluster-relevant features."""
    rng = random.Random(seed)
    np_rng = np.random.default_rng(seed)

    records = []
    for i in range(1, n + 1):
        city = rng.choice(CITIES)
        cuisine = rng.choice(CUISINES)

        # Rating skewed toward 3.0–4.5
        rating = round(float(np.clip(np_rng.normal(3.8, 0.6), 2.0, 5.0)), 1)
        votes = int(np_rng.integers(50, 5000))

        # Cost for two (INR) varies by cuisine and city tier
        base_cost = {
            "Mumbai": 1200, "Delhi": 1100, "Bangalore": 1000,
            "Hyderabad": 900, "Chennai": 850, "Pune": 800,
            "Kolkata": 750, "Ahmedabad": 700, "Jaipur": 650, "Lucknow": 600,
        }.get(city, 800)

        cuisine_multiplier = {
            "Japanese": 1.4, "Italian": 1.3, "Continental": 1.2,
            "Thai": 1.15, "Mexican": 1.1, "Cafe": 0.9,
            "Street Food": 0.7, "Fast Food": 0.75, "Desserts": 0.85,
        }.get(cuisine, 1.0)

        cost_for_two = int(np_rng.integers(
            int(base_cost * cuisine_multiplier * 0.6),
            int(base_cost * cuisine_multiplier * 1.4),
        ))

        # Cluster features
        delivery_time = int(np_rng.integers(20, 60))
        online_order_pct = round(float(np_rng.uniform(0.3, 0.95)), 2)
        table_booking = rng.choices([True, False], weights=[0.6, 0.4], k=1)[0]
        has_bar = rng.choices([True, False], weights=[0.35, 0.65], k=1)[0]
        parking = rng.choices([True, False], weights=[0.5, 0.5], k=1)[0]

        reviews = generate_reviews(rng, cuisine, city, rating)

        records.append({
            "restaurant_id": i,
            "name": generate_restaurant_name(rng),
            "city": city,
            "cuisine": cuisine,
            "rating": rating,
            "votes": votes,
            "cost_for_two": cost_for_two,
            "delivery_time_mins": delivery_time,
            "online_order_pct": online_order_pct,
            "table_booking": table_booking,
            "has_bar": has_bar,
            "parking_available": parking,
            "reviews": reviews,
        })

    return pd.DataFrame(records)


def main() -> None:
    """Generate data and save to CSV/JSON."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    df = generate_restaurants()
    restaurants_path = DATA_DIR / "restaurants.csv"
    reviews_path = DATA_DIR / "reviews.json"

    # Save restaurants (without embedded reviews for CSV)
    df.drop(columns=["reviews"]).to_csv(restaurants_path, index=False)

    # Flatten reviews for sentiment analysis
    all_reviews = []
    for _, row in df.iterrows():
        for idx, review in enumerate(row["reviews"]):
            all_reviews.append({
                "restaurant_id": row["restaurant_id"],
                "restaurant_name": row["name"],
                "city": row["city"],
                "cuisine": row["cuisine"],
                "review_id": f"{row['restaurant_id']}_{idx}",
                "text": review["text"],
            })

    with open(reviews_path, "w", encoding="utf-8") as f:
        json.dump(all_reviews, f, indent=2, ensure_ascii=False)

    print(f"Generated {len(df)} restaurant records")
    print(f"  -> {restaurants_path}")
    print(f"  -> {reviews_path} ({len(all_reviews)} reviews)")
    print(f"\nSummary:")
    print(f"  Cities: {df['city'].nunique()}")
    print(f"  Cuisines: {df['cuisine'].nunique()}")
    print(f"  Avg rating: {df['rating'].mean():.2f}")
    print(f"  Avg cost for two: ₹{df['cost_for_two'].mean():.0f}")


if __name__ == "__main__":
    main()
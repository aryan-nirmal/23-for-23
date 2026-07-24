"""
Analytics pipeline: KMeans clustering + VADER sentiment analysis.
"""

import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

try:
    from nltk.sentiment.vader import SentimentIntensityAnalyzer
    import nltk

    try:
        nltk.data.find("sentiment/vader_lexicon.zip")
    except LookupError:
        nltk.download("vader_lexicon", quiet=True)
except ImportError:
    raise ImportError("nltk is required. Install with: pip install nltk")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
N_CLUSTERS = 4
RANDOM_SEED = 42
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

CLUSTER_FEATURES = [
    "rating",
    "votes",
    "cost_for_two",
    "delivery_time_mins",
    "online_order_pct",
]

CLUSTER_LABELS = {
    0: "Budget Favorites",
    1: "Premium Dining",
    2: "Quick Service",
    3: "Hidden Gems",
}


def load_data() -> tuple[pd.DataFrame, list[dict]]:
    """Load restaurant CSV and reviews JSON."""
    restaurants = pd.read_csv(DATA_DIR / "restaurants.csv")
    with open(DATA_DIR / "reviews.json", encoding="utf-8") as f:
        reviews = json.load(f)
    return restaurants, reviews


def run_clustering(df: pd.DataFrame, n_clusters: int = N_CLUSTERS) -> pd.DataFrame:
    """Apply KMeans clustering on restaurant features."""
    feature_df = df[CLUSTER_FEATURES].copy()

    # Convert boolean columns if present
    for col in feature_df.columns:
        if feature_df[col].dtype == bool:
            feature_df[col] = feature_df[col].astype(int)

    scaler = StandardScaler()
    scaled = scaler.fit_transform(feature_df)

    kmeans = KMeans(n_clusters=n_clusters, random_state=RANDOM_SEED, n_init=10)
    df = df.copy()
    df["cluster"] = kmeans.fit_predict(scaled)

    # Assign human-readable labels based on cluster centroids
    centroids = pd.DataFrame(
        scaler.inverse_transform(kmeans.cluster_centers_),
        columns=CLUSTER_FEATURES,
    )
    centroids["cluster"] = range(n_clusters)

    # Rank clusters by cost and rating to assign labels
    centroids = centroids.sort_values("cost_for_two")
    label_order = ["Budget Favorites", "Quick Service", "Hidden Gems", "Premium Dining"]
    cluster_map = {
        int(row["cluster"]): label_order[i]
        for i, (_, row) in enumerate(centroids.iterrows())
    }
    # Refine: premium = highest cost + rating
    premium_cluster = centroids.loc[centroids["rating"].idxmax(), "cluster"]
    cluster_map[int(premium_cluster)] = "Premium Dining"
    budget_cluster = centroids.loc[centroids["cost_for_two"].idxmin(), "cluster"]
    cluster_map[int(budget_cluster)] = "Budget Favorites"

    df["cluster_label"] = df["cluster"].map(cluster_map)

    return df, kmeans, scaler


def run_sentiment_analysis(reviews: list[dict]) -> pd.DataFrame:
    """Apply VADER sentiment scoring to review texts."""
    sia = SentimentIntensityAnalyzer()
    results = []

    for review in reviews:
        scores = sia.polarity_scores(review["text"])
        compound = scores["compound"]

        if compound >= 0.05:
            sentiment = "Positive"
        elif compound <= -0.05:
            sentiment = "Negative"
        else:
            sentiment = "Neutral"

        results.append({
            **review,
            "sentiment_compound": compound,
            "sentiment_positive": scores["pos"],
            "sentiment_negative": scores["neg"],
            "sentiment_neutral": scores["neu"],
            "sentiment_label": sentiment,
        })

    return pd.DataFrame(results)


def compute_topic_insights(
    restaurants: pd.DataFrame,
    sentiments: pd.DataFrame,
) -> dict:
    """Derive topic-level insights from clustered data and sentiments."""
    merged = sentiments.merge(
        restaurants[["restaurant_id", "cluster_label", "rating", "cost_for_two"]],
        on="restaurant_id",
    )

    insights = {
        "by_cluster": restaurants.groupby("cluster_label").agg(
            count=("restaurant_id", "count"),
            avg_rating=("rating", "mean"),
            avg_cost=("cost_for_two", "mean"),
            avg_votes=("votes", "mean"),
        ).round(2).to_dict("index"),

        "by_city": restaurants.groupby("city").agg(
            count=("restaurant_id", "count"),
            avg_rating=("rating", "mean"),
        ).round(2).to_dict("index"),

        "by_cuisine": restaurants.groupby("cuisine").agg(
            count=("restaurant_id", "count"),
            avg_rating=("rating", "mean"),
        ).round(2).to_dict("index"),

        "sentiment_distribution": sentiments["sentiment_label"].value_counts().to_dict(),

        "top_rated": restaurants.nlargest(10, "rating")[
            ["name", "city", "cuisine", "rating", "votes", "cost_for_two", "cluster_label"]
        ].to_dict("records"),

        "sentiment_by_cluster": merged.groupby("cluster_label")["sentiment_label"]
            .value_counts()
            .unstack(fill_value=0)
            .to_dict("index"),
    }

    return insights


def main() -> None:
    """Run full analytics pipeline and save outputs."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    print("Loading data...")
    restaurants, reviews = load_data()
    print(f"  {len(restaurants)} restaurants, {len(reviews)} reviews")

    print(f"\nRunning KMeans clustering (k={N_CLUSTERS})...")
    clustered, kmeans, scaler = run_clustering(restaurants)
    cluster_path = DATA_DIR / "restaurants_clustered.csv"
    clustered.to_csv(cluster_path, index=False)
    print(f"  Cluster distribution:")
    for label, count in clustered["cluster_label"].value_counts().items():
        print(f"    {label}: {count}")

    print("\nRunning VADER sentiment analysis...")
    sentiments = run_sentiment_analysis(reviews)
    sentiment_path = DATA_DIR / "sentiment_results.csv"
    sentiments.to_csv(sentiment_path, index=False)
    print(f"  Sentiment distribution:")
    for label, count in sentiments["sentiment_label"].value_counts().items():
        pct = 100 * count / len(sentiments)
        print(f"    {label}: {count} ({pct:.1f}%)")

    print("\nComputing topic insights...")
    insights = compute_topic_insights(clustered, sentiments)
    insights_path = DATA_DIR / "insights.json"
    with open(insights_path, "w", encoding="utf-8") as f:
        json.dump(insights, f, indent=2, default=str)
    print(f"  -> {insights_path}")

    print(f"\nOutputs saved:")
    print(f"  {cluster_path}")
    print(f"  {sentiment_path}")
    print(f"  {insights_path}")


if __name__ == "__main__":
    main()
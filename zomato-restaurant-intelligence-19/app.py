"""
Zomato Restaurant Intelligence Dashboard
Streamlit MVP with clustering, sentiment, and filtering.
"""

import json
from pathlib import Path

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

# ---------------------------------------------------------------------------
# Page config
# ---------------------------------------------------------------------------
st.set_page_config(
    page_title="Zomato Restaurant Intelligence",
    page_icon="🍽️",
    layout="wide",
)

DATA_DIR = Path(__file__).resolve().parent / "data"


@st.cache_data
def load_dashboard_data():
    """Load pre-computed analytics outputs."""
    restaurants = pd.read_csv(DATA_DIR / "restaurants_clustered.csv")
    sentiments = pd.read_csv(DATA_DIR / "sentiment_results.csv")
    with open(DATA_DIR / "insights.json", encoding="utf-8") as f:
        insights = json.load(f)
    return restaurants, sentiments, insights


def main():
    st.title("🍽️ Zomato Restaurant Intelligence Dashboard")
    st.markdown(
        "Explore restaurant clusters, review sentiment, and market insights "
        "across cities and cuisines."
    )

    try:
        restaurants, sentiments, insights = load_dashboard_data()
    except FileNotFoundError:
        st.error(
            "Data files not found. Run `python src/generate_data.py` and "
            "`python src/analyze.py` first."
        )
        st.stop()

    # -----------------------------------------------------------------------
    # Sidebar filters
    # -----------------------------------------------------------------------
    st.sidebar.header("Filters")

    cities = ["All"] + sorted(restaurants["city"].unique().tolist())
    cuisines = ["All"] + sorted(restaurants["cuisine"].unique().tolist())
    clusters = ["All"] + sorted(restaurants["cluster_label"].unique().tolist())

    selected_city = st.sidebar.selectbox("City", cities)
    selected_cuisine = st.sidebar.selectbox("Cuisine", cuisines)
    selected_cluster = st.sidebar.selectbox("Cluster", clusters)

    filtered = restaurants.copy()
    if selected_city != "All":
        filtered = filtered[filtered["city"] == selected_city]
    if selected_cuisine != "All":
        filtered = filtered[filtered["cuisine"] == selected_cuisine]
    if selected_cluster != "All":
        filtered = filtered[filtered["cluster_label"] == selected_cluster]

    filtered_ids = set(filtered["restaurant_id"])
    filtered_sentiments = sentiments[sentiments["restaurant_id"].isin(filtered_ids)]

    # -----------------------------------------------------------------------
    # KPI metrics
    # -----------------------------------------------------------------------
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Restaurants", len(filtered))
    col2.metric("Avg Rating", f"{filtered['rating'].mean():.2f}" if len(filtered) else "—")
    col3.metric("Avg Cost (₹)", f"{filtered['cost_for_two'].mean():.0f}" if len(filtered) else "—")
    col4.metric("Total Reviews", len(filtered_sentiments))

    st.divider()

    # -----------------------------------------------------------------------
    # Row 1: Cluster scatter + Sentiment distribution
    # -----------------------------------------------------------------------
    chart_col1, chart_col2 = st.columns(2)

    with chart_col1:
        st.subheader("Cluster Scatter Plot")
        if len(filtered) > 0:
            fig_scatter = px.scatter(
                filtered,
                x="cost_for_two",
                y="rating",
                color="cluster_label",
                size="votes",
                hover_data=["name", "city", "cuisine"],
                labels={
                    "cost_for_two": "Cost for Two (₹)",
                    "rating": "Rating",
                    "cluster_label": "Cluster",
                },
                color_discrete_sequence=px.colors.qualitative.Set2,
            )
            fig_scatter.update_layout(height=420, legend=dict(orientation="h", y=-0.2))
            st.plotly_chart(fig_scatter, use_container_width=True)
        else:
            st.info("No restaurants match the selected filters.")

    with chart_col2:
        st.subheader("Sentiment Distribution")
        if len(filtered_sentiments) > 0:
            sentiment_counts = filtered_sentiments["sentiment_label"].value_counts()
            colors = {"Positive": "#2ecc71", "Neutral": "#f39c12", "Negative": "#e74c3c"}
            fig_pie = go.Figure(data=[go.Pie(
                labels=sentiment_counts.index.tolist(),
                values=sentiment_counts.values.tolist(),
                marker_colors=[colors.get(l, "#95a5a6") for l in sentiment_counts.index],
                hole=0.4,
            )])
            fig_pie.update_layout(height=420, showlegend=True)
            st.plotly_chart(fig_pie, use_container_width=True)
        else:
            st.info("No reviews for selected filters.")

    # -----------------------------------------------------------------------
    # Row 2: Top restaurants table
    # -----------------------------------------------------------------------
    st.subheader("Top Restaurants")
    if len(filtered) > 0:
        top_n = st.slider("Show top N restaurants", 5, 25, 10)
        top_df = (
            filtered.nlargest(top_n, "rating")[
                ["name", "city", "cuisine", "rating", "votes",
                 "cost_for_two", "cluster_label", "delivery_time_mins"]
            ]
            .reset_index(drop=True)
        )
        top_df.index += 1
        st.dataframe(top_df, use_container_width=True)
    else:
        st.info("No data to display.")

    st.divider()

    # -----------------------------------------------------------------------
    # Row 3: Topic insights
    # -----------------------------------------------------------------------
    st.subheader("Topic Insights")

    insight_col1, insight_col2, insight_col3 = st.columns(3)

    with insight_col1:
        st.markdown("**By Cluster**")
        cluster_data = insights.get("by_cluster", {})
        if cluster_data:
            cluster_df = pd.DataFrame(cluster_data).T
            cluster_df.index.name = "Cluster"
            st.dataframe(cluster_df.round(2), use_container_width=True)

    with insight_col2:
        st.markdown("**Top Cities by Rating**")
        city_data = insights.get("by_city", {})
        if city_data:
            city_df = (
                pd.DataFrame(city_data).T
                .sort_values("avg_rating", ascending=False)
                .head(8)
            )
            city_df.index.name = "City"
            st.dataframe(city_df.round(2), use_container_width=True)

    with insight_col3:
        st.markdown("**Top Cuisines by Rating**")
        cuisine_data = insights.get("by_cuisine", {})
        if cuisine_data:
            cuisine_df = (
                pd.DataFrame(cuisine_data).T
                .sort_values("avg_rating", ascending=False)
                .head(8)
            )
            cuisine_df.index.name = "Cuisine"
            st.dataframe(cuisine_df.round(2), use_container_width=True)

    # Cluster rating bar chart
    st.markdown("**Average Rating by Cluster**")
    if len(filtered) > 0:
        cluster_avg = (
            filtered.groupby("cluster_label")["rating"]
            .mean()
            .reset_index()
            .sort_values("rating", ascending=True)
        )
        fig_bar = px.bar(
            cluster_avg,
            x="rating",
            y="cluster_label",
            orientation="h",
            labels={"rating": "Avg Rating", "cluster_label": "Cluster"},
            color="rating",
            color_continuous_scale="RdYlGn",
        )
        fig_bar.update_layout(height=300, showlegend=False)
        st.plotly_chart(fig_bar, use_container_width=True)

    # Sentiment by cluster heatmap-style table
    st.markdown("**Sentiment Breakdown by Cluster**")
    sentiment_by_cluster = insights.get("sentiment_by_cluster", {})
    if sentiment_by_cluster:
        sbc_df = pd.DataFrame(sentiment_by_cluster).T.fillna(0).astype(int)
        sbc_df.index.name = "Cluster"
        st.dataframe(sbc_df, use_container_width=True)


if __name__ == "__main__":
    main()
# Zomato Restaurant Intelligence Dashboard

A Python analytics MVP that generates mock Zomato-style restaurant data, clusters restaurants with KMeans, analyzes review sentiment with VADER, and visualizes insights in an interactive Streamlit dashboard.

## Features

- **Mock data generation** — 500 restaurant records across 10 Indian cities and 14 cuisines
- **KMeans clustering** — 4 segments: Budget Favorites, Premium Dining, Quick Service, Hidden Gems
- **VADER sentiment analysis** — Positive / Neutral / Negative classification on mock reviews
- **Interactive dashboard** — Filter by city, cuisine, and cluster; scatter plots, sentiment charts, top restaurants table, and topic insights

## Project Structure

```
zomato-restaurant-intelligence-19/
├── app.py                  # Streamlit dashboard
├── requirements.txt
├── README.md
├── data/                   # Generated outputs (gitignored)
│   ├── restaurants.csv
│   ├── reviews.json
│   ├── restaurants_clustered.csv
│   ├── sentiment_results.csv
│   └── insights.json
└── src/
    ├── generate_data.py    # Mock data generator
    └── analyze.py          # Clustering + sentiment pipeline
```

## Setup

```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Usage

```bash
# 1. Generate mock restaurant data
python src/generate_data.py

# 2. Run analytics (clustering + sentiment)
python src/analyze.py

# 3. Launch dashboard
streamlit run app.py
```

The dashboard opens at `http://localhost:8501`.

## Analytics Pipeline

### Clustering Features
| Feature | Description |
|---------|-------------|
| `rating` | Restaurant rating (2.0–5.0) |
| `votes` | Number of user votes |
| `cost_for_two` | Average cost for two (INR) |
| `delivery_time_mins` | Estimated delivery time |
| `online_order_pct` | Online ordering adoption rate |

### Sentiment Analysis
Reviews are scored with NLTK's VADER lexicon:
- **Positive**: compound score ≥ 0.05
- **Negative**: compound score ≤ −0.05
- **Neutral**: otherwise

## Dashboard Sections

1. **KPI metrics** — Restaurant count, avg rating, avg cost, review count
2. **Cluster scatter plot** — Cost vs rating, sized by votes, colored by cluster
3. **Sentiment distribution** — Donut chart of review sentiments
4. **Top restaurants table** — Sortable, filterable leaderboard
5. **Topic insights** — Cluster stats, city/cuisine rankings, sentiment breakdown

## Dependencies

- `pandas` — Data manipulation
- `scikit-learn` — KMeans clustering
- `streamlit` — Dashboard UI
- `plotly` — Interactive charts
- `nltk` — VADER sentiment analyzer
- `numpy` — Numerical operations

## License

MIT — for educational and portfolio use.
# Credit Scoring Model MVP

A minimal credit default prediction project built with scikit-learn, XGBoost, SHAP, and Streamlit. Uses **synthetic data only** for demonstration and learning purposes.

## Features

- Synthetic dataset generation (2,000 applicants)
- Trains 4 models: Logistic Regression, Decision Tree, Random Forest, XGBoost
- Saves best model by ROC-AUC to `models/best_model.joblib`
- Exports evaluation metrics to `reports/metrics.json`
- Streamlit app for predictions and metrics dashboard

## Project Structure

```
credit-scoring-model-15/
├── app.py                 # Streamlit demo
├── requirements.txt
├── README.md
├── src/
│   ├── preprocess.py      # Preprocessing pipeline
│   └── train.py           # Data generation & training
├── data/
│   └── credit_data.csv    # Generated after training
├── models/
│   └── best_model.joblib  # Best model artifact
└── reports/
    └── metrics.json       # Model comparison metrics
```

## Setup

```bash
cd credit-scoring-model-15
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Train Models

```bash
python src/train.py
```

This will:
1. Generate 2,000 synthetic credit records
2. Train all four classifiers
3. Save the best model and metrics

## Run Streamlit App

```bash
streamlit run app.py
```

Open the URL shown in the terminal (typically `http://localhost:8501`).

### App Tabs

- **Predict** — Enter applicant features, get default probability and feature importance
- **Metrics Dashboard** — Compare model performance from `reports/metrics.json`

## Input Features

| Feature | Description |
|---------|-------------|
| `age` | Applicant age |
| `income` | Annual income ($) |
| `debt_ratio` | Debt-to-income ratio (0–1) |
| `credit_history_months` | Length of credit history |
| `num_accounts` | Number of credit accounts |
| `late_payments` | Late payments in last 2 years |
| `employment_years` | Years at current employment |
| `loan_amount` | Requested loan amount ($) |

## Disclaimer

**This project is for educational purposes only.**

- All data is **synthetically generated** and does not represent real individuals.
- Model outputs must **not** be used for actual credit, lending, or employment decisions.
- Real credit scoring requires regulatory compliance (e.g., fair lending laws, model explainability requirements, adverse action notices).
- Consult qualified professionals and legal counsel before deploying any production credit model.
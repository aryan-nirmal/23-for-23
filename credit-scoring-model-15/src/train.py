"""Train credit default models on synthetic data and save best model."""

import json
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from xgboost import XGBClassifier

# Allow imports when running as script
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.preprocess import FEATURE_COLUMNS, build_model_pipeline

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = PROJECT_ROOT / "data" / "credit_data.csv"
MODELS_DIR = PROJECT_ROOT / "models"
REPORTS_DIR = PROJECT_ROOT / "reports"
RANDOM_STATE = 42


def generate_synthetic_data(n_rows: int = 2000, random_state: int = RANDOM_STATE) -> pd.DataFrame:
    """Generate synthetic credit dataset with realistic feature relationships."""
    rng = np.random.default_rng(random_state)

    age = rng.integers(21, 70, size=n_rows)
    income = rng.normal(55000, 20000, size=n_rows).clip(20000, 150000)
    employment_years = rng.integers(0, 30, size=n_rows)
    credit_history_months = rng.integers(6, 360, size=n_rows)
    num_accounts = rng.integers(1, 12, size=n_rows)
    loan_amount = rng.normal(25000, 15000, size=n_rows).clip(1000, 100000)
    late_payments = rng.poisson(1.5, size=n_rows).clip(0, 15)
    debt_ratio = rng.beta(2, 5, size=n_rows) * 0.9 + 0.05

    # Logistic-style risk score for default label
    logit = (
        -2.5
        + 0.03 * (65 - age)
        + 0.00004 * (60000 - income)
        + 4.0 * debt_ratio
        + 0.15 * late_payments
        - 0.002 * credit_history_months
        + 0.00003 * loan_amount
        - 0.08 * employment_years
        + 0.05 * num_accounts
    )
    prob_default = 1 / (1 + np.exp(-logit))
    default = rng.binomial(1, prob_default)

    df = pd.DataFrame(
        {
            "age": age,
            "income": income.round(2),
            "debt_ratio": debt_ratio.round(4),
            "credit_history_months": credit_history_months,
            "num_accounts": num_accounts,
            "late_payments": late_payments,
            "employment_years": employment_years,
            "loan_amount": loan_amount.round(2),
            "default": default,
        }
    )
    return df


def evaluate_model(name: str, pipeline, X_test, y_test) -> dict:
    """Compute classification metrics for a fitted pipeline."""
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]

    return {
        "model": name,
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "precision": round(float(precision_score(y_test, y_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, y_pred, zero_division=0)), 4),
        "f1": round(float(f1_score(y_test, y_pred, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, y_proba)), 4),
    }


def get_models():
    """Return model configurations to train."""
    return {
        "LogisticRegression": build_model_pipeline(
            LogisticRegression(max_iter=1000, random_state=RANDOM_STATE)
        ),
        "DecisionTree": build_model_pipeline(
            DecisionTreeClassifier(max_depth=8, random_state=RANDOM_STATE)
        ),
        "RandomForest": build_model_pipeline(
            RandomForestClassifier(
                n_estimators=100, max_depth=10, random_state=RANDOM_STATE
            )
        ),
        "XGBoost": build_model_pipeline(
            XGBClassifier(
                n_estimators=100,
                max_depth=5,
                learning_rate=0.1,
                eval_metric="logloss",
                random_state=RANDOM_STATE,
            )
        ),
    }


def main():
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    (PROJECT_ROOT / "data").mkdir(parents=True, exist_ok=True)

    print("Generating synthetic credit dataset...")
    df = generate_synthetic_data(n_rows=2000)
    df.to_csv(DATA_PATH, index=False)
    print(f"Saved dataset to {DATA_PATH} ({len(df)} rows)")

    X = df[FEATURE_COLUMNS]
    y = df["default"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )

    results = []
    fitted_models = {}

    print("\nTraining models...")
    for name, pipeline in get_models().items():
        print(f"  - {name}")
        pipeline.fit(X_train, y_train)
        metrics = evaluate_model(name, pipeline, X_test, y_test)
        results.append(metrics)
        fitted_models[name] = pipeline
        print(
            f"    ROC-AUC: {metrics['roc_auc']:.4f} | "
            f"F1: {metrics['f1']:.4f} | Accuracy: {metrics['accuracy']:.4f}"
        )

    best = max(results, key=lambda m: m["roc_auc"])
    best_name = best["model"]
    best_pipeline = fitted_models[best_name]

    model_path = MODELS_DIR / "best_model.joblib"
    joblib.dump(
        {
            "pipeline": best_pipeline,
            "model_name": best_name,
            "feature_columns": FEATURE_COLUMNS,
        },
        model_path,
    )

    metrics_payload = {
        "best_model": best_name,
        "test_size": 0.2,
        "n_samples": len(df),
        "default_rate": round(float(y.mean()), 4),
        "models": results,
    }

    metrics_path = REPORTS_DIR / "metrics.json"
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)

    print(f"\nBest model: {best_name} (ROC-AUC: {best['roc_auc']:.4f})")
    print(f"Saved best model to {model_path}")
    print(f"Saved metrics to {metrics_path}")


if __name__ == "__main__":
    main()
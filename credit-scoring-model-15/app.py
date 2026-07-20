"""Streamlit demo for credit default prediction."""

import json
from pathlib import Path

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import shap
import streamlit as st

PROJECT_ROOT = Path(__file__).resolve().parent
MODEL_PATH = PROJECT_ROOT / "models" / "best_model.joblib"
METRICS_PATH = PROJECT_ROOT / "reports" / "metrics.json"

FEATURE_DEFAULTS = {
    "age": 35,
    "income": 55000.0,
    "debt_ratio": 0.35,
    "credit_history_months": 84,
    "num_accounts": 4,
    "late_payments": 1,
    "employment_years": 8,
    "loan_amount": 25000.0,
}


@st.cache_resource
def load_artifact():
    """Load trained model artifact."""
    if not MODEL_PATH.exists():
        return None
    return joblib.load(MODEL_PATH)


@st.cache_data
def load_metrics():
    """Load training metrics from JSON."""
    if not METRICS_PATH.exists():
        return None
    with open(METRICS_PATH, encoding="utf-8") as f:
        return json.load(f)


def get_feature_importance(pipeline, model_name: str, sample_df: pd.DataFrame):
    """Extract feature importance via SHAP or model coefficients."""
    classifier = pipeline.named_steps["classifier"]
    preprocessor = pipeline.named_steps["preprocessor"]
    feature_names = sample_df.columns.tolist()

    X_transformed = preprocessor.transform(sample_df)

    if model_name == "LogisticRegression":
        coefs = classifier.coef_.flatten()
        return pd.DataFrame({"feature": feature_names, "importance": np.abs(coefs)})

    if model_name == "DecisionTree":
        return pd.DataFrame(
            {"feature": feature_names, "importance": classifier.feature_importances_}
        )

    if model_name in ("RandomForest", "XGBoost"):
        return pd.DataFrame(
            {"feature": feature_names, "importance": classifier.feature_importances_}
        )

    # Fallback: SHAP for other models
    try:
        explainer = shap.Explainer(classifier, X_transformed)
        shap_values = explainer(X_transformed)
        mean_abs = np.abs(shap_values.values).mean(axis=0)
        return pd.DataFrame({"feature": feature_names, "importance": mean_abs})
    except Exception:
        return pd.DataFrame({"feature": feature_names, "importance": [0] * len(feature_names)})


def render_prediction_tab(artifact):
    """Render input form and prediction output."""
    feature_columns = artifact["feature_columns"]
    pipeline = artifact["pipeline"]
    model_name = artifact["model_name"]

    st.subheader("Applicant Information")
    col1, col2 = st.columns(2)

    inputs = {}
    with col1:
        inputs["age"] = st.number_input("Age", min_value=18, max_value=100, value=FEATURE_DEFAULTS["age"])
        inputs["income"] = st.number_input(
            "Annual Income ($)", min_value=0.0, value=FEATURE_DEFAULTS["income"], step=1000.0
        )
        inputs["debt_ratio"] = st.slider(
            "Debt Ratio", min_value=0.0, max_value=1.0, value=FEATURE_DEFAULTS["debt_ratio"], step=0.01
        )
        inputs["credit_history_months"] = st.number_input(
            "Credit History (months)",
            min_value=0,
            max_value=600,
            value=FEATURE_DEFAULTS["credit_history_months"],
        )
    with col2:
        inputs["num_accounts"] = st.number_input(
            "Number of Accounts", min_value=0, max_value=30, value=FEATURE_DEFAULTS["num_accounts"]
        )
        inputs["late_payments"] = st.number_input(
            "Late Payments (last 2 years)", min_value=0, max_value=20, value=FEATURE_DEFAULTS["late_payments"]
        )
        inputs["employment_years"] = st.number_input(
            "Employment Years", min_value=0, max_value=50, value=FEATURE_DEFAULTS["employment_years"]
        )
        inputs["loan_amount"] = st.number_input(
            "Loan Amount ($)", min_value=0.0, value=FEATURE_DEFAULTS["loan_amount"], step=500.0
        )

    input_df = pd.DataFrame([{col: inputs[col] for col in feature_columns}])

    if st.button("Predict Default Risk", type="primary"):
        proba = pipeline.predict_proba(input_df)[0]
        default_prob = float(proba[1])
        prediction = int(default_prob >= 0.5)

        st.markdown("### Prediction Result")
        m1, m2, m3 = st.columns(3)
        m1.metric("Default Probability", f"{default_prob:.1%}")
        m2.metric("Predicted Class", "Default" if prediction == 1 else "No Default")
        m3.metric("Risk Level", "High" if default_prob >= 0.5 else "Low")

        st.progress(min(default_prob, 1.0))

        importance_df = get_feature_importance(pipeline, model_name, input_df)
        importance_df = importance_df.sort_values("importance", ascending=True)

        fig, ax = plt.subplots(figsize=(8, 4))
        ax.barh(importance_df["feature"], importance_df["importance"], color="#4C78A8")
        ax.set_xlabel("Importance")
        ax.set_title(f"Feature Importance ({model_name})")
        plt.tight_layout()
        st.pyplot(fig)
        plt.close(fig)


def render_metrics_tab(metrics):
    """Render model comparison dashboard."""
    st.subheader("Model Performance Dashboard")

    if metrics is None:
        st.warning("Metrics file not found. Run `python src/train.py` first.")
        return

    st.info(
        f"**Best model:** {metrics['best_model']} | "
        f"**Samples:** {metrics['n_samples']} | "
        f"**Default rate:** {metrics['default_rate']:.1%}"
    )

    df = pd.DataFrame(metrics["models"])
    st.dataframe(df, use_container_width=True)

    metric_cols = ["accuracy", "precision", "recall", "f1", "roc_auc"]
    fig, ax = plt.subplots(figsize=(10, 5))
    x = np.arange(len(df))
    width = 0.15

    for i, metric in enumerate(metric_cols):
        ax.bar(x + i * width, df[metric], width, label=metric)

    ax.set_xticks(x + width * 2)
    ax.set_xticklabels(df["model"], rotation=15)
    ax.set_ylabel("Score")
    ax.set_title("Model Comparison on Test Set")
    ax.legend(loc="lower right")
    ax.set_ylim(0, 1.05)
    plt.tight_layout()
    st.pyplot(fig)
    plt.close(fig)


def main():
    st.set_page_config(page_title="Credit Scoring Model", page_icon="💳", layout="wide")
    st.title("💳 Credit Default Scoring MVP")
    st.caption("Educational demo using synthetic data — not for real lending decisions.")

    artifact = load_artifact()
    metrics = load_metrics()

    if artifact is None:
        st.error("Model not found. Run training first:\n\n`python src/train.py`")
        st.stop()

    tab_predict, tab_metrics = st.tabs(["Predict", "Metrics Dashboard"])

    with tab_predict:
        render_prediction_tab(artifact)

    with tab_metrics:
        render_metrics_tab(metrics)


if __name__ == "__main__":
    main()
# UI Iteration 1

# UI Iteration 2

# UI Iteration 3

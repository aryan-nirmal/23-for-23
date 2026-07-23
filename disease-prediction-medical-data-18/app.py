"""
Multi-Disease Screening Risk Prediction — Streamlit MVP
"""

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import shap
import streamlit as st

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parent
MODELS_DIR = PROJECT_ROOT / "models"

DISCLAIMER = """
⚠️ **MEDICAL DISCLAIMER**

This tool is for **educational and research purposes only**. It is **NOT** a
substitute for professional medical advice, diagnosis, or treatment. The models
were trained on **synthetic data** and have **not been clinically validated**.
Always consult a qualified healthcare provider for any health concerns.
**Do not make medical decisions based on this application.**
"""

# ---------------------------------------------------------------------------
# Disease configurations (feature labels for the UI)
# ---------------------------------------------------------------------------
DISEASE_UI = {
    "Diabetes": {
        "model_key": "diabetes",
        "description": "Type 2 diabetes screening risk based on glucose, BMI, and related vitals.",
        "features": {
            "pregnancies": {"label": "Pregnancies", "type": "number", "min": 0, "max": 20, "default": 1, "step": 1},
            "glucose": {"label": "Glucose (mg/dL)", "type": "number", "min": 70, "max": 300, "default": 120, "step": 1},
            "blood_pressure": {"label": "Blood Pressure (mm Hg)", "type": "number", "min": 50, "max": 130, "default": 80, "step": 1},
            "skin_thickness": {"label": "Skin Thickness (mm)", "type": "number", "min": 0, "max": 100, "default": 25, "step": 1},
            "insulin": {"label": "Insulin (μU/mL)", "type": "number", "min": 0, "max": 900, "default": 100, "step": 1},
            "bmi": {"label": "BMI", "type": "number", "min": 15, "max": 55, "default": 28.0, "step": 0.1},
            "age": {"label": "Age", "type": "number", "min": 18, "max": 85, "default": 45, "step": 1},
        },
    },
    "Heart Disease": {
        "model_key": "heart_disease",
        "description": "Coronary heart disease risk based on cardiac and metabolic indicators.",
        "features": {
            "age": {"label": "Age", "type": "number", "min": 29, "max": 80, "default": 55, "step": 1},
            "sex": {"label": "Sex (0=Female, 1=Male)", "type": "number", "min": 0, "max": 1, "default": 1, "step": 1},
            "cp": {"label": "Chest Pain Type (0–3)", "type": "number", "min": 0, "max": 3, "default": 1, "step": 1},
            "trestbps": {"label": "Resting BP (mm Hg)", "type": "number", "min": 90, "max": 200, "default": 130, "step": 1},
            "chol": {"label": "Serum Cholesterol (mg/dL)", "type": "number", "min": 120, "max": 400, "default": 240, "step": 1},
            "fbs": {"label": "Fasting BS > 120 mg/dL (0=No, 1=Yes)", "type": "number", "min": 0, "max": 1, "default": 0, "step": 1},
            "restecg": {"label": "Resting ECG (0–2)", "type": "number", "min": 0, "max": 2, "default": 1, "step": 1},
            "thalach": {"label": "Max Heart Rate", "type": "number", "min": 70, "max": 210, "default": 150, "step": 1},
            "exang": {"label": "Exercise Angina (0=No, 1=Yes)", "type": "number", "min": 0, "max": 1, "default": 0, "step": 1},
            "oldpeak": {"label": "ST Depression (oldpeak)", "type": "number", "min": 0.0, "max": 6.0, "default": 1.0, "step": 0.1},
            "slope": {"label": "ST Slope (0–2)", "type": "number", "min": 0, "max": 2, "default": 1, "step": 1},
            "ca": {"label": "Major Vessels (0–3)", "type": "number", "min": 0, "max": 3, "default": 0, "step": 1},
            "thal": {"label": "Thalassemia (1–3)", "type": "number", "min": 1, "max": 3, "default": 2, "step": 1},
        },
    },
    "Kidney Disease": {
        "model_key": "kidney_disease",
        "description": "Chronic kidney disease (CKD) screening risk from urinalysis and blood markers.",
        "features": {
            "age": {"label": "Age", "type": "number", "min": 2, "max": 80, "default": 50, "step": 1},
            "bp": {"label": "Blood Pressure (mm Hg)", "type": "number", "min": 50, "max": 180, "default": 80, "step": 1},
            "sg": {"label": "Specific Gravity", "type": "select", "options": [1.005, 1.010, 1.015, 1.020, 1.025], "default": 1.020},
            "al": {"label": "Albumin (0–5)", "type": "number", "min": 0, "max": 5, "default": 0, "step": 1},
            "su": {"label": "Sugar (0–5)", "type": "number", "min": 0, "max": 5, "default": 0, "step": 1},
            "rbc": {"label": "RBC (0=Normal, 1=Abnormal)", "type": "number", "min": 0, "max": 1, "default": 0, "step": 1},
            "pc": {"label": "Pus Cell (0=Normal, 1=Abnormal)", "type": "number", "min": 0, "max": 1, "default": 0, "step": 1},
            "pcc": {"label": "Pus Cell Clumps (0=No, 1=Yes)", "type": "number", "min": 0, "max": 1, "default": 0, "step": 1},
            "ba": {"label": "Bacteria (0=No, 1=Yes)", "type": "number", "min": 0, "max": 1, "default": 0, "step": 1},
            "bgr": {"label": "Blood Glucose Random (mg/dL)", "type": "number", "min": 70, "max": 500, "default": 140, "step": 1},
            "bu": {"label": "Blood Urea (mg/dL)", "type": "number", "min": 10, "max": 200, "default": 40, "step": 1},
            "sc": {"label": "Serum Creatinine (mg/dL)", "type": "number", "min": 0.4, "max": 15.0, "default": 1.2, "step": 0.1},
            "sod": {"label": "Sodium (mEq/L)", "type": "number", "min": 100, "max": 160, "default": 140, "step": 1},
            "pot": {"label": "Potassium (mEq/L)", "type": "number", "min": 2.5, "max": 7.0, "default": 4.0, "step": 0.1},
            "hemo": {"label": "Hemoglobin (g/dL)", "type": "number", "min": 3.0, "max": 18.0, "default": 13.0, "step": 0.1},
            "pcv": {"label": "Packed Cell Volume (%)", "type": "number", "min": 15, "max": 55, "default": 40, "step": 1},
            "wc": {"label": "White Blood Cell Count", "type": "number", "min": 2000, "max": 25000, "default": 8000, "step": 100},
            "rc": {"label": "Red Blood Cell Count (millions)", "type": "number", "min": 2.0, "max": 10.0, "default": 5.0, "step": 0.1},
            "htn": {"label": "Hypertension (0=No, 1=Yes)", "type": "number", "min": 0, "max": 1, "default": 0, "step": 1},
            "dm": {"label": "Diabetes Mellitus (0=No, 1=Yes)", "type": "number", "min": 0, "max": 1, "default": 0, "step": 1},
            "cad": {"label": "Coronary Artery Disease (0=No, 1=Yes)", "type": "number", "min": 0, "max": 1, "default": 0, "step": 1},
            "appet": {"label": "Appetite (0=Good, 1=Poor)", "type": "number", "min": 0, "max": 1, "default": 0, "step": 1},
            "pe": {"label": "Pedal Edema (0=No, 1=Yes)", "type": "number", "min": 0, "max": 1, "default": 0, "step": 1},
            "ane": {"label": "Anemia (0=No, 1=Yes)", "type": "number", "min": 0, "max": 1, "default": 0, "step": 1},
        },
    },
}


@st.cache_resource
def load_model(model_key: str):
    """Load a trained model from disk."""
    path = MODELS_DIR / f"{model_key}_model.joblib"
    if not path.exists():
        st.error(f"Model not found: {path}. Run `python src/train.py` first.")
        return None
    return joblib.load(path)


@st.cache_data
def load_metrics(model_key: str) -> dict:
    """Load model metadata/metrics."""
    path = MODELS_DIR / f"{model_key}_meta.json"
    if path.exists():
        with open(path) as f:
            return json.load(f)
    return {}


def render_input_form(features: dict) -> dict:
    """Render input widgets and return collected values."""
    values = {}
    cols = st.columns(2)
    for i, (key, cfg) in enumerate(features.items()):
        col = cols[i % 2]
        with col:
            if cfg["type"] == "select":
                values[key] = st.selectbox(
                    cfg["label"],
                    options=cfg["options"],
                    index=cfg["options"].index(cfg["default"]),
                    key=f"input_{key}",
                )
            else:
                values[key] = st.number_input(
                    cfg["label"],
                    min_value=cfg.get("min", 0),
                    max_value=cfg.get("max", 100),
                    value=cfg["default"],
                    step=cfg.get("step", 1),
                    key=f"input_{key}",
                )
    return values


def risk_label(probability: float) -> tuple[str, str]:
    """Return human-readable risk level and color."""
    if probability < 0.33:
        return "Low Risk", "green"
    elif probability < 0.66:
        return "Moderate Risk", "orange"
    else:
        return "High Risk", "red"


def render_shap_explanation(model, feature_names: list, input_df: pd.DataFrame):
    """Compute and display SHAP waterfall plot for a single prediction."""
    try:
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(input_df)

        st.subheader("SHAP Feature Explanation")
        st.caption("Shows which features pushed the prediction toward higher or lower risk.")

        fig, ax = plt.subplots(figsize=(8, 4))
        shap.waterfall_plot(
            shap.Explanation(
                values=shap_values[0],
                base_values=explainer.expected_value,
                data=input_df.iloc[0].values,
                feature_names=feature_names,
            ),
            max_display=10,
            show=False,
        )
        st.pyplot(fig)
        plt.close(fig)
    except Exception as e:
        st.warning(f"SHAP explanation unavailable: {e}")


# Lazy import matplotlib only when SHAP is needed
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


def render_disease_tab(disease_name: str, config: dict):
    """Render a single disease screening tab."""
    model_key = config["model_key"]
    model = load_model(model_key)
    if model is None:
        return

    metrics = load_metrics(model_key)
    st.markdown(config["description"])

    if metrics:
        with st.expander("Model Performance (test set)"):
            c1, c2, c3 = st.columns(3)
            c1.metric("Accuracy", f"{metrics.get('accuracy', 'N/A')}")
            c2.metric("F1 Score", f"{metrics.get('f1_score', 'N/A')}")
            c3.metric("ROC AUC", f"{metrics.get('roc_auc', 'N/A')}")

    st.divider()
    st.subheader("Enter Patient Vitals")

    values = render_input_form(config["features"])
    feature_names = list(config["features"].keys())
    input_df = pd.DataFrame([values], columns=feature_names)

    if st.button(f"Predict {disease_name} Risk", type="primary", key=f"predict_{model_key}"):
        prob = float(model.predict_proba(input_df)[0, 1])
        label, color = risk_label(prob)

        st.divider()
        st.subheader("Risk Assessment")

        col1, col2 = st.columns([1, 2])
        with col1:
            st.metric("Risk Probability", f"{prob * 100:.1f}%")
            st.markdown(
                f"<h3 style='color:{color};'>{label}</h3>",
                unsafe_allow_html=True,
            )
        with col2:
            st.progress(prob, text=f"{prob * 100:.1f}% likelihood of positive screening")

        render_shap_explanation(model, feature_names, input_df)


# ---------------------------------------------------------------------------
# Main app
# ---------------------------------------------------------------------------
def main():
    st.set_page_config(
        page_title="Disease Risk Screening",
        page_icon="🏥",
        layout="wide",
    )

    st.title("🏥 Multi-Disease Screening Risk Prediction")
    st.markdown(
        "An educational MVP that estimates screening risk for **Diabetes**, "
        "**Heart Disease**, and **Chronic Kidney Disease** using XGBoost models."
    )

    # Prominent medical disclaimer
    st.error(DISCLAIMER)

    tab_diabetes, tab_heart, tab_kidney = st.tabs(
        ["🩸 Diabetes", "❤️ Heart Disease", "🫘 Kidney Disease"]
    )

    with tab_diabetes:
        render_disease_tab("Diabetes", DISEASE_UI["Diabetes"])

    with tab_heart:
        render_disease_tab("Heart Disease", DISEASE_UI["Heart Disease"])

    with tab_kidney:
        render_disease_tab("Kidney Disease", DISEASE_UI["Kidney Disease"])

    st.divider()
    st.caption(
        "Built with XGBoost + SHAP | Synthetic training data | "
        "For educational use only."
    )


if __name__ == "__main__":
    main()
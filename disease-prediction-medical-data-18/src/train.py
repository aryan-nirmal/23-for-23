"""
Train XGBoost classifiers for diabetes, heart disease, and kidney disease
using synthetic screening datasets.
"""

import json
import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

# Project paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
MODELS_DIR = PROJECT_ROOT / "models"

RANDOM_STATE = 42
N_SAMPLES = 500


def generate_diabetes_data(n: int = N_SAMPLES, seed: int = RANDOM_STATE) -> pd.DataFrame:
    """Generate synthetic diabetes screening dataset."""
    rng = np.random.default_rng(seed)
    age = rng.integers(18, 85, n)
    bmi = rng.normal(28, 6, n).clip(15, 55)
    glucose = rng.normal(120, 35, n).clip(70, 300)
    blood_pressure = rng.normal(80, 12, n).clip(50, 130)
    insulin = rng.exponential(100, n).clip(0, 900)
    skin_thickness = rng.normal(25, 10, n).clip(0, 100)
    pregnancies = rng.integers(0, 8, n)

    # Risk score based on clinical heuristics
    risk = (
        0.03 * (glucose - 100)
        + 0.04 * (bmi - 25)
        + 0.02 * (age - 40)
        + 0.01 * insulin / 50
        + 0.5 * pregnancies
        + rng.normal(0, 1, n)
    )
    outcome = (risk > np.percentile(risk, 65)).astype(int)

    return pd.DataFrame(
        {
            "pregnancies": pregnancies,
            "glucose": glucose.round(1),
            "blood_pressure": blood_pressure.round(1),
            "skin_thickness": skin_thickness.round(1),
            "insulin": insulin.round(1),
            "bmi": bmi.round(1),
            "age": age,
            "outcome": outcome,
        }
    )


def generate_heart_disease_data(n: int = N_SAMPLES, seed: int = RANDOM_STATE) -> pd.DataFrame:
    """Generate synthetic heart disease screening dataset."""
    rng = np.random.default_rng(seed + 1)
    age = rng.integers(29, 80, n)
    sex = rng.integers(0, 2, n)
    cp = rng.integers(0, 4, n)  # chest pain type
    trestbps = rng.normal(130, 18, n).clip(90, 200)
    chol = rng.normal(240, 50, n).clip(120, 400)
    fbs = (rng.random(n) < 0.15).astype(int)  # fasting blood sugar > 120
    restecg = rng.integers(0, 3, n)
    thalach = rng.normal(150, 25, n).clip(70, 210)
    exang = (rng.random(n) < 0.3).astype(int)
    oldpeak = rng.exponential(1.0, n).clip(0, 6)
    slope = rng.integers(0, 3, n)
    ca = rng.integers(0, 4, n)
    thal = rng.integers(1, 4, n)

    risk = (
        0.04 * (age - 50)
        + 0.5 * cp
        + 0.02 * (trestbps - 120)
        + 0.015 * (chol - 200)
        + 1.2 * fbs
        + 0.8 * exang
        + 0.6 * oldpeak
        + 0.4 * ca
        + (1 - sex) * 0.3
        - 0.02 * (thalach - 140)
        + rng.normal(0, 1, n)
    )
    target = (risk > np.percentile(risk, 60)).astype(int)

    return pd.DataFrame(
        {
            "age": age,
            "sex": sex,
            "cp": cp,
            "trestbps": trestbps.round(1),
            "chol": chol.round(1),
            "fbs": fbs,
            "restecg": restecg,
            "thalach": thalach.round(1),
            "exang": exang,
            "oldpeak": oldpeak.round(2),
            "slope": slope,
            "ca": ca,
            "thal": thal,
            "target": target,
        }
    )


def generate_kidney_disease_data(n: int = N_SAMPLES, seed: int = RANDOM_STATE) -> pd.DataFrame:
    """Generate synthetic chronic kidney disease screening dataset."""
    rng = np.random.default_rng(seed + 2)
    age = rng.integers(2, 80, n)
    bp = rng.normal(80, 15, n).clip(50, 180)
    sg = rng.choice([1.005, 1.010, 1.015, 1.020, 1.025], n)
    al = rng.integers(0, 6, n)  # albumin
    su = rng.integers(0, 6, n)  # sugar
    rbc = rng.integers(0, 2, n)  # normal/abnormal
    pc = rng.integers(0, 2, n)  # pus cell
    pcc = rng.integers(0, 2, n)
    ba = rng.integers(0, 2, n)
    bgr = rng.normal(140, 50, n).clip(70, 500)
    bu = rng.normal(40, 30, n).clip(10, 200)  # blood urea
    sc = rng.exponential(1.5, n).clip(0.4, 15)  # serum creatinine
    sod = rng.normal(140, 8, n).clip(100, 160)
    pot = rng.normal(4.0, 0.8, n).clip(2.5, 7.0)
    hemo = rng.normal(13, 2.5, n).clip(3, 18)
    pcv = rng.normal(40, 8, n).clip(15, 55)
    wc = rng.normal(8000, 3000, n).clip(2000, 25000)
    rc = rng.normal(5.0, 1.5, n).clip(2, 10)
    htn = (rng.random(n) < 0.35).astype(int)
    dm = (rng.random(n) < 0.3).astype(int)
    cad = (rng.random(n) < 0.1).astype(int)
    appet = rng.integers(0, 2, n)
    pe = (rng.random(n) < 0.2).astype(int)
    ane = (rng.random(n) < 0.25).astype(int)

    risk = (
        0.03 * (age - 40)
        + 0.8 * al
        + 0.6 * su
        + 1.5 * rbc
        + 1.2 * pc
        + 0.02 * (bu - 30)
        + 1.5 * (sc - 1.0)
        - 0.3 * (hemo - 12)
        + 1.0 * htn
        + 1.2 * dm
        + 0.8 * ane
        + rng.normal(0, 1, n)
    )
    classification = (risk > np.percentile(risk, 62)).astype(int)

    return pd.DataFrame(
        {
            "age": age,
            "bp": bp.round(1),
            "sg": sg,
            "al": al,
            "su": su,
            "rbc": rbc,
            "pc": pc,
            "pcc": pcc,
            "ba": ba,
            "bgr": bgr.round(1),
            "bu": bu.round(1),
            "sc": sc.round(2),
            "sod": sod.round(1),
            "pot": pot.round(2),
            "hemo": hemo.round(2),
            "pcv": pcv.round(1),
            "wc": wc.round(0),
            "rc": rc.round(2),
            "htn": htn,
            "dm": dm,
            "cad": cad,
            "appet": appet,
            "pe": pe,
            "ane": ane,
            "classification": classification,
        }
    )


DISEASE_CONFIG = {
    "diabetes": {
        "generator": generate_diabetes_data,
        "target": "outcome",
        "features": [
            "pregnancies",
            "glucose",
            "blood_pressure",
            "skin_thickness",
            "insulin",
            "bmi",
            "age",
        ],
    },
    "heart_disease": {
        "generator": generate_heart_disease_data,
        "target": "target",
        "features": [
            "age",
            "sex",
            "cp",
            "trestbps",
            "chol",
            "fbs",
            "restecg",
            "thalach",
            "exang",
            "oldpeak",
            "slope",
            "ca",
            "thal",
        ],
    },
    "kidney_disease": {
        "generator": generate_kidney_disease_data,
        "target": "classification",
        "features": [
            "age",
            "bp",
            "sg",
            "al",
            "su",
            "rbc",
            "pc",
            "pcc",
            "ba",
            "bgr",
            "bu",
            "sc",
            "sod",
            "pot",
            "hemo",
            "pcv",
            "wc",
            "rc",
            "htn",
            "dm",
            "cad",
            "appet",
            "pe",
            "ane",
        ],
    },
}


def train_disease_model(name: str, config: dict) -> dict:
    """Generate data, train XGBoost, and save artifacts."""
    print(f"\n{'=' * 50}")
    print(f"Training model: {name}")
    print(f"{'=' * 50}")

    df = config["generator"]()
    target_col = config["target"]
    feature_cols = config["features"]

    # Save dataset
    csv_path = DATA_DIR / f"{name}.csv"
    df.to_csv(csv_path, index=False)
    print(f"Saved dataset: {csv_path} ({len(df)} rows)")

    X = df[feature_cols]
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )

    model = XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=RANDOM_STATE,
        eval_metric="logloss",
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    metrics = {
        "disease": name,
        "n_samples": len(df),
        "n_features": len(feature_cols),
        "feature_names": feature_cols,
        "target_column": target_col,
        "train_size": len(X_train),
        "test_size": len(X_test),
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "f1_score": round(float(f1_score(y_test, y_pred)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, y_prob)), 4),
        "positive_rate": round(float(y.mean()), 4),
        "classification_report": classification_report(y_test, y_pred, output_dict=True),
    }

    # Save model and metadata
    model_path = MODELS_DIR / f"{name}_model.joblib"
    joblib.dump(model, model_path)
    print(f"Saved model: {model_path}")

    meta_path = MODELS_DIR / f"{name}_meta.json"
    meta = {k: v for k, v in metrics.items() if k != "classification_report"}
    meta["classification_report"] = metrics["classification_report"]
    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"Saved metadata: {meta_path}")

    print(f"Accuracy: {metrics['accuracy']:.4f}")
    print(f"F1 Score: {metrics['f1_score']:.4f}")
    print(f"ROC AUC:  {metrics['roc_auc']:.4f}")

    return metrics


def main():
    """Train all disease models and save summary metrics."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    all_metrics = []
    for name, config in DISEASE_CONFIG.items():
        metrics = train_disease_model(name, config)
        all_metrics.append(metrics)

    summary_path = MODELS_DIR / "training_summary.json"
    summary = {
        "models_trained": len(all_metrics),
        "random_state": RANDOM_STATE,
        "samples_per_disease": N_SAMPLES,
        "results": [
            {
                "disease": m["disease"],
                "accuracy": m["accuracy"],
                "f1_score": m["f1_score"],
                "roc_auc": m["roc_auc"],
                "positive_rate": m["positive_rate"],
            }
            for m in all_metrics
        ],
    }
    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)

    print(f"\n{'=' * 50}")
    print("TRAINING COMPLETE")
    print(f"{'=' * 50}")
    print(f"Summary saved to: {summary_path}")
    for m in all_metrics:
        print(
            f"  {m['disease']:20s} | Acc: {m['accuracy']:.4f} | "
            f"F1: {m['f1_score']:.4f} | AUC: {m['roc_auc']:.4f}"
        )


if __name__ == "__main__":
    main()
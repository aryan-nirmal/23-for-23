# Multi-Disease Screening Risk Prediction

An educational MVP that predicts screening risk for **Diabetes**, **Heart Disease**, and **Chronic Kidney Disease** using XGBoost classifiers trained on synthetic data. Includes a Streamlit web app with SHAP-based feature explanations.

> ⚠️ **This is NOT a medical device.** Models are trained on synthetic data and are not clinically validated. Do not use for real medical decisions.

## Features

- Three disease-specific XGBoost models (500 synthetic samples each)
- Streamlit UI with per-disease input forms
- Risk probability score with Low / Moderate / High classification
- SHAP waterfall plots explaining individual predictions
- Prominent medical disclaimer

## Project Structure

```
disease-prediction-medical-data-18/
├── app.py                  # Streamlit web application
├── requirements.txt        # Python dependencies
├── README.md
├── src/
│   └── train.py            # Data generation + model training
├── data/                   # Generated CSV datasets (after training)
│   ├── diabetes.csv
│   ├── heart_disease.csv
│   └── kidney_disease.csv
└── models/                 # Saved models and metrics (after training)
    ├── diabetes_model.joblib
    ├── heart_disease_model.joblib
    ├── kidney_disease_model.joblib
    └── training_summary.json
```

## Setup

```bash
# Clone or navigate to the project directory
cd disease-prediction-medical-data-18

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate   # macOS/Linux
# venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

## Train Models

```bash
python src/train.py
```

This will:
1. Generate 500-row synthetic datasets for each disease
2. Train XGBoost classifiers (80/20 train/test split)
3. Save models to `models/`
4. Save datasets to `data/`
5. Print accuracy, F1, and ROC AUC metrics

## Run the App

```bash
streamlit run app.py
```

Open the URL shown in the terminal (typically `http://localhost:8501`).

## Disease Models

| Disease        | Key Features                                      | Target Column    |
|----------------|---------------------------------------------------|------------------|
| Diabetes       | Glucose, BMI, insulin, age, blood pressure        | `outcome`        |
| Heart Disease  | Age, cholesterol, chest pain, max heart rate      | `target`         |
| Kidney Disease | Creatinine, hemoglobin, albumin, hypertension       | `classification` |

## Tech Stack

- **pandas** / **numpy** — data handling
- **scikit-learn** — train/test split, metrics
- **XGBoost** — gradient boosting classifiers
- **SHAP** — model explainability
- **Streamlit** — web UI
- **joblib** — model serialization

## License

Educational use only. Not intended for clinical deployment.
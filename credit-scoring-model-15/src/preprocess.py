"""Preprocessing pipeline for credit scoring features."""

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

FEATURE_COLUMNS = [
    "age",
    "income",
    "debt_ratio",
    "credit_history_months",
    "num_accounts",
    "late_payments",
    "employment_years",
    "loan_amount",
]


def get_feature_columns():
    """Return ordered feature column names."""
    return FEATURE_COLUMNS.copy()


def build_preprocessor():
    """Build sklearn preprocessing pipeline for numeric features."""
    numeric_transformer = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, FEATURE_COLUMNS),
        ],
        remainder="drop",
    )

    return preprocessor


def build_model_pipeline(estimator):
    """Wrap an estimator with the preprocessing pipeline."""
    return Pipeline(
        steps=[
            ("preprocessor", build_preprocessor()),
            ("classifier", estimator),
        ]
    )
"""Train a RandomForest emotion classifier on synthetic MFCC features."""

import os
import sys

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from features import EMOTIONS, N_MFCC

FEATURE_DIM = N_MFCC * 2  # mean + std per coefficient
SAMPLES_PER_CLASS = 200
RANDOM_STATE = 42

# Emotion-specific MFCC profile centers (synthetic priors)
EMOTION_PROFILES = {
    "happy":     {"mean_shift":  2.0, "std_scale": 0.8, "noise": 0.5},
    "sad":       {"mean_shift": -1.5, "std_scale": 1.2, "noise": 0.4},
    "angry":     {"mean_shift":  1.0, "std_scale": 1.5, "noise": 0.7},
    "neutral":   {"mean_shift":  0.0, "std_scale": 1.0, "noise": 0.3},
    "fearful":   {"mean_shift": -0.5, "std_scale": 1.3, "noise": 0.6},
    "surprised": {"mean_shift":  1.5, "std_scale": 0.9, "noise": 0.5},
}


def generate_synthetic_features(
    n_samples: int = SAMPLES_PER_CLASS,
    random_state: int = RANDOM_STATE,
) -> tuple[np.ndarray, np.ndarray]:
    """Generate synthetic MFCC feature vectors for each emotion class."""
    rng = np.random.default_rng(random_state)
    X, y = [], []

    base_profile = rng.standard_normal(FEATURE_DIM)

    for label_idx, emotion in enumerate(EMOTIONS):
        profile = EMOTION_PROFILES[emotion]
        for _ in range(n_samples):
            features = base_profile.copy()

            # Apply emotion-specific transformations to mean half
            features[:N_MFCC] += profile["mean_shift"]
            features[:N_MFCC] += rng.normal(0, profile["noise"], N_MFCC)

            # Apply emotion-specific transformations to std half
            features[N_MFCC:] *= profile["std_scale"]
            features[N_MFCC:] += rng.normal(0, profile["noise"] * 0.5, N_MFCC)

            # Global noise
            features += rng.normal(0, 0.2, FEATURE_DIM)

            X.append(features)
            y.append(label_idx)

    return np.array(X), np.array(y)


def train_model() -> RandomForestClassifier:
    """Train and evaluate the emotion classifier."""
    print("Generating synthetic MFCC features...")
    X, y = generate_synthetic_features()
    print(f"  Dataset: {X.shape[0]} samples, {X.shape[1]} features, {len(EMOTIONS)} classes")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )

    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=RANDOM_STATE,
        n_jobs=-1,
    )

    print("Training RandomForest classifier...")
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nTest Accuracy: {accuracy:.2%}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=EMOTIONS))

    return clf


def main():
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_dir = os.path.join(project_root, "models")
    model_path = os.path.join(model_dir, "emotion_model.joblib")

    os.makedirs(model_dir, exist_ok=True)

    model = train_model()

    joblib.dump(
        {
            "model": model,
            "emotions": EMOTIONS,
            "feature_dim": FEATURE_DIM,
            "n_mfcc": N_MFCC,
        },
        model_path,
    )
    print(f"\nModel saved to: {model_path}")


if __name__ == "__main__":
    main()
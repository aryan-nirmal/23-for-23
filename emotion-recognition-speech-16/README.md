# Speech Emotion Recognition

An MVP for classifying speech emotions from audio using MFCC features and a RandomForest classifier.

## Emotions

| Emotion   | Description              |
|-----------|--------------------------|
| Happy     | Joyful, upbeat speech    |
| Sad       | Low energy, melancholic  |
| Angry     | Intense, aggressive tone |
| Neutral   | Calm, baseline speech    |
| Fearful   | Anxious, trembling tone  |
| Surprised | Sudden, high-pitched     |

## Project Structure

```
emotion-recognition-speech-16/
├── app.py                  # Streamlit web interface
├── requirements.txt        # Python dependencies
├── README.md
├── models/
│   └── emotion_model.joblib
└── src/
    ├── features.py         # MFCC extraction utilities
    └── train.py            # Model training script
```

## Setup

```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

## Training

Train the RandomForest classifier on synthetic MFCC features:

```bash
python src/train.py
```

This generates 200 synthetic samples per emotion class, trains the model, prints evaluation metrics, and saves the model to `models/emotion_model.joblib`.

## Running the App

```bash
streamlit run app.py
```

Open the URL shown in the terminal (default: http://localhost:8501).

### Features

- **Upload Audio**: Upload WAV, MP3, FLAC, or other audio files
- **Demo Generator**: Generate synthetic audio for each emotion class
- **Predictions**: View predicted emotion with confidence score
- **Probability Bars**: See probability distribution across all 6 emotions

## How It Works

1. **Feature Extraction** (`src/features.py`): Audio is converted to 13 MFCC coefficients. Mean and standard deviation across time frames produce a 26-dimensional feature vector.

2. **Training** (`src/train.py`): Synthetic MFCC features are generated with emotion-specific profiles, then a RandomForest classifier is trained and evaluated.

3. **Inference** (`app.py`): Uploaded or generated audio is processed through the same MFCC pipeline, and the trained model predicts the most likely emotion.

## Limitations

This is an MVP trained on **synthetic data**. For real-world accuracy, retrain on labeled datasets such as:

- [RAVDESS](https://zenodo.org/record/1188976)
- [CREMA-D](https://github.com/CheyneyComputerScience/CREMA-D)
- [TESS](https://www.kaggle.com/datasets/ejlok1/toronto-emotional-speech-set-tess)

## Requirements

- Python 3.9+
- See `requirements.txt` for package versions
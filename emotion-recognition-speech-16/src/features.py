"""MFCC feature extraction utilities for speech emotion recognition."""

import numpy as np
import librosa


EMOTIONS = ["happy", "sad", "angry", "neutral", "fearful", "surprised"]

N_MFCC = 13
SAMPLE_RATE = 22050
HOP_LENGTH = 512


def extract_mfcc(audio: np.ndarray, sr: int = SAMPLE_RATE) -> np.ndarray:
    """
    Extract MFCC features from an audio signal.

    Returns a 1D feature vector (mean + std of each MFCC coefficient).
    """
    if audio.ndim > 1:
        audio = librosa.to_mono(audio)

    mfccs = librosa.feature.mfcc(
        y=audio.astype(np.float32),
        sr=sr,
        n_mfcc=N_MFCC,
        hop_length=HOP_LENGTH,
    )

    mfcc_mean = np.mean(mfccs, axis=1)
    mfcc_std = np.std(mfccs, axis=1)
    return np.concatenate([mfcc_mean, mfcc_std])


def extract_mfcc_from_file(file_path: str) -> np.ndarray:
    """Load audio from file and extract MFCC features."""
    audio, sr = librosa.load(file_path, sr=SAMPLE_RATE, mono=True)
    return extract_mfcc(audio, sr)


def extract_mfcc_from_bytes(audio_bytes: bytes) -> np.ndarray:
    """Load audio from bytes and extract MFCC features."""
    import io
    import soundfile as sf

    audio, sr = sf.read(io.BytesIO(audio_bytes))
    if sr != SAMPLE_RATE:
        audio = librosa.resample(audio, orig_sr=sr, target_sr=SAMPLE_RATE)
    return extract_mfcc(audio, SAMPLE_RATE)
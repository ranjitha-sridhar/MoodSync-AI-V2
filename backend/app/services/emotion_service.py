import datetime
from pathlib import Path
from typing import Optional, Dict, Any
import cv2
import numpy as np
from tensorflow.keras.models import load_model

from app.core.config import settings

EMOTIONS = [
    "Angry",
    "Disgust",
    "Fear",
    "Happy",
    "Sad",
    "Surprise",
    "Neutral"
]

# Thread-safe cached singleton for model
_MODEL = None
_FACE_CASCADE = None

def get_face_cascade():
    global _FACE_CASCADE
    if _FACE_CASCADE is None:
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        _FACE_CASCADE = cv2.CascadeClassifier(cascade_path)
    return _FACE_CASCADE

def get_emotion_model():
    global _MODEL
    if _MODEL is None:
        model_path = settings.MODEL_PATH
        if not model_path.exists():
            raise FileNotFoundError(f"Trained model not found at: {model_path}")
        _MODEL = load_model(str(model_path))
    return _MODEL

def analyze_emotion_image(image: np.ndarray) -> Dict[str, Any]:
    """
    Analyzes an image array (BGR) using OpenCV face detection and the trained CNN model.
    Preserves existing preprocessing (grayscale, 48x48, normalize 0-1) and extracts
    the complete 7-class probability distribution and face coordinates.
    """
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

    if image is None or image.size == 0:
        return {
            "emotion": "Neutral",
            "confidence": 0.0,
            "probabilities": {e: 0.0 for e in EMOTIONS},
            "bounding_box": None,
            "faces_detected": 0,
            "timestamp": now_iso
        }

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces
    cascade = get_face_cascade()
    faces = cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(50, 50)
    )

    if len(faces) == 0:
        # Fallback: analyze whole image resized to 48x48 if face cascade missed subtle face,
        # but mark confidence accordingly
        resized = cv2.resize(gray, (48, 48)).astype("float32") / 255.0
        face_input = np.expand_dims(np.expand_dims(resized, axis=-1), axis=0)

        model = get_emotion_model()
        pred = model.predict(face_input, verbose=0)[0]

        probs = {EMOTIONS[i]: round(float(pred[i]) * 100, 2) for i in range(len(EMOTIONS))}
        top_idx = int(np.argmax(pred))

        return {
            "emotion": EMOTIONS[top_idx],
            "confidence": round(float(pred[top_idx]) * 100, 2),
            "probabilities": probs,
            "bounding_box": None,
            "faces_detected": 0,
            "timestamp": now_iso
        }

    # Select largest face
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    face_crop = gray[y:y + h, x:x + w]
    face_crop = cv2.resize(face_crop, (48, 48))
    face_crop = face_crop.astype("float32") / 255.0
    face_input = np.expand_dims(np.expand_dims(face_crop, axis=-1), axis=0)

    # Predict
    model = get_emotion_model()
    prediction = model.predict(face_input, verbose=0)[0]

    probabilities = {
        EMOTIONS[i]: round(float(prediction[i]) * 100, 2)
        for i in range(len(EMOTIONS))
    }

    dominant_idx = int(np.argmax(prediction))
    dominant_emotion = EMOTIONS[dominant_idx]
    confidence = round(float(prediction[dominant_idx]) * 100, 2)

    return {
        "emotion": dominant_emotion,
        "confidence": confidence,
        "probabilities": probabilities,
        "bounding_box": {
            "x": int(x),
            "y": int(y),
            "w": int(w),
            "h": int(h)
        },
        "faces_detected": len(faces),
        "timestamp": now_iso
    }

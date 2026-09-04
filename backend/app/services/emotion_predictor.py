from pathlib import Path

import cv2
import numpy as np
from tensorflow.keras.models import load_model


BACKEND_ROOT = Path(__file__).resolve().parents[2]

MODEL_PATH = BACKEND_ROOT / "ml" / "notebooks" / "emotion_model.keras"

model = load_model(MODEL_PATH)


EMOTIONS = [
    "Angry",
    "Disgust",
    "Fear",
    "Happy",
    "Sad",
    "Surprise",
    "Neutral"
]


# OpenCV face detector
FACE_CASCADE = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)


def predict_emotion(image):

    if image is None:
        return {
            "emotion": "Neutral",
            "confidence": 0
        }


    # Convert image to grayscale
    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )


    # Detect faces
    faces = FACE_CASCADE.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(50, 50)
    )


    # No face detected
    if len(faces) == 0:

        return {
            "emotion": "Neutral",
            "confidence": 0
        }


    # Select largest face
    x, y, w, h = max(
        faces,
        key=lambda face: face[2] * face[3]
    )


    # Crop face
    face = gray[
        y:y + h,
        x:x + w
    ]


    # Resize to model input
    face = cv2.resize(
        face,
        (48, 48)
    )


    # Normalize
    face = face.astype("float32") / 255.0


    # Shape:
    # (48,48)
    # ->
    # (1,48,48,1)

    face = np.expand_dims(
        face,
        axis=-1
    )

    face = np.expand_dims(
        face,
        axis=0
    )


    # Prediction
    prediction = model.predict(
        face,
        verbose=0
    )[0]


    emotion_index = np.argmax(
        prediction
    )


    confidence = (
        float(prediction[emotion_index])
        * 100
    )


    return {

        "emotion":
            EMOTIONS[emotion_index],

        "confidence":
            round(confidence, 2)

    }
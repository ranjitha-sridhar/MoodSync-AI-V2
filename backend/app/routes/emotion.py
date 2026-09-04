from fastapi import APIRouter, UploadFile, File

import cv2
import numpy as np

from app.services.emotion_predictor import predict_emotion


router = APIRouter(
    prefix="/emotion",
    tags=["Emotion"]
)


@router.post("/detect")
async def detect_emotion(
    file: UploadFile = File(...)
):
    image_bytes = await file.read()

    np_image = np.frombuffer(image_bytes, np.uint8)

    image = cv2.imdecode(
        np_image,
        cv2.IMREAD_COLOR
    )

    if image is None:
        return {
            "emotion": "unknown",
            "confidence": 0
        }

    return predict_emotion(image)
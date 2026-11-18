import json
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
import cv2
import numpy as np
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, get_current_user_optional
from app.models.user import User
from app.models.emotion_record import EmotionRecord
from app.services.emotion_service import analyze_emotion_image
from app.schemas.emotion import (
    EmotionDetectionResult,
    EmotionRecordCreate,
    EmotionRecordResponse
)

router = APIRouter(prefix="/emotion", tags=["Emotion Detection"])

@router.post("/detect", response_model=EmotionDetectionResult)
async def detect_emotion(file: UploadFile = File(...)):
    """
    Accepts an image file (from live webcam snapshot or file upload),
    detects faces via OpenCV, runs CNN inference, and returns 7-class probability distribution.
    No facial images are stored by this endpoint.
    """
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image file received")

    np_image = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

    if image is None:
        raise HTTPException(status_code=400, detail="Failed to decode image format")

    result = analyze_emotion_image(image)
    return result

@router.post("/save", response_model=EmotionRecordResponse, status_code=status.HTTP_201_CREATED)
def save_emotion_record(
    record_in: EmotionRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Saves an emotion detection result to the authenticated user's persistent mood history.
    Checks user's privacy preference (save_history_enabled).
    """
    if not current_user.save_history_enabled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Mood history logging is disabled in your privacy settings"
        )

    probs_str = json.dumps(record_in.probabilities) if record_in.probabilities else None

    record = EmotionRecord(
        user_id=current_user.id,
        emotion=record_in.emotion,
        confidence=record_in.confidence,
        probabilities=probs_str,
        method=record_in.method,
        note=record_in.note,
        song_title=record_in.song_title,
        song_artist=record_in.song_artist
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

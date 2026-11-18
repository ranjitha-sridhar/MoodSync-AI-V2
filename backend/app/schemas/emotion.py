from typing import Dict, Optional, List
from datetime import datetime
from pydantic import BaseModel

class FaceBoundingBox(BaseModel):
    x: int
    y: int
    w: int
    h: int

class EmotionDetectionResult(BaseModel):
    emotion: str
    confidence: float
    probabilities: Dict[str, float]
    bounding_box: Optional[FaceBoundingBox] = None
    faces_detected: int = 1
    timestamp: str

class EmotionRecordCreate(BaseModel):
    emotion: str
    confidence: float
    probabilities: Optional[Dict[str, float]] = None
    method: str = "webcam"
    note: Optional[str] = None
    song_title: Optional[str] = None
    song_artist: Optional[str] = None

class EmotionRecordResponse(BaseModel):
    id: int
    user_id: int
    emotion: str
    confidence: float
    probabilities: Optional[str] = None
    method: str
    note: Optional[str] = None
    song_title: Optional[str] = None
    song_artist: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

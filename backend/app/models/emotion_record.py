from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class EmotionRecord(Base):
    __tablename__ = "emotion_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    emotion = Column(String(50), nullable=False, index=True)
    confidence = Column(Float, nullable=False)
    probabilities = Column(Text, nullable=True)  # JSON string of all 7 emotion probabilities
    method = Column(String(50), default="webcam")  # 'webcam' or 'upload'
    note = Column(Text, nullable=True)
    song_title = Column(String(200), nullable=True)
    song_artist = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="emotion_records")

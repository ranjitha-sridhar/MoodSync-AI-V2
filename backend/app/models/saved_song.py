from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class SavedSong(Base):
    __tablename__ = "saved_songs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    artist = Column(String(200), nullable=False)
    video_id = Column(String(100), nullable=True)
    emotion_tag = Column(String(50), nullable=True)
    genre = Column(String(100), nullable=True)
    playlist_name = Column(String(100), default="Favorites")
    is_liked = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_songs")

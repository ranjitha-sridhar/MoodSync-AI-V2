from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    preferred_genres = Column(String(500), default="Pop,Lo-Fi,Acoustic,Ambient")
    theme = Column(String(50), default="dark")
    save_history_enabled = Column(Boolean, default=True)
    notifications_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    emotion_records = relationship("EmotionRecord", back_populates="user", cascade="all, delete-orphan")
    mood_journals = relationship("MoodJournal", back_populates="user", cascade="all, delete-orphan")
    saved_songs = relationship("SavedSong", back_populates="user", cascade="all, delete-orphan")

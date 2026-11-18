from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class SongItem(BaseModel):
    id: Optional[str] = None
    title: str
    artist: str
    videoId: Optional[str] = None
    genre: Optional[str] = "Pop"
    emotion: Optional[str] = "Neutral"
    mood_category: Optional[str] = "Balanced"  # Relaxing, Energetic, Focus, Uplifting

class MusicRecommendationResponse(BaseModel):
    primary_song: SongItem
    playlist: List[SongItem]
    emotion: str
    energy_profile: str
    suggested_genres: List[str]

class SavedSongCreate(BaseModel):
    title: str
    artist: str
    video_id: Optional[str] = None
    emotion_tag: Optional[str] = None
    genre: Optional[str] = None
    playlist_name: Optional[str] = "Favorites"

class SavedSongResponse(BaseModel):
    id: int
    user_id: int
    title: str
    artist: str
    video_id: Optional[str] = None
    emotion_tag: Optional[str] = None
    genre: Optional[str] = None
    playlist_name: str
    is_liked: bool
    created_at: datetime

    class Config:
        from_attributes = True

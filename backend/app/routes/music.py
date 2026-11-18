from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_optional, get_current_user
from app.models.user import User
from app.models.saved_song import SavedSong
from app.services.music_service import (
    CURATED_MUSIC_CATALOG,
    get_recommendations_for_emotion
)
from app.schemas.music import (
    MusicRecommendationResponse,
    SavedSongCreate,
    SavedSongResponse
)

router = APIRouter(prefix="/music", tags=["Music Engine"])

@router.get("/recommend/{emotion}")
def recommend_music(
    emotion: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Recommends songs based on emotion.
    If authenticated, personalizes recommendations using user's preferred genres and liked songs.
    Also returns the legacy song structure for backward compatibility.
    """
    user_genres = current_user.preferred_genres if current_user else None
    liked_titles = []
    if current_user:
        saved = db.query(SavedSong.title).filter(
            SavedSong.user_id == current_user.id,
            SavedSong.is_liked == True
        ).all()
        liked_titles = [s[0] for s in saved]

    rec = get_recommendations_for_emotion(emotion, user_genres, liked_titles)
    primary = rec["primary_song"]

    # Hybrid response: includes root keys 'title', 'artist', 'videoId' for existing frontend,
    # plus full recommendation payload for the upgraded music studio.
    return {
        "title": primary["title"],
        "artist": primary["artist"],
        "videoId": primary["videoId"],
        "genre": primary.get("genre", "Pop"),
        "mood_category": primary.get("mood_category", "Balanced"),
        "playlist": rec["playlist"],
        "energy_profile": rec["energy_profile"],
        "suggested_genres": rec["suggested_genres"]
    }

@router.get("/catalog")
def get_music_catalog():
    """Returns the full emotion-categorized music directory."""
    return CURATED_MUSIC_CATALOG

@router.get("/saved", response_model=List[SavedSongResponse])
def get_user_saved_songs(
    playlist: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(SavedSong).filter(SavedSong.user_id == current_user.id)
    if playlist:
        query = query.filter(SavedSong.playlist_name == playlist)
    return query.order_by(SavedSong.created_at.desc()).all()

@router.post("/saved", response_model=SavedSongResponse, status_code=status.HTTP_201_CREATED)
def save_song(
    song_in: SavedSongCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if already saved in playlist
    existing = db.query(SavedSong).filter(
        SavedSong.user_id == current_user.id,
        SavedSong.title == song_in.title,
        SavedSong.artist == song_in.artist,
        SavedSong.playlist_name == (song_in.playlist_name or "Favorites")
    ).first()

    if existing:
        return existing

    song = SavedSong(
        user_id=current_user.id,
        title=song_in.title,
        artist=song_in.artist,
        video_id=song_in.video_id,
        emotion_tag=song_in.emotion_tag,
        genre=song_in.genre,
        playlist_name=song_in.playlist_name or "Favorites",
        is_liked=True
    )
    db.add(song)
    db.commit()
    db.refresh(song)
    return song

@router.delete("/saved/{song_id}", status_code=status.HTTP_200_OK)
def remove_saved_song(
    song_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    song = db.query(SavedSong).filter(
        SavedSong.id == song_id,
        SavedSong.user_id == current_user.id
    ).first()

    if not song:
        raise HTTPException(status_code=404, detail="Saved song not found")

    db.delete(song)
    db.commit()
    return {"message": "Song removed from your library"}

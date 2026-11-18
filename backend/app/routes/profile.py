import json
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, verify_password, get_password_hash
from app.models.user import User
from app.models.emotion_record import EmotionRecord
from app.models.journal import MoodJournal
from app.models.saved_song import SavedSong
from app.schemas.auth import UserResponse, PasswordChangeRequest
from app.schemas.profile import ProfileUpdate

router = APIRouter(prefix="/profile", tags=["User Profile & Settings"])

@router.get("", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("", response_model=UserResponse)
def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_in.name is not None:
        current_user.name = profile_in.name.strip()
    if profile_in.avatar_url is not None:
        current_user.avatar_url = profile_in.avatar_url
    if profile_in.preferred_genres is not None:
        current_user.preferred_genres = profile_in.preferred_genres
    if profile_in.theme is not None:
        current_user.theme = profile_in.theme
    if profile_in.save_history_enabled is not None:
        current_user.save_history_enabled = profile_in.save_history_enabled
    if profile_in.notifications_enabled is not None:
        current_user.notifications_enabled = profile_in.notifications_enabled

    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/change-password")
def change_password(
    data: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    if len(data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters"
        )
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

@router.get("/export-data")
def export_user_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """GDPR-compliant export of all personal user data and activity logs."""
    emotion_records = db.query(EmotionRecord).filter(EmotionRecord.user_id == current_user.id).all()
    journals = db.query(MoodJournal).filter(MoodJournal.user_id == current_user.id).all()
    saved_songs = db.query(SavedSong).filter(SavedSong.user_id == current_user.id).all()

    payload = {
        "user_profile": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "preferred_genres": current_user.preferred_genres,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None
        },
        "emotion_history": [
            {
                "id": r.id,
                "emotion": r.emotion,
                "confidence": r.confidence,
                "method": r.method,
                "note": r.note,
                "song_title": r.song_title,
                "song_artist": r.song_artist,
                "created_at": r.created_at.isoformat()
            }
            for r in emotion_records
        ],
        "mood_journals": [
            {
                "id": j.id,
                "title": j.title,
                "content": j.content,
                "mood_tag": j.mood_tag,
                "created_at": j.created_at.isoformat()
            }
            for j in journals
        ],
        "saved_music": [
            {
                "id": s.id,
                "title": s.title,
                "artist": s.artist,
                "genre": s.genre,
                "playlist_name": s.playlist_name
            }
            for s in saved_songs
        ]
    }
    return JSONResponse(
        content=payload,
        headers={"Content-Disposition": f"attachment; filename=moodsync_data_user_{current_user.id}.json"}
    )

@router.delete("/account", status_code=status.HTTP_200_OK)
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Permanently deletes the user account and cascades deletion to all associated records."""
    db.delete(current_user)
    db.commit()
    return {"message": "Account and all associated records permanently deleted"}

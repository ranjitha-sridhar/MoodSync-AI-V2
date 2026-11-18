import csv
import io
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.emotion_record import EmotionRecord
from app.schemas.emotion import EmotionRecordResponse
from app.schemas.history import HistoryResponse

router = APIRouter(prefix="/history", tags=["Mood History"])

@router.get("", response_model=HistoryResponse)
def get_user_mood_history(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    emotion: Optional[str] = None,
    search: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(EmotionRecord).filter(EmotionRecord.user_id == current_user.id)

    if emotion and emotion != "All":
        query = query.filter(EmotionRecord.emotion.ilike(emotion))

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                EmotionRecord.note.ilike(search_fmt),
                EmotionRecord.emotion.ilike(search_fmt),
                EmotionRecord.song_title.ilike(search_fmt)
            )
        )

    if start_date:
        try:
            s_dt = datetime.fromisoformat(start_date)
            query = query.filter(EmotionRecord.created_at >= s_dt)
        except ValueError:
            pass

    if end_date:
        try:
            e_dt = datetime.fromisoformat(end_date)
            query = query.filter(EmotionRecord.created_at <= e_dt)
        except ValueError:
            pass

    total = query.count()
    records = query.order_by(EmotionRecord.created_at.desc()).offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "records": records
    }

@router.get("/export-csv")
def export_history_csv(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    records = db.query(EmotionRecord).filter(
        EmotionRecord.user_id == current_user.id
    ).order_by(EmotionRecord.created_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Emotion", "Confidence (%)", "Method", "Date & Time", "User Note", "Recommended Song", "Artist"])

    for r in records:
        writer.writerow([
            r.id,
            r.emotion,
            r.confidence,
            r.method,
            r.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            r.note or "",
            r.song_title or "",
            r.song_artist or ""
        ])

    output.seek(0)
    filename = f"moodsync_history_{current_user.id}_{datetime.utcnow().strftime('%Y%m%d')}.csv"

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.delete("/clear", status_code=status.HTTP_200_OK)
def clear_all_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deleted_count = db.query(EmotionRecord).filter(EmotionRecord.user_id == current_user.id).delete()
    db.commit()
    return {"message": f"Successfully deleted {deleted_count} mood records."}

@router.get("/{record_id}", response_model=EmotionRecordResponse)
def get_single_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    record = db.query(EmotionRecord).filter(
        EmotionRecord.id == record_id,
        EmotionRecord.user_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Mood record not found")
    return record

@router.delete("/{record_id}", status_code=status.HTTP_200_OK)
def delete_single_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    record = db.query(EmotionRecord).filter(
        EmotionRecord.id == record_id,
        EmotionRecord.user_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Mood record not found")

    db.delete(record)
    db.commit()
    return {"message": "Record deleted successfully"}

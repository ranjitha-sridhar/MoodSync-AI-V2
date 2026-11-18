from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.journal import MoodJournal
from app.models.emotion_record import EmotionRecord
from app.schemas.journal import (
    JournalCreate,
    JournalResponse,
    DailyCheckinCreate,
    WellnessActivity
)

router = APIRouter(prefix="/journal", tags=["MindMate Wellness & Journal"])

WELLNESS_ACTIVITIES = [
    {
        "id": "box-breathing",
        "title": "Box Breathing (4-4-4-4)",
        "category": "Breathing",
        "duration_minutes": 3,
        "description": "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold empty for 4 seconds.",
        "benefit": "Activates parasympathetic nervous system, lowering heart rate and acute stress."
    },
    {
        "id": "54321-grounding",
        "title": "5-4-3-2-1 Grounding Method",
        "category": "Mindfulness",
        "duration_minutes": 5,
        "description": "Acknowledge 5 things you can see, 4 things you can touch, 3 things you hear, 2 you smell, and 1 you taste.",
        "benefit": "Brings focus back into the physical present moment during anxious or racing thoughts."
    },
    {
        "id": "gratitude-reflection",
        "title": "3 Good Things Journaling",
        "category": "Journaling",
        "duration_minutes": 5,
        "description": "Write down three specific positive occurrences from today, however small, and why they occurred.",
        "benefit": "Shifts cognitive focus toward appreciation and resilient positive reframing."
    },
    {
        "id": "progressive-relaxation",
        "title": "Quick Shoulder & Neck Release",
        "category": "Relaxation",
        "duration_minutes": 2,
        "description": "Slowly raise your shoulders towards your ears, hold tension for 5 seconds, and release completely.",
        "benefit": "Releases somatic tension physically stored during prolonged screen time or frustration."
    }
]

AFFIRMATIONS = {
    "Sad": [
        "It is completely okay to feel down; emotions ebb and flow like gentle waves.",
        "Be kind and patient with yourself today. You are doing the best you can.",
        "This feeling is a visitor in your day, not the definition of your future."
    ],
    "Angry": [
        "Take a slow breath. You are in control of your response, not the circumstance.",
        "Acknowledge the frustration, release the physical tension, and protect your peace.",
        "Peace of mind is a conscious decision. Choose calm over escalation."
    ],
    "Fear": [
        "You are safe right now in this exact moment. Take one slow, steady breath.",
        "You have overcome challenges before, and you have the strength to handle this step.",
        "Focus on what is right in front of you. One breath and one small action at a time."
    ],
    "Happy": [
        "Savor this positive energy and let it brighten the people around you.",
        "Celebrate the small wins and moments of joy you've experienced today.",
        "You deserve this happiness and peace of mind."
    ],
    "Neutral": [
        "A calm, balanced mind is fertile ground for focus, creativity, and presence.",
        "Embrace the quiet clarity of today. You are centered and in rhythm.",
        "Present in the moment, open to whatever good unfolds next."
    ]
}

@router.get("", response_model=List[JournalResponse])
def get_user_journals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(MoodJournal).filter(
        MoodJournal.user_id == current_user.id
    ).order_by(MoodJournal.created_at.desc()).all()

@router.post("", response_model=JournalResponse, status_code=status.HTTP_201_CREATED)
def create_journal_entry(
    journal_in: JournalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = MoodJournal(
        user_id=current_user.id,
        title=journal_in.title or "Daily Reflection",
        content=journal_in.content,
        mood_tag=journal_in.mood_tag or "Neutral",
        checkin_type=journal_in.checkin_type or "daily"
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{journal_id}", status_code=status.HTTP_200_OK)
def delete_journal_entry(
    journal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = db.query(MoodJournal).filter(
        MoodJournal.id == journal_id,
        MoodJournal.user_id == current_user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    db.delete(entry)
    db.commit()
    return {"message": "Journal entry deleted"}

@router.get("/companion-guidance")
def get_wellness_guidance(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns personalized affirmations, breathing exercise guides, and mindful activities
    tailored to the user's most recent emotion record.
    Non-clinical and supportive.
    """
    latest_record = db.query(EmotionRecord).filter(
        EmotionRecord.user_id == current_user.id
    ).order_by(EmotionRecord.created_at.desc()).first()

    recent_mood = latest_record.emotion if latest_record else "Neutral"
    mood_affirmations = AFFIRMATIONS.get(recent_mood, AFFIRMATIONS["Neutral"])

    return {
        "recent_mood": recent_mood,
        "affirmations": mood_affirmations,
        "activities": WELLNESS_ACTIVITIES,
        "disclaimer": "MindMate is a supportive wellness companion and does not offer medical diagnoses or mental healthcare treatment."
    }

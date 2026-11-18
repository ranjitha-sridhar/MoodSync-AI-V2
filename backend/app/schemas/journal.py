from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class JournalCreate(BaseModel):
    title: Optional[str] = "Daily Reflection"
    content: str
    mood_tag: Optional[str] = "Neutral"
    checkin_type: Optional[str] = "daily"

class JournalResponse(BaseModel):
    id: int
    user_id: int
    title: Optional[str]
    content: str
    mood_tag: Optional[str]
    checkin_type: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DailyCheckinCreate(BaseModel):
    mood: str
    energy_level: int = 3  # 1 to 5
    note: Optional[str] = None

class WellnessActivity(BaseModel):
    id: str
    title: str
    category: str
    duration_minutes: int
    description: str
    benefit: str

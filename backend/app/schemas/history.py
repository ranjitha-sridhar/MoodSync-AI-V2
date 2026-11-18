from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.schemas.emotion import EmotionRecordResponse

class HistoryResponse(BaseModel):
    total: int
    page: int
    limit: int
    records: List[EmotionRecordResponse]

class HistorySummary(BaseModel):
    total_records: int
    most_frequent_emotion: str
    last_detected_at: Optional[datetime] = None

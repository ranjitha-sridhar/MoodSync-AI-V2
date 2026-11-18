from typing import List, Dict, Optional
from pydantic import BaseModel

class EmotionCount(BaseModel):
    emotion: str
    count: int
    percentage: float

class DailyTrendPoint(BaseModel):
    date: str
    dominant_emotion: str
    confidence_avg: float
    count: int

class WeekdayFrequency(BaseModel):
    weekday: str
    dominant_emotion: str
    count: int

class ExpressionGrouping(BaseModel):
    category: str  # Positive, Neutral, Negative
    count: int
    percentage: float
    disclaimer: str = "Expression grouping is an observational facial categorization, not a clinical psychological evaluation."

class AnalyticsOverview(BaseModel):
    total_detections: int
    most_frequent_emotion: str
    today_count: int
    today_dominant_emotion: Optional[str] = None
    emotion_distribution: List[EmotionCount]
    weekly_trends: List[DailyTrendPoint]
    weekday_distribution: List[WeekdayFrequency]
    expression_breakdown: List[ExpressionGrouping]
    comparison: Dict[str, float]  # this_week vs last_week change %

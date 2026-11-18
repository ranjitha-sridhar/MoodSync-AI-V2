from datetime import datetime, timedelta, timezone
from collections import Counter
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.emotion_record import EmotionRecord

EMOTION_CATEGORY_MAP = {
    "Happy": "Positive",
    "Surprise": "Positive",
    "Neutral": "Neutral",
    "Sad": "Negative",
    "Angry": "Negative",
    "Fear": "Negative",
    "Disgust": "Negative"
}

ALL_EMOTIONS = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]

def calculate_user_analytics(user_id: int, db: Session) -> Dict[str, Any]:
    """
    Computes real analytics strictly from the user's saved EmotionRecord database rows.
    Returns clear empty states when user has no records.
    """
    now = datetime.utcnow()
    seven_days_ago = now - timedelta(days=7)
    fourteen_days_ago = now - timedelta(days=14)
    start_of_today = datetime(now.year, now.month, now.day)

    # All user records
    records = db.query(EmotionRecord).filter(
        EmotionRecord.user_id == user_id
    ).order_by(EmotionRecord.created_at.asc()).all()

    total_detections = len(records)

    if total_detections == 0:
        return {
            "total_detections": 0,
            "most_frequent_emotion": "None",
            "today_count": 0,
            "today_dominant_emotion": None,
            "emotion_distribution": [
                {"emotion": e, "count": 0, "percentage": 0.0} for e in ALL_EMOTIONS
            ],
            "weekly_trends": [],
            "weekday_distribution": [],
            "expression_breakdown": [
                {"category": "Positive", "count": 0, "percentage": 0.0, "disclaimer": "Observational facial grouping, not psychological diagnosis."},
                {"category": "Neutral", "count": 0, "percentage": 0.0, "disclaimer": "Observational facial grouping, not psychological diagnosis."},
                {"category": "Negative", "count": 0, "percentage": 0.0, "disclaimer": "Observational facial grouping, not psychological diagnosis."}
            ],
            "comparison": {
                "this_week_total": 0,
                "last_week_total": 0,
                "change_percentage": 0.0
            }
        }

    # Emotion frequency
    counts = Counter(r.emotion for r in records)
    most_frequent = counts.most_common(1)[0][0] if counts else "Neutral"

    # Emotion distribution
    distribution = []
    for emo in ALL_EMOTIONS:
        c = counts.get(emo, 0)
        distribution.append({
            "emotion": emo,
            "count": c,
            "percentage": round((c / total_detections) * 100, 1)
        })

    # Today's records
    today_records = [r for r in records if r.created_at >= start_of_today]
    today_count = len(today_records)
    today_dominant = Counter(r.emotion for r in today_records).most_common(1)[0][0] if today_records else None

    # Weekly comparison
    this_week_records = [r for r in records if r.created_at >= seven_days_ago]
    last_week_records = [r for r in records if fourteen_days_ago <= r.created_at < seven_days_ago]
    this_week_count = len(this_week_records)
    last_week_count = len(last_week_records)

    if last_week_count == 0:
        change_pct = 100.0 if this_week_count > 0 else 0.0
    else:
        change_pct = round(((this_week_count - last_week_count) / last_week_count) * 100, 1)

    # 7-day daily trends
    daily_trends = []
    for i in range(6, -1, -1):
        day_date = (now - timedelta(days=i)).date()
        day_recs = [r for r in records if r.created_at.date() == day_date]
        if day_recs:
            day_dom = Counter(r.emotion for r in day_recs).most_common(1)[0][0]
            avg_conf = round(sum(r.confidence for r in day_recs) / len(day_recs), 1)
            daily_trends.append({
                "date": day_date.strftime("%b %d"),
                "dominant_emotion": day_dom,
                "confidence_avg": avg_conf,
                "count": len(day_recs)
            })
        else:
            daily_trends.append({
                "date": day_date.strftime("%b %d"),
                "dominant_emotion": "None",
                "confidence_avg": 0.0,
                "count": 0
            })

    # Weekday frequency
    weekday_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    weekday_buckets: Dict[str, List[str]] = {w: [] for w in weekday_names}
    for r in records:
        w_name = r.created_at.strftime("%A")
        if w_name in weekday_buckets:
            weekday_buckets[w_name].append(r.emotion)

    weekday_dist = []
    for w in weekday_names:
        w_list = weekday_buckets[w]
        w_dom = Counter(w_list).most_common(1)[0][0] if w_list else "None"
        weekday_dist.append({
            "weekday": w[:3],
            "dominant_emotion": w_dom,
            "count": len(w_list)
        })

    # Expression breakdown (Positive, Neutral, Negative)
    cat_counts = Counter(EMOTION_CATEGORY_MAP.get(r.emotion, "Neutral") for r in records)
    expression_breakdown = []
    for cat in ["Positive", "Neutral", "Negative"]:
        c = cat_counts.get(cat, 0)
        expression_breakdown.append({
            "category": cat,
            "count": c,
            "percentage": round((c / total_detections) * 100, 1),
            "disclaimer": "Observational facial expression grouping, not psychological diagnosis."
        })

    return {
        "total_detections": total_detections,
        "most_frequent_emotion": most_frequent,
        "today_count": today_count,
        "today_dominant_emotion": today_dominant,
        "emotion_distribution": distribution,
        "weekly_trends": daily_trends,
        "weekday_distribution": weekday_dist,
        "expression_breakdown": expression_breakdown,
        "comparison": {
            "this_week_total": this_week_count,
            "last_week_total": last_week_count,
            "change_percentage": change_pct
        }
    }

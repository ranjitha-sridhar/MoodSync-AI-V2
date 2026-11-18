from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.analytics_service import calculate_user_analytics
from app.schemas.analytics import AnalyticsOverview

router = APIRouter(prefix="/analytics", tags=["Mood Analytics"])

@router.get("/overview", response_model=AnalyticsOverview)
def get_analytics_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Computes all analytics dynamically from the authenticated user's actual database records.
    Returns honest empty states for new accounts. Never generates mock or synthetic records.
    """
    analytics = calculate_user_analytics(current_user.id, db)
    return analytics

from typing import Optional
from pydantic import BaseModel

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    preferred_genres: Optional[str] = None
    theme: Optional[str] = None
    save_history_enabled: Optional[bool] = None
    notifications_enabled: Optional[bool] = None

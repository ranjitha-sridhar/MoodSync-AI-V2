import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

BACKEND_DIR = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    PROJECT_NAME: str = "MoodSync AI"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "moodsync-super-secret-production-key-change-in-env-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database: defaults to SQLite locally, override with PostgreSQL in production
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{BACKEND_DIR / 'moodsync.db'}"
    )

    # Model configuration
    MODEL_PATH: Path = BACKEND_DIR / "ml" / "notebooks" / "emotion_model.keras"

    # CORS
        # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://moodsync-ai.vercel.app",
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

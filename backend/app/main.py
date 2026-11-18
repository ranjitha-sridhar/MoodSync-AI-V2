import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, Depends, status
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.routes.auth import router as auth_router
from app.routes.emotion import router as emotion_router
from app.routes.history import router as history_router
from app.routes.analytics import router as analytics_router
from app.routes.music import router as music_router
from app.routes.journal import router as journal_router
from app.routes.profile import router as profile_router
from app.services.emotion_service import analyze_emotion_image

# Auto-create tables on startup (or fallback gracefully)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MoodSync AI API",
    version=settings.VERSION,
    description="Advanced AI-Powered Emotion Intelligence & Wellness Platform API"
)

# CORS Middleware

# CORS Middleware
# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API v1 Modular Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(emotion_router, prefix=settings.API_V1_STR)
app.include_router(history_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(music_router, prefix=settings.API_V1_STR)
app.include_router(journal_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)

# Direct root-level routes for complete backward-compatibility with v1 frontend
app.include_router(emotion_router)
app.include_router(music_router)

@app.get("/", tags=["Health"])
def home():
    return {
        "message": "MoodSync AI Backend Running ðŸš€",
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "MoodSync AI",
        "version": settings.VERSION
    }

@app.post("/predict", tags=["Legacy Inference"])
async def predict(file: UploadFile = File(...)):
    """Legacy backward-compatible inference endpoint."""
    image_bytes = await file.read()
    np_image = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
    result = analyze_emotion_image(image)
    return {
        "emotion": result["emotion"],
        "confidence": result["confidence"],
        "probabilities": result["probabilities"]
    }

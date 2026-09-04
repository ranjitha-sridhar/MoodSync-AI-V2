from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from app.routes.music import router as music_router
from app.services.emotion_predictor import predict_emotion
from app.routes.emotion import router

app = FastAPI(
    title="MoodSync AI API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(music_router)

@app.get("/")
def home():
    return {"message": "MoodSync AI Backend Running 🚀"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()

    np_image = np.frombuffer(image_bytes, np.uint8)

    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

    return predict_emotion(image)
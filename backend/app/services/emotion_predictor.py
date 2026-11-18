"""
Backward-compatible wrapper for emotion prediction.
Delegates to modern analyze_emotion_image service while preserving legacy interface.
"""
from app.services.emotion_service import analyze_emotion_image, EMOTIONS

def predict_emotion(image):
    result = analyze_emotion_image(image)
    return {
        "emotion": result["emotion"],
        "confidence": result["confidence"],
        "probabilities": result["probabilities"],
        "bounding_box": result["bounding_box"],
        "faces_detected": result["faces_detected"],
        "timestamp": result["timestamp"]
    }

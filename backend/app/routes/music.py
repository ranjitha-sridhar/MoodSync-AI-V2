
from fastapi import APIRouter

router = APIRouter(
    prefix="/music",
    tags=["Music"]
)


MOOD_SONGS = {

    "Happy": {
        "title": "Perfect",
        "artist": "Ed Sheeran",
        "videoId": "2Vv-BfVoq4g"
    },

    "Sad": {
        "title": "Someone Like You",
        "artist": "Adele",
        "videoId": "hLQl3WQQoQ0"
    },

    "Angry": {
        "title": "Believer",
        "artist": "Imagine Dragons",
        "videoId": "7wtfhZwyrcc"
    },

    "Neutral": {
        "title": "Golden Hour",
        "artist": "JVKE",
        "videoId": "PEM0Vs8jf1w"
    },

    "Fear": {
        "title": "lovely",
        "artist": "Billie Eilish & Khalid",
        "videoId": "V1Pl8CzNzCw"
    },

    "Disgust": {
        "title": "Levitating",
        "artist": "Dua Lipa",
        "videoId": "TUVcZfQe-Kw"
    },

    "Surprise": {
        "title": "Uptown Funk",
        "artist": "Mark Ronson ft. Bruno Mars",
        "videoId": "OPf0YbXqDm0"
    }
}


@router.get("/recommend/{emotion}")
def recommend_music(emotion: str):

    emotion = emotion.strip().capitalize()

    song = MOOD_SONGS.get(
        emotion,
        MOOD_SONGS["Neutral"]
    )

    return song

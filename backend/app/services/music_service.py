from typing import List, Dict, Any, Optional

# Verified curated music catalog mapped by emotion with actual video IDs
CURATED_MUSIC_CATALOG: Dict[str, Dict[str, Any]] = {
    "Happy": {
        "energy_profile": "Uplifting & Vibrant",
        "genres": ["Pop", "Dance", "Funk", "Indie Pop"],
        "songs": [
            {"id": "happy-1", "title": "Perfect", "artist": "Ed Sheeran", "videoId": "2Vv-BfVoq4g", "genre": "Pop", "mood_category": "Uplifting"},
            {"id": "happy-2", "title": "Happy", "artist": "Pharrell Williams", "videoId": "ZbZSe6N_BXs", "genre": "Pop", "mood_category": "Uplifting"},
            {"id": "happy-3", "title": "Good as Hell", "artist": "Lizzo", "videoId": "SmbmeOgWsqE", "genre": "Pop/R&B", "mood_category": "Energetic"},
            {"id": "happy-4", "title": "Can't Stop the Feeling!", "artist": "Justin Timberlake", "videoId": "ru0K8uYEZWw", "genre": "Dance-Pop", "mood_category": "Energetic"},
            {"id": "happy-5", "title": "Sunday Best", "artist": "Surfaces", "videoId": "_83K3AH44h8", "genre": "Indie Pop", "mood_category": "Relaxing"}
        ]
    },
    "Sad": {
        "energy_profile": "Reflective & Comforting",
        "genres": ["Acoustic", "Soul", "Ambient", "Indie Folk"],
        "songs": [
            {"id": "sad-1", "title": "Someone Like You", "artist": "Adele", "videoId": "hLQl3WQQoQ0", "genre": "Soul/Pop", "mood_category": "Reflective"},
            {"id": "sad-2", "title": "Fix You", "artist": "Coldplay", "videoId": "k4V3Mo61fJM", "genre": "Alternative", "mood_category": "Comforting"},
            {"id": "sad-3", "title": "Stay With Me", "artist": "Sam Smith", "videoId": "pB-5XG-DbAA", "genre": "Soul", "mood_category": "Reflective"},
            {"id": "sad-4", "title": "All I Want", "artist": "Kodaline", "videoId": "mtf7hC17IBM", "genre": "Indie Rock", "mood_category": "Comforting"},
            {"id": "sad-5", "title": "Skinny Love", "artist": "Bon Iver", "videoId": "ssdgFoHLwnk", "genre": "Indie Folk", "mood_category": "Relaxing"}
        ]
    },
    "Angry": {
        "energy_profile": "Cathartic & De-escalating",
        "genres": ["Rock", "Lo-Fi", "Calm Piano", "Ambient"],
        "songs": [
            {"id": "angry-1", "title": "Believer", "artist": "Imagine Dragons", "videoId": "7wtfhZwyrcc", "genre": "Rock", "mood_category": "Cathartic"},
            {"id": "angry-2", "title": "Weightless", "artist": "Marconi Union", "videoId": "UfcAVejslrU", "genre": "Ambient", "mood_category": "De-escalating"},
            {"id": "angry-3", "title": "River Flows in You", "artist": "Yiruma", "videoId": "7maJOI3QMu0", "genre": "Classical Piano", "mood_category": "Calming"},
            {"id": "angry-4", "title": "Clair de Lune", "artist": "Claude Debussy", "videoId": "WNcsUNKlAKw", "genre": "Classical", "mood_category": "Calming"},
            {"id": "angry-5", "title": "Radioactive", "artist": "Imagine Dragons", "videoId": "ktvTqknDobU", "genre": "Alternative Rock", "mood_category": "Cathartic"}
        ]
    },
    "Neutral": {
        "energy_profile": "Balanced & Focused",
        "genres": ["Lo-Fi Beats", "Chillwave", "Jazz", "Electronic"],
        "songs": [
            {"id": "neutral-1", "title": "Golden Hour", "artist": "JVKE", "videoId": "PEM0Vs8jf1w", "genre": "Indie Pop", "mood_category": "Balanced"},
            {"id": "neutral-2", "title": "Coffee Breath", "artist": "Sofia Mills", "videoId": "qU8e0w_N7Jc", "genre": "Lo-Fi Indie", "mood_category": "Focus"},
            {"id": "neutral-3", "title": "Lofi Hip Hop Radio - Beats to Relax/Study", "artist": "Lofi Girl", "videoId": "jfKfPfyJRdk", "genre": "Lo-Fi", "mood_category": "Focus"},
            {"id": "neutral-4", "title": "Sunset Lover", "artist": "Petit Biscuit", "videoId": "wuCK-oiE3rA", "genre": "Chillwave", "mood_category": "Relaxing"},
            {"id": "neutral-5", "title": "Daylight", "artist": "David Kushner", "videoId": "MoN9ql6Yymw", "genre": "Indie Pop", "mood_category": "Balanced"}
        ]
    },
    "Fear": {
        "energy_profile": "Grounding & Soothing",
        "genres": ["Acoustic", "Meditation", "Slow Ambient", "Chamber"],
        "songs": [
            {"id": "fear-1", "title": "lovely", "artist": "Billie Eilish & Khalid", "videoId": "V1Pl8CzNzCw", "genre": "Alternative/Pop", "mood_category": "Grounding"},
            {"id": "fear-2", "title": "Deep Relaxation Meditation", "artist": "Nu Meditation Music", "videoId": "1ZYbU82GVz4", "genre": "Meditation", "mood_category": "Soothing"},
            {"id": "fear-3", "title": "Breathe", "artist": "TÃ©lÃ©popmusik", "videoId": "vyut3GyQtn0", "genre": "Downtempo", "mood_category": "Grounding"},
            {"id": "fear-4", "title": "Spiegel im Spiegel", "artist": "Arvo PÃ¤rt", "videoId": "FZe3mXlnfNc", "genre": "Classical Minimal", "mood_category": "Soothing"},
            {"id": "fear-5", "title": "Let It Be", "artist": "The Beatles", "videoId": "QDYfEBY9NM4", "genre": "Classic Rock/Pop", "mood_category": "Comforting"}
        ]
    },
    "Disgust": {
        "energy_profile": "Refreshing & Energizing",
        "genres": ["Nu-Disco", "Electro-Pop", "Upbeat R&B"],
        "songs": [
            {"id": "disgust-1", "title": "Levitating", "artist": "Dua Lipa", "videoId": "TUVcZfQe-Kw", "genre": "Pop/Nu-Disco", "mood_category": "Refreshing"},
            {"id": "disgust-2", "title": "Blinding Lights", "artist": "The Weeknd", "videoId": "4NRXx6U8ABQ", "genre": "Synthwave", "mood_category": "Energizing"},
            {"id": "disgust-3", "title": "Electric Feel", "artist": "MGMT", "videoId": "MmZexg8sQDk", "genre": "Indie Pop", "mood_category": "Refreshing"},
            {"id": "disgust-4", "title": "Feel Good Inc.", "artist": "Gorillaz", "videoId": "HyHNuVaZJ-k", "genre": "Alternative Hip Hop", "mood_category": "Energizing"}
        ]
    },
    "Surprise": {
        "energy_profile": "Joyful & Exuberant",
        "genres": ["Funk", "Dance", "Groove", "Soul"],
        "songs": [
            {"id": "surprise-1", "title": "Uptown Funk", "artist": "Mark Ronson ft. Bruno Mars", "videoId": "OPf0YbXqDm0", "genre": "Funk/Pop", "mood_category": "Exuberant"},
            {"id": "surprise-2", "title": "September", "artist": "Earth, Wind & Fire", "videoId": "Gs069dndIYk", "genre": "Disco/Funk", "mood_category": "Joyful"},
            {"id": "surprise-3", "title": "Treasure", "artist": "Bruno Mars", "videoId": "nPvuNsRccVw", "genre": "Funk Pop", "mood_category": "Joyful"},
            {"id": "surprise-4", "title": "Don't Start Now", "artist": "Dua Lipa", "videoId": "oygrmJFKYZY", "genre": "Nu-Disco", "mood_category": "Exuberant"}
        ]
    }
}

def get_recommendations_for_emotion(
    emotion: str,
    user_preferred_genres: Optional[str] = None,
    liked_songs_titles: Optional[List[str]] = None
) -> Dict[str, Any]:
    norm_emotion = emotion.strip().capitalize()
    if norm_emotion not in CURATED_MUSIC_CATALOG:
        norm_emotion = "Neutral"

    category_data = CURATED_MUSIC_CATALOG[norm_emotion]
    songs = list(category_data["songs"])

    # Priority sorting based on user's preferred genres if provided
    if user_preferred_genres:
        preferred = [g.strip().lower() for g in user_preferred_genres.split(",") if g.strip()]
        songs.sort(
            key=lambda s: any(p in s.get("genre", "").lower() for p in preferred),
            reverse=True
        )

    primary = songs[0] if songs else {
        "id": "neutral-1",
        "title": "Golden Hour",
        "artist": "JVKE",
        "videoId": "PEM0Vs8jf1w",
        "genre": "Pop",
        "mood_category": "Balanced"
    }

    return {
        "primary_song": primary,
        "playlist": songs,
        "emotion": norm_emotion,
        "energy_profile": category_data["energy_profile"],
        "suggested_genres": category_data["genres"]
    }

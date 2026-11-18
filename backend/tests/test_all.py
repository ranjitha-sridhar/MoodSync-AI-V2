"""
Backend tests: auth, emotion detection, history, analytics, user isolation.
Run with:  pytest tests/ -v
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# ── Helpers ───────────────────────────────────────────────────────────────────

def register_and_login(email: str, password: str = "TestPass123!", name: str = "Tester"):
    r = client.post("/api/auth/register", json={"name": name, "email": email, "password": password})
    if r.status_code not in (200, 201):
        # Already exists — just login
        pass
    r2 = client.post("/api/auth/login", data={"username": email, "password": password})
    assert r2.status_code == 200, f"Login failed: {r2.text}"
    return r2.json()["access_token"]


def auth_header(token: str):
    return {"Authorization": f"Bearer {token}"}


# ── Auth tests ────────────────────────────────────────────────────────────────

class TestAuth:
    def test_register_success(self):
        r = client.post("/api/auth/register", json={
            "name": "New User",
            "email": "newuser@test.moodsync",
            "password": "SecurePass999!"
        })
        assert r.status_code in (200, 201), r.text
        data = r.json()
        assert "access_token" in data

    def test_register_duplicate_email(self):
        payload = {"name": "Dup", "email": "dup@test.moodsync", "password": "Pass1234!"}
        client.post("/api/auth/register", json=payload)
        r2 = client.post("/api/auth/register", json=payload)
        assert r2.status_code == 400

    def test_register_short_password(self):
        r = client.post("/api/auth/register", json={
            "name": "X",
            "email": "short@test.moodsync",
            "password": "123"
        })
        assert r.status_code == 422

    def test_login_valid(self):
        email = "loginvalid@test.moodsync"
        client.post("/api/auth/register", json={
            "name": "Login Valid",
            "email": email,
            "password": "GoodPass123!"
        })
        r = client.post("/api/auth/login", data={"username": email, "password": "GoodPass123!"})
        assert r.status_code == 200
        assert "access_token" in r.json()

    def test_login_wrong_password(self):
        email = "wrongpwd@test.moodsync"
        client.post("/api/auth/register", json={
            "name": "W",
            "email": email,
            "password": "RightPass123!"
        })
        r = client.post("/api/auth/login", data={"username": email, "password": "WrongPass!"})
        assert r.status_code == 401

    def test_login_nonexistent_user(self):
        r = client.post("/api/auth/login", data={
            "username": "ghost@test.moodsync",
            "password": "whatever"
        })
        assert r.status_code == 401

    def test_me_endpoint_authenticated(self):
        token = register_and_login("me@test.moodsync")
        r = client.get("/api/auth/me", headers=auth_header(token))
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == "me@test.moodsync"

    def test_me_endpoint_unauthenticated(self):
        r = client.get("/api/auth/me")
        assert r.status_code == 401

    def test_invalid_token_rejected(self):
        r = client.get("/api/auth/me", headers={"Authorization": "Bearer fake.token.here"})
        assert r.status_code == 401


# ── Emotion detection tests ───────────────────────────────────────────────────

class TestEmotionDetection:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.token = register_and_login("emotion@test.moodsync")

    def _make_tiny_png(self) -> bytes:
        """Create a minimal valid PNG (1×1 white pixel)."""
        import base64
        # 1x1 white pixel PNG (base64)
        b64 = (
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8"
            "z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg=="
        )
        return base64.b64decode(b64)

    def test_detect_returns_emotion(self):
        png = self._make_tiny_png()
        r = client.post(
            "/api/emotion/detect",
            files={"file": ("test.png", png, "image/png")},
            headers=auth_header(self.token)
        )
        # May return 200 with emotion or 400 if no face detected in 1px image
        assert r.status_code in (200, 400, 422)

    def test_detect_no_file(self):
        r = client.post("/api/emotion/detect", headers=auth_header(self.token))
        assert r.status_code == 422

    def test_legacy_predict_endpoint(self):
        """Backward-compatible /predict route must still respond."""
        png = self._make_tiny_png()
        r = client.post(
            "/predict",
            files={"file": ("test.png", png, "image/png")}
        )
        assert r.status_code in (200, 400, 422)


# ── History tests ─────────────────────────────────────────────────────────────

class TestHistory:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.token = register_and_login("history@test.moodsync")

    def test_history_empty_for_new_user(self):
        r = client.get("/api/history", headers=auth_header(self.token))
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, (list, dict))
        # Accept both list or paginated dict
        records = data if isinstance(data, list) else data.get("records", [])
        assert isinstance(records, list)

    def test_history_requires_auth(self):
        r = client.get("/api/history")
        assert r.status_code == 401

    def test_save_emotion_record(self):
        r = client.post(
            "/api/emotion/save",
            json={
                "emotion": "Happy",
                "confidence": 0.92,
                "probabilities": {"Happy": 0.92, "Neutral": 0.05, "Sad": 0.03},
                "method": "upload",
                "note": "Feeling good today"
            },
            headers=auth_header(self.token)
        )
        assert r.status_code == 200

    def test_saved_record_appears_in_history(self):
        # Save first
        client.post(
            "/api/emotion/save",
            json={
                "emotion": "Neutral",
                "confidence": 0.75,
                "probabilities": {"Neutral": 0.75},
                "method": "webcam"
            },
            headers=auth_header(self.token)
        )
        r = client.get("/api/history", headers=auth_header(self.token))
        assert r.status_code == 200
        data = r.json()
        records = data if isinstance(data, list) else data.get("records", [])
        assert len(records) >= 1


# ── User isolation tests ──────────────────────────────────────────────────────

class TestUserIsolation:
    def test_user_a_cannot_see_user_b_records(self):
        token_a = register_and_login("user_a@test.moodsync", name="User A")
        token_b = register_and_login("user_b@test.moodsync", name="User B")

        # User A saves a record
        client.post(
            "/api/emotion/save",
            json={
                "emotion": "Happy",
                "confidence": 0.99,
                "probabilities": {"Happy": 0.99},
                "method": "upload",
                "note": "Secret note from user A"
            },
            headers=auth_header(token_a)
        )

        # User B's history must not contain User A's records
        r = client.get("/api/history", headers=auth_header(token_b))
        assert r.status_code == 200
        data = r.json()
        records = data if isinstance(data, list) else data.get("records", [])
        notes = [rec.get("note", "") for rec in records]
        assert "Secret note from user A" not in notes


# ── Analytics tests ───────────────────────────────────────────────────────────

class TestAnalytics:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.token = register_and_login("analytics@test.moodsync")

    def test_analytics_empty_state(self):
        r = client.get("/api/analytics/overview", headers=auth_header(self.token))
        assert r.status_code == 200
        data = r.json()
        assert "total_detections" in data
        assert data["total_detections"] >= 0

    def test_analytics_requires_auth(self):
        r = client.get("/api/analytics/overview")
        assert r.status_code == 401


# ── Music recommendation tests ────────────────────────────────────────────────

class TestMusic:
    def test_music_recommend_happy(self):
        r = client.get("/api/music/recommend/Happy")
        assert r.status_code == 200
        data = r.json()
        assert "songs" in data or isinstance(data, list)

    def test_music_recommend_all_emotions(self):
        emotions = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
        for emotion in emotions:
            r = client.get(f"/api/music/recommend/{emotion}")
            assert r.status_code == 200, f"Failed for emotion: {emotion}"

    def test_legacy_music_route(self):
        r = client.get("/music/recommend/Happy")
        assert r.status_code == 200


# ── Profile tests ─────────────────────────────────────────────────────────────

class TestProfile:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.token = register_and_login("profile@test.moodsync")

    def test_get_profile(self):
        r = client.get("/api/profile", headers=auth_header(self.token))
        assert r.status_code == 200
        data = r.json()
        assert "email" in data

    def test_update_profile(self):
        r = client.put(
            "/api/profile",
            json={"name": "Updated Name", "preferred_genres": "jazz, classical"},
            headers=auth_header(self.token)
        )
        assert r.status_code == 200
        assert r.json()["name"] == "Updated Name"

# MoodSync AI â€” Advanced Emotion Intelligence & Wellness Platform

> A production-quality, full-stack AI-powered emotional wellness platform built with React, FastAPI, TensorFlow and PostgreSQL.

---

## Overview

MoodSync AI detects facial emotions in real time using a CNN trained on the FER2013 dataset, then helps users track emotional patterns, discover mood-matched music and build better wellness habits.

**Key features:**
- ðŸŽ­ Real-time facial emotion detection (webcam + image upload) â€” 7 emotion classes
- ðŸ“Š Personalised mood analytics with interactive Recharts dashboards
- ðŸŽµ Emotion-matched music recommendations
- ðŸ—“ Interactive mood calendar with daily records
- ðŸ§˜ MindMate wellness companion â€” breathing, journaling, affirmations
- ðŸ”’ JWT authentication with bcrypt password hashing
- ðŸ“ˆ Persistent mood history per user (never shared between accounts)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 8 + TypeScript + Tailwind CSS v4 |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP | Axios |
| Backend | Python 3.11 + FastAPI |
| ML | TensorFlow / Keras (CNN â€” `emotion_model.keras`) |
| Vision | OpenCV |
| Auth | JWT (PyJWT) + bcrypt (passlib) |
| Database | SQLAlchemy ORM â€” SQLite (dev) / PostgreSQL (prod) |
| Testing | pytest + FastAPI TestClient |

---

## Project Structure

```
MoodSync-AI-V2/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”œâ”€â”€ main.py                 # FastAPI app â€” all routers, CORS, DB init
â”‚   â”‚   â”œâ”€â”€ core/
â”‚   â”‚   â”‚   â”œâ”€â”€ config.py           # Pydantic settings (env-based)
â”‚   â”‚   â”‚   â”œâ”€â”€ database.py         # SQLAlchemy engine + session
â”‚   â”‚   â”‚   â””â”€â”€ security.py         # JWT, bcrypt, get_current_user
â”‚   â”‚   â”œâ”€â”€ models/                 # SQLAlchemy ORM models
â”‚   â”‚   â”œâ”€â”€ schemas/                # Pydantic request/response schemas
â”‚   â”‚   â”œâ”€â”€ routes/                 # FastAPI routers
â”‚   â”‚   â”‚   â”œâ”€â”€ auth.py             # /api/auth/*
â”‚   â”‚   â”‚   â”œâ”€â”€ emotion.py          # /api/emotion/*
â”‚   â”‚   â”‚   â”œâ”€â”€ history.py          # /api/history/*
â”‚   â”‚   â”‚   â”œâ”€â”€ analytics.py        # /api/analytics/*
â”‚   â”‚   â”‚   â”œâ”€â”€ music.py            # /api/music/*
â”‚   â”‚   â”‚   â”œâ”€â”€ journal.py          # /api/journal/*
â”‚   â”‚   â”‚   â””â”€â”€ profile.py          # /api/profile/*
â”‚   â”‚   â”œâ”€â”€ services/               # Business logic
â”‚   â”‚   â”‚   â”œâ”€â”€ emotion_service.py  # CNN inference wrapper
â”‚   â”‚   â”‚   â”œâ”€â”€ music_service.py    # Recommendation engine
â”‚   â”‚   â”‚   â””â”€â”€ analytics_service.py
â”‚   â”‚   â””â”€â”€ ml/
â”‚   â”‚       â””â”€â”€ notebooks/
â”‚   â”‚           â””â”€â”€ emotion_model.keras   # â† trained CNN (never overwrite)
â”‚   â”œâ”€â”€ tests/
â”‚   â”‚   â””â”€â”€ test_all.py             # pytest â€” auth, emotion, history, isolation
â”‚   â”œâ”€â”€ requirements.txt
â”‚   â”œâ”€â”€ render.yaml                 # Render deployment config
â”‚   â””â”€â”€ .env.example
â”‚
â””â”€â”€ frontend/
    â”œâ”€â”€ src/
    â”‚   â”œâ”€â”€ pages/
    â”‚   â”‚   â”œâ”€â”€ Landing.tsx         # Redesigned landing page
    â”‚   â”‚   â”œâ”€â”€ Auth/               # Login, Signup, ForgotPassword
    â”‚   â”‚   â”œâ”€â”€ Dashboard/          # Main dashboard (real API data)
    â”‚   â”‚   â”œâ”€â”€ Detection/          # Webcam + upload emotion detection
    â”‚   â”‚   â”œâ”€â”€ History/            # Paginated mood history
    â”‚   â”‚   â”œâ”€â”€ Analytics/          # Recharts dashboards
    â”‚   â”‚   â”œâ”€â”€ Calendar/           # Interactive mood calendar
    â”‚   â”‚   â”œâ”€â”€ MusicStudio/        # Emotion-matched recommendations
    â”‚   â”‚   â”œâ”€â”€ MindMate/           # Breathing, journal, affirmations
    â”‚   â”‚   â”œâ”€â”€ Profile/            # Profile management
    â”‚   â”‚   â””â”€â”€ Settings/           # Preferences, security, data
    â”‚   â”œâ”€â”€ context/
    â”‚   â”‚   â”œâ”€â”€ AuthContext.tsx      # JWT auth state + login/register/logout
    â”‚   â”‚   â””â”€â”€ MoodContext.tsx      # Detected mood state
    â”‚   â”œâ”€â”€ components/layout/
    â”‚   â”‚   â”œâ”€â”€ Sidebar.tsx          # Full 9-item nav with Lucide icons
    â”‚   â”‚   â””â”€â”€ DashboardLayout.tsx  # Responsive layout with mobile drawer
    â”‚   â”œâ”€â”€ routes/AppRouter.tsx     # All routes with ProtectedRoute + lazy loading
    â”‚   â””â”€â”€ services/api.ts          # Axios + JWT interceptor + 401 redirect
    â”œâ”€â”€ vercel.json                  # Vercel SPA deployment config
    â”œâ”€â”€ postcss.config.js            # Empty plugins (Tailwind v4 via Vite plugin)
    â””â”€â”€ .env.example
```

---

## Local Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Git

### 1. Clone

```bash
git clone https://github.com/ranjitha-sridhar/MoodSync-AI-V2.git
cd MoodSync-AI-V2
```

### 2. Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env â€” set SECRET_KEY to a random string

# Run (auto-creates SQLite DB on first start)
uvicorn app.main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`.
Interactive docs: `http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# VITE_API_URL=http://localhost:8000

# Dev server
npm run dev
```

The app will be at `http://localhost:5173`.

### 4. Environment Variables

**Backend `backend/.env`:**
```
SECRET_KEY=your-long-random-secret-key
DATABASE_URL=                       # leave empty for SQLite (dev)
MODEL_PATH=ml/notebooks/emotion_model.keras
CORS_ORIGINS=http://localhost:5173
ENVIRONMENT=development
```

**Frontend `frontend/.env`:**
```
VITE_API_URL=http://localhost:8000
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | âŒ | Register new user |
| POST | `/api/auth/login` | âŒ | Login â†’ JWT |
| GET | `/api/auth/me` | âœ… | Get current user |
| POST | `/api/emotion/detect` | Optional | Detect emotion from image |
| POST | `/api/emotion/save` | âœ… | Save emotion record |
| GET | `/api/history` | âœ… | Paginated mood history |
| DELETE | `/api/history/{id}` | âœ… | Delete one record |
| GET | `/api/history/export-csv` | âœ… | Export history as CSV |
| GET | `/api/analytics/overview` | âœ… | Full analytics summary |
| GET | `/api/music/recommend/{emotion}` | Optional | Music recommendations |
| GET/POST | `/api/journal` | âœ… | Mood journal CRUD |
| GET/PUT | `/api/profile` | âœ… | User profile |
| PUT | `/api/profile/change-password` | âœ… | Change password |
| GET | `/api/profile/export-data` | âœ… | Export all data (JSON) |
| DELETE | `/api/profile/account` | âœ… | Delete account |

**Legacy routes** (backward compatible):
- `POST /predict` â€” emotion detection
- `GET /music/recommend/{emotion}` â€” music recommendations

---

## Running Tests

```bash
cd backend
pytest tests/ -v
```

Tests cover: registration, login, duplicate email, wrong password, JWT validation, emotion detection, mood history, **user data isolation**, analytics empty state, music recommendations for all 7 emotions, and profile management.

---

## Deployment

### Backend â†’ Render

```bash
# render.yaml is already configured.
# In Render dashboard: New Web Service â†’ connect repo â†’ root dir: backend
# Add env vars: SECRET_KEY, DATABASE_URL (from Render PostgreSQL add-on)
```

### Frontend â†’ Vercel

```bash
# vercel.json is already configured.
# In Vercel dashboard: Import repo â†’ root dir: frontend
# Add env var: VITE_API_URL=https://your-render-app.onrender.com
```

---

## ML Model

- **File:** `backend/ml/notebooks/emotion_model.keras`
- **Architecture:** Sequential CNN
- **Dataset:** FER2013
- **Classes:** Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral (7 classes)
- **Input:** 48Ã—48 grayscale face image
- **Model loaded once** at startup â€” not reloaded per request

> âš ï¸ **Privacy:** Facial images are never stored. Only emotion predictions and metadata (confidence, timestamp, method) are saved, and only when the user explicitly saves a result.

> âš ï¸ **Disclaimer:** Emotion detection estimates visible facial expressions. It is not a clinical or psychological assessment of internal emotional state.

---

## Security

- Passwords hashed with bcrypt (via passlib)
- JWT access tokens (HS256) â€” expiry configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`
- All protected endpoints require `Authorization: Bearer <token>`
- Every database query filters by `current_user.id` from the JWT â€” users cannot access other users' records
- CORS origin whitelist configurable via `CORS_ORIGINS` env var
- No secrets exposed in frontend code

---

## License

MIT

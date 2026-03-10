# DataIntellect — Development Setup Guide

AI-Enabled Financial Risk Intelligence Platform.

---

## 1. Prerequisites

Ensure the following are installed before proceeding.

| Tool | Min Version | Download |
| :--- | :--- | :--- |
| **Git** | Any | [git-scm.com](https://git-scm.com/downloads) |
| **Python** | 3.10+ | [python.org](https://www.python.org/downloads/) |
| **Node.js** | LTS (20.x) | [nodejs.org](https://nodejs.org/en) |
| **PostgreSQL** | 14+ | [postgresql.org](https://www.postgresql.org/download/) |

Verify installations:
```powershell
git --version
python --version
node --version && npm --version
psql --version
```

---

## 2. Recommended VS Code Extensions

- **Python** + **Pylance** (Microsoft)
- **Tailwind CSS IntelliSense**
- **ES7+ React/Redux/React-Native Snippets**
- **PostgreSQL** (Chris Kolkman)

---

## 3. Project Setup

### 3.1. Backend (FastAPI + Python)

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
```

**`backend/requirements.txt`** must include:
```text
fastapi
uvicorn
pandas
sqlalchemy
psycopg2-binary
python-multipart
python-jose[cryptography]
passlib[bcrypt]
```

### 3.2. Frontend (Vite + React)

> ⚠️ The frontend has been migrated from Next.js to **Vite + React SPA** for long-term stability.

```powershell
cd frontend
npm install
```

**Tech Stack:**
- **Vite 6** — Fast, stable build tool
- **React 18** + **TypeScript**
- **React Router v7** — Client-side routing
- **Tailwind CSS v3** — Styling (via PostCSS)
- **Radix UI** — Accessible UI primitives
- **Recharts** — Data visualization
- **Framer Motion** — Animations

### 3.3. Database (PostgreSQL)

```sql
CREATE DATABASE dataintellect;
```

**Connection details:**
- Host: `localhost` | Port: `5432`
- User: `postgres`
- Database: `dataintellect`

---

## 4. Daily Development (Quick Start)

Run in **separate terminals**, in this order:

### Terminal 1 — Backend
```powershell
# From: dataintellect/backend
& "venv\Scripts\python.exe" -m uvicorn app.main:app --reload
```
- API: `http://127.0.0.1:8000`
- Swagger Docs: `http://127.0.0.1:8000/docs`

### Terminal 2 — Frontend
```powershell
# From: dataintellect/frontend
npm run dev
```
- App: `http://localhost:5173`

---

## 5. Useful Commands

| Task | Command | Directory |
| :--- | :--- | :--- |
| Run backend tests | `& "venv\Scripts\python.exe" run_tests.py` | `backend/` |
| Reset DB schema | `& "venv\Scripts\python.exe" fix_schema.py` | `backend/` |
| Build frontend | `npm run build` | `frontend/` |
| Type-check frontend | `npx tsc --noEmit` | `frontend/` |

---

## 6. Project Structure

```
dataintellect/
├── backend/            # FastAPI + SQLAlchemy
│   └── app/
│       ├── main.py
│       ├── models.py
│       ├── schemas.py
│       ├── auth.py
│       └── routers/
│           ├── auth.py
│           └── upload.py
├── frontend/           # Vite + React SPA (active)
│   └── src/
│       ├── App.tsx         # Router + layout
│       ├── pages/          # Page components
│       ├── components/     # Reusable UI
│       └── hooks/          # Custom hooks
├── frontend-nextjs-backup/ # Original Next.js (archived)
├── ml/                 # ML models
├── rag/                # RAG pipeline (future)
└── data-engineering/   # Data pipeline scripts
```

---

**Status**: Phase 1 (Minor Project) — Frontend migrated to Vite React. Core features in progress.

# DataIntellect - Environment Setup Guide

This document provides step-by-step instructions to set up the development environment for the **DataIntellect** project.

## 1. Prerequisites (Check & Install)

Open your terminal (PowerShell or Command Prompt) and ensure the following tools are installed. If not, download and install them.

- **VS Code**: [Download](https://code.visualstudio.com/download)
- **Git**: [Download](https://git-scm.com/downloads)
    ```powershell
    git --version
    ```
- **Python (3.10+)**: [Download](https://www.python.org/downloads/)
    ```powershell
    python --version
    ```
- **Node.js (LTS Version)**: [Download](https://nodejs.org/en)
    ```powershell
    node --version
    npm --version
    ```
- **PostgreSQL**: [Download](https://www.postgresql.org/download/)
    - Remember your password (default is usually `postgres`).
    ```powershell
    psql --version
    ```

## 2. VS Code Extensions

Install the following extensions in VS Code for a better development experience:
- **Python** (Microsoft)
- **Pylance** (Microsoft)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **PostgreSQL** (by Chris Kolkman or similar)

## 3. Project Initialization

### 3.1. Clone / Open Repository
Ensure you are in the project root:
`c:\Users\ommis\OneDrive\Documents\DataIntellect project\dataintellect`

### 3.2. Backend Setup (Python)

1.  **Navigate to backend directory**:
    ```powershell
    cd backend
    ```

2.  **Create Virtual Environment**:
    ```powershell
    python -m venv venv
    ```

3.  **Activate Virtual Environment**:
    ```powershell
    .\venv\Scripts\Activate
    ```
    *(You should see `(venv)` in your terminal prompt)*

4.  **Install Dependencies** (Create `requirements.txt` first if not exists, then run):
    ```powershell
    pip install fastapi uvicorn pandas sqlalchemy psycopg2-binary python-multipart
    ```

    *Create a file named `requirements.txt` in `backend/` with contents:*
    ```text
    fastapi
    uvicorn
    pandas
    sqlalchemy
    psycopg2-binary
    python-multipart
    ```
    Then run: `pip install -r requirements.txt`

### 3.3. Frontend Setup (Next.js)

1.  **Navigate to frontend directory** (Open a new terminal):
    ```powershell
    cd ../frontend
    ```

2.  **Initialize Next.js Project**:
    ```powershell
    npx create-next-app@latest . --typescript --tailwind --eslint
    ```
    *Prompts:*
    - Use TypeScript? **Yes**
    - Use ESLint? **Yes**
    - Use Tailwind CSS? **Yes**
    - Use `src/` directory? **Yes** (or No, consistent with preference)
    - Use App Router? **Yes**
    - Customize default import alias? **No**

3.  **Install Additional UI Libraries**:
    ```powershell
    npm install lucide-react recharts three @types/three framer-motion clsx tailwind-merge
    ```

### 3.4. Database Setup (PostgreSQL)

1.  **Open PostgreSQL Shell (psql)** or pgAdmin.
2.  **Create Database**:
    ```sql
    CREATE DATABASE dataintellect;
    ```
3.  **Verify Connection**:
    - Host: localhost
    - Port: 5432
    - User: postgres
    - Password: [YOUR_PASSWORD]
    - Database: dataintellect

## Quick Start Commands (Daily Development)

Use these commands to start the project. Run them in separate terminal instances.

### 1. Start Backend (Python/FastAPI)
Using the correct virtual environment path is crucial.
**Directory**: `dataintellect/backend`

```powershell
& "venv\Scripts\python.exe" -m uvicorn app.main:app --reload
Ctrl+C to exit.

```
*   **Port**: `http://127.0.0.1:8000`
*   **Docs**: `http://127.0.0.1:8000/docs`

### 2. Start Frontend (Next.js)
**Directory**: `dataintellect/frontend`

```powershell
npm run dev
```
*   **URL**: `http://localhost:3000`

### 3. Run Tests
**Directory**: `dataintellect/backend`

```powershell
& "venv\Scripts\python.exe" run_tests.py
```

### 4. Database Reset (Warning: Deletes Data)
**Directory**: `dataintellect/backend`

```powershell
& "venv\Scripts\python.exe" fix_schema.py
```

---
**Status**: Phase 1 (Minor Project) Fully Implemented & Secure.

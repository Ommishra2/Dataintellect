from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pandas as pd
import io

from app.database import engine, Base, get_db
import app.schemas as schemas, app.crud as crud
from app.models import FinancialRecord

from app.routers import analytics, upload, settings, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DataIntellect API", 
    description="Financial Risk Intelligence Platform APIs",
    version="0.1.0"
)

# Register Routers
app.include_router(auth.router)
app.include_router(analytics.router)
app.include_router(upload.router)
app.include_router(settings.router)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.34:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "DataIntellect API is running", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

router = APIRouter(
    prefix="/settings",
    tags=["settings"]
)

@router.delete("/clear-data")
def clear_all_data(db: Session = Depends(get_db)):
    """
    DANGER: Clears all financial records.
    """
    try:
        # Use execute with text() for safe raw SQL execution or use ORM delete
        db.execute(text("TRUNCATE TABLE financial_records"))
        db.commit()
        return {"message": "All financial data cleared successfully."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

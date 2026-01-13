from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import FinancialRecord
from app.auth import get_current_user
from app.models import User
from typing import List, Dict

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"]
)

@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get high-level financial summary: Total Revenue, Total Expense, Net Balance.
    """
    try:
        # Aggregations
        total_revenue = db.query(func.sum(FinancialRecord.revenue)).scalar() or 0.0
        total_expense = db.query(func.sum(FinancialRecord.expense)).scalar() or 0.0
        total_balance = db.query(func.sum(FinancialRecord.balance)).scalar() or 0.0
        
        # Calculate Net Profit (Simplistic view same as balance here, or Revenue - Expense)
        net_profit = total_revenue - total_expense
        
        return {
            "total_revenue": total_revenue,
            "total_expense": total_expense,
            "net_profit": net_profit,
            "current_balance": total_balance,
            # Placeholder for risk until ML phase
            "risk_exposure": "Low (Stable)" 
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trends")
def get_financial_trends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get monthly trends for Revenue vs Expense.
    """
    try:
        # Group by Month (using date truncation)
        # SQLite usage might differ, but for PostgreSQL 'date_trunc' is standard.
        # Assuming postgresql based on connection string.
        
        trends = db.query(
            func.to_char(FinancialRecord.date, 'YYYY-MM').label('month'),
            func.sum(FinancialRecord.revenue).label('revenue'),
            func.sum(FinancialRecord.expense).label('expense')
        ).group_by('month').order_by('month').all()
        
        return [
            {
                "month": t.month,
                "revenue": t.revenue,
                "expense": t.expense
            }
            for t in trends
        ]
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

@router.get("/records")
def get_financial_records(
    db: Session = Depends(get_db), 
    skip: int = 0, 
    limit: int = 50,
    current_user: User = Depends(get_current_user)
):
    """
    Get raw financial records with pagination.
    """
    try:
        total = db.query(func.count(FinancialRecord.id)).scalar()
        records = db.query(FinancialRecord).offset(skip).limit(limit).all()
        
        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "data": records
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

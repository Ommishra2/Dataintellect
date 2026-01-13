from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import pandas as pd
from datetime import datetime
from app.database import SessionLocal
from app.models import FinancialRecord, FinancialAggregate
from app.auth import get_current_user
from app.models import User
import io
import numpy as np

router = APIRouter(prefix="/upload", tags=["Financial Upload"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/financial-data")
async def upload_financial_data(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Read file content safely
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))

    # Normalize column names
    df.columns = [c.lower().strip() for c in df.columns]

    required_columns = {
        "account_id", "date", "revenue", "expense", "balance",
        "transaction_count", "overdue_amount", "payment_delay_days"
    }

    if not required_columns.issubset(df.columns):
        missing = required_columns - set(df.columns)
        return {"error": f"CSV structure invalid. Missing: {missing}"}

    # Data Type Conversion & Validation
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.strftime('%Y-%m') # Create month column for aggregation

    records = []
    for _, row in df.iterrows():
        records.append(
            FinancialRecord(
                account_id=str(row["account_id"]),
                date=row["date"].date(),
                revenue=float(row["revenue"]),
                expense=float(row["expense"]),
                balance=float(row["balance"]),
                transaction_count=int(row["transaction_count"]),
                overdue_amount=float(row["overdue_amount"]),
                payment_delay_days=int(row["payment_delay_days"]),
                created_at=datetime.utcnow()
            )
        )

    db.add_all(records)
    
    # --- Aggregation Logic (Table 3 Generation) ---
    # Group by account_id and month
    agg_df = df.groupby(['account_id', 'month']).agg(
        avg_revenue=('revenue', 'mean'),
        avg_expense=('expense', 'mean'),
        total_revenue=('revenue', 'sum'),
        total_expense=('expense', 'sum'),
        cashflow_volatility=('revenue', 'std') # Simple volatility metric
    ).reset_index()

    # Calculate derived metrics
    agg_df['profit'] = agg_df['total_revenue'] - agg_df['total_expense']
    agg_df['expense_ratio'] = agg_df.apply(lambda x: x['total_expense'] / x['total_revenue'] if x['total_revenue'] > 0 else 0, axis=1)
    agg_df['cashflow_volatility'] = agg_df['cashflow_volatility'].fillna(0) # Handle single-record months

    aggregates = []
    for _, row in agg_df.iterrows():
        aggregates.append(
            FinancialAggregate(
                account_id=str(row['account_id']),
                month=str(row['month']),
                avg_revenue=float(row['avg_revenue']),
                avg_expense=float(row['avg_expense']),
                profit=float(row['profit']),
                expense_ratio=float(row['expense_ratio']),
                cashflow_volatility=float(row['cashflow_volatility']),
                created_at=datetime.utcnow()
            )
        )
    
    db.add_all(aggregates)
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        return {"error": f"Database commit failed: {str(e)}"}

    return {
        "message": "Upload successful. Records and Aggregates generated.",
        "records_inserted": len(records),
        "aggregates_generated": len(aggregates)
    }

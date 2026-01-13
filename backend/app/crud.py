from sqlalchemy.orm import Session
import pandas as pd
import app.models as models

def create_financial_records(db: Session, df: pd.DataFrame):
    # Convert DataFrame rows to Dictionary list
    records_data = df.to_dict(orient='records')
    
    # Create Model Objects
    db_records = [
        models.FinancialRecord(
            account_id=row['account_id'],
            date=row['date'],
            revenue=row['revenue'],
            expense=row['expense'],
            balance=row['balance'],
            transaction_count=row['transaction_count'],
            overdue_amount=row['overdue_amount'],
            payment_delay_days=row['payment_delay_days']
        )
        for row in records_data
    ]
    
    # Bulk Insert for Efficiency
    db.add_all(db_records)
    db.commit()
    
    return len(db_records)
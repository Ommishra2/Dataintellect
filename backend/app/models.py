from sqlalchemy import Column, Integer, String, Float, Date, DateTime
import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="user")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class FinancialRecord(Base):
    __tablename__ = "financial_records"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(String, index=True)
    date = Column(Date)
    revenue = Column(Float)
    expense = Column(Float)
    balance = Column(Float)
    transaction_count = Column(Integer)
    overdue_amount = Column(Float)
    payment_delay_days = Column(Integer)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class FinancialAggregate(Base):
    __tablename__ = "financial_aggregates"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(String, index=True)
    month = Column(String, index=True)  # Format: YYYY-MM
    avg_revenue = Column(Float)
    avg_expense = Column(Float)
    profit = Column(Float)
    expense_ratio = Column(Float)
    cashflow_volatility = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

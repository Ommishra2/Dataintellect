from pydantic import BaseModel, ConfigDict
from datetime import date

# 1. Schema for reading data (Output)
class FinancialRecordResponse(BaseModel):
    id: int
    account_id: str
    date: date
    revenue: float
    expense: float
    balance: float
    transaction_count: int
    overdue_amount: float
    payment_delay_days: int

    model_config = ConfigDict(from_attributes=True)
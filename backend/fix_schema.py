from app.database import engine, Base
from app.models import FinancialRecord
from sqlalchemy import text

# Drop table directly using SQL to ensure it's gone
with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS financial_records"))
    conn.commit()
    print("Table 'financial_records' dropped.")

# Recreate all tables defined in models
Base.metadata.create_all(bind=engine)
print("Database schema recreated successfully.")

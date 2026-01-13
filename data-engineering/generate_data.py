import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Configuration
NUM_RECORDS = 1000
START_DATE = datetime(2023, 1, 1)

def generate_synthetic_data():
    data = []
    
    # Generate 50 unique account IDs
    account_ids = [f"ACC-{100 + i}" for i in range(50)]
    
    for _ in range(NUM_RECORDS):
        acc_id = random.choice(account_ids)
        
        # Random Date within last 2 years
        days_offset = random.randint(0, 730)
        date = START_DATE + timedelta(days=days_offset)
        
        # Base Logic: Generate realistic correlation
        # 1. Revenue (Random between 5k and 50k)
        revenue = round(random.uniform(5000, 50000), 2)
        
        # 2. Expense (Usually 60-90% of revenue, sometimes higher for risk)
        expense_ratio = random.uniform(0.6, 1.1)
        expense = round(revenue * expense_ratio, 2)
        
        # 3. Balance (Revenue - Expense + Random Noise)
        balance = round(revenue - expense + random.uniform(-1000, 1000), 2)
        
        # 4. Transaction Count (Correlated with revenue)
        transaction_count = int(revenue / random.uniform(200, 500))
        
        # 5. Overdue & Delay (Risk Indicators)
        # If expense > revenue, higher chance of overdue
        if expense > revenue:
            overdue_amount = round(random.uniform(1000, 10000), 2)
            payment_delay_days = random.randint(10, 90)
        else:
            # Healthy accounts usually have 0 or low overdue
            if random.random() > 0.8: # 20% chance of random delay
                overdue_amount = round(random.uniform(0, 2000), 2)
                payment_delay_days = random.randint(1, 15)
            else:
                overdue_amount = 0.0
                payment_delay_days = 0
                
        data.append({
            "account_id": acc_id,
            "date": date.strftime("%Y-%m-%d"),
            "revenue": revenue,
            "expense": expense,
            "balance": balance,
            "transaction_count": transaction_count,
            "overdue_amount": overdue_amount,
            "payment_delay_days": payment_delay_days
        })
        
    df = pd.DataFrame(data)
    
    # Save to root folder so it's easy to upload
    # The script is in data-engineering/, so ../financial_records.csv puts it in dataintellect/
    output_path = "../financial_records.csv"
    df.to_csv(output_path, index=False)
    print(f"✅ Successfully generated {NUM_RECORDS} records at {output_path}")

if __name__ == "__main__":
    generate_synthetic_data()

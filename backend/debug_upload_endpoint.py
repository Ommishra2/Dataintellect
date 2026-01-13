import requests
import pandas as pd
import io

# URL currently used by Frontend
# We try localhost first
url = "http://localhost:8000/upload/financial-data"

# Create a dummy CSV
csv_content = """account_id,date,revenue,expense,balance,transaction_count,overdue_amount,payment_delay_days
ACC_TEST_1,2024-01-01,1000,500,500,10,0,0
ACC_TEST_2,2024-01-01,2000,1000,1000,20,50,2
"""

files = {'file': ('debug_data.csv', csv_content, 'text/csv')}

print(f"Attempting to POST to {url}...")
try:
    response = requests.post(url, files=files)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("✅ Backend is WORKING correctly.")
    else:
        print("❌ Backend returned error.")
except Exception as e:
    print(f"❌ Connection failed: {e}")

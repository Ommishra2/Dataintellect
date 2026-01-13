import requests
import os

# URL
url = "http://localhost:8000/upload/financial-data"
file_path = "../financial_records.csv"

# Resolve absolute path for safety
abs_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), file_path))

print(f"Reading file from: {abs_file_path}")

try:
    with open(abs_file_path, 'rb') as f:
        files = {'file': ('financial_records.csv', f, 'text/csv')}
        
        print(f"Attempting to POST to {url}...")
        response = requests.post(url, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Successfully uploaded financial_records.csv")
        else:
            print(f"❌ Upload failed: {response.status_code} - {response.text}")

except FileNotFoundError:
    print(f"❌ File not found at {abs_file_path}")
except Exception as e:
    print(f"❌ Connection or other error: {e}")

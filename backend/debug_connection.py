import requests
import sys

def check_url(url, method="GET", files=None):
    print(f"Checking {url} [{method}]...")
    try:
        if method == "POST":
            response = requests.post(url, files=files)
        else:
            response = requests.get(url)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
        return True
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        return False

print("--- DIAGNOSTIC START ---")

# 1. Check Health (Simple GET)
health_url = "http://127.0.0.1:8000/health"
check_url(health_url)

# 2. Check Upload Endpoint (POST with dummy file)
upload_url = "http://127.0.0.1:8000/upload/financial-data"
files = {'file': ('test.csv', 'col1,col2\nval1,val2', 'text/csv')}
check_url(upload_url, method="POST", files=files)

print("--- DIAGNOSTIC END ---")

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

print("Verifying Analytics Endpoints...")

try:
    # 1. Test Summary
    print("\nTesting /dashboard/summary...")
    response = client.get("/dashboard/summary")
    if response.status_code == 200:
        data = response.json()
        print("✅ Success")
        print(f"   Revenue: {data.get('total_revenue')}")
        print(f"   Expense: {data.get('total_expense')}")
        print(f"   Net Profit: {data.get('net_profit')}")
    else:
        print(f"❌ Failed: {response.status_code} - {response.text}")

    # 2. Test Trends
    print("\nTesting /dashboard/trends...")
    response = client.get("/dashboard/trends")
    if response.status_code == 200:
        data = response.json()
        print("✅ Success")
        print(f"   Data Points: {len(data)}")
        if len(data) > 0:
            print(f"   First Month: {data[0]}")
    else:
        print(f"❌ Failed: {response.status_code} - {response.text}")

except Exception as e:
    print(f"❌ Error during verification: {e}")

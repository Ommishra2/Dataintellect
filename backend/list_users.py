from app.database import SessionLocal
from app.models import User

def list_users():
    db = SessionLocal()
    users = db.query(User).all()
    print(f"Total Users: {len(users)}")
    for user in users:
        print(f" - ID: {user.id} | Email: {user.email} | Role: {user.role}")
    db.close()

if __name__ == "__main__":
    list_users()

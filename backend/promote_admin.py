from app.database import SessionLocal
from app.models import User
import sys

def promote_to_admin(email):
    db = SessionLocal()
    print(f"Searching for user: {email}...")
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.role = "admin"
            db.commit()
            print(f"✅ Successfully promoted {email} to ADMIN.")
        else:
            print(f"❌ User not found: {email}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python promote_admin.py <email>")
    else:
        target_email = sys.argv[1]
        promote_to_admin(target_email)

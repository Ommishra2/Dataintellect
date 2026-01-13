from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash
import sys

def debug_register():
    db = SessionLocal()
    email = "debug_user@example.com"
    password = "password123"
    
    print(f"Attempting to register {email}...")
    
    try:
        # Check existing
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"User {email} already exists. Deleting for test...")
            db.delete(existing)
            db.commit()
        
        # Hash
        print("Hashing password...")
        hashed = get_password_hash(password)
        print(f"Hash created: {hashed[:10]}...")
        
        # Create
        print("Creating user object...")
        new_user = User(email=email, password_hash=hashed)
        db.add(new_user)
        
        print("Committing to DB...")
        db.commit()
        print("SUCCESS: User registered manually.")
        
    except Exception as e:
        print(f"FAILURE: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_register()

from app.database import engine
from sqlalchemy import inspect
from app.models import User

def check_schema():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Tables found: {tables}")
    
    if "users" in tables:
        columns = [c['name'] for c in inspector.get_columns("users")]
        print(f"Columns in 'users' table: {columns}")
    else:
        print("ERROR: 'users' table NOT found!")

if __name__ == "__main__":
    check_schema()

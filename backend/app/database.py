from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Update this URL with your actual database credentials
# Format: postgresql://username:password@localhost:5432/dataintellect
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:OmPrakash2003@localhost:5432/dataintellect"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# init_db.py
from backend.database import engine, Base

Base.metadata.create_all(bind=engine)
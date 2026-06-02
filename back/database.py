from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)

Base = declarative_base()

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
# while True:
#     try:
#         conn = psycopg.connect(host = 'localhost', dbname = 'FastAPI', user = 'postgres', password = '12345678', row_factory = dict_row)
#         cursor = conn.cursor()
#         print("Database connection was successful!")
#         break
    
#     except Exception as err:
#         print("Connecting to database failed")
#         print("Error: ", err)
#         time.sleep(2)
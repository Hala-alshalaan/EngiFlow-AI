from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# رابط الاتصال السحابي الجديد (Supabase)
SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://postgres:0799388291HM@db.kzbnmfuumhtgmcfdrsba.supabase.co:5432/postgres"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# دالة للحصول على اتصال قاعدة البيانات عند الحاجة
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
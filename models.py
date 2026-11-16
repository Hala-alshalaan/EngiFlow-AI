from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    phone = Column(String, nullable=True)          # رقم الهاتف (مشترك)
    role = Column(String, default="client")        # نوع الحساب: "client" أو "office"
    
    # حقول إضافية مخصصة للمكاتب الهندسية (اختيارية للعملاء العاديين)
    office_name = Column(String, nullable=True)    # اسم المكتب الهندسي
    license_number = Column(String, nullable=True) # رقم الترخيص الهندسي
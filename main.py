from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://postgres.kzbnmfuumhtgmcfdrsba:0799388291HM@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI(title="EngiFlow AI API")

# تفعيل الـ CORS للربط مع صفحات الـ Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. تصميم الجدول الخاص بالمستخدمين والمكاتب الهندسية
class UserModel(Base):
    __tablename__ = "users_and_offices"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    account_type = Column(String, nullable=False) # "user" أو "office"
    
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, nullable=True)
    password = Column(String, nullable=True)

    office_name = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    office_address = Column(String, nullable=True)

# إنشاء الجدول تلقائياً في قاعدة البيانات
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 3. نموذج بيانات استقبال التسجيل (Signup Schema)
class SignupRequest(BaseModel):
    accountType: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    userEmail: Optional[EmailStr] = None
    userPhone: Optional[str] = None
    userPassword: Optional[str] = None

    officeName: Optional[str] = None
    licenseNumber: Optional[str] = None
    officeEmail: Optional[EmailStr] = None
    officePhone: Optional[str] = None
    officeAddress: Optional[str] = None
    officePassword: Optional[str] = None

# 4. مسار التسجيل (Signup Endpoint)
@app.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    
    # تحديد الإيميل المناسب حسب نوع الحساب
    email = data.userEmail if data.accountType == "user" else data.officeEmail
    
    # فحص إذا كان الإيميل مسجل مسبقاً
    existing_user = db.query(UserModel).filter(UserModel.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="البريد الإلكتروني مستخدم مسبقاً!")
    
    # تخزين البيانات الجديدة
    new_record = UserModel(
        account_type=data.accountType,
        first_name=data.firstName,
        last_name=data.lastName,
        email=email,
        phone=data.userPhone if data.accountType == "user" else data.officePhone,
        password=data.userPassword if data.accountType == "user" else data.officePassword,
        office_name=data.officeName,
        license_number=data.licenseNumber,
        office_address=data.officeAddress
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return {"message": "تم إنشاء الحساب وحفظه في قاعدة البيانات بنجاح! 🚀"}

# 5. نموذج بيانات تسجيل الدخول (Login Schema)
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# 6. مسار تسجيل الدخول (Login Endpoint)
@app.post("/login", status_code=status.HTTP_200_OK)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    
    # البحث عن المستخدم أو المكتب بواسطة البريد الإلكتروني
    user = db.query(UserModel).filter(UserModel.email == data.email).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="البريد الإلكتروني غير مسجل!")
    
    # التحقق من مطابقة كلمة المرور
    if user.password != data.password:
        raise HTTPException(status_code=400, detail="كلمة المرور غير صحيحة!")
    
    return {
        "message": "تم تسجيل الدخول بنجاح! أهلاً بك مجدداً 🚀",
        "account_type": user.account_type,
        "name": user.first_name if user.account_type == "user" else user.office_name
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
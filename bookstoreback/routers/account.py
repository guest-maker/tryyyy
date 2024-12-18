from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from datetime import datetime, timedelta
from pymysql import IntegrityError
from sqlmodel import Field, SQLModel, Session, select, create_engine
from pydantic import BaseModel, Field
import bcrypt
import jwt
from .db import get_db, Account

# 應用設置
SECRET_KEY = "your_secret_key"  # 設置為強密鑰，並保密
ALGORITHM = "HS256"

# 路由
router = APIRouter(prefix="/account", tags=["account_api"])


# 用來生成 JWT 的函數
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=30)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt



# Pydantic 模型用於驗證註冊請求
class RegisterRequest(BaseModel):
    account: str
    password: str

@router.post("/register")
def register(request: RegisterRequest, session: Session = Depends(get_db)):
    # 檢查帳號是否已存在
    existing_user = session.query(Account).filter(Account.account == request.account).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Account already exists")
    hashed_password = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt.gensalt())
    new_user = Account(account=request.account, password=hashed_password, level=1)

    try:
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return {"message": "User registered successfully"}
    except IntegrityError:
        session.rollback()
        raise HTTPException(status_code=500, detail="An error occurred while creating the account")

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_db)):
    user = session.exec(select(Account).where(Account.account == form_data.username)).first()

    if not user or not bcrypt.checkpw(form_data.password.encode('utf-8'), user.password.encode('utf-8')):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token_expires = timedelta(minutes=1440)
    access_token = create_access_token(data={"sub": user.account, "level": user.level},expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer", "level": user.level}

# OAuth2 認證
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# 黑名單機制
blacklist = set()

@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme)):
    blacklist.add(token)
    return {"message": "Successfully logged out"}

@router.get("/protected")
def protected_route(token: str = Depends(oauth2_scheme)):
    if token in blacklist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has been blacklisted")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"message": "This is a protected route!"}
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
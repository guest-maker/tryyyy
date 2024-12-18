from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Field, SQLModel, Session, select, create_engine
from typing import List, Optional
from datetime import datetime, timedelta
import jwt
import bcrypt
from .db import get_db, Account

# 設定密鑰和算法
SECRET_KEY = "your_secret_key"  # 設置為強密鑰，並保密
ALGORITHM = "HS256"


# OAuth2 認證
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# 路由
router = APIRouter(prefix="/admin", tags=["admin_api"])

# JWT 解碼並獲取當前用戶
def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")

        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

        user = session.exec(select(Account).where(Account.account == username)).first()

        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# 檢查是否為管理員
def is_admin(user: tuple = Depends(get_current_user)):
    if user.level != 2:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

# 取得所有用戶
@router.get("/users", response_model=List[Account])
def get_all_users(user: tuple = Depends(get_current_user), session: Session = Depends(get_db)):
    is_admin(user)

    users = session.exec(select(Account)).all()
    return [Account(account=u.account, level=u.level) for u in users]

# 新增用戶
@router.post("/users")
def create_user(user: Account, password: str, user_info: tuple = Depends(get_current_user), session: Session = Depends(get_db)):
    is_admin(user_info)

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = Account(username=user.account, password=hashed_password, level=user.level)

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User created successfully"}

# 更新用戶
@router.put("/users/{user_account}")
def update_user(user_account: str, user: Account, user_info: tuple = Depends(get_current_user), session: Session = Depends(get_db)):
    is_admin(user_info)

    db_user = session.get(Account, user_account)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db_user.account = user.account
    db_user.level = user.level
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return {"message": "User updated successfully"}

# 刪除用戶
@router.delete("/users/{user_account}")
def delete_user(user_account: str, user_info: tuple = Depends(get_current_user), session: Session = Depends(get_db)):
    is_admin(user_info)


    db_user = session.get(Account, user_account)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    session.delete(db_user)
    session.commit()

    return {"message": "User deleted successfully"}
# import mysql.connector
# def getDB():
#   mydb = mysql.connector.connect(
#   host="localhost",
#   user="root",
#   password="12345678",
#   database="booksdb")
#   return mydb



# 創造資料表，資料庫本身要手動創造
from sqlmodel import SQLModel, create_engine, Session, Field,  Relationship
import os
from typing import Optional, List
from sqlalchemy import Column, TEXT

# Account 表定義
class Account(SQLModel, table=True):
    account: str = Field(primary_key=True, max_length=50)
    password: str = Field(nullable=False, max_length=100)
    level: int = Field(default=1, nullable=False)

    # 關聯: Account 與 Like 的一對多
    likes: List["Like"] = Relationship(back_populates="account")

# Book 表定義
class Book(SQLModel, table=True):
    id: int = Field(primary_key=True)
    image: Optional[str] = Field(default=None, max_length=255)
    title: Optional[str] = Field(default=None, max_length=100)
    author: Optional[str] = Field(default=None, max_length=100)
    introduction: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    context: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    account: Optional[str] = Field(default=None, max_length=50)

    # 關聯: Book 與 Like 的一對多
    likes: List["Like"] = Relationship(back_populates="book")

# Like 表定義
class Like(SQLModel, table=True):
    account_id: str = Field(foreign_key="account.account", primary_key=True)
    book_id: int = Field(foreign_key="book.id", primary_key=True)

    # 關聯: Like 與 Account 和 Book 的多對一
    account: Account = Relationship(back_populates="likes")
    book: Book = Relationship(back_populates="likes")



DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:12345678@localhost:3306/booksdb")

engine = create_engine(DATABASE_URL)

def get_db():
    with Session(engine) as session:
        yield session

def init_db():
    SQLModel.metadata.create_all(engine)
from fastapi import APIRouter, HTTPException, Depends
from .db import Book, get_db, Like
from sqlmodel import Session, select
from .admin import get_current_user
import os
from typing import List

router = APIRouter(prefix="/like", tags=["like_api"])

# 查詢所有書籍
@router.get("/", response_model=List[Like])
async def get_likes(session: Session = Depends(get_db)):
    likes = session.exec(select(Like)).all()
    return likes

# 查詢收藏書籍
@router.get("/{id}", response_model=Book)
async def get_like(id: int, session: Session = Depends(get_db)):
    book = session.get(Book, id)
    if book is None:
        return {"error": "Book not found"}
    like_books = session.exec(
         select(Like).where(Like.account_id == get_current_user.id, Like.book_id == id)
     )
    return like_books

# 新增或刪除收藏書籍
@router.post("/like")
async def toggle_like(book_id: int, liked: bool, session: Session = Depends(get_db)):
    try:
        # 查找是否已有喜愛記錄
        like = session.exec(select(Like).where(Like.book_id == book_id)).first()

        if liked:
            if not like:
                # 如果未找到，則新增記錄
                new_like = Like(book_id=book_id)
                session.add(new_like)
        else:
            if like:
                # 如果找到，則刪除記錄
                session.delete(like)

        session.commit()
        return {"message": "Book like status updated successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


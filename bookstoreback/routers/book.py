from fastapi import APIRouter, HTTPException, Depends
from typing import List
from .db import Book, get_db, Like
from sqlmodel import Session, select
import os
from .admin import get_current_user

router = APIRouter(prefix="/book", tags=["book_api"])

# 查詢所有書籍
@router.get("/", response_model=List[Book])
async def get_books(session: Session = Depends(get_db)):
    books = session.exec(select(Book)).all()
    return books

# 查詢單一書籍
@router.get("/{id}", response_model=Book)
async def get_book(id: int, session: Session = Depends(get_db)):
    book = session.get(Book, id)
    if book is None:
        return {"error": "Book not found"}
    return book

# 新增書籍
@router.post("/", response_model=Book)
async def create_book(book: Book, session: Session = Depends(get_db)):
    try:
        # Add and commit the book to the database
        session.add(book)
        session.commit()
        session.refresh(book)  # This fetches the book with the auto-generated ID
        
        # Rename the image file
        temp_file_path = f"static/{os.path.basename(book.image)}"
        new_filename = f"{book.id}_img{os.path.splitext(book.image)[1]}"
        new_file_path = f"static/{new_filename}"

        # Rename the image file
        try:
            os.rename(temp_file_path, new_file_path)
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="File not found for renaming")
        
        # Update the image URL in the book record
        new_image_url = f"http://localhost:8000/static/{new_filename}"
        book.image = new_image_url
        
        # Commit the change to the image URL
        session.commit()

        return book
    
    except Exception as e:
        session.rollback()  # Rollback if there's an error
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# 刪除書籍
@router.delete("/{id}", response_model=int)
async def delete_book(id: int, session: Session = Depends(get_db)):
    try:
        # Step 1: Fetch the book to get its image
        book = session.get(Book, id)

        if book is None:
            raise HTTPException(status_code=404, detail="Book not found")

        # Check if the book has an associated image and delete it
        if book.image:
            image_path = book.image.replace("http://localhost:8000/static/", "static/")
            if os.path.exists(image_path):
                os.remove(image_path)

        # Step 2: Delete the book from the database
        session.delete(book)
        session.commit()

        return 1  # Return the number of affected rows

    except Exception as e:
        session.rollback()  # Rollback if there's an error
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# 更新書籍
@router.put("/{id}", response_model=Book)
async def update_book(id: int, book: Book, session: Session = Depends(get_db)):

    db_book = session.get(Book, id)

    # Check if the book has an associated image and delete it
    if db_book.image:
        image_path = db_book.image.replace("http://localhost:8000/static/", "static/")
        if os.path.exists(image_path):
            os.remove(image_path)

    # Rename the image file
    temp_file_path = f"static/{os.path.basename(book.image)}"
    new_filename = f"{db_book.id}_img{os.path.splitext(book.image)[1]}"
    new_file_path = f"static/{new_filename}"

    # Rename the image file
    try:
        os.rename(temp_file_path, new_file_path)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found for renaming")
    
    # Update the image URL in the book record
    new_image_url = f"http://localhost:8000/static/{new_filename}"
    book.image = new_image_url

    if db_book is None:
        return {"error": "Book not found"}

    for key, value in book.model_dump(exclude_unset=True).items():
        setattr(db_book, key, value)

    session.commit()
    session.refresh(db_book)
    return db_book



# # 加入收藏
# @router.post("/like/{id}", response_model=Book)
# async def like_book(book_id: int, session: Session = Depends(get_db), current_account: Account = Depends(get_current_account)):
#     # 查詢是否已經存在該帳戶和書籍的 Like
#     like_exists = session.exec(
#         select(Like).where(Like.account_id == current_account.id, Like.book_id == book_id)
#     ).first()

#     if like_exists:
#         # 如果存在，則刪除
#         session.delete(like_exists)
#         session.commit()
#         return {"message": "Like removed"}
#     else:
#         # 如果不存在，則新增
#         new_like = Like(account_id=current_account.id, book_id=book_id)
#         session.add(new_like)
#         session.commit()
#         session.refresh(new_like)

#         # 查詢並回傳相關書籍資訊
#         book = session.get(Book, book_id)
#         if not book:
#             raise HTTPException(status_code=404, detail="Book not found")
#         return book


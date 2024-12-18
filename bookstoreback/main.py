from fastapi import FastAPI
from routers import book
from routers import uploadFile
from routers import admin
from routers import account
from routers import like
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

# 註冊各個 router
app.include_router(book.router)
app.include_router(uploadFile.router)
app.include_router(admin.router)
app.include_router(account.router)
app.include_router(like.router)

# CORS 設定
origins = [
    "http://localhost:3000",  # 假設前端使用 React 等本地開發工具
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

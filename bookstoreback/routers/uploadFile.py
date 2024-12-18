from fastapi import APIRouter, UploadFile
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os

router = APIRouter(tags=["file"])

# 配置 FastAPI 靜態文件服務
@router.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    # 讀取檔案內容
    contents = await file.read()

    # 確保 static 資料夾存在
    os.makedirs("static", exist_ok=True)

    # 儲存圖片到 static 資料夾
    file_path = f"static/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(contents)

    # 返回圖片的完整 URL
    image_url = f"http://localhost:8000/static/{file.filename}"
    return JSONResponse(content={"url": image_url})

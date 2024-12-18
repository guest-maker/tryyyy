import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";

type Book = {
  image: string;
  title: string;
  author: string;
  introduction: string;
  context: string;
};

type ProProp = {
  visible: boolean;
  id: number;
  book: Book;
};

type Prop = {
  proProp: ProProp;
  setProProp: (s: ProProp) => void;
};

export default function BookAdd(props: Prop) {
  const title = props.proProp.id === -1 ? "新增" : "修改";
  const [newBook, setNewBook] = useState(props.proProp.book);
  const [file, setFile] = useState<File | null>(null); // 儲存選擇的檔案
  const [previewImage, setPreviewImage] = useState<string | null>(props.proProp.book.image || null);

  const handleClick = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBook((prevBook) => ({ ...prevBook, [name]: value }));
  };

  // 處理圖片選擇，並顯示預覽
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile); // 保存文件
      setPreviewImage(URL.createObjectURL(selectedFile)); // 顯示預覽
    }
  };

  // 圖片上傳到後端
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/uploadfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("圖片上傳成功，返回 URL:", response.data.url);
      return response.data.url; // 返回上傳後的圖片 URL
    } catch (error) {
      console.error("圖片上傳失敗:", error);
      alert("圖片上傳失敗，請稍後再試");
      return null;
    }
  };

  // 處理新增或修改書籍
  async function update() {
    const payload = { ...newBook };

    // 若有選擇新圖片，先上傳圖片並獲取 URL
    if (file) {
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        payload.image = imageUrl; // 更新圖片 URL
      }
    }

    // 上傳書籍資料
    if (props.proProp.id === -1) {
      // 新增
      await axios.post("http://localhost:8000/book", payload);
    } else {
      // 修改
      await axios.put(`http://localhost:8000/book/${props.proProp.id}`, payload);
    }
    props.setProProp({ ...props.proProp, visible: false });
  }

  const hide = () => {
    props.setProProp({ ...props.proProp, visible: false });
  };

  return (
    <Dialog open={props.proProp.visible} onClose={hide} aria-labelledby={title + "書籍"}>
      <DialogTitle>
        {title}書籍
        <IconButton
          aria-label="close"
          onClick={hide}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Typography>圖片</Typography>
          <input
            accept="image/*"
            id="upload-image"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="upload-image">
            <Button variant="contained" component="span">
              上傳圖片
            </Button>
          </label>
          {previewImage && (
            <Box mt={2}>
              <Typography>圖片預覽：</Typography>
              <Image
                src={previewImage}
                alt="預覽"
                width={400}
                height={300}
                style={{ objectFit: "contain" }} // 可根據需求調整樣式
              />
            </Box>
          )}
        </Box>
        <TextField label="書籍名稱" variant="outlined" type="text" name="title" value={newBook.title} onChange={handleClick} fullWidth margin="normal" />
        <TextField label="作者" variant="outlined" type="text" name="author" value={newBook.author} onChange={handleClick} fullWidth margin="normal" />
        <TextField label="簡介" variant="outlined" type="text" name="introduction" value={newBook.introduction} onChange={handleClick} fullWidth margin="normal" />
        <TextField label="內容" variant="outlined" type="text" name="context" value={newBook.context} onChange={handleClick} fullWidth margin="normal" multiline rows={4}/>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={update}>
          {title}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

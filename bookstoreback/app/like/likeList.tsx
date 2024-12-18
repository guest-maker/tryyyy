'use client';
import { useEffect, useState } from "react";
import { Box, Container, List, ListItemButton, ListItemText, Typography, Fab, IconButton } from "@mui/material";
// import LikeAdd from "./likeAdd";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import Image from "next/image";
import { useRouter } from 'next/navigation';

type Book = {
  id: number;
  image: string;
  title: string;
  author: string;
  introduction: string;
  context: string;
};

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]); // 書籍資料
  const [proProp, setProProp] = useState({
    visible: false,
    id: -1,
    book: { image: "", title: "", author: "", introduction: "", context: "" }
  });
  const router = useRouter();

  // 初始化 user 及收藏書籍的狀態
  const [likedBooks, setLikedBooks] = useState<Set<number>>(new Set()); // 記錄使用者喜歡的書籍 ID
  const [user, setUser] = useState<{ username: string | null; token: string | null; level: number | null }>({
    username: null,
    token: null,
    level: null
  });

  // 從後端獲取書籍
  async function getBooks() {
    try {
      const response = await axios.get('http://localhost:8000/book/');
      setBooks(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  // 從後端獲取使用者喜歡的書籍 ID
  const getLikes = async (user: { username: string }) => {
    try {
      const response = await axios.get<number[]>(`http://localhost:8000/like/${user.username}`);
      const likedBooksSet = new Set(response.data); // 將已喜歡的書籍 ID 放入 Set 中
      setLikedBooks(likedBooksSet); // 更新已喜歡的書籍狀態
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  // 點擊心形按鈕時，處理書籍的喜好狀態
  const handleLike = async (id: number) => {
    const isLiked = likedBooks.has(id);
    const updatedLikedBooks = new Set(likedBooks);

    if (isLiked) {
      updatedLikedBooks.delete(id);
    } else {
      updatedLikedBooks.add(id);
    }

    setLikedBooks(updatedLikedBooks);

    try {
      await axios.post(`http://localhost:8000/like/${id}`, {
        id,
        liked: !isLiked,
        username: user.username
      });
    } catch (error) {
      console.error('Error liking the book:', error);
    }
  };

  // 預設使用者登入後的資料
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const level = localStorage.getItem('level');

    if (token && username && level) {
      setUser({ username, token, level: parseInt(level) });
    }
  }, []);

  useEffect(() => {
    if (user?.username) {
      getLikes({ username: user.username }); // 取得登入者的喜好書籍
    }
  }, [user?.username]);

  useEffect(() => {
    getBooks(); // 獲取所有書籍資料
  }, [proProp.visible]);

  // 過濾出已經喜歡的書籍
  const filteredBooks = books.filter(book => likedBooks.has(book.id));

  return (
    <Container maxWidth="md">
      {!proProp.visible ? (
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            書架
          </Typography>
          <List>
            {filteredBooks.map((book, index) => (
              <ListItemButton key={book.id} sx={{ padding: '12px 16px' }}>
                <Image
                  src={book.image}
                  alt={`${book.title} thumbnail`}
                  width={100}
                  height={100}
                  style={{ marginRight: 10, objectFit: "cover" }}
                  unoptimized
                />
                <Box sx={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 'bold' }}>{book.title}</Typography>}
                    secondary={<Typography sx={{ fontSize: '14px' }}>{book.author}</Typography>}
                  />
                </Box>
                <Box sx={{ width: '700px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <ListItemText
                    primary={<Typography sx={{ textAlign: 'left' }}>{book.introduction}</Typography>}
                  />
                </Box>
                {user.level === 2 && (
                  <IconButton edge="end" aria-label="delete" onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(book.id);
                  }} sx={{ zIndex: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                )}
                {user.level === 2 && (
                  <IconButton edge="end" aria-label="edit" onClick={(e) => {
                    e.stopPropagation();
                    show(book);
                  }} sx={{ zIndex: 1 }}>
                    <EditIcon />
                  </IconButton>
                )}
                {user.token && (
                  <IconButton
                    edge="end"
                    aria-label="like"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(book.id);
                    }}
                    sx={{ zIndex: 1 }}
                  >
                    <FavoriteIcon color={likedBooks.has(book.id) ? 'error' : 'disabled'} />
                  </IconButton>
                )}
              </ListItemButton>
            ))}
          </List>

          <Fab
            color="primary"
            aria-label="add"
            onClick={() => show(null)}
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
            }}
          >
            <AddIcon />
          </Fab>
        </Box>
      ) : (
        <BookAdd proProp={proProp} setProProp={setProProp} />
      )}
    </Container>
  );
}

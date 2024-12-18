'use client';
import { useEffect, useState } from "react";
import { Box, Container, List, ListItemButton, ListItemText, Typography, Fab, IconButton } from "@mui/material";
import BookAdd from "./bookAdd";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import Image from "next/image";
import { useRouter } from 'next/navigation'; // 導入 useRouter

type Book = {
  id: number;
  image: string;
  title: string;
  author: string;
  introduction: string;
  context: string;
}

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]); // 明確設定 books 的型別
  const [proProp, setProProp] = useState({
    visible: false,
    id: -1,
    book: { image: "", title: "", author: "", introduction: "", context: "" }
  });
  const router = useRouter(); // 使用 useRouter 進行頁面跳轉

  async function getBooks() {
    try {
      const response = await axios.get('http://localhost:8000/book/');
      setBooks(() => [...response.data]); // 設定取得的資料
    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/book/${id}`);
      setBooks(books.filter(book => book.id !== id)); // 更新狀態
    } catch (error) {
      console.error(error);
    }
  };

  const show = (book: Book | null) => {
    if (book) {
      setProProp({
        visible: true,
        id: book.id,
        book: {
          image: book.image || "", // 確保圖片有初始值
          title: book.title,
          author: book.author,
          introduction: book.introduction,
          context: book.context,
        },
      });
    } else {
      setProProp({
        visible: true,
        id: -1,
        book: { image: "", title: "", author: "", introduction: "", context: "" },
      });
    }
  };

  const [likedBooks, setLikedBooks] = useState(new Set()); // Set to track liked books
  const [user, setUser] = useState<{ username: string | null; token: string | null; level: number | null }>({ username: null, token: null, level: null });
  const updatedLikedBooks = new Set(likedBooks);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const level = localStorage.getItem('level'); // 假設你也儲存了用戶的level

    if (token && username && level) {
      setUser({ username, token, level: parseInt(level) });
    }
  }, []);

  const handleLike = async (id: number) => {
    // Toggle the liked status
    const isLiked = updatedLikedBooks.has(id);
    if (updatedLikedBooks.has(id)) {
      updatedLikedBooks.delete(id);
    } else {
      updatedLikedBooks.add(id);
    }

    setLikedBooks(updatedLikedBooks);
    try {
      // 發送到後端的請求，傳遞書籍 ID 和喜愛狀態
      const response = await axios.post(`http://localhost:8000/like/${id}`, {
        id: id,
        liked: !isLiked, // 傳遞新的喜愛狀態
        username: user.username,
      }
      );

      console.log(response.data.message);
    } catch (error) {
      console.error('Error liking the book:', error);
    }
  };

  const getLikes = async (user: { username: string }) => {
    try {
      // 從後端取得使用者的所有喜好書籍 ID
      const response = await axios.get<number[]>(`http://localhost:8000/like/${user.username}`);
      const fetchedLikes = response.data; // 取得所有喜好的書籍 ID
      // 使用 Set 來儲存所有喜歡的書籍 ID
      for (const like of fetchedLikes) {
        updatedLikedBooks.add(like);
      }
      setLikedBooks(updatedLikedBooks); // 更新狀態
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };


  /* 記住點選目標 */
  const [selectedIndex, setSelectedIndex] = useState(1);
  const handleSelect = (index: number, id: number) => {
    setSelectedIndex(index);
    if (id !== -1) {
      router.push(`/book/${id}`); // 使用 router.push 跳轉到書籍詳細頁面
    }

  };
  /* 記住點選目標 */

  useEffect(() => {
    getBooks();
  }, [proProp.visible]);

  useEffect(() => {
    if (user?.username) {
      getLikes({ username: user.username }); // 只在使用者有登入後呼叫
    }
  }, [user?.username]);

  return (
    <Container maxWidth="md">
      {!proProp.visible ? (
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            書架
          </Typography>
          <List>
            {books.map((book, index) => (
              <ListItemButton
                key={book.id}
                selected={selectedIndex === index}
                onClick={() => handleSelect(index, book.id)}
                sx={{ padding: '12px 16px' }} // 調整每本書的高度
              >
                <Image
                  src={book.image} // 若無圖片，顯示預設圖片，確保路徑有效
                  alt={`${book.title} thumbnail`}
                  width={100} // 必須指定寬度
                  height={100} // 必須指定高度
                  style={{ marginRight: 10, objectFit: "cover" }} // 使用 style 控制樣式
                  unoptimized // 避免本地圖片 blob: URL 出現問題
                  onClick={() => handleSelect(index, book.id)}
                />
                <Box sx={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}> {/* 限制書名和作者的寬度 */}
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 'bold' }}>{book.title}</Typography>} // 縮小書名字體
                    secondary={<Typography sx={{ fontSize: '14px' }}>{book.author}</Typography>} // 縮小作者字體
                    onClick={() => handleSelect(index, book.id)}
                  />
                </Box>
                <Box sx={{ width: '700px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <ListItemText
                    primary={<Typography sx={{ textAlign: 'left' }}>{book.introduction}</Typography>} // 左對齊 introduction
                  />
                </Box>
                {user.level ===2 && (
                <IconButton edge="end" aria-label="delete" onClick={(e) => {
                  e.stopPropagation(); // 阻止事件冒泡
                  handleDelete(book.id);
                }} sx={{ zIndex: 1 }}>
                  <DeleteIcon />
                </IconButton>
                )}
                {user.level ===2 && (
                <IconButton edge="end" aria-label="edit" onClick={(e) => {
                  e.stopPropagation(); // 阻止事件冒泡
                  show(book);
                }} sx={{ zIndex: 1 }}>
                  <EditIcon />
                </IconButton>
                )}
                {/* Add Heart Button */}
                {user.token && (
                  <IconButton
                    edge="end"
                    aria-label="like"
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡
                      handleLike(book.id);
                    }}
                    sx={{ zIndex: 1 }}
                  >
                    <FavoriteIcon
                      color={likedBooks.has(book.id) ? 'error' : 'disabled'}
                    />
                  </IconButton>
                )}

              </ListItemButton>
            ))}
          </List>

          <Fab
            color="primary"
            aria-label="add"
            onClick={() => show(null)} //傳遞 null 以清空表單
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

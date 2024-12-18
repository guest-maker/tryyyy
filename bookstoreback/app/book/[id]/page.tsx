'use client';
import { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Divider, ListItemText } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// 書籍資料類型
type Book = {
  image?: string;
  title?: string;
  author?: string;
  introduction?: string;
  context?: string;
};

export default function BookPage() {
  const pathname = usePathname(); // 獲取當前的 pathname
  const [book, setBooks] = useState<Book>({ image: "", title: "", author: "", introduction: "", context: "" }); // 用來存放書籍資料
  const id = Number(pathname?.split('/')[2]); // 假設路徑是 /book/[id]

  async function oneBook(id: number) {
    try {
      const response = await axios.get(`http://localhost:8000/book/${id}`);
      setBooks(response.data); // 設定取得的資料
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (id) {
      oneBook(id);
    }
  }, [id]);

  return (
    <Container>
      <Box mt={4}>
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          mb={4}
          sx={{ paddingLeft: '5%' }} // 距離最左邊 50px
        >
          {/* 圖片 */}
          <Paper elevation={3} sx={{ width: 150, height: 200, overflow: 'hidden', marginRight: 2 }}>
            <Image
              src={book.image || '/default-book-image.png'}
              alt={book.title || 'Book'}
              width={150}
              height={200}
              style={{ objectFit: 'cover' }}
            />
          </Paper>

          {/* 文字，由上到下排列 */}
          <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ paddingLeft: '15px', width: '1000px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Typography variant="h4" gutterBottom>{book.title}</Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>{book.author}</Typography>
            <Typography variant="body1">{book.introduction}</Typography>
          </Box>
        </Box>


        {/* 分隔線 */}
        <Divider sx={{ my: 4 }} />

        {/* context 置中 */}
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>內文</Typography>
          <ListItemText
            sx={{ paddingTop: '15px' }}
            secondary={<Typography style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>{book.context}</Typography>}
          />
        </Box>
      </Box>
    </Container>
  );
}

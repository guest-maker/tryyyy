'use client';
import { AppBar, Button, Toolbar, Typography, Box } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const [bookTitle, setBookTitle] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string | null; token: string | null; level: number | null }>({ username: null, token: null, level: null });
  const [activeButton, setActiveButton] = useState<string | null>(null);

  useEffect(() => {
    const id = pathname.split('/')[2]; // 假設書籍路徑為 /book/[id]
    if (id) {
      axios
        .get(`http://localhost:8000/book/${id}`)
        .then(response => setBookTitle(response.data.title))
        .catch(error => console.error(error));
    } else {
      setBookTitle(null); // 如果不是書籍頁面，清空書名
    }
  }, [pathname]);

  // 初始設置激活按鈕
  useEffect(() => {
    if (pathname === '/' || pathname.startsWith('/book')) {
      setActiveButton('library');
    }
  }, [pathname]);

  const handleTitleClick = () => {
    if (bookTitle) {
      const id = pathname.split('/')[2];
      if (id) {
        router.push(`/book/${id}`); // 重新加載書頁面
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const level = localStorage.getItem('level'); // 假設你也儲存了用戶的level

    if (token && username && level) {
      setUser({ username, token, level: parseInt(level) });
    }
  }, []);

  const handleLogout = async () => {
    try {
      if (user.token) {
        await axios.post('http://localhost:8000/account/logout', {}, { headers: { Authorization: `Bearer ${user.token}` } });
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('level'); // 清除 level
        setUser({ username: null, token: null, level: null });
        router.push('/book');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // const handleAccountManagement = () => {
  //   router.push('/account'); // 轉到帳號管理頁面
  // };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* 左邊的Logo */}
        <Box>
          <Typography variant="h6" color="inherit">
            Booky
          </Typography>
        </Box>

        {/* 中間的按鈕 */}
        <Box ml={2} display="flex" flexGrow={1} alignItems="center">
          <Button
            color="inherit"
            variant={activeButton === 'library' ? 'outlined' : 'text'}
            sx={{
              marginLeft: 2,
              padding: '6px 12px',
              borderRadius: '4px',
              lineHeight: 1.5,
              fontSize: '1rem',
            }}
            onClick={() => {
              setActiveButton('library');
              router.push('/book');
            }}
          >
            圖書館
          </Button>

          {/* 書名 */}
          {bookTitle && (
            <Box ml={2}>
              <Typography
                variant="h6"
                color="inherit"
                sx={{
                  border: '1px solid white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  lineHeight: 1.5,
                  fontSize: '1rem',
                }}
                onClick={handleTitleClick} // 點擊書名重新加載書頁
              >
                {bookTitle}
              </Typography>
            </Box>
          )}
        </Box>

        {/* 右邊的帳號相關按鈕 */}
        <Box display="flex" alignItems="center">
          {!user.token ? (
            <>
              <Button
                color="inherit"
                variant={activeButton === 'login' ? 'outlined' : 'text'}
                sx={{
                  marginRight: 2,
                  padding: '6px 12px',
                  borderRadius: '4px',
                  lineHeight: 1.5,
                  fontSize: '1rem',
                }}
                onClick={() => {
                  setActiveButton('login');
                  router.push('/login');
                }}
              >
                登入
              </Button>
              <Button
                color="inherit"
                variant={activeButton === 'register' ? 'outlined' : 'text'}
                sx={{
                  marginRight: 2,
                  padding: '6px 12px',
                  borderRadius: '4px',
                  lineHeight: 1.5,
                  fontSize: '1rem',
                }}
                onClick={() => {
                  setActiveButton('register');
                  router.push('/register');
                }}
              >
                註冊
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" color="inherit" sx={{ marginRight: 2 }}>
                {user.username}
              </Typography>
                <Button
                  color="inherit"
                  variant={activeButton === 'library' ? 'outlined' : 'text'}
                  sx={{
                    marginLeft: 2,
                    padding: '6px 12px',
                    borderRadius: '4px',
                    lineHeight: 1.5,
                    fontSize: '1rem',
                  }}
                  onClick={() => {
                    setActiveButton('library');
                    router.push('/book');
                  }}
                >
                  收藏
                </Button>
              {/* {user.level == 2 && (
                <Button
                  color="inherit"
                  variant={activeButton === 'accountManagement' ? 'outlined' : 'text'}
                  sx={{
                    marginRight: 2,
                    padding: '6px 12px',
                    borderRadius: '4px',
                    lineHeight: 1.5,
                    fontSize: '1rem',
                  }}
                  onClick={handleAccountManagement}
                >
                  帳號管理
                </Button>
              )} */}
              <Button
                color="inherit"
                variant={activeButton === 'logout' ? 'outlined' : 'text'}
                sx={{
                  marginRight: 2,
                  padding: '6px 12px',
                  borderRadius: '4px',
                  lineHeight: 1.5,
                  fontSize: '1rem',
                }}
                onClick={() => {
                  setActiveButton('logout');
                  handleLogout();
                }}
              >
                登出
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

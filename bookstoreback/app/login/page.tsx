'use client';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/account/login', { ...formData },
        { 
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded' 
          } 
        }
      );
      const { access_token } = response.data;
  
      localStorage.setItem('token', access_token);
      localStorage.setItem('username', formData.username);
      localStorage.setItem('level', response.data.level);
      router.push('/book');
    } catch (err: any) {
      setError(err.response?.data?.detail || '登入失敗');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Typography variant="h5">登入</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="帳號"
          variant="outlined"
          fullWidth
          required
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          sx={{ marginTop: 2 }}
        />
        <TextField
          label="密碼"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          sx={{ marginTop: 2 }}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
          登入
        </Button>
      </form>
    </Box>
  );
}

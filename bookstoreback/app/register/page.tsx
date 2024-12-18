'use client';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ account: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.account || !formData.password) {
        setError('請填寫帳號和密碼');
        return;
      }
      if (formData.password.length < 6) {
        setError('密碼至少需要6個字元');
        return;
      }
      if (formData.account.length > 50 || formData.password.length > 50) {
        setError('帳號或密碼最多50個字元');
        return;
      }
      
      await axios.post('http://localhost:8000/account/register', { ...formData });
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || '註冊失敗');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Typography variant="h5">註冊</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="帳號"
          variant="outlined"
          fullWidth
          required
          value={formData.account}
          onChange={(e) => setFormData({ ...formData, account: e.target.value })}
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
          註冊
        </Button>
      </form>
    </Box>
  );
}

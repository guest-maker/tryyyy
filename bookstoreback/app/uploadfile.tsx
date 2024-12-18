'use client'
import { useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const Input = styled('input')({
    display: 'none',
});

const FileUploadPage = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
      if (selectedFile) {
          const formData = new FormData();
          formData.append('file', selectedFile);
  
          try {
              const response = await axios.post('http://localhost:8000/uploadfile', formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              });
              console.log('上傳成功:', response.data);
              alert(`檔案 ${response.data.filename} 上傳成功！`);
          } catch (error) {
              console.error('上傳失敗:', error);
              alert('上傳失敗，請檢查伺服器設定或稍後再試');
          }
      }
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    檔案上傳
                </Typography>
                <label htmlFor="file-upload">
                    <Input
                        accept="*"
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <Button variant="contained" component="span">
                        選擇檔案
                    </Button>
                </label>
                {selectedFile && (
                    <Typography variant="body1" component="p" gutterBottom>
                        檔案名稱: {selectedFile.name}
                    </Typography>
                )}
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={!selectedFile}
                    >
                        上傳
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default FileUploadPage;
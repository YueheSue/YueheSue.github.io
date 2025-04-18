import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert
} from '@mui/material';

function App() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captchaAnswer: ''
  });
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const canvasRef = useRef(null);

  // Generate random color for CAPTCHA noise
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Draw CAPTCHA on canvas
  const drawCaptcha = (num1, num2) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add noise (random lines)
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = getRandomColor();
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Add dots
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = getRandomColor();
      ctx.fill();
    }
    
    // Draw math equation
    const text = `${num1} + ${num2} = ?`;
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    // Add wavy effect to text
    const characters = text.split('');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    characters.forEach((char, i) => {
      const x = centerX - (text.length * 10) + (i * 20);
      const y = centerY + Math.sin(i * 0.5) * 5;
      ctx.fillText(char, x, y);
    });
  };

  // Generate new captcha numbers
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptcha({ num1, num2 });
    drawCaptcha(num1, num2);
  };

  // Generate captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!formData.username || !formData.password || !formData.captchaAnswer) {
      setError('Please fill in all fields');
      return;
    }

    // Validate captcha
    const correctAnswer = captcha.num1 + captcha.num2;
    if (parseInt(formData.captchaAnswer) !== correctAnswer) {
      setError('Incorrect CAPTCHA answer');
      generateCaptcha();
      setFormData(prev => ({ ...prev, captchaAnswer: '' }));
      return;
    }

    // If everything is valid
    setSuccess(true);
    setError('');
  };

  const handleRefreshCaptcha = () => {
    generateCaptcha();
    setFormData(prev => ({ ...prev, captchaAnswer: '' }));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login Demo
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              Solve the math CAPTCHA:
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: 2 
            }}>
              <canvas
                ref={canvasRef}
                width="200"
                height="60"
                style={{ 
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginBottom: '10px'
                }}
              />
              <Button
                size="small"
                onClick={handleRefreshCaptcha}
                sx={{ mb: 1 }}
              >
                Refresh CAPTCHA
              </Button>
            </Box>
            <TextField
              fullWidth
              label="Enter the sum"
              name="captchaAnswer"
              type="number"
              value={formData.captchaAnswer}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Box>

          {error && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {success && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="success">Login successful!</Alert>
            </Box>
          )}

          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            type="submit"
            size="large"
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default App; 
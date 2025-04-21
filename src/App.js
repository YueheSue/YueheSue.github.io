import React, { useState, useEffect } from 'react';
// Import styles directly
import 'element-plus/dist/index.css';
import './App.css';
// Remove unused import
// import FormFillPage from './FormFillPage';

// For React apps, we'll use a simpler approach without Element Plus components
// since they aren't fully compatible with React out of the box
function App({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    textCaptchaAnswer: ''
  });
  const [textCaptcha, setTextCaptcha] = useState({
    text: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loggedIn, setLoggedIn] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [userInfo, setUserInfo] = useState(null);

  // Helper function to generate random color for CAPTCHA noise
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Create Text CAPTCHA image
  const createTextCaptchaImage = (text) => {
    const canvas = document.createElement('canvas');
    canvas.width = 180;
    canvas.height = 70;
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
    
    // Draw text
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    // Add wavy effect to text
    const characters = text.split('');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    characters.forEach((char, i) => {
      const x = centerX - (text.length * 8) + (i * 16);
      const y = centerY + Math.sin(i * 0.5) * 5;
      // Add random rotation to each character
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });

    // Convert canvas to image URL
    return canvas.toDataURL('image/png');
  };

  // Generate random string for text captcha
  const generateRandomString = (length = 6) => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Generate new text captcha
  const generateTextCaptcha = () => {
    const text = generateRandomString(5);
    
    // Create image URL for the text captcha
    const imageUrl = createTextCaptchaImage(text);
    
    setTextCaptcha({ text, imageUrl });
  };

  // Generate captcha on component mount
  useEffect(() => {
    generateTextCaptcha();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!formData.username || !formData.password || !formData.textCaptchaAnswer) {
      setError('Please fill in all fields');
      return;
    }
    
    // Validate text captcha
    const correctTextAnswer = textCaptcha.text;
    const userTextAnswer = formData.textCaptchaAnswer;
    
    if (userTextAnswer.toLowerCase() !== correctTextAnswer.toLowerCase()) {
      setError('Incorrect text CAPTCHA answer');
      generateTextCaptcha();
      setFormData(prev => ({ ...prev, textCaptchaAnswer: '' }));
      return;
    }

    // If everything is valid
    setSuccess(true);
    setError('');
    
    // Immediately call onLogin for router to handle redirection
    onLogin({ username: formData.username });
  };

  const handleRefreshTextCaptcha = () => {
    generateTextCaptcha();
    setFormData(prev => ({ ...prev, textCaptchaAnswer: '' }));
  };

  // eslint-disable-next-line no-unused-vars
  const handleLogout = () => {
    setLoggedIn(false);
    setSuccess(false);
    setUserInfo(null);
    setFormData({
      username: '',
      password: '',
      textCaptchaAnswer: ''
    });
    generateTextCaptcha();
  };
  
  return (
    <div className="app-container">
      <div className="login-form">
        <h1 className="form-title">Login Demo</h1>
        
        <form onSubmit={handleSubmit} className="el-form">
          <div className="el-form-item">
            <label className="el-form-item__label">Username</label>
            <div className="el-form-item__content">
              <input
                type="text"
                className="el-input__inner"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="el-form-item">
            <label className="el-form-item__label">Password</label>
            <div className="el-form-item__content">
              <input
                type="password"
                className="el-input__inner"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className="captcha-section">
            <h4>Type the text shown below:</h4>
            <div className="captcha-container">
              <div className="el-form-item captcha-input">
                <div className="el-form-item__content">
                  <input
                    type="text"
                    className="el-input__inner"
                    name="textCaptchaAnswer"
                    value={formData.textCaptchaAnswer}
                    onChange={handleInputChange}
                    placeholder="Enter the text"
                  />
                </div>
              </div>
              <div className="captcha-image-container">
                <img
                  src={textCaptcha.imageUrl}
                  alt="Text CAPTCHA"
                  className="captcha-image"
                />
                <button
                  type="button"
                  className="el-button el-button--default el-button--small"
                  onClick={handleRefreshTextCaptcha}
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="message-container el-alert el-alert--error">
              <div className="el-alert__content">
                <span className="el-alert__title">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="message-container el-alert el-alert--success">
              <div className="el-alert__content">
                <span className="el-alert__title">Login successful!</span>
              </div>
            </div>
          )}

          <div className="button-container">
            <button 
              type="submit" 
              className="el-button el-button--primary submit-button"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App; 
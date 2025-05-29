import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, Paper, IconButton } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === username && u.password === password);
    if (user) {
      login(username);
      navigate('/');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleBackToLanding = () => {
    navigate('/landing');
  };

  return (
    <Box 
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      position="relative"
      sx={{
        backgroundImage: 'url("/images/login.jpg")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        
        // Dark overlay for better contrast
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }
      }}
    >
      {/* Back to Landing Page Button */}
      <IconButton 
        onClick={handleBackToLanding}
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
          zIndex: 3, // Above overlay and form
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Paper 
        sx={{
          padding: 4,
          width: 350,
          maxWidth: '90vw', // Responsive width
          backgroundColor: 'rgba(255, 255, 255, 0.98)', // More opaque for better text visibility
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          zIndex: 2, // Above overlay
          position: 'relative',
        }} 
        elevation={0} // Remove default elevation since we're using custom shadow
      >
        <Typography 
          variant="h4" 
          mb={3} 
          textAlign="center"
          sx={{
            fontWeight: 600,
            color: '#333',
            textShadow: 'none', // Ensure no text shadow interference
          }}
        >
          Login
        </Typography>
        
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
          sx={{
            '& .MuiInputLabel-root': {
              color: '#666',
              pointerEvents: 'none',
            },
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              '& input': {
                color: '#333',
                zIndex: 1,
              },
              '& fieldset': {
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#999',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#26a69a',
              },
            },
          }}
        />
        
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          sx={{
            '& .MuiInputLabel-root': {
              color: '#666',
              pointerEvents: 'none',
            },
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              '& input': {
                color: '#333',
                zIndex: 1,
              },
              '& fieldset': {
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#999',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#26a69a',
              },
            },
          }}
        />
        
        <Button
          variant="contained"
          fullWidth
          sx={{ 
            mt: 3,
            mb: 2,
            py: 1.5,
            background: 'linear-gradient(45deg, #ff5252, #26a69a)',
            color: 'white',
            fontWeight: 600,
            fontSize: '1.1rem',
            '&:hover': {
              background: 'linear-gradient(45deg, #e04848, #22958a)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
          onClick={handleLogin}
        >
          Login
        </Button>
        
        <Typography 
          variant="body2" 
          mt={2} 
          textAlign="center"
          sx={{
            color: '#555',
            '& a': {
              color: '#26a69a',
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          }}
        >
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Typography>
        
        <Typography 
          variant="body2" 
          mt={1} 
          textAlign="center"
          sx={{
            '& a': {
              color: '#777',
              textDecoration: 'none',
              fontSize: '0.9rem',
              '&:hover': {
                color: '#555',
              },
            },
          }}
        >
          <Link to="/landing">
            ← Back to Home
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
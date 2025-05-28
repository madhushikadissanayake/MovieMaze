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
        
        // Optional: Add overlay for better text readability
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay
          zIndex: 0,
        },
        
        // Ensure children are above the overlay
        '& > *': {
          position: 'relative',
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
          color: 'white', // Changed to white for better visibility
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
          zIndex: 2, // Ensure it's above the overlay
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Paper 
        sx={{ 
          padding: 4, 
          width: 350,
          // Optional: Make the paper slightly transparent
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)', // Adds a nice blur effect
        }} 
        elevation={6} // Increased elevation for better visibility
      >
        <Typography variant="h5" mb={2} textAlign="center">Login</Typography>
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
        <Typography variant="body2" mt={2} textAlign="center">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Typography>
        <Typography variant="body2" mt={1} textAlign="center">
          <Link to="/landing" style={{ textDecoration: 'none', color: 'inherit', opacity: 0.7 }}>
            ← Back to Home
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
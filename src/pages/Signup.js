import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, IconButton } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    if (!name || !email || !password) {
      alert('Please fill out all fields.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.find(u => u.email === email);
    if (userExists) {
      alert('A user with this email already exists.');
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! You can now log in.');
    navigate('/login');
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
        backgroundImage: 'url("/images/signup.jpg")', 
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
          width: 400,
          maxWidth: '90vw',
          backgroundColor: 'rgba(255, 255, 255, 0.98)', // More opaque for better text visibility
          backdropFilter: 'blur(15px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.2)',
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
            fontWeight: 700,
            color: '#333',
            textShadow: 'none', // Ensure no text shadow interference
          }}
        >
          Sign Up
        </Typography>
        
        <TextField
          fullWidth
          label="Full Name"
          margin="normal"
          value={name}
          onChange={e => setName(e.target.value)}
          variant="outlined"
          autoComplete="name"
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
          label="Email"
          margin="normal"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          variant="outlined"
          autoComplete="email"
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
          margin="normal"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          variant="outlined"
          autoComplete="new-password"
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
            fontWeight: 700,
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            boxShadow: '0 4px 15px 0 rgba(255, 82, 82, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #e04848, #22958a)',
              boxShadow: '0 6px 20px 0 rgba(255, 82, 82, 0.4)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
          onClick={handleSignup}
        >
          Sign Up
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
          Already have an account? <Link to="/login">Log in</Link>
        </Typography>
        

      </Paper>
    </Box>
  );
};

export default Signup;
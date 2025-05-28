import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

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

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      sx={{
    
        backgroundImage: 'url("/images/signup.jpg")',
        
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        
        // Optional: Add an overlay for better text readability
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)', // Dark overlay
          zIndex: 1,
        }
      }}
    >
      <Paper 
        sx={{ 
          padding: 4, 
          width: 400,
          position: 'relative',
          zIndex: 2, // Ensure the form appears above the overlay
          backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly transparent for glass effect
          backdropFilter: 'blur(10px)', // Optional: glass morphism effect
        }} 
        elevation={3}
      >
        <Typography variant="h5" mb={2}>Sign Up</Typography>
        <TextField
          fullWidth
          label="Full Name"
          margin="normal"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          margin="normal"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSignup}>
          Sign Up
        </Button>
        <Typography variant="body2" mt={2}>
          Already have an account? <Link to="/login">Log in</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signup;
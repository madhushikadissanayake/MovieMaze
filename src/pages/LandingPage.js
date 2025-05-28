import React, { useContext, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Redirect to home if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/images/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        color: 'white',
        textAlign: 'center',
        px: 2,
      }}
    >
      {/* Application Name */}
      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontSize: { xs: '3rem', sm: '4rem', md: '5rem', lg: '6rem' },
          fontWeight: 'bold',
          mb: 2,
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
          backgroundSize: '400% 400%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'gradientShift 3s ease-in-out infinite',
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      >
        MovieMaze
      </Typography>

      {/* Tagline */}
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
          mb: 4,
          opacity: 0.9,
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
          maxWidth: '600px',
        }}
      >
        Discover your next favorite movie in the ultimate cinematic journey
      </Typography>

      {/* Get Started Button */}
      <Button
        variant="contained"
        size="large"
        onClick={handleGetStarted}
        endIcon={<ArrowForwardIcon />}
        sx={{
          fontSize: { xs: '1rem', sm: '1.2rem' },
          px: { xs: 3, sm: 4 },
          py: { xs: 1.5, sm: 2 },
          borderRadius: '50px',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          textTransform: 'none',
          fontWeight: 'bold',
          '&:hover': {
            background: 'linear-gradient(45deg, #ff5252, #26a69a)',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        }}
      >
        Get Started
      </Button>

      {/* Floating Elements for Visual Appeal */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '60px',
          height: '60px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '40px',
          height: '40px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          animation: 'float 4s ease-in-out infinite reverse',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: '25%',
          left: '20%',
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
    </Box>
  );
};

export default LandingPage;
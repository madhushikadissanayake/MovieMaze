// About.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider
} from '@mui/material';
import {
  Movie as MovieIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';

const About = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const features = [
    {
      icon: <SearchIcon fontSize="large" />,
      title: 'Movie Search',
      description: 'Discover movies with our powerful search functionality. Find your next favorite film by title, genre, or keywords.'
    },
    {
      icon: <FavoriteIcon fontSize="large" />,
      title: 'Favorites Collection',
      description: 'Save movies you love to your personal favorites list. Never lose track of films you want to watch or recommend.'
    },
    {
      icon: <PersonIcon fontSize="large" />,
      title: 'Personal Profile',
      description: 'Customize your experience with a personal profile. Track your movie preferences and viewing history.'
    },
    {
      icon: <MovieIcon fontSize="large" />,
      title: 'Detailed Information',
      description: 'Get comprehensive details about every movie including ratings, cast, plot summaries, and release information.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Back Button */}
      <Box mb={3}>
        <IconButton
          onClick={handleGoBack}
          sx={{
            width: 48,
            height: 48,
            background: 'linear-gradient(45deg, #e04848, #22958a)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #d63031, #00b894)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      {/* Header Section */}
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #e04848, #22958a)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          About MovieMaze
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
        >
          Your ultimate destination for discovering, exploring, and organizing your movie experience
        </Typography>
      </Box>

      {/* Mission Statement */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 6, 
          background: 'linear-gradient(135deg, rgba(224, 72, 72, 0.1), rgba(34, 149, 138, 0.1))',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
          Our Mission
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          MovieMaze is designed to be your personal movie companion, helping you navigate through the vast
          world of cinema. Whether you're looking for your next binge-watch, trying to remember that movie
          you saw years ago, or building a collection of favorites, we've got you covered. Our platform
          combines powerful search capabilities with an intuitive user experience to make movie discovery
          both fun and effortless.
        </Typography>
      </Paper>

      {/* Features Section */}
      <Box mb={6}>
        <Typography variant="h4" gutterBottom textAlign="center" mb={4} fontWeight="bold">
          Key Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Box 
                      sx={{ 
                        color: 'primary.main',
                        mt: 0.5
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Contact/Footer Section */}
      <Box textAlign="center">
        <Divider sx={{ mb: 3 }} />
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Get Started Today
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
          Join MovieMaze and start building your personalized movie collection. 
          Discover new films, save your favorites, and never run out of great movies to watch!
        </Typography>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary">
            © 2025 MovieMaze. Built with ❤️ for movie enthusiasts.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default About;
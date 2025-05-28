import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import { Typography, Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Favorites() {
  const { favorites } = useContext(MovieContext);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <Box sx={{ px: 3, pt: 2 }}>
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <Button 
          onClick={handleBackClick}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{ 
            color: 'primary.main',
            borderColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white'
            }
          }}
        >
          Back to Home
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>Your Favorites</Typography>
      {favorites.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {favorites.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        </Box>
      ) : (
        <Typography>No favorite movies yet. Add some!</Typography>
      )}
    </Box>
  );
}
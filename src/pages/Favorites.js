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
          variant="contained"
          sx={{ 
            background: 'linear-gradient(45deg, #e04848, #22958a)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            minWidth: '50px',
            width: '50px',
            height: '50px',
            fontSize: '28px',
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(45deg, #c93a3a, #1e7a70)',
              transform: 'scale(1.1)'
            }
          }}
        >
          ‹
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
import { useEffect, useState } from 'react';
import { fetchTrendingMovies } from '../api/tmdb';
import { Box, Typography, CircularProgress } from '@mui/material';
import MovieCard from './MovieCard';

const TrendingSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const res = await fetchTrendingMovies();
        setMovies(res.data.results);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTrending();
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;

  return (
    <Box sx={{ px: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Trending Movies</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </Box>
    </Box>
  );
};

export default TrendingSection;

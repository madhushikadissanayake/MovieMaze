import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMovieDetails } from '../api/tmdb';
import {
  Box,
  Typography,
  Chip,
  Grid,
  CircularProgress,
  Card,
  CardMedia,
  Avatar,
  Button,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await getMovieDetails(id);
        setMovie(res.data);
      } catch (error) {
        console.error("Failed to load movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;

  if (!movie) return <Typography align="center">Movie not found.</Typography>;

  const trailer = movie.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
  const cast = movie.credits?.cast?.slice(0, 6);

  return (
    <Box sx={{ p: 3 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Poster */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          </Card>
        </Grid>

        {/* Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h4" gutterBottom>{movie.title}</Typography>
          <Typography variant="body1" gutterBottom>{movie.overview}</Typography>
          <Box sx={{ mt: 2, mb: 1 }}>
            {movie.genres.map((genre) => (
              <Chip key={genre.id} label={genre.name} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>
          <Typography variant="subtitle2" color="text.secondary">
            Release Date: {movie.release_date} | Rating: {movie.vote_average}/10
          </Typography>

          {/* Trailer */}
          {trailer && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>Trailer</Typography>
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="YouTube trailer"
                allowFullScreen
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Cast Section */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>Top Cast</Typography>
        <Grid container spacing={2}>
          {cast?.map(actor => (
            <Grid key={actor.id}>
              <Box sx={{ textAlign: 'center', width: 100 }}>
                <Avatar
                  alt={actor.name}
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  sx={{ width: 80, height: 80, mx: 'auto' }}
                />
                <Typography variant="caption">{actor.name}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
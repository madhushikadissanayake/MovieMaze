import { Card, CardMedia, CardContent, Typography, Rating, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

const MovieCard = ({ movie }) => {
  return (
    <Card sx={{ width: 200, m: 1, textDecoration: 'none', position: 'relative' }}>
      <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardMedia
          component="img"
          image={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          height="300"
        />
      </Link>
      <CardContent sx={{ p: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" noWrap>{movie.title}</Typography>
          <FavoriteButton movie={movie} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {movie.release_date?.split('-')[0]}
        </Typography>
        <Rating value={movie.vote_average / 2} precision={0.5} readOnly size="small" />
      </CardContent>
    </Card>
  );
};

export default MovieCard;

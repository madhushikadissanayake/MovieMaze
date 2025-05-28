import { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { MovieContext } from '../context/MovieContext';

const FavoriteButton = ({ movie }) => {
  const { addFavorite, removeFavorite, isFavorite } = useContext(MovieContext);
  const favorite = isFavorite(movie.id);

  const toggleFavorite = () => {
    favorite ? removeFavorite(movie.id) : addFavorite(movie);
  };

  return (
    <Tooltip title={favorite ? "Remove from Favorites" : "Add to Favorites"}>
      <IconButton onClick={toggleFavorite} color="secondary">
        {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton;

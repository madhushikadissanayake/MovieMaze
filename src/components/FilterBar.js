import { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

const FilterBar = ({ genre, setGenre, year, setYear }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
      );
      setGenres(res.data.genres);
    };
    fetchGenres();
  }, []);

  const years = Array.from({ length: 76 }, (_, i) => 2025 - i);

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      {/* Genre Filter */}
      <FormControl fullWidth>
        <InputLabel>Genre</InputLabel>
        <Select
          value={genre}
          label="Genre"
          onChange={(e) => setGenre(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {genres.map((g) => (
            <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Year Filter */}
      <FormControl fullWidth>
        <InputLabel>Year</InputLabel>
        <Select
          value={year}
          label="Year"
          onChange={(e) => setYear(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {years.map((y) => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterBar;

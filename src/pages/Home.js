import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Rating,
  InputAdornment,
  Button,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [discoverMovies, setDiscoverMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchGenres = useCallback(async () => {
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
      setGenres(res.data.genres);
    } catch (error) {
      console.error('Failed to fetch genres', error);
    }
  }, []);

  const fetchTrendingMovies = useCallback(async () => {
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
      setTrendingMovies(res.data.results);
      
      // Set the first trending movie as featured
      if (res.data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(5, res.data.results.length));
        setFeaturedMovie(res.data.results[randomIndex]);
      }
    } catch (error) {
      console.error('Failed to fetch trending movies', error);
    }
  }, []);

  const fetchDiscoverMovies = useCallback(async (page = 1, append = false) => {
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          api_key: process.env.REACT_APP_TMDB_API_KEY,
          with_genres: selectedGenre,
          primary_release_year: selectedYear,
          'vote_average.gte': minRating,
          page: page
        }
      });
      
      if (append) {
        setDiscoverMovies(prev => [...prev, ...res.data.results]);
      } else {
        setDiscoverMovies(res.data.results);
        setCurrentPage(1);
      }
      setTotalPages(res.data.total_pages);
    } catch (error) {
      console.error('Failed to fetch discover movies', error);
    }
  }, [selectedGenre, selectedYear, minRating]);

  const searchMovies = useCallback(async (query, page = 1, append = false) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const res = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: process.env.REACT_APP_TMDB_API_KEY,
          query: query,
          include_adult: false,
          page: page
        }
      });
      
      if (append) {
        setSearchResults(prev => [...prev, ...res.data.results]);
      } else {
        setSearchResults(res.data.results);
        setCurrentPage(1);
      }
      setTotalPages(res.data.total_pages);
    } catch (error) {
      console.error('Failed to search movies', error);
      if (!append) {
        setSearchResults([]);
      }
    }
  }, []);

  useEffect(() => {
    fetchGenres();
    fetchTrendingMovies();
  }, [fetchGenres, fetchTrendingMovies]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchDiscoverMovies();
      setCurrentPage(1);
    }
  }, [fetchDiscoverMovies, searchQuery]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchMovies(searchQuery);
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchMovies]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleLoadMore = async () => {
    if (currentPage >= totalPages || isLoadingMore) return;
    
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    
    try {
      if (isSearching) {
        await searchMovies(searchQuery, nextPage, true);
      } else {
        await fetchDiscoverMovies(nextPage, true);
      }
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Failed to load more movies', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const getMovieGenres = (genreIds) => {
    return genreIds?.map(id => genres.find(g => g.id === id)?.name).filter(Boolean) || [];
  };

  // Determine which movies to display
  const moviesToDisplay = isSearching ? searchResults : discoverMovies;
  const sectionTitle = isSearching ? `Search Results for "${searchQuery}"` : 'Discover Movies';

  return (
    <Box>
      {/* Hero Section with Search and Filters */}
      {!isSearching && featuredMovie && (
        <Box
          sx={{
            position: 'relative',
            height: { xs: '50vh', md: '65vh' },
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 30%, transparent 70%), url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: 'white',
            mb: 4
          }}
        >
          {/* Featured Movie Info */}
          <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: { xs: '100%', md: '50%' } }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 1.5,
                fontSize: { xs: '1.8rem', md: '2.8rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
              }}
            >
              {featuredMovie.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
              <Chip 
                icon={<StarIcon />} 
                label={`${featuredMovie.vote_average?.toFixed(1)}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Typography variant="body2">
                {new Date(featuredMovie.release_date).getFullYear()}
              </Typography>
              {getMovieGenres(featuredMovie.genre_ids).slice(0, 3).map((genre, index) => (
                <Chip 
                  key={index}
                  label={genre}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
                />
              ))}
            </Box>

            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2, 
                fontSize: { xs: '0.85rem', md: '1rem' },
                lineHeight: 1.5,
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                display: '-webkit-box',
                WebkitLineClamp: { xs: 2, md: 3 },
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {featuredMovie.overview}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                sx={{
                  bgcolor: 'white',
                  color: 'black',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                PLAY
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<InfoIcon />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                MORE INFO
              </Button>
            </Box>
          </Box>

          {/* Search and Filter Controls */}
          <Box 
            sx={{ 
              p: { xs: 2, md: 4 },
              background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4))',
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* Search Bar */}
            <Box display="flex" justifyContent="center" mb={2}>
              <TextField
                label="Search movies..."
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ 
                  width: { xs: '100%', sm: '75%', md: '50%' },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.8)',
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'rgba(255,255,255,0.8)' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Filter Controls */}
            <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.8)' }}>Genre</InputLabel>
                <Select 
                  value={selectedGenre} 
                  label="Genre" 
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {genres.map((genre) => (
                    <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.8)' }}>Year</InputLabel>
                <Select 
                  value={selectedYear} 
                  label="Year" 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {[...Array(30)].map((_, i) => {
                    const year = 2025 - i;
                    return <MenuItem key={year} value={year}>{year}</MenuItem>;
                  })}
                </Select>
              </FormControl>

              <Box display="flex" alignItems="center" sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1, px: 2, py: 1 }}>
                <Typography sx={{ mr: 1, color: 'white' }}>Min Rating:</Typography>
                <Rating
                  value={minRating}
                  onChange={(e, newValue) => setMinRating(newValue)}
                  precision={0.5}
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: '#ffd700',
                    },
                    '& .MuiRating-iconEmpty': {
                      color: 'rgba(255,255,255,0.5)',
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Search Only Hero (when searching) */}
      {isSearching && (
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 4,
            mb: 4
          }}
        >
          <Box display="flex" justifyContent="center" p={3}>
            <TextField
              label="Search movies..."
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ 
                width: { xs: '100%', sm: '75%', md: '50%' },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      )}

      <Box p={3}>
        {/* Trending Movies - Hide when searching */}
        {!isSearching && (
          <>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Trending Movies
            </Typography>
            <Grid container spacing={2} mb={5}>
              {trendingMovies.map((movie) => (
                <Grid item key={movie.id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Search Results or Discover Movies */}
        <Typography variant="h5" mt={isSearching ? 0 : 5} gutterBottom sx={{ fontWeight: 'bold' }}>
          {sectionTitle}
        </Typography>
        {moviesToDisplay.length === 0 ? (
          <Typography variant="body1" color="text.secondary" mt={2}>
            {isSearching ? 'No movies found for your search.' : 'No results found.'}
          </Typography>
        ) : (
          <>
            <Grid container spacing={2}>
              {moviesToDisplay.map((movie) => (
                <Grid item key={movie.id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
            
            {/* Load More Button */}
            {currentPage < totalPages && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Button
                  variant="contained"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    minWidth: 150,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '&:disabled': {
                      bgcolor: 'grey.400',
                    }
                  }}
                >
                  {isLoadingMore ? 'Loading...' : 'Load More'}
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Home;
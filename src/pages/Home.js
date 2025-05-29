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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [discoverMovies, setDiscoverMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

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

  const fetchMovieDetails = useCallback(async (movieId) => {
    try {
      setIsLoadingDetails(true);
      const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&append_to_response=videos,credits`);
      setMovieDetails(res.data);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch movie details', error);
      return null;
    } finally {
      setIsLoadingDetails(false);
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

  const handlePlayClick = async () => {
    if (!featuredMovie) return;
    
    const details = await fetchMovieDetails(featuredMovie.id);
    if (details?.videos?.results?.length > 0) {
      const trailer = details.videos.results.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube'
      ) || details.videos.results[0];
      
      if (trailer) {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
      } else {
        alert('No trailer available for this movie.');
      }
    } else {
      alert('No trailer available for this movie.');
    }
  };

  const handleInfoClick = async () => {
    if (!featuredMovie) return;
    
    await fetchMovieDetails(featuredMovie.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMovieDetails(null);
  };

  const getMovieGenres = (genreIds) => {
    return genreIds?.map(id => genres.find(g => g.id === id)?.name).filter(Boolean) || [];
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
            height: { xs: '75vh', sm: '85vh', md: '95vh', lg: '100vh' },
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
          <Box sx={{ p: { xs: 3, md: 6, lg: 8 }, maxWidth: { xs: '100%', md: '50%' }, mt: { xs: 4, md: 6, lg: 8 } }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                lineHeight: 1.1
              }}
            >
              {featuredMovie.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<StarIcon />} 
                label={`${featuredMovie.vote_average?.toFixed(1)}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '1rem', py: 2 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {new Date(featuredMovie.release_date).getFullYear()}
              </Typography>
              {getMovieGenres(featuredMovie.genre_ids).slice(0, 3).map((genre, index) => (
                <Chip 
                  key={index}
                  label={genre}
                  size="medium"
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9rem' }}
                />
              ))}
            </Box>

            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                fontSize: { xs: '1rem', md: '1.2rem', lg: '1.3rem' },
                lineHeight: 1.6,
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                display: '-webkit-box',
                WebkitLineClamp: { xs: 3, md: 4, lg: 5 },
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                maxWidth: { lg: '80%' }
              }}
            >
              {featuredMovie.overview}
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={handlePlayClick}
                sx={{
                  bgcolor: 'white',
                  color: 'black',
                  fontWeight: 'bold',
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: '1rem', md: '1.1rem' },
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
                onClick={handleInfoClick}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 'bold',
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  borderWidth: '2px',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderWidth: '2px'
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
              p: { xs: 3, md: 6 },
              background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4))',
              backdropFilter: 'blur(10px)',
              minHeight: { xs: '160px', md: '180px' }
            }}
          >
            {/* Search Bar */}
            <Box display="flex" justifyContent="center" mb={3}>
              <TextField
                label="Search movies..."
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ 
                  width: { xs: '100%', sm: '75%', md: '60%', lg: '50%' },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    height: '56px',
                    fontSize: '1.1rem',
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
                    fontSize: '1.1rem',
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    fontSize: '1.1rem',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.5rem' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Filter Controls */}
            <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>Genre</InputLabel>
                <Select 
                  value={selectedGenre} 
                  label="Genre" 
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    height: '56px',
                    fontSize: '1rem',
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

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>Year</InputLabel>
                <Select 
                  value={selectedYear} 
                  label="Year" 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    height: '56px',
                    fontSize: '1rem',
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

              <Box display="flex" alignItems="center" sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1, px: 3, py: 2, height: '56px' }}>
                <Typography sx={{ mr: 2, color: 'white', fontSize: '1rem', fontWeight: 'medium' }}>Min Rating:</Typography>
                <Rating
                  value={minRating}
                  onChange={(e, newValue) => setMinRating(newValue)}
                  precision={0.5}
                  size="large"
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

      {/* Search Only Hero (when searching) - FIXED STYLING */}
      {isSearching && (
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 6,
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
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  height: '56px',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.8)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(0,0,0,0.7)',
                  fontSize: '1rem',
                  '&.Mui-focused': {
                    color: 'rgba(0,0,0,0.8)',
                  }
                },
                '& .MuiInputBase-input': {
                  color: 'rgba(0,0,0,0.9)',
                  fontSize: '1rem',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(0,0,0,0.6)' }} />
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
                <Grid item xs={6} sm={4} md={3} lg={2.4} xl={2} key={movie.id}>
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
                <Grid item xs={6} sm={4} md={3} lg={2.4} xl={2} key={movie.id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
            
            {/* Load More Button with Gradient */}
            {currentPage < totalPages && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Button
                  variant="contained"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  sx={{
                    background: 'linear-gradient(45deg, #e04848, #22958a)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    minWidth: 150,
                    border: 'none',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #d63838, #1a7a6f)',
                      boxShadow: '0 4px 15px rgba(224, 72, 72, 0.4)',
                    },
                    '&:disabled': {
                      background: 'grey.400',
                      color: 'white',
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

      {/* Movie Details Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundImage: movieDetails?.backdrop_path 
              ? `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path})`
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            minHeight: '60vh'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            {movieDetails?.title || featuredMovie?.title}
          </Typography>
          <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {isLoadingDetails ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <Typography>Loading movie details...</Typography>
            </Box>
          ) : movieDetails && (
            <>
              {/* Movie Info Row */}
              <Box display="flex" flexWrap="wrap" gap={3} mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <StarIcon sx={{ color: '#ffd700' }} />
                  <Typography variant="h6">{movieDetails.vote_average?.toFixed(1)}/10</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarTodayIcon />
                  <Typography>{new Date(movieDetails.release_date).getFullYear()}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTimeIcon />
                  <Typography>{formatRuntime(movieDetails.runtime)}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <LanguageIcon />
                  <Typography>{movieDetails.original_language?.toUpperCase()}</Typography>
                </Box>
              </Box>

              {/* Genres */}
              <Box mb={3}>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {movieDetails.genres?.map((genre) => (
                    <Chip 
                      key={genre.id}
                      label={genre.name}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Overview */}
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {movieDetails.overview}
              </Typography>

              <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', mb: 3 }} />

              {/* Additional Details */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Production</Typography>
                  <Typography><strong>Budget:</strong> {formatCurrency(movieDetails.budget)}</Typography>
                  <Typography><strong>Revenue:</strong> {formatCurrency(movieDetails.revenue)}</Typography>
                  {movieDetails.production_companies?.length > 0 && (
                    <Typography><strong>Studio:</strong> {movieDetails.production_companies[0].name}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Cast</Typography>
                  {movieDetails.credits?.cast?.slice(0, 5).map((actor, index) => (
                    <Typography key={actor.id}>
                      <strong>{actor.name}</strong> as {actor.character}
                    </Typography>
                  ))}
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={handlePlayClick}
            sx={{
              bgcolor: 'white',
              color: 'black',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)'
              }
            }}
          >
            Watch Trailer
          </Button>
          <Button onClick={handleCloseModal} sx={{ color: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
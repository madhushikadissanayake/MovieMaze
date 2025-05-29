import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { getTheme } from './theme';

import { ThemeContext, ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import AuthProvider, { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import the Footer component
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Favorites from './pages/Favorites';
import ProtectedRoute from './components/ProtectedRoute';
import MovieDetails from './pages/MovieDetails';
import Profile from './pages/Profile';
import About from './pages/About';

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  const { mode } = useContext(ThemeContext);
  const theme = getTheme(mode);
  const location = useLocation();

  // Define paths where footer should be hidden
  const hideFooterPaths = ['/landing', '/login', '/signup'];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {user && <Navbar />}
        
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            {/* Landing page - only show when user is not authenticated */}
            <Route path="/landing" element={!user ? <LandingPage /> : <ProtectedRoute><Home /></ProtectedRoute>} />
            
            {/* Authentication routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </Box>
        
        {/* Footer - conditionally show based on current route */}
        {!shouldHideFooter && <Footer />}
      </Box>
    </ThemeProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <CustomThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </CustomThemeProvider>
    </AuthProvider>
  );
}

export default App;
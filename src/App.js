import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';

import { ThemeContext, ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import AuthProvider, { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Favorites from './pages/Favorites';
import ProtectedRoute from './components/ProtectedRoute';
import MovieDetails from './pages/MovieDetails';

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  const { mode } = useContext(ThemeContext);
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {user && <Navbar />}
        <Routes>
          {/* Landing page - only show when user is not authenticated */}
          <Route path="/landing" element={!user ? <LandingPage /> : <ProtectedRoute><Home /></ProtectedRoute>} />
          
          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <CustomThemeProvider>
        <AppRoutes />
      </CustomThemeProvider>
    </AuthProvider>
  );
}

export default App;
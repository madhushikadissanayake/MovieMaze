import React, { useContext, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Brightness4, 
  Brightness7, 
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { mode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  if (!user) return null;

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleClose();
  };

  // Function to get user initials from name, username, or email
  const getUserInitials = () => {
    const displayName = getDisplayName();
    
    if (displayName && displayName.trim()) {
      // Split by space and take first letter of each word
      return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    } else if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Function to get display name - prioritize name, then username, then email
  const getDisplayName = () => {
    // Debug: Let's see what's in the user object
    console.log('User object:', user);
    
    // Priority order: name -> username -> email prefix -> fallback
    if (user.name && user.name.trim()) {
      return user.name.trim();
    } else if (user.displayName && user.displayName.trim()) {
      return user.displayName.trim();
    } else if (user.firstName && user.firstName.trim()) {
      return user.firstName.trim();
    } else if (user.fullName && user.fullName.trim()) {
      return user.fullName.trim();
    } else if (user.username && user.username.trim()) {
      return user.username.trim();
    } else if (user.email) {
      // Extract name part from email (part before @)
      return user.email.split('@')[0];
    }
    
    return 'User'; // Final fallback
  };

  // Function to generate a consistent color based on user info
  const getAvatarColor = () => {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
      '#009688', '#4caf50', '#8bc34a', '#cddc39',
      '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
    ];
    const displayName = getDisplayName();
    const userString = displayName !== 'User' ? displayName : (user.email || 'user');
    const index = userString.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get profile image URL - check all possible image fields
  const getProfileImage = () => {
    return user.profileImage || 
           user.avatar || 
           user.picture || 
           user.image ||
           user.photoURL ||
           user.profilePicture;
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(45deg, #e04848, #22958a)',
        boxShadow: 'none'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          color="inherit" 
          sx={{ 
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          MovieMaze
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          
          <Button color="inherit" component={Link} to="/favorites">
            Favorites
          </Button>
          
          <IconButton
            onClick={handleAvatarClick}
            sx={{ p: 0, ml: 1 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: getProfileImage() ? 'transparent' : getAvatarColor(),
                fontSize: '0.875rem',
                fontWeight: 'bold',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  border: '2px solid rgba(255, 255, 255, 0.6)',
                }
              }}
              src={getProfileImage() || undefined}
              alt={getDisplayName()}
            >
              {!getProfileImage() && getUserInitials()}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                minWidth: 150,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {/* Clickable User Info Section */}
            <MenuItem 
              onClick={handleProfileClick} 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: getProfileImage() ? 'transparent' : getAvatarColor(),
                  fontSize: '0.75rem',
                }}
                src={getProfileImage() || undefined}
                alt={getDisplayName()}
              >
                {!getProfileImage() && getUserInitials()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {getDisplayName()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </MenuItem>
            
            {/* Logout Option */}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
// Profile.js
import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
  Fade,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { mode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || '',
    profileImage: user?.profileImage || null
  });
  const [previewImage, setPreviewImage] = useState(user?.profileImage || null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const fileInputRef = useRef(null);

  // Update local state when user context changes
  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        profileImage: user.profileImage || null
      });
      setPreviewImage(user.profileImage || null);
    }
  }, [user]);

  // Handle back navigation
  const handleBackToHome = () => {
    navigate('/');
  };

  // Get user initials for fallback avatar
  const getUserInitials = () => {
    // Priority: name -> username -> email
    if (editedUser.name && editedUser.name.trim()) {
      return editedUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    } else if (editedUser.username && editedUser.username.trim()) {
      return editedUser.username.substring(0, 2).toUpperCase();
    } else if (editedUser.email) {
      return editedUser.email[0].toUpperCase();
    }
    return 'U';
  };

  // Get avatar color
  const getAvatarColor = () => {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
      '#009688', '#4caf50', '#8bc34a', '#cddc39',
      '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
    ];
    // Use name first, then username, then email for color consistency
    const userString = editedUser.name || editedUser.username || editedUser.email || 'user';
    const index = userString.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Convert file to base64 for permanent storage
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Handle profile image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSaveError('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setSaveError('Please select a valid image file');
        return;
      }

      try {
        // Convert to base64 for permanent storage
        const base64Image = await fileToBase64(file);
        setPreviewImage(base64Image);
        setEditedUser(prev => ({
          ...prev,
          profileImage: base64Image
        }));
        setSaveError('');
      } catch (error) {
        console.error('Error processing image:', error);
        setSaveError('Failed to process image. Please try again.');
      }
    }
  };

  // Handle remove profile image
  const handleRemoveImage = () => {
    setPreviewImage(null);
    setEditedUser(prev => ({
      ...prev,
      profileImage: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle save changes
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    
    try {
      // Basic validation
      if (!editedUser.name.trim()) {
        setSaveError('Name is required');
        setIsSaving(false);
        return;
      }

      if (!editedUser.email.trim()) {
        setSaveError('Email is required');
        setIsSaving(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedUser.email)) {
        setSaveError('Please enter a valid email address');
        setIsSaving(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Prepare user data for update
      const updatedUserData = {
        ...editedUser,
        updatedAt: new Date().toISOString()
      };

      // Update user data in context and persist it
      if (updateUser) {
        await updateUser(updatedUserData);
      }

      // Save to localStorage for persistence across browser sessions
      const currentUser = JSON.parse(localStorage.getItem('movieMazeUser') || '{}');
      const persistedUser = {
        ...currentUser,
        ...updatedUserData
      };
      localStorage.setItem('movieMazeUser', JSON.stringify(persistedUser));
      
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || '',
      profileImage: user?.profileImage || null
    });
    setPreviewImage(user?.profileImage || null);
    setIsEditing(false);
    setSaveError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get display name for UI
  const getDisplayName = () => {
    if (editedUser.name && editedUser.name.trim()) {
      return editedUser.name.trim();
    } else if (editedUser.username && editedUser.username.trim()) {
      return editedUser.username.trim();
    } else if (editedUser.email) {
      return editedUser.email.split('@')[0];
    }
    return 'User';
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card elevation={3}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5">Please log in to view your profile.</Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Fade in timeout={800}>
        <Box>
          {/* Back Button */}
          <Box sx={{ mb: 3 }}>
            <IconButton
              onClick={handleBackToHome}
              sx={{
                width: 48,
                height: 48,
                background: 'linear-gradient(45deg, #e04848, #22958a)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #d63384, #1a7a6e)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 4px 12px rgba(224, 72, 72, 0.3)',
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>

          {/* Success Alert */}
          {saveSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Profile updated successfully!
            </Alert>
          )}

          {/* Error Alert */}
          {saveError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {saveError}
            </Alert>
          )}

          {/* Main Profile Card */}
          <Card 
            elevation={3}
            sx={{ 
              mb: 4,
              background: mode === 'dark' 
                ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Header with Edit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">
                  My Profile
                </Typography>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    sx={{
                      background: 'linear-gradient(45deg, #e04848, #22958a)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #d63384, #1a7a6e)',
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                      onClick={handleSave}
                      disabled={isSaving}
                      sx={{
                        background: 'linear-gradient(45deg, #4caf50, #45a049)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #45a049, #3d8b40)',
                        },
                        '&:disabled': {
                          background: '#ccc',
                        }
                      }}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={4}>
                {/* Left Column - Profile Image */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Profile Picture
                    </Typography>
                    
                    {/* Profile Avatar */}
                    <Box sx={{ position: 'relative', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 160,
                          height: 160,
                          fontSize: '3rem',
                          fontWeight: 'bold',
                          border: '4px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          bgcolor: previewImage ? 'transparent' : getAvatarColor(),
                        }}
                        src={previewImage || undefined}
                      >
                        {!previewImage && getUserInitials()}
                      </Avatar>
                      
                      {isEditing && (
                        <>
                          <IconButton
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              bgcolor: 'primary.main',
                              color: 'white',
                              '&:hover': { bgcolor: 'primary.dark' }
                            }}
                            component="label"
                          >
                            <PhotoCameraIcon />
                            <input
                              ref={fileInputRef}
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </IconButton>
                          
                          {previewImage && (
                            <IconButton
                              sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                bgcolor: 'error.main',
                                color: 'white',
                                width: 32,
                                height: 32,
                                '&:hover': { bgcolor: 'error.dark' }
                              }}
                              onClick={handleRemoveImage}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </>
                      )}
                    </Box>

                    {isEditing && (
                      <Typography variant="caption" color="text.secondary" textAlign="center">
                        Click the camera icon to upload a new image<br />
                        (Max size: 5MB, formats: JPG, PNG, GIF)
                      </Typography>
                    )}

                    {/* Display current name */}
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, textAlign: 'center' }}>
                      {getDisplayName()}
                    </Typography>
                  </Box>
                </Grid>

                {/* Right Column - User Information */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                      Account Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={3}>
                      {/* Full Name */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={isEditing ? editedUser.name : (user.name || '')}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                          variant={isEditing ? 'outlined' : 'filled'}
                          required={isEditing}
                          helperText={isEditing ? "Enter your full name as it appears on your ID" : ""}
                        />
                      </Grid>
                      
                      {/* Email */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={isEditing ? editedUser.email : (user.email || '')}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          variant={isEditing ? 'outlined' : 'filled'}
                          required={isEditing}
                          helperText={isEditing ? "This email will be used for login and notifications" : ""}
                        />
                      </Grid>
                      
                      {/* Username */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Username"
                          value={isEditing ? editedUser.username : (user.username || '')}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          disabled={!isEditing}
                          variant={isEditing ? 'outlined' : 'filled'}
                          helperText={isEditing ? "Choose a unique username (optional)" : ""}
                        />
                      </Grid>
                    </Grid>

                    {/* Account Details */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Account Details
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Card variant="outlined">
                            <CardContent sx={{ p: 2 }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Member Since
                              </Typography>
                              <Typography variant="body1" fontWeight="bold">
                                {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Card variant="outlined">
                            <CardContent sx={{ p: 2 }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Last Updated
                              </Typography>
                              <Typography variant="body1" fontWeight="bold">
                                {new Date(user.updatedAt || Date.now()).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Container>
  );
};

export default Profile;
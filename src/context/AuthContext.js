import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('movieMazeUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login function - can accept either simple username or full user object
  const login = (userData) => {
    let userObject;
    
    // If userData is a string, treat it as username and create user object
    if (typeof userData === 'string') {
      userObject = {
        username: userData,
        name: '',
        email: '',
        profileImage: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } else {
      // If userData is an object, use it directly but ensure required fields exist
      userObject = {
        username: userData.username || '',
        name: userData.name || '',
        email: userData.email || '',
        displayName: userData.displayName || '',
        firstName: userData.firstName || '',
        fullName: userData.fullName || '',
        profileImage: userData.profileImage || userData.avatar || userData.picture || userData.image || userData.photoURL || userData.profilePicture || null,
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString()
      };
    }

    localStorage.setItem('movieMazeUser', JSON.stringify(userObject));
    setUser(userObject);
  };

  // Update user function for profile updates
  const updateUser = async (updatedData) => {
    const updatedUser = {
      ...user,
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('movieMazeUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // Return a promise to simulate async operation
    return Promise.resolve(updatedUser);
  };

  // Register function for new user registration
  const register = (userData) => {
    const newUser = {
      username: userData.username || '',
      name: userData.name || '',
      email: userData.email || '',
      profileImage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('movieMazeUser', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('movieMazeUser');
    // Also remove the old 'user' key if it exists for backward compatibility
    localStorage.removeItem('user');
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null;
  };

  // Get user display name with fallback logic
  const getDisplayName = () => {
    if (!user) return 'User';
    
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
      return user.email.split('@')[0];
    }
    
    return 'User';
  };

  // Migration effect to handle old localStorage format
  useEffect(() => {
    const oldUser = localStorage.getItem('user');
    const newUser = localStorage.getItem('movieMazeUser');
    
    // If we have old format but no new format, migrate it
    if (oldUser && !newUser) {
      try {
        const oldUserData = JSON.parse(oldUser);
        if (oldUserData.username) {
          login(oldUserData.username);
          localStorage.removeItem('user'); // Clean up old storage
        }
      } catch (error) {
        console.error('Error migrating old user data:', error);
      }
    }
  }, []);

  const contextValue = {
    user,
    login,
    logout,
    register,
    updateUser,
    isAuthenticated,
    getDisplayName
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
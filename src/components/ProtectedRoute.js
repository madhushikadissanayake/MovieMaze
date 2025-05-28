import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If user is not authenticated, redirect to landing page
  return user ? children : <Navigate to="/landing" replace />;
};

export default ProtectedRoute;
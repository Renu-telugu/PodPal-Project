import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute component
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - The protected content
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // Otherwise, render the protected content
  return children;
};

export default ProtectedRoute; 
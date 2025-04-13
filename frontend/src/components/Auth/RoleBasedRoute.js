import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * RoleBasedRoute component
 * Protects routes based on user role
 * @param {Object} props - Component props
 * @param {string} props.allowedRole - The role allowed to access this route
 * @param {ReactNode} props.children - The protected content
 */
const RoleBasedRoute = ({ allowedRole, children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Get user role from auth context or fallback to localStorage
  const userRole = user?.role || localStorage.getItem('userRole');
  
  // First check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // Then check if user has the allowed role
  if (userRole !== allowedRole) {
    // If user doesn't have the correct role, redirect to their dashboard
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }
  
  // If authenticated and has correct role, render the protected content
  return children;
};

export default RoleBasedRoute; 
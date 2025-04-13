import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// API base URL
const API_URL = '/api/auth';

// Admin credentials - fixed credentials as requested
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin@gmail.com'
};

// Create context
const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // If using this app without a backend temporarily, this is a fallback
    // to ensure role-based routes still work
    if (!storedUser && localStorage.getItem('userRole')) {
      setUser({
        role: localStorage.getItem('userRole'),
        name: 'Test User'
      });
    }
    
    setLoading(false);
  }, []);

  // Register a new user
  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Role verification - only allow user role for signup
      if (userData.role === 'admin') {
        return { 
          success: false, 
          message: 'Admin registration is not allowed. Please contact system administrator.' 
        };
      }
      
      // Check if user already exists (for development without backend)
      if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_BACKEND) {
        // Simulate checking for existing user
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = existingUsers.some(user => user.email === userData.email);
        
        if (userExists) {
          return {
            success: false,
            message: 'User with this email already exists. Please login instead.'
          };
        }
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a user object with role
        const mockUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: userData.name || 'User',
          email: userData.email,
          role: 'user', // Force user role for signup
          createdAt: new Date().toISOString()
        };
        
        // Store the mock user in our "database"
        existingUsers.push(mockUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        // Store the mock data for current session
        localStorage.setItem('userRole', mockUser.role);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        return { success: true };
      }
      
      // Real API call
      const response = await axios.post(`${API_URL}/signup`, userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save user, role and token to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set user in state
        setUser(user);
        return { success: true };
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Log in user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // Admin role verification with fixed credentials
      if (credentials.role === 'admin') {
        // Check if admin credentials match the hardcoded values
        const isValidAdmin = 
          credentials.username === ADMIN_CREDENTIALS.username && 
          credentials.password === ADMIN_CREDENTIALS.password;
        
        if (!isValidAdmin) {
          return { 
            success: false, 
            message: 'Invalid admin credentials. Please check your username and password.' 
          };
        }
      }
      
      // While backend is being set up, this simulates the response
      if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_BACKEND) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For admin login, verify hardcoded credentials
        if (credentials.role === 'admin') {
          const isValidAdmin = 
            credentials.username === ADMIN_CREDENTIALS.username && 
            credentials.password === ADMIN_CREDENTIALS.password;
          
          if (!isValidAdmin) {
            return { 
              success: false, 
              message: 'Invalid admin credentials. Please check your username and password.' 
            };
          }
          
          // Create admin user object
          const adminUser = {
            id: 'admin-id',
            name: 'Administrator',
            username: ADMIN_CREDENTIALS.username,
            role: 'admin',
            createdAt: new Date().toISOString()
          };
          
          localStorage.setItem('userRole', adminUser.role);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', JSON.stringify(adminUser));
          
          setUser(adminUser);
          return { success: true, role: 'admin' };
        }
        
        // For regular user login
        // Check if user exists in our mock database
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const user = existingUsers.find(user => user.email === credentials.email);
        
        if (!user) {
          return {
            success: false,
            message: 'User not found. Please check your email or sign up.'
          };
        }
        
        // In a real app, we would verify the password here
        
        // Store the user data for current session
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        return { success: true, role: user.role };
      }
      
      // Real API call
      const response = await axios.post(`${API_URL}/login`, credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save user, role and token to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set user in state
        setUser(user);
        return { success: true, role: user.role };
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Log out user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    
    // Note: The actual redirection should happen in the component that calls logout
    // We don't use navigate here to avoid circular dependencies
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user || localStorage.getItem('isAuthenticated') === 'true';
  };

  // Get user role
  const getUserRole = () => {
    return user?.role || localStorage.getItem('userRole') || 'user';
  };

  // Create auth header
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    getAuthHeader
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
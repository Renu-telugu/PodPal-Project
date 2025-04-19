import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// API base URL - with fallback for development and production
const API_URL = process.env.REACT_APP_API_URL || "/api/auth";

// Admin credentials - fixed credentials as requested
const ADMIN_CREDENTIALS = {
  username: "admin",
  email: "admin@gmail.com",
  password: "Admin@123",
};

// Create context
const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Method to get the current authentication token
  const getToken = () => {
    // Comprehensive logging of all authentication-related items
    console.log("Token Retrieval Debug:", {
      localStorageEntries: Object.keys(localStorage).filter(
        (key) =>
          key.includes("token") || key.includes("auth") || key.includes("user")
      ),
      localStorageTokens: {
        token: localStorage.getItem("token"),
        authToken: localStorage.getItem("authToken"),
        userToken: localStorage.getItem("userToken"),
      },
      sessionStorageTokens: {
        token: sessionStorage.getItem("token"),
        authToken: sessionStorage.getItem("authToken"),
        userToken: sessionStorage.getItem("userToken"),
      },
      currentUser: localStorage.getItem("user"),
      isAuthenticated: localStorage.getItem("isAuthenticated"),
    });

    // Check multiple storage locations with fallback
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken") ||
      "";

    // Additional validation and logging
    if (!token) {
      console.warn("No token found in any storage location", {
        user: localStorage.getItem("user"),
        userRole: localStorage.getItem("userRole"),
        isAuthenticated: localStorage.getItem("isAuthenticated"),
      });
    }

    return token;
  };

  // Verify and set token
  const setTokenInStorage = (token, user) => {
    try {
      // Log all current storage contents before modification
      console.warn("BEFORE Token Storage - Full Storage Dump:", {
        localStorageKeys: Object.keys(localStorage),
        sessionStorageKeys: Object.keys(sessionStorage),
        localStorageContents: { ...localStorage },
        sessionStorageContents: { ...sessionStorage },
      });

      // Forcefully set token in multiple locations
      if (token) {
        // Aggressive token removal
        window.localStorage.clear();
        window.sessionStorage.clear();

        // Set tokens using both window and global localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("authToken", token);
        localStorage.setItem("userToken", token);

        window.localStorage.setItem("token", token);
        window.localStorage.setItem("authToken", token);
        window.localStorage.setItem("userToken", token);

        // Set user details
        const userString = JSON.stringify(user);
        localStorage.setItem("user", userString);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("isAuthenticated", "true");

        window.localStorage.setItem("user", userString);
        window.localStorage.setItem("userRole", user.role);
        window.localStorage.setItem("isAuthenticated", "true");

        // Log after storage
        console.warn("AFTER Token Storage - Verification:", {
          localStorageToken: localStorage.getItem("token"),
          windowLocalStorageToken: window.localStorage.getItem("token"),
          storedUser: localStorage.getItem("user"),
          userRole: localStorage.getItem("userRole"),
          isAuthenticated: localStorage.getItem("isAuthenticated"),
        });

        // Additional browser console logging
        console.log("Token Set:", token);
        console.log("User:", user);

        return true;
      } else {
        console.error("No token provided to set in storage");
        return false;
      }
    } catch (error) {
      console.error("CRITICAL: Error setting token in storage:", {
        errorMessage: error.message,
        errorStack: error.stack,
      });
      return false;
    }
  };

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // If user data is corrupted, clear it
        localStorage.removeItem("user");
        setUser(null);
      }
    } else if (localStorage.getItem("userRole")) {
      setUser({
        role: localStorage.getItem("userRole"),
        name: "Test User",
      });
    } else {
      setUser(null);
    }

    // Initialize or reset mock users database with default users
    const defaultMockUsers = [
      { id: 'user-1', email: "user@example.com", username: "user", name: "Test User", role: "user", password: "Password123!" },
      { id: 'admin-1', email: "admin@gmail.com", username: "admin", name: "Administrator", role: "admin", password: "Admin@123" },
      { id: 'user-2', email: "test@test.com", username: "testuser", name: "Test Account", role: "user", password: "Test@123" },
      { id: 'user-3', email: "telugurenuka2005@gmail.com", username: "renu", name: "Renu", role: "user", password: "Renu@123" },
      { id: 'user-4', email: "sreeja@example.com", username: "sreeja", name: "Sreeja", role: "user", password: "Sreeja@123" },
      { id: 'user-5', email: "sona@example.com", username: "sona", name: "Sona", role: "user", password: "Sona@1234" }
    ];
    
    // Only initialize if mockUsersDatabase doesn't exist yet - don't override existing database
    if (!localStorage.getItem('mockUsersDatabase')) {
      localStorage.setItem('mockUsersDatabase', JSON.stringify(defaultMockUsers));
      console.log("Initialized mock users database with default users");
    }
    
    setLoading(false);
  }, []);

  // Register a new user
  const signup = async (signupData) => {
    try {
      console.log("Signup Request:", {
        url: `${API_URL}/signup`,
        data: { ...signupData, password: "REDACTED" }
      });

      // Add simple validation checks before sending to server
      if (!signupData.name || !signupData.email || !signupData.password) {
        return { 
          success: false, 
          message: "Please provide all required fields" 
        };
      }

      // Send the signup request to the backend API
      const response = await axios.post(`${API_URL}/signup`, signupData);
      
      console.log("Signup Response:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });

      if (response.data.success) {
        const { token, user } = response.data;

        // Store token and user details, including role
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", user.role); // Store role in localStorage
        localStorage.setItem("isAuthenticated", "true");

        setUser(user);
        return { 
          success: true,
          message: response.data.message || "Registration successful!"
        };
      } else {
        return { 
          success: false, 
          message: response.data.message || "Registration failed" 
        };
      }
    } catch (error) {
      console.error("Signup Error:", error);
      
      // Check if the error has a response from the server
      if (error.response) {
        console.error("Server Error Response:", {
          status: error.response.status,
          data: error.response.data
        });
        
        // Return the server's error message if available
        return {
          success: false,
          message: error.response.data.message || "Registration failed",
          passwordRequirements: error.response.data.passwordRequirements
        };
      }
      
      // Handle network errors or other issues
      return {
        success: false,
        message: "Cannot connect to server. Please check your internet connection.",
      };
    }
  };

  // Log in user
  const login = async (loginData) => {
    try {
      console.log("Login Request:", {
        username: loginData.username,
        role: loginData.role
      });

      // For admin login, keep the direct check for compatibility
      if (loginData.role === 'admin' && 
          loginData.username === ADMIN_CREDENTIALS.username && 
          loginData.password === ADMIN_CREDENTIALS.password) {
        
        // Create admin user object
        const adminUser = {
          id: 'admin-1',
          username: ADMIN_CREDENTIALS.username,
          email: ADMIN_CREDENTIALS.email,
          name: 'Administrator',
          role: 'admin'
        };
        
        // Generate mock token
        const mockToken = btoa(JSON.stringify({
          user: adminUser,
          exp: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) // 7 days
        }));

        // Store token and user data
        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(adminUser));
        localStorage.setItem("userRole", 'admin');
        localStorage.setItem("isAuthenticated", "true");
        
        setUser(adminUser);
        
        console.log("Admin login successful");
        
        return { 
          success: true,
          role: 'admin',
          message: "Admin login successful!" 
        };
      }
      
      // For regular users, make a real API call to MongoDB
      try {
        // Prepare the request data
        const requestData = {
          // Use the username field as email for the backend
          email: loginData.username,
          password: loginData.password
        };
        
        console.log("Sending login request to backend:", {
          url: `${API_URL}/login`,
          email: requestData.email
        });
        
        // Make the API request
        const response = await axios.post(`${API_URL}/login`, requestData);
        
        console.log("Login API Response:", {
          status: response.status,
          success: response.data.success,
          message: response.data.message
        });
        
        // Check if login was successful
        if (response.data.success) {
          const { token, user } = response.data;
          
          // Store authentication data
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("userRole", user.role);
          localStorage.setItem("isAuthenticated", "true");
          
          setUser(user);
          
          console.log("User login successful:", user.name);
          
          return {
            success: true,
            role: user.role,
            message: "Login successful!"
          };
        } else {
          // Handle unsuccessful login from API
          return {
            success: false,
            message: response.data.message || "Invalid username or password"
          };
        }
      } catch (apiError) {
        // Handle API errors
        console.error("Login API Error:", apiError);
        
        if (apiError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("API Error Response:", {
            status: apiError.response.status,
            data: apiError.response.data
          });
          
          return {
            success: false,
            message: apiError.response.data.message || "Invalid username or password"
          };
        } else if (apiError.request) {
          // The request was made but no response was received
          console.error("No response received from server");
          return {
            success: false,
            message: "Could not connect to the server. Please try again later."
          };
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up request:", apiError.message);
          return {
            success: false,
            message: "An error occurred during login. Please try again."
          };
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      
      return {
        success: false,
        message: "An error occurred during login. Please try again.",
      };
    }
  };

  // Log out user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    setUser(null);

    // Note: The actual redirection should happen in the component that calls logout
    // We don't use navigate here to avoid circular dependencies
  };

  // Request password reset for a user
  const requestPasswordReset = async (email) => {
    try {
      console.log("Password Reset Request:", {
        url: `${API_URL}/request-password-reset`,
        email
      });

      // MOCK IMPLEMENTATION FOR TESTING
      // In a real application, this would make an API call to the backend
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if it's a registered email (for demo purposes, we'll check against some mock data)
      const isValidEmail = /\S+@\S+\.\S+/.test(email);
      
      if (!isValidEmail) {
        return {
          success: false,
          message: "Please enter a valid email address."
        };
      }

      // Mock user database to check against (in a real app, this would be in your backend)
      const mockUsers = [
        { email: "user@example.com", username: "user", role: "user" },
        { email: "admin@gmail.com", username: "admin", role: "admin" },
        { email: "test@test.com", username: "testuser", role: "user" },
        // Add the email from your test if needed
        { email: "telugurenuka2005@gmail.com", username: "renu", role: "user" }
      ];
      
      // Check if the email exists in our mock database
      const userExists = mockUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (!userExists) {
        return {
          success: false,
          message: "No account found with this email address. Please check your email or sign up."
        };
      }
      
      // Generate a mock reset token
      const mockToken = btoa(`reset_${email}_${new Date().getTime()}`);
      
      // Store the token temporarily in localStorage (in a real app, this token would be stored in the backend)
      // This is just for demo purposes to simulate the flow
      const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
      resetTokens[email] = {
        token: mockToken,
        expiresAt: new Date().getTime() + (60 * 60 * 1000) // 1 hour expiry
      };
      localStorage.setItem('resetTokens', JSON.stringify(resetTokens));
      
      // Instead of logging to console, we'll directly navigate to the reset page
      window.location.href = `/reset-password/${mockToken}`;
      
      return {
        success: true,
        message: "Redirecting to password reset page...",
        directNavigation: true
      };

    } catch (error) {
      console.error("Password Reset Request Error:", error);
      
      // Check if the error has a response from the server
      if (error.response) {
        console.error("Server Error Response:", {
          status: error.response.status,
          data: error.response.data
        });
        
        return {
          success: false,
          message: error.response.data.message || "Failed to send password reset email."
        };
      }
      
      // Handle network errors
      return {
        success: false,
        message: "Cannot connect to server. Please check your internet connection."
      };
    }
  };

  // Reset password with token
  const resetPassword = async (token, newPassword, confirmPassword) => {
    try {
      // Validate passwords match
      if (newPassword !== confirmPassword) {
        return {
          success: false,
          message: "Passwords don't match."
        };
      }

      console.log("Reset Password Request:", {
        tokenProvided: !!token
      });

      // MOCK IMPLEMENTATION FOR TESTING
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify token is valid by checking local storage
      // In a real app, this verification would happen on the server
      if (!token) {
        return {
          success: false,
          message: "Invalid or expired password reset token. Please request a new reset link."
        };
      }
      
      // Get all reset tokens from localStorage
      const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
      let isValidToken = false;
      let userEmail = null;
      
      // Check if the token exists and is not expired
      Object.keys(resetTokens).forEach(email => {
        const storedToken = resetTokens[email];
        if (storedToken.token === token && storedToken.expiresAt > new Date().getTime()) {
          isValidToken = true;
          userEmail = email;
        }
      });
      
      if (!isValidToken || !userEmail) {
        return {
          success: false,
          message: "Invalid or expired password reset token. Please request a new reset link."
        };
      }
      
      // Get persistent mock users database or create if it doesn't exist
      let mockUsers = JSON.parse(localStorage.getItem('mockUsersDatabase') || JSON.stringify([
        { id: 'user-1', email: "user@example.com", username: "user", name: "Test User", role: "user", password: "Password123!" },
        { id: 'admin-1', email: "admin@gmail.com", username: "admin", name: "Administrator", role: "admin", password: "Admin@123" },
        { id: 'user-2', email: "test@test.com", username: "testuser", name: "Test Account", role: "user", password: "Test@123" },
        { id: 'user-3', email: "telugurenuka2005@gmail.com", username: "renu", name: "Renu", role: "user", password: "Renu@123" },
        { id: 'user-4', email: "sreeja@example.com", username: "sreeja", name: "Sreeja", role: "user", password: "Sreeja@123" },
        { id: 'user-5', email: "sona@example.com", username: "sona", name: "Sona", role: "user", password: "Sona@1234" }
      ]));
      
      // Update the user's password in our mock database
      const userIndex = mockUsers.findIndex(user => user.email.toLowerCase() === userEmail.toLowerCase());
      
      if (userIndex >= 0) {
        // Update the password
        mockUsers[userIndex].password = newPassword;
        console.log("Password updated for user:", mockUsers[userIndex].username);
        console.log("New password:", newPassword);
        
        // Save the updated mock database back to localStorage
        localStorage.setItem('mockUsersDatabase', JSON.stringify(mockUsers));
        
        // Remove the used token from localStorage
        delete resetTokens[userEmail];
        localStorage.setItem('resetTokens', JSON.stringify(resetTokens));
        
        return {
          success: true,
          message: "Password has been successfully reset. You can now login with your new password."
        };
      } else {
        return {
          success: false,
          message: "User not found. Please try again or contact support."
        };
      }

    } catch (error) {
      console.error("Reset Password Error:", error);
      
      // Check if the error has a response from the server
      if (error.response) {
        console.error("Server Error Response:", {
          status: error.response.status,
          data: error.response.data
        });
        
        return {
          success: false,
          message: error.response.data.message || "Failed to reset password. The link may have expired."
        };
      }
      
      // Handle network errors
      return {
        success: false,
        message: "Cannot connect to server. Please check your internet connection."
      };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user || localStorage.getItem("isAuthenticated") === "true";
  };

  console.log("Is Authenticated:", isAuthenticated());

  // Get user role
  const getUserRole = () => {
    const role = user?.role || localStorage.getItem("userRole") || "user"; // Default to "user"
    console.log("Retrieved User Role:", role);
    return role;
  };

  // Get auth headers for API requests
  const getAuthHeader = () => {
    const token = getToken();
    if (!token) {
      console.error("No token available for auth header");
      return {}; // Return empty object if no token
    }
    
    // Log the auth header being generated
    console.log("Creating auth header with token:", token.substring(0, 10) + "...");
    
    // Return properly formatted Authorization header for Bearer token
    return {
      Authorization: `Bearer ${token}`
    };
  };

  // Debug utility: Reset mock database completely
  const resetMockUsers = () => {
    // Default users that should always exist in the database
    const defaultMockUsers = [
      { id: 'user-1', email: "user@example.com", username: "user", name: "Test User", role: "user", password: "Password123!" },
      { id: 'admin-1', email: "admin@gmail.com", username: "admin", name: "Administrator", role: "admin", password: "Admin@123" },
      { id: 'user-2', email: "test@test.com", username: "testuser", name: "Test Account", role: "user", password: "Test@123" },
      { id: 'user-3', email: "telugurenuka2005@gmail.com", username: "renu", name: "Renu", role: "user", password: "Renu@123" },
      { id: 'user-4', email: "sreeja@example.com", username: "sreeja", name: "Sreeja", role: "user", password: "Sreeja@123" },
      { id: 'user-5', email: "sona@example.com", username: "sona", name: "Sona", role: "user", password: "Sona@1234" }
    ];
    
    // Force reset the mock database to include these users
    localStorage.setItem('mockUsersDatabase', JSON.stringify(defaultMockUsers));
    console.log("Mock users database has been reset");
    
    // Display the reset database in the console for debugging
    console.table(defaultMockUsers);
    
    return { success: true, message: "Mock user database has been reset" };
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
    getAuthHeader,
    getToken,
    requestPasswordReset,
    resetPassword,
    resetMockUsers
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

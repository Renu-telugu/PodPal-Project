import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// API base URL - with fallback for development and production
const API_URL = process.env.REACT_APP_API_URL || "/api/auth";

// Create context
const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Method to get the current authentication token
  const getToken = () => {
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
      // Set tokens using both window and global localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("authToken", token);
      localStorage.setItem("userToken", token);

      // Set user details
      const userString = JSON.stringify(user);
      localStorage.setItem("user", userString);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("isAuthenticated", "true");

      console.log("Token and user data stored successfully");
    } catch (error) {
      console.error("Error storing token:", error);
    }
  };

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      try {
        const userString = localStorage.getItem("user");
        if (userString) {
          const userData = JSON.parse(userString);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register new user
  const signup = async (userData) => {
    try {
      console.log("Signup Request:", {
        name: userData.name,
        email: userData.email,
      });

      const response = await axios.post(`${API_URL}/signup`, userData);

      console.log("Signup API Response:", {
        status: response.status,
        data: response.data,
      });

      if (response.data.success) {
        // Store token and user data
        const { token, user } = response.data;
        setTokenInStorage(token, { ...user, role: "user" });
        setUser(user);
        return {
          success: true,
          message: response.data.message || "Registration successful!",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Signup Error:", error);

      // Check if the error has a response from the server
      if (error.response) {
        console.error("Server Error Response:", {
          status: error.response.status,
          data: error.response.data,
        });

        // Return the server's error message if available
        return {
          success: false,
          message: error.response.data.message || "Registration failed",
          passwordRequirements: error.response.data.passwordRequirements,
        };
      }

      // Handle network errors or other issues
      return {
        success: false,
        message:
          "Cannot connect to server. Please check your internet connection.",
      };
    }
  };

  // Log in user
  const login = async (loginData) => {
    try {
      console.log("Login Request:", {
        email: loginData.email,
      });

      // Prepare the request data
      const requestData = {
        email: loginData.email,
        password: loginData.password,
      };

      console.log("Sending login request to backend:", {
        url: `${API_URL}/login`,
        email: requestData.email,
      });

      // Make the API request
      const response = await axios.post(`${API_URL}/login`, requestData);

      console.log("Login API Response:", {
        status: response.status,
        success: response.data.success,
        hasToken: !!response.data.token,
      });

      if (response.data.success) {
        // Store token and user data
        const { token, user } = response.data;
        setTokenInStorage(token, { ...user, role: "user" });
        setUser(user);

        return {
          success: true,
          role: "user",
          message: response.data.message || "Login successful!",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Invalid credentials",
        };
      }
    } catch (error) {
      console.error("Login Error:", error);

      // Check if the error has a response from the server
      if (error.response) {
        console.error("Server Error Response:", {
          status: error.response.status,
          data: error.response.data,
        });

        // Return the server's error message if available
        return {
          success: false,
          message: error.response.data.message || "Login failed",
        };
      }

      // Handle network errors or other issues
      return {
        success: false,
        message:
          "Cannot connect to server. Please check your internet connection.",
      };
    }
  };

  // Log out user
  const logout = () => {
    // Clear all auth-related items from storage
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userToken");

    // Reset user state
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = getToken();
    const userString = localStorage.getItem("user");
    return !!token && !!userString;
  };

  // Get user role
  const getUserRole = () => {
    if (!user) {
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          const userData = JSON.parse(userString);
          return userData.role || "user";
        } catch (e) {
          console.error("Error parsing user data:", e);
          return "user";
        }
      }
      return "user";
    }
    return user.role || "user";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        getToken,
        signup,
        login,
        logout,
        isAuthenticated,
        getUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

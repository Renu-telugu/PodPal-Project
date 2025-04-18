import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// API base URL
const API_URL = "/api/auth";

// Admin credentials - fixed credentials as requested
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin@gmail.com",
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
    setLoading(false);
  }, []);

  // Register a new user
  const signup = async (signupData) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, signupData);
      if (response.data.success) {
        const { token, user } = response.data;

        // Store token and user details, including role
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", user.role); // Store role in localStorage
        localStorage.setItem("isAuthenticated", "true");

        setUser(user);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  };

  // Log in user
  const login = async (loginData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, loginData);
      if (response.data.success) {
        const { token, user } = response.data;

        // Store token and user details, including role
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", user.role); // Store role in localStorage
        localStorage.setItem("isAuthenticated", "true");

        setUser(user);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
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

  // Create auth header
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
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
    getAuthHeader,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import React, { createContext, useState, useContext, useEffect } from "react";

// Admin credentials - hardcoded for now
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "Admin@123",
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
    const loadUser = () => {
      try {
        const adminUser = localStorage.getItem("adminUser");
        if (adminUser) {
          setUser(JSON.parse(adminUser));
        }
      } catch (error) {
        console.error("Error loading admin user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (loginData) => {
    try {
      // Check admin credentials
      if (
        loginData.username === ADMIN_CREDENTIALS.username &&
        loginData.password === ADMIN_CREDENTIALS.password
      ) {
        // Create admin user object
        const adminUser = {
          username: ADMIN_CREDENTIALS.username,
          role: "admin",
        };

        // Store token and user data
        localStorage.setItem("adminToken", "admin-token-placeholder");
        localStorage.setItem("adminUser", JSON.stringify(adminUser));

        setUser(adminUser);

        return {
          success: true,
          message: "Admin login successful!",
        };
      }

      return {
        success: false,
        message: "Invalid admin credentials",
      };
    } catch (error) {
      console.error("Login Error:", error);
      return {
        success: false,
        message: "Login failed",
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem("adminToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

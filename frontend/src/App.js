import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyles";
import { lightTheme } from "./styles/theme";
import { useTheme } from "styled-components";
import { useAuth } from "./context/AuthContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UploadPodcast from "./pages/UploadPodcast";
import NotFound from "./pages/NotFound";
import UserDashboard from "./components/User/UserDashboard";

// Context
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Components
import ThemeToggle from "./components/ThemeToggle";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const RoleBasedRoute = ({ allowedRole, children }) => {
  const { getUserRole } = useAuth();
  const userRole = getUserRole();
  return userRole === allowedRole ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <StyledThemeProvider theme={lightTheme}>
          <GlobalStyle />
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/user/*"
                element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRole="user">
                      <UserDashboard />
                    </RoleBasedRoute>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </StyledThemeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

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
import Profile from "./pages/Profile";
import UserDashboard from "./components/User/UserDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ExplorePodcasts from "./pages/ExplorePodcasts";
import PodcastDetails from "./pages/PodcastDetails";

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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/explore" element={<ExplorePodcasts />} />
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
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRole="admin">
                      <AdminDashboard />
                    </RoleBasedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/explore" element={<ExplorePodcasts />} />
              <Route path="/podcast/:podcastId" element={<PodcastDetails />} />
              <Route path="*" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </StyledThemeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

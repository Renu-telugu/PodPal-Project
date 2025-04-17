import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/theme';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import UploadPodcast from './pages/UploadPodcast';
import NotFound from './pages/NotFound';

// Route protection
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RoleBasedRoute from './components/Auth/RoleBasedRoute';

// Dashboard layouts
import UserDashboard from './components/User/UserDashboard'; 
import AdminDashboard from './components/Admin/AdminDashboard';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// AppContent component to access theme context
const AppContent = () => {
  const { theme } = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <StyledThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<UploadPodcast />} />
          
          {/* Protected routes with role-based access */}
          <Route path="/user/*" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRole="user">
                <UserDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRole="admin">
                <AdminDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </StyledThemeProvider>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

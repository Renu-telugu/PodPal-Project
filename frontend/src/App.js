import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/theme';

// Pages
import Landing from './pages/Landing';
// Use Login/Signup from components/Auth instead of pages
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import NotFound from './pages/NotFound';

// Route protection
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RoleBasedRoute from './components/Auth/RoleBasedRoute';

// Dashboard layouts - if these files don't exist, they'll be created
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
          
          {/* Protected routes with role-based access */}
          <Route path="/user/*" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRole="user">
                <Routes>
                  <Route path="dashboard" element={<UserDashboard />} />
                </Routes>
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRole="admin">
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                </Routes>
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
          
          {/* Fallback for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </StyledThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

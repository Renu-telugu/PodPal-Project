import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { validateField } from '../utils/validation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {
  FormContainer,
  FormTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ErrorMessage,
  LinkText
} from '../components/FormElements';

// Animation
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  animation: ${slideIn} 0.5s ease;
`;

const AlertMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme, type }) => 
    type === 'error' ? 'rgba(255, 71, 87, 0.1)' : 'rgba(40, 167, 69, 0.1)'};
  color: ${({ theme, type }) => 
    type === 'error' ? theme.colors.error : theme.colors.success};
  border-left: 4px solid ${({ theme, type }) => 
    type === 'error' ? theme.colors.error : theme.colors.success};
`;

const RoleToggleContainer = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const RoleToggleButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ isActive, theme }) => 
    isActive ? theme.colors.primary : 'transparent'};
  color: ${({ isActive, theme }) => 
    isActive ? theme.colors.white : theme.colors.text};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${({ isActive }) => isActive ? 'bold' : 'normal'};
  
  &:hover {
    background-color: ${({ isActive, theme }) => 
      isActive ? theme.colors.primary : theme.colors.background};
  }
`;

const AdminCredentialsHint = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: rgba(40, 167, 69, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px dashed ${({ theme }) => theme.colors.primary};

  p {
    margin: 4px 0;
    font-size: 0.9rem;
  }
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: right;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

// Styled component for password input wrapper
const PasswordInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordToggleButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors?.text || '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  
  &:hover, &:focus {
    color: ${({ theme }) => theme.colors?.primary || '#7c3aed'};
    outline: none;
  }
`;

// Login page component
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  // Validation and UI state
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugMessage, setDebugMessage] = useState('');
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    if (generalError) {
      setGeneralError('');
    }
  };
  
  // Handle debug button click
  const handleDebugClick = async () => {
    setDebugMessage("Checking database connection...");
    
    try {
      // Try to connect to the auth API
      const response = await fetch("/api/auth/debug", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDebugMessage(`Database connection successful! Server: ${data.server || 'Unknown'}`);
      } else {
        setDebugMessage(`Error connecting to database: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setDebugMessage(`Connection error: ${error.message}`);
      console.error("Debug error:", error);
    }
  };
  
  // Toggle between user and admin login modes
  const toggleAdminMode = (adminMode) => {
    setIsAdminMode(adminMode);
    setErrors({});
    setGeneralError('');
    // Clear form data when switching modes
    setFormData({
      username: '',
      password: '',
    });
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Toggle debug panel
  const toggleDebugPanel = () => {
    setShowDebug(!showDebug);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate based on login mode
    let hasErrors = false;
    const newErrors = {};
    
    // Username validation for both modes
    if (!formData.username) {
      newErrors.username = 'Username is required';
      hasErrors = true;
    }
    
    // Password validation for both modes
    if (!formData.password) {
      newErrors.password = 'Password is required';
      hasErrors = true;
    }
    
    setErrors(newErrors);
    
    if (hasErrors) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setGeneralError('');
      
      console.log('Submitting login form:', {
        username: formData.username,
        password: formData.password.replace(/./g, '*'), // Mask password for security
        mode: isAdminMode ? 'admin' : 'user'
      });
      
      // Include role in login credentials
      const loginData = {
        ...formData,
        role: isAdminMode ? 'admin' : 'user'
      };
      
      const result = await login(loginData);
      console.log('Login result:', result);
      
      if (result.success) {
        // Redirect based on role
        if (isAdminMode || result.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      } else {
        setGeneralError(result.message || 'Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <LoginContainer>
        <FormContainer>
          <FormTitle>{isAdminMode ? 'Admin Login' : 'User Login'}</FormTitle>
          
          <RoleToggleContainer>
            <RoleToggleButton 
              isActive={!isAdminMode} 
              onClick={() => toggleAdminMode(false)}
            >
              User
            </RoleToggleButton>
            <RoleToggleButton 
              isActive={isAdminMode} 
              onClick={() => toggleAdminMode(true)}
            >
              Admin
            </RoleToggleButton>
          </RoleToggleContainer>
          
          {generalError && (
            <AlertMessage type="error">{generalError}</AlertMessage>
          )}
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">
                {isAdminMode ? 'Username' : 'Email or Username'}
              </Label>
              <Input
                type={isAdminMode ? "text" : "text"}
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                placeholder={isAdminMode ? "Enter admin username" : "Enter your email or username"}
              />
              {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <PasswordInputWrapper>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <PasswordToggleButton 
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggleButton>
              </PasswordInputWrapper>
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </FormGroup>
            
            {!isAdminMode && (
              <ForgotPasswordLink to="/forgot-password">
                Forgot password?
              </ForgotPasswordLink>
            )}
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : (isAdminMode ? 'Admin Login' : 'Login')}
            </Button>
            
            {/* Debug button - click 5 times to show debug info */}
            <div 
              style={{ marginTop: '20px', textAlign: 'center' }}
              onClick={toggleDebugPanel}
            >
              <small style={{ cursor: 'pointer', color: '#999' }}>
                API Connection: {process.env.REACT_APP_API_URL || "/api/auth"}
              </small>
            </div>
            
            {showDebug && (
              <div style={{ 
                marginTop: '15px', 
                padding: '10px', 
                background: '#f8f9fa', 
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Debug Information</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px' }}>
                  API URL: {process.env.REACT_APP_API_URL || "/api/auth"}
                </p>
                <p style={{ fontSize: '12px' }}>
                  <button 
                    type="button" 
                    onClick={handleDebugClick}
                    style={{
                      padding: '5px 10px',
                      fontSize: '12px',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Test MongoDB Connection
                  </button>
                  {debugMessage && (
                    <span style={{ marginLeft: '10px', fontSize: '12px' }}>
                      {debugMessage}
                    </span>
                  )}
                </p>
                <p style={{ margin: '10px 0 0 0', fontSize: '12px' }}>
                  <strong>Note:</strong> Use the credentials "sreeja@example.com" and "sreeja" to login as test users.
                </p>
              </div>
            )}
          </Form>
          
          {isAdminMode ? (
            <AdminCredentialsHint>
              <p><strong>Admin credentials:</strong></p>
              <p>Username: admin</p>
              <p>Email: admin@gmail.com</p>
              <p>Password: Admin@123</p>
            </AdminCredentialsHint>
          ) : (
            <>
              <LinkText>
                Don't have an account? <Link to="/signup">Sign up here</Link>
              </LinkText>
              <small style={{ display: 'block', marginTop: '10px', color: '#666', textAlign: 'center' }}>
                For user login, enter your registered email address in the username field.
              </small>
            </>
          )}
        </FormContainer>
      </LoginContainer>
    </Layout>
  );
};

export default Login; 
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { validateField } from '../utils/validation';
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
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
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
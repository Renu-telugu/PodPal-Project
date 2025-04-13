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

// Login page component
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Validation and UI state
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate field on change
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    
    const newErrors = {
      email: emailError,
      password: passwordError
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (emailError || passwordError) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setGeneralError('');
      
      const result = await login({
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        navigate('/');
      } else {
        setGeneralError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <LoginContainer>
        <FormContainer>
          <FormTitle>Login</FormTitle>
          
          {generalError && (
            <AlertMessage type="error">{generalError}</AlertMessage>
          )}
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email"
                autoComplete="email"
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
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
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
          
          <LinkText>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </LinkText>
        </FormContainer>
      </LoginContainer>
    </Layout>
  );
};

export default Login; 
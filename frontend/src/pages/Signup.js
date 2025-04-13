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
const SignupContainer = styled.div`
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

// Signup page component
const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    const error = name === 'confirmPassword' 
      ? validateField(name, value, formData.password)
      : validateField(name, value);
      
    setErrors({
      ...errors,
      [name]: error
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateField('name', formData.name);
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword, formData.password);
    
    const newErrors = {
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (nameError || emailError || passwordError || confirmPasswordError) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setGeneralError('');
      
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        navigate('/');
      } else {
        setGeneralError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <SignupContainer>
        <FormContainer>
          <FormTitle>Sign Up</FormTitle>
          
          {generalError && (
            <AlertMessage type="error">{generalError}</AlertMessage>
          )}
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter your name"
                autoComplete="name"
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormGroup>
            
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
                placeholder="Create a password (min. 6 characters)"
                autoComplete="new-password"
              />
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
            </FormGroup>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Form>
          
          <LinkText>
            Already have an account? <Link to="/login">Login here</Link>
          </LinkText>
        </FormContainer>
      </SignupContainer>
    </Layout>
  );
};

export default Signup; 
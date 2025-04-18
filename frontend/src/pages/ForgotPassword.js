import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
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
const ForgotPasswordContainer = styled.div`
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

// Forgot Password page component
const ForgotPassword = () => {
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    username: ''
  });
  
  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
    setSuccess('');
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!formData.email) {
      setError('Email is required');
      return;
    }
    
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const result = await requestPasswordReset(formData.email);
      
      if (result.success) {
        // If the result indicates we're doing direct navigation, the page will be redirected
        // Otherwise show success message
        if (!result.directNavigation) {
          setSuccess(result.message);
          setFormData({ email: '', username: '' }); // Clear form after successful submission
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <ForgotPasswordContainer>
        <FormContainer>
          <FormTitle>Forgot Password</FormTitle>
          
          {error && <AlertMessage type="error">{error}</AlertMessage>}
          {success && <AlertMessage type="success">{success}</AlertMessage>}
          
          <p>Enter your email address below and we'll send you a link to reset your password.</p>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your registered email"
                autoComplete="email"
              />
            </FormGroup>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Reset Password'}
            </Button>
          </Form>
          
          <LinkText>
            Remember your password? <Link to="/login">Back to Login</Link>
          </LinkText>
        </FormContainer>
      </ForgotPasswordContainer>
    </Layout>
  );
};

export default ForgotPassword; 
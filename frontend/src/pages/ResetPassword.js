import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
const ResetPasswordContainer = styled.div`
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

const PasswordRequirements = styled.ul`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.md};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

// Reset Password page component
const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // Validate token exists
  useEffect(() => {
    if (!token) {
      setGeneralError('Invalid password reset link. Please request a new one.');
    }
  }, [token]);
  
  // Start redirect countdown after successful reset
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && success) {
      navigate('/login');
    }
    return () => clearTimeout(timer);
  }, [countdown, navigate, success]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear specific field error
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate password
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    
    return '';
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    const newErrors = {};
    
    // Check new password
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }
    
    // Check passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // If errors, stop form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setGeneralError('');
      
      const result = await resetPassword(
        token,
        formData.newPassword,
        formData.confirmPassword
      );
      
      if (result.success) {
        setSuccess(result.message);
        setFormData({ newPassword: '', confirmPassword: '' });
        // Start countdown for redirect
        setCountdown(5);
      } else {
        setGeneralError(result.message);
      }
    } catch (err) {
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <ResetPasswordContainer>
        <FormContainer>
          <FormTitle>Reset Password</FormTitle>
          
          {generalError && <AlertMessage type="error">{generalError}</AlertMessage>}
          {success && (
            <AlertMessage type="success">
              {success} Redirecting to login in {countdown} seconds...
            </AlertMessage>
          )}
          
          {!success && !generalError && (
            <>
              <p>Create a new password for your account.</p>
              
              <PasswordRequirements>
                <li>At least 8 characters long</li>
                <li>Must contain at least one uppercase letter</li>
                <li>Must contain at least one lowercase letter</li>
                <li>Must contain at least one number</li>
                <li>Must contain at least one special character (!@#$%^&*)</li>
              </PasswordRequirements>
              
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    error={errors.newPassword}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                  {errors.newPassword && <ErrorMessage>{errors.newPassword}</ErrorMessage>}
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
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
                </FormGroup>
                
                <Button type="submit" disabled={isSubmitting || success}>
                  {isSubmitting ? 'Updating...' : 'Set New Password'}
                </Button>
              </Form>
            </>
          )}
          
          <LinkText>
            <Link to="/login">Back to Login</Link>
          </LinkText>
        </FormContainer>
      </ResetPasswordContainer>
    </Layout>
  );
};

export default ResetPassword; 
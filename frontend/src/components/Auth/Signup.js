import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faCheck, faTimes, faHeadphones } from '@fortawesome/free-solid-svg-icons';

/**
 * Signup component
 * Allows users to create a new account (regular users only)
 */
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
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  
  // Form validation and UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Handle input change for form fields
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any previous error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Check password strength when password field changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };
  
  /**
   * Check password strength and update state
   * @param {string} password - The password to check
   */
  const checkPasswordStrength = (password) => {
    // Check different criteria
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    
    // Calculate score (0-4)
    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase && hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    
    setPasswordStrength({
      score,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    });
  };
  
  /**
   * Get password strength level based on score
   * @returns {string} - Strength level (weak, medium, strong)
   */
  const getPasswordStrengthLevel = () => {
    const { score } = passwordStrength;
    if (score <= 1) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
  };
  
  /**
   * Validate form before submission
   * @returns {boolean} - Whether the form is valid
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 2) {
      newErrors.password = 'Password is too weak';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Handle form submission
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create signup data (role is fixed to 'user')
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user'
      };
      
      // Use the AuthContext signup method
      const result = await signup(signupData);
      
      if (result.success) {
        navigate('/user/dashboard');
      } else {
        setErrors({ general: result.message || 'Failed to create account. Please try again.' });
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>
            <FontAwesomeIcon icon={faHeadphones} className={styles.logoIcon} /> PodPal
          </h1>
          <p className={styles.authSubtitle}>Create Your Account</p>
        </div>
        
        {errors.general && (
          <div className={styles.errorMessage}>{errors.general}</div>
        )}
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">
              <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.name && <div className={styles.fieldError}>{errors.name}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">
              <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
              <span>Email</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <div className={styles.fieldError}>{errors.email}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
              <span>Password</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
            {errors.password && <div className={styles.fieldError}>{errors.password}</div>}
            
            {/* Password strength indicator */}
            {formData.password && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthMeter}>
                  <div
                    className={`${styles.strengthIndicator} ${styles[getPasswordStrengthLevel()]}`}
                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                  ></div>
                </div>
                <span className={styles.strengthText}>
                  {getPasswordStrengthLevel() === 'weak' && 'Weak'}
                  {getPasswordStrengthLevel() === 'medium' && 'Medium'}
                  {getPasswordStrengthLevel() === 'strong' && 'Strong'}
                </span>
              </div>
            )}
            
            {/* Password requirements */}
            {formData.password && (
              <div className={styles.passwordRequirements}>
                <div className={passwordStrength.hasMinLength ? styles.requirementMet : styles.requirementNotMet}>
                  <FontAwesomeIcon 
                    icon={passwordStrength.hasMinLength ? faCheck : faTimes} 
                    className={styles.requirementIcon} 
                  />
                  <span>At least 8 characters</span>
                </div>
                <div className={passwordStrength.hasUppercase && passwordStrength.hasLowercase ? styles.requirementMet : styles.requirementNotMet}>
                  <FontAwesomeIcon 
                    icon={passwordStrength.hasUppercase && passwordStrength.hasLowercase ? faCheck : faTimes} 
                    className={styles.requirementIcon} 
                  />
                  <span>Upper & lowercase letters</span>
                </div>
                <div className={passwordStrength.hasNumber ? styles.requirementMet : styles.requirementNotMet}>
                  <FontAwesomeIcon 
                    icon={passwordStrength.hasNumber ? faCheck : faTimes} 
                    className={styles.requirementIcon} 
                  />
                  <span>At least 1 number</span>
                </div>
                <div className={passwordStrength.hasSpecialChar ? styles.requirementMet : styles.requirementNotMet}>
                  <FontAwesomeIcon 
                    icon={passwordStrength.hasSpecialChar ? faCheck : faTimes} 
                    className={styles.requirementIcon} 
                  />
                  <span>At least 1 special character</span>
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">
              <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
              <span>Confirm Password</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <div className={styles.fieldError}>{errors.confirmPassword}</div>}
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className={styles.authFooter}>
          Already have an account?{' '}
          <Link to="/login" className={styles.authFooterLink}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup; 
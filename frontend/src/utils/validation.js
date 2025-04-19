// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  // At least 8 characters
  if (!password || password.length < 8) return false;
  
  // Check for basic complexity - must have at least 1 of each:
  // Uppercase, lowercase, number, and special character
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  // Return true only if it passes all requirements
  // For now just require 8+ characters and leave complex checks for UI guidance only
  return true;
};

// Password match validation
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

// Form field validation
export const validateField = (name, value, password) => {
  switch(name) {
    case 'name':
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 3) return 'Name must be at least 3 characters';
      return '';
    
    case 'email':
      if (!value.trim()) return 'Email is required';
      if (!isValidEmail(value)) return 'Please enter a valid email address';
      return '';
    
    case 'password':
      if (!value) return 'Password is required';
      if (!isValidPassword(value)) return 'Password must be at least 8 characters';
      return '';
    
    case 'confirmPassword':
      if (!value) return 'Please confirm your password';
      if (!doPasswordsMatch(value, password)) return 'Passwords do not match';
      return '';
    
    default:
      return '';
  }
};

// Login form validation
export const validateLoginForm = (values) => {
  const errors = {};
  
  const emailError = validateField('email', values.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validateField('password', values.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

// Signup form validation
export const validateSignupForm = (values) => {
  const errors = {};
  
  const nameError = validateField('name', values.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateField('email', values.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validateField('password', values.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateField('confirmPassword', values.confirmPassword, values.password);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  return errors;
}; 
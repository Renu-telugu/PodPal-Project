import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faCheck,
  faTimes,
  faHeadphones,
  faCircleInfo,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Signup component
 * Allows users to create a new account (regular users only)
 */
const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Form validation and UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);

  // Fetch password requirements from the server on component mount
  useEffect(() => {
    const fetchPasswordRequirements = async () => {
      try {
        const response = await fetch('/api/auth/password-requirements');
        const data = await response.json();
        console.log('Password requirements:', data);
      } catch (error) {
        console.error('Failed to fetch password requirements:', error);
      }
    };

    fetchPasswordRequirements();
  }, []);

  /**
   * Handle input change for form fields
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear any previous error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Reset server errors when user makes changes
    if (serverResponse) {
      setServerResponse(null);
    }

    // Check password strength when password field changes
    if (name === "password") {
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
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Calculate score (0-5)
    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;

    setPasswordStrength({
      score,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    });
  };

  /**
   * Get password strength level based on score
   * @returns {string} - Strength level (weak, medium, strong, very-strong)
   */
  const getPasswordStrengthLevel = () => {
    const { score } = passwordStrength;
    if (score <= 2) return "weak";
    if (score <= 3) return "medium";
    if (score <= 4) return "strong";
    return "very-strong";
  };

  /**
   * Validate form before submission
   * @returns {boolean} - Whether the form is valid
   */
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrength.score < 3) {
      newErrors.password = "Password is too weak";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
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
    
    setIsSubmitting(true);
    setServerResponse(null);

    const signupData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "user",
    };

    console.log("Sending Signup Request:", signupData);

    try {
      const result = await signup(signupData);
      console.log("Signup Result:", result);

      if (result.success) {
        setServerResponse({
          type: 'success',
          message: result.message || 'Account created successfully!'
        });
        
        // Delay navigation to show success message
        setTimeout(() => {
          navigate("/user/dashboard");
        }, 1500);
      } else {
        console.error("Signup Failed:", result.message);
        setServerResponse({
          type: 'error',
          message: result.message || 'Failed to create account'
        });
        
        // If server sent back specific password requirements issues
        if (result.passwordRequirements) {
          const { passwordRequirements } = result;
          
          setPasswordStrength(prev => ({
            ...prev,
            hasUppercase: passwordRequirements.uppercase,
            hasLowercase: passwordRequirements.lowercase,
            hasNumber: passwordRequirements.number,
            hasSpecialChar: passwordRequirements.special
          }));
        }
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setServerResponse({
        type: 'error',
        message: 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>
            <FontAwesomeIcon icon={faHeadphones} className={styles.logoIcon} />{" "}
            PodPal
          </h1>
          <p className={styles.authSubtitle}>Create Your Account</p>
        </div>

        {serverResponse && (
          <div 
            className={`${styles.serverMessage} ${
              serverResponse.type === 'error' 
                ? styles.errorMessage 
                : styles.successMessage
            }`}
          >
            {serverResponse.message}
          </div>
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
              className={`${styles.input} ${
                errors.name ? styles.inputError : ""
              }`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <div className={styles.fieldError}>{errors.name}</div>
            )}
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
              className={`${styles.input} ${
                errors.email ? styles.inputError : ""
              }`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <div className={styles.fieldError}>{errors.email}</div>
            )}
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
              className={`${styles.input} ${
                errors.password ? styles.inputError : ""
              }`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              disabled={isSubmitting}
            />
            {errors.password && (
              <div className={styles.fieldError}>{errors.password}</div>
            )}

            {/* Password strength indicator */}
            {formData.password && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthMeter}>
                  <div
                    className={`${styles.strengthIndicator} ${
                      styles[getPasswordStrengthLevel()]
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
                <span className={styles.strengthText}>
                  {getPasswordStrengthLevel() === "weak" && "Weak"}
                  {getPasswordStrengthLevel() === "medium" && "Medium"}
                  {getPasswordStrengthLevel() === "strong" && "Strong"}
                  {getPasswordStrengthLevel() === "very-strong" && "Very Strong"}
                </span>
              </div>
            )}

            {/* Password requirements */}
            <div className={styles.passwordRequirementsHeader}>
              <FontAwesomeIcon icon={faCircleInfo} className={styles.requirementInfoIcon} />
              <span>Password must have:</span>
            </div>
            <div className={styles.passwordRequirements}>
              <div
                className={
                  passwordStrength.hasMinLength
                    ? styles.requirementMet
                    : styles.requirementNotMet
                }
              >
                <FontAwesomeIcon
                  icon={passwordStrength.hasMinLength ? faCheck : faTimes}
                  className={styles.requirementIcon}
                />
                <span>At least 8 characters</span>
              </div>
              <div
                className={
                  passwordStrength.hasUppercase
                    ? styles.requirementMet
                    : styles.requirementNotMet
                }
              >
                <FontAwesomeIcon
                  icon={passwordStrength.hasUppercase ? faCheck : faTimes}
                  className={styles.requirementIcon}
                />
                <span>Uppercase letter (A-Z)</span>
              </div>
              <div
                className={
                  passwordStrength.hasLowercase
                    ? styles.requirementMet
                    : styles.requirementNotMet
                }
              >
                <FontAwesomeIcon
                  icon={passwordStrength.hasLowercase ? faCheck : faTimes}
                  className={styles.requirementIcon}
                />
                <span>Lowercase letter (a-z)</span>
              </div>
              <div
                className={
                  passwordStrength.hasNumber
                    ? styles.requirementMet
                    : styles.requirementNotMet
                }
              >
                <FontAwesomeIcon
                  icon={passwordStrength.hasNumber ? faCheck : faTimes}
                  className={styles.requirementIcon}
                />
                <span>At least 1 number (0-9)</span>
              </div>
              <div
                className={
                  passwordStrength.hasSpecialChar
                    ? styles.requirementMet
                    : styles.requirementNotMet
                }
              >
                <FontAwesomeIcon
                  icon={passwordStrength.hasSpecialChar ? faCheck : faTimes}
                  className={styles.requirementIcon}
                />
                <span>At least 1 special character (!@#$...)</span>
              </div>
            </div>
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
              className={`${styles.input} ${
                errors.confirmPassword ? styles.inputError : ""
              }`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <div className={styles.fieldError}>{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className={styles.loadingIcon} />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className={styles.authFooter}>
          Already have an account?{" "}
          <Link to="/login" className={styles.authFooterLink}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

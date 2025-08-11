import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

/**
 * Login component
 * For regular users only - admin functionality removed
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
  };

  /**
   * Validate form before submission
   * @returns {boolean} - Whether the form is valid
   */
  const validateForm = () => {
    const newErrors = {};

    // User validation - email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
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

      // Include role in login credentials
      const loginData = {
        ...formData,
        role: "user",
      };

      // Use the AuthContext login method
      const result = await login(loginData);

      if (result.success) {
        // Redirect to user dashboard
        navigate("/user/dashboard");
      } else {
        setErrors({
          general:
            result.message ||
            "Authentication failed. Please check your credentials.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>
            <FontAwesomeIcon icon={faUser} className={styles.logoIcon} /> PodPal
          </h1>
          <p className={styles.authSubtitle}>
            Sign in to continue to your account
          </p>
        </div>

        {errors.general && (
          <div className={styles.errorMessage}>{errors.general}</div>
        )}

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">
              <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
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
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className={styles.fieldError}>{errors.password}</div>
            )}
          </div>

          <div className={styles.forgotPassword}>
            <Link to="/forgot-password" className={styles.authFooterLink}>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.formDivider}>
          <span className={styles.formDividerText}>OR</span>
        </div>

        <div className={styles.authFooter}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.authFooterLink}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

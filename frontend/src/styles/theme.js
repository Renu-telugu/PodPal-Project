// Theme configuration for styled-components
const lightTheme = {
  colors: {
    primary: '#6C63FF',         // Purple - Main brand color
    secondary: '#5A55DA',       // Darker purple
    accent: '#F8F9FA',          // Very light gray
    background: '#FFFFFF',      // White background
    cardBackground: '#FFFFFF',  // White card background
    text: '#333333',            // Dark text
    textLight: '#6C757D',       // Gray text
    heading: '#222222',         // Very dark text for headings
    border: '#E9ECEF',          // Light gray border
    error: '#FF4757',           // Red for errors
    success: '#28A745',         // Green for success messages
    warning: '#FFC107',         // Yellow for warnings
    info: '#17A2B8',            // Cyan for info messages
    lightGray: '#E9ECEF',       // Light gray
    darkGray: '#6C757D',        // Medium gray
    black: '#000000',           // Black
    white: '#FFFFFF'            // White
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    xxxl: '2rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    pill: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
    card: '0 4px 8px rgba(0,0,0,0.08)',
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  transitions: {
    fast: '0.15s ease',
    medium: '0.3s ease',
    slow: '0.5s ease',
  },
};

const darkTheme = {
  colors: {
    primary: '#8A7FFF',         // Brighter purple for dark mode
    secondary: '#6C63FF',       // Regular purple becomes secondary
    accent: '#2D3748',          // Dark blue-gray
    background: '#121212',      // Very dark gray background
    cardBackground: '#1E1E1E',  // Slightly lighter dark background
    text: '#E2E8F0',            // Light gray text
    textLight: '#A0AEC0',       // Medium gray text
    heading: '#F7FAFC',         // Almost white text for headings
    border: '#2D3748',          // Dark border
    error: '#FF6B6B',           // Brighter red for errors
    success: '#4ADE80',         // Brighter green for success
    warning: '#FBBF24',         // Brighter yellow for warnings
    info: '#3ABFF8',            // Brighter blue for info
    lightGray: '#4A5568',       // Medium-dark gray
    darkGray: '#2D3748',        // Dark gray
    black: '#121212',           // Almost black
    white: '#F7FAFC'            // Almost white
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    xxxl: '2rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    pill: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)',
    md: '0 4px 6px rgba(0,0,0,0.3)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.2)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.2)',
    card: '0 4px 8px rgba(0,0,0,0.3)',
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  transitions: {
    fast: '0.15s ease',
    medium: '0.3s ease',
    slow: '0.5s ease',
  },
};

// Export both themes
export { lightTheme, darkTheme }; 
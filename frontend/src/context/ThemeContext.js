import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const TRANSITION_DURATION = '0.8s'; // Increased transition duration for a slower, smoother effect

// Add CSS transition to body when theme changes
const addTransitionStyles = () => {
  const style = document.createElement('style');
  style.id = 'theme-transition-styles';
  style.innerHTML = `
    *, *::before, *::after {
      transition: background-color ${TRANSITION_DURATION} ease,
                 color ${TRANSITION_DURATION} ease,
                 border-color ${TRANSITION_DURATION} ease,
                 box-shadow ${TRANSITION_DURATION} ease,
                 background ${TRANSITION_DURATION} ease !important;
    }
    
    body {
      transition: background-color ${TRANSITION_DURATION} ease !important;
    }
    
    /* Elements that shouldn't transition */
    button:active, 
    button:focus, 
    input:focus, 
    select:focus, 
    textarea:focus {
      transition: transform 0.2s ease,
                 opacity 0.2s ease !important;
    }
  `;
  document.head.appendChild(style);
};

// Remove transition styles after theme change is complete
const removeTransitionStyles = () => {
  setTimeout(() => {
    const style = document.getElementById('theme-transition-styles');
    if (style) {
      style.parentNode.removeChild(style);
    }
  }, parseFloat(TRANSITION_DURATION) * 1000);
};

export const ThemeProvider = ({ children }) => {
  // Check if theme is stored in localStorage or use system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check if user prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };
  
  const [theme, setTheme] = useState(getInitialTheme);
  const isDarkMode = theme === 'dark';
  
  // Apply theme when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme;
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
    
    // Add transition styles before changing theme
    addTransitionStyles();
    
    // Remove transition styles after animation
    removeTransitionStyles();
    
    // Add visual feedback
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#1a1a2e';
    } else {
      document.body.style.backgroundColor = '#f9fafb';
    }
  }, [theme]);
  
  // Listen for system theme preference changes
  useEffect(() => {
    if (window.matchMedia) {
      const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        const savedTheme = localStorage.getItem('theme');
        // Only update theme if user hasn't explicitly set a preference
        if (!savedTheme) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      };
      
      // Add event listener
      if (colorSchemeQuery.addEventListener) {
        colorSchemeQuery.addEventListener('change', handleChange);
      } else if (colorSchemeQuery.addListener) {
        // Fallback for older browsers
        colorSchemeQuery.addListener(handleChange);
      }
      
      return () => {
        // Cleanup event listener
        if (colorSchemeQuery.removeEventListener) {
          colorSchemeQuery.removeEventListener('change', handleChange);
        } else if (colorSchemeQuery.removeListener) {
          colorSchemeQuery.removeListener(handleChange);
        }
      };
    }
  }, []);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    // Add special transition effect for toggle
    const overlay = document.createElement('div');
    overlay.id = 'theme-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: ${theme === 'light' ? '#1a1a2e' : '#f9fafb'};
      opacity: 0;
      transition: opacity ${TRANSITION_DURATION} ease;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(overlay);
    
    // Trigger fade in
    setTimeout(() => {
      overlay.style.opacity = '0.05';
    }, 10);
    
    // Change theme
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    
    // Remove overlay after transition
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, parseFloat(TRANSITION_DURATION) * 1000);
      }
    }, parseFloat(TRANSITION_DURATION) * 1000 / 2);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;

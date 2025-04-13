import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* Add CSS variables for easier theme access in components */
    --color-primary: ${({ theme }) => theme.colors.primary};
    --color-secondary: ${({ theme }) => theme.colors.secondary};
    --color-accent: ${({ theme }) => theme.colors.accent};
    --color-background: ${({ theme }) => theme.colors.background};
    --color-card-background: ${({ theme }) => theme.colors.cardBackground};
    --color-text: ${({ theme }) => theme.colors.text};
    --color-text-light: ${({ theme }) => theme.colors.textLight};
    --color-heading: ${({ theme }) => theme.colors.heading};
    --color-border: ${({ theme }) => theme.colors.border};
    --color-error: ${({ theme }) => theme.colors.error};
    --color-success: ${({ theme }) => theme.colors.success};
    --color-warning: ${({ theme }) => theme.colors.warning};
    --color-info: ${({ theme }) => theme.colors.info};
    
    /* Spacing */
    --spacing-xs: ${({ theme }) => theme.spacing.xs};
    --spacing-sm: ${({ theme }) => theme.spacing.sm};
    --spacing-md: ${({ theme }) => theme.spacing.md};
    --spacing-lg: ${({ theme }) => theme.spacing.lg};
    --spacing-xl: ${({ theme }) => theme.spacing.xl};
    
    /* Border radius */
    --border-radius-sm: ${({ theme }) => theme.borderRadius.sm};
    --border-radius-md: ${({ theme }) => theme.borderRadius.md};
    --border-radius-lg: ${({ theme }) => theme.borderRadius.lg};
    --border-radius-pill: ${({ theme }) => theme.borderRadius.pill};
    
    /* Shadows */
    --shadow-sm: ${({ theme }) => theme.shadows.sm};
    --shadow-md: ${({ theme }) => theme.shadows.md};
    --shadow-lg: ${({ theme }) => theme.shadows.lg};
    --shadow-card: ${({ theme }) => theme.shadows.card};
    
    /* Transitions */
    --transition-fast: ${({ theme }) => theme.transitions.fast};
    --transition-medium: ${({ theme }) => theme.transitions.medium};
    --transition-slow: ${({ theme }) => theme.transitions.slow};
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: all ${({ theme }) => theme.transitions.medium};
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    transition: color ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  button, input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: 600;
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.heading};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    line-height: 1.5;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  button {
    cursor: pointer;
  }
`;

export default GlobalStyle; 
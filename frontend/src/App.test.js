import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the components used in App
jest.mock('./pages/Landing', () => () => <div>Landing Page</div>);
jest.mock('./pages/Login', () => () => <div>Login Page</div>);
jest.mock('./pages/Signup', () => () => <div>Signup Page</div>);
jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({ isAuthenticated: () => false }),
}));

test('renders app without crashing', () => {
  render(<App />);
});

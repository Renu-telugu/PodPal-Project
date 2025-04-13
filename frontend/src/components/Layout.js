import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Styled components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Button = styled.button`
  background-color: ${({ theme, primary }) =>
    primary ? theme.colors.primary : "transparent"};
  color: ${({ theme, primary }) =>
    primary ? theme.colors.white : theme.colors.primary};
  border: ${({ theme, primary }) =>
    primary ? "none" : `1px solid ${theme.colors.primary}`};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme, primary }) =>
      primary ? theme.colors.secondary : theme.colors.accent};
    border-color: ${({ theme, primary }) =>
      primary ? "none" : theme.colors.secondary};
  }
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.accent};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const Footer = styled.footer`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.white};
  text-align: center;
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

// Layout component
const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container>
      <Header>
        <Logo to="/">PodPal</Logo>
        <Nav>
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}
        </Nav>
      </Header>
      <Main>{children}</Main>
      <Footer>
        &copy; {new Date().getFullYear()} AuthApp. All rights reserved.
      </Footer>
    </Container>
  );
};

export default Layout;

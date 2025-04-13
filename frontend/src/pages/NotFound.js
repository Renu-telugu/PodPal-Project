import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/Layout';

// Styled components
const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  min-height: 60vh;
`;

const StatusCode = styled.h1`
  font-size: 6rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 4rem;
  }
`;

const Message = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

const Description = styled.p`
  max-width: 500px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.darkGray};
`;

const BackButton = styled(Link)`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-decoration: none;
  font-weight: 600;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

// NotFound component
const NotFound = () => {
  return (
    <Layout>
      <NotFoundContainer>
        <StatusCode>404</StatusCode>
        <Message>Page Not Found</Message>
        <Description>
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </Description>
        <BackButton to="/">
          Go to Homepage
        </BackButton>
      </NotFoundContainer>
    </Layout>
  );
};

export default NotFound; 
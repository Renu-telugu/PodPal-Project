import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Layout from '../components/Layout';
import { Button } from '../components/FormElements';
import { useAuth } from '../context/AuthContext';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  animation: ${fadeIn} 0.8s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} 0;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.darkGray};
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const ActionButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  min-width: 150px;
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text};
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  transition: transform ${({ theme }) => theme.transitions.default}, box-shadow ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const FeatureTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.darkGray};
`;

// Landing page component
const Landing = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Layout>
      <HeroSection>
        <Title>Welcome to AuthApp</Title>
        <Subtitle>
          A secure and modern authentication system built with the MERN stack.
          Sign up now to get started!
        </Subtitle>
        <ButtonContainer>
          {isAuthenticated() ? (
            <ActionButton as={Link} to="/dashboard">
              Go to Dashboard
            </ActionButton>
          ) : (
            <>
              <ActionButton as={Link} to="/login">
                Login
              </ActionButton>
              <ActionButton as={Link} to="/signup" secondary>
                Sign Up
              </ActionButton>
            </>
          )}
        </ButtonContainer>
      </HeroSection>
      
      <FeaturesSection>
        <SectionTitle>Key Features</SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <FeatureTitle>Secure Authentication</FeatureTitle>
            <FeatureDescription>
              Industry-standard security with JWT tokens and password hashing.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureTitle>Modern UI</FeatureTitle>
            <FeatureDescription>
              Clean and responsive design that works on all devices.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureTitle>MERN Stack</FeatureTitle>
            <FeatureDescription>
              Built with MongoDB, Express, React, and Node.js.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </FeaturesSection>
    </Layout>
  );
};

export default Landing; 
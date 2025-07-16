import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
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
  padding: 4rem 2rem;
  background-image: ${({ theme }) =>
    theme.colors.background === "#FFFFFF"
      ? "linear-gradient(135deg, #f5f7fa 0%, #e4e8f4 100%)"
      : "linear-gradient(135deg, #1e1e2f 0%, #2d3748 100%)"};
  border-radius: 1rem;
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.8s ease;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 800px;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: 0.875rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    background-color: ${({ theme }) => theme.colors.secondary};
    color: white;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  padding: 0.875rem 2rem;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }
`;

const FeaturesSection = styled.section`
  margin: 3rem 0;
  animation: ${fadeIn} 1s ease 0.3s both;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.heading};
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: all 0.3s ease;
  animation: ${slideUp} 0.6s ease both;
  animation-delay: ${({ index }) => `${0.1 + index * 0.1}s`};

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.heading};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
`;

// Landing page component
const Landing = () => {
  const { isAuthenticated, getUserRole } = useAuth();
  const isLoggedIn = isAuthenticated();
  const userRole = getUserRole();

  const features = [
    {
      icon: "👤",
      title: "Personal Channels",
      description:
        "Each user gets a dedicated channel to share their podcasts, grow followers, and earn badges.",
    },
    {
      icon: "🔍",
      title: "Moderated Uploads",
      description:
        "Ensures quality content with automated checks and manual review before going live.",
    },
    {
      icon: "🎧",
      title: "Listen & Bookmark",
      description:
        "Stream or download your favorite podcasts and bookmark episodes for later.",
    },
    {
      icon: "📈",
      title: "Analytics Dashboard",
      description:
        "Track your podcast performance with detailed statistics and audience insights.",
    },
    {
      icon: "🔔",
      title: "Personalized Recommendations",
      description:
        "Discover new podcasts based on your listening habits and preferences.",
    },
    {
      icon: "💬",
      title: "Engage with Community",
      description:
        "Comment on episodes, join discussions, and connect with like-minded listeners.",
    },
  ];

  return (
    <Layout>
      <HeroSection>
        <HeroTitle>Welcome to PodPal</HeroTitle>
        <HeroSubtitle>
          Your personalized podcast manager. Upload, explore, bookmark, and
          share your voice with the world — all in one place.
        </HeroSubtitle>

        <ButtonContainer>
          {isLoggedIn ? (
            <>
              <PrimaryButton
                to={
                  userRole === "admin" ? "/admin/dashboard" : "/user/dashboard"
                }
              >
                Go to Dashboard
              </PrimaryButton>
            </>
          ) : (
            <>
              <PrimaryButton to="/login">Login</PrimaryButton>
              <SecondaryButton to="/signup">Sign Up</SecondaryButton>
            </>
          )}
        </ButtonContainer>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>What Makes PodPal Special</SectionTitle>

        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index} index={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </FeaturesSection>
    </Layout>
  );
};

export default Landing;

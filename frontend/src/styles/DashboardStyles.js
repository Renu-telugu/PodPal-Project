import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  height: 100vh;
  background-color: #121212; // Dark background
`;

export const Sidebar = styled.div`
  background-color: #000000; // Black sidebar
  padding: ${({ theme }) => theme.spacing.lg};
  color: #FFFFFF; // White text
`;

export const MainContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
  background-color: #121212; // Dark background
`;

export const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const NavTitle = styled.h3`
  color: #B3B3B3; // Light gray for secondary text
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #FFFFFF; // White text
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    background-color: #282828; // Dark gray for hover
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export const PodcastCard = styled.div`
  background-color: #282828; // Dark gray for cards
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #404040; // Slightly lighter gray on hover
  }
`;

export const PodcastImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const PodcastTitle = styled.h3`
  color: #FFFFFF; // White text
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const PodcastCreator = styled.p`
  color: #B3B3B3; // Light gray for secondary text
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const SectionTitle = styled.h2`
  color: #FFFFFF; // White text
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const UploadButton = styled.button`
  background-color: #1DB954; // Spotify green
  color: #FFFFFF;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #1ED760; // Slightly lighter green on hover
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

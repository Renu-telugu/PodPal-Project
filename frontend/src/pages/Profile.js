import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ChannelName = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary || "#7c3aed"};
`;

const ChannelDescription = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text || "#4a4a4a"};
`;

const SubscriberCount = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textLight || "#6b7280"};
  margin-top: 0.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.heading || "#333"};
`;

const PodcastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const PodcastCard = styled.div`
  background-color: ${({ theme }) => theme.colors.card || "#ffffff"};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const PodcastImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const PodcastContent = styled.div`
  padding: 1rem;
`;

const PodcastTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text || "#333"};
`;

const PodcastMeta = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight || "#6b7280"};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error || "#ef4444"};
  text-align: center;
  margin-top: 2rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text || "#4a4a4a"};
`;

const Profile = () => {
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/channel/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChannel(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching channel details"
        );
      }
    };

    fetchChannel();
  }, []);

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!channel) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  return (
    <ProfileContainer>
      <Header>
        <ChannelName>{channel.name}</ChannelName>
        <ChannelDescription>
          {channel.description || "No description available"}
        </ChannelDescription>
        <SubscriberCount>
          {channel.subscribers.length} Subscriber
          {channel.subscribers.length !== 1 ? "s" : ""}
        </SubscriberCount>
      </Header>

      <SectionTitle>Uploads</SectionTitle>
      <PodcastGrid>
        {channel.uploads.map((podcast) => (
          <PodcastCard
            key={podcast._id}
            onClick={() => navigate(`/podcast/${podcast._id}`)} // Navigate to PodcastDetails
          >
            <PodcastImage
              src={`http://localhost:5000/${podcast.coverImagePath}`} // Prepend the backend URL
              alt={podcast.title}
            />
            <PodcastContent>
              <PodcastTitle>{podcast.title}</PodcastTitle>
              <PodcastMeta>
                {podcast.description || "No description"}
              </PodcastMeta>
            </PodcastContent>
          </PodcastCard>
        ))}
      </PodcastGrid>
    </ProfileContainer>
  );
};

export default Profile;

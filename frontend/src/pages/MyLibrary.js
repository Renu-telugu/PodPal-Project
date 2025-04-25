import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaHeart, FaBookmark } from "react-icons/fa";

const API_BASE_URL = "http://localhost:5000";
axios.defaults.baseURL = API_BASE_URL;

const LibraryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors?.primary || "#7c3aed"};
  margin-bottom: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  background-color: ${({ active, theme }) =>
    active ? theme.colors?.primary || "#7c3aed" : "#f3f4f6"};
  color: ${({ active }) => (active ? "white" : "#4b5563")};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ active, theme }) =>
      active ? theme.colors?.primaryDark || "#6025c0" : "#e5e7eb"};
  }
`;

const PodcastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const PodcastCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const PodcastInfo = styled.div`
  padding: 1rem;
`;

const PodcastTitle = styled.h3`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors?.text || "#1f2937"};
  margin-bottom: 0.5rem;
`;

const PodcastMeta = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors?.textLight || "#6b7280"};
  margin-bottom: 0.5rem;
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors?.primary || "#7c3aed"};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${({ theme }) => theme.colors?.primaryDark || "#6025c0"};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors?.textLight || "#6b7280"};
`;

const MyLibrary = () => {
  const [activeTab, setActiveTab] = useState("liked");
  const [likedPodcasts, setLikedPodcasts] = useState([]);
  const [savedPodcasts, setSavedPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [likedResponse, savedResponse] = await Promise.all([
          axios.get("/api/general-podcasts/liked", { headers }),
          axios.get("/api/general-podcasts/saved", { headers }),
        ]);

        console.log('Liked Podcasts Response:', likedResponse.data);
        console.log('Saved Podcasts Response:', savedResponse.data);

        setLikedPodcasts(likedResponse.data.podcasts || []);
        setSavedPodcasts(savedResponse.data.podcasts || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching library:", error);
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  const handlePodcastClick = (podcastId) => {
    navigate(`/podcast/${podcastId}`);
  };

  const displayPodcasts = activeTab === "liked" ? likedPodcasts : savedPodcasts;

  if (loading) {
    return <LibraryContainer>Loading...</LibraryContainer>;
  }

  return (
    <LibraryContainer>
      <Title>My Library</Title>
      <TabContainer>
        <Tab
          active={activeTab === "liked"}
          onClick={() => setActiveTab("liked")}
        >
          Liked Podcasts
        </Tab>
        <Tab
          active={activeTab === "saved"}
          onClick={() => setActiveTab("saved")}
        >
          Saved Podcasts
        </Tab>
      </TabContainer>

      {displayPodcasts.length === 0 ? (
        <EmptyState>
          <h3>No {activeTab} podcasts found</h3>
          <p>Start exploring to {activeTab === "liked" ? "like" : "save"} some podcasts!</p>
        </EmptyState>
      ) : (
        <PodcastGrid>
          {displayPodcasts.map((podcast) => (
            <PodcastCard
              key={podcast._id}
              onClick={() => handlePodcastClick(podcast._id)}
            >
              <CoverImage
                src={`${API_BASE_URL}/${podcast.coverImagePath}`}
                alt={podcast.title}
                onError={(e) => {
                  e.target.src = `${API_BASE_URL}/default-podcast-cover.jpg`;
                }}
              />
              <PodcastInfo>
                <PodcastTitle>{podcast.title}</PodcastTitle>
                <PodcastMeta>
                  {podcast.creatorDetails?.name || "Unknown Creator"}
                </PodcastMeta>
                <ActionBar>
                  <IconButton>
                    <FaPlay />
                  </IconButton>
                  {activeTab === "liked" ? (
                    <IconButton>
                      <FaHeart style={{ color: "#ff4757" }} />
                      <span>{podcast.likes?.length || 0}</span>
                    </IconButton>
                  ) : (
                    <IconButton>
                      <FaBookmark style={{ color: "#feca57" }} />
                    </IconButton>
                  )}
                </ActionBar>
              </PodcastInfo>
            </PodcastCard>
          ))}
        </PodcastGrid>
      )}
    </LibraryContainer>
  );
};

export default MyLibrary;

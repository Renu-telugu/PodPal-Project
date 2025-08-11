import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart, FaBookmark } from "react-icons/fa";
import styled from "styled-components";

const API_BASE_URL = "http://localhost:5000";
axios.defaults.baseURL = API_BASE_URL;

const PodcastDetailsContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding: 2rem 4vw;
  background: ${({ theme }) => theme.colors.background || "#fafbfc"};
`;

const PodcastTitle = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary || "#7c3aed"};
  margin-bottom: 1rem;
`;

const PodcastMeta = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textLight || "#6b7280"};
  margin-bottom: 1rem;
`;

const AudioPlayer = styled.audio`
  width: 100%;
  margin-bottom: 2rem;
`;

const CoverImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 1rem;
`;

const ActionButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text || "#333"};
  font-size: 1rem;

  svg {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    transition: color 0.3s ease;
  }

  &:hover svg {
    color: ${({ theme }) => theme.colors.primary || "#7c3aed"};
  }
`;

const SplitContainer = styled.div`
  display: flex;
  gap: 2rem;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  flex: 1.2;
  min-width: 0;
`;

const PodcastDetails = () => {
  const { podcastId } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [error, setError] = useState("");
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/general-podcasts/${podcastId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPodcast(response.data);
      } catch (err) {
        console.error("Error fetching podcast:", err.response || err.message);
        setError(
          err.response?.data?.message || "Error fetching podcast details"
        );
      }
    };

    fetchPodcast();
  }, [podcastId]);

  const handlePlay = async () => {
    if (!hasStartedPlaying) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `/api/general-podcasts/${podcastId}/increment-listeners`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPodcast((prev) => ({
          ...prev,
          listeners: response.data.listeners,
        }));
        setHasStartedPlaying(true);
      } catch (error) {
        console.error("Error incrementing listeners:", error);
      }
    }
  };

  const handleLike = async (podcastId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/general-podcasts/${podcastId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPodcast((prev) => ({
        ...prev,
        likes: response.data.podcast.likes,
      }));
    } catch (error) {
      console.error("Error liking podcast:", error.response || error.message);
    }
  };

  const handleSave = async (podcastId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/general-podcasts/${podcastId}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(
        response.data.success
          ? "Podcast saved successfully!"
          : "Error saving podcast"
      );
    } catch (error) {
      console.error("Error saving podcast:", error.response || error.message);
      alert("Failed to save podcast. Please try again.");
    }
  };

  if (error) return <div>{error}</div>;
  if (!podcast) return <div>Loading...</div>;

  const likeCount = podcast.likes ? podcast.likes.length : 0;
  const isLiked = podcast.likes && podcast.likes.includes(userId);

  return (
    <PodcastDetailsContainer>
      <SplitContainer>
        <LeftColumn>
          <CoverImage
            src={`http://localhost:5000/${podcast.coverImagePath}`}
            alt={podcast.title}
          />
          <PodcastTitle>{podcast.title}</PodcastTitle>
          <PodcastMeta>
            {podcast.description || "No description available"}
          </PodcastMeta>
          <AudioPlayer controls onPlay={handlePlay}>
            <source
              src={`http://localhost:5000/${podcast.audioPath}`}
              type="audio/wav"
            />
            Your browser does not support the audio element.
          </AudioPlayer>
          <ActionContainer>
            <ActionButton onClick={() => handleLike(podcast._id)}>
              {isLiked ? (
                <FaHeart style={{ color: "#ff4757" }} />
              ) : (
                <FaRegHeart />
              )}
              <span>{likeCount} Likes</span>
            </ActionButton>
            <ActionButton onClick={() => handleSave(podcast._id)}>
              <FaBookmark />
              <span>Save</span>
            </ActionButton>
          </ActionContainer>
        </LeftColumn>
      </SplitContainer>
    </PodcastDetailsContainer>
  );
};

export default PodcastDetails;

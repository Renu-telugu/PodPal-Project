import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import styled from "styled-components";

const PodcastDetailsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
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

const Analytics = styled.div`
  margin-top: 2rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text || "#333"};
`;

const CoverImage = styled.img`
  width: 100%;
  max-height: 400px;
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

const PodcastDetails = () => {
  const { podcastId } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/podcasts/${podcastId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Podcast Data:", response.data); // Debugging
        setPodcast(response.data.podcast); // Ensure you're setting the correct object
      } catch (err) {
        console.error("Error fetching podcast:", err.response || err.message);
        setError(
          err.response?.data?.message || "Error fetching podcast details"
        );
      }
    };

    fetchPodcast();
  }, [podcastId]);

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
      console.log("Liked Podcast:", response.data);

      // Update the likes count in the state
      setPodcast((prevPodcast) => ({
        ...prevPodcast,
        likes: prevPodcast.likes + 1,
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
      console.log("Saved Podcast:", response.data);
      alert("Podcast saved successfully!");
    } catch (error) {
      console.error("Error saving podcast:", error.response || error.message);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!podcast) {
    return <div>Loading...</div>;
  }

  return (
    <PodcastDetailsContainer>
      <CoverImage
        src={`http://localhost:5000/${podcast.coverImagePath}`} // Prepend the backend URL
        alt={podcast.title}
      />
      <PodcastTitle>{podcast.title}</PodcastTitle>
      <PodcastMeta>
        {podcast.description || "No description available"}
      </PodcastMeta>
      <AudioPlayer controls>
        <source
          src={`http://localhost:5000/${podcast.audioPath}`}
          type="audio/wav"
        />
        Your browser does not support the audio element.
      </AudioPlayer>
      <ActionContainer>
        <ActionButton onClick={() => handleLike(podcast._id)}>
          {podcast.likes > 0 ? <FaHeart /> : <FaRegHeart />}
          <span>{podcast.likes} Likes</span>
        </ActionButton>
        <ActionButton onClick={() => handleSave(podcast._id)}>
          <FaBookmark />
          <span>Save</span>
        </ActionButton>
      </ActionContainer>
      <Analytics>
        <p>Views: {podcast.views}</p>
        <p>Likes: {podcast.likes}</p>
      </Analytics>
    </PodcastDetailsContainer>
  );
};

export default PodcastDetails;

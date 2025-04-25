import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Sidebar } from "../styles/DashboardStyles";
import {
  FaPlay,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaSearch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const ExploreContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textLight};
`;

const FilterContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.background};
  color: ${({ active, theme }) =>
    active ? theme.colors.white : theme.colors.text};
  border: 1px solid
    ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ active, theme }) =>
      active ? theme.colors.primaryDark : theme.colors.backgroundLight};
  }
`;

const PodcastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const PodcastCard = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

    .card-overlay {
      opacity: 1;
    }

    .card-actions {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const CardImage = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  background-color: #f0f0f0; /* Fallback color */
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0) 50%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  color: white;

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

const CardActions = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s ease;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const PlayButton = styled(ActionButton)`
  background-color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const CardContent = styled.div`
  padding: 1rem;

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const CategoryTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.75rem;

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }

  span {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.1rem;
`;

const ExplorePodcasts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [podcasts, setPodcasts] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [imageErrors, setImageErrors] = useState({});

  const handleLike = async (podcastId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/podcasts/${podcastId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Liked Podcast:", response.data);

      // Update the likes count in the state
      setPodcasts((prevPodcasts) =>
        prevPodcasts.map((podcast) =>
          podcast._id === podcastId
            ? { ...podcast, likes: podcast.likes + 1 }
            : podcast
        )
      );
    } catch (error) {
      console.error("Error liking podcast:", error.response || error.message);
    }
  };

  const handleSave = async (podcastId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/podcasts/${podcastId}/save`,
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

  // Fetch podcasts from the backend
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/podcasts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched Podcasts:", response.data);

        setPodcasts(response.data.podcasts); // Assuming the API returns an array of podcasts
        setFilteredPodcasts(response.data.podcasts); // Initialize filtered podcasts
      } catch (error) {
        console.error(
          "Error fetching podcasts:",
          error.response || error.message
        );
      }
    };

    fetchPodcasts();
  }, []);

  // Filter podcasts when search query or category filter changes
  useEffect(() => {
    let results = podcasts;

    // Apply category filter
    if (activeFilter !== "All") {
      results = results.filter((podcast) => podcast.genre === activeFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (podcast) =>
          podcast.title.toLowerCase().includes(query) ||
          podcast.description.toLowerCase().includes(query) ||
          podcast.creatorDetails.name.toLowerCase().includes(query)
      );
    }

    setFilteredPodcasts(results);
  }, [podcasts, searchQuery, activeFilter]);

  // Simplify the image handling approach
  const handleImageError = (podcastId) => {
    setImageErrors(prev => ({
      ...prev,
      [podcastId]: true
    }));
  };

  const getImageUrl = (imagePath, podcastId) => {
    // Use a fallback image if the original one fails to load
    if (imageErrors[podcastId]) {
      return "https://via.placeholder.com/300x300?text=Podcast";
    }
    
    // If path is empty, use a default
    if (!imagePath) {
      return "https://via.placeholder.com/300x300?text=No+Image";
    }
    
    // If it's already a full URL, use it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Make sure the path starts with the correct prefix
    if (!imagePath.startsWith('/uploads/') && !imagePath.startsWith('uploads/')) {
      imagePath = `uploads/${imagePath}`;
    }
    
    // Remove any leading slash
    imagePath = imagePath.replace(/^\/+/, '');
    
    // Return the full URL
    return `http://localhost:5000/${imagePath}`;
  };

  return (
    <ExploreContainer>
      <Header>
        <Title>Explore Podcasts</Title>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search podcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </Header>

      <FilterContainer>
        <FilterButton
          active={activeFilter === "All"}
          onClick={() => setActiveFilter("All")}
        >
          All
        </FilterButton>
        {[...new Set(podcasts.map((podcast) => podcast.genre))].map(
          (genre) => (
            <FilterButton
              key={genre}
              active={activeFilter === genre}
              onClick={() => setActiveFilter(genre)}
            >
              {genre}
            </FilterButton>
          )
        )}
      </FilterContainer>

      {filteredPodcasts.length > 0 ? (
        <PodcastGrid>
          {filteredPodcasts.map((podcast) => (
            <PodcastCard key={podcast._id}>
              <CardImage
                src={getImageUrl(podcast.coverImagePath, podcast._id)}
                onClick={() => navigate(`/podcast/${podcast._id}`)}
                onError={() => handleImageError(podcast._id)}
              >
                <CardOverlay className="card-overlay">
                  <h3>{podcast.title}</h3>
                  <p>{podcast.description}</p>
                </CardOverlay>
                <CardActions className="card-actions">
                  <PlayButton
                    onClick={() => navigate(`/podcast/${podcast._id}`)}
                  >
                    <FaPlay />
                  </PlayButton>
                  <div>
                    <ActionButton onClick={() => handleLike(podcast._id)}>
                      <FaHeart />
                    </ActionButton>
                    <ActionButton onClick={() => handleSave(podcast._id)}>
                      <FaBookmark />
                    </ActionButton>
                  </div>
                </CardActions>
              </CardImage>
              <CardContent>
                <CategoryTag>{podcast.genre}</CategoryTag>
                <h3>{podcast.title}</h3>
                <p>{podcast.duration || "Unknown duration"}</p>
                <AuthorInfo>
                  <img
                    src={`https://ui-avatars.com/api/?name=${podcast.creatorDetails.name}`}
                    alt={podcast.creatorDetails.name}
                  />
                  <span>{podcast.creatorDetails.name}</span>
                </AuthorInfo>
                <p>Likes: {podcast.likes}</p>
              </CardContent>
            </PodcastCard>
          ))}
        </PodcastGrid>
      ) : (
        <NoResults>
          No podcasts found matching your search. Try different keywords or
          filters.
        </NoResults>
      )}
    </ExploreContainer>
  );
};

export default ExplorePodcasts;

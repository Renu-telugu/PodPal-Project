import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

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
const Container = styled.div`
  width: 100%;
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.text || '#1a202c'};
  }
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

const SearchContainer = styled.div`
  position: relative;
  width: 350px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: 25px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e2e8f0'};
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:focus {
    border-color: ${({ theme }) => theme.colors?.primary || '#7c3aed'};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors?.primaryLight || 'rgba(124, 58, 237, 0.2)'};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors?.primary || '#7c3aed'};
  font-size: 1rem;
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors?.primary || '#7c3aed'};
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: ${({ theme }) => theme.colors?.primaryDark || '#6025c0'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 0.5rem;
  background-color: #f8f9fa;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(124, 58, 237, 0.3);
    border-radius: 4px;
  }
`;

const FilterButton = styled.button`
  padding: 0.5rem 1.25rem;
  background-color: ${({ active, theme }) => 
    active ? (theme.colors?.primary || '#7c3aed') : 'white'};
  color: ${({ active, theme }) => 
    active ? (theme.colors?.white || '#ffffff') : (theme.colors?.text || '#1a202c')};
  border: 1px solid ${({ active, theme }) => 
    active ? (theme.colors?.primary || '#7c3aed') : (theme.colors?.border || '#e2e8f0')};
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: ${({ active }) => active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background-color: ${({ active, theme }) => 
      active ? (theme.colors?.primaryDark || '#6025c0') : (theme.colors?.backgroundLight || '#f1f5f9')};
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PodcastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const PodcastCard = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors?.card || '#ffffff'};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(229, 231, 235, 0.5);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    
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
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  color: white;
  border-radius: 16px;
  
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
  }
  
  p {
    margin: 0;
    font-size: 0.85rem;
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
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s ease;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  transition: background-color 0.2s ease;
  margin-left: 0.5rem;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const PlayButton = styled(ActionButton)`
  background-color: ${({ theme }) => theme.colors?.primary || '#7c3aed'};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors?.primaryDark || '#6025c0'};
  }
`;

const CardContent = styled.div`
  padding: 0.75rem;
  
  h3 {
    margin: 0 0 0.3rem 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors?.text || '#1a202c'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  p {
    margin: 0;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors?.textLight || '#718096'};
  }
`;

const CategoryTag = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background-color: ${({ theme }) => theme.colors?.primaryLight || 'rgba(124, 58, 237, 0.1)'};
  color: ${({ theme }) => theme.colors?.primary || '#7c3aed'};
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  
  img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 0.5rem;
    object-fit: cover;
  }
  
  span {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors?.textLight || '#718096'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors?.textLight || '#718096'};
  font-size: 1.1rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors?.card || '#ffffff'};
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  
  h3 {
    margin: 1.5rem 0 0.5rem;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors?.text || '#1a202c'};
  }
  
  p {
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors?.textLight || '#718096'};
    max-width: 500px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors?.primaryLight || 'rgba(124, 58, 237, 0.2)'};
  margin-bottom: 1rem;
`;

// Sample user podcasts (in a real app, this would come from an API)
const MOCK_USER_PODCASTS = [
  {
    id: 1,
    title: "My Tech Thoughts",
    description: "Personal reflections on the latest technology trends and developments",
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Technology",
    author: "You",
    authorImage: "https://randomuser.me/api/portraits/women/33.jpg",
    duration: "28 min",
    language: "English",
    explicit: false,
    publishDate: "2023-10-15",
    isFavorite: true,
    isBookmarked: false,
    plays: 156
  },
  {
    id: 2,
    title: "Fitness Journey",
    description: "Documenting my personal fitness transformation and sharing tips I've learned",
    coverImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Health",
    author: "You",
    authorImage: "https://randomuser.me/api/portraits/women/33.jpg",
    duration: "35 min",
    language: "English",
    explicit: false,
    publishDate: "2023-09-28",
    isFavorite: false,
    isBookmarked: true,
    plays: 89
  }
];

const MyPodcasts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [podcasts, setPodcasts] = useState(MOCK_USER_PODCASTS);
  const [filteredPodcasts, setFilteredPodcasts] = useState(MOCK_USER_PODCASTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Handle navigating to upload page
  const handleUploadClick = () => {
    navigate('/user/upload');
  };

  // Handle edit podcast
  const handleEditPodcast = (id) => {
    console.log(`Edit podcast with ID: ${id}`);
    // In a real app, navigate to edit page: navigate(`/user/edit-podcast/${id}`);
  };

  // Handle delete podcast
  const handleDeletePodcast = (id) => {
    if (window.confirm("Are you sure you want to delete this podcast?")) {
      console.log(`Delete podcast with ID: ${id}`);
      setPodcasts(prev => prev.filter(podcast => podcast.id !== id));
    }
  };
  
  // Filter podcasts when search query or category filter changes
  useEffect(() => {
    let results = podcasts;
    
    // Apply category filter
    if (activeFilter !== "All") {
      results = results.filter(podcast => podcast.category === activeFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(podcast => 
        podcast.title.toLowerCase().includes(query) ||
        podcast.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredPodcasts(results);
  }, [podcasts, searchQuery, activeFilter]);

  // Get unique categories from podcasts
  const categories = ["All", ...new Set(podcasts.map(podcast => podcast.category))];
  
  return (
    <Container>
      <Header>
        <h2>My Podcasts</h2>
        <UploadButton onClick={handleUploadClick}>
          <FaPlus /> Upload New Podcast
        </UploadButton>
      </Header>

      <SearchContainer>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Search your podcasts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>

      {podcasts.length > 0 && (
        <FilterContainer>
          {categories.map(category => (
            <FilterButton
              key={category}
              active={activeFilter === category}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </FilterButton>
          ))}
        </FilterContainer>
      )}
      
      {podcasts.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <FaPlus />
          </EmptyIcon>
          <h3>You haven't uploaded any podcasts yet</h3>
          <p>Start sharing your voice with the world by uploading your first podcast episode.</p>
          <UploadButton onClick={handleUploadClick}>
            <FaPlus /> Upload New Podcast
          </UploadButton>
        </EmptyState>
      ) : filteredPodcasts.length > 0 ? (
        <PodcastGrid>
          {filteredPodcasts.map(podcast => (
            <PodcastCard key={podcast.id}>
              <CardImage src={podcast.coverImage}>
                <CardOverlay className="card-overlay">
                  <h3>{podcast.title}</h3>
                  <p>{podcast.description}</p>
                </CardOverlay>
                <CardActions className="card-actions">
                  <PlayButton>
                    <FaPlay />
                  </PlayButton>
                  <ButtonGroup>
                    <ActionButton onClick={(e) => {
                      e.stopPropagation();
                      handleEditPodcast(podcast.id);
                    }}>
                      <FaEdit />
                    </ActionButton>
                    <ActionButton onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePodcast(podcast.id);
                    }}>
                      <FaTrash />
                    </ActionButton>
                  </ButtonGroup>
                </CardActions>
              </CardImage>
              <CardContent>
                <CategoryTag>{podcast.category}</CategoryTag>
                <h3>{podcast.title}</h3>
                <p>{podcast.duration} • {podcast.plays} plays</p>
                <AuthorInfo>
                  <img src={podcast.authorImage} alt={podcast.author} />
                  <span>{podcast.publishDate}</span>
                </AuthorInfo>
              </CardContent>
            </PodcastCard>
          ))}
        </PodcastGrid>
      ) : (
        <NoResults>
          No podcasts found matching your search. Try different keywords or filters.
        </NoResults>
      )}
    </Container>
  );
};

export default MyPodcasts; 
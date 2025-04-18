import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { FaPlay, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaSearch } from 'react-icons/fa';

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
  border: 1px solid ${({ active, theme }) => 
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
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
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
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
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

// Mock data for podcasts
const MOCK_PODCASTS = [
  {
    id: 1,
    title: "The Tech Revolution",
    description: "Exploring the latest in technology and how it's changing our world",
    coverImage: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Technology",
    author: "Alex Johnson",
    authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    duration: "45 min",
    isFavorite: false,
    isBookmarked: true
  },
  {
    id: 2,
    title: "Health Matters",
    description: "Discussions about health, wellness, and living your best life",
    coverImage: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "Health",
    author: "Sarah Miller",
    authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    duration: "32 min",
    isFavorite: true,
    isBookmarked: false
  },
  {
    id: 3,
    title: "Business Insights",
    description: "Strategies and stories from successful entrepreneurs",
    coverImage: "https://images.unsplash.com/photo-1664575602554-2087b04935a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "Business",
    author: "James Wilson",
    authorImage: "https://randomuser.me/api/portraits/men/62.jpg",
    duration: "52 min",
    isFavorite: false,
    isBookmarked: false
  },
  {
    id: 4,
    title: "Science Today",
    description: "Breaking down complex scientific discoveries and their implications",
    coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Science",
    author: "Emma Roberts",
    authorImage: "https://randomuser.me/api/portraits/women/33.jpg",
    duration: "38 min",
    isFavorite: true,
    isBookmarked: true
  },
  {
    id: 5,
    title: "History Unveiled",
    description: "Fascinating stories from history that you might not know",
    coverImage: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "History",
    author: "Daniel Thompson",
    authorImage: "https://randomuser.me/api/portraits/men/45.jpg",
    duration: "42 min",
    isFavorite: false,
    isBookmarked: true
  },
  {
    id: 6,
    title: "The Sports Hour",
    description: "Discussions about the latest in sports and athletics",
    coverImage: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
    category: "Sports",
    author: "Michael Brown",
    authorImage: "https://randomuser.me/api/portraits/men/22.jpg",
    duration: "35 min",
    isFavorite: true,
    isBookmarked: false
  },
  {
    id: 7,
    title: "Art & Culture",
    description: "Exploring the world of art, culture, and creativity",
    coverImage: "https://images.unsplash.com/photo-1551732998-9573f695fdbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Art",
    author: "Olivia Garcia",
    authorImage: "https://randomuser.me/api/portraits/women/55.jpg",
    duration: "40 min",
    isFavorite: false,
    isBookmarked: false
  },
  {
    id: 8,
    title: "Financial Freedom",
    description: "Tips and strategies for managing money and building wealth",
    coverImage: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Finance",
    author: "Robert Smith",
    authorImage: "https://randomuser.me/api/portraits/men/77.jpg",
    duration: "47 min",
    isFavorite: true,
    isBookmarked: true
  },
];

// Categories derived from mock data
const ALL_CATEGORIES = ["All", ...new Set(MOCK_PODCASTS.map(podcast => podcast.category))];

const ExplorePodcasts = () => {
  const { user } = useAuth();
  const [podcasts, setPodcasts] = useState(MOCK_PODCASTS);
  const [filteredPodcasts, setFilteredPodcasts] = useState(MOCK_PODCASTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Toggle favorite status for a podcast
  const toggleFavorite = (id) => {
    setPodcasts(prev => 
      prev.map(podcast => 
        podcast.id === id ? { ...podcast, isFavorite: !podcast.isFavorite } : podcast
      )
    );
  };
  
  // Toggle bookmark status for a podcast
  const toggleBookmark = (id) => {
    setPodcasts(prev => 
      prev.map(podcast => 
        podcast.id === id ? { ...podcast, isBookmarked: !podcast.isBookmarked } : podcast
      )
    );
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
        podcast.description.toLowerCase().includes(query) ||
        podcast.author.toLowerCase().includes(query)
      );
    }
    
    setFilteredPodcasts(results);
  }, [podcasts, searchQuery, activeFilter]);
  
  return (
    <Layout>
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
          {ALL_CATEGORIES.map(category => (
            <FilterButton
              key={category}
              active={activeFilter === category}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </FilterButton>
          ))}
        </FilterContainer>
        
        {filteredPodcasts.length > 0 ? (
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
                    <div>
                      <ActionButton onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(podcast.id);
                      }}>
                        {podcast.isFavorite ? <FaHeart color="#ff4757" /> : <FaRegHeart />}
                      </ActionButton>
                      <ActionButton onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(podcast.id);
                      }}>
                        {podcast.isBookmarked ? <FaBookmark color="#feca57" /> : <FaRegBookmark />}
                      </ActionButton>
                    </div>
                  </CardActions>
                </CardImage>
                <CardContent>
                  <CategoryTag>{podcast.category}</CategoryTag>
                  <h3>{podcast.title}</h3>
                  <p>{podcast.duration}</p>
                  <AuthorInfo>
                    <img src={podcast.authorImage} alt={podcast.author} />
                    <span>{podcast.author}</span>
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
      </ExploreContainer>
    </Layout>
  );
};

export default ExplorePodcasts; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserHome.module.css';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, 
  faHeart,
  faClock, 
  faEye,
  faUpload,
  faBookmark
} from '@fortawesome/free-solid-svg-icons';

/**
 * User Home component
 * Main dashboard view for regular users
 */
const UserHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    totalPodcasts: 0,
    totalListeners: 0,
    totalTime: '0 hours',
    growth: '0%'
  });
  const [recentPodcasts, setRecentPodcasts] = useState([]);
  const [popularPodcasts, setPopularPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPodcasts, setLikedPodcasts] = useState({});
  const [savedPodcasts, setSavedPodcasts] = useState({});
  
  useEffect(() => {
    // Fetch user data and podcasts
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required. Please log in again.');
          return;
        }
        
        // Fetch user's podcasts
        const response = await fetch('/api/podcasts/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        
        // Update state with real data
        setRecentPodcasts(data.podcasts.slice(0, 3));
        setUserData({
          totalPodcasts: data.count,
          totalListeners: Math.floor(Math.random() * 5000),
          totalTime: `${Math.floor(Math.random() * 50)} hours`,
          growth: `+${Math.floor(Math.random() * 25)}%`
        });
        
        // For now, use mock data for popular podcasts
        setPopularPodcasts([
          {
            id: 4,
            title: 'True Crime Stories',
            description: 'Investigating mysterious cases and unsolved crimes from around the world. We dive deep into evidence and testimonies.',
            genre: 'True Crime',
            date: '2023-05-20',
            duration: '52 min',
            views: 5600,
            coverImagePath: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
          },
          {
            id: 5,
            title: 'Financial Freedom',
            description: 'Tips for personal finance management and investment strategies to help you achieve financial independence.',
            genre: 'Business',
            date: '2023-05-15',
            duration: '29 min',
            views: 4300,
            coverImagePath: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
          },
          {
            id: 6,
            title: 'Mindfulness Meditation',
            description: 'Guided meditation sessions to help you reduce stress, improve focus, and find inner peace in your daily life.',
            genre: 'Health & Wellness',
            date: '2023-05-10',
            duration: '18 min',
            views: 3800,
            coverImagePath: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1498&q=80'
          }
        ]);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleUploadClick = () => {
    navigate('/user/upload');
  };
  
  // Get user's first name for welcome message
  const getUserFirstName = () => {
    if (user && user.name) {
      return user.name.split(' ')[0];
    }
    return '';
  };

  // Get class based on genre
  const getGenreClass = (genre) => {
    if (genre === 'Nature') return styles.nature;
    if (genre === 'Religion & Spirituality') return styles.religion;
    if (genre === 'True Crime') return styles.trueCrime;
    if (genre === 'Business') return styles.business;
    if (genre === 'Health & Wellness') return styles.health;
    return styles.other;
  };

  // Handle like button click
  const handleLike = (e, podcastId) => {
    e.stopPropagation(); // Prevent card click
    setLikedPodcasts(prev => ({
      ...prev,
      [podcastId]: !prev[podcastId]
    }));
    // Here you would make an API call to like/unlike the podcast
  };

  // Handle save button click
  const handleSave = (e, podcastId) => {
    e.stopPropagation(); // Prevent card click
    setSavedPodcasts(prev => ({
      ...prev,
      [podcastId]: !prev[podcastId]
    }));
    // Here you would make an API call to save/unsave the podcast
  };
  
  return (
    <div className={styles.userHome}>
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeText}>
          <h2>Welcome Back, {getUserFirstName()}!</h2>
          <p>Here's what's happening with your podcasts today</p>
        </div>
        <button className={styles.uploadButton} onClick={handleUploadClick}>
          <FontAwesomeIcon icon={faUpload} />
          Upload New Podcast
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'rgba(90, 24, 154, 0.1)' }}>
            🎙️
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statValue}>{userData.totalPodcasts}</h3>
            <p className={styles.statLabel}>Total Podcasts</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'rgba(157, 78, 221, 0.1)' }}>
            👥
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statValue}>{userData.totalListeners}</h3>
            <p className={styles.statLabel}>Total Listeners</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'rgba(199, 125, 255, 0.1)' }}>
            ⏱️
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statValue}>{userData.totalTime}</h3>
            <p className={styles.statLabel}>Total Listen Time</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'rgba(224, 170, 255, 0.1)' }}>
            📈
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statValue}>{userData.growth}</h3>
            <p className={styles.statLabel}>Monthly Growth</p>
          </div>
        </div>
      </div>
      
      {/* Recent Podcasts */}
      <div className={styles.sectionHeading}>
        <h2>Your Recent Podcasts</h2>
        <a href="#" className={styles.viewAll} onClick={() => navigate('/user/my-podcasts')}>View all</a>
      </div>
      
      <div className={styles.podcastGrid}>
        {recentPodcasts.map(podcast => (
          <div key={podcast.id || podcast._id} className={styles.podcastCard} onClick={() => navigate(`/podcast/${podcast.id || podcast._id}`)}>
            <div 
              className={`${styles.podcastImage} ${getGenreClass(podcast.genre)}`}
              style={{ 
                '--podcast-bg-image': `url(${podcast.coverImagePath || 'https://via.placeholder.com/400x400?text=PodPal'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className={styles.overlay}></div>
              <div className={styles.genreTag}>{podcast.genre || 'Other'}</div>
              <div className={styles.podcastTitle}>{podcast.title}</div>
              <div className={styles.podcastSubtitle}>{podcast.creator?.name || ''}</div>
              
              <button className={styles.playButton}>
                <FontAwesomeIcon icon={faPlay} />
              </button>
              
              <div className={styles.actionButtons}>
                <button 
                  className={`${styles.actionButton} ${likedPodcasts[podcast.id || podcast._id] ? styles.actionButtonActive : ''}`}
                  onClick={(e) => handleLike(e, podcast.id || podcast._id)}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <button 
                  className={`${styles.actionButton} ${savedPodcasts[podcast.id || podcast._id] ? styles.actionButtonActive : ''}`}
                  onClick={(e) => handleSave(e, podcast.id || podcast._id)}
                >
                  <FontAwesomeIcon icon={faBookmark} />
                </button>
              </div>
            </div>
            
            <div className={styles.podcastContent}>
              <p className={styles.podcastDescription}>{podcast.description}</p>
              <div className={styles.podcastMeta}>
                <div className={styles.podcastStat}>
                  <FontAwesomeIcon icon={faClock} />
                  <span>{podcast.duration || 'Unknown duration'}</span>
                </div>
                <div className={styles.podcastStat}>
                  <FontAwesomeIcon icon={faEye} />
                  <span>{podcast.views || 0} views</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Popular Podcasts */}
      <div className={styles.sectionHeading}>
        <h2>Popular Now</h2>
      </div>
      
      <div className={styles.podcastGrid}>
        {popularPodcasts.map(podcast => (
          <div key={podcast.id} className={styles.podcastCard}>
            <div 
              className={`${styles.podcastImage} ${getGenreClass(podcast.genre)}`}
              style={{ 
                '--podcast-bg-image': `url(${podcast.coverImagePath || 'https://via.placeholder.com/400x400?text=PodPal'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className={styles.overlay}></div>
              <div className={styles.genreTag}>{podcast.genre}</div>
              <div className={styles.podcastTitle}>{podcast.title}</div>
              <div className={styles.podcastSubtitle}></div>
              
              <button className={styles.playButton}>
                <FontAwesomeIcon icon={faPlay} />
              </button>
              
              <div className={styles.actionButtons}>
                <button 
                  className={`${styles.actionButton} ${likedPodcasts[podcast.id] ? styles.actionButtonActive : ''}`}
                  onClick={(e) => handleLike(e, podcast.id)}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <button 
                  className={`${styles.actionButton} ${savedPodcasts[podcast.id] ? styles.actionButtonActive : ''}`}
                  onClick={(e) => handleSave(e, podcast.id)}
                >
                  <FontAwesomeIcon icon={faBookmark} />
                </button>
              </div>
            </div>
            
            <div className={styles.podcastContent}>
              <p className={styles.podcastDescription}>{podcast.description}</p>
              <div className={styles.podcastMeta}>
                <div className={styles.podcastStat}>
                  <FontAwesomeIcon icon={faClock} />
                  <span>{podcast.duration}</span>
                </div>
                <div className={styles.podcastStat}>
                  <FontAwesomeIcon icon={faEye} />
                  <span>{podcast.views} views</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHome; 
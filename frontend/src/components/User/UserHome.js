import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserHome.module.css';

/**
 * User Home component
 * Main dashboard view for regular users
 */
const UserHome = () => {
  const navigate = useNavigate();
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
            description: 'Investigating mysterious cases',
            image: '🔍',
            date: '2023-05-20',
            duration: '52 min',
            views: 5600
          },
          {
            id: 5,
            title: 'Financial Freedom',
            description: 'Tips for personal finance',
            image: '💰',
            date: '2023-05-15',
            duration: '29 min',
            views: 4300
          },
          {
            id: 6,
            title: 'Mindfulness Meditation',
            description: 'Guided meditation sessions',
            image: '🧘',
            date: '2023-05-10',
            duration: '18 min',
            views: 3800
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
    navigate('/user/upload-podcast');
  };
  
  return (
    <div className={styles.userHome}>
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeText}>
          <h2>Welcome Back, User!</h2>
          <p>Here's what's happening with your podcasts today</p>
        </div>
        <button className={styles.uploadButton} onClick={handleUploadClick}>
          <span className={styles.btnIcon}>📤</span>
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
        <a href="#" className={styles.viewAll}>View all</a>
      </div>
      
      <div className={styles.podcastGrid}>
        {recentPodcasts.map(podcast => (
          <div key={podcast.id} className={styles.podcastCard}>
            <div className={styles.podcastImage}>
              {podcast.image}
            </div>
            <div className={styles.podcastContent}>
              <h3 className={styles.podcastTitle}>{podcast.title}</h3>
              <p className={styles.podcastDescription}>{podcast.description}</p>
              <div className={styles.podcastMeta}>
                <span>{podcast.duration}</span>
                <span>{podcast.date}</span>
                <span>{podcast.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Popular Podcasts */}
      <div className={styles.sectionHeading}>
        <h2>Popular Now</h2>
        <a href="#" className={styles.viewAll}>Explore</a>
      </div>
      
      <div className={styles.podcastGrid}>
        {popularPodcasts.map(podcast => (
          <div key={podcast.id} className={styles.podcastCard}>
            <div className={styles.podcastImage}>
              {podcast.image}
            </div>
            <div className={styles.podcastContent}>
              <h3 className={styles.podcastTitle}>{podcast.title}</h3>
              <p className={styles.podcastDescription}>{podcast.description}</p>
              <div className={styles.podcastMeta}>
                <span>{podcast.duration}</span>
                <span>{podcast.date}</span>
                <span>{podcast.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHome; 
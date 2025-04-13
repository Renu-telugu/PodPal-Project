import React from 'react';
import styles from './UserHome.module.css';

/**
 * User Home component
 * Main dashboard view for regular users
 */
const UserHome = () => {
  // Mock data for podcasts
  const recentPodcasts = [
    {
      id: 1,
      title: 'Tech Talk Episode 42',
      description: 'The latest in tech news and updates',
      image: '🖥️',
      date: '2023-06-15',
      duration: '45 min',
      views: 1200
    },
    {
      id: 2,
      title: 'Creative Minds',
      description: 'Interviews with artists and creators',
      image: '🎨',
      date: '2023-06-10',
      duration: '32 min',
      views: 890
    },
    {
      id: 3,
      title: 'Science Weekly',
      description: 'Latest discoveries in science',
      image: '🔬',
      date: '2023-06-05',
      duration: '38 min',
      views: 750
    }
  ];
  
  // Mock data for popular podcasts
  const popularPodcasts = [
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
  ];
  
  // Mock data for user stats
  const userStats = {
    totalPodcasts: 12,
    totalListeners: 4567,
    totalTime: '23.5 hours',
    growth: '+15%'
  };
  
  return (
    <div className={styles.userHome}>
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeText}>
          <h2>Welcome Back, User!</h2>
          <p>Here's what's happening with your podcasts today</p>
        </div>
        <button className="btn btn-primary">
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
            <h3 className={styles.statValue}>{userStats.totalPodcasts}</h3>
            <p className={styles.statLabel}>Total Podcasts</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'rgba(157, 78, 221, 0.1)' }}>
            👥
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statValue}>{userStats.totalListeners}</h3>
            <p className={styles.statLabel}>Total Listeners</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'rgba(199, 125, 255, 0.1)' }}>
            ⏱️
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statValue}>{userStats.totalTime}</h3>
            <p className={styles.statLabel}>Total Listen Time</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'rgba(224, 170, 255, 0.1)' }}>
            📈
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statValue}>{userStats.growth}</h3>
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
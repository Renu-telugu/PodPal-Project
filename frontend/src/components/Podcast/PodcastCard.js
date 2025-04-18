import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PodcastCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faClock, faPlay } from '@fortawesome/free-solid-svg-icons';

/**
 * PodcastCard component
 * Displays a podcast with image, title, description, and meta info
 * @param {Object} podcast - The podcast object containing all podcast data
 */
const PodcastCard = ({ podcast }) => {
  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format duration for display
  const formatDuration = (seconds) => {
    if (!seconds) return '0 min';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };
  
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardImage}>
        <img
          src={podcast.coverImagePath || 'https://via.placeholder.com/300x200?text=Podcast+Cover'}
          alt={podcast.title}
        />
        <button className={styles.playButton}>
          <FontAwesomeIcon icon={faPlay} />
        </button>
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>
          <Link to={`/podcasts/${podcast._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {podcast.title}
          </Link>
        </h3>
        
        <p className={styles.cardDescription}>{podcast.description}</p>
        
        <div className={styles.cardMeta}>
          <div className={styles.metaItem}>
            <FontAwesomeIcon icon={faClock} />
            {formatDuration(podcast.duration)}
          </div>
          <div className={styles.metaItem}>
            <FontAwesomeIcon icon={faHeart} />
            {podcast.likes}
          </div>
          <div className={styles.metaItem}>
            <FontAwesomeIcon icon={faComment} />
            {podcast.comments}
          </div>
        </div>
      </div>
      
      <div className={styles.cardFooter}>
        <div className={styles.creator}>By {podcast.creator?.name || 'Unknown'}</div>
        <div className={styles.publishDate}>{formatDate(podcast.createdAt)}</div>
      </div>
    </div>
  );
};

export default PodcastCard; 
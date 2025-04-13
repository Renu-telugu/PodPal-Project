import React from 'react';
import styles from './Header.module.css';

/**
 * Header component for dashboard layouts
 * @param {Object} props - Component props
 * @param {string} props.title - Page title to display in header
 * @param {number} props.notificationCount - Number of notifications
 * @param {function} props.onMenuToggle - Function to toggle mobile menu
 */
const Header = ({ title, notificationCount = 0, onMenuToggle }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button 
          className={styles.menuToggle} 
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>
      
      <div className={styles.headerRight}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder="Search podcasts, episodes..." 
            aria-label="Search"
          />
        </div>
        
        <div className={styles.notifications}>
          <button 
            className={styles.notificationButton}
            aria-label={`${notificationCount} notifications`}
          >
            🔔
            {notificationCount > 0 && (
              <span className={styles.notificationBadge}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

/**
 * Sidebar component for dashboard layouts
 * @param {Object} props - Component props
 * @param {Array} props.menuItems - Array of menu items to display
 * @param {boolean} props.isMobile - Whether the viewport is mobile
 * @param {function} props.onMobileClose - Function to close sidebar on mobile
 */
const Sidebar = ({ menuItems, isMobile, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  
  // Get user info from localStorage
  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('userRole') || 'user';
  const userInitial = userName.charAt(0).toUpperCase();
  
  // Toggle sidebar collapsed state
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  
  // Handle logout
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    
    // Redirect to login page
    navigate('/login');
  };
  
  // Group menu items by section
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const section = item.section || 'Main';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {});
  
  return (
    <>
      {isMobile && <div className={styles.backdrop} onClick={onMobileClose} />}
      
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''} ${isMobile ? styles.sidebarOpen : ''}`}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🎧</span>
            <span className={styles.logoText}>PodPal</span>
          </Link>
          
          <button 
            className={styles.toggleButton}
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
        
        <nav className={styles.navMenu}>
          {Object.entries(groupedMenuItems).map(([section, items]) => (
            <div key={section} className={styles.navSection}>
              <h3 className={styles.navSectionTitle}>{section}</h3>
              
              <ul>
                {items.map((item) => (
                  <li key={item.path} className={styles.navItem}>
                    <Link
                      to={item.path}
                      className={`${styles.navLink} ${location.pathname === item.path ? styles.navLinkActive : ''}`}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navText}>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Logout link */}
          <div className={styles.navSection}>
            <ul>
              <li className={styles.navItem}>
                <a
                  href="#"
                  className={styles.navLink}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  <span className={styles.navIcon}>🚪</span>
                  <span className={styles.navText}>Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className={styles.userSection}>
          <div className={styles.userAvatar}>{userInitial}</div>
          <div>
            <div className={styles.userName}>{userName}</div>
            <div className={styles.userRole}>{userRole === 'admin' ? 'Administrator' : 'Content Creator'}</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 
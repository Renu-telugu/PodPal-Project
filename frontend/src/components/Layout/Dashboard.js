import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeadphones, 
  faChevronLeft, 
  faChevronRight, 
  faBars,
  faSignOutAlt,
  faUser,
  faToggleOn,
  faToggleOff
} from '@fortawesome/free-solid-svg-icons';

/**
 * Dashboard Layout Component
 * Provides a reusable dashboard layout with sidebar navigation
 * Can be used by both admin and user dashboards
 * 
 * @param {Object} props
 * @param {Array} props.menuItems - Array of menu items with label, path, and icon
 * @param {React.ReactNode} props.children - Dashboard content
 * @param {string} props.pageTitle - Title for the dashboard
 */
const Dashboard = ({ menuItems, children, pageTitle = 'Dashboard' }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add actual dark mode implementation here if needed
    document.body.classList.toggle('darkMode');
  };
  
  // Group menu items by section
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const section = item.section || 'Menu';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {});
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page
  };
  
  return (
    <div className={`${styles.dashboardContainer} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <button
          className={styles.mobileSidebarToggle}
          onClick={toggleMobileSidebar}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h2 className={styles.mobileTitle}>{pageTitle}</h2>
      </div>
      
      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          isSidebarCollapsed ? styles.collapsed : ''
        } ${isMobileSidebarOpen ? styles.mobileOpen : ''}`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <FontAwesomeIcon icon={faHeadphones} className={styles.logoIcon} />
            {!isSidebarCollapsed && <span className={styles.logoText}>PodPal</span>}
          </div>
          <button
            className={styles.sidebarToggle}
            onClick={toggleSidebar}
          >
            <FontAwesomeIcon icon={isSidebarCollapsed ? faChevronRight : faChevronLeft} />
          </button>
        </div>
        
        <div className={styles.sidebarContent}>
          {Object.entries(groupedMenuItems).map(([sectionName, items]) => (
            <div key={sectionName} className={styles.menuGroup}>
              {!isSidebarCollapsed && (
                <h3 className={styles.menuGroupTitle}>{sectionName}</h3>
              )}
              <ul className={styles.menuList}>
                {items.map((item, index) => (
                  <li key={index} className={styles.menuItem}>
                    <Link
                      to={item.path}
                      className={styles.menuLink}
                      title={isSidebarCollapsed ? item.label : ''}
                    >
                      <span className={styles.menuIcon}>
                        {typeof item.icon === 'string' 
                          ? <FontAwesomeIcon icon={item.icon} /> 
                          : item.icon}
                      </span>
                      {!isSidebarCollapsed && (
                        <span className={styles.menuLabel}>{item.label}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className={styles.sidebarFooter}>
          {!isSidebarCollapsed && (
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div>
                <div className={styles.userName}>{user?.name || 'User'}</div>
                <div className={styles.userRole}>{user?.role || 'User'}</div>
              </div>
            </div>
          )}
          
          <button 
            className={styles.themeToggle}
            onClick={toggleDarkMode}
            title="Toggle dark mode"
          >
            <FontAwesomeIcon icon={isDarkMode ? faToggleOn : faToggleOff} />
            {!isSidebarCollapsed && <span>Dark Mode</span>}
          </button>
          
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FontAwesomeIcon icon={faSignOutAlt} className={styles.logoutIcon} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className={styles.sidebarOverlay}
          onClick={toggleMobileSidebar}
        />
      )}
      
      {/* Main Content */}
      <div 
        className={`${styles.mainContent} ${
          isSidebarCollapsed ? styles.expanded : ''
        }`}
      >
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
          
          <div className={styles.headerControls}>
            <button 
              className={styles.themeToggleHeader}
              onClick={toggleDarkMode}
              title="Toggle dark mode"
            >
              <FontAwesomeIcon icon={isDarkMode ? faToggleOn : faToggleOff} />
              <span>Theme</span>
            </button>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          {children || (
            <div className={styles.sampleContent}>
              <h2>This is the {pageTitle} page</h2>
              <p>This is sample content for demonstration purposes. Replace this with your actual content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
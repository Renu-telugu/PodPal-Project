import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
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
import styled from 'styled-components';

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
  
  // Use ThemeContext instead of local state
  const { theme, toggleTheme, isDarkMode } = useTheme();
  
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  // Log theme changes for debugging
  useEffect(() => {
    console.log('Current theme in Dashboard:', theme, 'isDarkMode:', isDarkMode);
  }, [theme, isDarkMode]);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
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
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!user || !user.name) return '?';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
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
                    {item.isExternal ? (
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
                    ) : (
                      <NavLink
                        to={item.path}
                        end
                        className={({ isActive }) => isActive ? styles.activeMenuLink : styles.menuLink}
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
                      </NavLink>
                    )}
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
                {getInitials()}
              </div>
              <div>
                <div className={styles.userName}>{user?.name || 'User'}</div>
                <div className={styles.userRole}>{user?.role || 'User'}</div>
              </div>
            </div>
          )}
          
          <button 
            className={styles.themeToggle}
            onClick={toggleTheme}
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
              onClick={toggleTheme}
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
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ThemeToggle from '../ThemeToggle';
import { 
  faHeadphones, 
  faChevronLeft, 
  faChevronRight, 
  faBars,
  faSignOutAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

// Styled components for custom elements
const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

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
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''} ${isMobileSidebarOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logo}>
            <FontAwesomeIcon icon={faHeadphones} className={styles.logoIcon} />
            {!isSidebarCollapsed && <span>PodPal</span>}
          </Link>
          <button className={styles.sidebarToggle} onClick={toggleSidebar}>
            <FontAwesomeIcon icon={isSidebarCollapsed ? faChevronRight : faChevronLeft} />
          </button>
        </div>
        
        <div className={styles.sidebarContent}>
          {Object.entries(groupedMenuItems).map(([sectionName, items]) => (
            <div key={sectionName} className={styles.menuGroup}>
              {!isSidebarCollapsed && <h3 className={styles.menuGroupTitle}>{sectionName}</h3>}
              <ul className={styles.menuList}>
                {items.map((item) => (
                  <li key={item.path} className={styles.menuItem}>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => 
                        isActive ? styles.activeMenuLink : styles.menuLink
                      }
                    >
                      <span className={styles.menuIcon}>{item.icon}</span>
                      {!isSidebarCollapsed && <span className={styles.menuLabel}>{item.label}</span>}
                    </NavLink>
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
                {user?.role !== 'user' && <div className={styles.userRole}>{user?.role}</div>}
              </div>
            </div>
          )}
          
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
      <div className={`${styles.mainContent} ${isSidebarCollapsed ? styles.expanded : ''}`}>
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <button className={styles.mobileSidebarToggle} onClick={toggleMobileSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className={styles.mobileTitle}>{pageTitle}</div>
          <ThemeToggle />
        </div>
        
        {/* Desktop Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
          <HeaderControls>
            <ThemeToggle />
          </HeaderControls>
        </div>
        
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
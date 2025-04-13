import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../Layout/Dashboard';
import AdminHome from './AdminHome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartBar, 
  faChartLine, 
  faFileAlt, 
  faMicrophone, 
  faTags, 
  faStar, 
  faUsers, 
  faUserLock, 
  faExclamationTriangle, 
  faCog, 
  faPalette, 
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import styles from './AdminDashboard.module.css';

// Sample content components for each route
const SampleContent = ({ title, description }) => (
  <div className={styles.samplePage}>
    <h2>{title}</h2>
    <p>{description}</p>
    <div className={styles.sampleContent}>
      <div className={styles.placeholderSection}>
        <div className={styles.placeholderHeader}></div>
        <div className={styles.placeholderBody}>
          {[...Array(4)].map((_, index) => (
            <div key={index} className={styles.placeholderItem}></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Analytics = () => (
  <SampleContent 
    title="Analytics Dashboard" 
    description="View comprehensive analytics about platform usage, content performance, and user engagement."
  />
);

const Reports = () => (
  <SampleContent 
    title="Reports" 
    description="Generate and export custom reports on platform metrics, content statistics, and user activity."
  />
);

const PodcastManagement = () => (
  <SampleContent 
    title="Podcast Management" 
    description="Review, approve, and manage all podcasts uploaded to the platform."
  />
);

const Categories = () => (
  <SampleContent 
    title="Categories" 
    description="Create and organize podcast categories and tags for better content discovery."
  />
);

const FeaturedContent = () => (
  <SampleContent 
    title="Featured Content" 
    description="Curate featured content, highlight trending podcasts, and manage homepage promotions."
  />
);

const UserManagement = () => (
  <SampleContent 
    title="User Management" 
    description="View and manage all users, including verification status, activity, and account details."
  />
);

const RolesPermissions = () => (
  <SampleContent 
    title="Roles & Permissions" 
    description="Define user roles and set granular permissions for platform functionality."
  />
);

const Moderation = () => (
  <SampleContent 
    title="Content Moderation" 
    description="Review flagged content, handle user reports, and enforce community guidelines."
  />
);

const Settings = () => (
  <SampleContent 
    title="System Settings" 
    description="Configure system-wide settings including email notifications, storage options, and API integrations."
  />
);

const Appearance = () => (
  <SampleContent 
    title="Appearance" 
    description="Customize the platform's look and feel, including themes, colors, and layout options."
  />
);

const Logs = () => (
  <SampleContent 
    title="System Logs" 
    description="Monitor system activity, view error logs, and track administrative actions."
  />
);

/**
 * Admin Dashboard component
 * Handles routing for admin-specific pages and provides the dashboard layout
 */
const AdminDashboard = () => {
  // Define menu items for admin sidebar
  const adminMenuItems = [
    {
      section: 'Dashboard',
      items: [
        { label: 'Overview', path: '/admin/dashboard', icon: <FontAwesomeIcon icon={faChartBar} /> },
        { label: 'Analytics', path: '/admin/analytics', icon: <FontAwesomeIcon icon={faChartLine} /> },
        { label: 'Reports', path: '/admin/reports', icon: <FontAwesomeIcon icon={faFileAlt} /> }
      ]
    },
    {
      section: 'Content Management',
      items: [
        { label: 'Podcasts', path: '/admin/podcasts', icon: <FontAwesomeIcon icon={faMicrophone} /> },
        { label: 'Categories', path: '/admin/categories', icon: <FontAwesomeIcon icon={faTags} /> },
        { label: 'Featured Content', path: '/admin/featured', icon: <FontAwesomeIcon icon={faStar} /> }
      ]
    },
    {
      section: 'User Management',
      items: [
        { label: 'Users', path: '/admin/users', icon: <FontAwesomeIcon icon={faUsers} /> },
        { label: 'Roles & Permissions', path: '/admin/roles', icon: <FontAwesomeIcon icon={faUserLock} /> },
        { label: 'Moderation', path: '/admin/moderation', icon: <FontAwesomeIcon icon={faExclamationTriangle} /> }
      ]
    },
    {
      section: 'System',
      items: [
        { label: 'Settings', path: '/admin/settings', icon: <FontAwesomeIcon icon={faCog} /> },
        { label: 'Appearance', path: '/admin/appearance', icon: <FontAwesomeIcon icon={faPalette} /> },
        { label: 'Logs', path: '/admin/logs', icon: <FontAwesomeIcon icon={faClipboardList} /> }
      ]
    }
  ];
  
  return (
    <Dashboard menuItems={adminMenuItems.flatMap(section => section.items)} pageTitle="Admin Dashboard">
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminHome />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/podcasts" element={<PodcastManagement />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/featured" element={<FeaturedContent />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/roles" element={<RolesPermissions />} />
        <Route path="/moderation" element={<Moderation />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/appearance" element={<Appearance />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Dashboard>
  );
};

export default AdminDashboard; 
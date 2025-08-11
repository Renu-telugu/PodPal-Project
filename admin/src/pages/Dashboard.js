import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./Home";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faClipboardList,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Dashboard.module.css";
import { useAuth } from "../context/AuthContext";

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

// Route components
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
    description="Customize the look and feel of the platform, including themes, colors, and layout options."
  />
);

const Logs = () => (
  <SampleContent
    title="System Logs"
    description="View detailed logs of system activities, errors, and user actions for troubleshooting."
  />
);

const Dashboard = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>Dashboard</h3>
            <ul>
              <li>
                <Link to="/" className={styles.navLink}>
                  <FontAwesomeIcon icon={faChartBar} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/analytics" className={styles.navLink}>
                  <FontAwesomeIcon icon={faChartLine} />
                  <span>Analytics</span>
                </Link>
              </li>
              <li>
                <Link to="/reports" className={styles.navLink}>
                  <FontAwesomeIcon icon={faFileAlt} />
                  <span>Reports</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>Content</h3>
            <ul>
              <li>
                <Link to="/podcasts" className={styles.navLink}>
                  <FontAwesomeIcon icon={faMicrophone} />
                  <span>Podcasts</span>
                </Link>
              </li>
              <li>
                <Link to="/categories" className={styles.navLink}>
                  <FontAwesomeIcon icon={faTags} />
                  <span>Categories</span>
                </Link>
              </li>
              <li>
                <Link to="/featured" className={styles.navLink}>
                  <FontAwesomeIcon icon={faStar} />
                  <span>Featured</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>Users</h3>
            <ul>
              <li>
                <Link to="/users" className={styles.navLink}>
                  <FontAwesomeIcon icon={faUsers} />
                  <span>User Management</span>
                </Link>
              </li>
              <li>
                <Link to="/roles" className={styles.navLink}>
                  <FontAwesomeIcon icon={faUserLock} />
                  <span>Roles & Permissions</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>Moderation</h3>
            <ul>
              <li>
                <Link to="/moderation" className={styles.navLink}>
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <span>Content Moderation</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>System</h3>
            <ul>
              <li>
                <Link to="/settings" className={styles.navLink}>
                  <FontAwesomeIcon icon={faCog} />
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <Link to="/appearance" className={styles.navLink}>
                  <FontAwesomeIcon icon={faPalette} />
                  <span>Appearance</span>
                </Link>
              </li>
              <li>
                <Link to="/logs" className={styles.navLink}>
                  <FontAwesomeIcon icon={faClipboardList} />
                  <span>System Logs</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <ul>
              <li>
                <button onClick={handleLogout} className={styles.navLink}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;

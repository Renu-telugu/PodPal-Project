import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Dashboard from "../Layout/Dashboard";
import UserHome from "./UserHome";
import BrowsePodcasts from "./BrowsePodcasts";
import MyPodcasts from "./MyPodcasts";
import UploadPodcast from "../../pages/UploadPodcast";
import Profile from "../../pages/Profile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faBookOpen,
  faUpload,
  faMicrophone,
  faFileAlt,
  faUser,
  faCog,
  faCreditCard,
  faCompass
} from "@fortawesome/free-solid-svg-icons";
import styles from "./UserDashboard.module.css";

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

const MyLibrary = () => (
  <SampleContent
    title="My Library"
    description="Access your saved podcasts, favorite episodes, and custom playlists."
  />
);

const Drafts = () => (
  <SampleContent
    title="Drafts"
    description="Continue working on your podcast drafts before publishing them."
  />
);

const Settings = () => (
  <SampleContent
    title="Settings"
    description="Manage your account settings, notification preferences, and privacy options."
  />
);

const Subscription = () => (
  <SampleContent
    title="Subscription"
    description="View and manage your subscription plan, billing information, and payment history."
  />
);

/**
 * User Dashboard component
 * Handles routing for user-specific pages and provides the dashboard layout
 */
const UserDashboard = () => {
  // Define menu items for user sidebar
  const userMenuItems = [
    {
      section: "Main",
      items: [
        {
          label: "Home",
          path: "/user/dashboard",
          icon: <FontAwesomeIcon icon={faHome} />,
        },
        {
          label: "Explore Podcasts",
          path: "/user/browse",
          icon: <FontAwesomeIcon icon={faSearch} style={{ color: 'inherit' }} />,
        },
        {
          label: "My Library",
          path: "/user/library",
          icon: <FontAwesomeIcon icon={faBookOpen} />,
        },
      ],
    },
    {
      section: "Content",
      items: [
        {
          label: "Upload Podcast",
          path: "/user/upload",
          icon: <FontAwesomeIcon icon={faUpload} />,
        },
        {
          label: "My Podcasts",
          path: "/user/my-podcasts",
          icon: <FontAwesomeIcon icon={faMicrophone} />,
        },
        {
          label: "Drafts",
          path: "/user/drafts",
          icon: <FontAwesomeIcon icon={faFileAlt} />,
        },
      ],
    },
    {
      section: "Account",
      items: [
        {
          label: "Profile",
          path: "/user/profile",
          icon: <FontAwesomeIcon icon={faUser} />,
        },
        {
          label: "Settings",
          path: "/user/settings",
          icon: <FontAwesomeIcon icon={faCog} />,
        },
        {
          label: "Subscription",
          path: "/user/subscription",
          icon: <FontAwesomeIcon icon={faCreditCard} />,
        }
      ],
    },
  ];

  return (
    <Dashboard
      menuItems={userMenuItems.flatMap((section) => section.items)}
      pageTitle="User Dashboard"
    >
      <Routes>
        <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
        <Route path="/dashboard" element={<UserHome />} />
        <Route path="/browse" element={<BrowsePodcasts />} />
        <Route path="/library" element={<MyLibrary />} />
        <Route path="/upload" element={<UploadPodcast />} />
        <Route path="/my-podcasts" element={<MyPodcasts />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
      </Routes>
    </Dashboard>
  );
};

export default UserDashboard;

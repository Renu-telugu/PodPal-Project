// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Dashboard from '../Layout/Dashboard';
// import AdminHome from './AdminHome';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faChartBar,
//   faChartLine,
//   faFileAlt,
//   faMicrophone,
//   faTags,
//   faStar,
//   faUsers,
//   faUserLock,
//   faExclamationTriangle,
//   faCog,
//   faPalette,
//   faClipboardList
// } from '@fortawesome/free-solid-svg-icons';
// import styles from './AdminDashboard.module.css';

// // Sample content components for each route
// const SampleContent = ({ title, description }) => (
//   <div className={styles.samplePage}>
//     <h2>{title}</h2>
//     <p>{description}</p>
//     <div className={styles.sampleContent}>
//       <div className={styles.placeholderSection}>
//         <div className={styles.placeholderHeader}></div>
//         <div className={styles.placeholderBody}>
//           {[...Array(4)].map((_, index) => (
//             <div key={index} className={styles.placeholderItem}></div>
//           ))}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const Analytics = () => (
//   <SampleContent
//     title="Analytics Dashboard"
//     description="View comprehensive analytics about platform usage, content performance, and user engagement."
//   />
// );

// const Reports = () => (
//   <SampleContent
//     title="Reports"
//     description="Generate and export custom reports on platform metrics, content statistics, and user activity."
//   />
// );

// const PodcastManagement = () => (
//   <SampleContent
//     title="Podcast Management"
//     description="Review, approve, and manage all podcasts uploaded to the platform."
//   />
// );

// const Categories = () => (
//   <SampleContent
//     title="Categories"
//     description="Create and organize podcast categories and tags for better content discovery."
//   />
// );

// const FeaturedContent = () => (
//   <SampleContent
//     title="Featured Content"
//     description="Curate featured content, highlight trending podcasts, and manage homepage promotions."
//   />
// );

// const UserManagement = () => (
//   <SampleContent
//     title="User Management"
//     description="View and manage all users, including verification status, activity, and account details."
//   />
// );

// const RolesPermissions = () => (
//   <SampleContent
//     title="Roles & Permissions"
//     description="Define user roles and set granular permissions for platform functionality."
//   />
// );

// const Moderation = () => (
//   <SampleContent
//     title="Content Moderation"
//     description="Review flagged content, handle user reports, and enforce community guidelines."
//   />
// );

// const Settings = () => (
//   <SampleContent
//     title="System Settings"
//     description="Configure system-wide settings including email notifications, storage options, and API integrations."
//   />
// );

// const Appearance = () => (
//   <SampleContent
//     title="Appearance"
//     description="Customize the platform's look and feel, including themes, colors, and layout options."
//   />
// );

// const Logs = () => (
//   <SampleContent
//     title="System Logs"
//     description="Monitor system activity, view error logs, and track administrative actions."
//   />
// );

// /**
//  * Admin Dashboard component
//  * Handles routing for admin-specific pages and provides the dashboard layout
//  */
// const AdminDashboard = () => {
//   // Define menu items for admin sidebar
//   const adminMenuItems = [
//     {
//       section: 'Dashboard',
//       items: [
//         { label: 'Overview', path: '/admin/dashboard', icon: <FontAwesomeIcon icon={faChartBar} /> },
//         { label: 'Analytics', path: '/admin/analytics', icon: <FontAwesomeIcon icon={faChartLine} /> },
//         { label: 'Reports', path: '/admin/reports', icon: <FontAwesomeIcon icon={faFileAlt} /> }
//       ]
//     },
//     {
//       section: 'Content Management',
//       items: [
//         { label: 'Podcasts', path: '/admin/podcasts', icon: <FontAwesomeIcon icon={faMicrophone} /> },
//         { label: 'Categories', path: '/admin/categories', icon: <FontAwesomeIcon icon={faTags} /> },
//         { label: 'Featured Content', path: '/admin/featured', icon: <FontAwesomeIcon icon={faStar} /> }
//       ]
//     },
//     {
//       section: 'User Management',
//       items: [
//         { label: 'Users', path: '/admin/users', icon: <FontAwesomeIcon icon={faUsers} /> },
//         { label: 'Roles & Permissions', path: '/admin/roles', icon: <FontAwesomeIcon icon={faUserLock} /> },
//         { label: 'Moderation', path: '/admin/moderation', icon: <FontAwesomeIcon icon={faExclamationTriangle} /> }
//       ]
//     },
//     {
//       section: 'System',
//       items: [
//         { label: 'Settings', path: '/admin/settings', icon: <FontAwesomeIcon icon={faCog} /> },
//         { label: 'Appearance', path: '/admin/appearance', icon: <FontAwesomeIcon icon={faPalette} /> },
//         { label: 'Logs', path: '/admin/logs', icon: <FontAwesomeIcon icon={faClipboardList} /> }
//       ]
//     }
//   ];

//   return (
//     <Dashboard menuItems={adminMenuItems.flatMap(section => section.items)} pageTitle="Admin Dashboard">
//       <Routes>
//         <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
//         <Route path="/dashboard" element={<AdminHome />} />
//         <Route path="/analytics" element={<Analytics />} />
//         <Route path="/reports" element={<Reports />} />
//         <Route path="/podcasts" element={<PodcastManagement />} />
//         <Route path="/categories" element={<Categories />} />
//         <Route path="/featured" element={<FeaturedContent />} />
//         <Route path="/users" element={<UserManagement />} />
//         <Route path="/roles" element={<RolesPermissions />} />
//         <Route path="/moderation" element={<Moderation />} />
//         <Route path="/settings" element={<Settings />} />
//         <Route path="/appearance" element={<Appearance />} />
//         <Route path="/logs" element={<Logs />} />
//         <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
//       </Routes>
//     </Dashboard>
//   );
// };

// export default AdminDashboard;
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../Layout/Dashboard";
import AdminHome from "./AdminHome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faChartLine,
  faFileAlt,
  faMicrophone,
  faTags,
  faStar,
  faUsers,
  faExclamationTriangle,
  faCog,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./AdminDashboard.module.css";

import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

// ---------------- DATA ----------------

// USERS (podpal#1 → podpal#12)
const usersData = Array.from({ length: 12 }, (_, i) => ({
  name: `podpal#${i + 1}`,
  email: `user${i + 1}@podpal.com`,
  role: i % 3 === 0 ? "Admin" : i % 2 === 0 ? "Creator" : "User",
  status: i % 2 === 0 ? "Active" : "Inactive",
  joined: `2026-03-${10 + i}`,
}));

// PODCASTS
const podcastsData = [
  {
    title: "AI Revolution",
    creator: "podpal#2",
    category: "Tech",
    duration: "32m",
    status: "Approved",
    plays: 2400,
  },
  {
    title: "Startup Hustle",
    creator: "podpal#3",
    category: "Business",
    duration: "45m",
    status: "Pending",
    plays: 1800,
  },
  {
    title: "Mind Matters",
    creator: "podpal#5",
    category: "Health",
    duration: "28m",
    status: "Approved",
    plays: 1200,
  },
  {
    title: "History Vault",
    creator: "podpal#7",
    category: "History",
    duration: "50m",
    status: "Rejected",
    plays: 600,
  },
  {
    title: "Crypto Talks",
    creator: "podpal#8",
    category: "Finance",
    duration: "38m",
    status: "Approved",
    plays: 2100,
  },
  {
    title: "Daily News",
    creator: "podpal#9",
    category: "News",
    duration: "20m",
    status: "Pending",
    plays: 900,
  },
];

// REPORTS
const reportsData = [
  {
    name: "Monthly Usage",
    type: "System",
    by: "Admin",
    date: "2026-04-01",
    status: "Completed",
    size: "2.4MB",
  },
  {
    name: "Revenue Report",
    type: "Finance",
    by: "Admin",
    date: "2026-04-02",
    status: "Completed",
    size: "3.1MB",
  },
  {
    name: "Growth Report",
    type: "Analytics",
    by: "System",
    date: "2026-04-03",
    status: "Processing",
    size: "--",
  },
  {
    name: "User Activity",
    type: "User",
    by: "Admin",
    date: "2026-04-04",
    status: "Completed",
    size: "1.2MB",
  },
  {
    name: "Podcast Trends",
    type: "Content",
    by: "System",
    date: "2026-04-05",
    status: "Completed",
    size: "2.8MB",
  },
  {
    name: "Error Logs",
    type: "System",
    by: "Admin",
    date: "2026-04-06",
    status: "Completed",
    size: "900KB",
  },
];

// LOGS
const logsData = [
  { action: "Login", user: "podpal#1", time: "2 min ago" },
  { action: "Uploaded Podcast", user: "podpal#2", time: "10 min ago" },
  { action: "Deleted Podcast", user: "podpal#3", time: "30 min ago" },
  { action: "Changed Settings", user: "Admin", time: "1 hr ago" },
];

// ---------------- COMPONENTS ----------------

// // ANALYTICS
// const Analytics = () => {
//   const lineData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May"],
//     datasets: [
//       {
//         label: "Users",
//         data: [1000, 2000, 3000, 4500, 5200],
//         borderColor: "#6a5acd",
//         tension: 0.4,
//       },
//       {
//         label: "Podcasts",
//         data: [400, 800, 1200, 1600, 1900],
//         borderColor: "#00b4d8",
//         tension: 0.4,
//       },
//     ],
//   };

//   const pieData = {
//     labels: [
//       "Technology",
//       "Business",
//       "Health & Fitness",
//       "Entertainment",
//       "Education",
//       "Other",
//     ],
//     datasets: [
//       {
//         data: [220, 180, 140, 160, 130, 170],
//         backgroundColor: [
//           "#5A4FCF", // primary purple
//           "#6C63FF", // vibrant purple
//           "#8A7CFF", // soft lavender
//           "#A29BFE", // light purple
//           "#CDB4FF", // pastel purple
//           "#E0D4FF", // very light (Other)
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div className={styles.page}>
//       <h2>Analytics</h2>
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: "60px",
//         }}
//       >
//         <div style={{ width: "550px" }}>
//           <Line data={lineData} />
//         </div>
//         <div style={{ width: "450px", height: "450px" }}>
//           <Pie data={pieData} />
//         </div>
//       </div>
//     </div>
//   );
// };
const Analytics = () => {
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Users",
        data: [1000, 2000, 3000, 4500, 5200],
        borderColor: "#6C63FF",
        backgroundColor: "rgba(108, 99, 255, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Podcasts",
        data: [400, 800, 1200, 1600, 1900],
        borderColor: "#A29BFE",
        backgroundColor: "rgba(162, 155, 254, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const pieData = {
    labels: [
      "Technology",
      "Business",
      "Health & Fitness",
      "Entertainment",
      "Education",
      "Other",
    ],
    datasets: [
      {
        data: [220, 180, 140, 160, 130, 170],
        backgroundColor: [
          "#5A4FCF",
          "#6C63FF",
          "#8A7CFF",
          "#A29BFE",
          "#CDB4FF",
          "#E0D4FF",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Analytics</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {/* Line Chart Card */}
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>Growth Overview</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Pie Chart Card */}
        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>Category Distribution</h3>

          <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
            {/* Pie */}
            <div style={{ width: "280px", height: "280px" }}>
              <Pie
                data={pieData}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                }}
              />
            </div>

            {/* Custom Legend */}
            <div>
              {pieData.labels.map((label, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      backgroundColor: pieData.datasets[0].backgroundColor[i],
                      borderRadius: "3px",
                    }}
                  />
                  <span style={{ fontSize: "14px", color: "#444" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// REPORTS
const Reports = () => (
  <div className={styles.page}>
    <h2>Reports</h2>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Generated By</th>
          <th>Date</th>
          <th>Status</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        {reportsData.map((r, i) => (
          <tr key={i}>
            <td>{r.name}</td>
            <td>{r.type}</td>
            <td>{r.by}</td>
            <td>{r.date}</td>
            <td>
              <span className={styles.badge}>{r.status}</span>
            </td>
            <td>{r.size}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// PODCASTS
const PodcastManagement = () => (
  <div className={styles.page}>
    <h2>Podcasts</h2>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Creator</th>
          <th>Category</th>
          <th>Duration</th>
          <th>Status</th>
          <th>Plays</th>
        </tr>
      </thead>
      <tbody>
        {podcastsData.map((p, i) => (
          <tr key={i}>
            <td>{p.title}</td>
            <td>{p.creator}</td>
            <td>{p.category}</td>
            <td>{p.duration}</td>
            <td>
              <span className={styles.badge}>{p.status}</span>
            </td>
            <td>{p.plays}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// USERS
const UserManagement = () => (
  <div className={styles.page}>
    <h2>Users</h2>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Joined</th>
        </tr>
      </thead>
      <tbody>
        {usersData.map((u, i) => (
          <tr key={i}>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>
              <span className={styles.badge}>{u.status}</span>
            </td>
            <td>{u.joined}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// LOGS
const Logs = () => (
  <div className={styles.page}>
    <h2>System Logs</h2>
    {logsData.map((log, i) => (
      <div key={i} className={styles.logItem}>
        {log.action} by <b>{log.user}</b> • {log.time}
      </div>
    ))}
  </div>
);

// CATEGORIES
const Categories = () => (
  <div className={styles.page}>
    <h2>Categories</h2>
    <div className={styles.cardGrid}>
      <div className={styles.card}>Technology (320)</div>
      <div className={styles.card}>Business (280)</div>
      <div className={styles.card}>Health (210)</div>
      <div className={styles.card}>Finance (150)</div>
      <div className={styles.card}>News (190)</div>
    </div>
  </div>
);

// SETTINGS
const Settings = () => (
  <div className={styles.page}>
    <h2>Settings</h2>
    <div className={styles.cardGrid}>
      <div className={styles.card}>Email Notifications: Enabled</div>
      <div className={styles.card}>Auto Approval: Disabled</div>
      <div className={styles.card}>Storage Limit: 10GB</div>
      <div className={styles.card}>API Status: Active</div>
    </div>
  </div>
);

// FEATURED
const FeaturedContent = () => (
  <div className={styles.page}>
    <h2>Featured Content</h2>
    <p>Top trending podcasts displayed here.</p>
  </div>
);

// MODERATION
const Moderation = () => (
  <div className={styles.page}>
    <h2>Moderation</h2>
    <p>Review flagged content and user reports.</p>
  </div>
);

// MAIN
const AdminDashboard = () => {
  const menu = [
    {
      label: "Overview",
      path: "/admin/dashboard",
      icon: <FontAwesomeIcon icon={faChartBar} />,
    },
    {
      label: "Analytics",
      path: "/admin/analytics",
      icon: <FontAwesomeIcon icon={faChartLine} />,
    },
    {
      label: "Reports",
      path: "/admin/reports",
      icon: <FontAwesomeIcon icon={faFileAlt} />,
    },
    {
      label: "Podcasts",
      path: "/admin/podcasts",
      icon: <FontAwesomeIcon icon={faMicrophone} />,
    },
    {
      label: "Categories",
      path: "/admin/categories",
      icon: <FontAwesomeIcon icon={faTags} />,
    },
    {
      label: "Featured",
      path: "/admin/featured",
      icon: <FontAwesomeIcon icon={faStar} />,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: <FontAwesomeIcon icon={faUsers} />,
    },
    {
      label: "Moderation",
      path: "/admin/moderation",
      icon: <FontAwesomeIcon icon={faExclamationTriangle} />,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: <FontAwesomeIcon icon={faCog} />,
    },
    {
      label: "Logs",
      path: "/admin/logs",
      icon: <FontAwesomeIcon icon={faClipboardList} />,
    },
  ];

  return (
    <Dashboard menuItems={menu} pageTitle="Admin Dashboard">
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/dashboard" element={<AdminHome />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/podcasts" element={<PodcastManagement />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/featured" element={<FeaturedContent />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/moderation" element={<Moderation />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </Dashboard>
  );
};

export default AdminDashboard;

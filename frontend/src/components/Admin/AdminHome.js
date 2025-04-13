import React from 'react';
import styles from './AdminHome.module.css';
import { FaUsers, FaPodcast, FaChartLine, FaCheck } from 'react-icons/fa';

/**
 * Admin Home component
 * Main dashboard view for administrators
 */
const AdminHome = () => {
  // Mock data for system stats
  const systemStats = [
    { title: 'Total Users', value: '5,234', change: '+12%', icon: <FaUsers />, iconBg: '#5a189a20', iconColor: '#5a189a' },
    { title: 'Total Podcasts', value: '1,893', change: '+8%', icon: <FaPodcast />, iconBg: '#048ba820', iconColor: '#048ba8' },
    { title: 'Avg. Listen Time', value: '32m', change: '+5%', icon: <FaChartLine />, iconBg: '#10002b20', iconColor: '#10002b' },
    { title: 'Content Approval', value: '96%', change: '+2%', icon: <FaCheck />, iconBg: '#38b00020', iconColor: '#38b000' }
  ];
  
  // Mock data for recent activities
  const recentActivities = [
    { user: 'John Doe', action: 'uploaded', target: 'Tech Talk Episode 12', time: '10 minutes ago', status: 'approved' },
    { user: 'Sarah Smith', action: 'updated', target: 'Mindfulness Series', time: '1 hour ago', status: 'approved' },
    { user: 'Mike Johnson', action: 'deleted', target: 'Outdated Podcast', time: '3 hours ago', status: 'deleted' },
    { user: 'Emily Brown', action: 'commented on', target: 'History Unveiled', time: '5 hours ago', status: 'approved' },
    { user: 'Alex Wilson', action: 'subscribed to', target: 'Premium Plan', time: '1 day ago', status: 'approved' }
  ];
  
  // Mock data for pending approvals
  const pendingApprovals = [
    { title: 'Science Weekly Podcast', submitter: 'Robert Chen', submitted: '2 days ago', type: 'New Podcast' },
    { title: 'Health & Wellness Special', submitter: 'Lisa Wong', submitted: '3 days ago', type: 'Featured Request' },
    { title: 'Business Insights', submitter: 'David Miller', submitted: '4 days ago', type: 'Category Change' },
    { title: 'Gaming Central', submitter: 'Tyler Scott', submitted: '5 days ago', type: 'New Podcast' }
  ];
  
  // Get current date and time for the welcome banner
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className={styles.adminHome}>
      {/* Welcome banner */}
      <div className={styles.welcomeBanner}>
        <div>
          <h2>Welcome to Admin Dashboard</h2>
          <p>Monitor and manage your podcast platform</p>
        </div>
        <div className={styles.dateTime}>{currentDate}</div>
      </div>
      
      {/* System statistics */}
      <div className={styles.statsGrid}>
        {systemStats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3 className={styles.statTitle}>{stat.title}</h3>
              <div 
                className={styles.statIcon} 
                style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}
              >
                {stat.icon}
              </div>
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={`${styles.statChange} ${stat.change.startsWith('+') ? styles.positive : styles.negative}`}>
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>
      
      {/* Content columns */}
      <div className={styles.columns}>
        {/* Recent Activities */}
        <div className={styles.column}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent Activities</h3>
            <button className="btn btn-sm btn-outline-primary">View All</button>
          </div>
          
          <div className={styles.activityList}>
            {recentActivities.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityContent}>
                  <div className={styles.activityUser}>{activity.user}</div>
                  <div className={styles.activityAction}>
                    {activity.action} <span className={styles.activityTarget}>{activity.target}</span>
                  </div>
                  <div className={styles.activityTime}>{activity.time}</div>
                </div>
                <span className={`${styles.activityStatus} ${styles[activity.status]}`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right column: Pending Approvals and Quick Actions */}
        <div className={styles.column}>
          {/* Pending Approvals */}
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Pending Approvals</h3>
            <button className="btn btn-sm btn-outline-primary">View All</button>
          </div>
          
          <div className={styles.approvalList}>
            {pendingApprovals.map((approval, index) => (
              <div key={index} className={styles.approvalItem}>
                <div className={styles.approvalInfo}>
                  <h4 className={styles.approvalTitle}>{approval.title}</h4>
                  <div className={styles.approvalMeta}>
                    Submitted by {approval.submitter} • {approval.submitted} • {approval.type}
                  </div>
                </div>
                <div className={styles.approvalActions}>
                  <button className="btn btn-sm btn-outline-success">Approve</button>
                  <button className="btn btn-sm btn-outline-danger">Reject</button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <div className={styles.actionButtons}>
              <button className="btn btn-primary">Add Category</button>
              <button className="btn btn-primary">Send Newsletter</button>
              <button className="btn btn-outline-secondary">View System Logs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome; 
import NavBar from '../components/NavBar.jsx'
import './Profile.css'

function Profile() {
  return (
    <div className="profile-page">
      <NavBar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large">👤</div>
          <div className="profile-info">
            <h1>Your Name</h1>
            <p className="profile-bio">Passionate goal achiever | Always learning and growing</p>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-value">0</span>
                <span className="stat-name">Goals</span>
              </div>
              <div className="profile-stat">
                <span className="stat-value">0</span>
                <span className="stat-name">Completed</span>
              </div>
              <div className="profile-stat">
                <span className="stat-value">0%</span>
                <span className="stat-name">Success Rate</span>
              </div>
            </div>
          </div>
          <button className="edit-profile-btn">✏️ Edit Profile</button>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>About Me</h2>
            <p className="about-text">
              Tell people about yourself, your interests, and what motivates you to achieve your goals.
            </p>
            <button className="edit-btn">Add Bio</button>
          </div>

          <div className="profile-section">
            <h2>My Goals</h2>
            <div className="goals-grid">
              <div className="goal-mini-card">
                <h3>Active Goals</h3>
                <div className="mini-stat">0</div>
              </div>
              <div className="goal-mini-card">
                <h3>In Progress</h3>
                <div className="mini-stat">0</div>
              </div>
              <div className="goal-mini-card">
                <h3>Completed</h3>
                <div className="mini-stat">0</div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">✅</div>
                <div className="activity-content">
                  <p><strong>Completed milestone</strong></p>
                  <p className="activity-time">2 hours ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">🎯</div>
                <div className="activity-content">
                  <p><strong>Created new goal</strong></p>
                  <p className="activity-time">1 day ago</p>
                </div>
              </div>
              <div className="activity-placeholder">
                <p>No recent activity to display</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Settings</h2>
            <div className="settings-list">
              <button className="settings-item">
                <span>🔔 Notifications</span>
                <span>→</span>
              </button>
              <button className="settings-item">
                <span>🔒 Privacy</span>
                <span>→</span>
              </button>
              <button className="settings-item">
                <span>🎨 Appearance</span>
                <span>→</span>
              </button>
              <button className="settings-item">
                <span>⚙️ Account Settings</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

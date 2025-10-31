import NavBar from '../components/NavBar.jsx'
import './Network.css'

function Network() {
  return (
    <div className="network-page">
      <NavBar />
      <div className="network-container">
        <div className="network-header">
          <h1>🌐 Network</h1>
          <p className="network-subtitle">Connect with others on their goal journey</p>
        </div>

        <div className="network-stats">
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Following</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Connections</div>
          </div>
        </div>

        <div className="network-tabs">
          <button className="tab-btn active">Discover</button>
          <button className="tab-btn">Following</button>
          <button className="tab-btn">Followers</button>
        </div>

        <div className="network-content">
          <div className="network-feed">
            <div className="feed-item">
              <div className="feed-header">
                <div className="feed-avatar">👤</div>
                <div className="feed-user-info">
                  <h3>User Name</h3>
                  <p>Shared a goal • 2 hours ago</p>
                </div>
              </div>
              <div className="feed-content">
                <h4>My New Goal: Learn Spanish</h4>
                <p>Starting my journey to become fluent in Spanish! 🇪🇸</p>
                <div className="feed-actions">
                  <button className="feed-action-btn">👍 Like</button>
                  <button className="feed-action-btn">💬 Comment</button>
                  <button className="feed-action-btn">🔗 Share</button>
                </div>
              </div>
            </div>

            <div className="feed-placeholder">
              <p>🔍 No connections yet</p>
              <p className="placeholder-text">Start following others to see their goal updates here!</p>
              <button className="discover-btn">Discover People</button>
            </div>
          </div>

          <div className="network-sidebar">
            <div className="sidebar-card">
              <h3>Suggested Connections</h3>
              <div className="suggested-user">
                <div className="suggested-avatar">👤</div>
                <div className="suggested-info">
                  <p className="suggested-name">John Doe</p>
                  <p className="suggested-bio">Fitness enthusiast</p>
                </div>
                <button className="follow-btn">Follow</button>
              </div>
              <div className="suggested-user">
                <div className="suggested-avatar">👤</div>
                <div className="suggested-info">
                  <p className="suggested-name">Jane Smith</p>
                  <p className="suggested-bio">Learning new skills</p>
                </div>
                <button className="follow-btn">Follow</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Network

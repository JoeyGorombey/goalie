import NavBar from '../components/NavBar.jsx'
import './Dashboard.css'

function Dashboard() {
  // Sample feed data - will come from following users later
  const feedPosts = [
    {
      id: 1,
      user: { name: 'Sarah Chen', avatar: '👩‍💻' },
      action: 'completed a milestone',
      goal: 'Learn Advanced React',
      milestone: 'Master Custom Hooks',
      timestamp: '2 hours ago',
      likes: 12,
      comments: 3
    },
    {
      id: 2,
      user: { name: 'Mike Johnson', avatar: '🏃' },
      action: 'created a new goal',
      goal: 'Run a Marathon',
      description: 'Training for my first marathon in 6 months! Starting with 5K runs.',
      timestamp: '5 hours ago',
      likes: 24,
      comments: 8
    },
    {
      id: 3,
      user: { name: 'Emily Rodriguez', avatar: '📚' },
      action: 'completed a goal',
      goal: 'Read 24 Books This Year',
      description: 'Just finished my 24th book! This year has been amazing for personal growth.',
      timestamp: '1 day ago',
      likes: 45,
      comments: 12
    }
  ]

  return (
    <div className="dashboard">
      <NavBar />
      
      <div className="feed-container">
        <div className="feed-header">
          <h1>🏠 Home Feed</h1>
          <p className="feed-subtitle">See what your connections are achieving</p>
        </div>

        {feedPosts.length === 0 ? (
          <div className="feed-empty">
            <div className="empty-icon">🔍</div>
            <h2>Your feed is empty</h2>
            <p>Start following people to see their goal updates here!</p>
            <button className="discover-btn">
              Discover People
            </button>
          </div>
        ) : (
          <div className="feed-posts">
            {feedPosts.map(post => (
              <FeedPost key={post.id} post={post} />
            ))}
          </div>
        )}

        <div className="feed-sidebar">
          <div className="sidebar-widget">
            <h3>Your Quick Stats</h3>
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="stat-icon">🎯</span>
                <div className="stat-info">
                  <p className="stat-label">Active Goals</p>
                  <p className="stat-value">0</p>
                </div>
              </div>
              <div className="quick-stat">
                <span className="stat-icon">✅</span>
                <div className="stat-info">
                  <p className="stat-label">Completed This Week</p>
                  <p className="stat-value">0</p>
                </div>
              </div>
              <div className="quick-stat">
                <span className="stat-icon">🔥</span>
                <div className="stat-info">
                  <p className="stat-label">Day Streak</p>
                  <p className="stat-value">0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-widget">
            <h3>Suggested Connections</h3>
            <div className="suggested-users">
              <div className="suggested-user-mini">
                <span className="mini-avatar">👤</span>
                <div className="mini-info">
                  <p className="mini-name">Alex Kim</p>
                  <p className="mini-bio">Fitness enthusiast</p>
                </div>
                <button className="mini-follow-btn">Follow</button>
              </div>
              <div className="suggested-user-mini">
                <span className="mini-avatar">👤</span>
                <div className="mini-info">
                  <p className="mini-name">Lisa Wang</p>
                  <p className="mini-bio">Learning Spanish</p>
                </div>
                <button className="mini-follow-btn">Follow</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeedPost({ post }) {
  return (
    <div className="feed-post">
      <div className="post-header">
        <div className="post-avatar">{post.user.avatar}</div>
        <div className="post-user-info">
          <p className="post-user-name">{post.user.name}</p>
          <p className="post-action">
            {post.action}
            {post.milestone && <span className="post-milestone"> "{post.milestone}"</span>}
          </p>
          <p className="post-timestamp">{post.timestamp}</p>
        </div>
      </div>

      <div className="post-content">
        <h3 className="post-goal-title">🎯 {post.goal}</h3>
        {post.description && (
          <p className="post-description">{post.description}</p>
        )}
      </div>

      <div className="post-stats">
        <span className="post-stat">👍 {post.likes}</span>
        <span className="post-stat">💬 {post.comments}</span>
      </div>

      <div className="post-actions">
        <button className="post-action-btn">👍 Like</button>
        <button className="post-action-btn">💬 Comment</button>
        <button className="post-action-btn">🔗 Share</button>
      </div>
    </div>
  )
}

export default Dashboard

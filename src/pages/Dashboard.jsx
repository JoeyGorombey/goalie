import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'
import { useStreak } from '../context/StreakContext.jsx'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const { hasExtendedStreakToday } = useStreak()
  const [stats, setStats] = useState({
    activeGoals: 0,
    completedThisWeek: 0,
    currentStreak: 0,
    longestStreak: 0,
    hasActivityToday: false
  })
  const [loading, setLoading] = useState(true)
  const [streakExtendedToday, setStreakExtendedToday] = useState(false)

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/stats/dashboard')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
          // Check if streak was extended today (from localStorage)
          setStreakExtendedToday(hasExtendedStreakToday())
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [hasExtendedStreakToday])

  // Listen for streak extension events
  useEffect(() => {
    const handleStreakExtended = () => {
      setStreakExtendedToday(true)
      // Refresh stats to get updated counts
      fetch('http://localhost:3001/api/stats/dashboard')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error('Error refreshing stats:', err))
    }

    window.addEventListener('streakExtended', handleStreakExtended)
    return () => window.removeEventListener('streakExtended', handleStreakExtended)
  }, [])

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

        {/* Banner and Stats Row */}
        <div className="banner-stats-row">
          {/* Streak Banners */}
          <div className="banner-section">
            {!loading && !streakExtendedToday && stats.currentStreak >= 0 && (
              <div className="streak-cta-banner">
                <div className="streak-cta-content">
                  <div className="streak-cta-icon">🔥</div>
                  <div className="streak-cta-text">
                    <h3>Keep Your Streak Alive!</h3>
                    <p>
                      {stats.currentStreak === 0 
                        ? "Start your streak today!" 
                        : `${stats.currentStreak} day streak! Don't break it!`}
                    </p>
                  </div>
                  <button 
                    className="streak-cta-button"
                    onClick={() => navigate('/my-goals')}
                  >
                    Extend 🚀
                  </button>
                </div>
              </div>
            )}

            {!loading && streakExtendedToday && (
              <div className="streak-congrats-banner">
                <div className="streak-congrats-content">
                  <div className="streak-congrats-icon">🎉</div>
                  <div className="streak-congrats-text">
                    <h3>Streak Extended! 🔥</h3>
                    <p>
                      <strong>{stats.currentStreak} days</strong>! 
                      {stats.currentStreak === stats.longestStreak && stats.currentStreak > 1 ? (
                        <span> Personal best! 🏆</span>
                      ) : stats.currentStreak < stats.longestStreak ? (
                        <span> {stats.longestStreak - stats.currentStreak} to beat your record!</span>
                      ) : null}
                    </p>
                  </div>
                  <div className="streak-congrats-flame">
                    🔥<span className="streak-number-compact">{stats.currentStreak}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="quick-stats-compact">
            <h3>Your Stats</h3>
            {loading ? (
              <div className="stats-loading">Loading...</div>
            ) : (
              <div className="stats-grid">
                <div className="stat-compact">
                  <span className="stat-icon-compact">🎯</span>
                  <div>
                    <p className="stat-value-compact">{stats.activeGoals}</p>
                    <p className="stat-label-compact">Active Goals</p>
                  </div>
                </div>
                <div className="stat-compact">
                  <span className="stat-icon-compact">✅</span>
                  <div>
                    <p className="stat-value-compact">{stats.completedThisWeek}</p>
                    <p className="stat-label-compact">This Week</p>
                  </div>
                </div>
                <div className="stat-compact streak-stat-compact">
                  <span className="stat-icon-compact">🔥</span>
                  <div>
                    <p className="stat-value-compact streak-value">{stats.currentStreak}</p>
                    <p className="stat-label-compact">Day Streak</p>
                    {stats.longestStreak > stats.currentStreak && (
                      <p className="stat-subtext-compact">Best: {stats.longestStreak}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
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
          <div className="feed-posts-full">
            {feedPosts.map(post => (
              <FeedPost key={post.id} post={post} />
            ))}
          </div>
        )}
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

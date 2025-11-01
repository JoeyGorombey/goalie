import './StreakModal.css'

function StreakModal({ streak, longestStreak, isNewRecord, onClose }) {
  const messages = [
    "You're on fire! 🔥",
    "Keep the momentum going! 🚀",
    "Consistency is key! 💪",
    "One day at a time! ⭐",
    "You're building greatness! 🏆",
    "Progress, not perfection! ✨",
    "Your dedication is inspiring! 🌟"
  ];
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="streak-modal-overlay" onClick={onClose}>
      <div className="streak-modal" onClick={(e) => e.stopPropagation()}>
        <div className="streak-flames">🔥 🔥 🔥</div>
        
        <h1 className="streak-title">
          {isNewRecord ? "🎉 New Record! 🎉" : "Streak Updated! 🔥"}
        </h1>
        
        <div className="streak-counter">
          <div className="streak-number">{streak}</div>
          <div className="streak-label">Day Streak</div>
        </div>
        
        <p className="streak-message">{randomMessage}</p>
        
        {isNewRecord && (
          <div className="streak-record">
            <span className="record-badge">🏆 Personal Best!</span>
          </div>
        )}
        
        {!isNewRecord && longestStreak > streak && (
          <div className="streak-stats">
            <p className="streak-stat">
              Best Streak: <strong>{longestStreak} days</strong>
            </p>
            <p className="streak-progress">
              Keep going! Just {longestStreak - streak} more {longestStreak - streak === 1 ? 'day' : 'days'} to beat your record!
            </p>
          </div>
        )}
        
        <button className="streak-close-btn" onClick={onClose}>
          Continue 🚀
        </button>
      </div>
    </div>
  )
}

export default StreakModal


import { useNavigate } from 'react-router-dom'
import { calculateProgress } from '../services/goalStorage.js'
import { formatDateForDisplay } from '../utils/dateUtils.js'
import { getGoalStatusDisplay } from '../utils/goalStatusUtils.js'
import './GoalCard.css'

function GoalCard({ goal }) {
  const navigate = useNavigate()

  // Calculate progress based on milestones
  const progress = calculateProgress(goal.milestones)
  const completedCount = goal.milestones?.filter(m => m.completed).length || 0
  const totalCount = goal.milestones?.length || 0

  // Get status info using utility
  const statusInfo = getGoalStatusDisplay(goal)

  const handleCardClick = () => {
    console.log('Opening goal details for:', goal.title)
    // Navigate to goal details page, passing the goal data
    navigate(`/goal/${goal.id}`, { state: { goal } })
  }

  const handleMenuClick = (e) => {
    e.stopPropagation() // Prevents card click when clicking menu
    console.log('Opening menu for:', goal.title)
    // Later: show edit menu
  }

  return (
    <div className="goal-card" onClick={handleCardClick}>
      <div className="goal-card-header">
        <h3>{goal.title}</h3>
        <button className="goal-menu-btn" onClick={handleMenuClick}>
          ⋮
        </button>
      </div>
      
      <span className={`goal-card-status ${statusInfo.class}`}>
        {statusInfo.emoji} {statusInfo.text}
      </span>
      
      <p className="goal-description">{goal.description}</p>
      
      <div className="goal-due-date">
        📅 Due: {formatDateForDisplay(goal.dueDate)}
      </div>
      
      <div className="goal-progress">
        <div className="progress-label">
          <span>Progress ({completedCount}/{totalCount} milestones)</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default GoalCard


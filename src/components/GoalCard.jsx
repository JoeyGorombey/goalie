import { useNavigate } from 'react-router-dom'
import { calculateProgress } from '../services/goalStorage.js'
import { formatDateForDisplay } from '../utils/dateUtils.js'
import './GoalCard.css'

function GoalCard({ goal }) {
  const navigate = useNavigate()

  // Calculate progress based on milestones
  const progress = calculateProgress(goal.milestones)
  const completedCount = goal.milestones?.filter(m => m.completed).length || 0
  const totalCount = goal.milestones?.length || 0

  // Helper function to check if milestone is overdue
  const isMilestoneOverdue = (milestone) => {
    if (!milestone.dueDate || milestone.completed) return false
    try {
      const dueDate = new Date(milestone.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return dueDate < today
    } catch (e) {
      return false
    }
  }

  // Determine goal display status
  const getGoalStatus = () => {
    if (goal.status === 'completed') {
      return { text: 'Completed', class: 'status-completed', emoji: '✅' }
    }
    
    // Check if any incomplete milestones are overdue (behind)
    const hasBehindMilestones = goal.milestones?.some(m => isMilestoneOverdue(m))
    
    // Check if goal itself is overdue (late)
    let isGoalOverdue = false
    if (goal.dueDate && goal.dueDate !== 'No due date') {
      try {
        const dueDate = new Date(goal.dueDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        isGoalOverdue = dueDate < today
      } catch (e) {
        console.error('Error parsing due date:', e)
      }
    }
    
    // Determine secondary status
    if (isGoalOverdue && hasBehindMilestones) {
      return { text: 'Late & Behind', class: 'status-late-behind', emoji: '🚨' }
    }
    
    if (isGoalOverdue) {
      return { text: 'Late', class: 'status-late', emoji: '⚠️' }
    }
    
    if (hasBehindMilestones) {
      return { text: 'Behind', class: 'status-behind', emoji: '⏰' }
    }
    
    return { text: 'On Track', class: 'status-active', emoji: '🎯' }
  }

  const statusInfo = getGoalStatus()

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


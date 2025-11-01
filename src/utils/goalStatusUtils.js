/**
 * Utility functions for determining goal status
 */

// Helper function to check if milestone is overdue
export const isMilestoneOverdue = (milestone) => {
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

// Determine goal status (returns status string for filtering)
export const getGoalStatusType = (goal) => {
  if (goal.status === 'completed') {
    return 'completed'
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
  
  // Return specific status type
  if (isGoalOverdue && hasBehindMilestones) {
    return 'late-behind'
  }
  
  if (isGoalOverdue) {
    return 'late'
  }
  
  if (hasBehindMilestones) {
    return 'behind'
  }
  
  return 'on-track'
}

// Get display info for a status
export const getGoalStatusDisplay = (goal) => {
  const statusType = getGoalStatusType(goal)
  
  switch (statusType) {
    case 'completed':
      return { text: 'Completed', class: 'status-completed', emoji: '✅', type: 'completed' }
    case 'late-behind':
      return { text: 'Late & Behind', class: 'status-late-behind', emoji: '🚨', type: 'late-behind' }
    case 'late':
      return { text: 'Late', class: 'status-late', emoji: '⚠️', type: 'late' }
    case 'behind':
      return { text: 'Behind', class: 'status-behind', emoji: '⏰', type: 'behind' }
    case 'on-track':
    default:
      return { text: 'On Track', class: 'status-active', emoji: '🎯', type: 'on-track' }
  }
}


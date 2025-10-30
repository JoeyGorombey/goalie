import './GoalCard.css'

function GoalCard({ goal }) {
  const handleCardClick = () => {
    console.log('Opening goal details for:', goal.title)
    // Later: navigate to detail page
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
      
      <p className="goal-description">{goal.description}</p>
      
      <div className="goal-due-date">
        📅 Due: {goal.dueDate}
      </div>
      
      <div className="goal-progress">
        <div className="progress-label">
          <span>Progress</span>
          <span>{goal.progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default GoalCard


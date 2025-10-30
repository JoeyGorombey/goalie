import { useParams, useLocation, useNavigate } from 'react-router-dom'
import './GoalDetails.css'

function GoalDetails() {
  const { goalId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get the goal data passed from the card click
  const goal = location.state?.goal

  // If no goal data, show error (shouldn't happen normally)
  if (!goal) {
    return (
      <div className="goal-details-error">
        <h2>Goal not found</h2>
        <button onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    )
  }

  return (
    <div className="goal-details">
      <div className="goal-details-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
        <button className="edit-button">
          ✏️ Edit Goal
        </button>
      </div>

      <div className="goal-details-content">
        <h1 className="goal-title">{goal.title}</h1>
        
        <div className="goal-info-section">
          <h3>Description</h3>
          <p className="goal-description-full">{goal.description}</p>
        </div>

        <div className="goal-info-section">
          <h3>Due Date</h3>
          <p className="goal-due-date-full">📅 {goal.dueDate}</p>
        </div>

        <div className="goal-info-section">
          <h3>Progress</h3>
          <div className="progress-display">
            <div className="progress-percentage">{goal.progress}%</div>
            <div className="progress-bar-large">
              <div 
                className="progress-fill-large" 
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="goal-info-section">
          <h3>Milestones</h3>
          <div className="milestones-placeholder">
            <p className="placeholder-text">Milestone tracking coming soon! 🎯</p>
            <p className="placeholder-subtext">You'll be able to add and track milestones here.</p>
          </div>
        </div>

        <div className="goal-info-section">
          <h3>Steps</h3>
          <div className="steps-placeholder">
            <p className="placeholder-text">Step management coming soon! ✅</p>
            <p className="placeholder-subtext">You'll be able to add, edit, and check off steps here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoalDetails


import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { getGoalById, updateGoal, deleteGoal } from './services/goalStorage.js'
import './GoalDetails.css'

function GoalDetails() {
  const { goalId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get the goal data (from state or storage)
  const [goal, setGoal] = useState(location.state?.goal)
  const [isEditing, setIsEditing] = useState(false)
  const [editedGoal, setEditedGoal] = useState(null)

  // Load from storage if not in state
  useEffect(() => {
    if (!goal) {
      const loadedGoal = getGoalById(goalId)
      if (loadedGoal) {
        setGoal(loadedGoal)
      }
    }
  }, [goalId, goal])

  // Initialize edit form
  useEffect(() => {
    if (goal && isEditing) {
      setEditedGoal({ ...goal })
    }
  }, [isEditing, goal])

  const handleSave = () => {
    const updated = updateGoal(goalId, editedGoal)
    if (updated) {
      setGoal(updated)
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${goal.title}"?`)) {
      const success = deleteGoal(goalId)
      if (success) {
        navigate('/')
      }
    }
  }

  const handleProgressChange = (newProgress) => {
    const updated = updateGoal(goalId, { progress: newProgress })
    if (updated) {
      setGoal(updated)
    }
  }

  // If no goal data, show error
  if (!goal) {
    return (
      <div className="goal-details-error">
        <h2>Goal not found</h2>
        <button onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    )
  }

  // Editing mode
  if (isEditing) {
    return (
      <div className="goal-details">
        <div className="goal-details-header">
          <button className="back-button" onClick={() => setIsEditing(false)}>
            ✕ Cancel
          </button>
          <button className="save-button" onClick={handleSave}>
            💾 Save Changes
          </button>
        </div>

        <div className="goal-details-content">
          <div className="form-group">
            <label>Goal Title</label>
            <input
              type="text"
              value={editedGoal?.title || ''}
              onChange={(e) => setEditedGoal({...editedGoal, title: e.target.value})}
              className="edit-input-title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={editedGoal?.description || ''}
              onChange={(e) => setEditedGoal({...editedGoal, description: e.target.value})}
              rows="4"
              className="edit-textarea"
            />
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="text"
              value={editedGoal?.dueDate || ''}
              onChange={(e) => setEditedGoal({...editedGoal, dueDate: e.target.value})}
              className="edit-input"
            />
          </div>

          <div className="form-group">
            <label>Progress ({editedGoal?.progress}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={editedGoal?.progress || 0}
              onChange={(e) => setEditedGoal({...editedGoal, progress: parseInt(e.target.value)})}
              className="progress-slider"
            />
          </div>
        </div>
      </div>
    )
  }

  // View mode
  return (
    <div className="goal-details">
      <div className="goal-details-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
        <div className="header-actions">
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            ✏️ Edit
          </button>
          <button className="delete-button" onClick={handleDelete}>
            🗑️ Delete
          </button>
        </div>
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
          <div className="progress-controls">
            <button 
              onClick={() => handleProgressChange(Math.max(0, goal.progress - 5))}
              className="progress-btn"
              disabled={goal.progress === 0}
            >
              -5%
            </button>
            <button 
              onClick={() => handleProgressChange(Math.max(0, goal.progress - 1))}
              className="progress-btn"
              disabled={goal.progress === 0}
            >
              -1%
            </button>
            <div className="progress-display">
              <div className="progress-percentage">{goal.progress}%</div>
              <div className="progress-bar-large">
                <div 
                  className="progress-fill-large" 
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
            <button 
              onClick={() => handleProgressChange(Math.min(100, goal.progress + 1))}
              className="progress-btn"
              disabled={goal.progress === 100}
            >
              +1%
            </button>
            <button 
              onClick={() => handleProgressChange(Math.min(100, goal.progress + 5))}
              className="progress-btn"
              disabled={goal.progress === 100}
            >
              +5%
            </button>
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


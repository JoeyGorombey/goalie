import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { 
  getGoalById, 
  updateGoal, 
  deleteGoal, 
  calculateProgress,
  toggleMilestone,
  addMilestone,
  deleteMilestone,
  updateMilestone
} from './services/goalStorage.js'
import './GoalDetails.css'

function GoalDetails() {
  const { goalId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get the goal data (from state or storage)
  const [goal, setGoal] = useState(location.state?.goal)
  const [isEditing, setIsEditing] = useState(false)
  const [editedGoal, setEditedGoal] = useState(null)
  const [newMilestoneText, setNewMilestoneText] = useState('')
  const [editingMilestoneId, setEditingMilestoneId] = useState(null)
  const [editingMilestoneText, setEditingMilestoneText] = useState('')

  // Load from API if not in state
  useEffect(() => {
    const loadGoal = async () => {
      if (!goal) {
        const loadedGoal = await getGoalById(goalId)
        if (loadedGoal) {
          setGoal(loadedGoal)
        }
      }
    }
    loadGoal()
  }, [goalId, goal])

  // Initialize edit form
  useEffect(() => {
    if (goal && isEditing) {
      setEditedGoal({ ...goal })
    }
  }, [isEditing, goal])

  const handleSave = async () => {
    const updated = await updateGoal(goalId, editedGoal)
    if (updated) {
      setGoal(updated)
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${goal.title}"?`)) {
      const success = await deleteGoal(goalId)
      if (success) {
        navigate('/')
      }
    }
  }

  const handleToggleMilestone = async (milestoneId) => {
    const updated = await toggleMilestone(goalId, milestoneId)
    if (updated) {
      setGoal(updated)
    }
  }

  const handleAddMilestone = async () => {
    if (!newMilestoneText.trim()) return
    
    const updated = await addMilestone(goalId, newMilestoneText)
    if (updated) {
      setGoal(updated)
      setNewMilestoneText('')
    }
  }

  const handleDeleteMilestone = async (milestoneId) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      const updated = await deleteMilestone(goalId, milestoneId)
      if (updated) {
        setGoal(updated)
      }
    }
  }

  const handleStartEditMilestone = (milestone) => {
    setEditingMilestoneId(milestone.id)
    setEditingMilestoneText(milestone.text)
  }

  const handleSaveMilestone = async (milestoneId) => {
    if (!editingMilestoneText.trim()) return
    
    const updated = await updateMilestone(goalId, milestoneId, editingMilestoneText)
    if (updated) {
      setGoal(updated)
      setEditingMilestoneId(null)
      setEditingMilestoneText('')
    }
  }

  const handleCancelEditMilestone = () => {
    setEditingMilestoneId(null)
    setEditingMilestoneText('')
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

  // Calculate progress
  const progress = calculateProgress(goal.milestones)
  const completedCount = goal.milestones?.filter(m => m.completed).length || 0
  const totalCount = goal.milestones?.length || 0

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
          <h3>Overall Progress</h3>
          <div className="progress-display-auto">
            <div className="progress-percentage-large">{progress}%</div>
            <div className="progress-details">
              <p className="progress-text">{completedCount} of {totalCount} milestones completed</p>
              <div className="progress-bar-large">
                <div 
                  className="progress-fill-large" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="goal-info-section">
          <h3>Milestones</h3>
          {goal.milestones && goal.milestones.length > 0 ? (
            <div className="milestones-list">
              {goal.milestones.map((milestone) => (
                <div key={milestone.id} className="milestone-item">
                  {editingMilestoneId === milestone.id ? (
                    <div className="milestone-edit-row">
                      <input
                        type="text"
                        value={editingMilestoneText}
                        onChange={(e) => setEditingMilestoneText(e.target.value)}
                        className="milestone-edit-input"
                        autoFocus
                      />
                      <button 
                        onClick={() => handleSaveMilestone(milestone.id)}
                        className="milestone-save-btn"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={handleCancelEditMilestone}
                        className="milestone-cancel-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="checkbox"
                        checked={milestone.completed}
                        onChange={() => handleToggleMilestone(milestone.id)}
                        className="milestone-checkbox"
                      />
                      <span className={milestone.completed ? 'milestone-text completed' : 'milestone-text'}>
                        {milestone.text}
                      </span>
                      <div className="milestone-actions">
                        <button
                          onClick={() => handleStartEditMilestone(milestone)}
                          className="milestone-edit-btn"
                          title="Edit milestone"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteMilestone(milestone.id)}
                          className="milestone-delete-btn"
                          title="Delete milestone"
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-milestones">No milestones yet. Add some below!</p>
          )}

          <div className="add-milestone-section">
            <input
              type="text"
              value={newMilestoneText}
              onChange={(e) => setNewMilestoneText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddMilestone()}
              placeholder="Add a new milestone..."
              className="new-milestone-input"
            />
            <button
              onClick={handleAddMilestone}
              className="add-milestone-btn"
            >
              + Add Milestone
            </button>
          </div>
        </div>

        <div className="goal-info-section">
          <h3>Steps</h3>
          <div className="steps-placeholder">
            <p className="placeholder-text">Step management coming soon! ✅</p>
            <p className="placeholder-subtext">Future feature: Break down milestones into smaller, actionable steps.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoalDetails

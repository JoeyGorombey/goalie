import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  getGoalById, 
  updateGoal, 
  deleteGoal, 
  calculateProgress,
  toggleMilestone,
  addMilestone,
  deleteMilestone,
  updateMilestone,
  reorderMilestones
} from '../services/goalStorage.js'
import { useError } from '../context/ErrorContext.jsx'
import { formatDateForInput, parseDateFromInput, formatDateForDisplay } from '../utils/dateUtils.js'
import './GoalDetails.css'

function GoalDetails() {
  const { goalId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { showError } = useError()
  
  // Get the goal data (from state or storage)
  const [goal, setGoal] = useState(location.state?.goal)
  const [isEditing, setIsEditing] = useState(false)
  const [editedGoal, setEditedGoal] = useState(null)
  const [newMilestoneText, setNewMilestoneText] = useState('')
  const [editingMilestoneId, setEditingMilestoneId] = useState(null)
  const [editingMilestoneText, setEditingMilestoneText] = useState('')
  const [editingMilestoneDateId, setEditingMilestoneDateId] = useState(null)
  const [editingMilestoneDate, setEditingMilestoneDate] = useState('')

  // Drag and drop sensors - add delay to prevent accidental drags when clicking buttons
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle milestone drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    if (!goal || !goal.milestones) {
      return
    }

    const oldIndex = goal.milestones.findIndex(m => m.id === active.id)
    const newIndex = goal.milestones.findIndex(m => m.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    // Save original state for error recovery
    const originalGoal = { ...goal }
    const originalMilestones = [...goal.milestones]

    // Reorder milestones locally for immediate feedback
    const newMilestones = arrayMove(goal.milestones, oldIndex, newIndex)
    setGoal({ ...goal, milestones: newMilestones })

    // Save to backend
    try {
      const updated = await reorderMilestones(goalId, newMilestones)
      setGoal(updated)
    } catch (error) {
      // Revert on error
      setGoal({ ...originalGoal, milestones: originalMilestones })
      console.error('Failed to reorder milestones:', error)
      showError(error.message || 'Failed to reorder milestones. The page will reload to fix data issues.')
      
      // If the data is corrupted, reload from server
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }

  // Load from API if not in state
  useEffect(() => {
    const loadGoal = async () => {
      if (!goal) {
        try {
          const loadedGoal = await getGoalById(goalId)
          if (loadedGoal) {
            // Validate milestone data
            if (loadedGoal.milestones) {
              const corruptedMilestones = loadedGoal.milestones.filter(m => !m.text || m.text.trim() === '')
              if (corruptedMilestones.length > 0) {
                console.error('⚠️ Detected corrupted milestones:', corruptedMilestones)
                showError(`Warning: ${corruptedMilestones.length} milestone(s) are missing text. Please edit them to add descriptions.`)
              }
            }
            setGoal(loadedGoal)
          }
        } catch (error) {
          showError(error.message || 'Failed to load goal. Please check your connection.')
        }
      }
    }
    loadGoal()
  }, [goalId, goal, showError])

  // Initialize edit form
  useEffect(() => {
    if (goal && isEditing) {
      // Convert date string to YYYY-MM-DD format for date input
      const goalForEdit = {
        ...goal,
        dueDateInput: formatDateForInput(goal.dueDate) // Store in separate field for input
      }
      setEditedGoal(goalForEdit)
    }
  }, [isEditing, goal])

  const handleSave = async () => {
    try {
      // Convert date input (YYYY-MM-DD) back to formatted date string
      const goalToSave = {
        ...editedGoal,
        dueDate: parseDateFromInput(editedGoal.dueDateInput || editedGoal.dueDate),
        dueDateInput: undefined // Remove temporary field
      }
      const updated = await updateGoal(goalId, goalToSave)
      setGoal(updated)
      setIsEditing(false)
    } catch (error) {
      showError(error.message || 'Failed to update goal. Please try again.')
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${goal.title}"?`)) {
      try {
        await deleteGoal(goalId)
        navigate('/')
      } catch (error) {
        showError(error.message || 'Failed to delete goal. Please try again.')
      }
    }
  }

  const handleToggleMilestone = async (milestoneId) => {
    try {
      const updated = await toggleMilestone(goalId, milestoneId)
      setGoal(updated)
    } catch (error) {
      showError(error.message || 'Failed to toggle milestone. Please try again.')
    }
  }

  const handleAddMilestone = async () => {
    if (!newMilestoneText.trim()) return
    
    try {
      const updated = await addMilestone(goalId, newMilestoneText)
      setGoal(updated)
      setNewMilestoneText('')
    } catch (error) {
      showError(error.message || 'Failed to add milestone. Please try again.')
    }
  }

  const handleDeleteMilestone = async (milestoneId) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      try {
        const updated = await deleteMilestone(goalId, milestoneId)
        setGoal(updated)
      } catch (error) {
        showError(error.message || 'Failed to delete milestone. Please try again.')
      }
    }
  }

  const handleStartEditMilestone = (milestone) => {
    setEditingMilestoneId(milestone.id)
    setEditingMilestoneText(milestone.text)
  }

  const handleSaveMilestone = async (milestoneId) => {
    if (!editingMilestoneText.trim()) return
    
    try {
      const updated = await updateMilestone(goalId, milestoneId, editingMilestoneText)
      setGoal(updated)
      setEditingMilestoneId(null)
      setEditingMilestoneText('')
    } catch (error) {
      showError(error.message || 'Failed to update milestone. Please try again.')
    }
  }

  const handleCancelEditMilestone = () => {
    setEditingMilestoneId(null)
    setEditingMilestoneText('')
  }

  const handleStartEditMilestoneDate = (milestone) => {
    setEditingMilestoneDateId(milestone.id)
    setEditingMilestoneDate(milestone.dueDate || '')
  }

  const handleSaveMilestoneDate = async (milestoneId) => {
    try {
      const updatedGoal = await updateMilestone(goalId, milestoneId, null, editingMilestoneDate || null)
      setGoal(updatedGoal)
      setEditingMilestoneDateId(null)
      setEditingMilestoneDate('')
    } catch (error) {
      showError(error.message || 'Failed to update milestone date. Please try again.')
    }
  }

  const handleCancelEditMilestoneDate = () => {
    setEditingMilestoneDateId(null)
    setEditingMilestoneDate('')
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
            <div className="date-input-wrapper">
              <input
                type="date"
                value={editedGoal?.dueDateInput || formatDateForInput(editedGoal?.dueDate) || ''}
                onChange={(e) => setEditedGoal({...editedGoal, dueDateInput: e.target.value})}
                className="edit-input date-input"
              />
              {(editedGoal?.dueDateInput || editedGoal?.dueDate) && (
                <button
                  type="button"
                  onClick={() => setEditedGoal({...editedGoal, dueDateInput: ''})}
                  className="clear-date-btn"
                  title="Clear due date"
                >
                  ✕ Clear
                </button>
              )}
            </div>
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
          <p className="goal-due-date-full">📅 {formatDateForDisplay(goal.dueDate)}</p>
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={goal.milestones.map(m => m.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="milestones-list">
                  {goal.milestones.map((milestone) => (
                    <SortableMilestone
                      key={milestone.id}
                      milestone={milestone}
                      editingMilestoneId={editingMilestoneId}
                      editingMilestoneText={editingMilestoneText}
                      editingMilestoneDateId={editingMilestoneDateId}
                      editingMilestoneDate={editingMilestoneDate}
                      onToggle={handleToggleMilestone}
                      onStartEdit={handleStartEditMilestone}
                      onSaveEdit={handleSaveMilestone}
                      onCancelEdit={handleCancelEditMilestone}
                      onStartEditDate={handleStartEditMilestoneDate}
                      onSaveDateEdit={handleSaveMilestoneDate}
                      onCancelDateEdit={handleCancelEditMilestoneDate}
                      onDelete={handleDeleteMilestone}
                      onTextChange={setEditingMilestoneText}
                      onDateChange={setEditingMilestoneDate}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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

// Sortable Milestone Component
function SortableMilestone({
  milestone,
  editingMilestoneId,
  editingMilestoneText,
  editingMilestoneDateId,
  editingMilestoneDate,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onStartEditDate,
  onSaveDateEdit,
  onCancelDateEdit,
  onDelete,
  onTextChange,
  onDateChange,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: milestone.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  if (editingMilestoneId === milestone.id) {
    return (
      <div className="milestone-item">
        <div className="milestone-edit-row">
          <input
            type="text"
            value={editingMilestoneText}
            onChange={(e) => onTextChange(e.target.value)}
            className="milestone-edit-input"
            autoFocus
          />
          <button 
            onClick={() => onSaveEdit(milestone.id)}
            className="milestone-save-btn"
          >
            ✓
          </button>
          <button 
            onClick={onCancelEdit}
            className="milestone-cancel-btn"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  if (editingMilestoneDateId === milestone.id) {
    return (
      <div className="milestone-item">
        <div className="milestone-edit-row">
          <span className="milestone-date-label">📅 Set due date:</span>
          <input
            type="date"
            value={editingMilestoneDate || ''}
            onChange={(e) => onDateChange(e.target.value)}
            className="milestone-date-input"
            autoFocus
          />
          <button 
            onClick={() => onSaveDateEdit(milestone.id)}
            className="milestone-save-btn"
            title="Save date"
          >
            ✓
          </button>
          <button 
            onClick={onCancelDateEdit}
            className="milestone-cancel-btn"
            title="Cancel"
          >
            ✕
          </button>
          {milestone.dueDate && (
            <button 
              onClick={() => {
                onDateChange('')
                onSaveDateEdit(milestone.id)
              }}
              className="milestone-clear-date-btn"
              title="Clear date"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`milestone-item ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="milestone-drag-handle">
        ⋮⋮
      </div>
      <input
        type="checkbox"
        checked={milestone.completed}
        onChange={(e) => {
          e.stopPropagation() // Prevent drag when clicking checkbox
          onToggle(milestone.id)
        }}
        className="milestone-checkbox"
        onClick={(e) => e.stopPropagation()} // Prevent drag on click
      />
      <div className="milestone-content">
        <span className={milestone.completed ? 'milestone-text completed' : 'milestone-text'}>
          {milestone.text || 'Untitled milestone'}
        </span>
        {milestone.dueDate && milestone.dueDate !== 'No due date' && (
          <span className="milestone-due-date">
            Due by {formatDateForDisplay(milestone.dueDate)}
          </span>
        )}
      </div>
      <div className="milestone-actions" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onStartEdit(milestone)
          }}
          className="milestone-edit-btn"
          title="Edit milestone"
        >
          ✏️
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onStartEditDate(milestone)
          }}
          className="milestone-calendar-btn"
          title="Set due date"
        >
          📅
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(milestone.id)
          }}
          className="milestone-delete-btn"
          title="Delete milestone"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default GoalDetails

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
  reorderMilestones,
  completeGoal
} from '../services/goalStorage.js'
import { useError } from '../context/ErrorContext.jsx'
import { useStreak } from '../context/StreakContext.jsx'
import { formatDateForInput, parseDateFromInput, formatDateForDisplay } from '../utils/dateUtils.js'
import './GoalDetails.css'

function GoalDetails() {
  const { goalId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { showError } = useError()
  const { checkAndShowStreak } = useStreak()
  
  // Get the goal data (from state or storage)
  const [goal, setGoal] = useState(location.state?.goal)
  const [isEditing, setIsEditing] = useState(false)
  const [editedGoal, setEditedGoal] = useState(null)
  const [newMilestoneText, setNewMilestoneText] = useState('')
  const [editingMilestoneId, setEditingMilestoneId] = useState(null)
  const [editingMilestoneText, setEditingMilestoneText] = useState('')
  const [editingMilestoneDateId, setEditingMilestoneDateId] = useState(null)
  const [editingMilestoneDate, setEditingMilestoneDate] = useState('')
  const [editingGoalDate, setEditingGoalDate] = useState(false)
  const [editingGoalDateValue, setEditingGoalDateValue] = useState('')
  const [showCongrats, setShowCongrats] = useState(false)
  const [hasShownCongrats, setHasShownCongrats] = useState(false)

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

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

  // Detect 100% completion and show congratulations
  useEffect(() => {
    const handleGoalCompletion = async () => {
      if (goal && goal.milestones && goal.milestones.length > 0) {
        const progress = calculateProgress(goal.milestones)
        // Check if goal reached 100% and isn't already marked as completed
        if (progress === 100 && goal.status !== 'completed' && !hasShownCongrats) {
          try {
            // Mark goal as completed in database first
            const updatedGoal = await completeGoal(goalId)
            setGoal(updatedGoal)
            // Then show celebration
            setShowCongrats(true)
            setHasShownCongrats(true)
          } catch (error) {
            console.error('Error completing goal:', error)
            showError('Failed to mark goal as completed')
          }
        }
      }
    }
    
    handleGoalCompletion()
  }, [goal, hasShownCongrats, goalId, showError])

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
      
      // Check if streak was updated
      checkAndShowStreak(updated)
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
      
      // Check if streak was updated
      checkAndShowStreak(updated)
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
      
      // Check if streak was updated
      checkAndShowStreak(updated)
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
      
      // Check if streak was updated
      checkAndShowStreak(updated)
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
      
      // Check if streak was updated
      checkAndShowStreak(updatedGoal)
    } catch (error) {
      showError(error.message || 'Failed to update milestone date. Please try again.')
    }
  }

  const handleCancelEditMilestoneDate = () => {
    setEditingMilestoneDateId(null)
    setEditingMilestoneDate('')
  }

  const handleStartEditGoalDate = () => {
    setEditingGoalDate(true)
    setEditingGoalDateValue(formatDateForInput(goal.dueDate) || '')
  }

  const handleSaveGoalDate = async () => {
    try {
      const formattedDate = parseDateFromInput(editingGoalDateValue)
      const updated = await updateGoal(goalId, { ...goal, dueDate: formattedDate })
      setGoal(updated)
      setEditingGoalDate(false)
      setEditingGoalDateValue('')
      
      // Check if streak was updated
      checkAndShowStreak(updated)
    } catch (error) {
      showError(error.message || 'Failed to update goal due date. Please try again.')
    }
  }

  const handleCancelEditGoalDate = () => {
    setEditingGoalDate(false)
    setEditingGoalDateValue('')
  }

  const handleCloseCongrats = () => {
    setShowCongrats(false)
  }

  const handleShare = () => {
    const completedMilestones = goal.milestones?.filter(m => m.completed).length || 0
    const shareText = `🎉 I just completed my goal: "${goal.title}"! ${completedMilestones} milestones achieved! #GoalieApp #GoalCompleted`
    
    // Try native share API first (mobile/modern browsers)
    if (navigator.share) {
      navigator.share({
        title: `Goal Completed: ${goal.title}`,
        text: shareText,
        url: window.location.href,
      }).catch((err) => console.log('Share cancelled', err))
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText + '\n\n' + window.location.href)
        .then(() => {
          alert('✅ Achievement copied to clipboard! Share it with your friends!')
        })
        .catch(() => {
          // Ultimate fallback: Show text to copy
          prompt('Copy this achievement text:', shareText + '\n\n' + window.location.href)
        })
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

  // Calculate progress
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

  // Sort milestones by date (date first, then by position)
  const getSortedMilestones = () => {
    if (!goal.milestones) return []
    
    const milestonesWithDates = goal.milestones.filter(m => m.dueDate)
    const milestonesWithoutDates = goal.milestones.filter(m => !m.dueDate)
    
    // Sort milestones with dates by date
    milestonesWithDates.sort((a, b) => {
      try {
        const dateA = new Date(a.dueDate)
        const dateB = new Date(b.dueDate)
        return dateA - dateB
      } catch (e) {
        return 0
      }
    })
    
    // Return dated milestones first, then undated ones
    return [...milestonesWithDates, ...milestonesWithoutDates]
  }

  const sortedMilestones = getSortedMilestones()

  // Determine goal display status
  const getGoalStatus = () => {
    if (goal.status === 'completed') {
      return { 
        primary: 'Completed', 
        secondary: null,
        class: 'status-completed', 
        emoji: '✅' 
      }
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
      return { 
        primary: 'Active', 
        secondary: 'Late & Behind',
        class: 'status-late-behind', 
        emoji: '🚨' 
      }
    }
    
    if (isGoalOverdue) {
      return { 
        primary: 'Active', 
        secondary: 'Late',
        class: 'status-late', 
        emoji: '⚠️' 
      }
    }
    
    if (hasBehindMilestones) {
      return { 
        primary: 'Active', 
        secondary: 'Behind Schedule',
        class: 'status-behind', 
        emoji: '⏰' 
      }
    }
    
    return { 
      primary: 'Active', 
      secondary: 'On Track',
      class: 'status-active', 
      emoji: '🎯' 
    }
  }

  const statusInfo = getGoalStatus()

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
                min={getTodayDate()}
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
        <div className="goal-header-with-status">
          <h1 className="goal-title">{goal.title}</h1>
          <div className="goal-status-badges">
            <span className={`goal-status-badge ${statusInfo.class}`}>
              {statusInfo.emoji} {statusInfo.secondary || statusInfo.primary}
            </span>
          </div>
        </div>
        
        <div className="goal-info-section">
          <h3>Description</h3>
          <p className="goal-description-full">{goal.description}</p>
        </div>

        <div className="goal-info-section">
          <h3>Due Date</h3>
          {editingGoalDate ? (
            <div className="goal-date-edit-row">
              <span className="goal-date-label">📅 Set due date:</span>
              <input
                type="date"
                value={editingGoalDateValue || ''}
                min={getTodayDate()}
                onChange={(e) => setEditingGoalDateValue(e.target.value)}
                className="goal-date-input"
                autoFocus
              />
              <button 
                onClick={handleSaveGoalDate}
                className="goal-date-save-btn"
                title="Save date"
              >
                ✓
              </button>
              <button 
                onClick={handleCancelEditGoalDate}
                className="goal-date-cancel-btn"
                title="Cancel"
              >
                ✕
              </button>
              {goal.dueDate && goal.dueDate !== 'No due date' && (
                <button 
                  onClick={() => {
                    setEditingGoalDateValue('')
                    handleSaveGoalDate()
                  }}
                  className="goal-date-clear-btn"
                  title="Clear date"
                >
                  🗑️ Clear
                </button>
              )}
            </div>
          ) : (
            <div className="goal-due-date-display">
              <p className="goal-due-date-full">📅 {formatDateForDisplay(goal.dueDate)}</p>
              <button
                onClick={handleStartEditGoalDate}
                className="goal-date-edit-btn"
                title="Edit due date"
              >
                ✏️ Edit Date
              </button>
            </div>
          )}
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
          <h3>Milestones {sortedMilestones.length > 0 && <span className="milestone-sort-note">(sorted by due date)</span>}</h3>
          {sortedMilestones && sortedMilestones.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedMilestones.map(m => m.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="milestones-list">
                  {sortedMilestones.map((milestone) => (
                    <SortableMilestone
                      key={milestone.id}
                      milestone={milestone}
                      isOverdue={isMilestoneOverdue(milestone)}
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

      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="congrats-overlay" onClick={handleCloseCongrats}>
          <div className="congrats-modal" onClick={(e) => e.stopPropagation()}>
            <div className="congrats-confetti">🎉 🎊 ✨ 🏆 🎯 ⭐</div>
            <h1 className="congrats-title">Congratulations! 🎉</h1>
            <p className="congrats-message">
              You've completed all milestones for<br />
              <strong>"{goal.title}"</strong>!
            </p>
            <div className="congrats-stats">
              <div className="congrats-stat-item">
                <div className="congrats-stat-value">{completedCount}</div>
                <div className="congrats-stat-label">Milestones</div>
              </div>
              <div className="congrats-stat-item">
                <div className="congrats-stat-value">100%</div>
                <div className="congrats-stat-label">Complete</div>
              </div>
            </div>
            <p className="congrats-subtext">
              Amazing work! Share your achievement with others! 🚀
            </p>
            <div className="congrats-actions">
              <button className="congrats-btn congrats-btn-share" onClick={handleShare}>
                📢 Share Achievement
              </button>
              <button className="congrats-btn congrats-btn-continue" onClick={handleCloseCongrats}>
                ✨ Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Sortable Milestone Component
function SortableMilestone({
  milestone,
  isOverdue,
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
    // Get today's date for min attribute
    const today = new Date().toISOString().split('T')[0]
    
    return (
      <div className="milestone-item">
        <div className="milestone-edit-row">
          <span className="milestone-date-label">📅 Set due date:</span>
          <input
            type="date"
            value={editingMilestoneDate || ''}
            min={today}
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
      className={`milestone-item ${isDragging ? 'dragging' : ''} ${isOverdue ? 'milestone-overdue' : ''}`}
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
          {isOverdue && <span className="overdue-flag">⚠️ </span>}
          {milestone.text || 'Untitled milestone'}
        </span>
        {milestone.dueDate && milestone.dueDate !== 'No due date' && (
          <span className={`milestone-due-date ${isOverdue ? 'overdue' : ''}`}>
            {isOverdue ? 'Overdue: ' : 'Due by '}{formatDateForDisplay(milestone.dueDate)}
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

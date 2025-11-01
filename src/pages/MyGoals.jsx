import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar.jsx'
import Greeting from '../components/Greeting.jsx'
import GoalList from '../components/GoalList.jsx'
import { getAllGoals, addGoal } from '../services/goalStorage.js'
import { useError } from '../context/ErrorContext.jsx'
import { useStreak } from '../context/StreakContext.jsx'
import { parseDateFromInput } from '../utils/dateUtils.js'
import { getGoalStatusType } from '../utils/goalStatusUtils.js'
import './MyGoals.css'

function MyGoals() {
  const [goals, setGoals] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    'on-track': true,
    'behind': true,
    'late': true,
    'late-behind': true,
    'completed': true
  })
  const { showError } = useError()
  const { checkAndShowStreak } = useStreak()

  // Load goals from API when component mounts
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const loadedGoals = await getAllGoals()
        setGoals(loadedGoals)
      } catch (error) {
        showError(error.message || 'Failed to load goals. Please check your connection.')
        setGoals([]) // Set empty array on error
      }
    }
    loadGoals()
  }, [showError])

  const handleAddGoal = async (goalData) => {
    try {
      const newGoal = await addGoal(goalData)
      setGoals([...goals, newGoal])
      setShowAddForm(false)
      
      // Check if streak was updated and show modal
      checkAndShowStreak(newGoal)
    } catch (error) {
      showError(error.message || 'Failed to create goal. Please try again.')
    }
  }

  // Toggle filter
  const toggleFilter = (filterKey) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }))
  }

  // Select/Deselect all filters
  const selectAllFilters = () => {
    setActiveFilters({
      'on-track': true,
      'behind': true,
      'late': true,
      'late-behind': true,
      'completed': true
    })
  }

  const deselectAllFilters = () => {
    setActiveFilters({
      'on-track': false,
      'behind': false,
      'late': false,
      'late-behind': false,
      'completed': false
    })
  }

  // Filter goals based on active filters
  const filteredGoals = goals.filter(goal => {
    const statusType = getGoalStatusType(goal)
    return activeFilters[statusType]
  })

  // Count goals by status
  const statusCounts = goals.reduce((acc, goal) => {
    const statusType = getGoalStatusType(goal)
    acc[statusType] = (acc[statusType] || 0) + 1
    return acc
  }, {})

  return (
    <div className="my-goals-page">
      <NavBar />
      <Greeting name="Joey" />
      
      <div className="my-goals-controls">
        <div className="my-goals-actions">
          <button 
            className="add-goal-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '✕ Cancel' : '+ Add New Goal'}
          </button>
        </div>

        <div className="my-goals-filters">
          <div className="filter-header">
            <h3>Filter by Status</h3>
            <div className="filter-quick-actions">
              <button onClick={selectAllFilters} className="filter-quick-btn">All</button>
              <button onClick={deselectAllFilters} className="filter-quick-btn">None</button>
            </div>
          </div>
          
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={activeFilters['on-track']}
                onChange={() => toggleFilter('on-track')}
              />
              <span className="filter-label">
                🎯 On Track
                {statusCounts['on-track'] > 0 && (
                  <span className="filter-count">({statusCounts['on-track']})</span>
                )}
              </span>
            </label>

            <label className="filter-option">
              <input
                type="checkbox"
                checked={activeFilters['behind']}
                onChange={() => toggleFilter('behind')}
              />
              <span className="filter-label">
                ⏰ Behind
                {statusCounts['behind'] > 0 && (
                  <span className="filter-count">({statusCounts['behind']})</span>
                )}
              </span>
            </label>

            <label className="filter-option">
              <input
                type="checkbox"
                checked={activeFilters['late']}
                onChange={() => toggleFilter('late')}
              />
              <span className="filter-label">
                ⚠️ Late
                {statusCounts['late'] > 0 && (
                  <span className="filter-count">({statusCounts['late']})</span>
                )}
              </span>
            </label>

            <label className="filter-option">
              <input
                type="checkbox"
                checked={activeFilters['late-behind']}
                onChange={() => toggleFilter('late-behind')}
              />
              <span className="filter-label">
                🚨 Late & Behind
                {statusCounts['late-behind'] > 0 && (
                  <span className="filter-count">({statusCounts['late-behind']})</span>
                )}
              </span>
            </label>

            <label className="filter-option">
              <input
                type="checkbox"
                checked={activeFilters['completed']}
                onChange={() => toggleFilter('completed')}
              />
              <span className="filter-label">
                ✅ Completed
                {statusCounts['completed'] > 0 && (
                  <span className="filter-count">({statusCounts['completed']})</span>
                )}
              </span>
            </label>
          </div>

          <div className="filter-summary">
            Showing {filteredGoals.length} of {goals.length} goals
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddGoalForm 
          onSubmit={handleAddGoal} 
          onCancel={() => setShowAddForm(false)} 
        />
      )}

      <GoalList goals={filteredGoals} />
    </div>
  )
}

// Simple form component for adding goals
function AddGoalForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [steps, setSteps] = useState([''])

  const handleAddStep = () => {
    setSteps([...steps, ''])
  }

  const handleStepChange = (index, value) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }

  const handleRemoveStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index)
    setSteps(newSteps.length > 0 ? newSteps : [''])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please enter a goal title')
      return
    }
    
    // Filter out empty steps
    const validSteps = steps.filter(step => step.trim() !== '')
    
    // Convert date input (YYYY-MM-DD) to formatted date string for storage
    const formattedDueDate = parseDateFromInput(dueDate)
    
    onSubmit({
      title,
      description,
      dueDate: formattedDueDate,
      steps: validSteps
    })
    
    // Reset form
    setTitle('')
    setDescription('')
    setDueDate('')
    setSteps([''])
  }

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div className="add-goal-form">
      <h2>Create New Goal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Goal Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Learn Spanish"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What do you want to achieve?"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <div className="date-input-wrapper">
            <input
              type="date"
              value={dueDate}
              min={getTodayDate()}
              onChange={(e) => setDueDate(e.target.value)}
              className="date-input"
            />
            {dueDate && (
              <button
                type="button"
                onClick={() => setDueDate('')}
                className="clear-date-btn"
                title="Clear due date"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Steps / Milestones</label>
          <p className="form-help-text">Add the steps needed to complete this goal. Progress will be calculated automatically!</p>
          {steps.map((step, index) => (
            <div key={index} className="step-input-row">
              <input
                type="text"
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="step-input"
              />
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveStep(index)}
                  className="remove-step-btn"
                  title="Remove step"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddStep}
            className="add-step-btn"
          >
            + Add Another Step
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Create Goal
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default MyGoals


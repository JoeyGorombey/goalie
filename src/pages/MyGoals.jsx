import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar.jsx'
import Greeting from '../components/Greeting.jsx'
import GoalList from '../components/GoalList.jsx'
import { getAllGoals, addGoal } from '../services/goalStorage.js'
import { useError } from '../context/ErrorContext.jsx'
import './MyGoals.css'

function MyGoals() {
  const [goals, setGoals] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const { showError } = useError()

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
    } catch (error) {
      showError(error.message || 'Failed to create goal. Please try again.')
    }
  }

  return (
    <div className="my-goals-page">
      <NavBar />
      <Greeting name="Joey" />
      
      <div className="my-goals-actions">
        <button 
          className="add-goal-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ Cancel' : '+ Add New Goal'}
        </button>
      </div>

      {showAddForm && (
        <AddGoalForm 
          onSubmit={handleAddGoal} 
          onCancel={() => setShowAddForm(false)} 
        />
      )}

      <GoalList goals={goals} />
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
    
    onSubmit({
      title,
      description,
      dueDate: dueDate || 'No due date',
      steps: validSteps
    })
    
    // Reset form
    setTitle('')
    setDescription('')
    setDueDate('')
    setSteps([''])
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
          <input
            type="text"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="e.g., Dec 31, 2025 or Ongoing"
          />
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


import { useState, useEffect } from 'react'
import NavBar from './NavBar.jsx'
import Greeting from './Greeting.jsx'
import GoalList from './GoalList.jsx'
import { getAllGoals, addGoal } from './services/goalStorage.js'
import './Dashboard.css'

function Dashboard() {
  const [goals, setGoals] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)

  // Load goals from storage when component mounts
  useEffect(() => {
    const loadedGoals = getAllGoals()
    setGoals(loadedGoals)
  }, [])

  const handleAddGoal = (goalData) => {
    const newGoal = addGoal(goalData)
    setGoals([...goals, newGoal])
    setShowAddForm(false)
  }

  return (
    <div className="dashboard">
      <NavBar />
      <Greeting name="Joey" />
      
      <div className="dashboard-actions">
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please enter a goal title')
      return
    }
    
    onSubmit({
      title,
      description,
      dueDate: dueDate || 'No due date',
      progress: 0
    })
    
    // Reset form
    setTitle('')
    setDescription('')
    setDueDate('')
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

export default Dashboard


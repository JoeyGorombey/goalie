// Local storage key
const STORAGE_KEY = 'goalie_goals'

// Get all goals from localStorage
export const getAllGoals = () => {
  try {
    const goalsJSON = localStorage.getItem(STORAGE_KEY)
    if (!goalsJSON) {
      // If no goals exist, initialize with sample data
      const sampleGoals = [
        {
          id: 1,
          title: "Learn React Fundamentals",
          description: "Master components, props, state, and hooks to build modern web applications.",
          dueDate: "Nov 15, 2025",
          progress: 65
        },
        {
          id: 2,
          title: "Build Goalie App",
          description: "Create a full-stack goal tracking application with React and a database.",
          dueDate: "Dec 31, 2025",
          progress: 30
        },
        {
          id: 3,
          title: "Exercise 3x per week",
          description: "Maintain a consistent workout routine for better health and energy.",
          dueDate: "Ongoing",
          progress: 80
        },
        {
          id: 4,
          title: "Read 12 books this year",
          description: "Expand knowledge and improve focus by reading one book per month.",
          dueDate: "Dec 31, 2025",
          progress: 45
        }
      ]
      saveAllGoals(sampleGoals)
      return sampleGoals
    }
    return JSON.parse(goalsJSON)
  } catch (error) {
    console.error('Error loading goals:', error)
    return []
  }
}

// Save all goals to localStorage
export const saveAllGoals = (goals) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
    return true
  } catch (error) {
    console.error('Error saving goals:', error)
    return false
  }
}

// Get a single goal by ID
export const getGoalById = (id) => {
  const goals = getAllGoals()
  return goals.find(goal => goal.id === parseInt(id))
}

// Add a new goal
export const addGoal = (goalData) => {
  const goals = getAllGoals()
  
  // Generate new ID (max existing ID + 1)
  const newId = goals.length > 0 
    ? Math.max(...goals.map(g => g.id)) + 1 
    : 1
  
  const newGoal = {
    id: newId,
    title: goalData.title || "Untitled Goal",
    description: goalData.description || "",
    dueDate: goalData.dueDate || "No due date",
    progress: goalData.progress || 0,
    createdAt: new Date().toISOString()
  }
  
  goals.push(newGoal)
  saveAllGoals(goals)
  return newGoal
}

// Update an existing goal
export const updateGoal = (id, updates) => {
  const goals = getAllGoals()
  const goalIndex = goals.findIndex(goal => goal.id === parseInt(id))
  
  if (goalIndex === -1) {
    console.error('Goal not found:', id)
    return null
  }
  
  goals[goalIndex] = {
    ...goals[goalIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  saveAllGoals(goals)
  return goals[goalIndex]
}

// Delete a goal
export const deleteGoal = (id) => {
  const goals = getAllGoals()
  const filteredGoals = goals.filter(goal => goal.id !== parseInt(id))
  
  if (filteredGoals.length === goals.length) {
    console.error('Goal not found:', id)
    return false
  }
  
  saveAllGoals(filteredGoals)
  return true
}

// Clear all goals (useful for testing)
export const clearAllGoals = () => {
  localStorage.removeItem(STORAGE_KEY)
  return true
}


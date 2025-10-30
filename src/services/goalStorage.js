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
          milestones: [
            { id: 1, text: "Understand components and JSX", completed: true },
            { id: 2, text: "Learn useState and props", completed: true },
            { id: 3, text: "Master useEffect and lifecycle", completed: true },
            { id: 4, text: "Build a full project", completed: false }
          ]
        },
        {
          id: 2,
          title: "Build Goalie App",
          description: "Create a full-stack goal tracking application with React and a database.",
          dueDate: "Dec 31, 2025",
          milestones: [
            { id: 1, text: "Set up React project", completed: true },
            { id: 2, text: "Create dashboard and components", completed: true },
            { id: 3, text: "Add local storage", completed: true },
            { id: 4, text: "Implement milestones feature", completed: false },
            { id: 5, text: "Connect to real database", completed: false },
            { id: 6, text: "Deploy to production", completed: false }
          ]
        },
        {
          id: 3,
          title: "Exercise 3x per week",
          description: "Maintain a consistent workout routine for better health and energy.",
          dueDate: "Ongoing",
          milestones: [
            { id: 1, text: "Week 1 - 3 workouts", completed: true },
            { id: 2, text: "Week 2 - 3 workouts", completed: true },
            { id: 3, text: "Week 3 - 3 workouts", completed: true },
            { id: 4, text: "Week 4 - 3 workouts", completed: true },
            { id: 5, text: "Week 5 - 3 workouts", completed: false }
          ]
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

// Calculate progress based on completed milestones
export const calculateProgress = (milestones) => {
  if (!milestones || milestones.length === 0) return 0
  const completed = milestones.filter(m => m.completed).length
  return Math.round((completed / milestones.length) * 100)
}

// Add a new goal
export const addGoal = (goalData) => {
  const goals = getAllGoals()
  
  // Generate new ID (max existing ID + 1)
  const newId = goals.length > 0 
    ? Math.max(...goals.map(g => g.id)) + 1 
    : 1
  
  // Convert steps to milestones with IDs
  const milestones = (goalData.steps || []).map((step, index) => ({
    id: index + 1,
    text: step,
    completed: false
  }))
  
  const newGoal = {
    id: newId,
    title: goalData.title || "Untitled Goal",
    description: goalData.description || "",
    dueDate: goalData.dueDate || "No due date",
    milestones: milestones,
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

// Toggle milestone completion
export const toggleMilestone = (goalId, milestoneId) => {
  const goals = getAllGoals()
  const goal = goals.find(g => g.id === parseInt(goalId))
  
  if (!goal || !goal.milestones) return null
  
  const milestone = goal.milestones.find(m => m.id === milestoneId)
  if (!milestone) return null
  
  milestone.completed = !milestone.completed
  
  saveAllGoals(goals)
  return goal
}

// Add milestone to a goal
export const addMilestone = (goalId, milestoneText) => {
  const goals = getAllGoals()
  const goal = goals.find(g => g.id === parseInt(goalId))
  
  if (!goal) return null
  
  if (!goal.milestones) goal.milestones = []
  
  const newId = goal.milestones.length > 0
    ? Math.max(...goal.milestones.map(m => m.id)) + 1
    : 1
  
  const newMilestone = {
    id: newId,
    text: milestoneText,
    completed: false
  }
  
  goal.milestones.push(newMilestone)
  saveAllGoals(goals)
  return goal
}

// Delete milestone from a goal
export const deleteMilestone = (goalId, milestoneId) => {
  const goals = getAllGoals()
  const goal = goals.find(g => g.id === parseInt(goalId))
  
  if (!goal || !goal.milestones) return null
  
  goal.milestones = goal.milestones.filter(m => m.id !== milestoneId)
  saveAllGoals(goals)
  return goal
}

// Update milestone text
export const updateMilestone = (goalId, milestoneId, newText) => {
  const goals = getAllGoals()
  const goal = goals.find(g => g.id === parseInt(goalId))
  
  if (!goal || !goal.milestones) return null
  
  const milestone = goal.milestones.find(m => m.id === milestoneId)
  if (!milestone) return null
  
  milestone.text = newText
  saveAllGoals(goals)
  return goal
}


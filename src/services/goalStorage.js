// API base URL
const API_URL = 'http://localhost:3001/api';

// Calculate progress based on completed milestones
export const calculateProgress = (milestones) => {
  if (!milestones || milestones.length === 0) return 0;
  const completed = milestones.filter(m => m.completed).length;
  return Math.round((completed / milestones.length) * 100);
};

// Get all goals from API
export const getAllGoals = async () => {
  try {
    const response = await fetch(`${API_URL}/goals`);
    if (!response.ok) {
      throw new Error(`Failed to fetch goals: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading goals:', error);
    throw error;
  }
};

// Get a single goal by ID
export const getGoalById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/goals/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Goal not found');
      }
      throw new Error(`Failed to fetch goal: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading goal:', error);
    throw error;
  }
};

// Add a new goal
export const addGoal = async (goalData) => {
  try {
    const response = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goalData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create goal: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

// Update an existing goal
export const updateGoal = async (id, updates) => {
  try {
    const response = await fetch(`${API_URL}/goals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update goal: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

// Delete a goal
export const deleteGoal = async (id) => {
  try {
    const response = await fetch(`${API_URL}/goals/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete goal: ${response.statusText}`);
    }
    return true;
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};

// Toggle milestone completion
export const toggleMilestone = async (goalId, milestoneId) => {
  try {
    const response = await fetch(`${API_URL}/goals/${goalId}/milestones/${milestoneId}/toggle`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to toggle milestone: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error toggling milestone:', error);
    throw error;
  }
};

// Add milestone to a goal
export const addMilestone = async (goalId, milestoneText) => {
  try {
    const response = await fetch(`${API_URL}/goals/${goalId}/milestones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: milestoneText }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add milestone: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding milestone:', error);
    throw error;
  }
};

// Delete milestone from a goal
export const deleteMilestone = async (goalId, milestoneId) => {
  try {
    const response = await fetch(`${API_URL}/goals/${goalId}/milestones/${milestoneId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete milestone: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting milestone:', error);
    throw error;
  }
};

// Update milestone text and/or date
export const updateMilestone = async (goalId, milestoneId, newText = null, newDate = null) => {
  try {
    const updateData = {};
    if (newText !== null) {
      updateData.text = newText;
    }
    if (newDate !== null) {
      updateData.dueDate = newDate;
    }

    const response = await fetch(`${API_URL}/goals/${goalId}/milestones/${milestoneId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update milestone: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
};

// Reorder milestones
export const reorderMilestones = async (goalId, reorderedMilestones) => {
  try {
    const response = await fetch(`${API_URL}/goals/${goalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ milestones: reorderedMilestones }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to reorder milestones: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error reordering milestones:', error);
    throw error;
  }
};

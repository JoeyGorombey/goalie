const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const GOALS_FILE = path.join(__dirname, 'data', 'goals.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Read goals from file
const readGoals = async () => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(GOALS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return sample data
    if (error.code === 'ENOENT') {
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
            { id: 4, text: "Implement milestones feature", completed: true },
            { id: 5, text: "Create backend with JSON files", completed: false },
            { id: 6, text: "Connect to real database", completed: false }
          ]
        }
      ];
      await writeGoals(sampleGoals);
      return sampleGoals;
    }
    throw error;
  }
};

// Write goals to file
const writeGoals = async (goals) => {
  await ensureDataDir();
  await fs.writeFile(GOALS_FILE, JSON.stringify(goals, null, 2), 'utf8');
  console.log(`✅ Goals saved to ${GOALS_FILE}`);
};

// API Routes

// GET all goals
app.get('/api/goals', async (req, res) => {
  try {
    const goals = await readGoals();
    res.json(goals);
  } catch (error) {
    console.error('Error reading goals:', error);
    res.status(500).json({ error: 'Failed to read goals' });
  }
});

// GET single goal by ID
app.get('/api/goals/:id', async (req, res) => {
  try {
    const goals = await readGoals();
    const goal = goals.find(g => g.id === parseInt(req.params.id));
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error) {
    console.error('Error reading goal:', error);
    res.status(500).json({ error: 'Failed to read goal' });
  }
});

// POST create new goal
app.post('/api/goals', async (req, res) => {
  try {
    const goals = await readGoals();
    
    // Generate new ID
    const newId = goals.length > 0 
      ? Math.max(...goals.map(g => g.id)) + 1 
      : 1;
    
    // Convert steps to milestones
    const milestones = (req.body.steps || []).map((step, index) => ({
      id: index + 1,
      text: step,
      completed: false
    }));
    
    const newGoal = {
      id: newId,
      title: req.body.title || "Untitled Goal",
      description: req.body.description || "",
      dueDate: req.body.dueDate || "No due date",
      milestones: milestones,
      createdAt: new Date().toISOString()
    };
    
    goals.push(newGoal);
    await writeGoals(goals);
    
    res.status(201).json(newGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// PUT update goal
app.put('/api/goals/:id', async (req, res) => {
  try {
    const goals = await readGoals();
    const goalIndex = goals.findIndex(g => g.id === parseInt(req.params.id));
    
    if (goalIndex === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    goals[goalIndex] = {
      ...goals[goalIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await writeGoals(goals);
    res.json(goals[goalIndex]);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// DELETE goal
app.delete('/api/goals/:id', async (req, res) => {
  try {
    const goals = await readGoals();
    const filteredGoals = goals.filter(g => g.id !== parseInt(req.params.id));
    
    if (filteredGoals.length === goals.length) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    await writeGoals(filteredGoals);
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

// POST toggle milestone
app.post('/api/goals/:goalId/milestones/:milestoneId/toggle', async (req, res) => {
  try {
    const goals = await readGoals();
    const goal = goals.find(g => g.id === parseInt(req.params.goalId));
    
    if (!goal || !goal.milestones) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    const milestone = goal.milestones.find(m => m.id === parseInt(req.params.milestoneId));
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    
    milestone.completed = !milestone.completed;
    
    await writeGoals(goals);
    res.json(goal);
  } catch (error) {
    console.error('Error toggling milestone:', error);
    res.status(500).json({ error: 'Failed to toggle milestone' });
  }
});

// POST add milestone
app.post('/api/goals/:goalId/milestones', async (req, res) => {
  try {
    const goals = await readGoals();
    const goal = goals.find(g => g.id === parseInt(req.params.goalId));
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    if (!goal.milestones) goal.milestones = [];
    
    const newId = goal.milestones.length > 0
      ? Math.max(...goal.milestones.map(m => m.id)) + 1
      : 1;
    
    const newMilestone = {
      id: newId,
      text: req.body.text,
      completed: false
    };
    
    goal.milestones.push(newMilestone);
    await writeGoals(goals);
    
    res.status(201).json(goal);
  } catch (error) {
    console.error('Error adding milestone:', error);
    res.status(500).json({ error: 'Failed to add milestone' });
  }
});

// PUT update milestone
app.put('/api/goals/:goalId/milestones/:milestoneId', async (req, res) => {
  try {
    const goals = await readGoals();
    const goal = goals.find(g => g.id === parseInt(req.params.goalId));
    
    if (!goal || !goal.milestones) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    const milestone = goal.milestones.find(m => m.id === parseInt(req.params.milestoneId));
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    
    milestone.text = req.body.text;
    await writeGoals(goals);
    
    res.json(goal);
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ error: 'Failed to update milestone' });
  }
});

// DELETE milestone
app.delete('/api/goals/:goalId/milestones/:milestoneId', async (req, res) => {
  try {
    const goals = await readGoals();
    const goal = goals.find(g => g.id === parseInt(req.params.goalId));
    
    if (!goal || !goal.milestones) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    goal.milestones = goal.milestones.filter(m => m.id !== parseInt(req.params.milestoneId));
    await writeGoals(goals);
    
    res.json(goal);
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({ error: 'Failed to delete milestone' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Goals file: ${GOALS_FILE}`);
});


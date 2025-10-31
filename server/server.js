const express = require('express');
const cors = require('cors');
const { db, initializeDatabase, getGoalWithMilestones, getAllGoalsWithMilestones } = require('./db/schema');

const app = express();
const PORT = 3001;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// ============================================================================
// API ROUTES
// ============================================================================

// GET API info
app.get('/api', (req, res) => {
  res.json({
    message: 'Goalie API is running! 🥅',
    version: '2.0.0',
    database: 'SQLite',
    endpoints: {
      'GET /api/goals': 'Get all goals',
      'GET /api/goals/:id': 'Get a single goal by ID',
      'POST /api/goals': 'Create a new goal',
      'PUT /api/goals/:id': 'Update a goal',
      'DELETE /api/goals/:id': 'Delete a goal',
      'POST /api/goals/:goalId/milestones': 'Add a milestone to a goal',
      'PUT /api/goals/:goalId/milestones/:milestoneId': 'Update a milestone',
      'DELETE /api/goals/:goalId/milestones/:milestoneId': 'Delete a milestone',
      'POST /api/goals/:goalId/milestones/:milestoneId/toggle': 'Toggle milestone completion'
    }
  });
});

// ============================================================================
// GOALS ENDPOINTS
// ============================================================================

// GET all goals
app.get('/api/goals', (req, res) => {
  try {
    const goals = getAllGoalsWithMilestones();
    res.json(goals);
  } catch (error) {
    console.error('Error getting goals:', error);
    res.status(500).json({ error: 'Failed to get goals' });
  }
});

// GET single goal by ID
app.get('/api/goals/:id', (req, res) => {
  try {
    const goal = getGoalWithMilestones(parseInt(req.params.id));
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error) {
    console.error('Error getting goal:', error);
    res.status(500).json({ error: 'Failed to get goal' });
  }
});

// POST create new goal
app.post('/api/goals', (req, res) => {
  try {
    const { title, description, dueDate, steps } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Goal title is required' });
    }

    // Insert goal
    const insertGoal = db.prepare(`
      INSERT INTO goals (title, description, dueDate)
      VALUES (?, ?, ?)
    `);
    
    const result = insertGoal.run(
      title.trim(),
      description?.trim() || '',
      dueDate || null
    );

    const goalId = result.lastInsertRowid;

    // Insert milestones if provided
    if (steps && steps.length > 0) {
      const insertMilestone = db.prepare(`
        INSERT INTO milestones (goalId, text, completed, position)
        VALUES (?, ?, 0, ?)
      `);

      steps.forEach((step, index) => {
        if (step.trim() !== '') {
          insertMilestone.run(goalId, step.trim(), index);
        }
      });
    }

    const newGoal = getGoalWithMilestones(goalId);
    console.log(`✅ Created goal ${goalId}: "${title}"`);
    
    res.status(201).json(newGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// PUT update goal
app.put('/api/goals/:id', (req, res) => {
  try {
    const goalId = parseInt(req.params.id);
    const { title, description, dueDate, milestones } = req.body;

    // Check if goal exists
    const existingGoal = db.prepare('SELECT id FROM goals WHERE id = ?').get(goalId);
    if (!existingGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // If updating milestones order
    if (milestones) {
      // Validate all milestones have text
      const invalidMilestones = milestones.filter(m => !m.text || m.text.trim() === '');
      if (invalidMilestones.length > 0) {
        console.error('❌ Attempted to save milestones without text:', invalidMilestones);
        return res.status(400).json({ 
          error: 'Invalid milestone data: all milestones must have text',
          invalidMilestones: invalidMilestones.map(m => m.id)
        });
      }

      // Update milestone positions
      const updatePosition = db.prepare(`
        UPDATE milestones 
        SET position = ? 
        WHERE id = ? AND goalId = ?
      `);

      milestones.forEach((milestone, index) => {
        updatePosition.run(index, milestone.id, goalId);
      });
    }

    // Update goal fields if provided
    if (title !== undefined || description !== undefined || dueDate !== undefined) {
      const updates = [];
      const values = [];

      if (title !== undefined) {
        updates.push('title = ?');
        values.push(title.trim());
      }
      if (description !== undefined) {
        updates.push('description = ?');
        values.push(description.trim());
      }
      if (dueDate !== undefined) {
        updates.push('dueDate = ?');
        values.push(dueDate || null);
      }

      updates.push('updatedAt = datetime("now")');
      values.push(goalId);

      const sql = `UPDATE goals SET ${updates.join(', ')} WHERE id = ?`;
      db.prepare(sql).run(...values);
    }

    const updatedGoal = getGoalWithMilestones(goalId);
    console.log(`✅ Updated goal ${goalId}`);
    
    res.json(updatedGoal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// DELETE goal
app.delete('/api/goals/:id', (req, res) => {
  try {
    const goalId = parseInt(req.params.id);
    
    const result = db.prepare('DELETE FROM goals WHERE id = ?').run(goalId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    console.log(`✅ Deleted goal ${goalId}`);
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

// ============================================================================
// MILESTONES ENDPOINTS
// ============================================================================

// POST toggle milestone completion
app.post('/api/goals/:goalId/milestones/:milestoneId/toggle', (req, res) => {
  try {
    const goalId = parseInt(req.params.goalId);
    const milestoneId = parseInt(req.params.milestoneId);

    // Toggle completion status
    db.prepare(`
      UPDATE milestones 
      SET completed = NOT completed 
      WHERE id = ? AND goalId = ?
    `).run(milestoneId, goalId);

    const updatedGoal = getGoalWithMilestones(goalId);
    
    if (!updatedGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    console.log(`✅ Toggled milestone ${milestoneId}`);
    res.json(updatedGoal);
  } catch (error) {
    console.error('Error toggling milestone:', error);
    res.status(500).json({ error: 'Failed to toggle milestone' });
  }
});

// POST add milestone
app.post('/api/goals/:goalId/milestones', (req, res) => {
  try {
    const goalId = parseInt(req.params.goalId);
    const { text } = req.body;

    // Validate milestone text
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Milestone text is required' });
    }

    // Check if goal exists
    const goal = db.prepare('SELECT id FROM goals WHERE id = ?').get(goalId);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // Get max position
    const maxPos = db.prepare('SELECT MAX(position) as max FROM milestones WHERE goalId = ?').get(goalId);
    const position = (maxPos.max !== null ? maxPos.max : -1) + 1;

    // Insert milestone
    db.prepare(`
      INSERT INTO milestones (goalId, text, completed, position)
      VALUES (?, ?, 0, ?)
    `).run(goalId, text.trim(), position);

    const updatedGoal = getGoalWithMilestones(goalId);
    console.log(`✅ Added milestone to goal ${goalId}`);
    
    res.status(201).json(updatedGoal);
  } catch (error) {
    console.error('Error adding milestone:', error);
    res.status(500).json({ error: 'Failed to add milestone' });
  }
});

// PUT update milestone
app.put('/api/goals/:goalId/milestones/:milestoneId', (req, res) => {
  try {
    const goalId = parseInt(req.params.goalId);
    const milestoneId = parseInt(req.params.milestoneId);
    const { text, dueDate } = req.body;

    // Check if milestone exists
    const milestone = db.prepare('SELECT * FROM milestones WHERE id = ? AND goalId = ?').get(milestoneId, goalId);
    
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    // Validate milestone has text before updating
    if (!milestone.text && text === undefined) {
      console.warn(`⚠️  Warning: Milestone ${milestoneId} is missing text property!`);
      return res.status(400).json({ 
        error: 'Cannot update milestone: missing text. Please edit the milestone text first.' 
      });
    }

    const updates = [];
    const values = [];

    // Update text if provided
    if (text !== undefined) {
      const trimmedText = text.trim();
      if (trimmedText === '') {
        return res.status(400).json({ error: 'Milestone text cannot be empty' });
      }
      updates.push('text = ?');
      values.push(trimmedText);
    }

    // Update dueDate if provided (null to clear)
    if (dueDate !== undefined) {
      updates.push('dueDate = ?');
      values.push(dueDate || null);
    }

    if (updates.length > 0) {
      values.push(milestoneId, goalId);
      const sql = `UPDATE milestones SET ${updates.join(', ')} WHERE id = ? AND goalId = ?`;
      db.prepare(sql).run(...values);
    }

    const updatedGoal = getGoalWithMilestones(goalId);
    console.log(`✅ Updated milestone ${milestoneId}:`, { text, dueDate });
    
    res.json(updatedGoal);
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ error: 'Failed to update milestone' });
  }
});

// DELETE milestone
app.delete('/api/goals/:goalId/milestones/:milestoneId', (req, res) => {
  try {
    const goalId = parseInt(req.params.goalId);
    const milestoneId = parseInt(req.params.milestoneId);

    const result = db.prepare('DELETE FROM milestones WHERE id = ? AND goalId = ?').run(milestoneId, goalId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    const updatedGoal = getGoalWithMilestones(goalId);
    console.log(`✅ Deleted milestone ${milestoneId}`);
    
    res.json(updatedGoal);
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({ error: 'Failed to delete milestone' });
  }
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`\n🥅 Goalie API Server`);
  console.log(`📡 Running on http://localhost:${PORT}`);
  console.log(`🗄️  Database: SQLite (better-sqlite3)`);
  console.log(`\n📚 API Documentation: http://localhost:${PORT}/api\n`);
});

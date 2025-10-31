const Database = require('better-sqlite3');
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'goalie.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDatabase() {
  console.log('🗄️  Initializing database schema...');

  // Create goals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      dueDate TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create milestones table
  db.exec(`
    CREATE TABLE IF NOT EXISTS milestones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goalId INTEGER NOT NULL,
      text TEXT NOT NULL CHECK(length(trim(text)) > 0),
      completed INTEGER NOT NULL DEFAULT 0,
      dueDate TEXT,
      position INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (goalId) REFERENCES goals(id) ON DELETE CASCADE
    )
  `);

  // Create index on goalId for faster queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_milestones_goalId 
    ON milestones(goalId)
  `);

  // Create index on position for ordering
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_milestones_position 
    ON milestones(goalId, position)
  `);

  console.log('✅ Database schema initialized!');
}

// Helper function to get goal with milestones
function getGoalWithMilestones(goalId) {
  const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(goalId);
  
  if (!goal) return null;

  const milestones = db.prepare(`
    SELECT id, text, completed, dueDate 
    FROM milestones 
    WHERE goalId = ? 
    ORDER BY position ASC
  `).all(goalId);

  return {
    ...goal,
    milestones: milestones.map(m => ({
      ...m,
      completed: Boolean(m.completed)
    }))
  };
}

// Helper function to get all goals with milestones
function getAllGoalsWithMilestones() {
  const goals = db.prepare('SELECT * FROM goals ORDER BY createdAt DESC').all();
  
  return goals.map(goal => {
    const milestones = db.prepare(`
      SELECT id, text, completed, dueDate 
      FROM milestones 
      WHERE goalId = ? 
      ORDER BY position ASC
    `).all(goal.id);

    return {
      ...goal,
      milestones: milestones.map(m => ({
        ...m,
        completed: Boolean(m.completed)
      }))
    };
  });
}

module.exports = {
  db,
  initializeDatabase,
  getGoalWithMilestones,
  getAllGoalsWithMilestones
};


const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'goalie.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

console.log('🔄 Running migration: Add activity tracking...');

try {
  // Create activity_log table for tracking user activity
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activityDate TEXT NOT NULL,
      activityType TEXT NOT NULL CHECK(activityType IN ('goal_created', 'goal_updated', 'milestone_completed', 'milestone_added', 'milestone_updated')),
      goalId INTEGER,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (goalId) REFERENCES goals(id) ON DELETE CASCADE
    )
  `;
  
  db.exec(createTableSql);
  console.log('✅ Created activity_log table');
  
  // Create index on activityDate for faster streak queries
  const createIndexSql = `
    CREATE INDEX IF NOT EXISTS idx_activity_date ON activity_log(activityDate DESC)
  `;
  
  db.exec(createIndexSql);
  console.log('✅ Created index on activityDate');
  
  // Create user_stats table for caching streak and other stats
  const createStatsSql = `
    CREATE TABLE IF NOT EXISTS user_stats (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      currentStreak INTEGER NOT NULL DEFAULT 0,
      longestStreak INTEGER NOT NULL DEFAULT 0,
      lastActivityDate TEXT,
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `;
  
  db.exec(createStatsSql);
  console.log('✅ Created user_stats table');
  
  // Initialize user_stats with default values
  const initStatsSql = `
    INSERT OR IGNORE INTO user_stats (id, currentStreak, longestStreak, lastActivityDate)
    VALUES (1, 0, 0, NULL)
  `;
  
  db.exec(initStatsSql);
  console.log('✅ Initialized user_stats');
  
  console.log('\n✅ Migration completed successfully!');
  console.log('   Tables created: activity_log, user_stats');
  console.log('   Index created: idx_activity_date');
} catch (error) {
  console.error('❌ Error during migration:', error);
  throw error;
} finally {
  db.close();
}


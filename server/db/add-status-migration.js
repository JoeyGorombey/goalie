const Database = require('better-sqlite3');
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'goalie.db');
const db = new Database(dbPath);

console.log('🔄 Running migration: Add status column to goals table...\n');

try {
  // Check if status column already exists
  const tableInfo = db.prepare("PRAGMA table_info(goals)").all();
  const hasStatus = tableInfo.some(col => col.name === 'status');

  if (hasStatus) {
    console.log('✅ Status column already exists! No migration needed.\n');
  } else {
    console.log('📝 Adding status column to goals table...');
    
    // Add status column with default value 'active'
    db.exec(`
      ALTER TABLE goals 
      ADD COLUMN status TEXT NOT NULL DEFAULT 'active' 
      CHECK(status IN ('active', 'completed'))
    `);

    console.log('✅ Status column added successfully!');
    console.log('   Default value: "active"');
    console.log('   Allowed values: "active", "completed"\n');

    // Get count of goals
    const goalCount = db.prepare('SELECT COUNT(*) as count FROM goals').get();
    console.log(`📊 Updated ${goalCount.count} existing goal(s) with "active" status\n`);
  }

  console.log('✅ Migration completed successfully!\n');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.error(error);
  process.exit(1);
}

db.close();


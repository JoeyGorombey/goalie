const fs = require('fs').promises;
const path = require('path');
const { db, initializeDatabase } = require('./schema');

async function migrateFromJSON() {
  console.log('🚀 Starting migration from goals.json to SQLite...');

  // Initialize database schema
  initializeDatabase();

  // Read existing JSON data
  const jsonPath = path.join(__dirname, '../data/goals.json');
  
  try {
    const data = await fs.readFile(jsonPath, 'utf8');
    const goals = JSON.parse(data);

    console.log(`📦 Found ${goals.length} goals to migrate`);

    // Begin transaction for atomic migration
    const migrate = db.transaction(() => {
      goals.forEach((goal, index) => {
        console.log(`   Migrating goal ${index + 1}: "${goal.title}"`);

        // Insert goal
        const insertGoal = db.prepare(`
          INSERT INTO goals (title, description, dueDate, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?)
        `);

        const result = insertGoal.run(
          goal.title,
          goal.description || '',
          goal.dueDate || null,
          goal.createdAt || new Date().toISOString(),
          goal.updatedAt || new Date().toISOString()
        );

        const newGoalId = result.lastInsertRowid;

        // Insert milestones if they exist
        if (goal.milestones && goal.milestones.length > 0) {
          const insertMilestone = db.prepare(`
            INSERT INTO milestones (goalId, text, completed, dueDate, position)
            VALUES (?, ?, ?, ?, ?)
          `);

          goal.milestones.forEach((milestone, position) => {
            // Validate milestone has text
            const milestoneText = milestone.text && milestone.text.trim() !== '' 
              ? milestone.text 
              : `Milestone ${milestone.id}`;

            insertMilestone.run(
              newGoalId,
              milestoneText,
              milestone.completed ? 1 : 0,
              milestone.dueDate || null,
              position
            );
          });

          console.log(`      ✓ Migrated ${goal.milestones.length} milestones`);
        }
      });
    });

    // Execute migration transaction
    migrate();

    console.log('✅ Migration completed successfully!');
    console.log('📊 Database statistics:');
    
    const goalCount = db.prepare('SELECT COUNT(*) as count FROM goals').get();
    const milestoneCount = db.prepare('SELECT COUNT(*) as count FROM milestones').get();
    
    console.log(`   - Goals: ${goalCount.count}`);
    console.log(`   - Milestones: ${milestoneCount.count}`);

    // Backup the original JSON file
    const backupPath = jsonPath.replace('.json', '.backup.json');
    await fs.copyFile(jsonPath, backupPath);
    console.log(`💾 Original data backed up to: ${backupPath}`);

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('⚠️  No goals.json found - starting with empty database');
    } else {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateFromJSON()
    .then(() => {
      console.log('\n🎉 Ready to start server with SQLite database!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateFromJSON };


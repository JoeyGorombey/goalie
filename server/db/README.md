# Goalie Database (SQLite)

## Overview

The Goalie app now uses **SQLite** for reliable data storage with:
- ✅ **Data integrity** - Foreign keys and constraints prevent corruption
- ✅ **ACID transactions** - Atomic operations
- ✅ **Fast queries** - Indexed for performance
- ✅ **No setup required** - File-based database

## Database Schema

### Goals Table
```sql
CREATE TABLE goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  dueDate TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
)
```

### Milestones Table
```sql
CREATE TABLE milestones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  goalId INTEGER NOT NULL,
  text TEXT NOT NULL CHECK(length(trim(text)) > 0),
  completed INTEGER NOT NULL DEFAULT 0,
  dueDate TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (goalId) REFERENCES goals(id) ON DELETE CASCADE
)
```

## Key Features

### Data Validation
- **Milestone text** - Cannot be null or empty (enforced at DB level)
- **Foreign keys** - Milestones automatically deleted when goal is deleted
- **Check constraints** - Ensures milestone text is not just whitespace

### Indexes
- `idx_milestones_goalId` - Fast lookup of milestones by goal
- `idx_milestones_position` - Fast ordering of milestones

## Files

- `goalie.db` - The SQLite database file (auto-created)
- `schema.js` - Database schema and helper functions
- `migrate.js` - Migration script from goals.json
- `README.md` - This file

## Migration

Your data was automatically migrated from `goals.json` to SQLite.
- Original backup: `../data/goals.backup.json`
- Migrated: 4 goals, 10 milestones

## Viewing the Database

You can inspect the database using:

### Option 1: DB Browser for SQLite (GUI)
Download: https://sqlitebrowser.org/

### Option 2: SQLite CLI
```bash
sqlite3 server/db/goalie.db
```

Example queries:
```sql
-- View all goals
SELECT * FROM goals;

-- View all milestones with goal titles
SELECT g.title, m.text, m.completed
FROM milestones m
JOIN goals g ON m.goalId = g.id
ORDER BY g.id, m.position;

-- Count goals and milestones
SELECT 
  (SELECT COUNT(*) FROM goals) as goals,
  (SELECT COUNT(*) FROM milestones) as milestones;
```

## Backup & Restore

### Backup
Simply copy the database file:
```bash
cp server/db/goalie.db server/db/goalie.backup.db
```

### Restore
Replace with backup:
```bash
cp server/db/goalie.backup.db server/db/goalie.db
```

## Resetting the Database

If you need to start fresh:

```bash
# Delete database
rm server/db/goalie.db

# Re-run migration (if you have goals.json)
node server/db/migrate.js

# Or just start server (creates empty database)
npm start
```

## Database Location

📁 `C:\Users\jmgor\Documents\Github\goalie\server\db\goalie.db`

## Benefits Over JSON File

| Feature | JSON File | SQLite Database |
|---------|-----------|-----------------|
| Data validation | ❌ None | ✅ Enforced constraints |
| Concurrent access | ❌ Can corrupt | ✅ Safe |
| Transactions | ❌ No | ✅ ACID |
| Query speed | ❌ Slow (full scan) | ✅ Fast (indexed) |
| Data integrity | ❌ Manual | ✅ Automatic |
| Corruption risk | ⚠️ High | ✅ Low |

## No More Data Issues!

With SQLite:
- ✅ Milestones **cannot** lose their text (DB constraint)
- ✅ Orphaned milestones **impossible** (foreign keys)
- ✅ Reordering is **safe** (transactions)
- ✅ Data **validated** before saving


# Goalie Backend Server

Simple Express.js backend that persists goals to JSON files.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Start the server:
```bash
npm start
```

Or use nodemon for development (auto-restart):
```bash
npm run dev
```

Server will run on `http://localhost:3001`

## Data Storage

Goals are stored in `server/data/goals.json`

This file is automatically created on first run with sample data.

## API Endpoints

### Goals
- `GET /api/goals` - Get all goals
- `GET /api/goals/:id` - Get single goal
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Milestones
- `POST /api/goals/:goalId/milestones/:milestoneId/toggle` - Toggle milestone completion
- `POST /api/goals/:goalId/milestones` - Add new milestone
- `PUT /api/goals/:goalId/milestones/:milestoneId` - Update milestone text
- `DELETE /api/goals/:goalId/milestones/:milestoneId` - Delete milestone

## Future Migration

This JSON file-based backend is designed to be easily replaced with a real database (PostgreSQL, MongoDB, etc.) by simply swapping out the `readGoals()` and `writeGoals()` functions.


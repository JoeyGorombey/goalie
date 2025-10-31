# 🥅 Goalie API Documentation

## 📚 Swagger Interactive Docs

**Full interactive API documentation with live testing:**  
👉 **http://localhost:3001/api-docs**

The Swagger UI provides:
- ✨ **Interactive testing** - Try API calls directly from your browser
- 📝 **Complete schemas** - View all request/response structures
- 🎯 **Live examples** - See sample requests and responses
- 🔍 **Search functionality** - Find endpoints quickly
- 📊 **Organized by tags** - Goals and Milestones sections

---

## 🚀 Quick API Overview

### Goals Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/goals` | Get all goals with milestones |
| `GET` | `/api/goals/:id` | Get a single goal by ID |
| `POST` | `/api/goals` | Create a new goal |
| `PUT` | `/api/goals/:id` | Update goal or reorder milestones |
| `DELETE` | `/api/goals/:id` | Delete a goal (cascades to milestones) |

### Milestones Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/goals/:goalId/milestones` | Add a new milestone |
| `PUT` | `/api/goals/:goalId/milestones/:milestoneId` | Update milestone text/date |
| `DELETE` | `/api/goals/:goalId/milestones/:milestoneId` | Delete a milestone |
| `POST` | `/api/goals/:goalId/milestones/:milestoneId/toggle` | Toggle completion status |

---

## 📋 Example Requests

### Create a Goal
```bash
curl -X POST http://localhost:3001/api/goals \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Spanish",
    "description": "Become fluent in conversational Spanish",
    "dueDate": "Dec 31, 2025",
    "steps": [
      "Complete Duolingo Unit 1",
      "Practice daily for 30 minutes"
    ]
  }'
```

### Get All Goals
```bash
curl http://localhost:3001/api/goals
```

### Add a Milestone
```bash
curl -X POST http://localhost:3001/api/goals/1/milestones \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Complete grammar exercises"
  }'
```

### Update Milestone with Due Date
```bash
curl -X PUT http://localhost:3001/api/goals/1/milestones/1 \
  -H "Content-Type: application/json" \
  -d '{
    "dueDate": "2025-11-20"
  }'
```

### Toggle Milestone Completion
```bash
curl -X POST http://localhost:3001/api/goals/1/milestones/1/toggle
```

---

## 🗄️ Database

- **Type:** SQLite (better-sqlite3)
- **Location:** `server/db/goalie.db`
- **Schema:** See `server/db/schema.js`

---

## 🔧 Development

### Start Servers
```cmd
# Backend (from server directory)
cd server && npm start

# Frontend (from project root)
npm run dev
```

### Stop Servers
```cmd
taskkill /F /IM node.exe
```

---

## 📖 More Info

- **Swagger OpenAPI Version:** 3.0.0
- **API Version:** 2.0.0
- **Base URL:** http://localhost:3001
- **Simple API Info:** http://localhost:3001/api

---

**💡 Tip:** Use the Swagger UI at http://localhost:3001/api-docs to explore and test all endpoints interactively!


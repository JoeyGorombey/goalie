# 🥅 Goalie - Goal Tracking App

A full-stack React application for tracking goals with milestone-based progress calculation, smart status detection, and celebration features.

## 🚀 Features

### Core Goal Management
- ✅ Create goals with multiple steps/milestones
- ✅ Automatic progress calculation based on completed milestones
- ✅ Interactive milestone management (add, edit, delete, reorder, check off)
- ✅ Goal CRUD operations (Create, Read, Update, Delete)
- ✅ SQLite database with ACID transactions
- ✅ Beautiful, modern UI with smooth animations
- ✅ Fully responsive design

### Smart Status Tracking
- 🎯 **On Track** - All milestones on schedule
- ⏰ **Behind Schedule** - Overdue milestones detected
- ⚠️ **Late** - Goal deadline passed
- 🚨 **Late & Behind** - Critical status (both overdue)
- ✅ **Completed** - All milestones done

### Advanced Features
- 📅 Milestone due dates with automatic sorting
- 🎉 Celebration modal on goal completion
- 📢 Share achievements (native share API + clipboard)
- ⚠️ Visual overdue indicators
- 🎨 Status badges with pulsing animations
- 🔄 Drag-and-drop milestone reordering

## 📚 Documentation

**[Full Documentation →](./docs/README.md)**

- [Celebration Feature](./docs/CELEBRATION_FEATURE.md)
- [Status System](./docs/GOAL_STATUS_FEATURE.md)
- [Milestone Sorting & Behind/Late Detection](./docs/MILESTONE_SORTING_STATUS_FEATURE.md)
- [API Reference](./docs/API_DOCS.md)
- [Swagger UI](http://localhost:3001/api-docs) (when running)

## 🏗️ Tech Stack

**Frontend:**
- React 19
- React Router
- Vite
- CSS3
- @dnd-kit (drag & drop)

**Backend:**
- Node.js
- Express.js
- SQLite (better-sqlite3)
- Swagger/OpenAPI

**Features:**
- REST API
- Real-time status detection
- Automatic data sorting
- ACID transactions

## 📦 Installation & Setup

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

## 🎮 Running the App

You need to run **both** the backend server and the frontend dev server:

### Terminal 1: Start Backend Server
```bash
cd server
npm start
```
Backend will run on `http://localhost:3001`

### Terminal 2: Start Frontend Dev Server
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

Open your browser to `http://localhost:5173`

## 📁 Project Structure

```
goalie/
├── docs/                   # 📚 All documentation
│   ├── README.md           # Documentation index
│   ├── API_DOCS.md         # API reference
│   ├── CELEBRATION_FEATURE.md
│   ├── GOAL_STATUS_FEATURE.md
│   └── MILESTONE_SORTING_STATUS_FEATURE.md
│
├── src/                    # ⚛️ Frontend React app
│   ├── components/         # Reusable UI components
│   │   ├── GoalCard.jsx
│   │   ├── GoalList.jsx
│   │   ├── NavBar.jsx
│   │   ├── Greeting.jsx
│   │   └── ErrorToast.jsx
│   ├── pages/              # Page-level components
│   │   ├── Dashboard.jsx   # Social feed
│   │   ├── MyGoals.jsx     # Personal goals
│   │   ├── GoalDetails.jsx # Goal detail view
│   │   ├── GoalieWizard.jsx
│   │   ├── Network.jsx
│   │   └── Profile.jsx
│   ├── services/
│   │   └── goalStorage.js  # API client
│   ├── context/
│   │   └── ErrorContext.jsx
│   ├── utils/
│   │   └── dateUtils.js
│   └── App.jsx
│
├── server/                 # 🖥️ Backend Express server
│   ├── server.js           # Main server file
│   ├── swagger.js          # Swagger config
│   ├── db/                 # Database files
│   │   ├── goalie.db       # SQLite database
│   │   ├── schema.js       # DB schema
│   │   ├── migrate.js      # Data migration
│   │   └── add-status-migration.js
│   └── data/
│       └── goals.json      # Legacy backup
│
└── README.md               # This file
```

## 🔧 How It Works

### Progress Calculation
Progress is automatically calculated based on completed milestones:

**Formula:** `(Completed Milestones / Total Milestones) × 100`

Example: If you have 4 milestones and completed 3, progress = 75%

When you hit 100%, the goal automatically marks as "Completed" and a celebration modal appears! 🎉

### Status Detection
- **Behind:** Checks if ANY incomplete milestone is past its due date
- **Late:** Checks if goal's overall due date has passed
- **Late & Behind:** Both conditions are true (most urgent!)
- **On Track:** Everything on schedule
- **Completed:** All milestones done

### Data Flow
```
Frontend (React) ←→ REST API ←→ Backend (Express) ←→ SQLite Database
```

All changes are saved to SQLite with ACID transactions for data integrity.

## 🎯 Usage

### Creating a Goal
1. Click "+ Add New Goal"
2. Enter title, description, due date
3. Add steps (these become milestones)
4. Click "Create Goal"

### Tracking Progress
1. Click any goal card to view details
2. Check off milestones as you complete them
3. Progress updates automatically!

### Managing Milestones
- ✅ Check/uncheck to toggle completion
- ✏️ Edit milestone text
- 🗑️ Delete milestones
- ➕ Add new milestones anytime

## 🔮 Future Enhancements

**Completed:**
- [x] ~~Real database~~ (SQLite implemented!)
- [x] ~~Milestone due dates~~ (with automatic sorting!)
- [x] ~~Goal sharing~~ (share achievements with native API)
- [x] ~~Status tracking~~ (Behind, Late, On Track, Completed)
- [x] ~~Celebration on completion~~ (modal with confetti!)

**Planned:**
- [ ] Abandoned status (no activity for 30+ days)
- [ ] User authentication & accounts
- [ ] Multi-user support with privacy settings
- [ ] Sub-tasks for milestones
- [ ] Progress charts and analytics
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)
- [ ] Email/push notifications
- [ ] Goal templates library
- [ ] Dark mode
- [ ] Import/export goals
- [ ] Recurring goals

## 📝 License

MIT

## 👤 Author

Joey

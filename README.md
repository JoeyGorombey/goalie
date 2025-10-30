# 🥅 Goalie - Goal Tracking App

A full-stack React application for tracking goals with milestone-based progress calculation.

## 🚀 Features

- ✅ Create goals with multiple steps/milestones
- ✅ Automatic progress calculation based on completed milestones
- ✅ Interactive milestone management (add, edit, delete, check off)
- ✅ Goal CRUD operations (Create, Read, Update, Delete)
- ✅ Persistent storage via JSON file (backend)
- ✅ Beautiful, modern UI
- ✅ Responsive design

## 🏗️ Tech Stack

**Frontend:**
- React 19
- React Router
- Vite
- CSS3

**Backend:**
- Node.js
- Express.js
- File-based JSON storage (ready for DB migration)

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
├── src/                    # Frontend React app
│   ├── components/         # React components
│   │   ├── Dashboard.jsx
│   │   ├── GoalCard.jsx
│   │   ├── GoalList.jsx
│   │   ├── GoalDetails.jsx
│   │   ├── NavBar.jsx
│   │   └── Greeting.jsx
│   ├── services/
│   │   └── goalStorage.js  # API client
│   └── App.jsx
├── server/                 # Backend Express server
│   ├── server.js           # Main server file
│   ├── data/
│   │   └── goals.json      # Data storage (auto-created)
│   └── package.json
└── README.md
```

## 🔧 How It Works

### Progress Calculation
Progress is automatically calculated based on completed milestones:

**Formula:** `(Completed Milestones / Total Milestones) × 100`

Example: If you have 4 milestones and completed 3, progress = 75%

### Data Flow
```
Frontend (React) ←→ API Calls ←→ Backend (Express) ←→ goals.json file
```

Every time you create, update, or delete a goal or milestone, the entire `goals.json` file is rewritten with the updated data.

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

- [ ] User authentication
- [ ] Real database (PostgreSQL/MongoDB)
- [ ] Milestone due dates
- [ ] Sub-tasks for milestones
- [ ] Progress charts and analytics
- [ ] Goal sharing and collaboration
- [ ] Mobile app

## 📝 License

MIT

## 👤 Author

Joey

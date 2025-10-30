import NavBar from './NavBar.jsx'
import Greeting from './Greeting.jsx'
import GoalList from './GoalList.jsx'
import './Dashboard.css'

function Dashboard() {
  // Temporary hardcoded data (will come from DB later)
  const goals = [
    {
      id: 1,
      title: "Learn React Fundamentals",
      description: "Master components, props, state, and hooks to build modern web applications.",
      dueDate: "Nov 15, 2025",
      progress: 65
    },
    {
      id: 2,
      title: "Build Goalie App",
      description: "Create a full-stack goal tracking application with React and a database.",
      dueDate: "Dec 31, 2025",
      progress: 30
    },
    {
      id: 3,
      title: "Exercise 3x per week",
      description: "Maintain a consistent workout routine for better health and energy.",
      dueDate: "Ongoing",
      progress: 80
    },
    {
      id: 4,
      title: "Read 12 books this year",
      description: "Expand knowledge and improve focus by reading one book per month.",
      dueDate: "Dec 31, 2025",
      progress: 45
    }
  ]

  return (
    <div className="dashboard">
      <NavBar />
      <Greeting name="Joey" />
      <GoalList goals={goals} />
    </div>
  )
}

export default Dashboard


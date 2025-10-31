import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard.jsx'
import MyGoals from './pages/MyGoals.jsx'
import GoalDetails from './GoalDetails.jsx'
import GoalieWizard from './pages/GoalieWizard.jsx'
import Network from './pages/Network.jsx'
import Profile from './pages/Profile.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/my-goals" element={<MyGoals />} />
        <Route path="/goal/:goalId" element={<GoalDetails />} />
        <Route path="/wizard" element={<GoalieWizard />} />
        <Route path="/network" element={<Network />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

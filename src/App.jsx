import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard.jsx'
import GoalDetails from './GoalDetails.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/goal/:goalId" element={<GoalDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

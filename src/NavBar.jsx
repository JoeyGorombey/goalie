import { Link, useLocation } from 'react-router-dom'
import './NavBar.css'

function NavBar() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <h1>🥅 Goalie</h1>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/wizard" className={isActive('/wizard')}>Goalie Wizard</Link>
        <Link to="/network" className={isActive('/network')}>Network</Link>
        <Link to="/profile" className={isActive('/profile')}>Profile</Link>
      </div>
    </nav>
  )
}

export default NavBar


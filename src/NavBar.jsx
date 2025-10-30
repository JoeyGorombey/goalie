import './NavBar.css'

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>🥅 Goalie</h1>
      </div>
      <div className="navbar-links">
        <a href="#home">Home</a>
        <a href="#wizard">Goalie Wizard</a>
        <a href="#network">Network</a>
        <a href="#profile">Profile</a>
      </div>
    </nav>
  )
}

export default NavBar


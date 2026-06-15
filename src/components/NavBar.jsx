import { Link } from 'react-router-dom'
import './NavBar.css'

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/">Map</Link>
        <Link to="/about">About</Link>
        <Link to="/methodology">Methodology</Link>
      </div>
    </nav>
  )
}

export default NavBar
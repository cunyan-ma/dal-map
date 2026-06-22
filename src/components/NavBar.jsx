import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './NavBar.css'

const SECTIONS = {
  '/about': [
    { label: 'How to use', id: 'how-to-use' },
    { label: 'Background', id: 'background' },
    { label: 'Cite this work', id: 'cite' },
    { label: 'Bibliography', id: 'bibliography' },
  ],
  '/methodology': [
    { label: 'DAL BPO platforms', id: 'identify-platforms' },
    { label: 'Worker delivery centers', id: 'delivery-centers' },
    { label: 'Customers', id: 'customers' },
    { label: 'Geocoding', id: 'geocoding' },
    { label: 'Contextualize worker countries', id: 'worker-countries' },
  ],
}

function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function NavBar() {
  const location = useLocation()
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    const path = location.pathname
    if (path === '/about' || path === '/methodology') {
      setExpanded(path)
    } else {
      setExpanded(null)
    }
  }, [location.pathname])

  function handleExpandableClick(path, e) {
    if (location.pathname === path) {
      e.preventDefault()
      setExpanded(prev => (prev === path ? null : path))
    } else {
      setExpanded(path)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/">Map</Link>

        <div className="navbar-item">
          <Link to="/about" onClick={(e) => handleExpandableClick('/about', e)}>About</Link>
          {expanded === '/about' && (
            <div className="navbar-subitems">
              {SECTIONS['/about'].map(s => (
                <button key={s.id} className="navbar-subitem" onClick={() => scrollToId(s.id)}>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-item">
          <Link to="/methodology" onClick={(e) => handleExpandableClick('/methodology', e)}>Methodology</Link>
          {expanded === '/methodology' && (
            <div className="navbar-subitems">
              {SECTIONS['/methodology'].map(s => (
                <button key={s.id} className="navbar-subitem" onClick={() => scrollToId(s.id)}>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link to="/database">Database</Link>
      </div>
    </nav>
  )
}

export default NavBar

import { Link, useLocation } from 'react-router-dom'
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
  const path = location.pathname

  // Clicking the link for the page you're already on shouldn't reload the
  // route (which would briefly tear down the section list); just scroll to top.
  function handleActiveClick(targetPath, e) {
    if (path === targetPath) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/">Map</Link>

        <div className="navbar-item">
          <Link to="/about" onClick={(e) => handleActiveClick('/about', e)}>About</Link>
          {path === '/about' && (
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
          <Link to="/methodology" onClick={(e) => handleActiveClick('/methodology', e)}>Methodology</Link>
          {path === '/methodology' && (
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

        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  )
}

export default NavBar

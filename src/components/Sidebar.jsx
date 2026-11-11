import { NavLink } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { accountLinks, mainLinks } from './navLinks'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <BrandLogo size={46} />
        <nav className="nav-list" aria-label="Principal">
          {mainLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className="nav-link">
              <Icon size={19} />
              <span>{label}</span>
              <i className="nav-dot" aria-hidden="true" />
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <nav className="nav-list nav-list-bottom" aria-label="Cuenta">
          {accountLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="nav-link">
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar

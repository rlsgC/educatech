import { NavLink } from 'react-router-dom'
import { mainLinks } from './navLinks'

// Navegación inferior para el celular: siempre a mano con el pulgar.
function TabBar() {
  return (
    <nav className="rd-tabbar" aria-label="Principal">
      {mainLinks.map(({ to, short, icon: Icon }) => (
        <NavLink key={to} to={to} end={to === '/'} className="rd-tab">
          <span className="rd-tab-icon"><Icon size={21} /></span>
          <span>{short}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default TabBar

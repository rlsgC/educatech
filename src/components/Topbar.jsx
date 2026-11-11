import { Bell, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { currentProfile } from '../data/profile'
import { initialsOf } from '../utils/learning'
import { RobotMark } from './BrandLogo'

function Topbar() {
  return (
    <header className="topbar">
      <Link className="topbar-brand" to="/" aria-label="educatech, ir al inicio">
        <RobotMark size={36} />
        <strong className="brand-wordmark"><span>educa</span><span className="brand-wordmark-accent">tech</span></strong>
      </Link>
      <label className="topbar-search">
        <Search size={18} />
        <span className="sr-only">Buscar</span>
        <input type="search" placeholder="Buscar cursos, recursos o certificados" />
      </label>
      <div className="topbar-profile">
        <button className="icon-button" type="button" aria-label="Notificaciones">
          <Bell size={19} />
          <span className="topbar-bell-dot" aria-hidden="true" />
        </button>
        <Link className="avatar" to="/perfil" aria-label="Mi perfil y logros">{initialsOf(currentProfile.fullName) || currentProfile.initials}</Link>
        <div className="profile-copy">
          <strong>{currentProfile.fullName}</strong>
          <span>{currentProfile.role}</span>
        </div>
      </div>
    </header>
  )
}

export default Topbar

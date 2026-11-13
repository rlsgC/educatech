import { ChevronRight, LogOut, Trophy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { currentProfile } from '../data/profile'
import { initialsOf } from '../utils/learning'

// Menú de la cuenta: se abre tocando la inicial. En el celular es la única forma de llegar al perfil y cerrar sesión.
function AccountMenu() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const [anchor, setAnchor] = useState({ top: 0, right: 0 })
  const initials = initialsOf(currentProfile.fullName) || currentProfile.initials

  useEffect(() => {
    if (!open) return undefined
    const onKey = event => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onPointer = event => { if (!wrapRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) setOpen(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  // El menú se dibuja fuera de la barra superior para que en el celular pueda ocupar el borde inferior de la pantalla.
  const toggle = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) setAnchor({ top: rect.bottom + 10, right: window.innerWidth - rect.right })
    setOpen(value => !value)
  }

  return (
    <div className="rd-account" ref={wrapRef}>
      <button ref={buttonRef} className="avatar rd-account-btn" type="button" aria-haspopup="true" aria-expanded={open} aria-controls="account-menu" aria-label={`Tu cuenta: ${currentProfile.fullName}`} onClick={toggle}>
        {initials}
      </button>
      {open && createPortal(
        <>
          <div className="rd-account-scrim" aria-hidden="true" onClick={() => setOpen(false)} />
          <div ref={menuRef} className="rd-account-menu" id="account-menu" role="menu" aria-label="Tu cuenta" style={{ '--menu-top': `${anchor.top}px`, '--menu-right': `${anchor.right}px` }}>
            <div className="rd-account-who">
              <span className="avatar" aria-hidden="true">{initials}</span>
              <span><strong>{currentProfile.fullName}</strong><small>{currentProfile.email}</small></span>
            </div>
            <Link role="menuitem" to="/perfil" className="rd-account-item" onClick={() => setOpen(false)}><Trophy size={19} aria-hidden="true" /> Mi perfil y logros <ChevronRight size={18} aria-hidden="true" /></Link>
            <Link role="menuitem" to="/salir" className="rd-account-item is-out" onClick={() => setOpen(false)}><LogOut size={19} aria-hidden="true" /> Cerrar sesión</Link>
          </div>
        </>,
        document.body,
      )}
    </div>
  )
}

export default AccountMenu

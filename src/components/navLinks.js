import { BookOpen, Briefcase, Compass, FolderOpen, Home, LogOut, User } from 'lucide-react'

export const mainLinks = [
  { to: '/', label: 'Inicio', short: 'Inicio', icon: Home },
  { to: '/mis-cursos', label: 'Mis cursos', short: 'Mis cursos', icon: BookOpen },
  { to: '/catalogo', label: 'Catálogo de cursos', short: 'Catálogo', icon: Compass },
  { to: '/carpeta', label: 'Mi carpeta', short: 'Mi carpeta', icon: Briefcase },
  { to: '/recursos', label: 'Recursos', short: 'Recursos', icon: FolderOpen },
]

export const accountLinks = [
  { to: '/perfil', label: 'Mi perfil y logros', icon: User },
  { to: '/login', label: 'Cerrar sesión', icon: LogOut },
]

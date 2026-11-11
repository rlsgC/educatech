import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { hasSession, logout, reloadAt } from './data/account'
import MyFolder from './pages/MyFolder'
import AppLayout from './layouts/AppLayout'
import AnimatedDashboard from './pages/AnimatedDashboard'
import Catalog from './pages/Catalog'
import CourseDetail from './pages/CourseDetail'
import CourseLearn from './pages/CourseLearn'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Login from './pages/Login'
import MyCourses from './pages/MyCourses'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Resources from './pages/Resources'

// Sin sesión iniciada, la página manda al ingreso.
function RequireSession({ children }) {
  return hasSession() ? children : <Navigate to="/login" replace />
}

function Logout() {
  useEffect(() => {
    logout()
    reloadAt('/login')
  }, [])
  return null
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/salir" element={<Logout />} />
      <Route path="/cursos/:courseId/aprender" element={<RequireSession><CourseLearn /></RequireSession>} />
      <Route path="/" element={<RequireSession><AppLayout /></RequireSession>}>
        <Route index element={<Home />} />
        <Route path="inicio-anterior" element={<Dashboard />} />
        <Route path="inicio-animado" element={<AnimatedDashboard />} />
        <Route path="mis-cursos" element={<MyCourses />} />
        <Route path="catalogo" element={<Catalog />} />
        <Route path="catalogo/:courseId" element={<CourseDetail />} />
        <Route path="cursos/:courseId" element={<CourseDetail />} />
        <Route path="carpeta" element={<MyFolder />} />
        <Route path="certificados" element={<Navigate to="/carpeta" replace />} />
        <Route path="recursos" element={<Resources />} />
        <Route path="perfil" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

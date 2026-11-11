import { Navigate, Route, Routes } from 'react-router-dom'
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
import Resources from './pages/Resources'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cursos/:courseId/aprender" element={<CourseLearn />} />
      <Route path="/" element={<AppLayout />}>
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

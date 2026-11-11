import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TabBar from '../components/TabBar'
import Topbar from '../components/Topbar'

function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-shell">
        <Topbar />
        <main className="page-wrap">
          <Outlet />
        </main>
      </div>
      <TabBar />
    </div>
  )
}

export default AppLayout

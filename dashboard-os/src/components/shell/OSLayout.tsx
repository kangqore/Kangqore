import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

import { Topbar } from './Topbar'
import { NotificationPanel } from './NotificationPanel'

export function OSLayout() {
  return (
    <div className="flex h-screen bg-[#f8f9fb] overflow-hidden">
      {/* Sidebar — in-flow flex child, fills full height */}
      <Sidebar />

      {/* Content column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <NotificationPanel />
    </div>
  )
}

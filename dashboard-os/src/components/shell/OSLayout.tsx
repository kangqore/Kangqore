import { Outlet } from 'react-router-dom'
import { cn } from '@design-system/cn'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { NotificationPanel } from './NotificationPanel'
import { useUIStore } from '@store/ui'

export function OSLayout() {
  const { sidebarCollapsed } = useUIStore()

  return (
    <div className="flex h-screen bg-[#f8f9fb] overflow-hidden">
      <Sidebar />

      <div className={cn(
        'flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'ml-16' : 'ml-[260px]'
      )}>
        <Topbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden mt-16 p-6">
          <Outlet />
        </main>
      </div>

      <NotificationPanel />
    </div>
  )
}

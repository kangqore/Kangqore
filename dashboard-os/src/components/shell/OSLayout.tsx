import { Outlet } from 'react-router-dom'
import { Sidebar }           from './Sidebar'
import { Topbar }            from './Topbar'
import { NotificationPanel } from './NotificationPanel'
import { ModuleShell }       from '@components/ModuleShell'

export function OSLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-8 py-8 lg:px-12 lg:py-10 pb-16">
          <ModuleShell>
            <Outlet />
          </ModuleShell>
        </main>
      </div>

      <NotificationPanel />
    </div>
  )
}

import { Outlet } from 'react-router-dom'
import { Sidebar }           from './Sidebar'
import { Topbar }            from './Topbar'
import { SiteNav }           from './SiteNav'
import { NotificationPanel } from './NotificationPanel'
import { ModuleShell }       from '@components/ModuleShell'
import { PageTransition }    from '@components/animations/PageTransition'

export function OSLayout() {
  return (
    <div className="flex h-screen overflow-hidden pt-[7.5rem]" style={{ background: 'var(--color-surface-50)' }}>
      <SiteNav />
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-8 py-8 lg:px-12 lg:py-10 pb-16">
          <PageTransition>
            <ModuleShell>
              <Outlet />
            </ModuleShell>
          </PageTransition>
        </main>
      </div>

      <NotificationPanel />
    </div>
  )
}

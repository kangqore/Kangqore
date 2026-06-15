import { Outlet, useLocation } from 'react-router-dom'
import '../../os.css'
import { Sidebar }           from './Sidebar'
import { Topbar }            from './Topbar'
import { SiteNav }           from './SiteNav'
import { NotificationPanel } from './NotificationPanel'
import { ModuleShell }       from '@components/ModuleShell'
import { PageTransition }    from '@components/animations/PageTransition'
import { cn }                from '@design-system/cn'

// Routes that need to fill the full content area with no padding and use immersive Jarvis Mode
const JARVIS_MODE_ROUTES = ['/kangqore-view/admin/overview']

export function OSLayout() {
  const { pathname } = useLocation()
  const isJarvisMode = JARVIS_MODE_ROUTES.some(r => pathname === r)

  return (
    <div 
      className={cn("flex h-screen overflow-hidden", !isJarvisMode && "pt-[7.5rem]")} 
      style={{ background: isJarvisMode ? '#000000' : 'var(--color-surface-50)' }}
    >
      {!isJarvisMode && <SiteNav />}
      {!isJarvisMode && <Sidebar />}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {!isJarvisMode && <Topbar />}
        {isJarvisMode ? (
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <ModuleShell>
              <Outlet />
            </ModuleShell>
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto px-8 py-8 lg:px-12 lg:py-10 pb-16">
            <PageTransition>
              <ModuleShell>
                <Outlet />
              </ModuleShell>
            </PageTransition>
          </main>
        )}
      </div>

      <NotificationPanel />
    </div>
  )
}

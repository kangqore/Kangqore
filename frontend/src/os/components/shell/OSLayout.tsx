import { Outlet, useLocation } from 'react-router-dom'
import '../../os.css'
import { Sidebar }           from './Sidebar'
import { Topbar }            from './Topbar'
import { NotificationPanel } from './NotificationPanel'
import { ModuleShell }       from '@components/ModuleShell'
import { PageTransition }    from '@components/animations/PageTransition'
import { Toaster }           from '@design-system/components/Toast'
import { CommandPalette }    from './CommandPalette'
import { AmbientBackground } from './AmbientBackground'

// Routes that render in full immersive WAANDA-GUI mode (no nav/sidebar/topbar)
const WAANDA_GUI_ROUTES = ['/kangqore-view/admin/WAANDA']

export function OSLayout() {
  const { pathname } = useLocation()
  const isWaandaGUI = WAANDA_GUI_ROUTES.some(r => pathname === r)

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1121] relative text-slate-200">
      {!isWaandaGUI && <AmbientBackground />}
      {!isWaandaGUI && <Sidebar />}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-transparent m-0 md:my-2 md:mr-2 md:rounded-2xl z-10">
        {!isWaandaGUI && <Topbar />}
        {isWaandaGUI ? (
          <main className="flex-1 overflow-y-auto overflow-x-hidden !bg-black !m-0 !rounded-none !border-none">
            <ModuleShell>
              <Outlet />
            </ModuleShell>
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8 pb-16">
            <PageTransition>
              <ModuleShell>
                <Outlet />
              </ModuleShell>
            </PageTransition>
          </main>
        )}
      </div>

      <NotificationPanel />
      <Toaster />
      <CommandPalette />
    </div>
  )
}

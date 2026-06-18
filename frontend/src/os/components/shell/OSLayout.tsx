import { Outlet, useLocation } from 'react-router-dom'
import '../../os.css'
import { Sidebar }           from './Sidebar'
import { Topbar }            from './Topbar'
import { NotificationPanel } from './NotificationPanel'
import { ModuleShell }       from '@components/ModuleShell'
import { PageTransition }    from '@components/animations/PageTransition'
import { Toaster }           from '@design-system/components/Toast'
import { CommandPalette }    from './CommandPalette'

// Routes that render in full immersive WAANDA-GUI mode (no nav/sidebar/topbar)
const WAANDA_GUI_ROUTES = ['/kangqore-view/admin/WAANDA']

export function OSLayout() {
  const { pathname } = useLocation()
  const isWaandaGUI = WAANDA_GUI_ROUTES.some(r => pathname === r)

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: isWaandaGUI ? '#000000' : '#0B1121' }}
    >
      {!isWaandaGUI && <Sidebar />}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-[#0F172A] rounded-tl-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] m-0 md:my-2 md:mr-2 md:rounded-2xl border border-[#2E2854]">
        {!isWaandaGUI && <Topbar />}
        {isWaandaGUI ? (
          <main className="flex-1 overflow-y-auto overflow-x-hidden !bg-black !m-0 !rounded-none !border-none">
            <ModuleShell>
              <Outlet />
            </ModuleShell>
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8 pb-16 bg-[#0F172A]">
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

import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ExecutiveSidebar }   from './ExecutiveSidebar'
import { Topbar }             from '@components/shell/Topbar'
import { NotificationPanel }  from '@components/shell/NotificationPanel'
import { ModuleShell }        from '@components/ModuleShell'
import { PageTransition }     from '@components/animations/PageTransition'
import { AmbientBackground }  from '@components/shell/AmbientBackground'
import { Toaster }            from '@design-system/components/Toast'
import { CommandPalette }     from '@components/shell/CommandPalette'
import '../../os.css'

import { ExecutiveCommandCenter }  from './pages/ExecutiveCommandCenter'
import { ExecutiveStrategy }  from './pages/ExecutiveStrategy'
import { ExecutiveKIMMP }     from './pages/ExecutiveKIMMP'
import { ExecutiveBoard }     from './pages/ExecutiveBoard'
import RelayPage              from '@features/relay/pages/RelayPage'

export function ExecutivePortal() {
  const { pathname } = useLocation()
  const isRelay = pathname.includes('/relay')

  return (
    <div className="flex flex-col h-screen overflow-hidden relative" style={{ background: 'var(--os-bg)', color: 'var(--os-text-1)' }}>
      <AmbientBackground />
      <Topbar config={{ accentColor: '#F59E0B', label: 'Executive' }} />

      <div className="flex flex-1 min-h-0 relative z-10 w-full overflow-hidden">
        <ExecutiveSidebar />

        <div className="os-main-content flex flex-col flex-1 min-w-0 overflow-hidden m-0 md:mb-2 md:mr-2 md:rounded-2xl z-10">
        {isRelay ? (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <RelayPage />
          </div>
        ) : (
          <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8 pb-16">
            <PageTransition>
              <ModuleShell>
                <Routes>
                  <Route index              element={<ExecutiveCommandCenter />}  />
                  <Route path="strategy"   element={<ExecutiveStrategy />}  />
                  <Route path="kimmp"      element={<ExecutiveKIMMP />}     />
                  <Route path="board"      element={<ExecutiveBoard />}     />
                  <Route path="*"          element={<Navigate to="/kangqore-view/executive" replace />} />
                </Routes>
              </ModuleShell>
            </PageTransition>
          </main>
        )}
      </div>
      </div>

      <NotificationPanel />
      <Toaster />
      <CommandPalette />
    </div>
  )
}

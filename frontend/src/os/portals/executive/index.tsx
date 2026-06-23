import { Routes, Route, Navigate } from 'react-router-dom'
import { ExecutiveSidebar }   from './ExecutiveSidebar'
import { Topbar }             from '@components/shell/Topbar'
import { NotificationPanel }  from '@components/shell/NotificationPanel'
import { ModuleShell }        from '@components/ModuleShell'
import { PageTransition }     from '@components/animations/PageTransition'
import { AmbientBackground }  from '@components/shell/AmbientBackground'
import { Toaster }            from '@design-system/components/Toast'
import { CommandPalette }     from '@components/shell/CommandPalette'
import '../../os.css'

import { ExecutiveOverview }  from './pages/ExecutiveOverview'
import { ExecutiveStrategy }  from './pages/ExecutiveStrategy'
import { ExecutiveKIMMP }     from './pages/ExecutiveKIMMP'
import { ExecutiveBoard }     from './pages/ExecutiveBoard'

export function ExecutivePortal() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1121] relative text-slate-200">
      <AmbientBackground />
      <ExecutiveSidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-transparent m-0 md:my-2 md:mr-2 md:rounded-2xl z-10">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8 pb-16">
          <PageTransition>
            <ModuleShell>
              <Routes>
                <Route index              element={<ExecutiveOverview />}  />
                <Route path="strategy"   element={<ExecutiveStrategy />}  />
                <Route path="kimmp"      element={<ExecutiveKIMMP />}     />
                <Route path="board"      element={<ExecutiveBoard />}     />
                <Route path="*"          element={<Navigate to="/kangqore-view/executive" replace />} />
              </Routes>
            </ModuleShell>
          </PageTransition>
        </main>
      </div>

      <NotificationPanel />
      <Toaster />
      <CommandPalette />
    </div>
  )
}

import { Routes, Route, Navigate } from 'react-router-dom'
import { TeamSidebar }       from './TeamSidebar'
import { Topbar }            from '@components/shell/Topbar'
import { NotificationPanel } from '@components/shell/NotificationPanel'
import { ModuleShell }       from '@components/ModuleShell'
import { PageTransition }    from '@components/animations/PageTransition'
import { AmbientBackground } from '@components/shell/AmbientBackground'
import { Toaster }           from '@design-system/components/Toast'
import { CommandPalette }    from '@components/shell/CommandPalette'
import '../../os.css'

import { TeamWorkspace }    from './pages/TeamWorkspace'
import { TeamTasks }        from './pages/TeamTasks'
import { TeamAnnouncements } from './pages/TeamAnnouncements'
import { TeamResources }    from './pages/TeamResources'

export function TeamPortal() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1121] relative text-slate-200">
      <AmbientBackground />
      <TeamSidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-transparent m-0 md:my-2 md:mr-2 md:rounded-2xl z-10">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8 pb-16">
          <PageTransition>
            <ModuleShell>
              <Routes>
                <Route index                   element={<TeamWorkspace />}      />
                <Route path="tasks"            element={<TeamTasks />}          />
                <Route path="announcements"    element={<TeamAnnouncements />}  />
                <Route path="resources"        element={<TeamResources />}      />
                <Route path="*"                element={<Navigate to="/kangqore-view/team" replace />} />
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

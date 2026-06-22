import { Routes, Route, Navigate } from 'react-router-dom'
import { Users, CheckSquare, Megaphone, BookOpen } from 'lucide-react'
import { PortalNavbar }  from '../layout/PortalNavbar'
import { ModuleShell }   from '@components/ModuleShell'
import { TeamWorkspace } from './pages/TeamWorkspace'
import { TeamTasks }     from './pages/TeamTasks'
import { TeamAnnouncements } from './pages/TeamAnnouncements'
import { TeamResources } from './pages/TeamResources'

const TABS = [
  { path: '',              label: 'Workspace',     icon: Users        },
  { path: 'tasks',        label: 'My Tasks',       icon: CheckSquare  },
  { path: 'announcements', label: 'Announcements', icon: Megaphone    },
  { path: 'resources',    label: 'Resources',      icon: BookOpen     },
]

export function TeamPortal() {
  return (
    <div className="flex flex-col h-screen bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 pt-[7.5rem]">
      <PortalNavbar
        portalName="Team Portal"
        portalColor="bg-gradient-to-br from-[#c2410c] to-[#f97316]"
        tabs={TABS}
        basePath="/kangqore-view/team"
      />
      <div className="flex-1 overflow-y-auto min-h-0">
        <ModuleShell>
          <Routes>
            <Route index                   element={<TeamWorkspace />}     />
            <Route path="tasks"            element={<TeamTasks />}         />
            <Route path="announcements"    element={<TeamAnnouncements />} />
            <Route path="resources"        element={<TeamResources />}     />
            <Route path="*"                element={<Navigate to="/kangqore-view/team" replace />} />
          </Routes>
        </ModuleShell>
      </div>
    </div>
  )
}

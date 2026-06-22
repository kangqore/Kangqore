import { Routes, Route, Navigate } from 'react-router-dom'
import { LayoutDashboard, Target, Brain, BookMarked } from 'lucide-react'
import { PortalNavbar }       from '../layout/PortalNavbar'
import { ModuleShell }        from '@components/ModuleShell'
import { ExecutiveOverview }  from './pages/ExecutiveOverview'
import { ExecutiveStrategy }  from './pages/ExecutiveStrategy'
import { ExecutiveKIMMP }     from './pages/ExecutiveKIMMP'
import { ExecutiveBoard }     from './pages/ExecutiveBoard'

const TABS = [
  { path: '',         label: 'Overview',  icon: LayoutDashboard },
  { path: 'strategy', label: 'Strategy',  icon: Target           },
  { path: 'kimmp',    label: 'KIMMP',     icon: Brain            },
  { path: 'board',    label: 'Board',     icon: BookMarked       },
]

export function ExecutivePortal() {
  return (
    <div className="flex flex-col h-screen bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 pt-[7.5rem]">
      <PortalNavbar
        portalName="Executive Suite"
        portalColor="bg-gradient-to-br from-[#4338ca] to-[#6366f1]"
        tabs={TABS}
        basePath="/kangqore-view/executive"
      />
      <div className="flex-1 overflow-y-auto min-h-0">
        <ModuleShell>
          <Routes>
            <Route index              element={<ExecutiveOverview />}  />
            <Route path="strategy"   element={<ExecutiveStrategy />}  />
            <Route path="kimmp"      element={<ExecutiveKIMMP />}     />
            <Route path="board"      element={<ExecutiveBoard />}     />
            <Route path="*"          element={<Navigate to="/kangqore-view/executive" replace />} />
          </Routes>
        </ModuleShell>
      </div>
    </div>
  )
}

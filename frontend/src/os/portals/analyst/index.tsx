import { Routes, Route, Navigate } from 'react-router-dom'
import { LineChart, FileBarChart, BarChart2 } from 'lucide-react'
import { PortalNavbar }   from '../layout/PortalNavbar'
import { ModuleShell }    from '@components/ModuleShell'
import { AnalystHome }    from './pages/AnalystHome'
import { AnalystReports } from './pages/AnalystReports'
import { AnalystMetrics } from './pages/AnalystMetrics'

const TABS = [
  { path: '',        label: 'Overview', icon: LineChart    },
  { path: 'reports', label: 'Reports',  icon: FileBarChart },
  { path: 'metrics', label: 'Metrics',  icon: BarChart2    },
]

import { AmbientBackground } from '../../components/shell/AmbientBackground'

export function AnalystPortal() {
  return (
    <div className="flex flex-col h-screen bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 pt-[7.5rem]">
      <PortalNavbar
        portalName="Analyst Portal"
        portalColor="bg-gradient-to-br from-[#0e7490] to-[#22d3ee]"
        tabs={TABS}
        basePath="/kangqore-view/analyst"
      />
      <div className="flex-1 overflow-y-auto min-h-0">
        <ModuleShell>
          <Routes>
            <Route index          element={<AnalystHome />}    />
            <Route path="reports" element={<AnalystReports />} />
            <Route path="metrics" element={<AnalystMetrics />} />
            <Route path="*"       element={<Navigate to="/kangqore-view/analyst" replace />} />
          </Routes>
        </ModuleShell>
      </div>
    </div>
  )
}

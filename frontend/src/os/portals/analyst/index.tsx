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

export function AnalystPortal() {
  return (
    <div className="flex flex-col h-screen bg-os-s1 pt-[7.5rem]">
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

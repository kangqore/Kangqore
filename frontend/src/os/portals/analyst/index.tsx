import { Routes, Route, Navigate } from 'react-router-dom'
import { LineChart, FileBarChart, BarChart2, MessageSquare } from 'lucide-react'
import { PortalNavbar }   from '../layout/PortalNavbar'
import { ModuleShell }    from '@components/ModuleShell'
import { AnalystHome }    from './pages/AnalystHome'
import { AnalystReports } from './pages/AnalystReports'
import { AnalystMetrics } from './pages/AnalystMetrics'
import RelayPage          from '@features/relay/pages/RelayPage'

const TABS = [
  { path: '',        label: 'Overview', icon: LineChart    },
  { path: 'reports', label: 'Reports',  icon: FileBarChart },
  { path: 'metrics', label: 'Metrics',  icon: BarChart2    },
  { path: 'relay',   label: 'RELAY',    icon: MessageSquare },
]

export function AnalystPortal() {
  return (
    <div className="os-main-content flex flex-col h-screen" style={{ background: 'var(--os-bg)', color: 'var(--os-text-1)' }}>
      <PortalNavbar
        portalName="Analyst Portal"
        portalColor="bg-gradient-to-br from-[#0e7490] to-[#22d3ee]"
        tabs={TABS}
        basePath="/kangqore-view/analyst"
      />
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <ModuleShell>
          <Routes>
            <Route index          element={<AnalystHome />}    />
            <Route path="reports" element={<AnalystReports />} />
            <Route path="metrics" element={<AnalystMetrics />} />
            <Route path="relay/*" element={<RelayPage />}      />
            <Route path="*"       element={<Navigate to="/kangqore-view/analyst" replace />} />
          </Routes>
        </ModuleShell>
      </div>
    </div>
  )
}

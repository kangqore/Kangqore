import { Routes, Route, Navigate } from 'react-router-dom'
import { LayoutGrid, CheckSquare, DollarSign } from 'lucide-react'
import { PortalNavbar }  from '../layout/PortalNavbar'
import { ModuleShell }  from '@components/ModuleShell'
import { PartnerDashboard }  from './pages/PartnerDashboard'
import { PartnerTasks }      from './pages/PartnerTasks'
import { PartnerEarnings }   from './pages/PartnerEarnings'

const TABS = [
  { path: '',         label: 'Dashboard', icon: LayoutGrid  },
  { path: 'tasks',    label: 'Tasks',     icon: CheckSquare },
  { path: 'earnings', label: 'Earnings',  icon: DollarSign  },
]

export function PartnerPortal() {
  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <PortalNavbar
        portalName="Partner Portal"
        portalColor="bg-gradient-to-br from-[#059669] to-[#34d399]"
        tabs={TABS}
        basePath="/portal/partner"
      />
      <div className="flex-1 overflow-y-auto min-h-0">
      <ModuleShell>
      <Routes>
        <Route index           element={<PartnerDashboard />} />
        <Route path="tasks"    element={<PartnerTasks />}     />
        <Route path="earnings" element={<PartnerEarnings />}  />
        <Route path="*"        element={<Navigate to="/portal/partner" replace />} />
      </Routes>
      </ModuleShell>
      </div>
    </div>
  )
}

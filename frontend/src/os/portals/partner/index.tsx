import { Routes, Route, Navigate } from 'react-router-dom'
import { LayoutGrid, CheckSquare, DollarSign, Briefcase, Package, Calendar, FolderOpen } from 'lucide-react'
import { PortalNavbar }        from '../layout/PortalNavbar'
import { ModuleShell }         from '@components/ModuleShell'
import { PartnerDashboard }    from './pages/PartnerDashboard'
import { PartnerTasks }        from './pages/PartnerTasks'
import { PartnerEarnings }     from './pages/PartnerEarnings'
import { PartnerProjects }     from './pages/PartnerProjects'
import { PartnerDeliverables } from './pages/PartnerDeliverables'
import { PartnerMeetings }     from './pages/PartnerMeetings'
import { PartnerDocuments }    from './pages/PartnerDocuments'

const TABS = [
  { path: '',             label: 'Dashboard',    icon: LayoutGrid  },
  { path: 'projects',     label: 'Projects',     icon: Briefcase   },
  { path: 'tasks',        label: 'Tasks',        icon: CheckSquare },
  { path: 'deliverables', label: 'Deliverables', icon: Package     },
  { path: 'meetings',     label: 'Meetings',     icon: Calendar    },
  { path: 'documents',    label: 'Documents',    icon: FolderOpen  },
  { path: 'earnings',     label: 'Earnings',     icon: DollarSign  },
]

export function PartnerPortal() {
  return (
    <div className="flex flex-col h-screen bg-[#151C2F] pt-[7.5rem]">
      <PortalNavbar
        portalName="Partner Portal"
        portalColor="bg-gradient-to-br from-[#059669] to-[#34d399]"
        tabs={TABS}
        basePath="/kangqore-view/partner"
      />
      <div className="flex-1 overflow-y-auto min-h-0">
        <ModuleShell>
          <Routes>
            <Route index                 element={<PartnerDashboard />}    />
            <Route path="projects"       element={<PartnerProjects />}     />
            <Route path="tasks"          element={<PartnerTasks />}        />
            <Route path="deliverables"   element={<PartnerDeliverables />} />
            <Route path="meetings"       element={<PartnerMeetings />}     />
            <Route path="documents"      element={<PartnerDocuments />}    />
            <Route path="earnings"       element={<PartnerEarnings />}     />
            <Route path="*"              element={<Navigate to="/kangqore-view/partner" replace />} />
          </Routes>
        </ModuleShell>
      </div>
    </div>
  )
}

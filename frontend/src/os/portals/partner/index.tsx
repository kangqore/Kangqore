import { Routes, Route, Navigate } from 'react-router-dom'
import { LayoutGrid, CheckSquare, DollarSign, Briefcase, Package, Calendar, FolderOpen, MessageSquare, Brain } from 'lucide-react'
import { PortalNavbar }        from '../layout/PortalNavbar'
import { ModuleShell }         from '@components/ModuleShell'
import { PartnerDashboard }    from './pages/PartnerDashboard'
import { PartnerTasks }        from './pages/PartnerTasks'
import { PartnerEarnings }     from './pages/PartnerEarnings'
import { PartnerProjects }     from './pages/PartnerProjects'
import { PartnerDeliverables } from './pages/PartnerDeliverables'
import { PartnerMeetings }     from './pages/PartnerMeetings'
import { PartnerDocuments }    from './pages/PartnerDocuments'
import { PartnerComms }        from './pages/PartnerComms'
import { PartnerWaanda }       from './pages/PartnerWaanda'
import type { PortalNotif }    from '../layout/PortalNavbar'

const TABS = [
  { path: '',             label: 'Dashboard',    icon: LayoutGrid   },
  { path: 'projects',     label: 'Projects',     icon: Briefcase    },
  { path: 'tasks',        label: 'Tasks',        icon: CheckSquare  },
  { path: 'deliverables', label: 'Deliverables', icon: Package      },
  { path: 'meetings',     label: 'Meetings',     icon: Calendar     },
  { path: 'documents',    label: 'Documents',    icon: FolderOpen   },
  { path: 'earnings',     label: 'Earnings',     icon: DollarSign   },
  { path: 'comms',        label: 'Messages',     icon: MessageSquare},
  { path: 'waanda',       label: 'WAANDA',       icon: Brain        },
]

const PARTNER_NOTIFICATIONS: PortalNotif[] = [
  {
    id: 'pn1',
    type: 'payment',
    title: 'Invoice INV-P-041 processed — ₹4.2L',
    body: 'Payment will be credited to your account within 3–5 business days. Reference: KQ-PAY-20260620.',
    read: false,
    time: '2 days ago',
  },
  {
    id: 'pn2',
    type: 'info',
    title: 'Sprint 14 review scheduled for June 24',
    body: 'Please confirm your availability and share the deliverable summary by June 23 EOD.',
    read: false,
    time: '3 days ago',
  },
  {
    id: 'pn3',
    type: 'success',
    title: 'Promoted to Platinum Partner status',
    body: 'Effective July 1, 2026. Priority project allocation and 5% rate increase on new engagements.',
    read: true,
    time: '1 week ago',
  },
  {
    id: 'pn4',
    type: 'info',
    title: 'New project opportunity — TechCorp AI',
    body: 'A 12-week enterprise AI engagement matches your skill profile. Starting July 14, budget ₹8.4L.',
    read: false,
    time: '4 days ago',
  },
]

export function PartnerPortal() {
  return (
    <div className="flex flex-col h-screen bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 pt-[7.5rem]">
      <PortalNavbar
        portalName="Partner Portal"
        portalColor="bg-gradient-to-br from-[#059669] to-[#34d399]"
        accent="#00c875"
        tabs={TABS}
        basePath="/kangqore-view/partner"
        notifications={PARTNER_NOTIFICATIONS}
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
            <Route path="comms"          element={<PartnerComms />}        />
            <Route path="waanda"         element={<PartnerWaanda />}       />
            <Route path="*"              element={<Navigate to="/kangqore-view/partner" replace />} />
          </Routes>
        </ModuleShell>
      </div>
    </div>
  )
}

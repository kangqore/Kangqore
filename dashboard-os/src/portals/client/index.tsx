import { Routes, Route, Navigate } from 'react-router-dom'
import {
  LayoutGrid, FolderOpen, FileText, Briefcase,
  Calendar, CheckSquare, Headphones, GitPullRequest,
  MessageSquare, BarChart2,
} from 'lucide-react'
import { PortalNavbar }            from '../layout/PortalNavbar'
import { ModuleShell }             from '@components/ModuleShell'
import { ClientDashboard }         from './pages/ClientDashboard'
import { ClientProjects }          from './pages/ClientProjects'
import { ClientInvoices }          from './pages/ClientInvoices'
import { ClientDocuments }         from './pages/ClientDocuments'
import { ClientMeetings }          from './pages/ClientMeetings'
import { ClientTasks }             from './pages/ClientTasks'
import { ClientSupport }           from './pages/ClientSupport'
import { ClientChangeRequests }    from './pages/ClientChangeRequests'
import { ClientFeedback }          from './pages/ClientFeedback'
import { ClientExecutiveReport }   from './pages/ClientExecutiveReport'

const TABS = [
  { path: '',               label: 'Dashboard',    icon: LayoutGrid      },
  { path: 'projects',       label: 'Projects',     icon: Briefcase       },
  { path: 'meetings',       label: 'Meetings',     icon: Calendar        },
  { path: 'tasks',          label: 'Tasks',        icon: CheckSquare     },
  { path: 'support',        label: 'Support',      icon: Headphones      },
  { path: 'change-requests',label: 'Changes',      icon: GitPullRequest  },
  { path: 'feedback',       label: 'Feedback',     icon: MessageSquare   },
  { path: 'invoices',       label: 'Invoices',     icon: FileText        },
  { path: 'documents',      label: 'Documents',    icon: FolderOpen      },
  { path: 'report',         label: 'Report',       icon: BarChart2       },
]

export function ClientPortal() {
  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <PortalNavbar
        portalName="Client Portal"
        portalColor="bg-gradient-to-br from-[#2564ea] to-[#4ab6d4]"
        tabs={TABS}
        basePath="/portal/client"
      />
      <div className="flex-1 overflow-y-auto min-h-0">
        <ModuleShell>
          <Routes>
            <Route index                     element={<ClientDashboard />}       />
            <Route path="projects"           element={<ClientProjects />}        />
            <Route path="meetings"           element={<ClientMeetings />}        />
            <Route path="tasks"              element={<ClientTasks />}           />
            <Route path="support"            element={<ClientSupport />}         />
            <Route path="change-requests"    element={<ClientChangeRequests />}  />
            <Route path="feedback"           element={<ClientFeedback />}        />
            <Route path="invoices"           element={<ClientInvoices />}        />
            <Route path="documents"          element={<ClientDocuments />}       />
            <Route path="report"             element={<ClientExecutiveReport />} />
            <Route path="*"                  element={<Navigate to="/portal/client" replace />} />
          </Routes>
        </ModuleShell>
      </div>
    </div>
  )
}

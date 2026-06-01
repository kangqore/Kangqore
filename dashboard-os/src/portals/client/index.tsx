import { Routes, Route, Navigate } from 'react-router-dom'
import { LayoutGrid, FolderOpen, FileText, Briefcase } from 'lucide-react'
import { PortalNavbar } from '../layout/PortalNavbar'
import { ClientDashboard } from './pages/ClientDashboard'
import { ClientProjects }  from './pages/ClientProjects'
import { ClientInvoices }  from './pages/ClientInvoices'
import { ClientDocuments } from './pages/ClientDocuments'

const TABS = [
  { path: '',          label: 'Dashboard', icon: LayoutGrid  },
  { path: 'projects',  label: 'Projects',  icon: Briefcase   },
  { path: 'invoices',  label: 'Invoices',  icon: FileText    },
  { path: 'documents', label: 'Documents', icon: FolderOpen  },
]

export function ClientPortal() {
  return (
    <div className="flex flex-col h-screen bg-[#f8f9fb] overflow-hidden">
      <PortalNavbar
        portalName="Client Portal"
        portalColor="bg-gradient-to-br from-[#2564ea] to-[#4ab6d4]"
        tabs={TABS}
        basePath="/portal/client"
      />
      <Routes>
        <Route index           element={<ClientDashboard />} />
        <Route path="projects" element={<ClientProjects />}  />
        <Route path="invoices" element={<ClientInvoices />}  />
        <Route path="documents"element={<ClientDocuments />} />
        <Route path="*"        element={<Navigate to="/portal/client" replace />} />
      </Routes>
    </div>
  )
}

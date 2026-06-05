import { Routes, Route, Navigate } from 'react-router-dom'
import { Briefcase, ClipboardList, Calendar, MessageSquare, FolderOpen, User } from 'lucide-react'
import { PortalNavbar }        from '../layout/PortalNavbar'
import { ModuleShell }         from '@components/ModuleShell'
import { CareersHome }         from './pages/CareersHome'
import { MyApplication }       from './pages/MyApplication'
import { CareersInterviews }   from './pages/CareersInterviews'
import { CareersMessages }     from './pages/CareersMessages'
import { CareersDocuments }    from './pages/CareersDocuments'
import { CareersPortfolio }    from './pages/CareersPortfolio'

const TABS = [
  { path: '',               label: 'Open Roles',    icon: Briefcase     },
  { path: 'my-application', label: 'My Application',icon: ClipboardList },
  { path: 'interviews',     label: 'Interviews',    icon: Calendar      },
  { path: 'messages',       label: 'Messages',      icon: MessageSquare },
  { path: 'documents',      label: 'Documents',     icon: FolderOpen    },
  { path: 'portfolio',      label: 'Portfolio',     icon: User          },
]

export function CareersPortal() {
  return (
    <div className="flex flex-col h-screen bg-slate-100 pt-[7.5rem]">
      <PortalNavbar
        portalName="Careers"
        portalColor="bg-gradient-to-br from-[#d97706] to-[#fbbf24]"
        tabs={TABS}
        basePath="/portal/careers"
      />
      <div className="flex-1 overflow-y-auto min-h-0">
        <ModuleShell>
          <Routes>
            <Route index                   element={<CareersHome />}       />
            <Route path="my-application"   element={<MyApplication />}     />
            <Route path="interviews"       element={<CareersInterviews />} />
            <Route path="messages"         element={<CareersMessages />}   />
            <Route path="documents"        element={<CareersDocuments />}  />
            <Route path="portfolio"        element={<CareersPortfolio />}  />
            <Route path="*"                element={<Navigate to="/portal/careers" replace />} />
          </Routes>
        </ModuleShell>
      </div>
    </div>
  )
}

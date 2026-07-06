import { Routes, Route, Navigate } from 'react-router-dom'
import { Briefcase, ClipboardList, Calendar, MessageSquare, FolderOpen, User, Hash } from 'lucide-react'
import RelayPage from '@features/relay/pages/RelayPage'
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
  { path: 'relay',          label: 'RELAY',         icon: Hash          },
]

export function CareersPortal() {
  return (
    <div className="os-main-content flex flex-col h-screen" style={{ background: 'var(--os-bg)', color: 'var(--os-text-1)' }}>
      <PortalNavbar
        portalName="Careers"
        portalColor="bg-gradient-to-br from-[#d97706] to-[#fbbf24]"
        tabs={TABS}
        basePath="/kangqore-view/careers"
      />
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <ModuleShell>
          <Routes>
            <Route index                   element={<CareersHome />}       />
            <Route path="my-application"   element={<MyApplication />}     />
            <Route path="interviews"       element={<CareersInterviews />} />
            <Route path="messages"         element={<CareersMessages />}   />
            <Route path="documents"        element={<CareersDocuments />}  />
            <Route path="portfolio"        element={<CareersPortfolio />}  />
            <Route path="relay/*"          element={<RelayPage />}         />
            <Route path="*"                element={<Navigate to="/kangqore-view/careers" replace />} />
          </Routes>
        </ModuleShell>
      </div>
    </div>
  )
}

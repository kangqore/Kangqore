import { Routes, Route, Navigate } from 'react-router-dom'
import { Briefcase, ClipboardList } from 'lucide-react'
import { PortalNavbar }  from '../layout/PortalNavbar'
import { ModuleShell }  from '@components/ModuleShell'
import { CareersHome }    from './pages/CareersHome'
import { MyApplication }  from './pages/MyApplication'

const TABS = [
  { path: '',              label: 'Open Roles',      icon: Briefcase     },
  { path: 'my-application',label: 'My Application',  icon: ClipboardList },
]

export function CareersPortal() {
  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <PortalNavbar
        portalName="Careers"
        portalColor="bg-gradient-to-br from-[#d97706] to-[#fbbf24]"
        tabs={TABS}
        basePath="/portal/careers"
      />
      <div className="flex-1 overflow-y-auto min-h-0">
      <ModuleShell>
      <Routes>
        <Route index                   element={<CareersHome />}    />
        <Route path="my-application"   element={<MyApplication />}  />
        <Route path="*"                element={<Navigate to="/portal/careers" replace />} />
      </Routes>
      </ModuleShell>
      </div>
    </div>
  )
}

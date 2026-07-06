import { Routes, Route, Navigate } from 'react-router-dom'
import { Newspaper, Download, ExternalLink, MessageSquare } from 'lucide-react'
import { PortalNavbar }       from '../layout/PortalNavbar'
import { ModuleShell }        from '@components/ModuleShell'
import { JournalistHome }     from './pages/JournalistHome'
import { JournalistAssets }   from './pages/JournalistAssets'
import { JournalistCoverage } from './pages/JournalistCoverage'
import RelayPage              from '@features/relay/pages/RelayPage'

const TABS = [
  { path: '',         label: 'Press Hub', icon: Newspaper     },
  { path: 'assets',   label: 'Assets',    icon: Download      },
  { path: 'coverage', label: 'Coverage',  icon: ExternalLink  },
  { path: 'relay',    label: 'RELAY',     icon: MessageSquare },
]

export function JournalistPortal() {
  return (
    <div className="os-main-content flex flex-col h-screen" style={{ background: 'var(--os-bg)', color: 'var(--os-text-1)' }}>
      <PortalNavbar
        portalName="Press Portal"
        portalColor="bg-gradient-to-br from-[#be185d] to-[#f472b6]"
        tabs={TABS}
        basePath="/kangqore-view/journalist"
      />
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <ModuleShell>
          <Routes>
            <Route index            element={<JournalistHome />}     />
            <Route path="assets"    element={<JournalistAssets />}   />
            <Route path="coverage"  element={<JournalistCoverage />} />
            <Route path="relay/*"   element={<RelayPage />}          />
            <Route path="*"         element={<Navigate to="/kangqore-view/journalist" replace />} />
          </Routes>
        </ModuleShell>
      </div>
    </div>
  )
}

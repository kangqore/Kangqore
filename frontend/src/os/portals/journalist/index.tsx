import { Routes, Route, Navigate } from 'react-router-dom'
import { Newspaper, Download, ExternalLink } from 'lucide-react'
import { PortalNavbar }       from '../layout/PortalNavbar'
import { ModuleShell }        from '@components/ModuleShell'
import { JournalistHome }     from './pages/JournalistHome'
import { JournalistAssets }   from './pages/JournalistAssets'
import { JournalistCoverage } from './pages/JournalistCoverage'

const TABS = [
  { path: '',         label: 'Press Hub', icon: Newspaper    },
  { path: 'assets',   label: 'Assets',    icon: Download     },
  { path: 'coverage', label: 'Coverage',  icon: ExternalLink },
]

export function JournalistPortal() {
  return (
    <div className="flex flex-col h-screen bg-os-s1 pt-[7.5rem]">
      <PortalNavbar
        portalName="Press Portal"
        portalColor="bg-gradient-to-br from-[#be185d] to-[#f472b6]"
        tabs={TABS}
        basePath="/kangqore-view/journalist"
      />
      <div className="flex-1 overflow-y-auto min-h-0">
        <ModuleShell>
          <Routes>
            <Route index            element={<JournalistHome />}     />
            <Route path="assets"    element={<JournalistAssets />}   />
            <Route path="coverage"  element={<JournalistCoverage />} />
            <Route path="*"         element={<Navigate to="/kangqore-view/journalist" replace />} />
          </Routes>
        </ModuleShell>
      </div>
    </div>
  )
}

import { Routes, Route, Navigate } from 'react-router-dom'
import { LayoutGrid, Send, PieChart } from 'lucide-react'
import { PortalNavbar }           from '../layout/PortalNavbar'
import { InvestorHome }           from './pages/InvestorHome'
import { InvestorUpdatesPortal }  from './pages/InvestorUpdatesPortal'
import { CapTablePage }           from '@features/investors/pages/CapTablePage'

const TABS = [
  { path: '',         label: 'Overview',  icon: LayoutGrid },
  { path: 'updates',  label: 'Updates',   icon: Send       },
  { path: 'captable', label: 'Cap Table', icon: PieChart   },
]

export function InvestorPortal() {
  return (
    <div className="flex flex-col h-screen bg-[#f8f9fb] overflow-hidden">
      <PortalNavbar
        portalName="Investor Portal"
        portalColor="bg-gradient-to-br from-[#7c3aed] to-[#a78bfa]"
        tabs={TABS}
        basePath="/portal/investor"
      />
      <Routes>
        <Route index           element={<InvestorHome />}          />
        <Route path="updates"  element={<div className="flex-1 overflow-y-auto"><InvestorUpdatesPortal /></div>} />
        <Route path="captable" element={<div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8"><CapTablePage /></div>} />
        <Route path="*"        element={<Navigate to="/portal/investor" replace />} />
      </Routes>
    </div>
  )
}

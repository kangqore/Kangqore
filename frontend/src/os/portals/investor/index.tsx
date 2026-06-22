import { Routes, Route, Navigate } from 'react-router-dom'
import { LayoutGrid, Send, PieChart, Calendar, FolderOpen, BarChart2, Brain } from 'lucide-react'
import { PortalNavbar }           from '../layout/PortalNavbar'
import { ModuleShell }            from '@components/ModuleShell'
import { InvestorHome }           from './pages/InvestorHome'
import { InvestorUpdatesPortal }  from './pages/InvestorUpdatesPortal'
import { InvestorMeetings }       from './pages/InvestorMeetings'
import { InvestorDocuments }      from './pages/InvestorDocuments'
import { InvestorReports }        from './pages/InvestorReports'
import { InvestorWaanda }         from './pages/InvestorWaanda'
import { CapTablePage }           from '@features/investors/pages/CapTablePage'
import type { PortalNotif }       from '../layout/PortalNavbar'

const TABS = [
  { path: '',         label: 'Overview',  icon: LayoutGrid },
  { path: 'updates',  label: 'Updates',   icon: Send       },
  { path: 'reports',  label: 'Reports',   icon: BarChart2  },
  { path: 'meetings', label: 'Meetings',  icon: Calendar   },
  { path: 'documents',label: 'Data Room', icon: FolderOpen },
  { path: 'captable', label: 'Cap Table', icon: PieChart   },
  { path: 'waanda',   label: 'WAANDA',    icon: Brain      },
]

const INVESTOR_NOTIFICATIONS: PortalNotif[] = [
  {
    id: 'in1',
    type: 'info',
    title: 'May 2026 investor update available',
    body: 'MRR up 14.2% MoM. ARR trajectory ahead of schedule by 8 weeks. Full update in the Updates tab.',
    read: false,
    time: '5 days ago',
  },
  {
    id: 'in2',
    type: 'success',
    title: 'ARR milestone crossed — £500k',
    body: 'Kangqore passed the £500k ARR threshold on June 17, 2026. Enterprise cohort drove 61% of growth.',
    read: false,
    time: '6 days ago',
  },
  {
    id: 'in3',
    type: 'info',
    title: 'Board call scheduled for July 3',
    body: 'Series A timeline and Q3 hiring plan on the agenda. Dial-in details will be sent 48h in advance.',
    read: true,
    time: '1 week ago',
  },
]

export function InvestorPortal() {
  return (
    <div className="flex flex-col h-screen bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 pt-[7.5rem]">
      <PortalNavbar
        portalName="Investor Portal"
        portalColor="bg-gradient-to-br from-[#7c3aed] to-[#a78bfa]"
        accent="#7f53f9"
        tabs={TABS}
        basePath="/kangqore-view/investor"
        notifications={INVESTOR_NOTIFICATIONS}
      />
      <div className="flex-1 overflow-y-auto min-h-0">
        <ModuleShell>
          <Routes>
            <Route index              element={<InvestorHome />}          />
            <Route path="updates"     element={<InvestorUpdatesPortal />} />
            <Route path="reports"     element={<InvestorReports />}       />
            <Route path="meetings"    element={<InvestorMeetings />}      />
            <Route path="documents"   element={<InvestorDocuments />}     />
            <Route path="captable"    element={<div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto"><CapTablePage /></div>} />
            <Route path="waanda"      element={<InvestorWaanda />}        />
            <Route path="*"           element={<Navigate to="/kangqore-view/investor" replace />} />
          </Routes>
        </ModuleShell>
      </div>
    </div>
  )
}

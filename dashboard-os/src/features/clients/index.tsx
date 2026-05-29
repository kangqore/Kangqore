import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { LayoutGrid, UserCircle, Truck, Shield, BookOpen } from 'lucide-react'
import { cn } from '@design-system/cn'
import { ClientsOverview }  from './pages/ClientsOverview'
import { ClientProfile }    from './pages/ClientProfile'
import { DeliveryTracking } from './pages/DeliveryTracking'
import { SLADashboard }     from './pages/SLADashboard'
import { GovernancePage }   from './pages/GovernancePage'

const TABS = [
  { path: '',           label: 'Overview',  icon: LayoutGrid  },
  { path: 'profile',    label: 'Profile',   icon: UserCircle  },
  { path: 'delivery',   label: 'Delivery',  icon: Truck       },
  { path: 'sla',        label: 'SLA',       icon: Shield      },
  { path: 'governance', label: 'Governance',icon: BookOpen    },
]

export function ClientsModule() {
  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/os/clients' : `/os/clients/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
              isActive
                ? 'border-[#2564ea] text-[#2564ea]'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>
      <Routes>
        <Route index              element={<ClientsOverview />}  />
        <Route path="profile"     element={<ClientProfile />}    />
        <Route path="delivery"    element={<DeliveryTracking />} />
        <Route path="sla"         element={<SLADashboard />}     />
        <Route path="governance"  element={<GovernancePage />}   />
        <Route path="*"           element={<Navigate to="/os/clients" replace />} />
      </Routes>
    </div>
  )
}

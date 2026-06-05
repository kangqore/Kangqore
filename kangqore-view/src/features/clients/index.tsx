import { useEffect } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery }   from '@tanstack/react-query'
import { LayoutGrid, UserCircle, Truck, Shield, BookOpen } from 'lucide-react'
import { cn }         from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useClientsStore } from './store'
import type { Client, Contact } from './types'
import { ClientsOverview }  from './pages/ClientsOverview'
import { ClientProfile }    from './pages/ClientProfile'
import { DeliveryTracking } from './pages/DeliveryTracking'
import { SLADashboard }     from './pages/SLADashboard'
import { GovernancePage }   from './pages/GovernancePage'

const TABS = [
  { path: '',           label: 'Overview',   icon: LayoutGrid  },
  { path: 'profile',    label: 'Profile',    icon: UserCircle  },
  { path: 'delivery',   label: 'Delivery',   icon: Truck       },
  { path: 'sla',        label: 'SLA',        icon: Shield      },
  { path: 'governance', label: 'Governance', icon: BookOpen    },
]

function toContact(r: Record<string, unknown>, clientId: string): Contact {
  return {
    id:        String(r.id ?? ''),
    clientId,
    name:      String(r.name ?? ''),
    role:      String(r.role ?? ''),
    email:     String(r.email ?? ''),
    phone:     r.phone ? String(r.phone) : undefined,
    isPrimary: Boolean(r.isPrimary),
  }
}

function toClient(r: Record<string, unknown>): Client {
  const id       = String(r.id ?? '')
  const contacts = Array.isArray(r.contacts)
    ? (r.contacts as Record<string, unknown>[]).map(c => toContact(c, id))
    : []

  return {
    id,
    name:              String(r.name ?? ''),
    industry:          String(r.industry ?? ''),
    country:           String(r.country  ?? ''),
    tier:              (r.tier   as Client['tier'])   ?? 'standard',
    status:            (r.status as Client['status']) ?? 'active',
    health:            (r.health as Client['health']) ?? 'good',
    arr:               Number(r.arr ?? 0),
    contractStart:     r.contractStart ? String(r.contractStart).slice(0, 10) : '',
    contractEnd:       r.contractEnd   ? String(r.contractEnd).slice(0, 10)   : '',
    owner:             String(r.accountManager ?? ''),
    contacts,
    projectIds:        Array.isArray(r.projectIds) ? r.projectIds as string[] : [],
    satisfactionScore: Number(r.satisfactionScore ?? 0),
    lastActivity:      r.updatedAt ? String(r.updatedAt).slice(0, 10) : '',
    description:       String(r.description ?? ''),
    logo:              String(r.logo ?? r.name?.toString().slice(0, 2).toUpperCase() ?? ''),
  }
}

export function ClientsModule() {
  const { hydrate } = useClientsStore()

  const { data } = useQuery({
    queryKey:  ['admin', 'crm', 'clients'],
    queryFn:   () => api.get('/admin/crm/clients').then(r => r.data.clients ?? []),
    enabled:   !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (data?.length) hydrate((data as Record<string, unknown>[]).map(toClient))
  }, [data, hydrate])

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

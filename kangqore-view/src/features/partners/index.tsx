import { useEffect } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery }  from '@tanstack/react-query'
import { LayoutGrid, UserCircle, CheckSquare, DollarSign } from 'lucide-react'
import { cn }        from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { usePartnersStore } from './store'
import type { Partner, PartnerContact } from './types'
import { PartnersOverview } from './pages/PartnersOverview'
import { PartnerProfile }   from './pages/PartnerProfile'
import { TasksPage }        from './pages/TasksPage'
import { EarningsPage }     from './pages/EarningsPage'

const TABS = [
  { path: '',         label: 'Overview', icon: LayoutGrid  },
  { path: 'profile',  label: 'Profile',  icon: UserCircle  },
  { path: 'tasks',    label: 'Tasks',    icon: CheckSquare },
  { path: 'earnings', label: 'Earnings', icon: DollarSign  },
]

function toPartner(r: Record<string, unknown>): Partner {
  const contact: PartnerContact = {
    name:  String(r.contactName  ?? ''),
    role:  String(r.contactRole  ?? ''),
    email: String(r.contactEmail ?? ''),
    phone: r.contactPhone ? String(r.contactPhone) : undefined,
  }
  return {
    id:                String(r.id ?? ''),
    name:              String(r.name ?? ''),
    type:              (r.type   as Partner['type'])   ?? 'agency',
    tier:              (r.tier   as Partner['tier'])   ?? 'associate',
    status:            (r.status as Partner['status']) ?? 'active',
    country:           String(r.country ?? ''),
    specialisms:       Array.isArray(r.specialisms) ? r.specialisms as string[] : [],
    rating:            Number(r.rating ?? 0),
    projectIds:        Array.isArray(r.projectIds) ? r.projectIds as string[] : [],
    contact,
    joinDate:          r.joinDate ? String(r.joinDate).slice(0, 10) : '',
    totalEarned:       Number(r.totalEarned       ?? 0),
    pendingPayment:    Number(r.pendingPayment     ?? 0),
    activeTasks:       Number(r.activeTasks        ?? 0),
    completedProjects: Number(r.completedProjects  ?? 0),
    description:       String(r.description ?? ''),
    logo:              String(r.logo ?? String(r.name ?? '').slice(0, 2).toUpperCase()),
    hourlyRate:        Number(r.hourlyRate ?? 0),
  }
}

export function PartnersModule() {
  const { hydratePartners } = usePartnersStore()

  const { data } = useQuery({
    queryKey:  ['admin', 'crm', 'partners'],
    queryFn:   () => api.get('/admin/crm/partners').then(r => r.data.partners ?? []),
    enabled:   !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (data?.length) hydratePartners((data as Record<string, unknown>[]).map(toPartner))
  }, [data, hydratePartners])

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/os/partners' : `/os/partners/${tab.path}`}
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
        <Route index             element={<PartnersOverview />} />
        <Route path="profile"    element={<PartnerProfile />}   />
        <Route path="tasks"      element={<TasksPage />}        />
        <Route path="earnings"   element={<EarningsPage />}     />
        <Route path="*"          element={<Navigate to="/os/partners" replace />} />
      </Routes>
    </div>
  )
}

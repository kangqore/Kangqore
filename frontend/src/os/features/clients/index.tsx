import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery }   from '@tanstack/react-query'
import { LayoutGrid, UserCircle, Truck, Shield, BookOpen } from 'lucide-react'
import { cn }         from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useClientsStore } from './store'
import type { Client, Contact, Interaction, SLAMetric, Milestone, GovernanceItem } from './types'
import { ClientsOverview }  from './pages/ClientsOverview'
import { ClientProfile }    from './pages/ClientProfile'
import { DeliveryTracking } from './pages/DeliveryTracking'
import { SLADashboard }     from './pages/SLADashboard'
import { GovernancePage }   from './pages/GovernancePage'
import { AnimatePresence, motion } from 'framer-motion'

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

function toInteraction(r: Record<string, unknown>): Interaction {
  return {
    id:       String(r.id ?? ''),
    clientId: String(r.clientId ?? ''),
    type:     (r.type as Interaction['type']) ?? 'note',
    title:    String(r.title ?? ''),
    summary:  String(r.summary ?? ''),
    date:     String(r.date ?? '').slice(0, 10),
    owner:    String(r.owner ?? ''),
  }
}
function toSLA(r: Record<string, unknown>): SLAMetric {
  return {
    id:       String(r.id ?? ''),
    clientId: String(r.clientId ?? ''),
    metric:   String(r.metric ?? ''),
    target:   Number(r.target ?? 0),
    current:  Number(r.current ?? 0),
    unit:     String(r.unit ?? ''),
    period:   String(r.period ?? ''),
    status:   (r.status as SLAMetric['status']) ?? 'met',
    trend:    (r.trend  as SLAMetric['trend'])  ?? 'stable',
  }
}
function toMilestone(r: Record<string, unknown>): Milestone {
  return {
    id:            String(r.id ?? ''),
    clientId:      String(r.clientId ?? ''),
    projectId:     String(r.projectId ?? ''),
    title:         String(r.title ?? ''),
    description:   String(r.description ?? ''),
    dueDate:       String(r.dueDate ?? '').slice(0, 10),
    completedDate: r.completedDate ? String(r.completedDate).slice(0, 10) : undefined,
    status:        (r.status as Milestone['status']) ?? 'upcoming',
    owner:         String(r.owner ?? ''),
  }
}
function toGovernance(r: Record<string, unknown>): GovernanceItem {
  return {
    id:          String(r.id ?? ''),
    clientId:    String(r.clientId ?? ''),
    type:        (r.type     as GovernanceItem['type'])     ?? 'decision',
    title:       String(r.title ?? ''),
    description: String(r.description ?? ''),
    status:      (r.status   as GovernanceItem['status'])   ?? 'open',
    owner:       String(r.owner ?? ''),
    date:        String(r.date ?? '').slice(0, 10),
    priority:    (r.priority as GovernanceItem['priority']) ?? 'medium',
    resolution:  r.resolution ? String(r.resolution) : undefined,
  }
}

export function ClientsModule() {
  const { hydrate, hydrateInteractions, hydrateSLAs, hydrateMilestones, hydrateGovernance } = useClientsStore()

  const { data }        = useQuery({ queryKey: ['admin','crm','clients'],      queryFn: () => api.get('/admin/crm/clients').then(r => r.data.clients ?? []),          enabled: !isDemo(), staleTime: 1000*60*5 })
  const { data: iData } = useQuery({ queryKey: ['admin','crm','interactions'], queryFn: () => api.get('/admin/crm/interactions').then(r => r.data.interactions ?? []), enabled: !isDemo(), staleTime: 1000*60*5 })
  const { data: sData } = useQuery({ queryKey: ['admin','crm','slas'],         queryFn: () => api.get('/admin/crm/slas').then(r => r.data.slas ?? []),                 enabled: !isDemo(), staleTime: 1000*60*5 })
  const { data: mData } = useQuery({ queryKey: ['admin','crm','milestones'],   queryFn: () => api.get('/admin/crm/milestones').then(r => r.data.milestones ?? []),     enabled: !isDemo(), staleTime: 1000*60*5 })
  const { data: gData } = useQuery({ queryKey: ['admin','crm','governance'],   queryFn: () => api.get('/admin/crm/governance').then(r => r.data.governance ?? []),     enabled: !isDemo(), staleTime: 1000*60*5 })

  useEffect(() => { if (data?.length)  hydrate((data as Record<string,unknown>[]).map(toClient))             }, [data,  hydrate])
  useEffect(() => { if (iData?.length) hydrateInteractions((iData as Record<string,unknown>[]).map(toInteraction)) }, [iData, hydrateInteractions])
  useEffect(() => { if (sData?.length) hydrateSLAs((sData as Record<string,unknown>[]).map(toSLA))               }, [sData, hydrateSLAs])
  useEffect(() => { if (mData?.length) hydrateMilestones((mData as Record<string,unknown>[]).map(toMilestone))   }, [mData, hydrateMilestones])
  useEffect(() => { if (gData?.length) hydrateGovernance((gData as Record<string,unknown>[]).map(toGovernance))  }, [gData, hydrateGovernance])

  const { pathname } = useLocation()

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-os-border mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/admin/clients' : `/kangqore-view/admin/clients/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
              isActive
                ? 'border-os-blue text-os-blue'
                : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-os-border'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15,ease:'easeOut'}}>

        <Routes>
          <Route index              element={<ClientsOverview />}  />
          <Route path="profile"     element={<ClientProfile />}    />
          <Route path="delivery"    element={<DeliveryTracking />} />
          <Route path="sla"         element={<SLADashboard />}     />
          <Route path="governance"  element={<GovernancePage />}   />
          <Route path="*"           element={<Navigate to="/kangqore-view/admin/clients" replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

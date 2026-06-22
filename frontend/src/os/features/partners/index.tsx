import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery }  from '@tanstack/react-query'
import { LayoutGrid, UserCircle, CheckSquare, DollarSign } from 'lucide-react'
import { cn }        from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { usePartnersStore } from './store'
import type { Partner, PartnerContact, PartnerTask, Deliverable, PartnerPayment, PartnerNote } from './types'
import { PartnersOverview } from './pages/PartnersOverview'
import { PartnerProfile }   from './pages/PartnerProfile'
import { TasksPage }        from './pages/TasksPage'
import { EarningsPage }     from './pages/EarningsPage'
import { AnimatePresence, motion } from 'framer-motion'

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

function toTask(r: Record<string,unknown>): PartnerTask {
  return {
    id: String(r.id??''), partnerId: String(r.partnerId??''), partnerName: String(r.partnerName??''),
    projectId: String(r.projectId??''), projectName: String(r.projectName??''),
    title: String(r.title??''), description: String(r.description??''),
    status:   (r.status   as PartnerTask['status'])   ?? 'assigned',
    priority: (r.priority as PartnerTask['priority']) ?? 'medium',
    assignedDate:  String(r.assignedDate  ?? '').slice(0,10),
    dueDate:       String(r.dueDate       ?? '').slice(0,10),
    completedDate: r.completedDate ? String(r.completedDate).slice(0,10) : undefined,
    storyPoints: Number(r.storyPoints ?? 0),
    fee: Number(r.fee ?? 0),
  }
}
function toDeliverable(r: Record<string,unknown>): Deliverable {
  return {
    id: String(r.id??''), partnerId: String(r.partnerId??''), partnerName: String(r.partnerName??''),
    projectId: String(r.projectId??''), projectName: String(r.projectName??''),
    title: String(r.title??''), description: String(r.description??''),
    status:        (r.status as Deliverable['status']) ?? 'not-started',
    dueDate:       String(r.dueDate       ?? '').slice(0,10),
    submittedDate: r.submittedDate ? String(r.submittedDate).slice(0,10) : undefined,
    approvedDate:  r.approvedDate  ? String(r.approvedDate).slice(0,10)  : undefined,
    fee:      Number(r.fee ?? 0),
    feedback: r.feedback ? String(r.feedback) : undefined,
  }
}
function toPayment(r: Record<string,unknown>): PartnerPayment {
  return {
    id: String(r.id??''), partnerId: String(r.partnerId??''), partnerName: String(r.partnerName??''),
    invoiceNumber: String(r.invoiceNumber??''), description: String(r.description??''),
    amount: Number(r.amount ?? 0),
    status: (r.status as PartnerPayment['status']) ?? 'pending',
    issuedDate: String(r.issuedDate ?? '').slice(0,10),
    dueDate:    String(r.dueDate    ?? '').slice(0,10),
    paidDate:   r.paidDate ? String(r.paidDate).slice(0,10) : undefined,
  }
}
function toNote(r: Record<string,unknown>): PartnerNote {
  return {
    id: String(r.id??''), partnerId: String(r.partnerId??''),
    content: String(r.content??''), author: String(r.author??''),
    date: String(r.date??'').slice(0,10),
    type: (r.type as PartnerNote['type']) ?? 'general',
  }
}

export function PartnersModule() {
  const { hydratePartners, hydrateTasks, hydrateDeliverables, hydratePayments, hydrateNotes } = usePartnersStore()

  const { data }        = useQuery({ queryKey: ['admin','crm','partners'],              queryFn: () => api.get('/admin/crm/partners').then(r => r.data.partners ?? []),                      enabled: !isDemo(), staleTime: 1000*60*5 })
  const { data: tData } = useQuery({ queryKey: ['admin','crm','partner-tasks'],         queryFn: () => api.get('/admin/crm/partner-tasks').then(r => r.data.tasks ?? []),                    enabled: !isDemo(), staleTime: 1000*60*5 })
  const { data: dData } = useQuery({ queryKey: ['admin','crm','partner-deliverables'],  queryFn: () => api.get('/admin/crm/partner-deliverables').then(r => r.data.deliverables ?? []),      enabled: !isDemo(), staleTime: 1000*60*5 })
  const { data: pData } = useQuery({ queryKey: ['admin','crm','partner-payments'],      queryFn: () => api.get('/admin/crm/partner-payments').then(r => r.data.payments ?? []),              enabled: !isDemo(), staleTime: 1000*60*5 })
  const { data: nData } = useQuery({ queryKey: ['admin','crm','partner-notes'],         queryFn: () => api.get('/admin/crm/partner-notes').then(r => r.data.notes ?? []),                    enabled: !isDemo(), staleTime: 1000*60*5 })

  useEffect(() => { if (data  !== undefined) hydratePartners((data as Record<string,unknown>[]).map(toPartner))          }, [data,  hydratePartners])
  useEffect(() => { if (tData !== undefined) hydrateTasks((tData as Record<string,unknown>[]).map(toTask))                }, [tData, hydrateTasks])
  useEffect(() => { if (dData !== undefined) hydrateDeliverables((dData as Record<string,unknown>[]).map(toDeliverable)) }, [dData, hydrateDeliverables])
  useEffect(() => { if (pData !== undefined) hydratePayments((pData as Record<string,unknown>[]).map(toPayment))         }, [pData, hydratePayments])
  useEffect(() => { if (nData !== undefined) hydrateNotes((nData as Record<string,unknown>[]).map(toNote))               }, [nData, hydrateNotes])

  const { pathname } = useLocation()

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-white/10 border-t-white/20 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/admin/partners' : `/kangqore-view/admin/partners/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
              isActive
                ? 'border-os-blue text-os-blue'
                : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-white/10 border-t-white/20'
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
          <Route index             element={<PartnersOverview />} />
          <Route path="profile"    element={<PartnerProfile />}   />
          <Route path="tasks"      element={<TasksPage />}        />
          <Route path="earnings"   element={<EarningsPage />}     />
          <Route path="*"          element={<Navigate to="/kangqore-view/admin/partners" replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

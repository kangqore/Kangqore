import { useEffect } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, KanbanSquare, Mail, Brain } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useLeadsStore } from './store'
import { LeadsPipeline } from './pages/LeadsPipeline'
import { LeadProfile }   from './pages/LeadProfile'
import { NurturePage }   from './pages/NurturePage'
import { ScoringPage }   from './pages/ScoringPage'
import type { Lead } from './types'

const TABS = [
  { path: '',        label: 'Pipeline', icon: KanbanSquare },
  { path: 'profile', label: 'Profile',  icon: LayoutGrid   },
  { path: 'nurture', label: 'Nurture',  icon: Mail         },
  { path: 'scoring', label: 'Scoring',  icon: Brain        },
]

// Map eQORE backend lead → kangqore-view Lead type
function toLead(e: Record<string, unknown>, i: number): Lead {
  const stages: Lead['stage'][] = ['new', 'qualified', 'proposal', 'negotiation', 'won', 'lost']
  return {
    id:           String(e.id ?? `l${i}`),
    company:      String(e.companyName ?? e.company ?? 'Unknown'),
    contactName:  String(e.contactName ?? e.name ?? ''),
    contactRole:  String(e.contactRole ?? e.jobTitle ?? ''),
    email:        String(e.email ?? ''),
    phone:        e.phone ? String(e.phone) : undefined,
    country:      String(e.country ?? 'UK'),
    industry:     String(e.industry ?? ''),
    stage:        stages.includes(String(e.stage ?? 'new').toLowerCase() as Lead['stage'])
                    ? String(e.stage).toLowerCase() as Lead['stage']
                    : 'new',
    source:       (['inbound','outbound','referral','eQORE','event','website'].includes(String(e.source ?? '').toLowerCase())
                    ? String(e.source).toLowerCase()
                    : 'inbound') as Lead['source'],
    score:        Number(e.score ?? e.eqoreScore ?? 50),
    value:        Number(e.value ?? e.dealValue ?? 0),
    probability:  Number(e.probability ?? e.winProbability ?? 30),
    owner:        String(e.owner ?? e.assignedTo ?? 'Unassigned'),
    createdAt:    String(e.createdAt ?? '').slice(0, 10),
    lastActivity: String(e.updatedAt ?? e.lastActivity ?? '').slice(0, 10),
    tags:         Array.isArray(e.tags) ? e.tags as string[] : [],
    description:  String(e.description ?? e.notes ?? ''),
  }
}

export function LeadsModule() {
  const { hydrate } = useLeadsStore()

  // eQORE leads endpoint (admin)
  const { data } = useQuery({
    queryKey: ['eqore-leads'],
    queryFn: () => api.get('/admin/eqore/leads').then(r =>
      (r.data.leads ?? r.data ?? []) as Record<string, unknown>[]
    ),
    staleTime: 1000 * 60 * 5,
    enabled: !isDemo(),
  })
  useEffect(() => {
    if (data?.length) hydrate(data.map((e, i) => toLead(e, i)))
  }, [data, hydrate])

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/os/leads' : `/os/leads/${tab.path}`}
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
        <Route index            element={<LeadsPipeline />} />
        <Route path="profile"   element={<LeadProfile />}   />
        <Route path="nurture"   element={<NurturePage />}   />
        <Route path="scoring"   element={<ScoringPage />}   />
        <Route path="*"         element={<Navigate to="/os/leads" replace />} />
      </Routes>
    </div>
  )
}

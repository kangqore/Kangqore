import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, KanbanSquare, Mail, Brain, TrendingUp, AlertTriangle } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useLeadsStore } from './store'
import { useRevenueProjection } from './useRevenueProjection'
import { LeadsPipeline } from './pages/LeadsPipeline'
import { LeadProfile }   from './pages/LeadProfile'
import { NurturePage }   from './pages/NurturePage'
import { ScoringPage }   from './pages/ScoringPage'
import type { Lead } from './types'
import { AnimatePresence, motion } from 'framer-motion'

const TABS = [
  { path: '',        label: 'Pipeline', icon: KanbanSquare },
  { path: 'profile', label: 'Profile',  icon: LayoutGrid   },
  { path: 'nurture', label: 'Nurture',  icon: Mail         },
  { path: 'scoring', label: 'Scoring',  icon: Brain        },
]

// ── Gen III: WAANDA Revenue Intelligence banner ───────────────────────────────
function WANDALeadsIntelligence() {
  const model = useRevenueProjection()
  if (!model || model.confidence < 0.1) return null

  const payload      = model.payload as Record<string, any>
  const phase        = model.cognitivePhase
  const newLeads     = (payload.newLeadsCount     ?? 0) as number
  const inProgress   = (payload.inProgressLeadsCount ?? 0) as number
  const pipelineVal  = payload.pipelineTotalValue as string | undefined
  const synthesis    = payload.kimmSynthesis as string | null

  const PHASE_COLOR: Record<string, string> = {
    OBSERVE: '#3b82f6', UNDERSTAND: '#7c3aed', DECIDE: '#f59e0b',
    ACT: '#10b981', LEARN: '#0d9488',
  }
  const col = PHASE_COLOR[phase] ?? '#10b981'
  const insight = synthesis?.slice(0, 120) ?? null

  if (!insight && newLeads === 0 && !pipelineVal) return null

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 14px', marginBottom: 10,
      background: col + '08', border: `1px solid ${col}20`, borderRadius: 8,
    }}>
      <Brain size={12} style={{ color: col, flexShrink: 0 }} />
      <span style={{
        fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em',
        color: col, background: col + '15', padding: '2px 7px', borderRadius: 4, flexShrink: 0,
      }}>
        WAANDA · {phase}
      </span>
      {insight && (
        <span style={{ fontSize: 11, color: 'var(--os-text-3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {insight}{synthesis && synthesis.length > 120 ? '…' : ''}
        </span>
      )}
      {newLeads > 0 && (
        <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', background: '#10b98112', border: '1px solid #10b98125', padding: '2px 8px', borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          <TrendingUp size={9} /> {newLeads} new
        </span>
      )}
      {inProgress > 0 && (
        <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', background: '#f59e0b10', border: '1px solid #f59e0b25', padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>
          {inProgress} active
        </span>
      )}
      {pipelineVal && pipelineVal !== '—' && (
        <span style={{ fontSize: 10, fontWeight: 700, color: col, background: col + '12', padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>
          {pipelineVal} pipeline
        </span>
      )}
    </div>
  )
}

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
    if (data !== undefined) hydrate(data.map((e, i) => toLead(e, i)))
  }, [data, hydrate])

  const { pathname } = useLocation()

  return (
    <div>
      <WANDALeadsIntelligence />
      <div className="flex items-center gap-0 border-b border-[var(--os-border)] mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/admin/leads' : `/kangqore-view/admin/leads/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all',
              isActive
                ? 'border-[#579bfc] text-[#579bfc]'
                : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
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
          <Route index            element={<LeadsPipeline />} />
          <Route path="profile"   element={<LeadProfile />}   />
          <Route path="nurture"   element={<NurturePage />}   />
          <Route path="scoring"   element={<ScoringPage />}   />
          <Route path="*"         element={<Navigate to="/kangqore-view/admin/leads" replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

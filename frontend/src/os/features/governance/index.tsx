import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, GitPullRequest, Shield } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useGovernanceStore } from './store'
import { DecisionLogPage }   from './pages/DecisionLogPage'
import { ChangeControlPage } from './pages/ChangeControlPage'
import { AuditLogPage }      from './pages/AuditLogPage'
import type { Decision, ChangeRequest, AuditLog } from './types'
import { AnimatePresence, motion } from 'framer-motion'

const TABS = [
  { path: '',        label: 'Decisions',      icon: CheckCircle2   },
  { path: 'changes', label: 'Change Control', icon: GitPullRequest },
  { path: 'audit',   label: 'Audit Log',      icon: Shield         },
]

function toDecision(r: Record<string, unknown>): Decision {
  return {
    id:            String(r.id ?? ''),
    title:         String(r.title ?? ''),
    description:   r.description ? String(r.description) : undefined,
    status:        String(r.status ?? 'PENDING_APPROVAL') as Decision['status'],
    priority:      String(r.priority ?? 'MEDIUM') as Decision['priority'],
    dueDate:       r.dueDate ? String(r.dueDate) : undefined,
    rationale:     r.rationale ? String(r.rationale) : undefined,
    tradeoffs:     r.tradeoffs ? String(r.tradeoffs) : undefined,
    impactTime:    r.impactTime ? String(r.impactTime) : undefined,
    impactCost:    r.impactCost != null ? Number(r.impactCost) : undefined,
    impactRisk:    r.impactRisk ? String(r.impactRisk) : undefined,
    projectId:     r.projectId ? String(r.projectId) : undefined,
    clientId:      r.clientId ? String(r.clientId) : undefined,
    project:       r.project ? { title: String((r.project as any).title ?? '') } : undefined,
    client:        r.client ? { name: String((r.client as any).name ?? ''), company: String((r.client as any).company ?? '') } : undefined,
    approver:      r.approver ? { name: String((r.approver as any).name ?? '') } : undefined,
    createdAt:     String(r.createdAt ?? new Date().toISOString()),
    updatedAt:     String(r.updatedAt ?? new Date().toISOString()),
  }
}

function toChangeRequest(r: Record<string, unknown>): ChangeRequest {
  return {
    id:               String(r.id ?? ''),
    title:            String(r.title ?? ''),
    description:      r.description ? String(r.description) : undefined,
    priority:         String(r.priority ?? 'MEDIUM') as ChangeRequest['priority'],
    status:           String(r.status ?? 'PENDING_APPROVAL') as ChangeRequest['status'],
    costImpact:       r.costImpact != null ? Number(r.costImpact) : undefined,
    timeImpact:       r.timeImpact ? String(r.timeImpact) : undefined,
    rejectionImpact:  r.rejectionImpact ? String(r.rejectionImpact) : undefined,
    requestedBy:      r.requestedBy ? String(r.requestedBy) : undefined,
    decisionType:     r.decisionType ? String(r.decisionType) : undefined,
    projectId:        r.projectId ? String(r.projectId) : undefined,
    clientId:         r.clientId ? String(r.clientId) : undefined,
    project:          r.project ? { title: String((r.project as any).title ?? '') } : undefined,
    client:           r.client ? { name: String((r.client as any).name ?? ''), company: String((r.client as any).company ?? '') } : undefined,
    createdAt:        String(r.createdAt ?? new Date().toISOString()),
    updatedAt:        String(r.updatedAt ?? new Date().toISOString()),
  }
}

function toAuditLog(r: Record<string, unknown>): AuditLog {
  return {
    id:        String(r.id ?? ''),
    action:    String(r.action ?? ''),
    resource:  String(r.resource ?? ''),
    userId:    r.userId ? String(r.userId) : undefined,
    user:      r.user ? {
      name:    String((r.user as any).name ?? ''),
      email:   String((r.user as any).email ?? ''),
      role:    String((r.user as any).role ?? ''),
      company: (r.user as any).company ? String((r.user as any).company) : undefined,
    } : undefined,
    createdAt: String(r.createdAt ?? new Date().toISOString()),
  }
}

export function GovernanceModule() {
  const { hydrateDecisions, hydrateChangeRequests, hydrateAuditLogs } = useGovernanceStore()

  const { data: decisionsData } = useQuery({
    queryKey: ['governance', 'decisions'],
    queryFn: () => api.get('/admin/governance/decisions').then(r => (r.data.decisions ?? []) as Record<string, unknown>[]),
    staleTime: 1000 * 60 * 3,
    enabled: !isDemo(),
  })

  const { data: changesData } = useQuery({
    queryKey: ['governance', 'changes'],
    queryFn: () => api.get('/admin/governance/changes').then(r => (r.data.changes ?? []) as Record<string, unknown>[]),
    staleTime: 1000 * 60 * 3,
    enabled: !isDemo(),
  })

  const { data: auditData } = useQuery({
    queryKey: ['governance', 'audit'],
    queryFn: () => api.get('/admin/audit-logs').then(r => (r.data.logs ?? []) as Record<string, unknown>[]),
    staleTime: 1000 * 60 * 5,
    enabled: !isDemo(),
  })

  useEffect(() => { if (decisionsData?.length) hydrateDecisions(decisionsData.map(toDecision)) }, [decisionsData, hydrateDecisions])
  useEffect(() => { if (changesData?.length)   hydrateChangeRequests(changesData.map(toChangeRequest)) }, [changesData, hydrateChangeRequests])
  useEffect(() => { if (auditData?.length)     hydrateAuditLogs(auditData.map(toAuditLog)) }, [auditData, hydrateAuditLogs])

  const { pathname } = useLocation()

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-os-border mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/admin/governance' : `/kangqore-view/admin/governance/${tab.path}`}
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
          <Route index          element={<DecisionLogPage />}   />
          <Route path="changes" element={<ChangeControlPage />} />
          <Route path="audit"   element={<AuditLogPage />}      />
          <Route path="*"       element={<Navigate to="/kangqore-view/admin/governance" replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

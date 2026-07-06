import { useState } from 'react'
import { AlertTriangle, Clock, ChevronDown, ChevronUp, Zap, Brain, Database } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

interface LiveProject { id: string; name: string; health: string; status: string; client?: string }

function useLiveProjects() {
  return useQuery<{ projects: LiveProject[] } | LiveProject[]>({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
    staleTime: 60_000,
  })
}

function getProjects(data: { projects: LiveProject[] } | LiveProject[] | undefined): LiveProject[] {
  if (!data) return []
  return Array.isArray(data) ? data : (data.projects ?? [])
}

type Severity = 'P1' | 'P2' | 'P3' | 'P4'
type IssueStatus = 'open' | 'investigating' | 'resolved'
type Domain = 'Revenue' | 'Delivery' | 'People' | 'Finance' | 'Compliance' | 'Operations'

interface Issue {
  id: string
  title: string
  summary: string
  domain: Domain
  entity: string
  severity: Severity
  status: IssueStatus
  kimmpConfidence: number
  kimmpAction: string
  raisedAt: string
  slaBreachAt: string
  acknowledgedBy?: string
}

const DOMAIN_COLOR: Record<Domain, string> = {
  Revenue:     '#00c875',
  Delivery:    '#579bfc',
  People:      '#7c3aed',
  Finance:     '#fdab3d',
  Compliance:  '#e2445c',
  Operations:  'var(--os-text-2)',
}

const SEV_COLOR: Record<Severity, string> = {
  P1: '#e2445c',
  P2: '#fdab3d',
  P3: '#579bfc',
  P4: 'var(--os-text-2)',
}

const SEV_LABEL: Record<Severity, string> = {
  P1: 'Critical',
  P2: 'High',
  P3: 'Medium',
  P4: 'Low',
}

const ISSUES: Issue[] = [
  {
    id: 'ISS-001',
    title: 'Synapse Health delivery milestone missed — Sprint 14',
    summary: 'Sprint 14 velocity dropped 34% vs baseline. Two engineers flagged as blocked in Jira. Client has a contractual milestone review in 5 days.',
    domain: 'Delivery',
    entity: 'Synapse Health',
    severity: 'P1',
    status: 'investigating',
    kimmpConfidence: 94,
    kimmpAction: 'Escalate to delivery lead immediately. Propose milestone extension with compensation in next client call.',
    raisedAt: '2026-06-21T07:15:00Z',
    slaBreachAt: '2026-06-21T11:15:00Z',
  },
  {
    id: 'ISS-002',
    title: 'Client churn risk elevated — Meridian Logistics',
    summary: 'Three correlated signals: HubSpot deal marked "at risk", last invoice overdue 18 days, no client engagement in 22 days. KIMMP pattern match: pre-churn signature (87% historical accuracy).',
    domain: 'Revenue',
    entity: 'Meridian Logistics',
    severity: 'P1',
    status: 'open',
    kimmpConfidence: 87,
    kimmpAction: 'Schedule retention call within 24h. Prepare value recap and outstanding invoice resolution plan.',
    raisedAt: '2026-06-21T06:02:00Z',
    slaBreachAt: '2026-06-21T10:02:00Z',
  },
  {
    id: 'ISS-003',
    title: 'Finance: AR overdue threshold exceeded — 3 clients',
    summary: 'Three invoices totalling ₹8.4L are 30+ days overdue. Cash flow projection shows negative runway in 47 days if unresolved.',
    domain: 'Finance',
    entity: 'Finance Module',
    severity: 'P2',
    status: 'open',
    kimmpConfidence: 99,
    kimmpAction: 'Send escalation notice to all three clients today. Initiate payment plan discussion with largest debtor (₹4.2L).',
    raisedAt: '2026-06-20T09:00:00Z',
    slaBreachAt: '2026-06-21T17:00:00Z',
  },
  {
    id: 'ISS-004',
    title: 'Key resource conflict — Aarav Shah double-booked weeks 26–28',
    summary: 'Aarav Shah (Lead Engineer) is allocated 140% across two projects during weeks 26–28. One project has a P1 delivery dependency on him.',
    domain: 'People',
    entity: 'Aarav Shah',
    severity: 'P2',
    status: 'open',
    kimmpConfidence: 100,
    kimmpAction: 'Re-negotiate allocation with Project B lead. Identify contingency resource if reallocation is rejected.',
    raisedAt: '2026-06-20T14:30:00Z',
    slaBreachAt: '2026-06-22T14:30:00Z',
  },
  {
    id: 'ISS-005',
    title: 'GDPR access review overdue — 12 users',
    summary: '12 user accounts have not had access reviewed in 91 days, exceeding the 90-day SOC 2 control requirement. AEGIS flagged this automatically.',
    domain: 'Compliance',
    entity: 'AEGIS',
    severity: 'P2',
    status: 'open',
    kimmpConfidence: 100,
    kimmpAction: 'Complete access review for all 12 users before end of day. Document review in AEGIS audit log.',
    raisedAt: '2026-06-21T00:00:00Z',
    slaBreachAt: '2026-06-22T00:00:00Z',
  },
  {
    id: 'ISS-006',
    title: 'Marketing: Q2 lead pipeline 38% below target',
    summary: 'With 10 days remaining in Q2, inbound lead volume is tracking 38% below the 50-lead target. 3 planned campaigns were delayed.',
    domain: 'Operations',
    entity: 'Marketing',
    severity: 'P3',
    status: 'open',
    kimmpConfidence: 91,
    kimmpAction: 'Activate backup outbound campaign. Review delayed campaigns for root cause.',
    raisedAt: '2026-06-19T10:00:00Z',
    slaBreachAt: '2026-06-24T10:00:00Z',
  },
  {
    id: 'ISS-007',
    title: 'Consultation show-rate dropped to 58% — week of June 16',
    summary: 'Consultation show-rate fell to 58% against a 75% baseline. 7 no-shows recorded. Three clients had rescheduled twice.',
    domain: 'Revenue',
    entity: 'Consultations',
    severity: 'P3',
    status: 'investigating',
    kimmpConfidence: 78,
    kimmpAction: 'Enable 2-hour reminder automation. Flag chronic reschedulers for review.',
    raisedAt: '2026-06-17T08:00:00Z',
    slaBreachAt: '2026-06-24T08:00:00Z',
    acknowledgedBy: 'C.O.D.E.',
  },
]

function slaRemaining(breachAt: string): { label: string; urgent: boolean } {
  const diff = new Date(breachAt).getTime() - Date.now()
  if (diff <= 0) return { label: 'SLA breached', urgent: true }
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h < 2) return { label: `${h}h ${m}m`, urgent: true }
  if (h < 8) return { label: `${h}h remaining`, urgent: true }
  return { label: `${h}h remaining`, urgent: false }
}

function IssueRow({ issue }: { issue: Issue }) {
  const [expanded, setExpanded] = useState(false)
  const sla         = slaRemaining(issue.slaBreachAt)
  const domainColor = DOMAIN_COLOR[issue.domain]
  const sevColor    = SEV_COLOR[issue.severity]

  return (
    <div className="os-card overflow-hidden" style={{ borderLeft: `4px solid ${sevColor}` }}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Severity badge */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg flex flex-col items-center justify-center"
            style={{ background: sevColor + '18', border: `1px solid ${sevColor}30` }}>
            <span className="text-[10px] font-black" style={{ color: sevColor }}>{issue.severity}</span>
            <span className="text-[8px] uppercase" style={{ color: 'var(--os-text-3)' }}>{SEV_LABEL[issue.severity]}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--os-text-1)' }}>{issue.title}</p>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* SLA clock */}
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0"
                  style={{
                    color: sla.urgent ? '#e2445c' : 'var(--os-text-3)',
                    background: sla.urgent ? '#e2445c12' : 'var(--os-surface-0)',
                    border: `1px solid ${sla.urgent ? '#e2445c30' : 'var(--os-border)'}`,
                  }}>
                  <Clock className="w-2.5 h-2.5" />
                  {sla.label}
                </span>
                {/* Status */}
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg capitalize flex-shrink-0"
                  style={{
                    color: issue.status === 'resolved' ? '#00c875' : issue.status === 'investigating' ? '#fdab3d' : 'var(--os-text-3)',
                    background: issue.status === 'resolved' ? '#00c87512' : issue.status === 'investigating' ? '#fdab3d12' : 'var(--os-surface-0)',
                    border: `1px solid ${issue.status === 'resolved' ? '#00c87530' : issue.status === 'investigating' ? '#fdab3d30' : 'var(--os-border)'}`,
                  }}>
                  {issue.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                style={{ color: domainColor, background: domainColor + '14', border: `1px solid ${domainColor}25` }}>
                {issue.domain}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--os-text-3)' }}>{issue.entity}</span>
              <span className="text-[10px]" style={{ color: 'var(--os-text-3)' }}>·</span>
              <span className="text-[10px]" style={{ color: 'var(--os-text-3)' }}>{issue.id}</span>
              {issue.acknowledgedBy && (
                <span className="text-[10px] font-semibold" style={{ color: '#00c875' }}>· Ack: {issue.acknowledgedBy}</span>
              )}
            </div>

            {/* KIMMP action bar */}
            <div className="mt-2.5 flex items-start gap-2 px-3 py-2 rounded-lg"
              style={{ background: '#7c3aed08', border: '1px solid #7c3aed18' }}>
              <Brain className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: '#7c3aed' }} />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#7c3aed' }}>KIMMP · {issue.kimmpConfidence}% confidence</span>
                <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--os-text-2)' }}>{issue.kimmpAction}</p>
              </div>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-[var(--os-border)]">
            <p className="text-xs leading-relaxed pl-[52px]" style={{ color: 'var(--os-text-2)' }}>{issue.summary}</p>
          </div>
        )}

        <button onClick={() => setExpanded(e => !e)}
          className="mt-2 pl-[52px] flex items-center gap-1 text-xs font-medium transition-colors hover:text-[#579bfc]"
          style={{ color: 'var(--os-text-3)' }}>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Show less' : 'Full detail'}
        </button>
      </div>
    </div>
  )
}

export function IssuesFeedPage() {
  const [sevFilter, setSevFilter]     = useState<Severity | 'all'>('all')
  const [domainFilter, setDomainFilter] = useState<Domain | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'open-only'>('open-only')

  const { data: projectData, isLoading: projectsLoading } = useLiveProjects()
  const projects = getProjects(projectData)
  const atRiskProjects = projects.filter(p =>
    p.health === 'at-risk' || p.health === 'AT_RISK' ||
    p.health === 'critical' || p.health === 'CRITICAL' ||
    p.health === 'behind' || p.health === 'BEHIND'
  )
  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'ACTIVE')

  const filtered = ISSUES
    .filter(i => sevFilter === 'all' || i.severity === sevFilter)
    .filter(i => domainFilter === 'all' || i.domain === domainFilter)
    .filter(i => statusFilter === 'all' || i.status !== 'resolved')

  const p1 = ISSUES.filter(i => i.severity === 'P1' && i.status !== 'resolved').length
  const p2 = ISSUES.filter(i => i.severity === 'P2' && i.status !== 'resolved').length

  return (
    <div className="space-y-5">
      {/* Live project health */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{ background: '#579bfc08', border: '1px solid #579bfc20' }}>
        <Database className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#579bfc' }} />
        <p className="text-[11px]" style={{ color: 'var(--os-text-2)' }}>
          {projectsLoading ? (
            <span style={{ color: 'var(--os-text-3)' }}>Loading project signals…</span>
          ) : projects.length > 0 ? (
            <>
              <span className="font-semibold" style={{ color: 'var(--os-text-1)' }}>{activeProjects.length}</span> active projects ·{' '}
              {atRiskProjects.length > 0
                ? <><span className="font-semibold" style={{ color: '#fdab3d' }}>{atRiskProjects.length}</span> at risk or behind</>
                : <span className="font-semibold" style={{ color: '#00c875' }}>all projects on track</span>
              }
            </>
          ) : (
            <span style={{ color: 'var(--os-text-3)' }}>No project data available</span>
          )}
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'P1 Critical',   count: p1,                                                         bg: 'linear-gradient(135deg,#e2445c 0%,#c0392b 100%)', glow: '#e2445c' },
          { label: 'P2 High',       count: p2,                                                         bg: 'linear-gradient(135deg,#fdab3d 0%,#f59e0b 100%)', glow: '#fdab3d' },
          { label: 'Investigating', count: ISSUES.filter(i => i.status === 'investigating').length,    bg: 'linear-gradient(135deg,#2564ea 0%,#579bfc 100%)', glow: '#2564ea' },
          { label: 'Total Open',    count: ISSUES.filter(i => i.status !== 'resolved').length,         bg: 'linear-gradient(135deg,#7c3aed 0%,#9d4edd 100%)', glow: '#7c3aed' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: s.bg, boxShadow: `0 4px 20px ${s.glow}40` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.28) 0%, transparent 60%)' }} />
            <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{s.label}</p>
            <p className="relative text-3xl font-black tabular-nums" style={{ color: '#ffffff' }}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'P1', 'P2', 'P3', 'P4'] as const).map(s => {
          const isActive = sevFilter === s
          const color = s === 'all' ? '#7c3aed' : SEV_COLOR[s as Severity]
          return (
            <button key={s} onClick={() => setSevFilter(s)}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: isActive ? color + '14' : 'var(--os-surface-0)',
                border: `1px solid ${isActive ? color + '35' : 'var(--os-border)'}`,
                color: isActive ? color : 'var(--os-text-2)',
              }}>
              {s === 'all' ? 'All Severity' : s}
            </button>
          )
        })}
        <div className="w-px" style={{ background: 'var(--os-border)' }} />
        <button onClick={() => setStatusFilter(statusFilter === 'open-only' ? 'all' : 'open-only')}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
          style={{
            background: statusFilter === 'open-only' ? '#00c87512' : 'var(--os-surface-0)',
            border: `1px solid ${statusFilter === 'open-only' ? '#00c87530' : 'var(--os-border)'}`,
            color: statusFilter === 'open-only' ? '#00c875' : 'var(--os-text-2)',
          }}>
          {statusFilter === 'open-only' ? '● Open only' : 'All status'}
        </button>
      </div>

      {/* Issues */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="os-card py-16 flex flex-col items-center gap-3">
            <Zap className="w-8 h-8" style={{ color: 'var(--os-text-3)' }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--os-text-2)' }}>No issues match the current filter</p>
          </div>
        ) : filtered.map(issue => <IssueRow key={issue.id} issue={issue} />)}
      </div>
    </div>
  )
}

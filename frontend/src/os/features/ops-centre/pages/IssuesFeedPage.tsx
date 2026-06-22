import { useState } from 'react'
import { AlertTriangle, Clock, ChevronDown, ChevronUp, ArrowRight, Zap, Brain } from 'lucide-react'

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
  Delivery:    '#2564ea',
  People:      '#7f53f9',
  Finance:     '#fdab3d',
  Compliance:  '#e2445c',
  Operations:  '#64748b',
}

const SEV_COLOR: Record<Severity, string> = {
  P1: '#e2445c',
  P2: '#fdab3d',
  P3: '#2564ea',
  P4: '#475569',
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
    acknowledgedBy: 'Mahesh Kumar',
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
  const sla = slaRemaining(issue.slaBreachAt)
  const domainColor = DOMAIN_COLOR[issue.domain]
  const sevColor = SEV_COLOR[issue.severity]

  return (
    <div className="rounded-xl overflow-hidden transition-all"
      style={{
        background: '#0d1117',
        border: `1px solid #2E2854`,
        borderLeft: `3px solid ${sevColor}`,
        boxShadow: issue.severity === 'P1' && issue.status !== 'resolved' ? `0 0 16px ${sevColor}14` : 'none',
      }}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Severity badge */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg flex flex-col items-center justify-center"
            style={{ background: `${sevColor}18`, border: `1px solid ${sevColor}30` }}>
            <span className="text-[10px] font-black" style={{ color: sevColor }}>{issue.severity}</span>
            <span className="text-[8px] text-slate-600 uppercase">{SEV_LABEL[issue.severity]}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-white leading-tight">{issue.title}</p>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* SLA clock */}
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0"
                  style={{
                    color: sla.urgent ? '#e2445c' : '#64748b',
                    background: sla.urgent ? 'rgba(226,68,92,0.1)' : 'rgba(100,116,139,0.1)',
                    border: `1px solid ${sla.urgent ? 'rgba(226,68,92,0.3)' : 'rgba(100,116,139,0.2)'}`,
                  }}>
                  <Clock className="w-2.5 h-2.5" />
                  {sla.label}
                </span>
                {/* Status */}
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg capitalize flex-shrink-0"
                  style={{
                    color: issue.status === 'resolved' ? '#00c875' : issue.status === 'investigating' ? '#fdab3d' : '#64748b',
                    background: issue.status === 'resolved' ? 'rgba(0,200,117,0.1)' : issue.status === 'investigating' ? 'rgba(253,171,61,0.1)' : 'rgba(100,116,139,0.1)',
                    border: `1px solid ${issue.status === 'resolved' ? 'rgba(0,200,117,0.3)' : issue.status === 'investigating' ? 'rgba(253,171,61,0.3)' : 'rgba(100,116,139,0.2)'}`,
                  }}>
                  {issue.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                style={{ color: domainColor, background: `${domainColor}14`, border: `1px solid ${domainColor}25` }}>
                {issue.domain}
              </span>
              <span className="text-[10px] text-slate-500">{issue.entity}</span>
              <span className="text-[10px] text-slate-600">·</span>
              <span className="text-[10px] text-slate-600">{issue.id}</span>
              {issue.acknowledgedBy && (
                <span className="text-[10px] font-semibold text-emerald-500">· Ack: {issue.acknowledgedBy}</span>
              )}
            </div>

            {/* KIMMP action bar */}
            <div className="mt-2.5 flex items-start gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <Brain className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">KIMMP · {issue.kimmpConfidence}% confidence</span>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{issue.kimmpAction}</p>
              </div>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 pl-13" style={{ borderTop: '1px solid #1f2a4a' }}>
            <p className="text-xs text-slate-400 leading-relaxed pl-[52px]">{issue.summary}</p>
          </div>
        )}

        <button onClick={() => setExpanded(e => !e)}
          className="mt-2 pl-[52px] flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-os-blue transition-colors">
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Show less' : 'Full detail'}
        </button>
      </div>
    </div>
  )
}

export function IssuesFeedPage() {
  const [sevFilter, setSevFilter] = useState<Severity | 'all'>('all')
  const [domainFilter, setDomainFilter] = useState<Domain | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'open-only'>('open-only')

  const filtered = ISSUES
    .filter(i => sevFilter === 'all' || i.severity === sevFilter)
    .filter(i => domainFilter === 'all' || i.domain === domainFilter)
    .filter(i => statusFilter === 'all' || i.status !== 'resolved')

  const p1 = ISSUES.filter(i => i.severity === 'P1' && i.status !== 'resolved').length
  const p2 = ISSUES.filter(i => i.severity === 'P2' && i.status !== 'resolved').length

  return (
    <div className="space-y-5">

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { label: 'P1 Critical', count: p1, color: '#e2445c' },
          { label: 'P2 High',     count: p2, color: '#fdab3d' },
          { label: 'Investigating', count: ISSUES.filter(i => i.status === 'investigating').length, color: '#2564ea' },
          { label: 'Total Open', count: ISSUES.filter(i => i.status !== 'resolved').length, color: '#7f53f9' },
        ] as const).map(s => (
          <div key={s.label} className="rounded-xl p-3.5 flex items-center gap-3"
            style={{ background: '#0d1117', border: `1px solid ${s.color}20` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
              <AlertTriangle className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-white tabular-nums">{s.count}</p>
              <p className="text-[10px] text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {/* Severity */}
        {(['all', 'P1', 'P2', 'P3', 'P4'] as const).map(s => (
          <button key={s} onClick={() => setSevFilter(s)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: sevFilter === s ? (s === 'all' ? 'rgba(124,58,237,0.12)' : `${SEV_COLOR[s as Severity]}14`) : '#0d1117',
              border: sevFilter === s ? `1px solid ${s === 'all' ? 'rgba(124,58,237,0.35)' : `${SEV_COLOR[s as Severity]}35`}` : '1px solid #2E2854',
              color: sevFilter === s ? (s === 'all' ? '#a78bfa' : SEV_COLOR[s as Severity]) : '#64748b',
            }}>
            {s === 'all' ? 'All Severity' : s}
          </button>
        ))}
        <div className="w-px bg-[#2E2854]" />
        <button onClick={() => setStatusFilter(statusFilter === 'open-only' ? 'all' : 'open-only')}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
          style={{
            background: statusFilter === 'open-only' ? 'rgba(0,200,117,0.1)' : '#0d1117',
            border: `1px solid ${statusFilter === 'open-only' ? 'rgba(0,200,117,0.3)' : '#2E2854'}`,
            color: statusFilter === 'open-only' ? '#00c875' : '#64748b',
          }}>
          {statusFilter === 'open-only' ? '● Open only' : 'All status'}
        </button>
      </div>

      {/* Issues */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 rounded-2xl"
            style={{ background: '#0d1117', border: '1px solid #1f2a4a' }}>
            <Zap className="w-8 h-8 text-slate-700" />
            <p className="text-sm font-semibold text-slate-400">No issues match the current filter</p>
          </div>
        ) : filtered.map(issue => <IssueRow key={issue.id} issue={issue} />)}
      </div>
    </div>
  )
}

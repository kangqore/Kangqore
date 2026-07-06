import { ArrowUpCircle } from 'lucide-react'

const ACCENT = '#06B6D4'

type EscalationStatus = 'ACTIVE' | 'RESOLVED' | 'MONITORING'

interface Escalation {
  id: string
  ticketId: string
  title: string
  client: string
  path: string
  reason: string
  daysEscalated: number
  status: EscalationStatus
  assignee: string
}

const ESCALATIONS: Escalation[] = [
  {
    id: 'ESC-0041',
    ticketId: 'TKT-1142',
    title: 'SSO login failure — all users unable to authenticate',
    client: 'Acme Corp',
    path: 'L1 → L2 → Engineering',
    reason: 'Auth service regression introduced in v2.14.1 deploy — requires code fix',
    daysEscalated: 0,
    status: 'ACTIVE',
    assignee: 'Kavya R. + Eng. Team',
  },
  {
    id: 'ESC-0040',
    ticketId: 'TKT-1139',
    title: 'Dashboard charts not loading — timeout errors',
    client: 'Acme Corp',
    path: 'L1 → L2',
    reason: 'Query performance degradation on analytics table after schema migration',
    daysEscalated: 1,
    status: 'ACTIVE',
    assignee: 'Rahul V.',
  },
  {
    id: 'ESC-0039',
    ticketId: 'TKT-1131',
    title: 'Bulk import fails silently for >500 records',
    client: 'Globex Ltd',
    path: 'L1 → L2 → Engineering',
    reason: 'Memory limit hit in background job — fix deployed in v2.14.2',
    daysEscalated: 3,
    status: 'RESOLVED',
    assignee: 'Sneha G.',
  },
  {
    id: 'ESC-0038',
    ticketId: 'TKT-1128',
    title: 'Webhook delivery failures — 3rd party integration',
    client: 'BlueSky Retail',
    path: 'L1 → L2',
    reason: 'Downstream vendor API change broke signature validation',
    daysEscalated: 2,
    status: 'RESOLVED',
    assignee: 'Arjun S.',
  },
  {
    id: 'ESC-0037',
    ticketId: 'TKT-1120',
    title: 'PDF exports corrupted on Safari macOS 15',
    client: 'Initech Group',
    path: 'L1 → Engineering',
    reason: 'Browser-specific rendering bug in PDF library — patch in progress',
    daysEscalated: 5,
    status: 'RESOLVED',
    assignee: 'Priya N.',
  },
]

const STATUS_COLOR: Record<EscalationStatus, string> = {
  ACTIVE:     '#EF4444',
  RESOLVED:   '#10B981',
  MONITORING: '#F59E0B',
}

export function SupportEscalations() {
  const active        = ESCALATIONS.filter(e => e.status === 'ACTIVE').length
  const resolvedWeek  = ESCALATIONS.filter(e => e.status === 'RESOLVED').length
  const avgEscTime    = '4.2h'
  const escalationRate= '5.9%'

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ArrowUpCircle size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Escalations</h1>
          <p className="text-sm text-[var(--os-text-2)]">Active and recently resolved escalated support tickets</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Escalations',  value: String(active),       color: '#EF4444' },
          { label: 'Resolved This Week',  value: String(resolvedWeek), color: '#10B981' },
          { label: 'Avg Escalation Time', value: avgEscTime,           color: ACCENT    },
          { label: 'Escalation Rate',     value: escalationRate,       color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Active first, then resolved */}
      <div className="space-y-2">
        {ESCALATIONS.map(e => {
          const sc = STATUS_COLOR[e.status]
          return (
            <div
              key={e.id}
              className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-mono text-[var(--os-text-2)]">{e.id}</p>
                    <span className="text-xs text-[var(--os-text-2)]">→</span>
                    <p className="text-xs font-mono text-[var(--os-text-2)]">{e.ticketId}</p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-700/60 text-[var(--os-text-2)]">
                      {e.path}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">{e.title}</p>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5">{e.client} · Assignee: {e.assignee}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-[var(--os-text-2)]">Days Escalated</p>
                    <p className="text-sm font-semibold text-white">{e.daysEscalated}d</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                    {e.status.charAt(0) + e.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
              <div className="mt-3 p-2.5 rounded-xl bg-slate-800/50 border border-white/5">
                <p className="text-xs text-[var(--os-text-2)] mb-0.5 font-medium">Escalation Reason</p>
                <p className="text-xs text-[var(--os-text-1)]">{e.reason}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

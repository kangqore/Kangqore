import { useState } from 'react'
import { Inbox } from 'lucide-react'

const ACCENT = '#06B6D4'

type TicketPriority = 'P1' | 'P2' | 'P3' | 'P4'
type TicketStatus   = 'OPEN' | 'IN_PROGRESS' | 'ESCALATED' | 'RESOLVED'

interface Ticket {
  id: string
  title: string
  client: string
  priority: TicketPriority
  status: TicketStatus
  assignee: string
  opened: string
  slaStatus: 'OK' | 'AT_RISK' | 'BREACHED'
}

const TICKETS: Ticket[] = [
  { id: 'TKT-1142', title: 'SSO login failure — all users unable to authenticate',   client: 'Acme Corp',          priority: 'P1', status: 'ESCALATED',   assignee: 'Rahul V.',   opened: '2h ago',  slaStatus: 'BREACHED' },
  { id: 'TKT-1141', title: 'API rate limit errors on data export endpoint',          client: 'Acme Corp',          priority: 'P2', status: 'IN_PROGRESS', assignee: 'Kavya R.',   opened: '3h ago',  slaStatus: 'AT_RISK'  },
  { id: 'TKT-1140', title: 'Invoice PDF generation broken — blank output',           client: 'Globex Ltd',         priority: 'P2', status: 'IN_PROGRESS', assignee: 'Sneha G.',   opened: '5h ago',  slaStatus: 'OK'       },
  { id: 'TKT-1139', title: 'Dashboard charts not loading — timeout errors',          client: 'Acme Corp',          priority: 'P2', status: 'OPEN',        assignee: 'Unassigned', opened: '6h ago',  slaStatus: 'AT_RISK'  },
  { id: 'TKT-1138', title: 'User cannot reset password — email not received',        client: 'Initech Group',      priority: 'P3', status: 'OPEN',        assignee: 'Arjun S.',   opened: '8h ago',  slaStatus: 'OK'       },
  { id: 'TKT-1137', title: 'Webhook events not firing for new order creation',       client: 'BlueSky Retail',     priority: 'P3', status: 'IN_PROGRESS', assignee: 'Priya N.',   opened: '12h ago', slaStatus: 'OK'       },
  { id: 'TKT-1136', title: 'Report export timing out for large datasets (>10K rows)',client: 'Pinnacle Finance',   priority: 'P3', status: 'OPEN',        assignee: 'Rahul V.',   opened: '1d ago',  slaStatus: 'OK'       },
  { id: 'TKT-1135', title: 'Feature request: bulk user import from CSV',             client: 'Sterling Partners',  priority: 'P4', status: 'OPEN',        assignee: 'Unassigned', opened: '2d ago',  slaStatus: 'OK'       },
]

const PRIORITY_COLOR: Record<TicketPriority, string> = {
  P1: '#EF4444',
  P2: '#F97316',
  P3: '#F59E0B',
  P4: '#6B7280',
}

const STATUS_COLOR: Record<TicketStatus, string> = {
  OPEN:        '#2564ea',
  IN_PROGRESS: '#8B5CF6',
  ESCALATED:   '#EF4444',
  RESOLVED:    '#10B981',
}

const SLA_COLOR: Record<string, string> = {
  OK:       '#10B981',
  AT_RISK:  '#F59E0B',
  BREACHED: '#EF4444',
}

export function SupportQueue() {
  const [filter, setFilter] = useState<'ALL' | TicketPriority | 'UNASSIGNED'>('ALL')

  const open         = TICKETS.filter(t => t.status !== 'RESOLVED').length
  const slaBreached  = TICKETS.filter(t => t.slaStatus === 'BREACHED').length
  const unassigned   = TICKETS.filter(t => t.assignee === 'Unassigned').length
  const assignedToday = 12

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',        label: 'All' },
    { key: 'P1',         label: 'P1' },
    { key: 'P2',         label: 'P2' },
    { key: 'P3',         label: 'P3' },
    { key: 'UNASSIGNED', label: 'Unassigned' },
  ]

  const visible = filter === 'ALL'
    ? TICKETS
    : filter === 'UNASSIGNED'
      ? TICKETS.filter(t => t.assignee === 'Unassigned')
      : TICKETS.filter(t => t.priority === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Inbox size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Ticket Queue</h1>
          <p className="text-sm text-[var(--os-text-2)]">Live support queue — all open tickets by priority</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Tickets',    value: String(open),            color: ACCENT    },
          { label: 'SLA Breached',    value: String(slaBreached),     color: '#EF4444' },
          { label: 'Avg Response',    value: '2.4h',                  color: '#10B981' },
          { label: 'Assigned Today',  value: String(assignedToday),   color: '#8B5CF6' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === t.key
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Ticket List */}
      <div className="space-y-2">
        {visible.map(t => {
          const pc  = PRIORITY_COLOR[t.priority]
          const sc  = STATUS_COLOR[t.status]
          const slc = SLA_COLOR[t.slaStatus]
          return (
            <div
              key={t.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <span className="text-xs font-bold px-2 py-1 rounded-lg shrink-0" style={{ background: `${pc}22`, color: pc }}>
                {t.priority}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-mono text-[var(--os-text-2)]">{t.id}</p>
                </div>
                <p className="text-sm font-semibold text-white truncate">{t.title}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">{t.client} · {t.opened}</p>
              </div>
              <div className="text-right w-24 shrink-0 hidden sm:block">
                <p className="text-xs text-[var(--os-text-2)]">Assignee</p>
                <p className="text-xs text-[var(--os-text-1)]">{t.assignee}</p>
              </div>
              <div className="text-right w-20 shrink-0 hidden md:block">
                <p className="text-xs text-[var(--os-text-2)]">SLA</p>
                <p className="text-xs font-semibold" style={{ color: slc }}>{t.slaStatus}</p>
              </div>
              <div className="w-28 text-right shrink-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                  {t.status === 'IN_PROGRESS' ? 'In Progress' : t.status.charAt(0) + t.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

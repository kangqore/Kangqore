import { useState } from 'react'
import { Filter } from 'lucide-react'

const ACCENT = '#06B6D4'

type StallReason = 'UNASSIGNED' | 'AWAITING_CUSTOMER' | 'AWAITING_INTERNAL' | 'STALLED'

interface BacklogTicket {
  id: string
  title: string
  client: string
  priority: string
  priorityColor: string
  age: number
  stalled: number
  reason: StallReason
  lastUpdate: string
}

const BACKLOG: BacklogTicket[] = [
  { id: 'TKT-1118', title: 'Recurring export schedule not triggering',           client: 'Acme Corp',         priority: 'P2', priorityColor: '#F97316', age: 11, stalled: 9,  reason: 'AWAITING_INTERNAL', lastUpdate: '12 Jun 2026' },
  { id: 'TKT-1112', title: 'Mobile app push notifications not delivered (iOS)',  client: 'BlueSky Retail',    priority: 'P3', priorityColor: '#F59E0B', age: 10, stalled: 8,  reason: 'AWAITING_INTERNAL', lastUpdate: '13 Jun 2026' },
  { id: 'TKT-1109', title: 'GDPR data export request — full account export',    client: 'Globex Ltd',        priority: 'P2', priorityColor: '#F97316', age: 9,  stalled: 7,  reason: 'AWAITING_INTERNAL', lastUpdate: '14 Jun 2026' },
  { id: 'TKT-1104', title: 'CSV import drops special characters (UTF-8 issue)',  client: 'Initech Group',     priority: 'P3', priorityColor: '#F59E0B', age: 8,  stalled: 6,  reason: 'STALLED',           lastUpdate: '15 Jun 2026' },
  { id: 'TKT-1098', title: 'Duplicate invoices generated for subscription plan', client: 'Pinnacle Finance',  priority: 'P2', priorityColor: '#F97316', age: 8,  stalled: 5,  reason: 'AWAITING_CUSTOMER', lastUpdate: '16 Jun 2026' },
  { id: 'TKT-1090', title: 'Table sorting broken in filtered views',             client: 'Sterling Partners', priority: 'P3', priorityColor: '#F59E0B', age: 7,  stalled: 4,  reason: 'STALLED',           lastUpdate: '16 Jun 2026' },
  { id: 'TKT-1086', title: 'Request: white-label email domain configuration',   client: 'Acme Corp',         priority: 'P4', priorityColor: '#6B7280', age: 6,  stalled: 0,  reason: 'UNASSIGNED',        lastUpdate: '17 Jun 2026' },
  { id: 'TKT-1081', title: 'API rate limit too aggressive for batch operations', client: 'CloudBase Inc',     priority: 'P3', priorityColor: '#F59E0B', age: 5,  stalled: 0,  reason: 'UNASSIGNED',        lastUpdate: '18 Jun 2026' },
  { id: 'TKT-1077', title: 'Notification preferences not saving on mobile',     client: 'Initech Group',     priority: 'P4', priorityColor: '#6B7280', age: 4,  stalled: 0,  reason: 'UNASSIGNED',        lastUpdate: '19 Jun 2026' },
  { id: 'TKT-1074', title: 'Two-factor authentication bypassed on remember me', client: 'Globex Ltd',        priority: 'P2', priorityColor: '#F97316', age: 3,  stalled: 0,  reason: 'AWAITING_CUSTOMER', lastUpdate: '20 Jun 2026' },
]

const REASON_COLOR: Record<StallReason, string> = {
  UNASSIGNED:         '#EF4444',
  AWAITING_CUSTOMER:  '#F59E0B',
  AWAITING_INTERNAL:  '#F97316',
  STALLED:            '#8B5CF6',
}

const REASON_LABEL: Record<StallReason, string> = {
  UNASSIGNED:         'Unassigned',
  AWAITING_CUSTOMER:  'Awaiting Customer',
  AWAITING_INTERNAL:  'Awaiting Internal',
  STALLED:            'Stalled',
}

export function SupportBacklog() {
  const [filter, setFilter] = useState<'ALL' | StallReason>('ALL')

  const totalBacklog = BACKLOG.length
  const unassigned   = BACKLOG.filter(t => t.reason === 'UNASSIGNED').length
  const stalled48h   = BACKLOG.filter(t => t.stalled > 2).length
  const oldest       = Math.max(...BACKLOG.map(t => t.age))

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',               label: 'All' },
    { key: 'UNASSIGNED',        label: 'Unassigned' },
    { key: 'AWAITING_CUSTOMER', label: 'Awaiting Customer' },
    { key: 'AWAITING_INTERNAL', label: 'Awaiting Internal' },
    { key: 'STALLED',           label: 'Stalled' },
  ]

  const visible = filter === 'ALL' ? BACKLOG : BACKLOG.filter(t => t.reason === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Filter size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Support Backlog</h1>
          <p className="text-sm text-[var(--os-text-2)]">Unassigned and stalled tickets requiring attention</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Backlog',   value: String(totalBacklog), color: ACCENT    },
          { label: 'Unassigned',      value: String(unassigned),   color: '#EF4444' },
          { label: 'Stalled >48h',    value: String(stalled48h),   color: '#F97316' },
          { label: 'Oldest Ticket',   value: `${oldest}d`,         color: '#F59E0B' },
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

      {/* Backlog List */}
      <div className="space-y-2">
        {visible.map(t => {
          const rc = REASON_COLOR[t.reason]
          const pc = t.priorityColor
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
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">{t.client} · Last updated: {t.lastUpdate}</p>
              </div>
              <div className="text-right w-20 shrink-0 hidden sm:block">
                <p className="text-xs text-[var(--os-text-2)]">Age</p>
                <p className="text-sm font-semibold" style={{ color: t.age >= 7 ? '#EF4444' : t.age >= 4 ? '#F59E0B' : '#10B981' }}>
                  {t.age}d
                </p>
              </div>
              <div className="text-right w-20 shrink-0 hidden md:block">
                <p className="text-xs text-[var(--os-text-2)]">Stalled</p>
                <p className="text-sm font-semibold" style={{ color: t.stalled >= 5 ? '#EF4444' : t.stalled >= 2 ? '#F59E0B' : '#10B981' }}>
                  {t.stalled > 0 ? `${t.stalled}d` : '—'}
                </p>
              </div>
              <div className="w-36 text-right shrink-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${rc}22`, color: rc }}>
                  {REASON_LABEL[t.reason]}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

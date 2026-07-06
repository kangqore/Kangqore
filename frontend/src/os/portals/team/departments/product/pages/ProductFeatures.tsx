import { ListChecks, Brain } from 'lucide-react'

const FEATURES = [
  { id: 'F-001', title: 'Offline mode — full app',           source: 'Customer',  client: 'Multiple (12)',     priority: 'High',   votes: 48, status: 'Backlog'     },
  { id: 'F-002', title: 'SSO Enterprise (SAML/OAuth)',       source: 'Customer',  client: 'Enterprise Tier',   priority: 'High',   votes: 34, status: 'In Review'   },
  { id: 'F-003', title: 'Custom report builder',             source: 'Customer',  client: 'Zenith Corp',       priority: 'High',   votes: 29, status: 'Backlog'     },
  { id: 'F-004', title: 'Mobile push notifications',         source: 'Customer',  client: 'Apex Holdings',     priority: 'High',   votes: 27, status: 'Accepted'    },
  { id: 'F-005', title: 'Bulk data export (CSV/Excel)',      source: 'Customer',  client: 'Meridian Group',    priority: 'High',   votes: 22, status: 'In Review'   },
  { id: 'F-006', title: 'KIMMP briefing email digest',       source: 'Internal',  client: '—',                 priority: 'Medium', votes: 18, status: 'In Review'   },
  { id: 'F-007', title: 'Kanban board custom columns',       source: 'Customer',  client: 'BrightPath Ltd',    priority: 'Medium', votes: 15, status: 'Backlog'     },
  { id: 'F-008', title: 'Two-factor authentication (TOTP)',  source: 'Internal',  client: '—',                 priority: 'Medium', votes: 14, status: 'Accepted'    },
  { id: 'F-009', title: 'AI-generated sprint summaries',     source: 'Internal',  client: '—',                 priority: 'Medium', votes: 11, status: 'Backlog'     },
  { id: 'F-010', title: 'White-label portal option',         source: 'Research',  client: '—',                 priority: 'Low',    votes: 8,  status: 'Backlog'     },
]

const PRIORITY_COLOR: Record<string, string> = {
  High:   '#EF4444',
  Medium: '#F59E0B',
  Low:    '#10B981',
}

const STATUS_COLOR: Record<string, string> = {
  'Backlog':   '#64748B',
  'In Review': '#F59E0B',
  'Accepted':  '#10B981',
}

const SOURCE_COLOR: Record<string, string> = {
  Customer: '#A855F7',
  Internal: '#6366F1',
  Research: '#06B6D4',
}

export function ProductFeatures() {
  const total      = FEATURES.length
  const highPri    = FEATURES.filter(f => f.priority === 'High').length
  const inReview   = FEATURES.filter(f => f.status === 'In Review').length
  const accepted   = FEATURES.filter(f => f.status === 'Accepted').length

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <ListChecks className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Feature Backlog</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Customer and internal feature requests, prioritised by votes and strategic fit.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Features',    value: total.toString(),       color: '#A855F7' },
          { label: 'High Priority',     value: highPri.toString(),     color: '#EF4444' },
          { label: 'In Review',         value: inReview.toString(),    color: '#F59E0B' },
          { label: 'Accepted (Month)',  value: accepted.toString(),    color: '#10B981' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* KIMMP Insight */}
      <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/10 flex items-start gap-3">
        <Brain className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-purple-200">
          <span className="font-semibold text-purple-300">KIMMP:</span>{' '}
          Top 5 customer-requested features share a common theme: offline mode. 12 accounts (£1.4M ARR) have requested this. Recommend moving to Next quarter.
        </p>
      </div>

      {/* Feature table */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-2">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider mb-3">All Features</h2>
        {/* Header */}
        <div className="flex items-center gap-4 pb-2 border-b border-white/10 text-[11px] font-semibold text-[var(--os-text-2)] uppercase tracking-wider">
          <span className="w-16 flex-shrink-0">ID</span>
          <span className="flex-1">Feature</span>
          <span className="w-20 flex-shrink-0">Source</span>
          <span className="w-28 flex-shrink-0">Client</span>
          <span className="w-16 text-right flex-shrink-0">Priority</span>
          <span className="w-14 text-right flex-shrink-0">Votes</span>
          <span className="w-20 text-right flex-shrink-0">Status</span>
        </div>
        {FEATURES.map(f => (
          <div key={f.id} className="flex items-center gap-4 py-2.5 border-b border-white/[0.05] last:border-0">
            <span className="text-xs text-[var(--os-text-2)] font-mono w-16 flex-shrink-0">{f.id}</span>
            <span className="flex-1 text-sm text-[var(--os-text-1)]">{f.title}</span>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded w-20 text-center flex-shrink-0"
              style={{ color: SOURCE_COLOR[f.source], background: `${SOURCE_COLOR[f.source]}22` }}>
              {f.source}
            </span>
            <span className="text-xs text-[var(--os-text-2)] w-28 flex-shrink-0 truncate">{f.client}</span>
            <span className="text-xs font-bold w-16 text-right flex-shrink-0"
              style={{ color: PRIORITY_COLOR[f.priority] }}>{f.priority}</span>
            <span className="text-sm font-bold text-white w-14 text-right flex-shrink-0">↑ {f.votes}</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full w-20 text-center flex-shrink-0"
              style={{ color: STATUS_COLOR[f.status], background: `${STATUS_COLOR[f.status]}22` }}>
              {f.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

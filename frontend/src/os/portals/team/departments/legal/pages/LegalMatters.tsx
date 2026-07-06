import { useState } from 'react'
import { Scale } from 'lucide-react'

const ACCENT = '#F59E0B'

type MatterStatus   = 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED'
type MatterPriority = 'HIGH' | 'MEDIUM' | 'LOW'

interface Matter {
  id: string
  title: string
  type: string
  priority: MatterPriority
  status: MatterStatus
  opened: string
  counsel: string
  estCost: number
}

const MATTERS: Matter[] = [
  { id: 'MTR-0021', title: 'Ex-employee IP ownership dispute',        type: 'IP',                priority: 'HIGH',   status: 'ACTIVE',        opened: '14 Apr 2026', counsel: 'Sarah Chen',   estCost: 28000 },
  { id: 'MTR-0020', title: 'Unfair dismissal claim — Raj Sharma',     type: 'Employment',        priority: 'HIGH',   status: 'INVESTIGATING', opened: '02 May 2026', counsel: 'Lucy Brennan', estCost: 18000 },
  { id: 'MTR-0019', title: 'DataSync contract dispute — late delivery',type: 'Commercial',        priority: 'MEDIUM', status: 'ACTIVE',        opened: '10 Mar 2026', counsel: 'Tom Walsh',    estCost: 12000 },
  { id: 'MTR-0018', title: 'ICO data subject access request',         type: 'Data Protection',   priority: 'MEDIUM', status: 'ACTIVE',        opened: '18 Mar 2026', counsel: 'Sarah Chen',   estCost: 6000  },
  { id: 'MTR-0017', title: 'GDPR complaint — marketing opt-out breach',type: 'Regulatory',       priority: 'MEDIUM', status: 'INVESTIGATING', opened: '05 Apr 2026', counsel: 'Priya Nair',   estCost: 9000  },
  { id: 'MTR-0016', title: 'Supplier payment dispute — Acme Ltd',     type: 'Commercial',        priority: 'LOW',    status: 'ACTIVE',        opened: '22 Feb 2026', counsel: 'Tom Walsh',    estCost: 4000  },
  { id: 'MTR-0015', title: 'Trade mark filing — WAANDA brand EU',     type: 'IP',                priority: 'LOW',    status: 'ACTIVE',        opened: '01 Feb 2026', counsel: 'James Okafor', estCost: 5000  },
  { id: 'MTR-0014', title: 'COVID-era VAT refund application',        type: 'Regulatory',        priority: 'LOW',    status: 'RESOLVED',      opened: '10 Jan 2026', counsel: 'Lucy Brennan', estCost: 2000  },
]

const STATUS_COLOR: Record<MatterStatus, string> = {
  ACTIVE:        '#EF4444',
  INVESTIGATING: '#F59E0B',
  RESOLVED:      '#10B981',
}

const PRIORITY_COLOR: Record<MatterPriority, string> = {
  HIGH:   '#EF4444',
  MEDIUM: '#F59E0B',
  LOW:    '#6B7280',
}

const TYPE_COLOR: Record<string, string> = {
  Employment:       '#8B5CF6',
  IP:               '#3B82F6',
  Commercial:       '#F97316',
  Regulatory:       '#EC4899',
  'Data Protection':'#14B8A6',
}

function fmtCost(n: number) {
  if (n >= 1000) return `£${(n / 1000).toFixed(0)}K`
  return `£${n}`
}

export function LegalMatters() {
  const [filter, setFilter] = useState<'ALL' | MatterStatus>('ALL')

  const active      = MATTERS.filter(m => m.status === 'ACTIVE').length
  const highPriority= MATTERS.filter(m => m.priority === 'HIGH').length
  const resolvedMTD = MATTERS.filter(m => m.status === 'RESOLVED').length
  const estLegalCost= MATTERS.reduce((a, m) => a + m.estCost, 0)

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',           label: 'All' },
    { key: 'ACTIVE',        label: 'Active' },
    { key: 'INVESTIGATING', label: 'Investigating' },
    { key: 'RESOLVED',      label: 'Resolved' },
  ]

  const visible = filter === 'ALL' ? MATTERS : MATTERS.filter(m => m.status === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Scale size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Legal Matters</h1>
          <p className="text-sm text-[var(--os-text-2)]">Active disputes, regulatory matters & IP proceedings</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Matters',      value: String(active),          color: '#EF4444' },
          { label: 'High Priority',       value: String(highPriority),    color: '#F59E0B' },
          { label: 'Resolved MTD',        value: String(resolvedMTD),     color: '#10B981' },
          { label: 'Est. Legal Cost',     value: fmtCost(estLegalCost),   color: '#F59E0B' },
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
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {visible.map(m => {
          const sc = STATUS_COLOR[m.status]
          const pc = PRIORITY_COLOR[m.priority]
          const tc = TYPE_COLOR[m.type] ?? '#94A3B8'
          return (
            <div
              key={m.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-mono text-[var(--os-text-2)]">{m.id}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>
                    {m.type}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${pc}22`, color: pc }}>
                    {m.priority}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white truncate">{m.title}</p>
              </div>
              <div className="text-right w-28 shrink-0 hidden sm:block">
                <p className="text-xs text-[var(--os-text-2)]">Counsel</p>
                <p className="text-xs text-[var(--os-text-1)]">{m.counsel}</p>
              </div>
              <div className="text-right w-24 shrink-0 hidden md:block">
                <p className="text-xs text-[var(--os-text-2)]">Opened</p>
                <p className="text-xs text-[var(--os-text-1)]">{m.opened}</p>
              </div>
              <div className="text-right w-20 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Est. Cost</p>
                <p className="text-sm font-semibold text-white">{fmtCost(m.estCost)}</p>
              </div>
              <div className="w-28 text-right shrink-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                  {m.status.charAt(0) + m.status.slice(1).toLowerCase().replace('_', ' ')}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

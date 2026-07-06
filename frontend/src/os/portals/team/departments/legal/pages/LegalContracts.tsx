import { useState } from 'react'
import { Handshake } from 'lucide-react'

const ACCENT = '#F59E0B'

type ContractStatus = 'ACTIVE' | 'EXPIRING' | 'UNDER_REVIEW' | 'EXPIRED'

interface Contract {
  id: string
  party: string
  type: string
  value: number
  startDate: string
  expiry: string
  status: ContractStatus
  renewalOwner: string
  notes: string
}

const CONTRACTS: Contract[] = [
  { id: 'CTR-0091', party: 'Acme Corp',           type: 'MSA',        value: 240000, startDate: '01 Jan 2025', expiry: '31 Dec 2026', status: 'ACTIVE',       renewalOwner: 'Sarah Chen',   notes: 'Primary MSA covering all Acme service lines. Auto-renew clause in §12.4.' },
  { id: 'CTR-0088', party: 'Vertex Technologies', type: 'SLA',        value: 84000,  startDate: '01 Mar 2025', expiry: '28 Feb 2027', status: 'ACTIVE',       renewalOwner: 'Tom Walsh',    notes: 'Uptime SLA at 99.9%. Penalty clauses apply from month 3.' },
  { id: 'CTR-0085', party: 'Bright Analytics',    type: 'MSA',        value: 60000,  startDate: '15 Jun 2025', expiry: '14 Jul 2026', status: 'EXPIRING',     renewalOwner: 'Lucy Brennan', notes: 'MSA expires in 21 days. Renewal proposal sent 10 Jun.' },
  { id: 'CTR-0083', party: 'PrimeFix Ltd',        type: 'Supplier',   value: 24000,  startDate: '01 Apr 2024', expiry: '31 Mar 2026', status: 'EXPIRING',     renewalOwner: 'James Okafor', notes: 'Facilities maintenance contract. Rate card renegotiation underway.' },
  { id: 'CTR-0079', party: 'Synergy HR Consult',  type: 'Employment', value: 48000,  startDate: '01 Feb 2026', expiry: '31 Jan 2027', status: 'ACTIVE',       renewalOwner: 'Priya Nair',   notes: 'Fixed-term employment contract. IR35 assessment completed.' },
  { id: 'CTR-0075', party: 'CloudBase Inc',       type: 'SLA',        value: 120000, startDate: '01 Jan 2026', expiry: '31 Dec 2026', status: 'UNDER_REVIEW', renewalOwner: 'Raj Patel',    notes: 'Under review following SLA breach in May. Legal drafted amendment.' },
  { id: 'CTR-0068', party: 'Horizon Media',       type: 'NDA',        value: 0,      startDate: '10 Nov 2024', expiry: '09 Nov 2026', status: 'ACTIVE',       renewalOwner: 'Sarah Chen',   notes: 'Mutual NDA covering strategic partnership discussions.' },
  { id: 'CTR-0044', party: 'DataSync Europe',     type: 'MSA',        value: 36000,  startDate: '01 Jul 2023', expiry: '30 Jun 2025', status: 'EXPIRED',      renewalOwner: 'Tom Walsh',    notes: 'Expired. Relationship paused. Archive after 7-year retention period.' },
]

const STATUS_COLOR: Record<ContractStatus, string> = {
  ACTIVE:       '#10B981',
  EXPIRING:     '#F59E0B',
  UNDER_REVIEW: '#2564ea',
  EXPIRED:      'var(--os-text-2)',
}

const STATUS_LABEL: Record<ContractStatus, string> = {
  ACTIVE:       'Active',
  EXPIRING:     'Expiring',
  UNDER_REVIEW: 'Under Review',
  EXPIRED:      'Expired',
}

const TYPE_COLOR: Record<string, string> = {
  MSA:        '#8B5CF6',
  SLA:        '#3B82F6',
  NDA:        '#14B8A6',
  Employment: '#EC4899',
  Supplier:   '#F97316',
}

function fmtVal(v: number) {
  if (v === 0) return '—'
  if (v >= 1000) return `£${(v / 1000).toFixed(0)}K`
  return `£${v}`
}

export function LegalContracts() {
  const [filter, setFilter]   = useState<'ALL' | ContractStatus>('ALL')
  const [expanded, setExpanded] = useState<string | null>(null)

  const active      = CONTRACTS.filter(c => c.status === 'ACTIVE').length
  const expiring    = CONTRACTS.filter(c => c.status === 'EXPIRING').length
  const underReview = CONTRACTS.filter(c => c.status === 'UNDER_REVIEW').length
  const valueAtRisk = CONTRACTS.filter(c => c.status === 'EXPIRING' || c.status === 'UNDER_REVIEW')
    .reduce((a, c) => a + c.value, 0)

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',          label: 'All' },
    { key: 'ACTIVE',       label: 'Active' },
    { key: 'EXPIRING',     label: 'Expiring' },
    { key: 'UNDER_REVIEW', label: 'Pending Review' },
  ]

  const visible = filter === 'ALL' ? CONTRACTS : CONTRACTS.filter(c => c.status === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Handshake size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Contract Register</h1>
          <p className="text-sm text-[var(--os-text-2)]">All active, expiring, and historical contracts — managed by Legal</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Contracts', value: String(active),         color: '#10B981' },
          { label: 'Expiring 30d',     value: String(expiring),       color: '#F59E0B' },
          { label: 'Pending Review',   value: String(underReview),    color: '#2564ea' },
          { label: 'Value at Risk',    value: fmtVal(valueAtRisk),    color: '#EF4444' },
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
        {visible.map(c => {
          const sc = STATUS_COLOR[c.status]
          const tc = TYPE_COLOR[c.type] ?? '#94A3B8'
          const isOpen = expanded === c.id
          return (
            <div key={c.id} className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
              <button
                className="w-full flex items-center gap-4 p-4 hover:bg-slate-900/60 transition-colors text-left"
                onClick={() => setExpanded(isOpen ? null : c.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-mono text-[var(--os-text-2)]">{c.id}</p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>
                      {c.type}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">{c.party}</p>
                </div>
                <div className="text-right w-24 shrink-0 hidden sm:block">
                  <p className="text-xs text-[var(--os-text-2)]">Value</p>
                  <p className="text-sm font-semibold text-white">{fmtVal(c.value)}</p>
                </div>
                <div className="text-right w-28 shrink-0 hidden md:block">
                  <p className="text-xs text-[var(--os-text-2)]">Expiry</p>
                  <p className="text-xs text-[var(--os-text-1)]">{c.expiry}</p>
                </div>
                <div className="w-28 text-right shrink-0">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                    {STATUS_LABEL[c.status]}
                  </span>
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-0 border-t border-white/5 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-[var(--os-text-2)] mb-0.5">Start Date</p>
                      <p className="text-sm text-[var(--os-text-1)]">{c.startDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--os-text-2)] mb-0.5">Expiry Date</p>
                      <p className="text-sm text-[var(--os-text-1)]">{c.expiry}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--os-text-2)] mb-0.5">Contract Value</p>
                      <p className="text-sm font-semibold text-white">{fmtVal(c.value)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--os-text-2)] mb-0.5">Renewal Owner</p>
                      <p className="text-sm text-[var(--os-text-1)]">{c.renewalOwner}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-white/5">
                    <p className="text-xs text-[var(--os-text-2)] mb-1">Notes</p>
                    <p className="text-xs text-[var(--os-text-1)]">{c.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

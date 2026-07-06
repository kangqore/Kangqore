import { useState } from 'react'
import { FileText } from 'lucide-react'

const ACCENT = '#F59E0B'

type NDAStatus = 'ACTIVE' | 'EXPIRING' | 'EXPIRED'
type NDAType   = 'Mutual' | 'One-Way'

interface NDA {
  id: string
  counterparty: string
  type: NDAType
  signed: string
  expiry: string
  purpose: string
  status: NDAStatus
}

const NDAS: NDA[] = [
  { id: 'NDA-0023', counterparty: 'Horizon Media Group',     type: 'Mutual',  signed: '10 Nov 2024', expiry: '09 Nov 2026', purpose: 'Partnership discussion',   status: 'ACTIVE'   },
  { id: 'NDA-0022', counterparty: 'Apex Ventures Ltd',       type: 'Mutual',  signed: '03 Feb 2025', expiry: '02 Feb 2027', purpose: 'M&A due diligence',         status: 'ACTIVE'   },
  { id: 'NDA-0021', counterparty: 'Candidate: A. Mehta',     type: 'One-Way', signed: '15 Mar 2026', expiry: '14 Mar 2027', purpose: 'Recruitment',               status: 'ACTIVE'   },
  { id: 'NDA-0020', counterparty: 'Candidate: D. Okonkwo',   type: 'One-Way', signed: '02 Apr 2026', expiry: '01 Apr 2027', purpose: 'Recruitment',               status: 'ACTIVE'   },
  { id: 'NDA-0019', counterparty: 'CloudBase Inc',           type: 'Mutual',  signed: '01 Jun 2025', expiry: '31 Aug 2026', purpose: 'Vendor evaluation',         status: 'EXPIRING' },
  { id: 'NDA-0018', counterparty: 'Vertex Technologies',     type: 'Mutual',  signed: '10 Jan 2025', expiry: '09 Jul 2026', purpose: 'Partnership discussion',    status: 'EXPIRING' },
  { id: 'NDA-0017', counterparty: 'Synergy Analytics Ltd',   type: 'One-Way', signed: '20 Aug 2024', expiry: '19 Aug 2026', purpose: 'Vendor evaluation',         status: 'ACTIVE'   },
  { id: 'NDA-0009', counterparty: 'DataSync Europe',         type: 'Mutual',  signed: '01 Mar 2023', expiry: '28 Feb 2025', purpose: 'Partnership discussion',    status: 'EXPIRED'  },
]

const STATUS_COLOR: Record<NDAStatus, string> = {
  ACTIVE:   '#10B981',
  EXPIRING: '#F59E0B',
  EXPIRED:  'var(--os-text-2)',
}

const TYPE_COLOR: Record<NDAType, string> = {
  Mutual:  '#8B5CF6',
  'One-Way': '#06B6D4',
}

export function LegalNDAs() {
  const [filter, setFilter] = useState<'ALL' | NDAStatus>('ALL')

  const active   = NDAS.filter(n => n.status === 'ACTIVE').length
  const expiring = NDAS.filter(n => n.status === 'EXPIRING').length
  const mutual   = NDAS.filter(n => n.type === 'Mutual').length
  const oneWay   = NDAS.filter(n => n.type === 'One-Way').length

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',      label: 'All' },
    { key: 'ACTIVE',   label: 'Active' },
    { key: 'EXPIRING', label: 'Expiring' },
    { key: 'EXPIRED',  label: 'Expired' },
  ]

  const visible = filter === 'ALL' ? NDAS : NDAS.filter(n => n.status === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <FileText size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">NDA Tracker</h1>
          <p className="text-sm text-[var(--os-text-2)]">Non-disclosure agreements — mutual and one-way, all parties</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active NDAs',   value: String(active),             color: '#10B981' },
          { label: 'Expiring 90d',  value: String(expiring),           color: '#F59E0B' },
          { label: 'Mutual',        value: String(mutual),             color: '#8B5CF6' },
          { label: 'One-Way',       value: String(oneWay),             color: '#06B6D4' },
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
        {visible.map(n => {
          const sc = STATUS_COLOR[n.status]
          const tc = TYPE_COLOR[n.type]
          return (
            <div
              key={n.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-mono text-[var(--os-text-2)]">{n.id}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>
                    {n.type}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">{n.counterparty}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">{n.purpose}</p>
              </div>
              <div className="text-right w-28 shrink-0 hidden sm:block">
                <p className="text-xs text-[var(--os-text-2)]">Signed</p>
                <p className="text-xs text-[var(--os-text-1)]">{n.signed}</p>
              </div>
              <div className="text-right w-28 shrink-0 hidden md:block">
                <p className="text-xs text-[var(--os-text-2)]">Expires</p>
                <p className="text-xs text-[var(--os-text-1)]">{n.expiry}</p>
              </div>
              <div className="w-24 text-right shrink-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                  {n.status.charAt(0) + n.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

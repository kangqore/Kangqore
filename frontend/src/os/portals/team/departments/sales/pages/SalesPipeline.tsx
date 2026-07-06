import { useState } from 'react'
import { Funnel } from 'lucide-react'

const ACCENT = '#0EA5E9'

type DealStage  = 'Prospect' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost'
type DealStatus = DealStage

interface PipelineStage {
  stage: DealStage
  deals: number
  value: string
  color: string
}

interface Deal {
  id:       string
  client:   string
  product:  string
  value:    string
  stage:    DealStage
  owner:    string
  prob:     number
}

const STAGES: PipelineStage[] = [
  { stage: 'Prospect',    deals: 8,  value: '£420k', color: '#6B7280' },
  { stage: 'Qualified',   deals: 5,  value: '£310k', color: '#8B5CF6' },
  { stage: 'Proposal',    deals: 4,  value: '£280k', color: '#F59E0B' },
  { stage: 'Negotiation', deals: 3,  value: '£190k', color: '#F97316' },
  { stage: 'Closed Won',  deals: 12, value: '£840k', color: '#10B981' },
  { stage: 'Closed Lost', deals: 7,  value: '£380k', color: '#EF4444' },
]

const DEALS: Deal[] = [
  { id: 'DL-001', client: 'Acme Corp',   product: 'Enterprise OS Licence',   value: '£120k', stage: 'Negotiation', owner: 'Arjun Shah',  prob: 85 },
  { id: 'DL-002', client: 'FinServ Ltd', product: 'BIDS Implementation',     value: '£280k', stage: 'Proposal',    owner: 'Meera Nair',  prob: 60 },
  { id: 'DL-003', client: 'Techwave',    product: 'Kangqore Cognition',      value: '£95k',  stage: 'Qualified',   owner: 'Dev Patel',   prob: 40 },
  { id: 'DL-004', client: 'GlobalMed',   product: 'Shield + Compliance',     value: '£340k', stage: 'Negotiation', owner: 'Arjun Shah',  prob: 90 },
]

const STAGE_COLOR: Record<string, string> = {
  'Prospect':    '#6B7280',
  'Qualified':   '#8B5CF6',
  'Proposal':    '#F59E0B',
  'Negotiation': '#F97316',
  'Closed Won':  '#10B981',
  'Closed Lost': '#EF4444',
}

export function SalesPipeline() {
  const [filter, setFilter] = useState<DealStatus | 'ALL'>('ALL')

  const visible = filter === 'ALL' ? DEALS : DEALS.filter(d => d.stage === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Funnel size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Pipeline</h1>
          <p className="text-sm text-[var(--os-text-2)]">Deal pipeline overview — stage summary and recent deals</p>
        </div>
      </div>

      {/* KIMMP Insight */}
      <div className="flex items-start gap-3 p-4 rounded-2xl border border-sky-500/30 bg-sky-500/10">
        <div className="w-6 h-6 rounded-full bg-sky-500/30 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-xs font-bold text-sky-400">K</span>
        </div>
        <p className="text-sm text-sky-300">
          <span className="font-semibold">KIMMP:</span> GlobalMed deal has 90% close probability. Recommend executive sponsor call before 2026-07-01 to hit Q2 close.
        </p>
      </div>

      {/* Stage Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {STAGES.map(s => (
          <div
            key={s.stage}
            className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl cursor-pointer hover:bg-slate-900/60 transition-colors"
            onClick={() => setFilter(filter === s.stage ? 'ALL' : s.stage as DealStatus)}
            style={{ borderColor: filter === s.stage ? `${s.color}60` : undefined }}
          >
            <p className="text-xs text-[var(--os-text-2)] font-medium uppercase tracking-wider truncate">{s.stage}</p>
            <p className="text-xl font-bold mt-1" style={{ color: s.color }}>{s.deals}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'Prospect', 'Qualified', 'Proposal', 'Negotiation'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f
                ? 'text-white'
                : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
            style={filter === f ? { background: ACCENT } : undefined}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Deals Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Deal ID</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Client</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider hidden md:table-cell">Product</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Value</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Stage</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider hidden lg:table-cell">Owner</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Prob</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((d, i) => {
              const sc = STAGE_COLOR[d.stage]
              return (
                <tr key={d.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                  <td className="px-5 py-3 font-mono text-xs text-[var(--os-text-2)]">{d.id}</td>
                  <td className="px-5 py-3 text-white font-semibold">{d.client}</td>
                  <td className="px-5 py-3 text-[var(--os-text-2)] hidden md:table-cell">{d.product}</td>
                  <td className="px-5 py-3 text-white font-bold">{d.value}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                      {d.stage}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[var(--os-text-2)] hidden lg:table-cell">{d.owner}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${d.prob}%`, background: d.prob >= 80 ? '#10B981' : d.prob >= 50 ? '#F59E0B' : '#6B7280' }}
                        />
                      </div>
                      <span className="text-xs text-[var(--os-text-2)]">{d.prob}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

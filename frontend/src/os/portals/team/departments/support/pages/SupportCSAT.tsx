import { Star } from 'lucide-react'

const ACCENT = '#06B6D4'

interface AgentCSAT {
  name: string
  ticketsClosed: number
  csat: number
  fiveStarPct: number
  trend: '↑' | '↓' | '→'
  trendColor: string
}

const AGENTS: AgentCSAT[] = [
  { name: 'Rahul V.',  ticketsClosed: 89, csat: 4.8, fiveStarPct: 89, trend: '↑', trendColor: '#10B981' },
  { name: 'Kavya R.', ticketsClosed: 76, csat: 4.7, fiveStarPct: 84, trend: '↑', trendColor: '#10B981' },
  { name: 'Sneha G.', ticketsClosed: 64, csat: 4.5, fiveStarPct: 73, trend: '→', trendColor: '#F59E0B' },
  { name: 'Priya N.', ticketsClosed: 52, csat: 4.4, fiveStarPct: 67, trend: '→', trendColor: '#F59E0B' },
  { name: 'Arjun S.', ticketsClosed: 31, csat: 4.2, fiveStarPct: 58, trend: '↓', trendColor: '#EF4444' },
]

const MONTHLY_TREND = [
  { month: 'Jan 2026', csat: 4.3 },
  { month: 'Feb 2026', csat: 4.4 },
  { month: 'Mar 2026', csat: 4.5 },
  { month: 'Apr 2026', csat: 4.6 },
  { month: 'May 2026', csat: 4.7 },
  { month: 'Jun 2026', csat: 4.6 },
]

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          fill={i <= Math.floor(score) ? '#F59E0B' : 'none'}
          stroke={i <= Math.ceil(score) ? '#F59E0B' : 'var(--os-text-2)'}
        />
      ))}
    </div>
  )
}

export function SupportCSAT() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Star size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">CSAT</h1>
          <p className="text-sm text-[var(--os-text-2)]">Customer satisfaction scores — Q2 2026 (312 responses)</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall CSAT', value: '4.6★', color: '#F59E0B' },
          { label: 'NPS',          value: '42',   color: '#10B981' },
          { label: '5-Star Rate',  value: '68%',  color: ACCENT    },
          { label: 'Responses',    value: '312',  color: '#8B5CF6' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Agent Performance Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <p className="text-sm font-semibold text-white">Agent CSAT Breakdown</p>
        </div>
        <div className="divide-y divide-[var(--os-border)]">
          {AGENTS.map((agent, idx) => (
            <div key={agent.name} className="flex items-center gap-4 p-4 hover:bg-slate-800/30 transition-colors">
              <div className="w-6 text-center text-xs text-[var(--os-text-2)] font-mono shrink-0">#{idx + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{agent.name}</p>
                <div className="mt-1">
                  <StarRating score={agent.csat} />
                </div>
              </div>
              <div className="text-right w-24 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Tickets</p>
                <p className="text-sm font-semibold text-white">{agent.ticketsClosed}</p>
              </div>
              <div className="text-right w-20 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">CSAT</p>
                <p className="text-sm font-bold" style={{ color: '#F59E0B' }}>{agent.csat}★</p>
              </div>
              <div className="text-right w-20 shrink-0 hidden sm:block">
                <p className="text-xs text-[var(--os-text-2)]">5-Star %</p>
                <p className="text-sm font-semibold text-white">{agent.fiveStarPct}%</p>
              </div>
              <div className="w-16 text-right shrink-0">
                <span className="text-lg font-bold" style={{ color: agent.trendColor }}>{agent.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <p className="text-sm font-semibold text-white">Monthly CSAT Trend — H1 2026</p>
        </div>
        <div className="p-4">
          <div className="flex items-end gap-3 flex-wrap">
            {MONTHLY_TREND.map(m => {
              const pct = ((m.csat - 4.0) / 1.0) * 100
              const color = m.csat >= 4.6 ? '#10B981' : m.csat >= 4.4 ? '#F59E0B' : '#EF4444'
              return (
                <div key={m.month} className="flex flex-col items-center gap-1 flex-1 min-w-[60px]">
                  <p className="text-sm font-bold" style={{ color }}>{m.csat}</p>
                  <div className="w-full bg-slate-700/50 rounded-full overflow-hidden h-16 flex items-end">
                    <div className="w-full rounded-t-sm transition-all" style={{ height: `${pct}%`, background: color, minHeight: '4px' }} />
                  </div>
                  <p className="text-xs text-[var(--os-text-2)] text-center">{m.month.split(' ')[0]}</p>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-[var(--os-text-2)] mt-3">Scale: 4.0 – 5.0 · Target ≥ 4.5</p>
        </div>
      </div>
    </div>
  )
}

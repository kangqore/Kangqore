import { Heart } from 'lucide-react'

const ACCENT = '#14B8A6'

interface AtRiskAccount {
  name:         string
  score:        number
  daysSince:    number
  openTickets:  number
  renewal:      string
}

const AT_RISK: AtRiskAccount[] = [
  { name: 'FinServ Ltd',    score: 61, daysSince: 8,  openTickets: 3, renewal: '2026-07-28' },
  { name: 'ManuFlex',      score: 74, daysSince: 6,  openTickets: 2, renewal: '2026-09-30' },
  { name: 'TechScale',     score: 79, daysSince: 5,  openTickets: 1, renewal: '2026-11-30' },
  { name: 'InfoBridge',    score: 68, daysSince: 12, openTickets: 4, renewal: '2026-08-15' },
  { name: 'CloudPeak',     score: 72, daysSince: 9,  openTickets: 2, renewal: '2026-10-01' },
  { name: 'AgileSystems',  score: 65, daysSince: 14, openTickets: 5, renewal: '2026-07-15' },
]

const TREND_WEEKS = [
  { label: 'W1', healthy: 35, atRisk: 8, critical: 4 },
  { label: 'W2', healthy: 36, atRisk: 7, critical: 4 },
  { label: 'W3', healthy: 36, atRisk: 8, critical: 3 },
  { label: 'W4', healthy: 37, atRisk: 7, critical: 3 },
  { label: 'W5', healthy: 37, atRisk: 8, critical: 3 },
  { label: 'W6', healthy: 38, atRisk: 6, critical: 3 },
  { label: 'W7', healthy: 38, atRisk: 7, critical: 3 },
  { label: 'W8', healthy: 38, atRisk: 6, critical: 3 },
]

const maxTotal = Math.max(...TREND_WEEKS.map(w => w.healthy + w.atRisk + w.critical))

export function CSHealth() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Heart size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Health Dashboard</h1>
          <p className="text-sm text-[var(--os-text-2)]">Account health distribution, trends, and at-risk watchlist</p>
        </div>
      </div>

      {/* Distribution */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Healthy',  value: 38, color: '#10B981', bg: '#10B98120' },
          { label: 'At Risk',  value: 6,  color: '#F59E0B', bg: '#F59E0B20' },
          { label: 'Critical', value: 3,  color: '#EF4444', bg: '#EF444420' },
        ].map(d => (
          <div key={d.label} className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl text-center" style={{ borderColor: `${d.color}30` }}>
            <p className="text-4xl font-bold mb-1" style={{ color: d.color }}>{d.value}</p>
            <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider">{d.label}</p>
          </div>
        ))}
      </div>

      {/* Health Trend Chart */}
      <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] mb-4">8-Week Health Trend</h2>
        <div className="flex items-end gap-2 h-36">
          {TREND_WEEKS.map(w => {
            const total   = w.healthy + w.atRisk + w.critical
            const pct     = (total / maxTotal) * 100
            const hPct    = (w.healthy  / total) * 100
            const aPct    = (w.atRisk   / total) * 100
            const cPct    = (w.critical / total) * 100
            return (
              <div key={w.label} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t overflow-hidden flex flex-col-reverse" style={{ height: `${pct}%` }}>
                  <div style={{ height: `${hPct}%`, background: '#10B981' }} />
                  <div style={{ height: `${aPct}%`, background: '#F59E0B' }} />
                  <div style={{ height: `${cPct}%`, background: '#EF4444' }} />
                </div>
                <span className="text-xs text-[var(--os-text-2)]">{w.label}</span>
              </div>
            )
          })}
        </div>
        <div className="flex gap-4 mt-3">
          {[['#10B981','Healthy'],['#F59E0B','At Risk'],['#EF4444','Critical']].map(([c,l]) => (
            <span key={l} className="flex items-center gap-1.5 text-xs text-[var(--os-text-2)]">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{l}
            </span>
          ))}
        </div>
      </div>

      {/* KIMMP prediction */}
      <div className="p-4 rounded-2xl border border-teal-500/30 bg-teal-500/10">
        <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">KIMMP At-Risk Prediction</p>
        <p className="text-sm text-[var(--os-text-1)]">
          ManuFlex likely to churn in 90 days based on usage decline (−42%) + support ticket spike (+180%).
          Recommend proactive executive engagement and recovery playbook within 48h.
        </p>
      </div>

      {/* At-Risk Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">At-Risk Accounts Watchlist</h2>
        </div>
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider px-5 py-3 border-b border-white/10">
          <span>Account</span>
          <span>Health Score</span>
          <span>Days Since Contact</span>
          <span>Open Tickets</span>
          <span>Renewal</span>
        </div>
        {AT_RISK.map(a => {
          const scoreColor = a.score < 65 ? '#EF4444' : a.score < 75 ? '#F59E0B' : '#F59E0B'
          const urgentDays = a.daysSince > 10
          return (
            <div key={a.name} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center px-5 py-4 border-b border-white/5 hover:bg-slate-800/40 transition-colors">
              <span className="text-sm font-semibold text-white">{a.name}</span>
              <span className="text-sm font-bold" style={{ color: scoreColor }}>{a.score}</span>
              <span className={`text-sm ${urgentDays ? 'text-red-400 font-semibold' : 'text-[var(--os-text-1)]'}`}>{a.daysSince}d</span>
              <span className={`text-sm ${a.openTickets >= 3 ? 'text-orange-400 font-semibold' : 'text-[var(--os-text-1)]'}`}>{a.openTickets}</span>
              <span className="text-sm text-[var(--os-text-2)]">{a.renewal}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

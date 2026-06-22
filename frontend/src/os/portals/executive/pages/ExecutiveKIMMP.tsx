import { Brain, Zap, TrendingUp, AlertTriangle } from 'lucide-react'

const briefing = {
  headline: 'Three signals require executive attention this week.',
  summary: 'KIMMP has processed 1,847 data points across 34 client accounts, 12 live projects, and 6 internal departments. The intelligence layer has surfaced 3 actionable signals, 2 trend confirmations, and 1 strategic risk requiring board awareness.',
}

const decisions = [
  {
    id: 'K-001',
    signal: 'Revenue concentration: Client A (38% of ARR) is up for renewal in 47 days. No renewal conversation initiated.',
    recommendation: 'Assign a Relationship Lead to Client A. Initiate renewal conversation before 10 July.',
    urgency: 'HIGH',
    confidence: 94,
  },
  {
    id: 'K-002',
    signal: 'Delivery velocity has declined 12% across 3 accounts in 2 consecutive sprints.',
    recommendation: 'Convene a delivery review for the 3 affected accounts. Identify if this is a capacity or scope issue.',
    urgency: 'HIGH',
    confidence: 88,
  },
  {
    id: 'K-003',
    signal: 'SOC 2 Type I readiness is at 61% against a Q3 target. 4 controls are overdue for evidence submission.',
    recommendation: 'Assign control owners to the 4 overdue items. Daily check-in until Q3 target is met.',
    urgency: 'MEDIUM',
    confidence: 97,
  },
]

const URGENCY_COLOR: Record<string, string> = { HIGH: '#EF4444', MEDIUM: '#F59E0B', LOW: '#10B981' }

const trends = [
  { label: 'Client NPS (trailing 90 days)',     value: '+62', direction: 'up'   },
  { label: 'Average delivery health score',     value: '91%', direction: 'up'   },
  { label: 'KIMMP daily sessions per client',   value: '47',  direction: 'up'   },
  { label: 'Governance obligations overdue',    value: '4',   direction: 'down' },
]

export function ExecutiveKIMMP() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-10">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <Brain className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">KIMMP Executive Brief</h1>
          <p className="text-slate-500 mt-1 text-sm">Synthesised intelligence — updated every 24 hours.</p>
        </div>
      </div>

      {/* Summary card */}
      <div className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-black tracking-widest text-indigo-400 uppercase">KIMMP Intelligence Summary</span>
        </div>
        <p className="text-white font-semibold text-[15px] mb-2">{briefing.headline}</p>
        <p className="text-sm text-slate-400 leading-relaxed">{briefing.summary}</p>
      </div>

      {/* Actionable decisions */}
      <section>
        <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-indigo-400" />
          Decisions Required
        </h2>
        <div className="space-y-4">
          {decisions.map(({ id, signal, recommendation, urgency, confidence }) => (
            <div key={id} className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-600 font-mono">{id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: URGENCY_COLOR[urgency], background: `${URGENCY_COLOR[urgency]}18`, border: `1px solid ${URGENCY_COLOR[urgency]}30` }}>{urgency}</span>
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">Confidence: {confidence}%</span>
              </div>
              <p className="text-sm text-slate-300 mb-3"><span className="text-slate-500 font-medium">Signal: </span>{signal}</p>
              <p className="text-sm text-white"><span className="text-indigo-400 font-semibold">→ </span>{recommendation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trend confirmations */}
      <section>
        <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          Trend Confirmations
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {trends.map(({ label, value, direction }) => (
            <div key={label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10 flex flex-col gap-2">
              <span className="text-2xl font-bold text-white">{value}</span>
              <p className="text-xs text-slate-500 leading-snug">{label}</p>
              <span className={`text-xs font-bold ${direction === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>{direction === 'up' ? '↑ Positive trend' : '↓ Needs attention'}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

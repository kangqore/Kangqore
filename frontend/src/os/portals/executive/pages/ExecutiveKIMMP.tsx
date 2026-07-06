import { Brain, Zap, TrendingUp, AlertTriangle } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

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
    <div className="space-y-10">
      <KIMMPSignalBar module="KIMMP Brief" />
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <Brain className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>KIMMP Executive Brief</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Synthesised intelligence — updated every 24 hours.</p>
        </div>
      </div>

      {/* Summary card */}
      <div className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-black tracking-widest text-indigo-400 uppercase">KIMMP Intelligence Summary</span>
        </div>
        <p className="font-semibold text-[15px] mb-2" style={{ color: 'var(--os-text-1)' }}>{briefing.headline}</p>
        <p className="text-sm text-[var(--os-text-2)] leading-relaxed">{briefing.summary}</p>
      </div>

      {/* Actionable decisions */}
      <section>
        <h2 className="text-base font-bold text-[var(--os-text-1)] mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-indigo-400" />
          Decisions Required
        </h2>
        <div className="space-y-4">
          {decisions.map(({ id, signal, recommendation, urgency, confidence }) => (
            <div key={id} className="os-card p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-[var(--os-text-2)] font-mono">{id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: URGENCY_COLOR[urgency], background: `${URGENCY_COLOR[urgency]}18`, border: `1px solid ${URGENCY_COLOR[urgency]}30` }}>{urgency}</span>
                </div>
                <span className="text-xs text-[var(--os-text-2)] flex-shrink-0">Confidence: {confidence}%</span>
              </div>
              <p className="text-sm text-[var(--os-text-1)] mb-3"><span className="text-[var(--os-text-2)] font-medium">Signal: </span>{signal}</p>
              <p className="text-sm" style={{ color: 'var(--os-text-1)' }}><span className="text-indigo-400 font-semibold">→ </span>{recommendation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trend confirmations */}
      <section>
        <h2 className="text-base font-bold text-[var(--os-text-1)] mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          Trend Confirmations
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {trends.map(({ label, value, direction }) => (
            <div key={label} className="os-card p-5 flex flex-col gap-2">
              <span className="text-2xl font-bold" style={{ color: 'var(--os-text-1)' }}>{value}</span>
              <p className="text-xs text-[var(--os-text-2)] leading-snug">{label}</p>
              <span className={`text-xs font-bold ${direction === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>{direction === 'up' ? '↑ Positive trend' : '↓ Needs attention'}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

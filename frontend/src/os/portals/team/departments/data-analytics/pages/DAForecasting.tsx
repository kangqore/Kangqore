import { Sparkles } from 'lucide-react'
import { TrendUp } from '@phosphor-icons/react'

const ACCENT = '#0284C7'

type ModelStatus = 'Active' | 'Training' | 'Deprecated'

interface ForecastModel {
  name:        string
  domain:      string
  accuracy:    number
  lastTrained: string
  horizon:     string
  status:      ModelStatus
}

const MODELS: ForecastModel[] = [
  { name: 'Revenue Forecast v3',         domain: 'Revenue',   accuracy: 91, lastTrained: '2026-06-01', horizon: '6 months', status: 'Active' },
  { name: 'Churn Prediction Model',      domain: 'Churn',     accuracy: 84, lastTrained: '2026-05-15', horizon: '90 days',  status: 'Active' },
  { name: 'Capacity Demand Forecast',    domain: 'Capacity',  accuracy: 78, lastTrained: '2026-06-10', horizon: '12 weeks', status: 'Active' },
  { name: 'Hiring Need Predictor',       domain: 'Capacity',  accuracy: 72, lastTrained: '2026-04-20', horizon: '6 months', status: 'Training' },
  { name: 'Sales Close Probability',     domain: 'Revenue',   accuracy: 87, lastTrained: '2026-06-12', horizon: '30 days',  status: 'Active' },
  { name: 'Support Volume Forecast',     domain: 'Capacity',  accuracy: 89, lastTrained: '2026-06-05', horizon: '4 weeks',  status: 'Active' },
  { name: 'Revenue Forecast v2',         domain: 'Revenue',   accuracy: 82, lastTrained: '2026-01-15', horizon: '3 months', status: 'Deprecated' },
]

const STATUS_COLOR: Record<ModelStatus, string> = {
  Active:     '#10B981',
  Training:   '#6366F1',
  Deprecated: '#6B7280',
}

const DOMAIN_COLOR: Record<string, string> = {
  Revenue:  '#10B981',
  Churn:    '#EF4444',
  Capacity: '#F59E0B',
}

function AccuracyBar({ score }: { score: number }) {
  const color = score >= 88 ? '#10B981' : score >= 78 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 rounded-full bg-slate-700 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{score}%</span>
    </div>
  )
}

export function DAForecasting() {
  const activeModels = MODELS.filter(m => m.status === 'Active')
  const avgAccuracy = Math.round(activeModels.reduce((acc, m) => acc + m.accuracy, 0) / activeModels.length)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <TrendUp size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Forecast Models</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">ML forecasting models — domain, accuracy, training cadence and forecast horizon.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Models',  value: String(activeModels.length),   color: '#10B981' },
          { label: 'Training',       value: String(MODELS.filter(m => m.status === 'Training').length), color: '#6366F1' },
          { label: 'Avg Accuracy',   value: `${avgAccuracy}%`,             color: ACCENT },
          { label: 'Deprecated',     value: String(MODELS.filter(m => m.status === 'Deprecated').length), color: '#6B7280' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          Churn Prediction at 84% is below the 88% accuracy target — retrain with Q2 feature data; adding product usage
          signals from Kafka should improve accuracy by 4-6%. Hiring Need Predictor is in training; block time for
          validation before July board meeting. Revenue Forecast v2 is deprecated but may still be in use in the
          Finance monthly report — confirm with Vikram and remove.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Model', 'Domain', 'Accuracy', 'Last Trained', 'Horizon', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {MODELS.map(m => {
                const sc = STATUS_COLOR[m.status]
                const dc = DOMAIN_COLOR[m.domain] ?? ACCENT
                return (
                  <tr key={m.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{m.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${dc}22`, color: dc }}>{m.domain}</span>
                    </td>
                    <td className="px-4 py-3"><AccuracyBar score={m.accuracy} /></td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{m.lastTrained}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{m.horizon}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{m.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { Sparkles } from 'lucide-react'
import { Brain } from '@phosphor-icons/react'

const ACCENT = '#D946EF'

type ModelStatus = 'Active' | 'Deprecated' | 'Evaluation'

interface LLMModel {
  model:      string
  provider:   string
  reqDay:     string
  avgTokens:  string
  costMonth:  string
  latencyP99: string
  errorRate:  string
  status:     ModelStatus
}

const MODELS: LLMModel[] = [
  { model: 'claude-sonnet-4-6',   provider: 'Anthropic', reqDay: '42,000', avgTokens: '1,840', costMonth: '£6,840', latencyP99: '2.1s',  errorRate: '0.2%', status: 'Active' },
  { model: 'claude-haiku-4-5',    provider: 'Anthropic', reqDay: '5,200',  avgTokens: '320',   costMonth: '£284',   latencyP99: '0.6s',  errorRate: '0.1%', status: 'Active' },
  { model: 'text-embedding-3-small',provider: 'OpenAI',  reqDay: '8,400',  avgTokens: '512',   costMonth: '£96',    latencyP99: '0.3s',  errorRate: '0.0%', status: 'Active' },
  { model: 'gpt-4o-mini',         provider: 'OpenAI',   reqDay: '420',    avgTokens: '2,100', costMonth: '£84',    latencyP99: '1.8s',  errorRate: '0.4%', status: 'Evaluation' },
  { model: 'claude-opus-4-5',     provider: 'Anthropic', reqDay: '84',     avgTokens: '4,200', costMonth: '£1,116', latencyP99: '4.8s',  errorRate: '0.1%', status: 'Active' },
]

const STATUS_COLOR: Record<ModelStatus, string> = {
  Active:     '#10B981',
  Deprecated: '#6B7280',
  Evaluation: '#F59E0B',
}

const KPI_STATS = [
  { label: 'Total Req/Day',  value: '48k',    color: ACCENT },
  { label: 'Cost MTD',       value: '£8,420', color: '#EF4444' },
  { label: 'Avg Latency',    value: '1.2s',   color: '#F59E0B' },
  { label: 'Error Rate',     value: '0.4%',   color: '#10B981' },
]

export function AILLMOps() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Brain size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">LLM Operations</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">LLM usage, cost, latency and error rate across all providers and models.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_STATS.map(k => (
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
          claude-sonnet-4-6 drives 87.5% of requests and 81% of cost — it is the right default model for most tasks.
          claude-opus-4-5 at £1,116/month with only 84 req/day should be audited — ensure each use case genuinely
          requires Opus-level capability. claude-haiku-4-5 is an underused cost optimisation lever at £284/month for
          5,200 req/day; expand its usage to classification, triage and extraction tasks to reduce Sonnet spend by ~15%.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Model', 'Provider', 'Req/Day', 'Avg Tokens', 'Cost/Month', 'P99 Latency', 'Error Rate', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {MODELS.map(m => {
                const sc = STATUS_COLOR[m.status]
                return (
                  <tr key={m.model} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-xs font-mono text-purple-400">{m.model}</span></td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{m.provider}</td>
                    <td className="px-4 py-3 text-white font-bold whitespace-nowrap">{m.reqDay}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{m.avgTokens}</td>
                    <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{m.costMonth}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{m.latencyP99}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{m.errorRate}</td>
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

import { Sparkles } from 'lucide-react'
import { Flask } from '@phosphor-icons/react'

const ACCENT = '#D946EF'

type ExperimentStatus = 'Running' | 'Complete' | 'Failed'

interface Experiment {
  id:        string
  hypothesis: string
  model:     string
  metric:    string
  baseline:  string
  variant:   string
  status:    ExperimentStatus
  pValue:    string
}

const EXPERIMENTS: Experiment[] = [
  { id: 'EXP-001', hypothesis: 'claude-haiku-4-5 can replace sonnet for support triage with <5% quality loss',  model: 'claude-haiku-4-5 vs sonnet-4-6', metric: 'Classification Acc', baseline: '94.2%', variant: '92.8%',  status: 'Complete', pValue: '0.03' },
  { id: 'EXP-002', hypothesis: 'Chain-of-thought prompting improves churn model feature extraction',               model: 'claude-sonnet-4-6 (CoT)',         metric: 'Feature Quality',   baseline: '76%',   variant: '84%',    status: 'Running',  pValue: 'N/A' },
  { id: 'EXP-003', hypothesis: 'Structured output reduces lead enrichment errors by 20%',                         model: 'claude-sonnet-4-6',               metric: 'Error Rate',        baseline: '8.2%',  variant: '4.1%',   status: 'Complete', pValue: '0.001' },
  { id: 'EXP-004', hypothesis: 'Few-shot examples improve invoice coding accuracy',                               model: 'claude-sonnet-4-6',               metric: 'Coding Accuracy',   baseline: '84%',   variant: '91%',    status: 'Complete', pValue: '0.002' },
  { id: 'EXP-005', hypothesis: 'Embedding model swap (3-small to 3-large) improves semantic search',             model: 'text-embedding-3-large',          metric: 'MRR@10',            baseline: '0.71',  variant: '0.74',   status: 'Running',  pValue: 'N/A' },
  { id: 'EXP-006', hypothesis: 'Multi-agent review improves code quality gate precision',                         model: 'Multi-agent (3× sonnet-4-6)',      metric: 'False Positive Rate',baseline: '18%',  variant: '9%',     status: 'Running',  pValue: 'N/A' },
]

const STATUS_COLOR: Record<ExperimentStatus, string> = {
  Running:  '#6366F1',
  Complete: '#10B981',
  Failed:   '#EF4444',
}

export function AIExperiments() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Flask size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AI Experiments</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Tracked LLM experiments — hypothesis, model variants, metrics and statistical significance.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Experiments', value: String(EXPERIMENTS.filter(e => e.status === 'Running').length),  color: '#6366F1' },
          { label: 'Complete',           value: String(EXPERIMENTS.filter(e => e.status === 'Complete').length), color: '#10B981' },
          { label: 'Failed',             value: String(EXPERIMENTS.filter(e => e.status === 'Failed').length),   color: '#EF4444' },
          { label: 'Success Rate',       value: `${Math.round(EXPERIMENTS.filter(e => e.status === 'Complete').length / EXPERIMENTS.length * 100)}%`, color: ACCENT },
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
          EXP-003 (structured output) and EXP-004 (few-shot prompting) are both statistically significant (p&lt;0.01)
          and should be promoted to production immediately. EXP-001 shows haiku performs 1.4% below sonnet for triage —
          acceptable; promote to production to reduce LLM cost by ~£400/month. EXP-006 (multi-agent code review) is the
          most complex and highest-impact experiment — monitor for convergence over the next 2 weeks.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Hypothesis', 'Model Variant', 'Metric', 'Baseline', 'Variant', 'Status', 'p-value'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {EXPERIMENTS.map(e => {
                const sc = STATUS_COLOR[e.status]
                return (
                  <tr key={e.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-xs font-mono text-[var(--os-text-2)]">{e.id}</span></td>
                    <td className="px-4 py-3 text-white text-xs max-w-xs">{e.hypothesis}</td>
                    <td className="px-4 py-3 text-xs font-mono text-purple-400 whitespace-nowrap">{e.model}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{e.metric}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{e.baseline}</td>
                    <td className="px-4 py-3 text-white font-bold whitespace-nowrap">{e.variant}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{e.status}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">
                      {e.pValue !== 'N/A' ? (
                        <span className={parseFloat(e.pValue) < 0.05 ? 'text-green-400 font-semibold' : 'text-[var(--os-text-2)]'}>{e.pValue}</span>
                      ) : (
                        <span className="text-[var(--os-text-2)]">—</span>
                      )}
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

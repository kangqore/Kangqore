import { Sparkles } from 'lucide-react'
import { ShieldCheck } from '@phosphor-icons/react'

const ACCENT = '#D946EF'

type RiskLevel = 'High' | 'Medium' | 'Low'
type ApprovalStatus = 'Approved' | 'Conditional' | 'Pending' | 'Rejected'

interface AIAsset {
  name:           string
  useCase:        string
  risk:           RiskLevel
  approval:       ApprovalStatus
  biasReview:     boolean
  explainability: number
  lastAudit:      string
}

const ASSETS: AIAsset[] = [
  { name: 'KIMMP / WAANDA',           useCase: 'OS Orchestration & Client AI',     risk: 'High',   approval: 'Approved',    biasReview: true,  explainability: 72, lastAudit: '2026-05-01' },
  { name: 'AEGIS — Shield Agent',     useCase: 'Access Control & Anomaly Detection',risk: 'High',   approval: 'Approved',    biasReview: true,  explainability: 84, lastAudit: '2026-05-15' },
  { name: 'Churn Prediction Model',   useCase: 'Customer Risk Scoring',             risk: 'High',   approval: 'Conditional', biasReview: true,  explainability: 61, lastAudit: '2026-04-20' },
  { name: 'Support Triage Agent',     useCase: 'Ticket Classification',             risk: 'Medium', approval: 'Approved',    biasReview: false, explainability: 89, lastAudit: '2026-06-01' },
  { name: 'Sales Close Probability',  useCase: 'Deal Scoring',                      risk: 'Medium', approval: 'Approved',    biasReview: false, explainability: 78, lastAudit: '2026-05-10' },
  { name: 'Content Agent',            useCase: 'Marketing Content Generation',      risk: 'Low',    approval: 'Approved',    biasReview: false, explainability: 95, lastAudit: '2026-06-01' },
  { name: 'Code Review Agent',        useCase: 'PR Analysis & Quality Gates',       risk: 'Low',    approval: 'Approved',    biasReview: false, explainability: 92, lastAudit: '2026-06-10' },
  { name: 'Hiring Need Predictor',    useCase: 'Workforce Planning',                risk: 'High',   approval: 'Pending',     biasReview: true,  explainability: 54, lastAudit: 'N/A' },
]

const RISK_COLOR: Record<RiskLevel, string> = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' }
const APPROVAL_COLOR: Record<ApprovalStatus, string> = {
  Approved:    '#10B981',
  Conditional: '#F59E0B',
  Pending:     '#6366F1',
  Rejected:    '#EF4444',
}

function ExplainabilityBar({ score }: { score: number }) {
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-slate-700 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{score}%</span>
    </div>
  )
}

export function AIGovernance() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ShieldCheck size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AI Governance</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">AI model and agent governance register — risk, approval, bias review and explainability.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'High Risk Assets',  value: String(ASSETS.filter(a => a.risk === 'High').length),              color: '#EF4444' },
          { label: 'Approved',          value: String(ASSETS.filter(a => a.approval === 'Approved').length),      color: '#10B981' },
          { label: 'Pending Review',    value: String(ASSETS.filter(a => a.approval === 'Pending').length),       color: '#6366F1' },
          { label: 'Bias Reviews Done', value: String(ASSETS.filter(a => a.biasReview).length),                   color: ACCENT },
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
          Churn Prediction model is Conditional — the explainability score of 61% is the blocking issue. Run SHAP
          analysis to improve to &gt;75% before full approval. Hiring Need Predictor is Pending with no audit — bias
          review is critical before deployment given employment discrimination risk. Support Triage Agent has no bias
          review completed — add to the governance sprint as it classifies customer requests by type which could embed
          demographic bias if training data is skewed.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Model / Agent', 'Use Case', 'Risk', 'Approval', 'Bias Review', 'Explainability', 'Last Audit'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {ASSETS.map(a => {
                const rc = RISK_COLOR[a.risk]
                const ac = APPROVAL_COLOR[a.approval]
                return (
                  <tr key={a.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{a.name}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] text-xs">{a.useCase}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${rc}22`, color: rc }}>{a.risk}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${ac}22`, color: ac }}>{a.approval}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.biasReview ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {a.biasReview ? 'Done' : 'Missing'}
                      </span>
                    </td>
                    <td className="px-4 py-3"><ExplainabilityBar score={a.explainability} /></td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{a.lastAudit}</td>
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

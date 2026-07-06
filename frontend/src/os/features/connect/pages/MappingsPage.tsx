import { ArrowRight, CheckCircle, AlertCircle, Circle, Sliders } from 'lucide-react'

interface Mapping {
  id: string
  sourceTool: string
  sourceEvent: string
  kangqoreEntity: string
  kangqoreField: string
  kimmpWeight: number
  confidenceDecay: string
  status: 'active' | 'draft' | 'paused'
}

const mappings: Mapping[] = [
  {
    id: 'M-001',
    sourceTool: 'ServiceNow',
    sourceEvent: 'Incident.created (P1)',
    kangqoreEntity: 'Issue',
    kangqoreField: 'severity=P1, domain=Operations',
    kimmpWeight: 9.5,
    confidenceDecay: '4h without resolution update',
    status: 'active',
  },
  {
    id: 'M-002',
    sourceTool: 'ServiceNow',
    sourceEvent: 'Change.approved',
    kangqoreEntity: 'Change Intelligence',
    kangqoreField: 'type=IT, riskScore=from CAB fields',
    kimmpWeight: 7.2,
    confidenceDecay: '72h after change window',
    status: 'active',
  },
  {
    id: 'M-003',
    sourceTool: 'Salesforce',
    sourceEvent: 'Opportunity.stage_changed',
    kangqoreEntity: 'Client / Deal',
    kangqoreField: 'churnRisk=derived, renewalProximity',
    kimmpWeight: 8.8,
    confidenceDecay: '14 days without activity',
    status: 'active',
  },
  {
    id: 'M-004',
    sourceTool: 'Jira',
    sourceEvent: 'Sprint.velocity_delta > 15%',
    kangqoreEntity: 'Project',
    kangqoreField: 'deliveryHealth, milestoneRisk',
    kimmpWeight: 8.1,
    confidenceDecay: '2 sprints without improvement',
    status: 'active',
  },
  {
    id: 'M-005',
    sourceTool: 'Stripe',
    sourceEvent: 'Invoice.payment_overdue',
    kangqoreEntity: 'Client / Finance',
    kangqoreField: 'arAging, churnRisk (correlated)',
    kimmpWeight: 6.5,
    confidenceDecay: '30 days after resolution',
    status: 'active',
  },
  {
    id: 'M-006',
    sourceTool: 'Microsoft 365',
    sourceEvent: 'Teams.channel_escalation (opt-in)',
    kangqoreEntity: 'Issue',
    kangqoreField: 'severity=derived, domain=People',
    kimmpWeight: 4.2,
    confidenceDecay: '24h without follow-up',
    status: 'draft',
  },
  {
    id: 'M-007',
    sourceTool: 'Workday',
    sourceEvent: 'Employee.termination_voluntary',
    kangqoreEntity: 'Resource / People Signal',
    kangqoreField: 'capacityRisk, attritionPattern',
    kimmpWeight: 5.8,
    confidenceDecay: '90 days (rolling)',
    status: 'draft',
  },
  {
    id: 'M-008',
    sourceTool: 'GitHub',
    sourceEvent: 'Deployment.frequency_decline > 30%',
    kangqoreEntity: 'Project',
    kangqoreField: 'deliveryHealth, DORA signals',
    kimmpWeight: 6.0,
    confidenceDecay: '4 weeks',
    status: 'paused',
  },
]

const STATUS_CONFIG = {
  active: { label: 'Active', color: '#10B981', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  draft:  { label: 'Draft',  color: '#F59E0B', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  paused: { label: 'Paused', color: 'var(--os-text-2)', icon: <Circle      className="w-3.5 h-3.5" /> },
}

const TOOL_COLOR: Record<string, string> = {
  'ServiceNow':   '#81B5A1',
  'Salesforce':   '#00A1E0',
  'Jira':         '#0052CC',
  'Stripe':       '#635BFF',
  'Microsoft 365':'#0078D4',
  'Workday':      '#F5A623',
  'GitHub':       '#6E40C9',
}

export function MappingsPage() {
  const activeCount = mappings.filter(m => m.status === 'active').length
  const draftCount  = mappings.filter(m => m.status === 'draft').length

  return (
    <div className="space-y-8">
      {/* Explainer */}
      <div className="p-5 rounded-2xl border border-[#2E2854] bg-[#0d1117] flex items-start gap-4">
        <Sliders className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-white">Signal Schema mappings</p>
          <p className="text-xs text-[var(--os-text-2)] leading-relaxed">
            Each mapping translates a raw tool event into a Kangqore entity field with a KIMMP weight score.
            Weight determines how strongly this signal influences KIMMP correlation.
            Confidence Decay defines how quickly the signal's relevance fades without follow-on signals.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-6 text-sm">
        <span className="text-[var(--os-text-2)]"><span className="font-bold text-white">{activeCount}</span> active mappings</span>
        <span className="text-[var(--os-text-2)]"><span className="font-bold text-amber-400">{draftCount}</span> in draft</span>
        <span className="text-[var(--os-text-2)]"><span className="font-bold text-white">{mappings.length}</span> total defined</span>
      </div>

      {/* Mappings table */}
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_1fr_80px_80px_100px] gap-4 px-4 py-2">
          {['Source Event', 'Kangqore Entity', 'Field Mapping', 'Weight', 'Status', ''].map(h => (
            <span key={h} className="text-[9px] font-black uppercase tracking-widest text-[var(--os-text-2)]">{h}</span>
          ))}
        </div>

        {mappings.map(m => {
          const cfg = STATUS_CONFIG[m.status]
          const toolColor = TOOL_COLOR[m.sourceTool] || '#6B7280'

          return (
            <div key={m.id} className={`grid grid-cols-[1fr_1fr_1fr_80px_80px_100px] gap-4 items-center px-4 py-4 rounded-2xl border bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10 hover:border-[var(--os-border)] transition-colors ${m.status === 'paused' ? 'border-white/5 opacity-60' : 'border-[var(--os-border)]'}`}>
              {/* Source Event */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: toolColor }} />
                  <span className="text-[10px] font-bold text-[var(--os-text-2)]">{m.sourceTool}</span>
                </div>
                <p className="text-xs font-semibold text-white font-mono leading-tight">{m.sourceEvent}</p>
              </div>

              {/* Arrow + Entity */}
              <div className="flex items-center gap-2 min-w-0">
                <ArrowRight className="w-3.5 h-3.5 text-[var(--os-text-2)] flex-shrink-0" />
                <p className="text-sm font-semibold text-white truncate">{m.kangqoreEntity}</p>
              </div>

              {/* Field mapping */}
              <p className="text-[10px] text-[var(--os-text-2)] font-mono leading-relaxed">{m.kangqoreField}</p>

              {/* Weight */}
              <div>
                <p className="text-sm font-bold text-white">{m.kimmpWeight}</p>
                <p className="text-[9px] text-[var(--os-text-2)]">{m.confidenceDecay}</p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-1.5" style={{ color: cfg.color }}>
                {cfg.icon}
                <span className="text-[10px] font-bold">{cfg.label}</span>
              </div>

              {/* Actions */}
              <div className="flex justify-end">
                <button className="text-[10px] font-bold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors px-2 py-1 rounded-lg hover:bg-slate-800">
                  Edit
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

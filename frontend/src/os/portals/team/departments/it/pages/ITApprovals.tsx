import { useState } from 'react'
import { CheckCircle2, Circle, Clock, UserCheck, ChevronDown, ChevronUp } from 'lucide-react'

type WorkflowStatus = 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'REJECTED'
type StepType       = 'APPROVE' | 'REVIEW' | 'SIGN' | 'COMPLETE'
type StepStatus     = 'DONE' | 'CURRENT' | 'PENDING'

interface Step {
  id:           string
  label:        string
  assignee:     string
  type:         StepType
  status:       StepStatus
  sla:          string
  completedAt?: string
}

interface Workflow {
  id:        string
  title:     string
  type:      string
  requester: string
  status:    WorkflowStatus
  created:   string
  steps:     Step[]
}

const WORKFLOWS: Workflow[] = [
  {
    id: 'AWF-001', title: 'Emergency Change — VPN Gateway Hotfix',
    type: 'Emergency Change', requester: 'Rohan M.', status: 'ACTIVE', created: '2h ago',
    steps: [
      { id: 's1', label: 'Risk Assessment',   assignee: 'Arjun S.',     type: 'REVIEW',   status: 'DONE',    sla: '1h',  completedAt: '1.5h ago' },
      { id: 's2', label: 'CAB Approval',      assignee: 'C.O.D.E. K.',    type: 'APPROVE',  status: 'CURRENT', sla: '2h' },
      { id: 's3', label: 'Security Sign-Off', assignee: 'Security Lead',type: 'SIGN',     status: 'PENDING', sla: '1h' },
      { id: 's4', label: 'Deploy & Verify',   assignee: 'Rohan M.',     type: 'COMPLETE', status: 'PENDING', sla: '4h' },
    ],
  },
  {
    id: 'AWF-002', title: 'Software Licence Renewal — GitHub Enterprise',
    type: 'Procurement', requester: 'Arjun S.', status: 'PENDING', created: '1d ago',
    steps: [
      { id: 's1', label: 'Finance Review',       assignee: 'Finance Lead', type: 'REVIEW',  status: 'CURRENT', sla: '24h' },
      { id: 's2', label: 'IT Director Approval', assignee: 'IT Director',  type: 'APPROVE', status: 'PENDING', sla: '24h' },
      { id: 's3', label: 'CEO Sign-Off (>£10k)', assignee: 'C.O.D.E. K.',   type: 'SIGN',    status: 'PENDING', sla: '48h' },
    ],
  },
  {
    id: 'AWF-003', title: 'New Admin Access — AWS Production',
    type: 'Access Request', requester: 'Priya N.', status: 'COMPLETED', created: '3d ago',
    steps: [
      { id: 's1', label: 'Manager Approval',     assignee: 'Arjun S.',     type: 'APPROVE',  status: 'DONE', sla: '24h', completedAt: '2d ago' },
      { id: 's2', label: 'Security Review',      assignee: 'Security Lead',type: 'REVIEW',   status: 'DONE', sla: '24h', completedAt: '1d ago' },
      { id: 's3', label: 'Access Provisioned',   assignee: 'Rohan M.',     type: 'COMPLETE', status: 'DONE', sla: '4h',  completedAt: '20h ago' },
    ],
  },
]

const WF_COLOR: Record<WorkflowStatus, string> = {
  ACTIVE: '#2564ea', PENDING: '#F59E0B', COMPLETED: '#10B981', REJECTED: '#EF4444',
}
const ST_COLOR: Record<StepStatus, string> = {
  DONE: '#10B981', CURRENT: '#2564ea', PENDING: 'var(--os-text-2)',
}
const TYPE_LABEL: Record<StepType, string> = {
  APPROVE: 'Approve', REVIEW: 'Review', SIGN: 'Sign', COMPLETE: 'Complete',
}

export function ITApprovals() {
  const [expanded, setExpanded] = useState<string | null>('AWF-001')

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <UserCheck className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Approval Workflows</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">
            Multi-step approval chains — CAB, procurement, access requests — with SLA tracking.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active',    value: WORKFLOWS.filter(w => w.status === 'ACTIVE').length.toString(),    color: '#2564ea' },
          { label: 'Pending',   value: WORKFLOWS.filter(w => w.status === 'PENDING').length.toString(),   color: '#F59E0B' },
          { label: 'Completed', value: WORKFLOWS.filter(w => w.status === 'COMPLETED').length.toString(), color: '#10B981' },
          { label: 'Avg Steps', value: Math.round(WORKFLOWS.reduce((s, w) => s + w.steps.length, 0) / WORKFLOWS.length).toString(), color: '#6366F1' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Workflows */}
      <div className="space-y-3">
        {WORKFLOWS.map(wf => {
          const done    = wf.steps.filter(s => s.status === 'DONE').length
          const pct     = Math.round((done / wf.steps.length) * 100)
          const current = wf.steps.find(s => s.status === 'CURRENT')
          const isOpen  = expanded === wf.id

          return (
            <div key={wf.id} className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
              {/* Header row */}
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpanded(isOpen ? null : wf.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${WF_COLOR[wf.status]}22`, color: WF_COLOR[wf.status] }}
                    >
                      {wf.status}
                    </span>
                    <span className="text-xs text-[var(--os-text-2)]">{wf.type} · {wf.id}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{wf.title}</p>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5">By {wf.requester} · {wf.created}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div>
                    <p className="text-xs text-[var(--os-text-2)] text-right">{done}/{wf.steps.length} steps</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-20 h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: WF_COLOR[wf.status] }} />
                      </div>
                      <span className="text-xs text-[var(--os-text-2)]">{pct}%</span>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[var(--os-text-2)]" /> : <ChevronDown className="w-4 h-4 text-[var(--os-text-2)]" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-white/10 pt-4">
                  {/* Step pipeline */}
                  <div className="flex items-start gap-0 overflow-x-auto pb-2 mt-1">
                    {wf.steps.map((step, i) => (
                      <div key={step.id} className="flex items-start flex-shrink-0">
                        <div className="w-36 flex flex-col items-center gap-2 text-center">
                          {/* Icon */}
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                            style={{
                              borderColor: ST_COLOR[step.status],
                              background:  `${ST_COLOR[step.status]}18`,
                            }}
                          >
                            {step.status === 'DONE'    && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            {step.status === 'CURRENT' && <Clock         className="w-4 h-4 text-blue-400" />}
                            {step.status === 'PENDING' && <Circle        className="w-4 h-4 text-[var(--os-text-2)]" />}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white leading-tight">{step.label}</p>
                            <span
                              className="text-xs px-1.5 py-0.5 rounded-md font-medium mt-0.5 inline-block"
                              style={{ background: `${ST_COLOR[step.status]}18`, color: ST_COLOR[step.status] }}
                            >
                              {TYPE_LABEL[step.type]}
                            </span>
                            <p className="text-xs text-[var(--os-text-2)] mt-1">{step.assignee}</p>
                            <p className="text-xs text-[var(--os-text-2)]">SLA: {step.sla}</p>
                            {step.completedAt && (
                              <p className="text-xs text-emerald-500">✓ {step.completedAt}</p>
                            )}
                          </div>
                        </div>
                        {i < wf.steps.length - 1 && (
                          <div className="flex items-center mt-3.5 w-8">
                            <div
                              className="flex-1 h-0.5"
                              style={{ background: i < done ? '#10B981' : '#1E293B' }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action area for active current step */}
                  {current && wf.status === 'ACTIVE' && (
                    <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-blue-300">Awaiting: {current.label}</p>
                        <p className="text-xs text-[var(--os-text-2)]">Assigned to {current.assignee} · SLA: {current.sla}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-500/20 hover:bg-red-500/30 transition-colors">
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

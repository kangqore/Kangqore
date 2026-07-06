import { GitBranch, CheckCircle2, XCircle, Clock, Play, FileEdit } from 'lucide-react'
import { StatCard } from '@design-system/components/StatCard'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { useWorkflowsStore } from '../store'
import type { Workflow } from '../types'

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'neutral' | 'danger'> = {
  active: 'success', paused: 'warning', draft: 'neutral', archived: 'danger',
}

const TRIGGER_LABEL: Record<string, string> = {
  manual: 'Manual', schedule: 'Schedule', event: 'Event', webhook: 'Webhook', form: 'Form',
}

const CATEGORY_COLOR: Record<string, string> = {
  sales: 'bg-blue-50 text-blue-700', delivery: 'bg-green-50 text-green-700',
  hr: 'bg-purple-50 text-purple-700', finance: 'bg-orange-50 text-orange-700',
  ops: 'bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]', marketing: 'bg-pink-50 text-pink-700',
}

const STEP_ICONS: Record<string, React.FC<{ className?: string }>> = {
  action: ({ className }) => <div className={`w-2 h-2 rounded-full bg-blue-500 ${className ?? ''}`} />,
  condition: ({ className }) => <div className={`w-2 h-2 rotate-45 bg-amber-500 ${className ?? ''}`} />,
  notification: ({ className }) => <div className={`w-2 h-2 rounded-full bg-green-500 ${className ?? ''}`} />,
  approval: ({ className }) => <div className={`w-2 h-2 rounded-full bg-purple-500 ${className ?? ''}`} />,
  integration: ({ className }) => <div className={`w-2 h-2 rounded-full bg-pink-500 ${className ?? ''}`} />,
  delay: ({ className }) => <div className={`w-2 h-2 rounded-full bg-[var(--os-text-2)] ${className ?? ''}`} />,
}

function WorkflowCard({ wf }: { wf: Workflow }) {
  const successRate = wf.runsTotal > 0 ? Math.round((wf.runsSuccess / wf.runsTotal) * 100) : 0

  return (
    <Card>
      <CardBody className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--os-surface-0)] border border-[var(--os-border)] flex items-center justify-center flex-shrink-0">
              <GitBranch className="w-4 h-4 text-[var(--os-text-2)]" />
            </div>
            <div>
              <p className="font-semibold text-[var(--os-text-1)] leading-tight">{wf.name}</p>
              <p className="text-xs text-[var(--os-text-2)] mt-0.5">{wf.owner} · {TRIGGER_LABEL[wf.triggerType]}: <span className="font-medium text-[var(--os-text-1)]">{wf.triggerConfig}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLOR[wf.category]}`}>
              {wf.category}
            </span>
            <Badge variant={STATUS_BADGE[wf.status]} size="sm" dot>
              {wf.status.charAt(0).toUpperCase() + wf.status.slice(1)}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-[var(--os-text-2)] mb-4 leading-relaxed">{wf.description}</p>

        {/* Steps visual */}
        <div className="flex items-center gap-1 mb-4">
          {wf.steps.map((step, i) => {
            const Dot = STEP_ICONS[step.type] ?? STEP_ICONS.action
            return (
              <div key={step.id} className="flex items-center gap-1">
                {i > 0 && <div className="w-4 h-px bg-[var(--os-border)]" />}
                <Dot />
              </div>
            )
          })}
          <span className="text-xs text-[var(--os-text-2)] ml-2">{wf.steps.length} steps</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-[var(--os-text-2)] border-t border-[var(--os-border)] pt-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              {wf.runsSuccess}/{wf.runsTotal} runs
            </span>
            {wf.runsFailed > 0 && (
              <span className="flex items-center gap-1 text-red-500">
                <XCircle className="w-3.5 h-3.5" />{wf.runsFailed} failed
              </span>
            )}
            {wf.avgDuration > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />~{wf.avgDuration}m avg
              </span>
            )}
          </div>
          <span className={`font-semibold ${successRate >= 95 ? 'text-green-600' : successRate >= 80 ? 'text-orange-600' : 'text-red-600'}`}>
            {wf.runsTotal > 0 ? `${successRate}%` : 'Not run'}
          </span>
        </div>
      </CardBody>
    </Card>
  )
}

export function WorkflowsOverview() {
  const { workflows, runs, totalRuns, successRate, activeCount } = useWorkflowsStore()
  const recentRuns = [...runs].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 8)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Workflows" value={activeCount()}                                             icon={<Play         className="w-5 h-5" />} changeLabel={`${workflows.length} total`} />
        <StatCard label="Total Runs"       value={totalRuns()}                                               icon={<GitBranch    className="w-5 h-5" />} changeLabel="All time" />
        <StatCard label="Success Rate"     value={`${successRate()}%`}                                       icon={<CheckCircle2 className="w-5 h-5" />} changeLabel="Pass rate" />
        <StatCard label="Drafts"           value={workflows.filter(w => w.status === 'draft').length}        icon={<FileEdit     className="w-5 h-5" />} changeLabel="Awaiting activation" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {workflows.map(wf => <WorkflowCard key={wf.id} wf={wf} />)}
      </div>

      {/* Recent runs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Run Log</CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-[var(--os-border)]">
            {recentRuns.map(run => (
              <div key={run.id} className="flex items-center gap-4 px-5 py-3.5">
                {run.status === 'completed'
                  ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  : <XCircle      className="w-4 h-4 text-red-500  flex-shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--os-text-1)]">{run.workflowName}</p>
                  {run.errorMessage
                    ? <p className="text-xs text-red-500 truncate">{run.errorMessage}</p>
                    : <p className="text-xs text-[var(--os-text-2)]">{run.triggeredBy} · {run.stepsCompleted}/{run.stepsTotal} steps</p>
                  }
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[var(--os-text-2)]">{run.startedAt.replace('T', ' ').slice(0, 16)}</p>
                  {run.duration && <p className="text-xs text-[var(--os-text-2)]">{run.duration}s</p>}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

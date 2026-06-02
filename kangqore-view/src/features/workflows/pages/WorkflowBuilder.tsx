import { useState } from 'react'
import { ChevronRight, Play, GitBranch, Bell, Clock, CheckSquare, Zap, Link } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { useWorkflowsStore } from '../store'
import type { WorkflowStep } from '../types'

const STEP_TYPE_CONFIG: Record<string, { label: string; color: string; Icon: React.FC<{ className?: string }> }> = {
  action:       { label: 'Action',       color: 'bg-blue-50 border-blue-200 text-blue-700',   Icon: ({ className }) => <Play          className={className ?? 'w-3.5 h-3.5'} /> },
  condition:    { label: 'Condition',    color: 'bg-amber-50 border-amber-200 text-amber-700', Icon: ({ className }) => <GitBranch     className={className ?? 'w-3.5 h-3.5'} /> },
  notification: { label: 'Notify',       color: 'bg-green-50 border-green-200 text-green-700', Icon: ({ className }) => <Bell          className={className ?? 'w-3.5 h-3.5'} /> },
  delay:        { label: 'Wait',         color: 'bg-slate-50 border-slate-200 text-slate-600', Icon: ({ className }) => <Clock         className={className ?? 'w-3.5 h-3.5'} /> },
  approval:     { label: 'Approval',     color: 'bg-purple-50 border-purple-200 text-purple-700', Icon: ({ className }) => <CheckSquare className={className ?? 'w-3.5 h-3.5'} /> },
  integration:  { label: 'Integration',  color: 'bg-pink-50 border-pink-200 text-pink-700',   Icon: ({ className }) => <Link          className={className ?? 'w-3.5 h-3.5'} /> },
}

function StepNode({ step, isSelected, onClick }: { step: WorkflowStep; isSelected: boolean; onClick: () => void }) {
  const config = STEP_TYPE_CONFIG[step.type] ?? STEP_TYPE_CONFIG.action
  const { Icon } = config
  return (
    <button
      onClick={onClick}
      className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
        isSelected
          ? 'border-blue-400 bg-blue-50 shadow-sm'
          : `${config.color} hover:opacity-80`
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-xs font-semibold uppercase tracking-wide">{config.label}</span>
      </div>
      <p className="text-sm font-semibold mt-1.5 text-slate-900">{step.name}</p>
      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{step.description}</p>
    </button>
  )
}

export function WorkflowBuilder() {
  const { workflows, selectedId, setSelected } = useWorkflowsStore()
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  const wf = workflows.find(w => w.id === selectedId) ?? workflows[0]
  const step = wf.steps.find(s => s.id === selectedStep)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Workflow selector */}
      <Card className="lg:col-span-1 h-fit">
        <CardHeader><CardTitle>Workflows</CardTitle></CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100">
            {workflows.map(w => (
              <button
                key={w.id}
                onClick={() => { setSelected(w.id); setSelectedStep(null) }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                  w.id === selectedId ? 'bg-blue-50' : ''
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <GitBranch className="w-3.5 h-3.5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{w.name}</p>
                  <p className="text-xs text-slate-500">{w.steps.length} steps</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant={w.status === 'active' ? 'success' : w.status === 'draft' ? 'neutral' : 'warning'} size="sm" dot />
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Canvas */}
      <div className="lg:col-span-2 space-y-5">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{wf.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant={wf.status === 'active' ? 'success' : wf.status === 'draft' ? 'neutral' : 'warning'}
                  size="sm" dot
                >
                  {wf.status.charAt(0).toUpperCase() + wf.status.slice(1)}
                </Badge>
                {wf.status === 'draft' && (
                  <Button size="sm" leftIcon={<Play className="w-3 h-3" />}>Activate</Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* Trigger */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Trigger</p>
                <p className="text-sm font-semibold text-slate-900">{wf.triggerConfig}</p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {wf.steps.map((step, i) => (
                <div key={step.id} className="flex items-start gap-2">
                  <div className="flex flex-col items-center gap-0 mt-4">
                    <span className="text-xs text-slate-400 font-mono w-5 text-center">{i + 1}</span>
                    {i < wf.steps.length - 1 && <div className="w-px h-4 bg-slate-200 mt-1" />}
                  </div>
                  <div className="flex-1">
                    <StepNode
                      step={step}
                      isSelected={selectedStep === step.id}
                      onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Step detail panel */}
        {step && (
          <Card>
            <CardHeader>
              <CardTitle>Step Detail — {step.name}</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Type</p>
                  <Badge variant="neutral" size="sm">{STEP_TYPE_CONFIG[step.type]?.label ?? step.type}</Badge>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Order</p>
                  <p className="text-sm font-semibold text-slate-900">Step {step.order}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Description</p>
                <p className="text-sm text-slate-700">{step.description}</p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}

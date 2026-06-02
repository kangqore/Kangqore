export type WorkflowStatus    = 'active' | 'paused' | 'draft' | 'archived'
export type TriggerType       = 'manual' | 'schedule' | 'event' | 'webhook' | 'form'
export type StepType          = 'action' | 'condition' | 'delay' | 'notification' | 'approval' | 'integration'
export type RunStatus         = 'running' | 'completed' | 'failed' | 'skipped'
export type WorkflowCategory  = 'sales' | 'delivery' | 'hr' | 'finance' | 'ops' | 'marketing'

export interface WorkflowStep {
  id: string
  order: number
  type: StepType
  name: string
  description: string
  config?: Record<string, string>
  onSuccess?: string    // next step id
  onFailure?: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  category: WorkflowCategory
  status: WorkflowStatus
  triggerType: TriggerType
  triggerConfig: string
  steps: WorkflowStep[]
  lastRun?: string
  nextRun?: string
  runsTotal: number
  runsSuccess: number
  runsFailed: number
  avgDuration: number   // minutes
  owner: string
  createdAt: string
  tags: string[]
}

export interface WorkflowRun {
  id: string
  workflowId: string
  workflowName: string
  status: RunStatus
  startedAt: string
  completedAt?: string
  duration?: number     // seconds
  triggeredBy: string
  stepsCompleted: number
  stepsTotal: number
  errorMessage?: string
}

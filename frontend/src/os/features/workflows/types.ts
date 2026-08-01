export type WorkflowStatus    = 'active' | 'paused' | 'draft' | 'archived'
export type TriggerType       = 'manual' | 'schedule' | 'event' | 'webhook' | 'form'
// WVIS canonical 7 execution types
export type WvisStepType = 'notify' | 'wait' | 'agent' | 'event' | 'create' | 'integrate' | 'condition'
// Phase 2 / 2.5 — 11 intelligence thinking nodes
export type IntelStepType = 'goal' | 'context' | 'analyze' | 'insight' | 'hypothesis' | 'simulate' | 'decision' | 'policy' | 'execute' | 'learn' | 'kpi'
// Legacy aliases — kept for DB backward compat with existing workflows
export type StepType = WvisStepType | IntelStepType | 'action' | 'delay' | 'notification' | 'approval' | 'integration'
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
  ontologyObjectId?: string  // S300 — set by the backend when this step's type is a bridged ontology concept
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

import { api } from '@lib/api'

export type ParamType = 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'object-ref' | 'object-set'

export interface ActionParameterDef {
  name: string
  type: ParamType
  required?: boolean
  enum?: string[]
  min?: number
  max?: number
  regex?: string
  description?: string
}

export type ConditionOp = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in' | 'exists'
export interface ConditionLeaf { source: 'param' | 'object'; field: string; op: ConditionOp; value?: any }
export interface ConditionAll { all: ConditionNode[] }
export interface ConditionAny { any: ConditionNode[] }
export type ConditionNode = ConditionLeaf | ConditionAll | ConditionAny

export interface ActionValidationRule {
  id: string
  actionId: string
  condition: ConditionNode
  errorMessage: string
  severity: 'BLOCK' | 'WARN'
  order: number
}

export type EffectType = 'UPDATE_OBJECT' | 'CREATE_OBJECT' | 'CREATE_RELATIONSHIP' | 'WEBHOOK' | 'EMIT_EVENT'

export interface ActionEffect {
  id: string
  actionId: string
  effectType: EffectType
  configuration: Record<string, any>
  order: number
}

export interface OntologyAction {
  id: string
  typeId: string
  type?: { name: string; displayName: string; icon: string | null; color: string | null }
  name: string
  displayName: string
  description: string | null
  parameters: ActionParameterDef[]
  allowedRoles: string[]
  toolCallable?: boolean
  executions: number
  validationRules?: ActionValidationRule[]
  effects?: ActionEffect[]
  _count?: { validationRules: number; effects: number; executionLog: number }
  createdAt: string
  updatedAt: string
}

export interface ActionExecution {
  id: string
  actionId: string
  action?: { name: string; displayName: string }
  objectId: string | null
  object?: { id: string; externalId: string | null; type: { displayName: string; icon: string | null; color: string | null } } | null
  actorId: string | null
  actorType: 'HUMAN' | 'KIMMP' | 'HANUMANAS'
  params: Record<string, any>
  effectsApplied: any[]
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED' | 'PENDING_APPROVAL'
  errorMessage: string | null
  durationMs: number
  confidence: number | null
  agentsMixed: string[]
  sourceModule: string | null
  reasoning: string | null
  policyId: string | null
  createdAt: string
}

export interface PendingApproval {
  id: string
  actionId: string
  action?: { name: string; displayName: string }
  objectId: string | null
  object?: { id: string; externalId: string | null; type: { displayName: string; icon: string | null; color: string | null } } | null
  actorId: string | null
  actorType: 'HUMAN' | 'KIMMP' | 'HANUMANAS'
  params: Record<string, any>
  policyId: string | null
  policyName: string | null
  reason: string | null
  confidence: number | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  resolvedBy: string | null
  resolvedAt: string | null
  executionId: string | null
  createdAt: string
}

export interface PreflightResult { valid: boolean; errors: Array<{ severity: 'BLOCK' | 'WARN'; message: string; param?: string }> }

export interface ExecutionMetrics {
  total: number
  successRate: number
  avgDurationMs: number
  byActor: Array<{ actorType: string; count: number }>
  mostExecuted: Array<{ actionId: string; displayName: string; count: number }>
}

export const actionEngineService = {
  list(typeId?: string): Promise<OntologyAction[]> {
    return api.get('/admin/ontology/actions', { params: typeId ? { typeId } : undefined }).then(r => r.data?.actions ?? [])
  },
  get(id: string): Promise<OntologyAction> {
    return api.get(`/admin/ontology/actions/${id}`).then(r => r.data.action)
  },
  create(input: { typeId: string; name: string; displayName: string; description?: string; parameters: ActionParameterDef[]; allowedRoles: string[] }): Promise<OntologyAction> {
    return api.post('/admin/ontology/actions', input).then(r => r.data.action)
  },
  update(id: string, input: Partial<{ displayName: string; description: string; parameters: ActionParameterDef[]; allowedRoles: string[]; toolCallable: boolean }>): Promise<OntologyAction> {
    return api.patch(`/admin/ontology/actions/${id}`, input).then(r => r.data.action)
  },
  remove(id: string): Promise<void> {
    return api.delete(`/admin/ontology/actions/${id}`).then(() => undefined)
  },

  addRule(actionId: string, rule: Omit<ActionValidationRule, 'id' | 'actionId'>): Promise<ActionValidationRule> {
    return api.post(`/admin/ontology/actions/${actionId}/validation-rules`, rule).then(r => r.data.rule)
  },
  updateRule(ruleId: string, rule: Partial<Omit<ActionValidationRule, 'id' | 'actionId'>>): Promise<ActionValidationRule> {
    return api.patch(`/admin/ontology/actions/validation-rules/${ruleId}`, rule).then(r => r.data.rule)
  },
  removeRule(ruleId: string): Promise<void> {
    return api.delete(`/admin/ontology/actions/validation-rules/${ruleId}`).then(() => undefined)
  },

  addEffect(actionId: string, effect: Omit<ActionEffect, 'id' | 'actionId'>): Promise<ActionEffect> {
    return api.post(`/admin/ontology/actions/${actionId}/effects`, effect).then(r => r.data.effect)
  },
  updateEffect(effectId: string, effect: Partial<Omit<ActionEffect, 'id' | 'actionId'>>): Promise<ActionEffect> {
    return api.patch(`/admin/ontology/actions/effects/${effectId}`, effect).then(r => r.data.effect)
  },
  removeEffect(effectId: string): Promise<void> {
    return api.delete(`/admin/ontology/actions/effects/${effectId}`).then(() => undefined)
  },

  validate(actionId: string, params: Record<string, any>, objectId?: string): Promise<PreflightResult> {
    return api.post(`/admin/ontology/actions/${actionId}/validate`, { params, objectId }).then(r => r.data)
  },
  execute(actionId: string, params: Record<string, any>, objectId?: string, actorType: 'HUMAN' | 'KIMMP' | 'HANUMANAS' = 'HUMAN'): Promise<ActionExecution> {
    return api.post(`/admin/ontology/actions/${actionId}/execute`, { params, objectId, actorType }).then(r => r.data.execution)
  },

  listExecutions(params?: { actionId?: string; objectId?: string; actorType?: string; status?: string; from?: string; to?: string; page?: number; limit?: number }): Promise<{ executions: ActionExecution[]; total: number; pages: number }> {
    return api.get('/admin/ontology/actions/executions', { params }).then(r => r.data)
  },
  getExecution(id: string): Promise<ActionExecution> {
    return api.get(`/admin/ontology/actions/executions/${id}`).then(r => r.data.execution)
  },
  metrics(): Promise<ExecutionMetrics> {
    return api.get('/admin/ontology/actions/executions/metrics').then(r => r.data)
  },

  seedSystem(): Promise<Array<{ created: boolean; name: string }>> {
    return api.post('/admin/ontology/actions/seed-system', {}).then(r => r.data.results)
  },

  // ── S299 — Human-in-the-loop ──────────────────────────────────────────────
  listPendingApprovals(status: 'PENDING' | 'ALL' = 'PENDING'): Promise<{ items: PendingApproval[]; total: number; pages: number }> {
    return api.get('/admin/ontology/pending-approvals', { params: { status } }).then(r => r.data)
  },
  approvePending(id: string): Promise<ActionExecution> {
    return api.post(`/admin/ontology/pending-approvals/${id}/approve`, {}).then(r => r.data.execution)
  },
  rejectPending(id: string): Promise<ActionExecution> {
    return api.post(`/admin/ontology/pending-approvals/${id}/reject`, {}).then(r => r.data.execution)
  },
}

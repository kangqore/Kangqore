import { api } from '@lib/api'

export interface LlmCallLog {
  id: string
  userId: string | null
  actorType: string
  model: string
  provider: string
  promptTokens: number
  completionTokens: number
  totalCost: number
  latencyMs: number
  prompt: string
  response: string
  referencedObjectIds: string[]
  taskType: string | null
  agentRole: string | null
  sourceModule: string | null
  status: 'SUCCESS' | 'ERROR' | 'BLOCKED'
  errorMessage: string | null
  piiDetected: boolean
  piiPatterns: string[]
  createdAt: string
}

export interface CostAnalytics {
  totalCost: number
  totalTokens: number
  callCount: number
  byDay: Array<{ date: string; cost: number }>
  byActorType: Array<{ actorType: string; cost: number }>
  byTaskType: Array<{ taskType: string; cost: number }>
}

export interface ModelAnalytics {
  models: Array<{ model: string; callCount: number; avgLatencyMs: number; totalCost: number }>
}

export interface PiiIncident {
  id: string
  actorType: string
  sourceModule: string | null
  piiPatterns: string[]
  status: string
  createdAt: string
  taskType: string | null
}

export interface PiiScanConfig {
  id: string
  name: string
  mode: 'REDACT' | 'BLOCK' | 'AUDIT'
  enabledPatterns: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface TokenBudget {
  id: string
  userId: string | null
  teamId: string | null
  monthlyTokenLimit: number
  alertThreshold: number
  hardStop: boolean
  usedTokens: number
  createdAt: string
}

export const gatewayService = {
  listCalls(params?: { actorType?: string; model?: string; taskType?: string; status?: string; page?: number; limit?: number }): Promise<{ calls: LlmCallLog[]; total: number; pages: number }> {
    return api.get('/admin/kimmp-gateway/calls', { params }).then(r => r.data)
  },
  getCall(id: string): Promise<LlmCallLog> {
    return api.get(`/admin/kimmp-gateway/calls/${id}`).then(r => r.data.call)
  },
  costAnalytics(days = 30): Promise<CostAnalytics> {
    return api.get('/admin/kimmp-gateway/analytics/cost', { params: { days } }).then(r => r.data)
  },
  modelAnalytics(days = 30): Promise<ModelAnalytics> {
    return api.get('/admin/kimmp-gateway/analytics/models', { params: { days } }).then(r => r.data)
  },
  piiIncidents(): Promise<PiiIncident[]> {
    return api.get('/admin/kimmp-gateway/pii-incidents').then(r => r.data.incidents)
  },
  piiConfigs(): Promise<PiiScanConfig[]> {
    return api.get('/admin/kimmp-gateway/pii-config').then(r => r.data.configs)
  },
  createPiiConfig(input: { name: string; mode: string; enabledPatterns?: string[] }): Promise<PiiScanConfig> {
    return api.post('/admin/kimmp-gateway/pii-config', input).then(r => r.data.config)
  },
  updatePiiConfig(id: string, patch: Partial<{ mode: string; enabledPatterns: string[]; active: boolean }>): Promise<PiiScanConfig> {
    return api.patch(`/admin/kimmp-gateway/pii-config/${id}`, patch).then(r => r.data.config)
  },
  budgets(): Promise<TokenBudget[]> {
    return api.get('/admin/kimmp-gateway/budgets').then(r => r.data.budgets)
  },
  createBudget(input: { userId?: string; teamId?: string; monthlyTokenLimit: number; alertThreshold?: number; hardStop?: boolean }): Promise<TokenBudget> {
    return api.post('/admin/kimmp-gateway/budgets', input).then(r => r.data.budget)
  },
  updateBudget(id: string, patch: Partial<{ monthlyTokenLimit: number; alertThreshold: number; hardStop: boolean }>): Promise<TokenBudget> {
    return api.patch(`/admin/kimmp-gateway/budgets/${id}`, patch).then(r => r.data.budget)
  },
  removeBudget(id: string): Promise<void> {
    return api.delete(`/admin/kimmp-gateway/budgets/${id}`).then(() => undefined)
  },
  testComplete(input: { system?: string; user?: string; taskType?: string; maxTokens?: number }): Promise<{ text: string }> {
    return api.post('/admin/kimmp-gateway/test-complete', input).then(r => r.data)
  },
  modelMap(): Promise<Record<string, string>> {
    return api.get('/admin/kimmp-gateway/model-map').then(r => r.data.modelMap)
  },
}

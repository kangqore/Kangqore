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
  toolExecutionIds: string[]
  taskType: string | null
  agentRole: string | null
  sourceModule: string | null
  status: 'SUCCESS' | 'ERROR' | 'BLOCKED'
  errorMessage: string | null
  piiDetected: boolean
  piiPatterns: string[]
  promptName: string | null
  promptVersion: number | null
  createdAt: string
}

// S319 — result of checking a call's {promptName, promptVersion} against Gate 3
// drift-alerted benchmark runs. Read-only correlation, no new scoring.
export type PromptRegression =
  | { flagged: false }
  | { flagged: true; runId: string; driftDelta: number; totalScore: number; at: string }

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

export interface PgvectorTableHealth {
  table: 'knowledge_chunks' | 'kimmp_system_knowledge'
  totalRows: number
  indexedRows: number
  indexSizeBytes: number
}

export interface PgvectorBenchmark {
  table: 'knowledge_chunks' | 'kimmp_system_knowledge'
  indexMs: { p50: number; p95: number }
  legacyScanMs: { p50: number; p95: number }
  rowsScanned: number
}

export interface UnifiedSearchResult {
  id: string
  source: 'knowledge_chunk' | 'system_knowledge'
  title: string
  body: string
  score: number
  system?: string
  docType?: string
}

export interface ToolCallExecution {
  id: string
  status: string
  errorMessage: string | null
  action: { name: string; displayName: string } | null
  object: { id: string; properties: Record<string, unknown>; type: { displayName: string } } | null
}

export interface ToolCallRow {
  call: LlmCallLog
  executions: ToolCallExecution[]
}

// S325 — Unified AI Operations Console: everything every earlier phase in
// the roadmap knows about a single call, in one response.
export interface CallDetail {
  call: LlmCallLog
  promptRegression: PromptRegression | null
  agent: { id: string; name: string; role: string; status: string; model: string } | null
  agentQuality: { avgOverall: number | null; evalCount: number } | null
  toolExecutions: ToolCallExecution[]
}

// S327 — AIP Parity Scorecard. `live` = real non-zero production data exists
// for this capability, not just "the code exists." Not a sprint tracker —
// no table records "S308 shipped"; this reports actual usage per capability.
export interface AipCapability {
  key: string
  label: string
  metric: string
  value: number
  live: boolean
}

export interface AipParity {
  capabilities: AipCapability[]
  overall: { liveCount: number; totalCount: number; allLive: boolean }
  computedAt: string
}

// S320 — Eval Health tile. Both read existing Gate 3/3.5/E4 aggregation
// (admin.ts readiness + wir/evaluations/quality) — no new scoring here.
export interface ReadinessSummary {
  readyForRelease: boolean
  overall: number
  blockingIssues: string[]
  warnings: string[]
  timestamp: string
  gates: Record<string, { name: string; status: string; weight: number }>
  detail: {
    benchmark: { score: number; passCount: number; driftAlert: boolean; at: string } | null
    runtime35: { score: number; passCount: number; failCount: number; at: string } | null
  }
}

export interface AgentQuality {
  agentType: string
  avgOverall: number
  evalCount: number
  dimensions: { correct: number; useful: number; complete: number; grounded: number; actionable: number; safe: number }
}

export const gatewayService = {
  listCalls(params?: { actorType?: string; model?: string; taskType?: string; status?: string; page?: number; limit?: number }): Promise<{ calls: LlmCallLog[]; total: number; pages: number }> {
    return api.get('/admin/kimmp-gateway/calls', { params }).then(r => r.data)
  },
  getCall(id: string): Promise<CallDetail> {
    return api.get(`/admin/kimmp-gateway/calls/${id}`).then(r => r.data)
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
  toolCalls(params?: { page?: number; limit?: number }): Promise<{ rows: ToolCallRow[]; total: number; pages: number }> {
    return api.get('/admin/kimmp-gateway/tool-calls', { params }).then(r => r.data)
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
  pgvectorHealth(): Promise<PgvectorTableHealth[]> {
    return api.get('/admin/kimmp-gateway/pgvector/health').then(r => r.data.health)
  },
  pgvectorBackfill(): Promise<Array<{ table: string; updated: number }>> {
    return api.post('/admin/kimmp-gateway/pgvector/backfill', {}).then(r => r.data.results)
  },
  pgvectorBenchmark(): Promise<PgvectorBenchmark[]> {
    return api.get('/admin/kimmp-gateway/pgvector/benchmark').then(r => r.data.benchmarks)
  },
  knowledgeSearch(q: string, k = 8): Promise<UnifiedSearchResult[]> {
    return api.get('/admin/kangqore-immp/knowledge/search', { params: { q, k } }).then(r => r.data.results)
  },
  readiness(): Promise<ReadinessSummary> {
    return api.get('/admin/kangqore-immp/readiness').then(r => r.data)
  },
  evalQuality(days = 30): Promise<AgentQuality[]> {
    return api.get('/admin/kangqore-immp/wir/evaluations/quality', { params: { days } }).then(r => r.data.quality)
  },
  aipParity(): Promise<AipParity> {
    return api.get('/admin/kangqore-immp/aip-parity').then(r => r.data)
  },
}

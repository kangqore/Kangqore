// E1 — AI Model Registry
// Every model selection flows through here.
// Services declare capability + priority; the registry picks the model.

export type ModelCapability =
  | 'strategic_reasoning'
  | 'planning'
  | 'analysis'
  | 'summarization'
  | 'classification'
  | 'fast_response'
  | 'code'
  | 'embedding'

export type ModelPriority = 'quality' | 'speed' | 'cost'

export type ModelProvider = 'anthropic' | 'ollama'

export interface ModelDefinition {
  id:           string           // e.g. 'claude-sonnet-4-6'
  displayName:  string
  provider:     ModelProvider
  capabilities: ModelCapability[]
  costPer1kIn:  number           // USD per 1k input tokens
  costPer1kOut: number           // USD per 1k output tokens
  avgLatencyMs: number           // rolling average (updated at runtime)
  failureCount: number           // rolling window
  callCount:    number
  fallbackTo?:  string           // model id
  enabled:      boolean
}

// In-memory health state (rolling last 100 calls per model)
const _health: Record<string, { latencies: number[]; failures: number; calls: number }> = {}

const REGISTRY: ModelDefinition[] = [
  {
    id: 'claude-haiku-4-5-20251001',
    displayName: 'Claude Haiku 4.5',
    provider: 'anthropic',
    capabilities: ['summarization', 'classification', 'fast_response', 'analysis'],
    costPer1kIn: 0.00025, costPer1kOut: 0.00125,
    avgLatencyMs: 800,  failureCount: 0, callCount: 0,
    enabled: true,
  },
  {
    id: 'claude-sonnet-4-6',
    displayName: 'Claude Sonnet 4.6',
    provider: 'anthropic',
    capabilities: ['strategic_reasoning', 'planning', 'analysis', 'code', 'summarization', 'classification'],
    costPer1kIn: 0.003, costPer1kOut: 0.015,
    avgLatencyMs: 2000, failureCount: 0, callCount: 0,
    fallbackTo: 'claude-haiku-4-5-20251001',
    enabled: true,
  },
  {
    id: 'claude-opus-4-8',
    displayName: 'Claude Opus 4.8',
    provider: 'anthropic',
    capabilities: ['strategic_reasoning', 'planning', 'analysis', 'code'],
    costPer1kIn: 0.015, costPer1kOut: 0.075,
    avgLatencyMs: 4000, failureCount: 0, callCount: 0,
    fallbackTo: 'claude-sonnet-4-6',
    enabled: true,
  },
]

// Capability → priority → model id map
const ROUTING_TABLE: Record<ModelCapability, Record<ModelPriority, string>> = {
  strategic_reasoning: { quality: 'claude-sonnet-4-6',          speed: 'claude-haiku-4-5-20251001', cost: 'claude-haiku-4-5-20251001' },
  planning:            { quality: 'claude-sonnet-4-6',          speed: 'claude-sonnet-4-6',          cost: 'claude-haiku-4-5-20251001' },
  analysis:            { quality: 'claude-sonnet-4-6',          speed: 'claude-haiku-4-5-20251001', cost: 'claude-haiku-4-5-20251001' },
  summarization:       { quality: 'claude-haiku-4-5-20251001',  speed: 'claude-haiku-4-5-20251001', cost: 'claude-haiku-4-5-20251001' },
  classification:      { quality: 'claude-haiku-4-5-20251001',  speed: 'claude-haiku-4-5-20251001', cost: 'claude-haiku-4-5-20251001' },
  fast_response:       { quality: 'claude-haiku-4-5-20251001',  speed: 'claude-haiku-4-5-20251001', cost: 'claude-haiku-4-5-20251001' },
  code:                { quality: 'claude-sonnet-4-6',          speed: 'claude-sonnet-4-6',          cost: 'claude-haiku-4-5-20251001' },
  embedding:           { quality: 'claude-haiku-4-5-20251001',  speed: 'claude-haiku-4-5-20251001', cost: 'claude-haiku-4-5-20251001' },
}

export interface ResolvedModel {
  modelId:     string
  displayName: string
  provider:    ModelProvider
  costPer1kIn: number
  costPer1kOut: number
  capability:  ModelCapability
  priority:    ModelPriority
  healthStatus: 'HEALTHY' | 'DEGRADED' | 'OFFLINE'
}

export class AIModelRegistry {

  static resolve(opts: { capability: ModelCapability; priority?: ModelPriority }): ResolvedModel {
    const priority  = opts.priority ?? 'quality'
    const modelId   = ROUTING_TABLE[opts.capability]?.[priority] ?? 'claude-haiku-4-5-20251001'
    const model     = REGISTRY.find(m => m.id === modelId && m.enabled)
              ?? REGISTRY.find(m => m.id === 'claude-haiku-4-5-20251001')!

    const h = _health[model.id]
    const failRate = h && h.calls > 0 ? h.failures / h.calls : 0
    const healthStatus: ResolvedModel['healthStatus'] =
      failRate > 0.3 ? 'OFFLINE'  :
      failRate > 0.1 ? 'DEGRADED' : 'HEALTHY'

    return {
      modelId:      model.id,
      displayName:  model.displayName,
      provider:     model.provider,
      costPer1kIn:  model.costPer1kIn,
      costPer1kOut: model.costPer1kOut,
      capability:   opts.capability,
      priority,
      healthStatus,
    }
  }

  static recordCall(modelId: string, latencyMs: number, success: boolean): void {
    if (!_health[modelId]) _health[modelId] = { latencies: [], failures: 0, calls: 0 }
    const h = _health[modelId]
    h.calls++
    if (!success) h.failures++
    h.latencies.push(latencyMs)
    if (h.latencies.length > 100) h.latencies.shift()

    // Update model avgLatencyMs
    const model = REGISTRY.find(m => m.id === modelId)
    if (model && h.latencies.length > 0) {
      model.avgLatencyMs = Math.round(h.latencies.reduce((a, b) => a + b) / h.latencies.length)
      model.failureCount = h.failures
      model.callCount    = h.calls
    }
  }

  static list(): ModelDefinition[] {
    return REGISTRY.map(m => ({
      ...m,
      failureRate: _health[m.id]?.calls
        ? _health[m.id].failures / _health[m.id].calls
        : 0,
    }) as any)
  }

  static health(): Array<{ modelId: string; displayName: string; status: string; avgLatencyMs: number; failureRate: number; callCount: number; fallbackPct: number }> {
    return REGISTRY.map(m => {
      const h = _health[m.id] ?? { latencies: [], failures: 0, calls: 0 }
      const failRate = h.calls > 0 ? h.failures / h.calls : 0
      return {
        modelId:      m.id,
        displayName:  m.displayName,
        status:       failRate > 0.3 ? 'OFFLINE' : failRate > 0.1 ? 'DEGRADED' : 'HEALTHY',
        avgLatencyMs: m.avgLatencyMs,
        failureRate:  Math.round(failRate * 100),
        callCount:    h.calls,
        fallbackPct:  0, // calculated separately
      }
    })
  }

  static estimateCost(modelId: string, tokensIn: number, tokensOut: number): number {
    const model = REGISTRY.find(m => m.id === modelId)
    if (!model) return 0
    return (tokensIn / 1000) * model.costPer1kIn + (tokensOut / 1000) * model.costPer1kOut
  }
}

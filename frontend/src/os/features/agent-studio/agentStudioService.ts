import { api } from '@lib/api'

// S321-S324 — Agent Studio. KimmpAgent (name, role, tools, model, systemPrompt)
// already existed and was write-only (populated by the pack-install flow) —
// this is the first UI that reads a row back out, runs it, and edits it.

export interface KimmpAgent {
  id: string
  name: string
  role: string
  description: string | null
  maxLevel: number
  status: 'ACTIVE' | 'SUSPENDED' | 'KILLED'
  tools: string[]
  model: string
  systemPrompt: string | null
  promptName: string | null
  createdAt: string
  updatedAt: string
}

export interface KimmpToolCatalogEntry {
  id: string
  name: string
  description: string
  category: string
  defaultLevel: number
  isActive: boolean
}

export interface AgentRunResult {
  output: string
  success: boolean
  durationMs: number
  toolCalls: Array<{ name: string; input: any; result: string }>
  logId: string | null
}

export interface KimmpAgentLog {
  id: string
  agentId: string
  action: string
  input: any
  output: any
  level: number
  status: string
  durationMs: number | null
  createdAt: string
}

export interface AgentPerformance {
  agent: { id: string; name: string; role: string; status: string; model: string }
  callCount: number
  cost: number
  avgLatencyMs: number
  errorCount: number
  toolInvocations: number
  runCount: number
  avgQuality: number | null
  evalCount: number
}

export interface LegacyBucket {
  label: string
  callCount: number
  cost: number
  avgLatencyMs: number
  errorCount: number
}

export const MODEL_OPTIONS = [
  { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5 — fast, cheap' },
  { id: 'claude-sonnet-4-6',         label: 'Sonnet 4.6 — balanced' },
  { id: 'claude-opus-4-8',           label: 'Opus 4.8 — deepest reasoning' },
] as const

export interface AgentInput {
  name: string
  role: string
  description?: string
  maxLevel?: number
  tools?: string[]
  model?: string
  systemPrompt?: string
  promptName?: string | null
}

export const agentStudioService = {
  list(): Promise<KimmpAgent[]> {
    return api.get('/admin/kangqore-immp/authority/agents').then(r => r.data.agents)
  },
  create(input: AgentInput): Promise<KimmpAgent> {
    return api.post('/admin/kangqore-immp/authority/agents', input).then(r => r.data.agent)
  },
  update(id: string, patch: Partial<AgentInput>): Promise<KimmpAgent> {
    return api.patch(`/admin/kangqore-immp/authority/agents/${id}`, patch).then(r => r.data.agent)
  },
  setLevel(id: string, level: number): Promise<KimmpAgent> {
    return api.patch(`/admin/kangqore-immp/authority/agents/${id}/level`, { level }).then(r => r.data.agent)
  },
  suspend(id: string): Promise<void> {
    return api.patch(`/admin/kangqore-immp/authority/agents/${id}/suspend`).then(() => undefined)
  },
  activate(id: string): Promise<void> {
    return api.patch(`/admin/kangqore-immp/authority/agents/${id}/activate`).then(() => undefined)
  },
  kill(id: string): Promise<void> {
    return api.delete(`/admin/kangqore-immp/authority/agents/${id}`).then(() => undefined)
  },
  run(id: string, input: string): Promise<AgentRunResult> {
    return api.post(`/admin/kangqore-immp/authority/agents/${id}/run`, { input }).then(r => r.data)
  },
  logs(id: string): Promise<KimmpAgentLog[]> {
    return api.get(`/admin/kangqore-immp/authority/agents/${id}/logs`).then(r => r.data.logs)
  },
  tools(): Promise<KimmpToolCatalogEntry[]> {
    return api.get('/admin/kangqore-immp/authority/tools').then(r => r.data.tools)
  },
  syncTools(): Promise<{ added: number; total: number }> {
    return api.post('/admin/kangqore-immp/authority/tools/sync').then(r => r.data)
  },
  performance(): Promise<{ agents: AgentPerformance[]; legacyBuckets: LegacyBucket[] }> {
    return api.get('/admin/kimmp-gateway/agents/performance').then(r => r.data)
  },
}

import { api } from '@lib/api'

export interface PromptVersion {
  id: string
  name: string
  version: number
  content: string
  active: boolean
  notes: string | null
  createdAt: string
}

export interface PromptNameSummary {
  name: string
  activeVersion: number
  totalVersions: number
}

// S319 — read-only correlation against Gate 3 drift-alerted benchmark runs;
// no new scoring, just a lookup keyed on {promptName: version}.
export type PromptRegression =
  | { flagged: false }
  | { flagged: true; runId: string; driftDelta: number; totalScore: number; at: string }

export interface PromptUsage {
  name: string
  callsToday: number
  last30Days: number
  byVersion: Array<{ version: number; callCount: number; cost: number; tokens: number; errors: number; regression: PromptRegression }>
}

export const promptRegistryService = {
  list(): Promise<{ prompts: PromptVersion[]; names: PromptNameSummary[] }> {
    return api.get('/admin/kangqore-immp/wir/prompts').then(r => r.data)
  },
  get(name: string, version?: number): Promise<{ name: string; version?: number; content: string }> {
    return api.get(`/admin/kangqore-immp/wir/prompts/${name}`, { params: version ? { version } : {} }).then(r => r.data)
  },
  create(name: string, content: string, notes?: string): Promise<PromptVersion> {
    return api.post(`/admin/kangqore-immp/wir/prompts/${name}`, { content, notes }).then(r => r.data)
  },
  rollback(name: string, version: number): Promise<void> {
    return api.post(`/admin/kangqore-immp/wir/prompts/${name}/rollback`, { version }).then(() => undefined)
  },
  usage(name: string): Promise<PromptUsage> {
    return api.get(`/admin/kimmp-gateway/prompts/${name}/usage`).then(r => r.data)
  },
}

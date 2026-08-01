import { api } from '@lib/api'

// S299 — Policy Gate Builder. Wraps the existing KimmpPolicy CRUD
// (backend/src/services/policyEngine.service.ts, exposed under
// /admin/kangqore-immp/policies) which the Action Engine now actually enforces
// as of S298 — this UI is the first way to edit those rules without curl.

export interface KimmpPolicy {
  id: string
  name: string
  description: string | null
  trigger: string
  condition: { field?: string; operator?: string; value?: any; AND?: any[]; OR?: any[] }
  effect: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL' | 'NOTIFY'
  priority: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export const policyGateService = {
  list(): Promise<KimmpPolicy[]> {
    return api.get('/admin/kangqore-immp/policies').then(r => r.data?.items ?? [])
  },
  create(input: { name: string; description?: string; trigger: string; condition: object; effect: string; priority?: number }): Promise<KimmpPolicy> {
    return api.post('/admin/kangqore-immp/policies', input).then(r => r.data)
  },
  update(id: string, input: Partial<{ name: string; description: string; trigger: string; condition: object; effect: string; priority: number; enabled: boolean }>): Promise<KimmpPolicy> {
    return api.patch(`/admin/kangqore-immp/policies/${id}`, input).then(r => r.data)
  },
  remove(id: string): Promise<void> {
    return api.delete(`/admin/kangqore-immp/policies/${id}`).then(() => undefined)
  },
  check(input: { trigger: string; params: Record<string, any>; actorId?: string }): Promise<{ effect: string; policyId: string | null; policyName: string | null; reason: string }> {
    return api.post('/admin/kangqore-immp/policies/check', input).then(r => r.data)
  },
}

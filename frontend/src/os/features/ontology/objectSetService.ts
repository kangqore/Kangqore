import { api } from '@lib/api'

export type FilterOp = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in' | 'within_km'

export interface FilterNode { type: 'filter'; field: string; op: FilterOp; value: any }
export interface CombinatorNode { type: 'union' | 'intersection'; sets: QueryNode[] }
export interface ComplementNode { type: 'complement'; set: QueryNode; scopeTypeId?: string }
export type QueryNode = FilterNode | CombinatorNode | ComplementNode

export interface ObjectSet {
  id: string
  name: string
  description: string | null
  rootTypeId: string | null
  rootType?: { name: string; displayName: string; icon: string | null; color: string | null } | null
  query: QueryNode
  tags: string[]
  isPublic: boolean
  isSystem: boolean
  createdBy: string | null
  lastRunAt: string | null
  lastCount: number
  createdAt: string
  updatedAt: string
}

export interface ObjectSetInput {
  name: string
  description?: string
  rootTypeId?: string | null
  query: QueryNode
  tags?: string[]
  isPublic?: boolean
}

export const objectSetService = {
  list(params?: { tag?: string; isPublic?: boolean; search?: string }): Promise<ObjectSet[]> {
    return api.get('/admin/ontology/object-sets', { params }).then(r => r.data?.sets ?? [])
  },

  get(id: string): Promise<{ set: ObjectSet; objects: any[] }> {
    return api.get(`/admin/ontology/object-sets/${id}`).then(r => r.data)
  },

  create(input: ObjectSetInput): Promise<ObjectSet> {
    return api.post('/admin/ontology/object-sets', input).then(r => r.data.set)
  },

  update(id: string, input: Partial<ObjectSetInput>): Promise<ObjectSet> {
    return api.patch(`/admin/ontology/object-sets/${id}`, input).then(r => r.data.set)
  },

  remove(id: string): Promise<void> {
    return api.delete(`/admin/ontology/object-sets/${id}`).then(() => undefined)
  },

  execute(id: string): Promise<{ objects: any[]; count: number }> {
    return api.post(`/admin/ontology/object-sets/${id}/execute`, {}).then(r => r.data)
  },

  preview(query: QueryNode): Promise<{ objects: any[]; count: number }> {
    return api.post('/admin/ontology/object-sets/preview', { query }).then(r => r.data)
  },

  subscribe(id: string): Promise<{ room: string; socketEvent: string; lastCount: number; lastRunAt: string | null }> {
    return api.post(`/admin/ontology/object-sets/${id}/subscribe`, {}).then(r => r.data)
  },

  seed(): Promise<Array<{ created: boolean; name: string }>> {
    return api.post('/admin/ontology/object-sets/seed', {}).then(r => r.data.results)
  },
}

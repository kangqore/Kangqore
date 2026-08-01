import { api } from '@lib/api'

export interface OntologyPipeline {
  id: string
  name: string
  sourceType: 'INTERNAL' | 'WEBHOOK' | 'CSV'
  sourceQuery: Record<string, any>
  targetTypeId: string
  targetType?: { name: string; displayName: string; icon: string | null; color: string | null }
  fieldMapping: Record<string, string>
  schedule: string
  enabled: boolean
  lastRunAt: string | null
  lastObjectCount: number
  createdAt: string
  updatedAt: string
}

export const pipelineService = {
  list(): Promise<OntologyPipeline[]> {
    return api.get('/admin/ontology/pipelines').then(r => r.data?.pipelines ?? [])
  },
  seedBuiltins(): Promise<Array<{ created: boolean; name: string }>> {
    return api.post('/admin/ontology/pipelines/seed', {}).then(r => r.data.results)
  },
  update(id: string, patch: Partial<{ name: string; fieldMapping: Record<string, string>; schedule: string; enabled: boolean }>): Promise<OntologyPipeline> {
    return api.patch(`/admin/ontology/pipelines/${id}`, patch).then(r => r.data.pipeline)
  },
  remove(id: string): Promise<void> {
    return api.delete(`/admin/ontology/pipelines/${id}`).then(() => undefined)
  },
  run(id: string): Promise<{ objectCount: number }> {
    return api.post(`/admin/ontology/pipelines/${id}/run`, {}).then(r => r.data)
  },
  runAll(): Promise<Array<{ pipelineId: string; name: string; objectCount: number }>> {
    return api.post('/admin/ontology/pipelines/run-all', {}).then(r => r.data.results)
  },
}

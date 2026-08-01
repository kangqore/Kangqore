import { api } from '@lib/api'
import type { SeriesPoint } from './components/Sparkline'

export type Resolution = 'raw' | 'hour' | 'day' | 'week'

export const timeSeriesService = {
  append(objectId: string, propertyName: string, value: number, unit?: string): Promise<void> {
    return api.post(`/admin/ontology/objects/${objectId}/timeseries`, { propertyName, value, unit }).then(() => undefined)
  },
  query(objectId: string, opts?: { propertyName?: string; resolution?: Resolution }): Promise<Record<string, SeriesPoint[]>> {
    return api.get(`/admin/ontology/objects/${objectId}/timeseries`, { params: opts }).then(r => r.data.series ?? {})
  },
}

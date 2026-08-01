// S303 — Time-Series Properties
// A property on an OntologyObject can carry many timestamped values instead
// of one static one — sensor readings, OIS history, price data. Palantir's
// ontology is a live projection of raw data, not a manually curated snapshot;
// this is one of the primitives that makes ours feel the same way.

import { prisma } from '../lib/prisma'

export type Resolution = 'raw' | 'hour' | 'day' | 'week'
export interface SeriesPoint { timestamp: Date; value: number; unit: string | null }

function bucketStart(date: Date, resolution: Resolution): Date {
  const d = new Date(date)
  if (resolution === 'hour') { d.setMinutes(0, 0, 0); return d }
  if (resolution === 'day')  { d.setHours(0, 0, 0, 0); return d }
  if (resolution === 'week') { d.setDate(d.getDate() - d.getDay()); d.setHours(0, 0, 0, 0); return d }
  return d
}

function bucket(points: SeriesPoint[], resolution: Resolution): SeriesPoint[] {
  if (resolution === 'raw') return points
  const buckets = new Map<string, { start: Date; sum: number; count: number; unit: string | null }>()
  for (const p of points) {
    const start = bucketStart(p.timestamp, resolution)
    const key = start.toISOString()
    const existing = buckets.get(key)
    if (existing) { existing.sum += p.value; existing.count += 1 }
    else buckets.set(key, { start, sum: p.value, count: 1, unit: p.unit })
  }
  return Array.from(buckets.values())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .map(b => ({ timestamp: b.start, value: b.sum / b.count, unit: b.unit }))
}

export const OntologyTimeSeriesService = {
  async append(objectId: string, propertyName: string, value: number, unit?: string | null, timestamp?: Date) {
    return prisma.ontologyTimeSeries.create({
      data: { objectId, propertyName, value, unit: unit ?? undefined, timestamp: timestamp ?? new Date() },
    })
  },

  /** All series for an object, grouped by propertyName. Pass propertyName to scope to one. */
  async query(objectId: string, opts: { propertyName?: string; from?: Date; to?: Date; resolution?: Resolution } = {}): Promise<Record<string, SeriesPoint[]>> {
    const where: any = { objectId }
    if (opts.propertyName) where.propertyName = opts.propertyName
    if (opts.from || opts.to) where.timestamp = { ...(opts.from && { gte: opts.from }), ...(opts.to && { lte: opts.to }) }

    const rows = await prisma.ontologyTimeSeries.findMany({ where, orderBy: { timestamp: 'asc' } })
    const grouped = new Map<string, SeriesPoint[]>()
    for (const r of rows) {
      if (!grouped.has(r.propertyName)) grouped.set(r.propertyName, [])
      grouped.get(r.propertyName)!.push({ timestamp: r.timestamp, value: r.value, unit: r.unit })
    }

    const resolution = opts.resolution ?? 'raw'
    const out: Record<string, SeriesPoint[]> = {}
    for (const [propertyName, points] of grouped) out[propertyName] = bucket(points, resolution)
    return out
  },

  /** Last N raw points for one property — cheap enough to call per-node for sparklines. */
  async latest(objectId: string, propertyName: string, limit = 14): Promise<SeriesPoint[]> {
    const rows = await prisma.ontologyTimeSeries.findMany({
      where: { objectId, propertyName },
      orderBy: { timestamp: 'desc' },
      take: limit,
    })
    return rows.reverse().map(r => ({ timestamp: r.timestamp, value: r.value, unit: r.unit }))
  },
}

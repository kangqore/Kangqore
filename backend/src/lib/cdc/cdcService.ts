// F-Infra Sprint +4 — CDC (Change Data Capture) Service
//
// Captures Postgres mutations as a stream of CDCEvents.
// Prototype approach: explicit emit() calls from route handlers on key tables.
// Production upgrade path: replace with pg LISTEN/NOTIFY triggers or Prisma $extends.

import { randomUUID } from 'crypto'
import { CDCEvent, CDCOperation, getEventBus } from '../eventBus'
import { emitToAdmins } from '../../socket'

const CDC_TOPIC = 'cdc.events'
const RING_SIZE = 500   // max events held in memory

class CdcServiceImpl {
  private ring: CDCEvent[] = []
  private stats: Record<string, Record<CDCOperation, number>> = {}
  private totalCount = 0
  private startedAt = new Date().toISOString()
  private configured = false

  async init() {
    if (this.configured) return
    this.configured = true
    const bus = await getEventBus()
    bus.subscribe<CDCEvent>(CDC_TOPIC, (event) => {
      emitToAdmins('cdc:event', event)
    })
    console.info('[CDC] service ready — emitting to Socket.io admin room')
  }

  async emit<T extends Record<string, any>>(
    table: string,
    op: CDCOperation,
    before: T | null,
    after: T | null,
    meta?: Record<string, any>,
  ): Promise<void> {
    const event: CDCEvent<T> = {
      id:        randomUUID(),
      table,
      op,
      before,
      after,
      timestamp: new Date().toISOString(),
      source:    'prisma',
      meta,
    }

    // Update ring buffer (discard oldest when full)
    if (this.ring.length >= RING_SIZE) this.ring.shift()
    this.ring.push(event)

    // Update stats
    if (!this.stats[table]) this.stats[table] = { INSERT: 0, UPDATE: 0, DELETE: 0, UPSERT: 0 }
    this.stats[table][op]++
    this.totalCount++

    // Publish to bus (which broadcasts to Socket.io via subscriber above)
    const bus = await getEventBus()
    await bus.publish(CDC_TOPIC, event)
  }

  getRecentEvents(opts?: { table?: string; op?: CDCOperation; limit?: number }): CDCEvent[] {
    let events = [...this.ring].reverse()   // newest first
    if (opts?.table) events = events.filter(e => e.table === opts.table)
    if (opts?.op)    events = events.filter(e => e.op    === opts.op)
    return events.slice(0, opts?.limit ?? 100)
  }

  getStats() {
    const topTables = Object.entries(this.stats)
      .map(([table, ops]) => ({
        table,
        inserts:  ops.INSERT,
        updates:  ops.UPDATE,
        deletes:  ops.DELETE,
        upserts:  ops.UPSERT,
        total:    ops.INSERT + ops.UPDATE + ops.DELETE + ops.UPSERT,
      }))
      .sort((a, b) => b.total - a.total)

    return {
      totalEvents: this.totalCount,
      tablesTracked: Object.keys(this.stats).length,
      ringSize: this.ring.length,
      ringCapacity: RING_SIZE,
      startedAt: this.startedAt,
      topTables,
    }
  }

  getConfig() {
    return {
      topic:       CDC_TOPIC,
      ringSize:    RING_SIZE,
      startedAt:   this.startedAt,
      tablesTracked: Object.keys(this.stats),
    }
  }
}

export const CdcService = new CdcServiceImpl()

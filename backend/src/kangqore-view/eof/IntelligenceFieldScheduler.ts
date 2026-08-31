// Makes the refresh policy real.
//
// `IntelligenceField.refresh` accepted ON_CHANGE | SCHEDULED | MANUAL and
// nothing read it, so every field behaved as MANUAL whatever it claimed. That
// is the same fault as a column declared with nothing computing it — the model
// asserting a behaviour it does not have — reintroduced inside the very model
// built to prevent it. This is the consumer that was missing.
//
//   ON_CHANGE  the object was written, so anything derived from it is stale.
//              Driven from the CDC stream, the same feed automations use.
//   SCHEDULED  swept on an interval, for fields whose inputs drift without the
//              object itself being touched — an overdue date passing, a peer
//              group shifting.
//   MANUAL     only when someone asks.
//
// The loop guard matters more here than in automations: a field's own write
// emits CDC, which would re-trigger the field, which would write again. Field
// writes are marked and skipped on the way back in.

import { prisma } from '../../lib/prisma'
import { getEventBus, type CDCEvent } from '../../lib/eventBus'
import { IntelligenceFieldEngine } from './IntelligenceFieldEngine'

const CDC_TOPIC = 'cdc.events'

/** Properties a field itself writes. A change confined to these is not news. */
const FIELD_WRITTEN = /_confidence$/

export const IntelligenceFieldScheduler = {
  /**
   * Recompute every ON_CHANGE field for one object.
   *
   * `changedKeys` narrows the work: a field only reruns when something it
   * actually reads has moved. A field declaring no inputs reads everything, so
   * it always reruns.
   */
  async onObjectChanged(
    objectId: string, typeName: string, changedKeys: string[],
  ): Promise<{ evaluated: number; recomputed: number; skipped?: string }> {
    const fields = await prisma.intelligenceField.findMany({
      where: { typeName, enabled: true, refresh: 'ON_CHANGE' },
    })
    if (!fields.length) return { evaluated: 0, recomputed: 0 }

    // Every property any field on this type writes — not just this field's own
    // output. Guarding only against a field's own output still lets field A's
    // write trigger field B, whose write triggers A again: a real loop, and one
    // the first version of this guard did not catch.
    const allOutputs = await prisma.intelligenceField.findMany({
      where: { typeName }, select: { outputField: true },
    })
    const written = new Set(allOutputs.map(o => o.outputField))
    const isFieldWritten = (k: string) =>
      written.has(k) || FIELD_WRITTEN.test(k) || k === '_fieldComputed'

    // A change containing nothing but computed output is not news.
    if (changedKeys.length && changedKeys.every(isFieldWritten)) {
      return { evaluated: fields.length, recomputed: 0, skipped: 'only computed properties changed' }
    }

    let recomputed = 0
    for (const f of fields) {
      const inputs = (f.inputs as string[]) ?? []

      // A field with declared inputs only cares when one of them moved.
      if (inputs.length && changedKeys.length && !changedKeys.some(k => inputs.includes(k))) continue

      const r = await IntelligenceFieldEngine.computeOne(f.id, objectId)
      if (r.status === 'OK') recomputed++
    }
    return { evaluated: fields.length, recomputed }
  },

  /** Sweep every SCHEDULED field across its type. */
  async runScheduled() {
    const fields = await prisma.intelligenceField.findMany({
      where: { enabled: true, refresh: 'SCHEDULED' },
    })
    const results = []
    for (const f of fields) {
      try {
        results.push(await IntelligenceFieldEngine.computeAll(f.id))
      } catch (e: any) {
        // One bad field must not stop the sweep.
        results.push({ field: f.name, error: e?.message ?? String(e) })
      }
    }
    return { fields: fields.length, results }
  },
}

/**
 * Subscribe to the change feed. Returns what it armed, so a caller can tell an
 * active subscription from a silent one — the distinction this module exists
 * because of.
 */
export async function startIntelligenceFieldRefresh() {
  const bus = await getEventBus()

  bus.subscribe<CDCEvent>(CDC_TOPIC, (event: any) => {
    if (event?.table !== 'ontology_objects') return
    if (!['INSERT', 'UPDATE'].includes(event.op)) return

    const after = event.after
    if (!after?.id) return
    // A field's own write must not come back around.
    if ((after.properties as any)?._fieldComputed) return

    const before = (event.before?.properties ?? {}) as Record<string, any>
    const now = (after.properties ?? {}) as Record<string, any>
    const changedKeys = [...new Set([...Object.keys(before), ...Object.keys(now)])]
      .filter(k => JSON.stringify(before[k]) !== JSON.stringify(now[k]))

    prisma.ontologyObjectType
      .findUnique({ where: { id: after.typeId }, select: { name: true } })
      .then(t => t && IntelligenceFieldScheduler.onObjectChanged(after.id, t.name, changedKeys))
      .catch(err => console.warn('[IntelligenceFields] refresh failed:', err?.message))
  })

  const onChange = await prisma.intelligenceField.count({ where: { enabled: true, refresh: 'ON_CHANGE' } })
  const scheduled = await prisma.intelligenceField.count({ where: { enabled: true, refresh: 'SCHEDULED' } })
  return { subscribed: true, onChange, scheduled }
}

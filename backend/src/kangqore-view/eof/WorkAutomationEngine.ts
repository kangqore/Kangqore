// Automations that actually fire.
//
// The previous WorkAutomationService had the right shape — trigger, condition,
// action — and was completely inert: it stored to a `workAutomation` model that
// did not exist, and its `run()` had zero callers, so a rule could be authored
// and would never execute once.
//
// This one is driven from the CDC stream. Every write through OntologyGateway
// emits a change event with a before-image, which is what makes diff-shaped
// triggers ("status moved to BLOCKED") expressible at all — without the before
// image you can only see the new value, not that it changed.
//
// Effects go back through the gateway, so an automated change is policy-checked
// and audited exactly like a human one, and it emits CDC of its own. Re-entry is
// bounded by a depth marker: an automation's own writes cannot cascade forever.

import { prisma } from '../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR } from './OntologyGateway'
import { WORK_STATES } from './EnterpriseObjectModel'
import { getEventBus, type CDCEvent } from '../../lib/eventBus'

const CDC_TOPIC = 'cdc.events'

/** Actor automations act as. Distinct from a human, so the audit trail separates them. */
const AUTOMATION_ACTOR = { id: 'work-automation', type: 'SYSTEM' as const, clearances: [] }

export type TriggerType =
  | 'STATUS_CHANGE' | 'CREATED' | 'PROGRESS_REACHED' | 'FIELD_CHANGED'

export interface AutomationTrigger {
  type: TriggerType
  /** STATUS_CHANGE: { to?, from? } · PROGRESS_REACHED: { gte } · FIELD_CHANGED: { field } */
  config?: Record<string, any>
}
export interface AutomationCondition {
  field: string
  op: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'contains' | 'in'
  value: any
}
export interface AutomationAction {
  type: 'SET_FIELD' | 'SET_STATUS' | 'SET_PRIORITY'
  params: Record<string, any>
}

function evalCondition(c: AutomationCondition, props: any): boolean {
  const v = props?.[c.field]
  switch (c.op) {
    case 'eq': return v === c.value
    case 'neq': return v !== c.value
    case 'gt': return typeof v === 'number' && v > c.value
    case 'gte': return typeof v === 'number' && v >= c.value
    case 'lt': return typeof v === 'number' && v < c.value
    case 'contains': return typeof v === 'string' && v.toLowerCase().includes(String(c.value).toLowerCase())
    case 'in': return Array.isArray(c.value) && c.value.includes(v)
    default: return false
  }
}

/** Does this change match the trigger? Needs both images to see a transition. */
function triggerMatches(t: AutomationTrigger, op: string, before: any, after: any): boolean {
  const cfg = t.config ?? {}
  const b = before?.properties ?? {}
  const a = after?.properties ?? {}

  switch (t.type) {
    case 'CREATED':
      return op === 'INSERT'
    case 'STATUS_CHANGE': {
      if (op !== 'UPDATE') return false
      // A write that did not move the status is not a status change, even
      // though it is an UPDATE. Comparing to the before image is the point.
      if (b.status === a.status) return false
      if (cfg.to && a.status !== cfg.to) return false
      if (cfg.from && b.status !== cfg.from) return false
      return true
    }
    case 'PROGRESS_REACHED': {
      if (op !== 'UPDATE' || typeof cfg.gte !== 'number') return false
      const was = typeof b.progress === 'number' ? b.progress : 0
      const now = typeof a.progress === 'number' ? a.progress : 0
      // Fire on crossing the threshold, not on every write above it.
      return was < cfg.gte && now >= cfg.gte
    }
    case 'FIELD_CHANGED': {
      if (op !== 'UPDATE' || !cfg.field) return false
      return JSON.stringify(b[cfg.field]) !== JSON.stringify(a[cfg.field])
    }
    default:
      return false
  }
}

export const WorkAutomationEngine = {
  list() {
    return prisma.workAutomation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { runs: true } } },
    })
  },

  async create(input: {
    name: string; description?: string
    trigger: AutomationTrigger; conditions?: AutomationCondition[]
    actions: AutomationAction[]; typeName?: string; createdBy?: string
  }) {
    if (!input.name) throw new Error('name is required')
    if (!input.trigger?.type) throw new Error('trigger.type is required')
    if (!input.actions?.length) throw new Error('at least one action is required')

    for (const a of input.actions) {
      if (a.type === 'SET_STATUS' && !WORK_STATES.includes(a.params?.value)) {
        throw new Error(`SET_STATUS value "${a.params?.value}" is not a work state`)
      }
    }
    return prisma.workAutomation.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        trigger: input.trigger as any,
        conditions: (input.conditions ?? []) as any,
        actions: input.actions as any,
        typeName: input.typeName ?? null,
        createdBy: input.createdBy ?? null,
      },
    })
  },

  async toggle(id: string) {
    const a = await prisma.workAutomation.findUnique({ where: { id } })
    if (!a) throw new Error('No such automation')
    return prisma.workAutomation.update({ where: { id }, data: { enabled: !a.enabled } })
  },

  delete(id: string) {
    return prisma.workAutomation.delete({ where: { id } })
  },

  runs(automationId: string, limit = 25) {
    return prisma.workAutomationRun.findMany({
      where: { automationId }, orderBy: { createdAt: 'desc' }, take: limit,
    })
  },

  /**
   * Evaluate every enabled automation against one change. Returns what fired,
   * so a caller — or a probe — can tell "no automation matched" from
   * "an automation matched and did nothing".
   */
  async evaluate(op: string, before: any, after: any): Promise<{
    evaluated: number; matched: number; applied: string[]; skipped?: string
  }> {
    const object = after ?? before
    if (!object?.id) return { evaluated: 0, matched: 0, applied: [] }

    // A change an automation itself made must not re-trigger the same rules.
    if ((after?.properties as any)?._automated) {
      return { evaluated: 0, matched: 0, applied: [], skipped: 'automated write' }
    }

    const automations = await prisma.workAutomation.findMany({ where: { enabled: true } })
    if (!automations.length) return { evaluated: 0, matched: 0, applied: [] }

    let typeName: string | null = null
    if (automations.some(a => a.typeName)) {
      const t = await prisma.ontologyObjectType.findUnique({
        where: { id: object.typeId }, select: { name: true },
      })
      typeName = t?.name ?? null
    }

    let matched = 0
    const applied: string[] = []

    for (const auto of automations) {
      if (auto.typeName && auto.typeName !== typeName) continue
      if (!triggerMatches(auto.trigger as unknown as AutomationTrigger, op, before, after)) continue

      const conditions = (auto.conditions as unknown as AutomationCondition[]) ?? []
      const props = (after ?? before)?.properties ?? {}
      const conditionsHold = conditions.every(c => evalCondition(c, props))

      if (!conditionsHold) {
        await prisma.workAutomationRun.create({
          data: { automationId: auto.id, objectId: object.id, triggeredBy: op, matched: false },
        })
        continue
      }

      matched++
      const actions = (auto.actions as unknown as AutomationAction[]) ?? []
      const patch: Record<string, any> = {}
      for (const a of actions) {
        if (a.type === 'SET_STATUS') patch.status = a.params?.value
        else if (a.type === 'SET_PRIORITY') patch.priority = a.params?.value
        else if (a.type === 'SET_FIELD' && a.params?.field) patch[a.params.field] = a.params.value
      }

      let error: string | null = null
      if (Object.keys(patch).length) {
        // Marked so the resulting CDC event cannot re-enter this engine.
        const r = await OntologyGateway.patchObject(AUTOMATION_ACTOR, object.id, {
          properties: { ...patch, _automated: true, _automationId: auto.id },
        })
        if (r.status !== 'OK') error = r.reason ?? r.status
        else applied.push(auto.name)
      }

      await prisma.workAutomationRun.create({
        data: {
          automationId: auto.id, objectId: object.id, triggeredBy: op,
          matched: true, actionsApplied: patch as any, error,
        },
      })
      await prisma.workAutomation.update({
        where: { id: auto.id },
        data: { runCount: { increment: 1 }, lastRunAt: new Date(), lastError: error },
      })
    }

    return { evaluated: automations.length, matched, applied }
  },
}

/**
 * Subscribe to the CDC stream. This is the wire that was missing: the engine
 * existed, the change feed existed, and nothing connected them.
 */
export async function startWorkAutomations() {
  const bus = await getEventBus()
  bus.subscribe<CDCEvent>(CDC_TOPIC, (event: any) => {
    if (event?.table !== 'ontology_objects') return
    if (!['INSERT', 'UPDATE'].includes(event.op)) return
    WorkAutomationEngine.evaluate(event.op, event.before, event.after)
      .catch(err => console.warn('[WorkAutomations] evaluation failed:', err?.message))
  })
  const active = await prisma.workAutomation.count({ where: { enabled: true } })
  return { subscribed: true, active }
}

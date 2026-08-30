// The four governed actions a recovery plan is allowed to take.
//
// Without these the chain stops one step short: the DecisionEngine ranks
// threats, the mission parks for approval, a human approves — and then
// AgentMissionEngine finds no registered OntologyAction and marks everything
// SKIPPED. Governance with nothing on the end of it.
//
// Each action below does only what its name says, using only data that
// genuinely exists. That constraint is why there are four and not fourteen:
//
//   REBASELINE_TIMELINE     moves dueDate to the date the Intelligence layer
//                           forecast. A real, derived change.
//   ESCALATE_ITEM           a real transition in the 12-state machine.
//   FLAG_CAPACITY_REQUEST   records that capacity is needed. It deliberately
//                           does NOT assign anyone — no code here knows who is
//                           free, and inventing an assignee would be the kind
//                           of confident wrong answer that makes automation
//                           worse than nothing.
//   REVIEW_ITEM             non-mutating. Emits an audit event only, and is
//                           where every unrecognised recommendation lands.
//
// Effects run inside ActionEngine's transaction, so policy, approval, audit and
// budget gates all apply — the same path a human clicking a button takes.

import { prisma } from '../../lib/prisma'
import { ENTERPRISE_OBJECTS, schemaFor } from './EnterpriseObjectModel'

interface EffectDef { effectType: string; configuration: any; order: number }
interface RecoveryActionDef {
  name: string
  displayName: string
  description: string
  parameters: any[]
  effects: EffectDef[]
  /** Restrict to types that carry the columns the effect writes. */
  appliesTo?: (schema: Record<string, any>) => boolean
}

export const RECOVERY_ACTIONS: RecoveryActionDef[] = [
  {
    name: 'REBASELINE_TIMELINE',
    displayName: 'Re-baseline timeline',
    description:
      'Moves the committed due date to the forecast completion date, keeping the original as previousDueDate so the slip stays visible.',
    parameters: [
      { name: 'newDueDate', type: 'date', required: true, description: 'Forecast completion date' },
      { name: 'recommendation', type: 'string', required: false, description: 'The recommendation this came from' },
    ],
    // Only types that actually have a deadline to move.
    appliesTo: s => !!s.dueDate,
    effects: [
      {
        effectType: 'UPDATE_OBJECT', order: 0,
        configuration: {
          properties: {
            dueDate: '{{newDueDate}}',
            rebaselined: true,
            rebaselineReason: '{{recommendation}}',
          },
        },
      },
      {
        effectType: 'EMIT_EVENT', order: 1,
        configuration: {
          eventType: 'TIMELINE_REBASELINED',
          properties: { newDueDate: '{{newDueDate}}', reason: '{{recommendation}}' },
        },
      },
    ],
  },
  {
    name: 'ESCALATE_ITEM',
    displayName: 'Escalate',
    description:
      'Raises the item to ESCALATED and records why. A real state transition, not a notification.',
    parameters: [
      { name: 'reason', type: 'string', required: true, description: 'Why this is being escalated' },
    ],
    effects: [
      {
        effectType: 'UPDATE_OBJECT', order: 0,
        configuration: { properties: { status: 'ESCALATED', escalationReason: '{{reason}}' } },
      },
      {
        effectType: 'EMIT_EVENT', order: 1,
        configuration: { eventType: 'ESCALATED', properties: { reason: '{{reason}}' } },
      },
    ],
  },
  {
    name: 'FLAG_CAPACITY_REQUEST',
    displayName: 'Request capacity',
    description:
      'Flags that the item is under-resourced. Does not assign anyone — who is available is a human decision this engine has no basis to make.',
    parameters: [
      { name: 'reason', type: 'string', required: true, description: 'Evidence that capacity is short' },
    ],
    effects: [
      {
        effectType: 'UPDATE_OBJECT', order: 0,
        configuration: { properties: { capacityRequested: true, capacityReason: '{{reason}}' } },
      },
      {
        effectType: 'EMIT_EVENT', order: 1,
        configuration: { eventType: 'CAPACITY_REQUESTED', properties: { reason: '{{reason}}' } },
      },
    ],
  },
  {
    name: 'REVIEW_ITEM',
    displayName: 'Flag for review',
    description:
      'Records that a review was requested. Non-mutating, and the deliberate landing place for any recommendation that could not be mapped to a specific action.',
    parameters: [
      { name: 'recommendation', type: 'string', required: false, description: 'The original recommendation text' },
    ],
    effects: [
      {
        effectType: 'EMIT_EVENT', order: 0,
        configuration: { eventType: 'REVIEW_REQUESTED', properties: { recommendation: '{{recommendation}}' } },
      },
    ],
  },
]

export const RecoveryActionSeeder = {
  /**
   * Register every recovery action against every enterprise type it can act on.
   * Idempotent: an existing action has its effects replaced, so editing a
   * definition here takes effect on the next boot rather than silently drifting.
   */
  async seed() {
    const types = await prisma.ontologyObjectType.findMany({
      where: { name: { in: ENTERPRISE_OBJECTS.map(o => o.name) } },
      select: { id: true, name: true },
    })
    const schemas = new Map(ENTERPRISE_OBJECTS.map(d => [d.name, schemaFor(d)]))

    let created = 0, updated = 0

    for (const type of types) {
      const schema = schemas.get(type.name) ?? {}
      for (const def of RECOVERY_ACTIONS) {
        if (def.appliesTo && !def.appliesTo(schema)) continue

        const existing = await prisma.ontologyAction.findUnique({
          where: { typeId_name: { typeId: type.id, name: def.name } },
          select: { id: true },
        })

        const data = {
          displayName: def.displayName,
          description: def.description,
          parameters: def.parameters as any,
          allowedRoles: ['ADMIN'],
        }

        const action = existing
          ? (updated++, await prisma.ontologyAction.update({ where: { id: existing.id }, data }))
          : (created++, await prisma.ontologyAction.create({
              data: { ...data, typeId: type.id, name: def.name },
            }))

        // Replace effects wholesale so the definition above stays authoritative.
        await prisma.actionEffect.deleteMany({ where: { actionId: action.id } })
        await prisma.actionEffect.createMany({
          data: def.effects.map(e => ({
            actionId: action.id,
            effectType: e.effectType,
            configuration: e.configuration as any,
            order: e.order,
          })),
        })
      }
    }

    return { created, updated, types: types.length }
  },
}

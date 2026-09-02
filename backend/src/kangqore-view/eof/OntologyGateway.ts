// HANUMANAS Authorization Engine — Universal Ontology Gateway
//
// Every read and every write to OntologyObject / OntologyRelationship must
// pass through here. There is no alternate write path.
//
// Enforcement chain (in order):
//   Identity / Clearance → Policy (ALLOW / DENY / REQUIRE_APPROVAL) → Cardinality → Commit
//
// SYSTEM_ACTOR bypasses policy and approval (internal sync operations) but
// cardinality is always enforced — even internal services cannot violate schema.

import { prisma } from '../../lib/prisma'
import { checkPolicy } from '../esf/PolicyEngine'
import { CardinalityEngine } from './CardinalityEngine'
import { CdcService } from '../../lib/cdc/cdcService'

export interface GatewayActor {
  id: string
  type: 'HUMAN' | 'KIMMP' | 'HANUMANAS' | 'AEGIS' | 'API' | 'SYSTEM'
  clearances: string[]  // data-marking labels this actor can read/write
}

// SYSTEM_ACTOR: used by internal sync services (canvasOntologyBridge, pipelines, etc.)
// These bypass policy and approval but still respect cardinality.
export const SYSTEM_ACTOR: GatewayActor = {
  id: 'system',
  type: 'SYSTEM',
  clearances: ['*'],
}

export type GatewayStatus = 'OK' | 'DENIED' | 'PENDING_APPROVAL' | 'CARDINALITY_VIOLATION'

export interface GatewayResult<T = any> {
  status: GatewayStatus
  data?: T
  pendingId?: string
  reason?: string
}

// ── Marking helpers ─────────────────────────────────────────────────────────

function canAccess(markings: string[], clearances: string[]): boolean {
  if (!markings || markings.length === 0) return true  // unmarked = public within tenant
  if (clearances.includes('*')) return true             // SYSTEM sees all
  return markings.every(m => clearances.includes(m))
}

// ── Policy gate ─────────────────────────────────────────────────────────────

async function getGovernanceActionId(): Promise<string | null> {
  const type = await prisma.ontologyObjectType.findUnique({ where: { name: 'System' } })
  if (!type) return null
  const action = await prisma.ontologyAction.findUnique({
    where: { typeId_name: { typeId: type.id, name: 'GOVERNANCE_BLOCK' } },
  })
  return action?.id ?? null
}

async function policyGate(
  trigger: string,
  params: Record<string, any>,
  actor: GatewayActor,
  objectId?: string,
): Promise<GatewayResult | null> {
  if (actor.type === 'SYSTEM') return null  // system bypasses policy

  const policy = await checkPolicy({ trigger, params, actorId: actor.id })

  if (policy.effect === 'DENY') {
    return { status: 'DENIED', reason: `Policy "${policy.policyName}": ${policy.reason}` }
  }

  if (policy.effect === 'REQUIRE_APPROVAL') {
    const actionId = await getGovernanceActionId()
    if (actionId) {
      const pending = await prisma.pendingApproval.create({
        data: {
          actionId,
          ...(objectId ? { objectId } : {}),
          actorId: actor.id,
          actorType: actor.type,
          params,
          policyId: policy.policyId ?? undefined,
          policyName: policy.policyName ?? undefined,
          reason: policy.reason,
        },
      })
      return { status: 'PENDING_APPROVAL', pendingId: pending.id, reason: policy.reason }
    }
    // No system action seeded yet — fail safe: deny rather than permit
    return { status: 'DENIED', reason: 'Approval required but system not configured — run /actions/seed-system first' }
  }

  return null  // ALLOW or NOTIFY — proceed
}

// ── Gateway ─────────────────────────────────────────────────────────────────

export const OntologyGateway = {

  // ── Read helpers (marking filter) ──────────────────────────────────────

  filterObjects<T extends { markings?: any }>(objects: T[], actor: GatewayActor): T[] {
    return objects.filter(o => canAccess((o.markings as string[]) ?? [], actor.clearances))
  },

  canRead(markings: string[] | null | undefined, actor: GatewayActor): boolean {
    return canAccess(markings ?? [], actor.clearances)
  },

  // ── Object writes ──────────────────────────────────────────────────────

  async createObject(actor: GatewayActor, data: Record<string, any>): Promise<GatewayResult> {
    const gate = await policyGate('CREATE_OBJECT', data, actor)
    if (gate) return gate

    const obj = await prisma.ontologyObject.create({ data: data as any })
    CdcService.emit('ontology_objects', 'INSERT', null, obj).catch(() => {})
    return { status: 'OK', data: obj }
  },

  /**
   * Replace semantics: `data` is passed to Prisma as given, so supplying
   * `{ properties: {...} }` REPLACES the whole properties document. That is
   * almost never what a caller wants — use `patchObject` to merge.
   *
   * Kept for callers that genuinely intend replacement (bulk reload, import).
   */
  async updateObject(actor: GatewayActor, id: string, data: Record<string, any>): Promise<GatewayResult> {
    // Fetch the whole row, not just markings: it is needed for the marking
    // check AND as the CDC `before` image. Emitting before=null made every
    // diff-shaped consumer (status/priority/assignment change) underivable.
    const existing = await prisma.ontologyObject.findUnique({ where: { id } })
    if (existing && !canAccess((existing.markings as string[]) ?? [], actor.clearances)) {
      return { status: 'DENIED', reason: 'Insufficient clearance for this object\'s markings' }
    }

    const gate = await policyGate('UPDATE_OBJECT', { id, ...data }, actor, id)
    if (gate) return gate

    const obj = await prisma.ontologyObject.update({ where: { id }, data })
    CdcService.emit('ontology_objects', 'UPDATE', existing, obj).catch(() => {})
    return { status: 'OK', data: obj }
  },

  /**
   * Merge semantics — the one callers almost always want.
   *
   * `properties` is shallow-merged over the existing document, so a partial
   * patch cannot silently drop unrelated fields. This matches what
   * `ActionEngine.applyDbEffect` already does for UPDATE_OBJECT effects; the
   * two write paths previously disagreed, which meant the same logical edit
   * destroyed data through one path and not the other.
   */
  async patchObject(
    actor: GatewayActor,
    id: string,
    patch: { properties?: Record<string, any>; markings?: string[]; externalId?: string | null },
  ): Promise<GatewayResult> {
    const existing = await prisma.ontologyObject.findUnique({ where: { id } })
    if (!existing) return { status: 'DENIED', reason: `Object "${id}" not found` }
    if (!canAccess((existing.markings as string[]) ?? [], actor.clearances)) {
      return { status: 'DENIED', reason: 'Insufficient clearance for this object\'s markings' }
    }

    const gate = await policyGate('UPDATE_OBJECT', { id, ...patch }, actor, id)
    if (gate) return gate

    const data: Record<string, any> = {}
    if (patch.properties) {
      data.properties = { ...((existing.properties as object) ?? {}), ...patch.properties }
    }
    if (patch.markings !== undefined) data.markings = patch.markings
    if (patch.externalId !== undefined) data.externalId = patch.externalId

    const obj = await prisma.ontologyObject.update({ where: { id }, data })
    CdcService.emit('ontology_objects', 'UPDATE', existing, obj).catch(() => {})
    return { status: 'OK', data: obj }
  },

  // ── Relationship writes ────────────────────────────────────────────────

  async createRelationship(
    actor: GatewayActor,
    data: {
      sourceId: string; targetId: string; sourceType: string; targetType: string
      relationshipType: string; [k: string]: any
    },
  ): Promise<GatewayResult> {
    // Cardinality is always enforced — even for SYSTEM actors
    const card = await CardinalityEngine.check(
      data.sourceType, data.targetType, data.relationshipType,
      data.sourceId, data.targetId,
    )
    if (!card.valid) return { status: 'CARDINALITY_VIOLATION', reason: card.violation! }

    const gate = await policyGate('CREATE_RELATIONSHIP', data, actor)
    if (gate) return gate

    const rel = await prisma.ontologyRelationship.create({ data: data as any })
    CdcService.emit('ontology_relationships', 'INSERT', null, rel).catch(() => {})
    return { status: 'OK', data: rel }
  },

  async upsertRelationship(
    actor: GatewayActor,
    key: { sourceId: string; targetId: string; sourceType: string; targetType: string; relationshipType: string },
    upsertData: { create: Record<string, any>; update: Record<string, any> },
  ): Promise<GatewayResult> {
    // Only check cardinality when creating (not updating an existing edge)
    const existing = await prisma.ontologyRelationship.findUnique({
      where: { sourceId_targetId_relationshipType: { sourceId: key.sourceId, targetId: key.targetId, relationshipType: key.relationshipType } },
    })
    if (!existing) {
      const card = await CardinalityEngine.check(
        key.sourceType, key.targetType, key.relationshipType,
        key.sourceId, key.targetId,
      )
      if (!card.valid) return { status: 'CARDINALITY_VIOLATION', reason: card.violation! }
    }

    const gate = await policyGate('CREATE_RELATIONSHIP', key, actor)
    if (gate) return gate

    const rel = await prisma.ontologyRelationship.upsert({
      where: { sourceId_targetId_relationshipType: { sourceId: key.sourceId, targetId: key.targetId, relationshipType: key.relationshipType } },
      create: upsertData.create as any,
      update: upsertData.update as any,
    })
    CdcService.emit('ontology_relationships', existing ? 'UPDATE' : 'INSERT', existing ?? null, rel).catch(() => {})
    return { status: 'OK', data: rel }
  },

  // ── Deletes ────────────────────────────────────────────────────────────────
  //
  // The gateway had no delete path, so every caller that needed one wrote
  // directly to prisma and skipped markings, policy, and CDC. Deleting a record
  // you are not cleared to read is a disclosure in reverse, so it is gated the
  // same way a read is.

  async deleteObject(actor: GatewayActor, id: string): Promise<GatewayResult> {
    const existing = await prisma.ontologyObject.findUnique({
      where: { id }, select: { markings: true },
    })
    if (!existing) return { status: 'OK', data: null }  // already gone — idempotent

    if (!canAccess((existing.markings as string[]) ?? [], actor.clearances)) {
      return { status: 'DENIED', reason: 'Insufficient clearance for this object\'s markings' }
    }

    const gate = await policyGate('DELETE_OBJECT', { id }, actor, id)
    if (gate) return gate

    const obj = await prisma.ontologyObject.delete({ where: { id } })
    CdcService.emit('ontology_objects', 'DELETE', obj, null).catch(() => {})
    return { status: 'OK', data: obj }
  },

  async deleteRelationships(
    actor: GatewayActor,
    where: { sourceId: string; targetId: string; relationshipType: string },
  ): Promise<GatewayResult<{ count: number }>> {
    const gate = await policyGate('DELETE_RELATIONSHIP', where, actor)
    if (gate) return gate

    const result = await prisma.ontologyRelationship.deleteMany({ where })
    CdcService.emit('ontology_relationships', 'DELETE', where, null).catch(() => {})
    return { status: 'OK', data: result }
  },

  /**
   * Remove every relationship touching any of these objects, in either
   * direction. Needed when a set of objects is being deleted together —
   * undoing a template run, for instance — where the caller knows the objects
   * but not the triples.
   */
  async deleteRelationshipsForObjects(
    actor: GatewayActor,
    objectIds: string[],
  ): Promise<GatewayResult<{ count: number }>> {
    if (!objectIds.length) return { status: 'OK', data: { count: 0 } }
    const where = { OR: [{ sourceId: { in: objectIds } }, { targetId: { in: objectIds } }] }

    const gate = await policyGate('DELETE_RELATIONSHIP', { objectIds }, actor)
    if (gate) return gate

    // Read before deleting so CDC carries a real before-image per edge rather
    // than one anonymous bulk event.
    const doomed = await prisma.ontologyRelationship.findMany({ where })
    const result = await prisma.ontologyRelationship.deleteMany({ where })
    for (const r of doomed) {
      CdcService.emit('ontology_relationships', 'DELETE', r, null).catch(() => {})
    }
    return { status: 'OK', data: result }
  },

  /** Soft-delete: closes a relationship's validity window, preserving history. */
  async retireRelationship(actor: GatewayActor, id: string): Promise<GatewayResult> {
    const gate = await policyGate('DELETE_RELATIONSHIP', { id }, actor)
    if (gate) return gate

    const rel = await prisma.ontologyRelationship.update({
      where: { id },
      data: { validTo: new Date() },
    })
    CdcService.emit('ontology_relationships', 'UPDATE', null, rel).catch(() => {})
    return { status: 'OK', data: rel }
  },
}

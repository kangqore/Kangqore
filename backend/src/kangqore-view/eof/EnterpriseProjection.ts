// Projects the records Kangqore actually holds into the enterprise object model,
// so the Intelligence and Decision layers run on real work rather than fixtures.
//
// What this deliberately does NOT do
// ----------------------------------
// It does not connect delivery work to customer revenue, because in this
// database those two things genuinely are not connected:
//
//   • ClientCRM.projectIds is empty on every row
//   • ClientCRM.userId is null on every row
//   • Project.clientId points at User ids that match no CRM record
//   • the CRM company names and the project-owning account names do not overlap
//
// Drawing a "this project delivers that contract" edge would therefore be an
// invention, and the exposure figures computed from it would be fiction. So the
// projection builds two honest sub-graphs and leaves the gap visible. Closing it
// is a data decision (bridge ClientCRM ↔ User), not something to paper over here.
//
// Idempotent: every object is keyed by externalId, so re-running updates in
// place rather than duplicating.

import { prisma } from '../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR } from './OntologyGateway'
import { WORK_STATES, ENTERPRISE_OBJECTS } from './EnterpriseObjectModel'

/** Real Project.status values are a small set; map them onto the 12-state machine. */
const PROJECT_STATE: Record<string, string> = {
  ACTIVE: 'IN_PROGRESS', ON_HOLD: 'BLOCKED', COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED', DRAFT: 'DRAFT', AT_RISK: 'AT_RISK',
}
const CRM_STATE: Record<string, string> = {
  active: 'IN_PROGRESS', onboarding: 'IN_PROGRESS', paused: 'BLOCKED', churned: 'CANCELLED',
}

async function typeId(name: string): Promise<string> {
  const t = await prisma.ontologyObjectType.findUnique({ where: { name }, select: { id: true } })
  if (!t) throw new Error(`Object type ${name} is missing — run the enterprise model seeder first`)
  return t.id
}

/**
 * Fields a governed action owns once it has changed them. Re-running the
 * projection must not silently undo an approved recovery: if a human approved
 * moving a date, the source record being stale is not grounds to move it back.
 */
const GOVERNED: Record<string, (props: any) => boolean> = {
  dueDate: p => p.rebaselined === true,
  status: p => p.status === 'ESCALATED',
}

/** Create or update by externalId, always through the gateway. */
async function upsert(typeName: string, externalId: string, properties: Record<string, any>) {
  const existing = await prisma.ontologyObject.findFirst({
    where: { externalId }, select: { id: true, properties: true, typeId: true },
  })
  if (existing) {
    // Retype in place when the model moves a record to a better-fitting type —
    // projects lived on Program only because tier 5 was empty. Recreating them
    // would orphan every edge and lose the ids the missions point at.
    const wanted = await typeId(typeName)
    if (existing.typeId !== wanted) {
      await OntologyGateway.updateObject(SYSTEM_ACTOR, existing.id, { typeId: wanted })
    }
    const current = (existing.properties ?? {}) as any
    const patch = { ...properties }
    for (const [field, isGoverned] of Object.entries(GOVERNED)) {
      if (field in patch && isGoverned(current)) delete patch[field]
    }
    await OntologyGateway.patchObject(SYSTEM_ACTOR, existing.id, { properties: patch })
    return existing.id
  }
  const r = await OntologyGateway.createObject(SYSTEM_ACTOR, {
    typeId: await typeId(typeName), externalId, properties,
  })
  return r.data.id
}

/** Link once; a repeat run must not stack duplicate edges. */
async function linkOnce(
  sourceId: string, targetId: string,
  sourceType: string, targetType: string, relationshipType: string,
) {
  const existing = await prisma.ontologyRelationship.findFirst({
    where: { sourceId, targetId, relationshipType, validTo: null },
    select: { id: true },
  })
  if (existing) return
  await OntologyGateway.createRelationship(SYSTEM_ACTOR, {
    sourceId, targetId, sourceType, targetType, relationshipType,
  })
}

/**
 * Map a status that is not in the 12-state machine onto one that is.
 *
 * Legacy objects predate the model and carry their own vocabulary — a Project
 * left over from an earlier sync still said ACTIVE. One stray value is enough
 * to add a phantom column to every board and dashboard grouped by status, and
 * an object holding a thirteenth state is invalid however it got there.
 */
const LEGACY_STATE: Record<string, string> = {
  ACTIVE: 'IN_PROGRESS', OPEN: 'IN_PROGRESS', IN_REVIEW: 'UNDER_REVIEW',
  TODO: 'QUEUED', BACKLOG: 'QUEUED', DONE: 'COMPLETED', CLOSED: 'COMPLETED',
  ON_HOLD: 'BLOCKED', STUCK: 'BLOCKED', ARCHIVED: 'CANCELLED',
}

export const EnterpriseProjection = {
  async run() {
    const projects = await prisma.project.findMany()
    const crm = await prisma.clientCRM.findMany()

    // ── Delivery: the goal every project contributes to ──────────────────────
    const deliveryGoal = await upsert('EnterpriseGoal', 'goal:delivery', {
      title: 'Deliver committed client work',
      status: 'IN_PROGRESS',
      horizon: 'YEAR',
      description: 'Every active project delivers on time and on budget.',
    })
    const deliveryOutcome = await upsert('Outcome', 'outcome:delivery', {
      title: 'Committed work delivered',
      status: 'IN_PROGRESS',
      description: 'Realised when the projects contributing to it complete.',
    })
    await linkOnce(deliveryOutcome, deliveryGoal, 'Outcome', 'EnterpriseGoal', 'realises')

    let projects_ = 0
    for (const p of projects) {
      // budget is a Decimal column; only a real number becomes value at risk.
      const budget = p.budget !== null && p.budget !== undefined ? Number(p.budget) : null

      // Key on the bare Project id, which is the convention an earlier
      // ontology sync already used. Inventing a `project:` prefix created a
      // second object for every project that was already mirrored — the same
      // 15 rows twice on one type, and double-counted in any assessment.
      const id = await upsert('Project', p.id, {
        title: p.title,
        // The legacy mirror wrote `name`; keep it in step so nothing reading
        // the old key silently sees a stale value.
        name: p.title,
        status: PROJECT_STATE[p.status] ?? 'IN_PROGRESS',
        progress: typeof p.progress === 'number' ? p.progress : 0,
        dueDate: p.dueDate ? p.dueDate.toISOString() : null,
        // The project's own committed value. Not a contract — a budget.
        ...(budget !== null && !Number.isNaN(budget) && budget > 0 ? { budget } : {}),
        description: p.description ?? null,
        sourceRecord: `Project:${p.id}`,
      })
      await linkOnce(id, deliveryOutcome, 'Project', 'Outcome', 'deliversOn')
      projects_++
    }

    // ── Revenue: customers and their contracts ───────────────────────────────
    const revenueGoal = await upsert('EnterpriseGoal', 'goal:revenue', {
      title: 'Protect recurring revenue',
      status: 'IN_PROGRESS',
      horizon: 'YEAR',
      description: 'Retain the contracted ARR already on the books.',
    })
    const revenueOutcome = await upsert('Outcome', 'outcome:revenue', {
      title: 'Recurring revenue retained',
      status: 'IN_PROGRESS',
    })
    await linkOnce(revenueOutcome, revenueGoal, 'Outcome', 'EnterpriseGoal', 'realises')

    let customers = 0, contracts = 0
    for (const c of crm) {
      const customerId = await upsert('Customer', `crm:${c.id}`, {
        title: c.name,
        status: CRM_STATE[c.status] ?? 'IN_PROGRESS',
        tier: c.tier ?? null,
        health: c.health ?? null,
        industry: c.industry ?? null,
        ...(c.arr !== null && c.arr !== undefined && Number(c.arr) > 0
          ? { arr: Number(c.arr) } : {}),
        sourceRecord: `ClientCRM:${c.id}`,
      })
      customers++

      // A contract object is only justified where there is contracted value.
      const arr = c.arr !== null && c.arr !== undefined ? Number(c.arr) : null
      if (arr === null || Number.isNaN(arr) || arr <= 0) continue

      const contractId = await upsert('Contract', `crm-contract:${c.id}`, {
        title: `${c.name} — contract`,
        status: CRM_STATE[c.status] ?? 'IN_PROGRESS',
        value: arr,
        startDate: c.contractStart ? c.contractStart.toISOString() : null,
        endDate: c.contractEnd ? c.contractEnd.toISOString() : null,
        sourceRecord: `ClientCRM:${c.id}`,
      })
      await linkOnce(contractId, customerId, 'Contract', 'Customer', 'heldBy')
      await linkOnce(contractId, revenueOutcome, 'Contract', 'Outcome', 'realisedOn')
      contracts++
    }

    const normalised = await this.normaliseStates()

    return {
      projects: projects_, customers, contracts, normalised,
      goals: 2,
      // Stated in the return value so a caller cannot mistake this for a
      // complete picture of the enterprise.
      unlinked: 'Projects are not linked to contracts: no join exists in the data.',
    }
  },

  /**
   * Bring any object on an enterprise type onto the 12-state machine. Runs over
   * everything, not only the records the projection mirrors, because a legacy
   * object the projection never touches is exactly where a stray state hides.
   */
  async normaliseStates() {
    const names = ENTERPRISE_OBJECTS.map(o => o.name)
    const types = await prisma.ontologyObjectType.findMany({
      where: { name: { in: names } }, select: { id: true },
    })
    if (!types.length) return { checked: 0, fixed: 0, unmapped: [] as string[] }

    const objects = await prisma.ontologyObject.findMany({
      where: { typeId: { in: types.map(t => t.id) }, validTo: null },
      select: { id: true, properties: true },
    })

    let fixed = 0
    const unmapped = new Set<string>()
    for (const o of objects) {
      const status = String((o.properties as any)?.status ?? '')
      if (!status || (WORK_STATES as readonly string[]).includes(status)) continue

      const mapped = LEGACY_STATE[status.toUpperCase()]
      if (!mapped) {
        // Reported rather than guessed: an unrecognised state is a modelling
        // question, not something to silently coerce.
        unmapped.add(status)
        continue
      }
      await OntologyGateway.patchObject(SYSTEM_ACTOR, o.id, {
        properties: { status: mapped, legacyStatus: status },
      })
      fixed++
    }
    return { checked: objects.length, fixed, unmapped: [...unmapped] }
  },
}

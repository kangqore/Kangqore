// The Work OS views, served from the ontology.
//
// Replaces `routes/work.ts` + `kore/WorkItemService`, both of which queried
// `(prisma as any).workItem` — a model that has never existed. The `as any`
// hid it from tsc, so every one of those 26 endpoints returned 500 at runtime
// while the build stayed green and the UI degraded to empty states.
//
// There is no WorkItem table here and there will not be one. A work item is an
// OntologyObject of a work-bearing type, so the same record can appear on a
// board, in a dependency graph, and in an outcome assessment without being
// copied. Reads go through the query compiler; writes go through the gateway.

import { prisma } from '../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR, type GatewayActor } from './OntologyGateway'
import { IntelligenceEngine } from './IntelligenceEngine'
import { WORK_STATES, STATE_COLORS } from './EnterpriseObjectModel'

/** The tiers that represent work someone does, as opposed to strategy or records. */
export const WORK_TYPES = ['Project', 'Workstream', 'Task', 'Action'] as const

/** Terminal states, for "what is still open" questions. */
const CLOSED = new Set(['COMPLETED', 'CANCELLED'])

export interface WorkItemView {
  id: string
  objectId: string
  title: string
  description: string | null
  type: string
  status: string
  priority: string
  progress: number
  startDate: string | null
  dueDate: string | null
  assigneeId: string | null
  parentId: string | null
  /** Inferred, not entered — null when it has not been scored. */
  predictedRisk: number | null
  predictedCompletion: string | null
  estimatedHours: number | null
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface WorkFilter {
  types?: string[]
  status?: string[]
  assigneeId?: string
  parentId?: string
  openOnly?: boolean
  limit?: number
}

function flatten(o: any, typeName: string, parentId: string | null = null): WorkItemView {
  const p = (o.properties ?? {}) as any
  return {
    id: o.id,
    objectId: o.id,
    title: String(p.title ?? p.name ?? 'Untitled'),
    description: p.description ?? null,
    type: typeName,
    status: String(p.status ?? 'DRAFT'),
    priority: String(p.priority ?? 'MEDIUM'),
    progress: typeof p.progress === 'number' ? p.progress : 0,
    startDate: p.startDate ?? null,
    dueDate: p.dueDate ?? null,
    assigneeId: p.assignee ?? p.owner ?? null,
    parentId,
    predictedRisk: typeof p.predictedRisk === 'number' ? p.predictedRisk : null,
    predictedCompletion: p.predictedCompletion ?? null,
    tags: Array.isArray(p.tags) ? p.tags : [],
    estimatedHours: typeof p.estimatedHours === 'number' ? p.estimatedHours : null,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }
}

async function workTypeIds(names: readonly string[] = WORK_TYPES) {
  const types = await prisma.ontologyObjectType.findMany({
    where: { name: { in: [...names] } },
    select: { id: true, name: true },
  })
  return {
    ids: types.map(t => t.id),
    nameById: new Map(types.map(t => [t.id, t.name])),
  }
}

export const WorkViewService = {
  /** Flat list of work items, filtered. The Table view's data. */
  async items(filter: WorkFilter = {}): Promise<WorkItemView[]> {
    const { ids, nameById } = await workTypeIds(filter.types ?? WORK_TYPES)
    if (!ids.length) return []

    const rows = await prisma.ontologyObject.findMany({
      where: { typeId: { in: ids }, validTo: null },
      take: Math.min(filter.limit ?? 500, 2000),
      orderBy: { updatedAt: 'desc' },
    })

    // `partOf` is what nests work; resolve it in one query rather than per row.
    const parents = await prisma.ontologyRelationship.findMany({
      where: { sourceId: { in: rows.map(r => r.id) }, relationshipType: 'partOf', validTo: null },
      select: { sourceId: true, targetId: true },
    })
    const parentOf = new Map(parents.map(p => [p.sourceId, p.targetId]))

    let items = rows.map(r => flatten(r, nameById.get(r.typeId) ?? 'Task', parentOf.get(r.id) ?? null))

    if (filter.status?.length) items = items.filter(i => filter.status!.includes(i.status))
    if (filter.openOnly) items = items.filter(i => !CLOSED.has(i.status))
    if (filter.assigneeId) items = items.filter(i => i.assigneeId === filter.assigneeId)
    if (filter.parentId) items = items.filter(i => i.parentId === filter.parentId)
    return items
  },

  /** Board data: the 12 real states as columns, each with its items. */
  async board(filter: WorkFilter = {}) {
    const items = await this.items(filter)
    const groups = WORK_STATES.map(state => ({
      id: state,
      label: state.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase()),
      color: STATE_COLORS[state] ?? '#94a3b8',
      items: items.filter(i => i.status === state),
    }))
    return {
      // Keyed by state: the shape the board UI indexes directly.
      items: Object.fromEntries(groups.map(g => [g.id, g.items])),
      // Ordered, with labels and colours, for rendering the columns.
      groups,
      total: items.length,
      // Stated so a caller cannot mistake an empty board for a broken one.
      states: WORK_STATES.length,
    }
  },

  /** Items with a date range, for the timeline. Undated work is excluded and counted. */
  async timeline(range: { from?: Date; to?: Date } = {}, filter: WorkFilter = {}) {
    const from = range.from ?? new Date(Date.now() - 30 * 86_400_000)
    const to = range.to ?? new Date(Date.now() + 90 * 86_400_000)

    const items = await this.items(filter)
    const dated = items.filter(i => {
      if (!i.dueDate) return false
      const d = new Date(i.dueDate).getTime()
      return d >= from.getTime() && d <= to.getTime()
    })

    return {
      items: dated.sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? '')),
      from: from.toISOString(),
      to: to.toISOString(),
      undated: items.length - dated.length,
    }
  },

  /**
   * Load per assignee. Unassigned work is reported as its own bucket rather
   * than dropped — it is usually the more interesting number.
   */
  async workload(filter: WorkFilter = {}) {
    const items = (await this.items(filter)).filter(i => !CLOSED.has(i.status))

    const byAssignee = new Map<string, WorkItemView[]>()
    for (const i of items) {
      const key = i.assigneeId ?? '__unassigned__'
      if (!byAssignee.has(key)) byAssignee.set(key, [])
      byAssignee.get(key)!.push(i)
    }

    const now = Date.now()
    const buckets = [...byAssignee.entries()].map(([assigneeId, list]) => ({
      id: assigneeId,
      assigneeId: assigneeId === '__unassigned__' ? null : assigneeId,
      name: assigneeId === '__unassigned__' ? 'Unassigned' : assigneeId,
      activeItems: list.length,
      open: list.length,
      inProgressItems: list.filter(i => i.status === 'IN_PROGRESS').length,
      blockedItems: list.filter(i => i.status === 'BLOCKED').length,
      overdue: list.filter(i => i.dueDate && new Date(i.dueDate).getTime() < now).length,
      blocked: list.filter(i => i.status === 'BLOCKED').length,
      atRisk: list.filter(i => i.status === 'AT_RISK' || (i.predictedRisk ?? 0) >= 0.5).length,
      // Summed from the real column. Items without an estimate contribute
      // nothing rather than a guess, so this is a floor, not a projection.
      totalEstimatedHours: list.reduce((sum, i) => sum + (Number((i as any).estimatedHours) || 0), 0),
      estimatedFrom: list.filter(i => Number((i as any).estimatedHours) > 0).length,
      items: list.slice(0, 25),
    })).sort((a, b) => b.activeItems - a.activeItems)

    return {
      buckets,
      totalOpen: items.length,
      unassigned: byAssignee.get('__unassigned__')?.length ?? 0,
    }
  },

  /**
   * Dependency graph over real edges. `dependsOn` and `blocks` only — `partOf`
   * is hierarchy, not dependency, and mixing them makes every graph a hairball.
   */
  async dependencyGraph(filter: WorkFilter = {}) {
    const items = await this.items(filter)
    const byId = new Map(items.map(i => [i.id, i]))

    const edges = await prisma.ontologyRelationship.findMany({
      where: {
        sourceId: { in: items.map(i => i.id) },
        relationshipType: { in: ['dependsOn', 'blocks'] },
        validTo: null,
      },
      select: { id: true, sourceId: true, targetId: true, relationshipType: true },
    })
    const linked = edges.filter(e => byId.has(e.targetId))

    // A node is "blocked upstream" when something it depends on is unfinished.
    const blockedBy = new Map<string, string[]>()
    for (const e of linked) {
      if (e.relationshipType !== 'dependsOn') continue
      const dep = byId.get(e.targetId)!
      if (CLOSED.has(dep.status)) continue
      if (!blockedBy.has(e.sourceId)) blockedBy.set(e.sourceId, [])
      blockedBy.get(e.sourceId)!.push(dep.title)
    }

    return {
      nodes: items.map(i => ({
        id: i.id, title: i.title, type: i.type, status: i.status,
        priority: i.priority, progress: i.progress,
        blockedBy: blockedBy.get(i.id) ?? [],
      })),
      edges: linked.map(e => ({
        id: e.id, source: e.sourceId, target: e.targetId, type: e.relationshipType,
      })),
      // Edges pointing outside the filtered set would render as dangling lines.
      edgesOutsideView: edges.length - linked.length,
    }
  },

  /** Executive summary. Every figure counted from the graph, none stored. */
  async executive() {
    const items = await this.items({ limit: 2000 })
    const now = Date.now()

    const byStatus: Record<string, number> = {}
    const byPriority: Record<string, number> = {}
    const byType: Record<string, number> = {}
    for (const i of items) {
      byStatus[i.status] = (byStatus[i.status] ?? 0) + 1
      byPriority[i.priority] = (byPriority[i.priority] ?? 0) + 1
      byType[i.type] = (byType[i.type] ?? 0) + 1
    }

    const done = items.filter(i => i.status === 'COMPLETED').length
    const overdue = items.filter(i =>
      i.dueDate && new Date(i.dueDate).getTime() < now && !CLOSED.has(i.status))

    const atRisk = items
      .filter(i => (i.predictedRisk ?? 0) >= 0.5)
      .sort((a, b) => (b.predictedRisk ?? 0) - (a.predictedRisk ?? 0))

    return {
      summary: {
        total: items.length,
        done,
        inProgress: byStatus['IN_PROGRESS'] ?? 0,
        blocked: byStatus['BLOCKED'] ?? 0,
        atRisk: atRisk.length,
        escalated: byStatus['ESCALATED'] ?? 0,
        overdue: overdue.length,
        completionRate: items.length ? Math.round((done / items.length) * 100) : 0,
        // Only meaningful once inference has run.
        scored: items.filter(i => i.predictedRisk !== null).length,
      },
      byStatus, byPriority, byType,
      atRiskItems: atRisk.slice(0, 10),
      overdueItems: overdue
        .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''))
        .slice(0, 10),
    }
  },

  /**
   * Goals, from the strategy tiers of the ontology. There was never a WorkGoal
   * table; these are EnterpriseGoal and StrategicObjective objects, which is
   * what makes a goal connectable to the work beneath it.
   */
  async goals() {
    const { ids, nameById } = await workTypeIds(['EnterpriseGoal', 'StrategicObjective'])
    if (!ids.length) return { goals: [] }

    const rows = await prisma.ontologyObject.findMany({
      where: { typeId: { in: ids }, validTo: null }, orderBy: { createdAt: 'asc' },
    })
    // `serves` is how an objective hangs off a goal.
    const parents = await prisma.ontologyRelationship.findMany({
      where: { sourceId: { in: rows.map(r => r.id) }, relationshipType: 'serves', validTo: null },
      select: { sourceId: true, targetId: true },
    })
    const parentOf = new Map(parents.map(p => [p.sourceId, p.targetId]))

    return {
      goals: rows.map(r => {
        const p = (r.properties ?? {}) as any
        return {
          id: r.id,
          objectId: r.id,
          title: String(p.title ?? 'Untitled'),
          description: p.description ?? null,
          ownerName: p.owner ?? null,
          type: nameById.get(r.typeId) === 'EnterpriseGoal' ? 'GOAL' : 'OBJECTIVE',
          status: String(p.status ?? 'DRAFT'),
          progress: typeof p.progress === 'number' ? p.progress : 0,
          horizon: p.horizon ?? null,
          dueDate: p.dueDate ?? null,
          parentId: parentOf.get(r.id) ?? null,
          predictedRisk: typeof p.predictedRisk === 'number' ? p.predictedRisk : null,
        }
      }),
    }
  },

  /**
   * Portfolios, from the Initiative and Program tiers. Health and progress are
   * rolled up from the work beneath rather than typed in, so a portfolio
   * cannot report green while its projects are late.
   */
  async portfolios() {
    const { ids, nameById } = await workTypeIds(['Initiative', 'Program'])
    if (!ids.length) return { portfolios: [] }

    const rows = await prisma.ontologyObject.findMany({
      where: { typeId: { in: ids }, validTo: null }, orderBy: { createdAt: 'asc' },
    })
    if (!rows.length) return { portfolios: [] }

    // Everything that sits under each portfolio, one hop down.
    const children = await prisma.ontologyRelationship.findMany({
      where: { targetId: { in: rows.map(r => r.id) }, relationshipType: 'partOf', validTo: null },
      select: { sourceId: true, targetId: true },
    })
    const childIds = children.map(c => c.sourceId)
    const childObjects = childIds.length
      ? await prisma.ontologyObject.findMany({ where: { id: { in: childIds } } })
      : []
    const childById = new Map(childObjects.map(o => [o.id, (o.properties ?? {}) as any]))

    return {
      portfolios: rows.map(r => {
        const p = (r.properties ?? {}) as any
        const mine = children.filter(c => c.targetId === r.id).map(c => childById.get(c.sourceId)).filter(Boolean)
        const progress = mine.length
          ? Math.round(mine.reduce((s, c) => s + (typeof c.progress === 'number' ? c.progress : 0), 0) / mine.length)
          : (typeof p.progress === 'number' ? p.progress : 0)
        const troubled = mine.filter(c => ['BLOCKED', 'AT_RISK', 'ESCALATED'].includes(String(c.status))).length

        return {
          id: r.id,
          objectId: r.id,
          name: String(p.title ?? 'Untitled'),
          description: p.description ?? null,
          type: nameById.get(r.typeId),
          status: String(p.status ?? 'DRAFT'),
          progress,
          childCount: mine.length,
          // Rolled up: a portfolio with troubled children cannot read as healthy.
          health: mine.length ? Math.max(0, 100 - Math.round((troubled / mine.length) * 100)) : 100,
          troubled,
        }
      }),
    }
  },

  // ── Writes ─────────────────────────────────────────────────────────────────

  async createItem(
    input: { typeName?: string; title: string; parentId?: string } & Record<string, any>,
    actor: GatewayActor = SYSTEM_ACTOR,
  ) {
    const typeName = input.typeName ?? 'Task'
    if (!(WORK_TYPES as readonly string[]).includes(typeName)) {
      throw new Error(`${typeName} is not a work type. Use one of: ${WORK_TYPES.join(', ')}`)
    }
    const type = await prisma.ontologyObjectType.findUnique({ where: { name: typeName }, select: { id: true } })
    if (!type) throw new Error(`Object type ${typeName} is missing from the ontology`)

    const { typeName: _t, parentId, ...properties } = input
    if (!properties.status) properties.status = 'QUEUED'
    if (properties.progress === undefined) properties.progress = 0

    const r = await OntologyGateway.createObject(actor, { typeId: type.id, properties })
    if (r.status !== 'OK') throw new Error(r.reason ?? r.status)

    if (parentId) {
      const parent = await prisma.ontologyObject.findUnique({
        where: { id: parentId }, include: { type: { select: { name: true } } },
      })
      if (parent) {
        const link = await OntologyGateway.createRelationship(actor, {
          sourceId: r.data.id, targetId: parentId,
          sourceType: typeName, targetType: parent.type.name,
          relationshipType: 'partOf',
        })
        // A rejected parent link must not be silent — the item exists but is
        // not where the caller asked for it.
        if (link.status !== 'OK') {
          return { ...flatten(r.data, typeName), parentWarning: link.reason ?? link.status }
        }
      }
    }
    return flatten(r.data, typeName, parentId ?? null)
  },

  async updateItem(id: string, patch: Record<string, any>, actor: GatewayActor = SYSTEM_ACTOR) {
    const r = await OntologyGateway.patchObject(actor, id, { properties: patch })
    if (r.status !== 'OK') throw new Error(r.reason ?? r.status)
    const obj = await prisma.ontologyObject.findUnique({
      where: { id }, include: { type: { select: { name: true } } },
    })
    return flatten(obj, obj!.type.name)
  },

  /** Move to a different state. Validated against the 12-state machine. */
  async moveItem(id: string, status: string, actor: GatewayActor = SYSTEM_ACTOR) {
    if (!(WORK_STATES as readonly string[]).includes(status)) {
      throw new Error(`"${status}" is not a work state. Valid: ${WORK_STATES.join(', ')}`)
    }
    return this.updateItem(id, { status }, actor)
  },

  /** Score a set of work types, populating the INTELLIGENCE columns. */
  async score(typeNames: string[] = ['Project', 'Task']) {
    const results = []
    for (const t of typeNames) {
      results.push({ type: t, ...(await IntelligenceEngine.inferAndWrite(t)) })
    }
    return results
  },
}

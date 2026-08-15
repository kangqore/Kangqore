// WorkItem service — the core primitive of Phase 3.
// Every WorkItem is ALSO an OntologyObject; relationships (blocks, dependsOn,
// impacts, governedBy, etc.) are OntologyRelationship rows — visible in the
// Ontology Explorer, reasoned about by KIMMP, governed by AEGIS.

import { prisma } from '../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR } from '../eof/OntologyGateway'

// ── Canonical OntologyObjectType names ──────────────────────────────────────

export const WORK_TYPES = {
  WORK_ITEM:  'WorkItem',
  PORTFOLIO:  'WorkPortfolio',
  GOAL:       'WorkGoal',
  DOCUMENT:   'WorkDocument',
} as const

export const WORK_RELATIONSHIPS = {
  BELONGS_TO:   'belongsTo',
  ASSIGNED_TO:  'assignedTo',
  OWNED_BY:     'ownedBy',
  BLOCKS:       'blocks',
  DEPENDS_ON:   'dependsOn',
  IMPACTS:      'impacts',
  GENERATES:    'generates',
  GOVERNED_BY:  'governedBy',
  IN_PORTFOLIO: 'inPortfolio',
  LINKS_TO:     'linksTo',
} as const

// ── Seed canonical types (idempotent) ────────────────────────────────────────

export async function seedWorkOntologyTypes() {
  for (const name of Object.values(WORK_TYPES)) {
    const existing = await prisma.ontologyObjectType.findUnique({ where: { name } })
    if (!existing) {
      await prisma.ontologyObjectType.create({
        data: { name, displayName: name, description: `Phase 3 — ${name} enterprise object`, icon: 'SquaresFour', color: '#579bfc' },
      })
    }
  }
}

async function getOrCreateType(name: string): Promise<string> {
  let t = await prisma.ontologyObjectType.findUnique({ where: { name } })
  if (!t) {
    t = await prisma.ontologyObjectType.create({
      data: { name, displayName: name, description: `Phase 3 — ${name}`, icon: 'SquaresFour', color: '#579bfc' },
    })
  }
  return t.id
}

// ── OntologyObject sync ─────────────────────────────────────────────────────

async function syncToOntology(item: any): Promise<string | null> {
  const typeId = await getOrCreateType(WORK_TYPES.WORK_ITEM)
  const result = await OntologyGateway.createObject(SYSTEM_ACTOR, {
    typeId,
    externalId: item.id,
    label: item.title,
    properties: {
      type: item.type,
      status: item.status,
      priority: item.priority,
      projectId: item.projectId,
      assigneeId: item.assigneeId,
      dueDate: item.dueDate,
      progress: item.progress,
    },
    markings: item.markings ?? [],
  })
  return result.status === 'OK' ? result.data?.id ?? null : null
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

export interface WorkItemFilters {
  projectId?:   string
  portfolioId?: string
  assigneeId?:  string
  teamId?:      string
  status?:      string | string[]
  priority?:    string
  type?:        string
  parentId?:    string | null
  search?:      string
  dueBefore?:   Date
  limit?:       number
  offset?:      number
}

export const WorkItemService = {

  async create(data: {
    title: string
    type?: string; status?: string; priority?: string
    description?: string
    projectId?: string; portfolioId?: string
    parentId?: string; assigneeId?: string; teamId?: string; reporterId?: string
    startDate?: Date; dueDate?: Date
    estimatedHours?: number; storyPoints?: number
    tags?: string[]
    customFields?: Record<string, any>
    sortOrder?: number
  }) {
    const item = await (prisma as any).workItem.create({
      data: {
        title: data.title,
        type: data.type ?? 'TASK',
        status: data.status ?? 'TODO',
        priority: data.priority ?? 'MEDIUM',
        description: data.description,
        projectId: data.projectId,
        portfolioId: data.portfolioId,
        parentId: data.parentId,
        assigneeId: data.assigneeId,
        teamId: data.teamId,
        reporterId: data.reporterId,
        startDate: data.startDate,
        dueDate: data.dueDate,
        estimatedHours: data.estimatedHours,
        storyPoints: data.storyPoints,
        tags: data.tags ?? [],
        customFields: data.customFields ?? {},
        sortOrder: data.sortOrder ?? Date.now(),
        columnId: data.status ?? 'TODO',
      },
    })

    // Async: create OntologyObject (don't block on failure)
    syncToOntology(item).then(objectId => {
      if (objectId) {
        (prisma as any).workItem.update({ where: { id: item.id }, data: { objectId } }).catch(() => {})
      }
    }).catch(() => {})

    return item
  },

  async list(filters: WorkItemFilters = {}) {
    const where: any = {}
    if (filters.projectId)   where.projectId   = filters.projectId
    if (filters.portfolioId) where.portfolioId = filters.portfolioId
    if (filters.assigneeId)  where.assigneeId  = filters.assigneeId
    if (filters.teamId)      where.teamId      = filters.teamId
    if (filters.type)        where.type        = filters.type
    if (filters.priority)    where.priority    = filters.priority
    if (filters.parentId !== undefined) where.parentId = filters.parentId
    if (filters.status) {
      where.status = Array.isArray(filters.status)
        ? { in: filters.status }
        : filters.status
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }
    if (filters.dueBefore) {
      where.dueDate = { lte: filters.dueBefore }
    }

    return (prisma as any).workItem.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: filters.limit ?? 200,
      skip: filters.offset ?? 0,
    })
  },

  async get(id: string) {
    const item = await (prisma as any).workItem.findUnique({ where: { id } })
    if (!item) return null

    // Enrich with relationships from OntologyRelationship
    let relationships: any[] = []
    if (item.objectId) {
      relationships = await prisma.ontologyRelationship.findMany({
        where: { OR: [{ sourceId: item.objectId }, { targetId: item.objectId }] },
        include: { source: true, target: true },
      })
    }

    // Sub-tasks
    const children = await (prisma as any).workItem.findMany({
      where: { parentId: id },
      orderBy: { sortOrder: 'asc' },
      take: 50,
    })

    return { ...item, relationships, children }
  },

  async update(id: string, data: Partial<{
    title: string; description: string; status: string; priority: string; type: string
    assigneeId: string | null; teamId: string | null
    startDate: Date | null; dueDate: Date | null; completedAt: Date | null
    estimatedHours: number | null; actualHours: number | null
    storyPoints: number | null; progress: number
    tags: string[]; customFields: Record<string, any>
    sortOrder: number; columnId: string; parentId: string | null
    portfolioId: string | null
  }>) {
    const patch: any = { ...data, updatedAt: new Date() }
    if (data.status && !data.columnId) patch.columnId = data.status
    if (data.status === 'DONE' && !data.completedAt) patch.completedAt = new Date()

    const item = await (prisma as any).workItem.update({ where: { id }, data: patch })

    // Sync to OntologyObject if linked
    if (item.objectId) {
      OntologyGateway.updateObject(SYSTEM_ACTOR, item.objectId, {
        label: item.title,
        properties: {
          type: item.type, status: item.status, priority: item.priority,
          progress: item.progress, dueDate: item.dueDate,
        },
      }).catch(() => {})
    }

    return item
  },

  async delete(id: string) {
    const item = await (prisma as any).workItem.findUnique({ where: { id } })
    if (!item) return

    // Clean up OntologyObject
    if (item.objectId) {
      await prisma.ontologyObject.delete({ where: { id: item.objectId } }).catch(() => {})
    }

    await (prisma as any).workItem.delete({ where: { id } })
  },

  async move(id: string, status: string, sortOrder?: number) {
    const patch: any = { status, columnId: status }
    if (sortOrder !== undefined) patch.sortOrder = sortOrder
    if (status === 'DONE') patch.completedAt = new Date()
    return (prisma as any).workItem.update({ where: { id }, data: patch })
  },

  // ── Relationships ────────────────────────────────────────────────────────

  async addRelationship(opts: {
    sourceWorkItemId: string
    targetWorkItemId: string
    type: string   // blocks | dependsOn | impacts | linksTo | generates
  }) {
    const [source, target] = await Promise.all([
      (prisma as any).workItem.findUnique({ where: { id: opts.sourceWorkItemId } }),
      (prisma as any).workItem.findUnique({ where: { id: opts.targetWorkItemId } }),
    ])
    if (!source || !target) throw new Error('WorkItem not found')

    // Ensure both have OntologyObjects
    const sourceObjId = source.objectId ?? (await syncToOntology(source))
    const targetObjId = target.objectId ?? (await syncToOntology(target))

    if (!sourceObjId || !targetObjId) throw new Error('Failed to create OntologyObjects')

    const result = await OntologyGateway.upsertRelationship(
      SYSTEM_ACTOR,
      {
        sourceId: sourceObjId, targetId: targetObjId,
        sourceType: WORK_TYPES.WORK_ITEM, targetType: WORK_TYPES.WORK_ITEM,
        relationshipType: opts.type,
      },
      {
        create: { sourceId: sourceObjId, targetId: targetObjId, relationshipType: opts.type, sourceType: WORK_TYPES.WORK_ITEM, targetType: WORK_TYPES.WORK_ITEM },
        update: { relationshipType: opts.type },
      },
    )
    return result
  },

  async removeRelationship(sourceWorkItemId: string, targetWorkItemId: string, type: string) {
    const [source, target] = await Promise.all([
      (prisma as any).workItem.findUnique({ where: { id: sourceWorkItemId } }),
      (prisma as any).workItem.findUnique({ where: { id: targetWorkItemId } }),
    ])
    if (!source?.objectId || !target?.objectId) return
    await prisma.ontologyRelationship.deleteMany({
      where: {
        sourceId: source.objectId,
        targetId: target.objectId,
        relationshipType: type,
      },
    })
  },

  // ── Board view ────────────────────────────────────────────────────────────

  async getBoardData(projectId?: string, portfolioId?: string) {
    const where: any = {}
    if (projectId)   where.projectId   = projectId
    if (portfolioId) where.portfolioId = portfolioId

    const COLUMNS = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED']
    const items = await (prisma as any).workItem.findMany({
      where: { ...where, status: { in: COLUMNS } },
      orderBy: [{ sortOrder: 'asc' }, { priority: 'asc' }],
      take: 500,
    })

    const grouped: Record<string, any[]> = {}
    for (const col of COLUMNS) grouped[col] = []
    for (const item of items) grouped[item.status]?.push(item)
    return { columns: COLUMNS, items: grouped, total: items.length }
  },

  // ── Timeline view ─────────────────────────────────────────────────────────

  async getTimelineData(filters: WorkItemFilters & { dateFrom?: Date; dateTo?: Date }) {
    const where: any = {}
    if (filters.projectId)   where.projectId   = filters.projectId
    if (filters.portfolioId) where.portfolioId = filters.portfolioId
    if (filters.assigneeId)  where.assigneeId  = filters.assigneeId
    if (filters.dateFrom || filters.dateTo) {
      where.OR = [
        { startDate: { gte: filters.dateFrom, lte: filters.dateTo } },
        { dueDate:   { gte: filters.dateFrom, lte: filters.dateTo } },
      ]
    }
    return (prisma as any).workItem.findMany({
      where: { ...where, dueDate: { not: null } },
      orderBy: [{ startDate: 'asc' }, { dueDate: 'asc' }],
      take: 300,
    })
  },

  // ── Workload view ─────────────────────────────────────────────────────────

  async getWorkloadData() {
    const staff = await prisma.staffMember.findMany({
      where: { status: 'active' },
      include: { allocations: { where: { endDate: { gte: new Date() } } } },
      orderBy: { utilization: 'desc' },
    })

    const workItemsByAssignee = await (prisma as any).workItem.groupBy({
      by: ['assigneeId'],
      where: { status: { in: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED'] }, assigneeId: { not: null } },
      _count: { id: true },
    })
    const wiMap = new Map(workItemsByAssignee.map((r: any) => [r.assigneeId, r._count.id]))

    return staff.map(s => ({
      id: s.id, name: s.name, role: s.role, department: s.department,
      utilization: s.utilization, availability: s.availability,
      activeItems: wiMap.get(s.id) ?? 0,
      allocations: (s as any).allocations?.length ?? 0,
    }))
  },
}

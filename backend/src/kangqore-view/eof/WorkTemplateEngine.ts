// Applies a template: creates real objects and real edges.
//
// Everything goes through OntologyGateway, so markings, policy, cardinality and
// CDC all apply exactly as they would to a hand-created record. A template is a
// convenience for the person, not a bypass for the rules — if an edge violates
// cardinality it is rejected here the same way it would be anywhere else, and
// the run says so rather than pretending it succeeded.

import { prisma } from '../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR, type GatewayActor } from './OntologyGateway'
import { BoardService } from './BoardService'
import { WORK_TEMPLATES, type TemplateNode, type TemplateEdge } from './WorkTemplateLibrary'
import { ENTERPRISE_OBJECTS, ENTERPRISE_RELATIONSHIPS } from './EnterpriseObjectModel'

const DAY = 86_400_000

export interface ApplyInput {
  templateKey: string
  actorId: string
  /** Overrides for the root object, e.g. { title: 'Acme onboarding' }. */
  values?: Record<string, any>
  /** Day zero for every offsetDays in the template. Defaults to now. */
  startDate?: Date
  /** Create the template's board over the result. */
  createBoard?: boolean
}

export interface ApplyResult {
  runId: string
  templateKey: string
  status: 'COMPLETED' | 'PARTIAL' | 'FAILED'
  rootObjectId: string | null
  objectsCreated: number
  edgesCreated: number
  boardId: string | null
  /** Anything that did not happen, and why. Empty on a clean run. */
  notes: string[]
}

/** Validate a template against the model. Used by the seeder and by apply. */
export function validateTemplate(nodes: TemplateNode[], edges: TemplateEdge[]): string[] {
  const problems: string[] = []
  const typeNames = new Set(ENTERPRISE_OBJECTS.map(o => o.name))
  const byRef = new Map(nodes.map(n => [n.ref, n]))

  if (!byRef.has('root')) problems.push('no node with ref "root"')
  for (const n of nodes) {
    if (!typeNames.has(n.typeName)) problems.push(`node "${n.ref}": unknown type ${n.typeName}`)
  }
  const refCounts = new Map<string, number>()
  for (const n of nodes) refCounts.set(n.ref, (refCounts.get(n.ref) ?? 0) + 1)
  for (const [ref, c] of refCounts) if (c > 1) problems.push(`duplicate ref "${ref}"`)

  for (const e of edges) {
    const from = byRef.get(e.from)
    const to = byRef.get(e.to)
    if (!from) { problems.push(`edge references unknown ref "${e.from}"`); continue }
    if (!to) { problems.push(`edge references unknown ref "${e.to}"`); continue }
    const rule = ENTERPRISE_RELATIONSHIPS.find(r =>
      r.sourceType === from.typeName && r.targetType === to.typeName &&
      r.relationshipType === e.relationshipType)
    if (!rule) {
      problems.push(
        `no rule for ${from.typeName} -${e.relationshipType}-> ${to.typeName} (${e.from} → ${e.to})`)
    }
  }
  return problems
}

export const WorkTemplateEngine = {
  async list(category?: string) {
    const rows = await prisma.workTemplate.findMany({
      where: category ? { category } : {},
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { runs: true } } },
    })
    return rows.map(t => ({
      id: t.id, key: t.key, name: t.name, description: t.description,
      category: t.category, icon: t.icon, color: t.color,
      rootTypeName: t.rootTypeName,
      creates: (t.nodes as any[]).length,
      links: (t.edges as any[]).length,
      timesApplied: t._count.runs,
    }))
  },

  /**
   * Create everything the template declares. Objects first so edges have real
   * ids to point at; a rejected edge is recorded and the run continues, because
   * losing one dependency link is not a reason to discard nine created tasks.
   */
  async apply(input: ApplyInput, actor: GatewayActor = SYSTEM_ACTOR): Promise<ApplyResult> {
    const tpl = await prisma.workTemplate.findUnique({ where: { key: input.templateKey } })
    if (!tpl) throw new Error(`No template with key "${input.templateKey}"`)

    const nodes = tpl.nodes as unknown as TemplateNode[]
    const edges = tpl.edges as unknown as TemplateEdge[]
    const notes: string[] = []
    const start = input.startDate ?? new Date()

    const problems = validateTemplate(nodes, edges)
    if (problems.length) {
      const run = await prisma.workTemplateRun.create({
        data: {
          templateId: tpl.id, actorId: input.actorId, status: 'FAILED',
          error: problems.join('; '), notes: problems as any,
        },
      })
      return {
        runId: run.id, templateKey: tpl.key, status: 'FAILED', rootObjectId: null,
        objectsCreated: 0, edgesCreated: 0, boardId: null, notes: problems,
      }
    }

    // Resolve every type up front — one query, not one per node.
    const types = await prisma.ontologyObjectType.findMany({
      where: { name: { in: [...new Set(nodes.map(n => n.typeName))] } },
      select: { id: true, name: true },
    })
    const typeId = new Map(types.map(t => [t.name, t.id]))

    // ── Objects ──────────────────────────────────────────────────────────────
    const created = new Map<string, string>()
    for (const n of nodes) {
      const tid = typeId.get(n.typeName)
      if (!tid) { notes.push(`skipped "${n.ref}": type ${n.typeName} not in the ontology`); continue }

      const properties: Record<string, any> = { ...n.properties }
      if (n.offsetDays !== undefined) {
        properties.dueDate = new Date(start.getTime() + n.offsetDays * DAY).toISOString()
        properties.startDate = start.toISOString()
      }
      // Caller values apply to the root only — overriding every task's title
      // with the same string would be nonsense.
      if (n.ref === 'root' && input.values) Object.assign(properties, input.values)
      properties.templateKey = tpl.key

      const r = await OntologyGateway.createObject(actor, { typeId: tid, properties })
      if (r.status !== 'OK') { notes.push(`"${n.ref}" rejected: ${r.reason ?? r.status}`); continue }
      created.set(n.ref, r.data.id)
    }

    // ── Edges ────────────────────────────────────────────────────────────────
    const byRef = new Map(nodes.map(n => [n.ref, n]))
    let edgesCreated = 0
    for (const e of edges) {
      const sourceId = created.get(e.from)
      const targetId = created.get(e.to)
      if (!sourceId || !targetId) { notes.push(`edge ${e.from} → ${e.to} skipped: an endpoint was not created`); continue }

      const r = await OntologyGateway.createRelationship(actor, {
        sourceId, targetId,
        sourceType: byRef.get(e.from)!.typeName,
        targetType: byRef.get(e.to)!.typeName,
        relationshipType: e.relationshipType,
      })
      if (r.status !== 'OK') {
        notes.push(`edge ${e.from} -${e.relationshipType}-> ${e.to} rejected: ${r.reason ?? r.status}`)
        continue
      }
      edgesCreated++
    }

    // ── Board ────────────────────────────────────────────────────────────────
    let boardId: string | null = null
    const boardCfg = tpl.board as any
    if (input.createBoard && boardCfg) {
      try {
        const b = await BoardService.createBoard({
          name: input.values?.title ? `${input.values.title}` : boardCfg.name,
          rootTypeName: tpl.rootTypeName,
          ownerId: input.actorId,
          showClasses: boardCfg.showClasses,
        })
        boardId = b.board.id
      } catch (e: any) {
        notes.push(`board not created: ${e?.message ?? e}`)
      }
    }

    const rootObjectId = created.get('root') ?? null
    const status: ApplyResult['status'] =
      created.size === 0 ? 'FAILED'
        : notes.length ? 'PARTIAL'
        : 'COMPLETED'

    const run = await prisma.workTemplateRun.create({
      data: {
        templateId: tpl.id,
        actorId: input.actorId,
        createdObjects: Object.fromEntries(created) as any,
        createdEdges: edgesCreated,
        rootObjectId,
        boardId,
        status,
        notes: notes as any,
      },
    })

    return {
      runId: run.id,
      templateKey: tpl.key,
      status,
      rootObjectId,
      objectsCreated: created.size,
      edgesCreated,
      boardId,
      notes,
    }
  },

  /** What a run created — the basis for undoing one. */
  async run(runId: string) {
    return prisma.workTemplateRun.findUnique({
      where: { id: runId },
      include: { template: { select: { key: true, name: true } } },
    })
  },

  /**
   * Remove everything a run created. Objects touched since — a status moved, a
   * risk score written — are kept, because deleting work someone has since
   * acted on is worse than leaving a few orphans behind.
   */
  async undo(runId: string, actor: GatewayActor = SYSTEM_ACTOR) {
    const run = await prisma.workTemplateRun.findUnique({ where: { id: runId } })
    if (!run) throw new Error('No such template run')

    const ids = Object.values(run.createdObjects as Record<string, string>)
    if (!ids.length) return { deleted: 0, kept: 0, keptIds: [] as string[] }

    const objects = await prisma.ontologyObject.findMany({
      where: { id: { in: ids } },
      select: { id: true, updatedAt: true },
    })

    // The run row is written after every object, so its timestamp is the
    // watermark: anything updated later has been touched by someone since.
    // Comparing updatedAt against the object's own createdAt does not work —
    // an edit seconds after creation is indistinguishable from the write that
    // created it.
    const watermark = run.createdAt.getTime()
    const untouched = objects.filter(o => o.updatedAt.getTime() <= watermark)
    const kept = objects.filter(o => o.updatedAt.getTime() > watermark)

    const deletable = untouched.map(o => o.id)
    if (deletable.length) {
      await OntologyGateway.deleteRelationshipsForObjects(actor, deletable)
      for (const id of deletable) await OntologyGateway.deleteObject(actor, id)
    }

    await prisma.workTemplateRun.update({
      where: { id: runId },
      data: {
        status: 'FAILED',
        error: `Undone: ${deletable.length} removed, ${kept.length} kept because they had been edited.`,
      },
    })

    return { deleted: deletable.length, kept: kept.length, keptIds: kept.map(k => k.id) }
  },
}

/**
 * Seed the declared templates. Validates each one against the model first, so a
 * template that could never apply cleanly is reported at boot rather than
 * discovered by whoever clicks it.
 */
export async function seedWorkTemplates() {
  let created = 0, updated = 0
  const invalid: string[] = []

  for (const t of WORK_TEMPLATES) {
    const problems = validateTemplate(t.nodes, t.edges)
    if (problems.length) {
      invalid.push(`${t.key}: ${problems.join('; ')}`)
      continue
    }
    const existing = await prisma.workTemplate.findUnique({ where: { key: t.key }, select: { id: true } })
    const data = {
      name: t.name, description: t.description, category: t.category,
      icon: t.icon, color: t.color, rootTypeName: t.rootTypeName,
      nodes: t.nodes as any, edges: t.edges as any, board: (t.board ?? null) as any,
      isSystem: true,
    }
    if (existing) { await prisma.workTemplate.update({ where: { id: existing.id }, data }); updated++ }
    else { await prisma.workTemplate.create({ data: { ...data, key: t.key } }); created++ }
  }

  return { created, updated, invalid }
}

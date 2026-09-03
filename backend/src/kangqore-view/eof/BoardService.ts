// Boards as projections of NOLAN.
//
// A board is a query plus a column configuration. Items are OntologyObjects, so
// the same object can appear on many boards and an edit anywhere updates the
// one graph — One Studio, One Graph, Multiple Views.
//
// The payoff of having done the object model first: a board over ANY type gets
// sensible columns for free, because the type's own schema already declares
// label, columnType, options, colorMap and columnClass. Creating a board over
// `Customer` produces a working 41-column surface without anyone configuring
// anything — and the INTELLIGENCE and GOVERNANCE columns come with it, which is
// what makes it a decision surface rather than a table.

import { prisma } from '../../lib/prisma'
import { ObjectQueryCompiler, SortSpec } from './ObjectQueryCompiler'
import { STATE_COLORS } from './EnterpriseObjectModel'
import type { GatewayActor } from './OntologyGateway'
import type { QueryNode, FilterNode } from './ObjectSet'

/** Column classes shown by default. Intelligence and governance are opt-in per
 *  board — present, but not forced on someone who just wants a task list. */
const DEFAULT_VISIBLE_CLASSES = ['CORE', 'ENTERPRISE']

export interface CreateBoardInput {
  name: string
  rootTypeName: string
  description?: string
  groupByField?: string
  defaultView?: 'table' | 'kanban' | 'timeline' | 'graph'
  workspace?: string
  ownerId?: string
  /** Extra filters beyond the type, e.g. { status: ['IN_PROGRESS','BLOCKED'] } */
  where?: Record<string, any>
  /** Column classes to show. Defaults to CORE + ENTERPRISE. */
  showClasses?: string[]
}

export const BoardService = {
  /**
   * Create a board over an object type, deriving its columns and groups from
   * that type's schema. Nothing is hand-configured.
   */
  async createBoard(input: CreateBoardInput) {
    const type = await prisma.ontologyObjectType.findUnique({
      where: { name: input.rootTypeName },
    })
    if (!type) throw new Error(`Unknown object type "${input.rootTypeName}"`)

    const schema = (type.schema ?? {}) as Record<string, any>
    if (!Object.keys(schema).length) {
      throw new Error(`"${input.rootTypeName}" has no schema — a board over it would have no columns`)
    }

    const groupBy = input.groupByField ?? 'status'
    const show = input.showClasses ?? DEFAULT_VISIBLE_CLASSES

    // The root type is ALWAYS part of the query, never replaced by the filters.
    // Written the other way round, a board over Project with a `status` filter
    // returned every object in the graph with that status — 34 rows on this
    // database, of which 17 were Contracts, Customers, Goals and Cases. The
    // board was not wrong-looking; it was wrong. Same mistake as IntentCompiler,
    // fixed the same way.
    const typeFilter: FilterNode = { type: 'filter', field: 'typeId', op: 'eq', value: type.id }
    const query: QueryNode = input.where && Object.keys(input.where).length
      ? {
          type: 'intersection',
          sets: [
            typeFilter,
            ...Object.entries(input.where).map(([field, value]) => ({
              type: 'filter', field, op: Array.isArray(value) ? 'in' : 'eq', value,
            } as FilterNode)),
          ],
        }
      : typeFilter

    const board = await prisma.board.create({
      data: {
        name: input.name,
        description: input.description ?? type.description ?? null,
        icon: type.icon,
        color: type.color,
        workspace: input.workspace ?? null,
        rootTypeName: input.rootTypeName,
        query: query as any,
        sort: [{ field: 'updatedAt', dir: 'desc' }] as any,
        defaultView: input.defaultView ?? 'table',
        groupByField: groupBy,
        statusField: schema.status ? 'status' : null,
        ownerId: input.ownerId ?? null,
      },
    })

    // ── Columns, derived from the type schema ────────────────────────────────
    const cols = Object.entries(schema)
      .map(([field, d]: [string, any]) => ({ field, ...d }))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

    await prisma.boardColumn.createMany({
      data: cols.map((c, i) => ({
        boardId: board.id,
        key: c.field,
        header: c.label ?? c.field,
        field: c.field,
        type: c.columnType ?? 'text',
        columnClass: c.columnClass ?? 'CORE',
        editable: c.columnClass === 'CORE' || c.columnClass === 'ENTERPRISE',
        options: c.options ?? [],
        colorMap: (c.colorMap ?? {}) as any,
        order: c.order ?? i,
        // Respect the schema's own hidden flag, then hide whole classes the
        // board did not ask for.
        hidden: !!c.hidden || !show.includes(c.columnClass ?? 'CORE'),
      })),
    })

    // ── Groups, derived from the grouped field's options ─────────────────────
    const groupDef = schema[groupBy]
    const options: string[] = groupDef?.options ?? []
    if (options.length) {
      await prisma.boardGroup.createMany({
        data: options.map((opt, i) => ({
          boardId: board.id,
          key: opt,
          label: opt.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          color: groupDef.colorMap?.[opt] ?? STATE_COLORS[opt] ?? null,
          order: i,
        })),
      })
    }

    return this.resolve(board.id, { id: 'system', type: 'SYSTEM', clearances: ['*'] })
  },

  /**
   * Everything the frontend BoardEngine needs, in one call and in its own prop
   * shape: columns as ColumnDef, groups as KanbanGroup, items already grouped.
   */
  async resolve(boardId: string, actor: GatewayActor, opts: { limit?: number; offset?: number } = {}) {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: { orderBy: { order: 'asc' } },
        groups: { orderBy: { order: 'asc' } },
        positions: true,
      },
    })
    if (!board) throw new Error('Board not found')

    const result = await ObjectQueryCompiler.run(
      {
        root: board.query as unknown as QueryNode,
        sort: board.sort as unknown as SortSpec[],
        limit: opts.limit ?? 200,
        offset: opts.offset ?? 0,
      },
      actor,
    )

    const posByObject = new Map(board.positions.map(p => [p.objectId, p]))

    // Flatten each object so the UI reads item.status rather than
    // item.properties.status — a serializer decision, not a storage one.
    const items = result.objects.map((o: any) => ({
      id: o.id,
      objectId: o.id,
      ...(o.properties ?? {}),
      _markings: o.markings ?? [],
      _position: posByObject.get(o.id)?.position ?? null,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    }))

    const groupField = board.groupByField ?? 'status'
    const grouped = board.groups.map(g => ({
      id: g.key,
      label: g.label,
      color: g.color ?? '#94a3b8',
      collapsed: g.collapsed,
      items: items
        .filter(i => String(i[groupField]) === g.key)
        .sort((a, b) => (a._position ?? Number.MAX_SAFE_INTEGER) - (b._position ?? Number.MAX_SAFE_INTEGER)),
    }))

    // Anything whose grouped value has no declared group — surfaced rather than
    // dropped, because silently hiding rows is how a board starts lying.
    const known = new Set(board.groups.map(g => g.key))
    const ungrouped = items.filter(i => !known.has(String(i[groupField])))

    return {
      board: {
        id: board.id, name: board.name, description: board.description,
        icon: board.icon, color: board.color,
        rootTypeName: board.rootTypeName, defaultView: board.defaultView,
        groupByField: groupField, statusField: board.statusField,
      },
      // ColumnDef shape — consumed by BoardEngine with no mapping
      columns: board.columns.filter(c => !c.hidden).map(c => ({
        id: c.key, header: c.header, field: c.field,
        type: c.type, editable: c.editable,
        options: c.options, colorMap: c.colorMap,
        width: c.width ?? undefined, columnClass: c.columnClass,
      })),
      hiddenColumns: board.columns.filter(c => c.hidden).map(c => ({
        id: c.key, header: c.header, columnClass: c.columnClass,
      })),
      groups: grouped,
      ungrouped,
      items,
      total: result.total,
      compiled: result.compiled,
      queryNote: result.reason,
    }
  },

  async listBoards(ownerId?: string) {
    return prisma.board.findMany({
      where: ownerId ? { OR: [{ ownerId }, { isPublic: true }, { isSystem: true }] } : undefined,
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { columns: true, groups: true } } },
    })
  },

  /** Move an item between groups — sets the grouped property, through the gateway. */
  async moveItem(boardId: string, objectId: string, toGroup: string, actor: GatewayActor, index?: number) {
    const board = await prisma.board.findUnique({ where: { id: boardId } })
    if (!board) throw new Error('Board not found')
    const field = board.groupByField ?? 'status'

    const { OntologyGateway } = await import('./OntologyGateway')
    const result = await OntologyGateway.patchObject(actor, objectId, {
      properties: { [field]: toGroup },
    })
    if (result.status !== 'OK') return result

    // Fractional index: land between neighbours without renumbering the column.
    const siblings = await prisma.boardItemPosition.findMany({
      where: { boardId, groupKey: toGroup },
      orderBy: { position: 'asc' },
    })
    let position: number
    if (index === undefined || index >= siblings.length) {
      position = (siblings[siblings.length - 1]?.position ?? 0) + 1000
    } else if (index <= 0) {
      position = (siblings[0]?.position ?? 1000) / 2
    } else {
      position = ((siblings[index - 1]?.position ?? 0) + (siblings[index]?.position ?? 0)) / 2
    }

    await prisma.boardItemPosition.upsert({
      where: { boardId_objectId: { boardId, objectId } },
      create: { boardId, objectId, groupKey: toGroup, position },
      update: { groupKey: toGroup, position },
    })

    return result
  },
}

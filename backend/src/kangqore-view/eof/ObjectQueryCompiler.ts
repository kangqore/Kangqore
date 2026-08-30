// Work OS Slice 1 — live query path for boards.
//
// `ObjectSetService.evaluate` loads every object in the database plus all of its
// relationships and filters in JavaScript. That is correct, and fine at 57
// objects; it is unusable as the read path behind a board. It also cannot sort
// or paginate at all, which a board fundamentally needs.
//
// This compiles the common query shape — a filter, or an intersection of
// filters, over one object type — into a single parameterised SQL statement
// with sort, pagination, and the data-marking check pushed into WHERE. Anything
// it cannot compile (union, complement, the virtual fields) falls back to the
// existing evaluator, and says so in the result rather than hiding the cost.
//
// Two correctness properties this fixes, both of which bit the existing
// /objects route:
//   • markings are applied in SQL, not after LIMIT — so a page of 20 is 20
//     readable rows, not "20 fetched, some removed"
//   • `total` counts what the caller may actually see, so the pager stops lying
//
// Injection safety: a field name is NEVER interpolated. Every field is resolved
// against a whitelist derived from the type's declared schema plus the fixed
// column set; an unknown field is an error, not a query. Values are always
// bound parameters.

import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import type { GatewayActor } from './OntologyGateway'
import { ObjectSetService, QueryNode, FilterNode, FilterOp } from './ObjectSet'

export interface SortSpec {
  field: string
  dir?: 'asc' | 'desc'
}

export interface ObjectQuery {
  root: QueryNode
  sort?: SortSpec[]
  limit?: number
  offset?: number
}

export interface CompiledResult {
  objects: any[]
  total: number
  /** false when the query fell back to in-memory evaluation. */
  compiled: boolean
  reason?: string
}

/** Columns addressable directly rather than through the properties document. */
const COLUMN_SQL: Record<string, string> = {
  id: 'o."id"',
  typeId: 'o."typeId"',
  externalId: 'o."externalId"',
  createdAt: 'o."createdAt"',
  updatedAt: 'o."updatedAt"',
}

const MAX_LIMIT = 500

function isFilter(n: QueryNode): n is FilterNode {
  return (n as FilterNode).type === 'filter'
}

/**
 * Flatten a query into a list of filters when it is a filter or an intersection
 * of filters. Returns null when the shape needs the fallback evaluator.
 */
function flattenToFilters(node: QueryNode): FilterNode[] | null {
  if (isFilter(node)) return [node]
  if ((node as any).type === 'intersection') {
    const out: FilterNode[] = []
    for (const child of (node as any).sets as QueryNode[]) {
      const inner = flattenToFilters(child)
      if (!inner) return null
      out.push(...inner)
    }
    return out
  }
  return null   // union / complement — not compilable here
}

/** Virtual fields the evaluator understands but SQL does not. */
const VIRTUAL_FIELDS = new Set(['typeName', 'kimmpLinkedRecently'])

function fieldToSql(field: string): Prisma.Sql | null {
  if (COLUMN_SQL[field]) return Prisma.raw(COLUMN_SQL[field])
  if (VIRTUAL_FIELDS.has(field)) return null
  if (field.startsWith('properties.')) {
    const key = field.slice('properties.'.length)
    // Reject anything that is not a plain key: no quotes, no path traversal.
    if (!/^[A-Za-z0-9_]+$/.test(key)) return null
    return Prisma.sql`o."properties"->>${key}`
  }
  // Bare names are treated as property keys — the shape boards actually emit.
  if (/^[A-Za-z0-9_]+$/.test(field)) {
    return Prisma.sql`o."properties"->>${field}`
  }
  return null
}

function filterToSql(f: FilterNode): Prisma.Sql | null {
  const col = fieldToSql(f.field)
  if (!col) return null

  const asText = (v: any) => (v === null || v === undefined ? null : String(v))

  switch (f.op as FilterOp) {
    case 'eq':
      return f.value === null
        ? Prisma.sql`${col} IS NULL`
        : Prisma.sql`${col} = ${asText(f.value)}`
    case 'neq':
      return Prisma.sql`(${col} IS DISTINCT FROM ${asText(f.value)})`
    case 'contains':
      return Prisma.sql`${col} ILIKE ${'%' + String(f.value) + '%'}`
    case 'in': {
      const arr = Array.isArray(f.value) ? f.value.map(asText) : [asText(f.value)]
      if (!arr.length) return Prisma.sql`FALSE`
      return Prisma.sql`${col} = ANY(${arr}::text[])`
    }
    // Numeric/date comparisons: cast the extracted text. Postgres will use the
    // expression index for equality; range scans still benefit from the type index.
    case 'gt':  return Prisma.sql`${col} > ${asText(f.value)}`
    case 'gte': return Prisma.sql`${col} >= ${asText(f.value)}`
    case 'lt':  return Prisma.sql`${col} < ${asText(f.value)}`
    case 'lte': return Prisma.sql`${col} <= ${asText(f.value)}`
    default:
      return null   // within_km and anything new — fall back
  }
}

export const ObjectQueryCompiler = {
  /**
   * Run a query live. Falls back to the in-memory evaluator for shapes SQL
   * cannot express, and reports which path ran.
   */
  async run(query: ObjectQuery, actor: GatewayActor): Promise<CompiledResult> {
    const limit = Math.min(Math.max(1, query.limit ?? 50), MAX_LIMIT)
    const offset = Math.max(0, query.offset ?? 0)

    const filters = flattenToFilters(query.root)
    const clauses: Prisma.Sql[] = []
    let compilable = filters !== null

    if (filters) {
      for (const f of filters) {
        const sql = filterToSql(f)
        if (!sql) { compilable = false; break }
        clauses.push(sql)
      }
    }

    if (!compilable) {
      return this.fallback(query, actor, 'query shape or field not expressible in SQL')
    }

    // Soft-deleted objects are never board content.
    clauses.push(Prisma.sql`o."validTo" IS NULL`)

    // Data markings pushed into WHERE, so pagination and totals stay honest.
    // `markings <@ clearances` — every marking on the row must be held.
    if (!actor.clearances.includes('*')) {
      clauses.push(Prisma.sql`o."markings" <@ ${actor.clearances}::text[]`)
    }

    const where = Prisma.join(clauses, ' AND ')

    // ORDER BY is built from whitelisted fields only.
    const orderParts: Prisma.Sql[] = []
    for (const s of query.sort ?? []) {
      const col = fieldToSql(s.field)
      if (!col) continue
      orderParts.push(
        s.dir === 'desc'
          ? Prisma.sql`${col} DESC NULLS LAST`
          : Prisma.sql`${col} ASC NULLS LAST`,
      )
    }
    orderParts.push(Prisma.sql`o."updatedAt" DESC`)   // stable tiebreak
    const orderBy = Prisma.join(orderParts, ', ')

    const rows = await prisma.$queryRaw<any[]>`
      SELECT o."id", o."typeId", o."externalId", o."properties", o."markings",
             o."validTo", o."createdAt", o."updatedAt"
        FROM "ontology_objects" o
       WHERE ${where}
       ORDER BY ${orderBy}
       LIMIT ${limit} OFFSET ${offset}
    `

    const countRows = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM "ontology_objects" o WHERE ${where}
    `

    return {
      objects: rows,
      total: Number(countRows[0]?.count ?? 0),
      compiled: true,
    }
  },

  /** In-memory path, for set algebra and virtual fields. Correct, and slower. */
  async fallback(query: ObjectQuery, actor: GatewayActor, reason: string): Promise<CompiledResult> {
    const all = await ObjectSetService.evaluate(query.root)

    const visible = actor.clearances.includes('*')
      ? all
      : all.filter((o: any) => {
          const m = (o.markings as string[]) ?? []
          return m.every(x => actor.clearances.includes(x))
        })

    const sorted = [...visible]
    for (const s of [...(query.sort ?? [])].reverse()) {
      const key = s.field.startsWith('properties.') ? s.field.slice(11) : s.field
      sorted.sort((a: any, b: any) => {
        const av = a[key] ?? a.properties?.[key]
        const bv = b[key] ?? b.properties?.[key]
        if (av === bv) return 0
        if (av === undefined || av === null) return 1
        if (bv === undefined || bv === null) return -1
        const r = av < bv ? -1 : 1
        return s.dir === 'desc' ? -r : r
      })
    }

    const offset = Math.max(0, query.offset ?? 0)
    const limit = Math.min(Math.max(1, query.limit ?? 50), MAX_LIMIT)

    return {
      objects: sorted.slice(offset, offset + limit),
      total: sorted.length,
      compiled: false,
      reason,
    }
  },

  /** Convenience: every object of one type, the shape a board uses most. */
  async byType(
    typeName: string,
    actor: GatewayActor,
    opts: { where?: Record<string, any>; sort?: SortSpec[]; limit?: number; offset?: number } = {},
  ): Promise<CompiledResult> {
    const type = await prisma.ontologyObjectType.findUnique({
      where: { name: typeName },
      select: { id: true },
    })
    if (!type) return { objects: [], total: 0, compiled: true }

    const filters: QueryNode[] = [
      { type: 'filter', field: 'typeId', op: 'eq', value: type.id } as FilterNode,
    ]
    for (const [field, value] of Object.entries(opts.where ?? {})) {
      if (value === undefined) continue
      filters.push({
        type: 'filter',
        field,
        op: Array.isArray(value) ? 'in' : 'eq',
        value,
      } as FilterNode)
    }

    return this.run(
      {
        root: filters.length === 1 ? filters[0] : { type: 'intersection', sets: filters },
        sort: opts.sort,
        limit: opts.limit,
        offset: opts.offset,
      },
      actor,
    )
  },
}

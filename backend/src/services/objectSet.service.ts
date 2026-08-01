// S293 — Object Set Query Engine
// An Object Set is a saved, named, composable query that returns a live
// collection of OntologyObjects. Query DSL:
//   { type: 'filter', field, op, value }
//   { type: 'union', sets: QueryNode[] }
//   { type: 'intersection', sets: QueryNode[] }
//   { type: 'complement', set: QueryNode }
// 'field' addresses either a top-level object column (typeId, externalId) or
// a properties.* path (e.g. "properties.ois", "properties.status").

import { prisma } from '../lib/prisma'

export type FilterOp = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in'

export interface FilterNode {
  type: 'filter'
  field: string
  op: FilterOp
  value: any
}

export interface CombinatorNode {
  type: 'union' | 'intersection'
  sets: QueryNode[]
}

export interface ComplementNode {
  type: 'complement'
  set: QueryNode
  scopeTypeId?: string  // universe to complement against — defaults to all objects
}

export type QueryNode = FilterNode | CombinatorNode | ComplementNode

const COLUMN_FIELDS = new Set(['typeId', 'externalId', 'id'])
const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

function readField(obj: any, field: string): any {
  if (field === 'typeName') return obj.type?.name
  if (field === 'kimmpLinkedRecently') {
    const rels: any[] = [...(obj.outboundRelationships ?? []), ...(obj.inboundRelationships ?? [])]
    const cutoff = Date.now() - RECENT_WINDOW_MS
    return rels.some(r => r.inferredBy === 'KIMMP' && new Date(r.validFrom).getTime() >= cutoff)
  }
  if (COLUMN_FIELDS.has(field)) return obj[field]
  if (field.startsWith('properties.')) {
    const path = field.slice('properties.'.length).split('.')
    let cur: any = obj.properties
    for (const key of path) {
      if (cur == null) return undefined
      cur = cur[key]
    }
    return cur
  }
  return obj.properties?.[field]
}

function applyFilter(objects: any[], node: FilterNode): any[] {
  return objects.filter(o => {
    const actual = readField(o, node.field)
    switch (node.op) {
      case 'eq':       return actual === node.value
      case 'neq':      return actual !== node.value
      case 'gt':       return typeof actual === 'number' && actual > node.value
      case 'gte':      return typeof actual === 'number' && actual >= node.value
      case 'lt':       return typeof actual === 'number' && actual < node.value
      case 'lte':      return typeof actual === 'number' && actual <= node.value
      case 'contains': return typeof actual === 'string' && actual.toLowerCase().includes(String(node.value).toLowerCase())
      case 'in':        return Array.isArray(node.value) && node.value.includes(actual)
      default: return false
    }
  })
}

export const ObjectSetService = {

  /** Evaluate a query DSL node against the full object universe, returning matched objects. */
  async evaluate(node: QueryNode, universe?: any[]): Promise<any[]> {
    const all = universe ?? await prisma.ontologyObject.findMany({
      include: {
        type: { select: { name: true, displayName: true, icon: true, color: true } },
        outboundRelationships: { where: { validTo: null }, select: { inferredBy: true, validFrom: true } },
        inboundRelationships:  { where: { validTo: null }, select: { inferredBy: true, validFrom: true } },
      },
    })

    switch (node.type) {
      case 'filter':
        return applyFilter(all, node)

      case 'union': {
        const seen = new Map<string, any>()
        for (const child of node.sets) {
          for (const obj of await ObjectSetService.evaluate(child, all)) seen.set(obj.id, obj)
        }
        return Array.from(seen.values())
      }

      case 'intersection': {
        if (node.sets.length === 0) return []
        const results = await Promise.all(node.sets.map(child => ObjectSetService.evaluate(child, all)))
        const [first, ...rest] = results
        const restIds = rest.map(r => new Set(r.map(o => o.id)))
        return first.filter(o => restIds.every(ids => ids.has(o.id)))
      }

      case 'complement': {
        const excluded = new Set((await ObjectSetService.evaluate(node.set, all)).map(o => o.id))
        const universeForComplement = node.scopeTypeId ? all.filter(o => o.typeId === node.scopeTypeId) : all
        return universeForComplement.filter(o => !excluded.has(o.id))
      }

      default:
        return []
    }
  },

  /** Run a saved ObjectSet's query, materialize ObjectSetMembership, and update run stats. */
  async execute(objectSetId: string): Promise<{ objects: any[]; count: number }> {
    const set = await prisma.objectSet.findUniqueOrThrow({ where: { id: objectSetId } })
    const objects = await ObjectSetService.evaluate(set.query as unknown as QueryNode)

    await prisma.$transaction([
      prisma.objectSetMembership.deleteMany({ where: { objectSetId } }),
      ...(objects.length > 0
        ? [prisma.objectSetMembership.createMany({
            data: objects.map(o => ({ objectSetId, objectId: o.id })),
            skipDuplicates: true,
          })]
        : []),
      prisma.objectSet.update({
        where: { id: objectSetId },
        data: { lastRunAt: new Date(), lastCount: objects.length },
      }),
    ])

    return { objects, count: objects.length }
  },

  /** Preview a query DSL without persisting membership — used by the builder UI. */
  async preview(query: QueryNode): Promise<{ objects: any[]; count: number }> {
    const objects = await ObjectSetService.evaluate(query)
    return { objects, count: objects.length }
  },

  SYSTEM_SETS: [
    {
      name: 'All Clients',
      description: 'Every OntologyObject of type Client',
      query: { type: 'filter', field: 'typeName', op: 'eq', value: 'Client' } as QueryNode,
      tags: ['system', 'clients'],
    },
    {
      name: 'High-Risk Signals',
      description: 'Objects of type Risk flagged HIGH or CRITICAL severity',
      query: {
        type: 'intersection',
        sets: [
          { type: 'filter', field: 'typeName', op: 'eq', value: 'Risk' },
          { type: 'filter', field: 'properties.severity', op: 'in', value: ['HIGH', 'CRITICAL'] },
        ],
      } as QueryNode,
      tags: ['system', 'risk'],
    },
    {
      name: 'KIMMP Decisions This Week',
      description: 'Objects touched by a KIMMP-inferred relationship in the last 7 days',
      query: { type: 'filter', field: 'kimmpLinkedRecently', op: 'eq', value: true } as QueryNode,
      tags: ['system', 'kimmp'],
    },
    {
      name: 'OIS Below 70',
      description: 'Accounts whose OIS score has dropped under the healthy threshold',
      query: { type: 'filter', field: 'properties.ois', op: 'lt', value: 70 } as QueryNode,
      tags: ['system', 'ois'],
    },
  ] as Array<{ name: string; description: string; query: QueryNode; tags: string[] }>,

  /** Idempotently create the seed system sets (mirrors the /types/seed pattern). */
  async seedSystemSets(): Promise<Array<{ created: boolean; name: string }>> {
    const results: Array<{ created: boolean; name: string }> = []
    for (const def of ObjectSetService.SYSTEM_SETS) {
      const existing = await prisma.objectSet.findFirst({ where: { name: def.name, isSystem: true } })
      if (existing) {
        results.push({ created: false, name: def.name })
        continue
      }
      const created = await prisma.objectSet.create({
        data: {
          name: def.name,
          description: def.description,
          query: def.query as any,
          tags: def.tags,
          isSystem: true,
          isPublic: true,
        },
      })
      await ObjectSetService.execute(created.id)
      results.push({ created: true, name: created.name })
    }
    return results
  },
}

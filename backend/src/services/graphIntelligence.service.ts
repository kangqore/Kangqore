import { prisma } from '../lib/prisma'

export interface GraphNode {
  id:         string
  typeId:     string
  typeName:   string
  externalId: string | null
  properties: Record<string, unknown>
  markings:   string[]
  createdAt:  Date
}

export interface GraphEdge {
  id:               string
  sourceId:         string
  targetId:         string
  sourceType:       string
  targetType:       string
  relationshipType: string
  label:            string | null
  strength:         number
  confidence:       number
  inferredBy:       string | null
  validFrom:        Date
  validTo:          Date | null
  reason:           string | null
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

// ── BFS traversal from a root node ───────────────────────────────────────────
export async function bfsGraph(
  rootId: string,
  maxDepth: number,
  asOf?: Date,
  visited = new Set<string>(),
): Promise<GraphData> {
  if (maxDepth === 0 || visited.has(rootId)) return { nodes: [], edges: [] }
  visited.add(rootId)

  const node = await prisma.ontologyObject.findUnique({
    where: { id: rootId },
    include: { type: true },
  })
  if (!node) return { nodes: [], edges: [] }

  const now = asOf ?? new Date()
  const rels = await prisma.ontologyRelationship.findMany({
    where: {
      AND: [
        { OR: [{ sourceId: rootId }, { targetId: rootId }] },
        { validFrom: { lte: now } },
        { OR: [{ validTo: null }, { validTo: { gte: now } }] },
      ],
    },
  })

  const childIds = rels.map(r => (r.sourceId === rootId ? r.targetId : r.sourceId))
  const children = await Promise.all(
    childIds.map(id => bfsGraph(id, maxDepth - 1, asOf, visited)),
  )

  const graphNode: GraphNode = {
    id:         node.id,
    typeId:     node.typeId,
    typeName:   (node.type as any).name,
    externalId: node.externalId,
    properties: node.properties as Record<string, unknown>,
    markings:   node.markings,
    createdAt:  node.createdAt,
  }

  return {
    nodes: dedup([graphNode, ...children.flatMap(c => c.nodes)], 'id'),
    edges: dedup([...rels.map(edgeMap), ...children.flatMap(c => c.edges)], 'id'),
  }
}

// ── Full canvas: all objects + edges (optionally filtered by typeId) ──────────
export async function fullGraph(typeId?: string, limit = 200): Promise<GraphData> {
  const objects = await prisma.ontologyObject.findMany({
    where: typeId ? { typeId } : undefined,
    include: { type: true },
    take: limit,
    orderBy: { createdAt: 'desc' },
  })
  const ids = objects.map(o => o.id)

  const rels = await prisma.ontologyRelationship.findMany({
    where: {
      OR: [
        { sourceId: { in: ids } },
        { targetId: { in: ids } },
      ],
      validTo: null,
    },
  })

  return {
    nodes: objects.map(o => ({
      id:         o.id,
      typeId:     o.typeId,
      typeName:   (o.type as any).name,
      externalId: o.externalId,
      properties: o.properties as Record<string, unknown>,
      markings:   o.markings,
      createdAt:  o.createdAt,
    })),
    edges: rels.map(edgeMap),
  }
}

// ── Shortest path (Dijkstra via adjacency) ────────────────────────────────────
export async function shortestPath(fromId: string, toId: string): Promise<GraphNode[]> {
  const allRels = await prisma.ontologyRelationship.findMany({
    where: { validTo: null },
    select: { sourceId: true, targetId: true, strength: true },
  })

  const adj = new Map<string, Array<{ id: string; weight: number }>>()
  for (const r of allRels) {
    if (!adj.has(r.sourceId)) adj.set(r.sourceId, [])
    if (!adj.has(r.targetId)) adj.set(r.targetId, [])
    adj.get(r.sourceId)!.push({ id: r.targetId, weight: 1 / (r.strength || 0.001) })
    adj.get(r.targetId)!.push({ id: r.sourceId, weight: 1 / (r.strength || 0.001) })
  }

  const dist = new Map<string, number>()
  const prev = new Map<string, string | null>()
  const visited = new Set<string>()
  dist.set(fromId, 0)

  const queue = [fromId]
  while (queue.length > 0) {
    queue.sort((a, b) => (dist.get(a) ?? Infinity) - (dist.get(b) ?? Infinity))
    const curr = queue.shift()!
    if (visited.has(curr)) continue
    visited.add(curr)
    if (curr === toId) break

    for (const nb of adj.get(curr) ?? []) {
      const newDist = (dist.get(curr) ?? Infinity) + nb.weight
      if (newDist < (dist.get(nb.id) ?? Infinity)) {
        dist.set(nb.id, newDist)
        prev.set(nb.id, curr)
        queue.push(nb.id)
      }
    }
  }

  // Reconstruct path
  const path: string[] = []
  let cur: string | null = toId
  while (cur && cur !== fromId) { path.unshift(cur); cur = prev.get(cur) ?? null }
  if (cur === fromId) path.unshift(fromId)

  if (path.length === 0 || path[0] !== fromId) return []

  const objects = await prisma.ontologyObject.findMany({
    where: { id: { in: path } },
    include: { type: true },
  })
  const byId = new Map(objects.map(o => [o.id, o]))

  return path.map(id => {
    const o = byId.get(id)!
    return {
      id: o.id, typeId: o.typeId, typeName: (o.type as any).name,
      externalId: o.externalId, properties: o.properties as Record<string, unknown>,
      markings: o.markings, createdAt: o.createdAt,
    }
  })
}

// ── Impact propagation (downstream/upstream cascade) ─────────────────────────
export async function impactGraph(
  rootId: string,
  direction: 'down' | 'up' | 'both' = 'both',
  maxDepth = 4,
): Promise<GraphData> {
  const visited = new Set<string>()
  const edges: GraphEdge[] = []

  async function traverse(id: string, depth: number) {
    if (depth === 0 || visited.has(id)) return
    visited.add(id)

    const where: any = { validTo: null }
    if (direction === 'down')  where.sourceId = id
    else if (direction === 'up') where.targetId = id
    else where.OR = [{ sourceId: id }, { targetId: id }]

    const rels = await prisma.ontologyRelationship.findMany({ where })
    edges.push(...rels.map(edgeMap))

    const nextIds = rels.map(r => (r.sourceId === id ? r.targetId : r.sourceId))
    await Promise.all(nextIds.map(nid => traverse(nid, depth - 1)))
  }

  visited.add(rootId)
  await traverse(rootId, maxDepth)

  const allIds = [...visited]
  const objects = await prisma.ontologyObject.findMany({
    where: { id: { in: allIds } },
    include: { type: true },
  })

  return {
    nodes: objects.map(o => ({
      id: o.id, typeId: o.typeId, typeName: (o.type as any).name,
      externalId: o.externalId, properties: o.properties as Record<string, unknown>,
      markings: o.markings, createdAt: o.createdAt,
    })),
    edges: dedup(edges, 'id'),
  }
}

// ── Centrality: top-N nodes by degree ────────────────────────────────────────
export async function centralityRanking(topN = 20): Promise<Array<{ node: GraphNode; degree: number }>> {
  const rels = await prisma.ontologyRelationship.findMany({
    where: { validTo: null },
    select: { sourceId: true, targetId: true },
  })

  const degree = new Map<string, number>()
  for (const r of rels) {
    degree.set(r.sourceId, (degree.get(r.sourceId) ?? 0) + 1)
    degree.set(r.targetId, (degree.get(r.targetId) ?? 0) + 1)
  }

  const sorted = [...degree.entries()].sort((a, b) => b[1] - a[1]).slice(0, topN)
  const ids = sorted.map(([id]) => id)
  const objects = await prisma.ontologyObject.findMany({ where: { id: { in: ids } }, include: { type: true } })
  const byId = new Map(objects.map(o => [o.id, o]))

  return sorted
    .filter(([id]) => byId.has(id))
    .map(([id, deg]) => {
      const o = byId.get(id)!
      return {
        degree: deg,
        node: {
          id: o.id, typeId: o.typeId, typeName: (o.type as any).name,
          externalId: o.externalId, properties: o.properties as Record<string, unknown>,
          markings: o.markings, createdAt: o.createdAt,
        },
      }
    })
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function edgeMap(r: any): GraphEdge {
  return {
    id: r.id, sourceId: r.sourceId, targetId: r.targetId,
    sourceType: r.sourceType, targetType: r.targetType,
    relationshipType: r.relationshipType, label: r.label,
    strength: r.strength, confidence: r.confidence,
    inferredBy: r.inferredBy, validFrom: r.validFrom,
    validTo: r.validTo, reason: r.reason,
  }
}

function dedup<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set()
  return arr.filter(item => {
    const k = item[key]
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

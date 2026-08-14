// Dependency Graph service — resolve WorkItem dependency DAG.
// Computes: topological order, critical path, blockers, cycle detection.
// All relationships come from OntologyRelationship — the single source of truth.

import { prisma } from '../lib/prisma'
import { WORK_TYPES, WORK_RELATIONSHIPS } from './workItem.service'

export interface DGraphNode {
  id: string          // WorkItem.id
  objectId: string    // OntologyObject.id
  title: string; type: string; status: string; priority: string
  estimatedHours?: number | null
  dueDate?: Date | null
  assigneeId?: string | null
  progress: number
  layer: number       // topological layer (0 = root)
  criticalPath: boolean
  isCycleNode: boolean
}

export interface DGraphEdge {
  from: string        // WorkItem.id
  to: string
  type: string        // blocks | dependsOn
}

export interface DependencyGraphData {
  nodes: DGraphNode[]
  edges: DGraphEdge[]
  criticalPath: string[]   // ordered list of WorkItem.ids
  cycles: string[][]       // each inner array is a cycle
  stats: {
    total: number; blocked: number; criticalCount: number; hasCycles: boolean
  }
}

export const DependencyGraphService = {

  async compute(filters?: { projectId?: string; portfolioId?: string }): Promise<DependencyGraphData> {
    // 1. Fetch all WorkItems in scope
    const where: any = {}
    if (filters?.projectId)   where.projectId   = filters.projectId
    if (filters?.portfolioId) where.portfolioId = filters.portfolioId

    const items = await (prisma as any).workItem.findMany({
      where: { ...where, objectId: { not: null } },
      take: 500,
    })

    if (items.length === 0) {
      return { nodes: [], edges: [], criticalPath: [], cycles: [], stats: { total: 0, blocked: 0, criticalCount: 0, hasCycles: false } }
    }

    const objIdToItem = new Map<string, any>(items.map((i: any) => [i.objectId, i]))
    const itemIdToItem = new Map<string, any>(items.map((i: any) => [i.id, i]))
    const objIds = items.map((i: any) => i.objectId)

    // 2. Fetch all dependency/blocking relationships between these objects
    const rels = await prisma.ontologyRelationship.findMany({
      where: {
        sourceId: { in: objIds },
        targetId: { in: objIds },
        relationshipType: { in: [WORK_RELATIONSHIPS.BLOCKS, WORK_RELATIONSHIPS.DEPENDS_ON] },
      },
    })

    // Build adjacency for both directions
    // Edge: A blocks B → A must complete before B (A→B in DAG)
    // Edge: A dependsOn B → B must complete before A (B→A in DAG)
    const outgoing = new Map<string, string[]>()  // WorkItem.id → [WorkItem.id] (must complete before)
    const incoming = new Map<string, string[]>()  // WorkItem.id → [WorkItem.id] (depends on)

    const edges: DGraphEdge[] = []
    for (const rel of rels) {
      const src = objIdToItem.get(rel.sourceId)
      const tgt = objIdToItem.get(rel.targetId)
      if (!src || !tgt) continue

      let from = src.id, to = tgt.id
      if (rel.relationshipType === WORK_RELATIONSHIPS.DEPENDS_ON) {
        // A dependsOn B → B→A in DAG
        ;[from, to] = [tgt.id, src.id]
      }
      edges.push({ from, to, type: rel.relationshipType })
      if (!outgoing.has(from)) outgoing.set(from, [])
      outgoing.get(from)!.push(to)
      if (!incoming.has(to)) incoming.set(to, [])
      incoming.get(to)!.push(from)
    }

    // 3. Topological sort (Kahn's algorithm) + cycle detection
    const inDegree = new Map<string, number>()
    for (const item of items) inDegree.set(item.id, (incoming.get(item.id) ?? []).length)

    const queue: string[] = []
    const layers = new Map<string, number>()
    for (const item of items) {
      if (inDegree.get(item.id) === 0) { queue.push(item.id); layers.set(item.id, 0) }
    }

    const sorted: string[] = []
    while (queue.length > 0) {
      const node = queue.shift()!
      sorted.push(node)
      const layer = layers.get(node) ?? 0
      for (const next of outgoing.get(node) ?? []) {
        const d = (inDegree.get(next) ?? 1) - 1
        inDegree.set(next, d)
        layers.set(next, Math.max(layers.get(next) ?? 0, layer + 1))
        if (d === 0) queue.push(next)
      }
    }

    const cycleNodes = new Set<string>()
    if (sorted.length < items.length) {
      for (const item of items) {
        if (!sorted.includes(item.id)) cycleNodes.add(item.id)
      }
    }

    // 4. Critical path (longest path by estimated hours)
    const latestFinish = new Map<string, number>()
    const onCritical = new Set<string>()
    for (const id of sorted) {
      const item = itemIdToItem.get(id)!
      const duration = item.estimatedHours ?? 1
      const prereqMax = Math.max(0, ...(incoming.get(id) ?? []).map(p => latestFinish.get(p) ?? 0))
      latestFinish.set(id, prereqMax + duration)
    }
    const maxFinish = Math.max(0, ...Array.from(latestFinish.values()))

    const criticalPath: string[] = []
    // Walk back from nodes with max finish time
    const maxNodes = sorted.filter(id => (latestFinish.get(id) ?? 0) >= maxFinish - 0.01)
    for (const start of maxNodes) {
      let cur = start
      while (cur) {
        if (onCritical.has(cur)) break
        onCritical.add(cur)
        criticalPath.unshift(cur)
        const preds = incoming.get(cur) ?? []
        const best = preds.reduce<string | null>((acc, p) => {
          if (!acc) return p
          return (latestFinish.get(p) ?? 0) > (latestFinish.get(acc) ?? 0) ? p : acc
        }, null)
        cur = best!
      }
    }

    // 5. Build final nodes
    const nodes: DGraphNode[] = items.map((item: any) => ({
      id: item.id,
      objectId: item.objectId,
      title: item.title,
      type: item.type,
      status: item.status,
      priority: item.priority,
      estimatedHours: item.estimatedHours,
      dueDate: item.dueDate,
      assigneeId: item.assigneeId,
      progress: item.progress,
      layer: layers.get(item.id) ?? 0,
      criticalPath: onCritical.has(item.id),
      isCycleNode: cycleNodes.has(item.id),
    }))

    const cycles = cycleNodes.size > 0 ? [Array.from(cycleNodes)] : []

    return {
      nodes,
      edges,
      criticalPath,
      cycles,
      stats: {
        total: items.length,
        blocked: items.filter((i: any) => i.status === 'BLOCKED').length,
        criticalCount: onCritical.size,
        hasCycles: cycleNodes.size > 0,
      },
    }
  },
}

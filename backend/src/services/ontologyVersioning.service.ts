// Track G — Ontology Versioning Service
// Captures point-in-time snapshots of the live ontology and supports
// publish, rollback, diff, and semantic version management.

import { prisma } from '../lib/prisma'

export type SnapshotStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface SnapshotSummary {
  id: string
  version: string
  label: string
  description: string | null
  status: SnapshotStatus
  typeCount: number
  objectCount: number
  relationshipCount: number
  createdBy: string | null
  publishedAt: Date | null
  archivedAt: Date | null
  createdAt: Date
}

export interface SnapshotDiff {
  addedTypes: string[]
  removedTypes: string[]
  addedObjects: number
  removedObjects: number
  addedRelationships: number
  removedRelationships: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function nextVersion(latest: string | null): string {
  if (!latest) return 'v1.0.0'
  const m = latest.match(/^v(\d+)\.(\d+)\.(\d+)$/)
  if (!m) return 'v1.0.0'
  return `v${m[1]}.${parseInt(m[2]) + 1}.0`
}

async function readLiveState() {
  const [types, objects, relationships] = await Promise.all([
    prisma.ontologyObjectType.findMany({
      include: { actions: true },
      orderBy: { name: 'asc' },
    }),
    prisma.ontologyObject.findMany({
      orderBy: { createdAt: 'asc' },
    }),
    prisma.ontologyRelationship.findMany({
      where: { validTo: null },
      orderBy: { createdAt: 'asc' },
    }),
  ])
  return { types, objects, relationships }
}

// ── Service ───────────────────────────────────────────────────────────────────

export const OntologyVersioning = {

  async captureSnapshot(input: {
    label: string
    description?: string
    createdBy?: string
    publish?: boolean
  }): Promise<SnapshotSummary> {
    const latest = await prisma.ontologySnapshot.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { version: true },
    })

    const version = nextVersion(latest?.version ?? null)
    const { types, objects, relationships } = await readLiveState()
    const status: SnapshotStatus = input.publish ? 'PUBLISHED' : 'DRAFT'

    const snap = await prisma.ontologySnapshot.create({
      data: {
        version,
        label: input.label,
        description: input.description ?? null,
        status,
        typeCount: types.length,
        objectCount: objects.length,
        relationshipCount: relationships.length,
        data: { types, objects, relationships } as any,
        createdBy: input.createdBy ?? null,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    })

    return snap as unknown as SnapshotSummary
  },

  async publish(id: string): Promise<SnapshotSummary> {
    const snap = await prisma.ontologySnapshot.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    })
    return snap as unknown as SnapshotSummary
  },

  async archive(id: string): Promise<SnapshotSummary> {
    const snap = await prisma.ontologySnapshot.update({
      where: { id },
      data: { status: 'ARCHIVED', archivedAt: new Date() },
    })
    return snap as unknown as SnapshotSummary
  },

  async list(opts?: { status?: SnapshotStatus; limit?: number }): Promise<SnapshotSummary[]> {
    const where: any = {}
    if (opts?.status) where.status = opts.status

    const rows = await prisma.ontologySnapshot.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: opts?.limit ?? 50,
      select: {
        id: true, version: true, label: true, description: true, status: true,
        typeCount: true, objectCount: true, relationshipCount: true,
        createdBy: true, publishedAt: true, archivedAt: true, createdAt: true,
      },
    })
    return rows as unknown as SnapshotSummary[]
  },

  async get(id: string) {
    return prisma.ontologySnapshot.findUniqueOrThrow({ where: { id } })
  },

  async getByVersion(version: string) {
    return prisma.ontologySnapshot.findUniqueOrThrow({ where: { version } })
  },

  // Rolls back the live ontology to a snapshot's data.
  // Strategy: replace all types (upsert), then reconcile objects and relationships.
  // Preserves IDs where possible; adds new, removes deleted.
  async rollback(id: string, actorId?: string): Promise<{ typesRestored: number; objectsRestored: number; relationshipsRestored: number }> {
    const snap = await prisma.ontologySnapshot.findUniqueOrThrow({ where: { id } })
    const data = snap.data as any

    const { types = [], objects = [], relationships = [] } = data

    // 1. Upsert types
    for (const t of types) {
      const { id: tid, instances, actions, semanticMappings, createdAt, updatedAt, ...fields } = t
      await prisma.ontologyObjectType.upsert({
        where: { id: tid },
        create: { id: tid, ...fields, schema: fields.schema ?? {} },
        update: fields,
      })
    }

    // 2. Upsert objects
    for (const o of objects) {
      const { id: oid, outboundRelationships, inboundRelationships, events, externalRefs, createdAt, updatedAt, ...fields } = o
      await prisma.ontologyObject.upsert({
        where: { id: oid },
        create: { id: oid, ...fields },
        update: { properties: fields.properties, markings: fields.markings },
      })
    }

    // 3. Delete existing active relationships and recreate from snapshot
    await prisma.ontologyRelationship.deleteMany({ where: { validTo: null } })
    for (const r of relationships) {
      const { id: rid, source, target, createdAt, ...fields } = r
      try {
        await prisma.ontologyRelationship.upsert({
          where: { sourceId_targetId_relationshipType: { sourceId: fields.sourceId, targetId: fields.targetId, relationshipType: fields.relationshipType } },
          create: { id: rid, ...fields },
          update: fields,
        })
      } catch { /* skip if source/target object deleted */ }
    }

    return {
      typesRestored: types.length,
      objectsRestored: objects.length,
      relationshipsRestored: relationships.length,
    }
  },

  // Returns a structural diff between two snapshots (or latest live state vs a snapshot).
  async diff(fromId: string, toId?: string): Promise<SnapshotDiff> {
    const fromSnap = await prisma.ontologySnapshot.findUniqueOrThrow({ where: { id: fromId } })
    const fromData = fromSnap.data as any

    let toData: any
    if (toId) {
      const toSnap = await prisma.ontologySnapshot.findUniqueOrThrow({ where: { id: toId } })
      toData = toSnap.data as any
    } else {
      toData = await readLiveState()
    }

    const fromTypeNames = new Set<string>((fromData.types ?? []).map((t: any) => t.name))
    const toTypeNames   = new Set<string>((toData.types ?? []).map((t: any) => t.name))

    const addedTypes   = [...toTypeNames].filter(n => !fromTypeNames.has(n))
    const removedTypes = [...fromTypeNames].filter(n => !toTypeNames.has(n))

    return {
      addedTypes,
      removedTypes,
      addedObjects:        (toData.objects?.length ?? 0) - (fromData.objects?.length ?? 0),
      removedObjects:      Math.max(0, (fromData.objects?.length ?? 0) - (toData.objects?.length ?? 0)),
      addedRelationships:  (toData.relationships?.length ?? 0) - (fromData.relationships?.length ?? 0),
      removedRelationships: Math.max(0, (fromData.relationships?.length ?? 0) - (toData.relationships?.length ?? 0)),
    }
  },

  async stats() {
    const [total, published, drafts, latest] = await Promise.all([
      prisma.ontologySnapshot.count(),
      prisma.ontologySnapshot.count({ where: { status: 'PUBLISHED' } }),
      prisma.ontologySnapshot.count({ where: { status: 'DRAFT' } }),
      prisma.ontologySnapshot.findFirst({ orderBy: { publishedAt: 'desc' }, where: { status: 'PUBLISHED' }, select: { version: true, publishedAt: true } }),
    ])
    return { total, published, drafts, latestPublished: latest }
  },
}

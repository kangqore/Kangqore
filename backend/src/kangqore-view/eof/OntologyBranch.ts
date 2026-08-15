// Track G — Ontology Branch Service
// Sandbox branches let admins prototype ontology changes (add type, rename field,
// add relationship) without touching the live ontology. When ready, commit()
// applies all queued changes to production in one transaction.

import { prisma } from '../../lib/prisma'

export type BranchStatus = 'OPEN' | 'COMMITTED' | 'ABANDONED'

export type BranchChangeOp =
  | 'ADD_TYPE'
  | 'UPDATE_TYPE'
  | 'DELETE_TYPE'
  | 'ADD_OBJECT'
  | 'UPDATE_OBJECT'
  | 'DELETE_OBJECT'
  | 'ADD_RELATIONSHIP'
  | 'UPDATE_RELATIONSHIP'
  | 'DELETE_RELATIONSHIP'

export interface BranchChange {
  op: BranchChangeOp
  payload: Record<string, any>
  appliedAt: string   // ISO
  appliedBy?: string
}

export interface BranchRecord {
  id: string
  name: string
  description: string | null
  status: BranchStatus
  baseSnapshotId: string | null
  changeCount: number
  changes: BranchChange[]
  createdBy: string | null
  committedAt: Date | null
  abandonedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

// ── Service ───────────────────────────────────────────────────────────────────

export const OntologyBranchService = {

  async create(input: {
    name: string
    description?: string
    baseSnapshotId?: string
    createdBy?: string
  }): Promise<BranchRecord> {
    const branch = await prisma.ontologyBranch.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        baseSnapshotId: input.baseSnapshotId ?? null,
        createdBy: input.createdBy ?? null,
        changes: [] as any,
      },
    })
    return branch as unknown as BranchRecord
  },

  async get(id: string): Promise<BranchRecord> {
    const branch = await prisma.ontologyBranch.findUniqueOrThrow({ where: { id } })
    return branch as unknown as BranchRecord
  },

  async getByName(name: string): Promise<BranchRecord> {
    const branch = await prisma.ontologyBranch.findUniqueOrThrow({ where: { name } })
    return branch as unknown as BranchRecord
  },

  async list(opts?: { status?: BranchStatus; limit?: number }): Promise<BranchRecord[]> {
    const where: any = {}
    if (opts?.status) where.status = opts.status

    const rows = await prisma.ontologyBranch.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: opts?.limit ?? 50,
    })
    return rows as unknown as BranchRecord[]
  },

  // Stage a change onto the branch (does NOT touch live ontology).
  async applyChange(branchId: string, change: Omit<BranchChange, 'appliedAt'>): Promise<BranchRecord> {
    const branch = await prisma.ontologyBranch.findUniqueOrThrow({ where: { id: branchId } })
    if (branch.status !== 'OPEN') throw new Error('Branch is not OPEN')

    const existing = (branch.changes as unknown as BranchChange[]) ?? []
    const newChange: BranchChange = { ...change, appliedAt: new Date().toISOString() }

    const updated = await prisma.ontologyBranch.update({
      where: { id: branchId },
      data: {
        changes: [...existing, newChange] as any,
        changeCount: { increment: 1 },
      },
    })
    return updated as unknown as BranchRecord
  },

  // Revert the last N changes on a branch.
  async revertLast(branchId: string, count = 1): Promise<BranchRecord> {
    const branch = await prisma.ontologyBranch.findUniqueOrThrow({ where: { id: branchId } })
    if (branch.status !== 'OPEN') throw new Error('Branch is not OPEN')

    const existing = (branch.changes as unknown as BranchChange[]) ?? []
    const trimmed = existing.slice(0, Math.max(0, existing.length - count))

    const updated = await prisma.ontologyBranch.update({
      where: { id: branchId },
      data: { changes: trimmed as any, changeCount: trimmed.length },
    })
    return updated as unknown as BranchRecord
  },

  // Apply all staged changes to live ontology in a single transaction.
  async commit(branchId: string): Promise<{ applied: number }> {
    const branch = await prisma.ontologyBranch.findUniqueOrThrow({ where: { id: branchId } })
    if (branch.status !== 'OPEN') throw new Error('Branch is not OPEN')

    const changes = (branch.changes as unknown as BranchChange[]) ?? []
    let applied = 0

    await prisma.$transaction(async (tx) => {
      for (const change of changes) {
        const p = change.payload

        switch (change.op) {
          case 'ADD_TYPE':
            await tx.ontologyObjectType.upsert({
              where: { name: p.name },
              create: { name: p.name, displayName: p.displayName ?? p.name, description: p.description, icon: p.icon, color: p.color, schema: p.schema ?? {} },
              update: { displayName: p.displayName ?? p.name, description: p.description, icon: p.icon, color: p.color },
            })
            break

          case 'UPDATE_TYPE':
            await tx.ontologyObjectType.update({
              where: { id: p.id },
              data: { displayName: p.displayName, description: p.description, icon: p.icon, color: p.color, schema: p.schema },
            })
            break

          case 'DELETE_TYPE':
            await tx.ontologyObjectType.delete({ where: { id: p.id } }).catch(() => {})
            break

          case 'ADD_OBJECT':
            await tx.ontologyObject.create({
              data: { typeId: p.typeId, externalId: p.externalId, properties: p.properties ?? {}, markings: p.markings ?? [] },
            })
            break

          case 'UPDATE_OBJECT':
            await tx.ontologyObject.update({
              where: { id: p.id },
              data: { properties: p.properties, markings: p.markings },
            })
            break

          case 'DELETE_OBJECT':
            await tx.ontologyObject.delete({ where: { id: p.id } }).catch(() => {})
            break

          case 'ADD_RELATIONSHIP':
            await tx.ontologyRelationship.upsert({
              where: { sourceId_targetId_relationshipType: { sourceId: p.sourceId, targetId: p.targetId, relationshipType: p.relationshipType } },
              create: { sourceId: p.sourceId, targetId: p.targetId, sourceType: p.sourceType ?? '', targetType: p.targetType ?? '', relationshipType: p.relationshipType, label: p.label, strength: p.strength ?? 1.0, inferredBy: 'USER' },
              update: { label: p.label, strength: p.strength },
            })
            break

          case 'DELETE_RELATIONSHIP':
            await tx.ontologyRelationship.update({
              where: { id: p.id },
              data: { validTo: new Date() },
            }).catch(() => {})
            break

          default:
            break
        }
        applied++
      }

      await tx.ontologyBranch.update({
        where: { id: branchId },
        data: { status: 'COMMITTED', committedAt: new Date() },
      })
    })

    return { applied }
  },

  async abandon(branchId: string): Promise<BranchRecord> {
    const updated = await prisma.ontologyBranch.update({
      where: { id: branchId },
      data: { status: 'ABANDONED', abandonedAt: new Date() },
    })
    return updated as unknown as BranchRecord
  },

  async stats() {
    const [total, open, committed, abandoned] = await Promise.all([
      prisma.ontologyBranch.count(),
      prisma.ontologyBranch.count({ where: { status: 'OPEN' } }),
      prisma.ontologyBranch.count({ where: { status: 'COMMITTED' } }),
      prisma.ontologyBranch.count({ where: { status: 'ABANDONED' } }),
    ])
    return { total, open, committed, abandoned }
  },
}

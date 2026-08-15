// Track G — Ontology Merge & Approval Service
// Adds a PR-style review gate between branch creation and live commit.
// Also provides change impact analysis so reviewers can see blast radius before approving.

import { prisma } from '../../lib/prisma'
import { emitToAdmins } from '../../socket'
import { OntologyBranchService, BranchChange } from './OntologyBranch'

export type MRStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'MERGED'

export interface MergeRequestRecord {
  id: string
  branchId: string
  title: string
  description: string | null
  status: MRStatus
  requestedBy: string | null
  reviewedBy: string | null
  reviewNote: string | null
  requestedAt: Date
  reviewedAt: Date | null
  mergedAt: Date | null
}

// ── Impact Analysis ────────────────────────────────────────────────────────────

export interface ChangeImpact {
  op: string
  payload: Record<string, any>
  risk: 'LOW' | 'MEDIUM' | 'HIGH'
  affectedObjects: number
  affectedRelationships: number
  affectedRefs: number
  note: string
}

export interface ImpactReport {
  branchId: string
  branchName: string
  changeCount: number
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH'
  changes: ChangeImpact[]
  summary: {
    typesAdded: number
    typesModified: number
    typesDeleted: number
    objectsAdded: number
    objectsModified: number
    objectsDeleted: number
    relationshipsAdded: number
    relationshipsDeleted: number
  }
}

function riskLevel(objects: number, rels: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  const total = objects + rels
  if (total === 0) return 'LOW'
  if (total < 10) return 'MEDIUM'
  return 'HIGH'
}

async function analyzeChange(change: BranchChange): Promise<ChangeImpact> {
  const p = change.payload
  let affectedObjects = 0
  let affectedRelationships = 0
  let affectedRefs = 0
  let note = ''

  switch (change.op) {
    case 'DELETE_TYPE': {
      const [objs, rels, refs] = await Promise.all([
        p.id ? prisma.ontologyObject.count({ where: { typeId: p.id } }) : 0,
        p.id ? prisma.ontologyRelationship.count({ where: { OR: [{ sourceType: p.id }, { targetType: p.id }] } }) : 0,
        0,
      ])
      affectedObjects = objs
      affectedRelationships = rels
      note = objs > 0 ? `Deleting this type will cascade-delete ${objs} object${objs !== 1 ? 's' : ''} and ${rels} relationship${rels !== 1 ? 's' : ''}.` : 'Type has no instances — safe to delete.'
      break
    }

    case 'UPDATE_TYPE': {
      affectedObjects = p.id ? await prisma.ontologyObject.count({ where: { typeId: p.id } }) : 0
      note = affectedObjects > 0
        ? `Schema changes will affect ${affectedObjects} existing object${affectedObjects !== 1 ? 's' : ''}.`
        : 'No instances affected.'
      break
    }

    case 'DELETE_OBJECT': {
      const rels = p.id ? await prisma.ontologyRelationship.count({
        where: { validTo: null, OR: [{ sourceId: p.id }, { targetId: p.id }] },
      }) : 0
      const refs = p.id ? await prisma.externalEntityRef.count({ where: { objectId: p.id } }) : 0
      affectedRelationships = rels
      affectedRefs = refs
      note = rels > 0 || refs > 0
        ? `Deleting this object removes ${rels} relationship${rels !== 1 ? 's' : ''} and ${refs} external reference${refs !== 1 ? 's' : ''}.`
        : 'Object has no dependencies — safe to delete.'
      break
    }

    case 'DELETE_RELATIONSHIP': {
      note = 'Soft-deletes one relationship edge (sets validTo). No cascade effect.'
      break
    }

    case 'ADD_TYPE':
      note = 'Pure addition — no existing data affected.'
      break

    case 'ADD_OBJECT':
      note = 'New object instance — no existing data affected.'
      break

    case 'ADD_RELATIONSHIP':
      note = 'New relationship edge — no existing data affected.'
      break

    case 'UPDATE_OBJECT':
      note = 'Properties update only — no structural change.'
      break

    default:
      note = 'Unknown op.'
  }

  return {
    op: change.op,
    payload: p,
    risk: riskLevel(affectedObjects + affectedRefs, affectedRelationships),
    affectedObjects,
    affectedRelationships,
    affectedRefs,
    note,
  }
}

// ── Service ───────────────────────────────────────────────────────────────────

export const OntologyMerge = {

  async analyzeImpact(branchId: string): Promise<ImpactReport> {
    const branch = await prisma.ontologyBranch.findUniqueOrThrow({ where: { id: branchId } })
    const changes = (branch.changes as unknown as BranchChange[]) ?? []

    const impacts = await Promise.all(changes.map(analyzeChange))

    const summary = {
      typesAdded:           changes.filter(c => c.op === 'ADD_TYPE').length,
      typesModified:        changes.filter(c => c.op === 'UPDATE_TYPE').length,
      typesDeleted:         changes.filter(c => c.op === 'DELETE_TYPE').length,
      objectsAdded:         changes.filter(c => c.op === 'ADD_OBJECT').length,
      objectsModified:      changes.filter(c => c.op === 'UPDATE_OBJECT').length,
      objectsDeleted:       changes.filter(c => c.op === 'DELETE_OBJECT').length,
      relationshipsAdded:   changes.filter(c => c.op === 'ADD_RELATIONSHIP').length,
      relationshipsDeleted: changes.filter(c => c.op === 'DELETE_RELATIONSHIP').length,
    }

    const riskOrder = { LOW: 0, MEDIUM: 1, HIGH: 2 }
    const overallRisk = impacts.reduce<'LOW' | 'MEDIUM' | 'HIGH'>((max, imp) => {
      return riskOrder[imp.risk] > riskOrder[max] ? imp.risk : max
    }, 'LOW')

    return {
      branchId,
      branchName: branch.name,
      changeCount: changes.length,
      overallRisk,
      changes: impacts,
      summary,
    }
  },

  async createMergeRequest(input: {
    branchId: string
    title: string
    description?: string
    requestedBy?: string
  }): Promise<MergeRequestRecord> {
    const branch = await prisma.ontologyBranch.findUniqueOrThrow({ where: { id: input.branchId } })
    if (branch.status !== 'OPEN') throw new Error('Branch must be OPEN to request a merge')

    // Upsert: if there's already a rejected MR for this branch, allow re-opening
    const existing = await prisma.branchMergeRequest.findUnique({ where: { branchId: input.branchId } })
    let mr: any
    if (existing && existing.status === 'REJECTED') {
      mr = await prisma.branchMergeRequest.update({
        where: { id: existing.id },
        data: {
          title: input.title,
          description: input.description ?? null,
          status: 'PENDING',
          requestedBy: input.requestedBy ?? null,
          reviewedBy: null, reviewNote: null, reviewedAt: null,
          requestedAt: new Date(),
        },
      })
    } else if (existing) {
      throw new Error(`A merge request already exists for this branch (status: ${existing.status})`)
    } else {
      mr = await prisma.branchMergeRequest.create({
        data: {
          branchId: input.branchId,
          title: input.title,
          description: input.description ?? null,
          requestedBy: input.requestedBy ?? null,
        },
      })
    }

    emitToAdmins('ontology:merge-request', {
      event: 'CREATED',
      mr: { id: mr.id, branchId: mr.branchId, title: mr.title, status: mr.status },
    })

    return mr as MergeRequestRecord
  },

  async approve(id: string, reviewerId?: string, note?: string): Promise<{ mr: MergeRequestRecord; applied: number }> {
    const mr = await prisma.branchMergeRequest.findUniqueOrThrow({ where: { id } })
    if (mr.status !== 'PENDING') throw new Error('Only PENDING merge requests can be approved')

    // Commit the branch
    const result = await OntologyBranchService.commit(mr.branchId)

    const updated = await prisma.branchMergeRequest.update({
      where: { id },
      data: {
        status: 'MERGED',
        reviewedBy: reviewerId ?? null,
        reviewNote: note ?? null,
        reviewedAt: new Date(),
        mergedAt: new Date(),
      },
    })

    emitToAdmins('ontology:merge-request', {
      event: 'MERGED',
      mr: { id: updated.id, branchId: updated.branchId, title: updated.title },
    })

    return { mr: updated as MergeRequestRecord, applied: result.applied }
  },

  async reject(id: string, reviewerId?: string, note?: string): Promise<MergeRequestRecord> {
    const mr = await prisma.branchMergeRequest.findUniqueOrThrow({ where: { id } })
    if (mr.status !== 'PENDING') throw new Error('Only PENDING merge requests can be rejected')

    const updated = await prisma.branchMergeRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedBy: reviewerId ?? null,
        reviewNote: note ?? null,
        reviewedAt: new Date(),
      },
    })

    emitToAdmins('ontology:merge-request', {
      event: 'REJECTED',
      mr: { id: updated.id, branchId: updated.branchId, title: updated.title, reviewNote: note },
    })

    return updated as MergeRequestRecord
  },

  async get(id: string): Promise<MergeRequestRecord> {
    const mr = await prisma.branchMergeRequest.findUniqueOrThrow({ where: { id } })
    return mr as MergeRequestRecord
  },

  async getByBranch(branchId: string): Promise<MergeRequestRecord | null> {
    const mr = await prisma.branchMergeRequest.findUnique({ where: { branchId } })
    return mr as MergeRequestRecord | null
  },

  async list(opts?: { status?: MRStatus; limit?: number }): Promise<MergeRequestRecord[]> {
    const where: any = {}
    if (opts?.status) where.status = opts.status

    const rows = await prisma.branchMergeRequest.findMany({
      where,
      orderBy: { requestedAt: 'desc' },
      take: opts?.limit ?? 50,
    })
    return rows as unknown as MergeRequestRecord[]
  },

  async stats() {
    const [pending, approved, rejected, merged] = await Promise.all([
      prisma.branchMergeRequest.count({ where: { status: 'PENDING' } }),
      prisma.branchMergeRequest.count({ where: { status: 'APPROVED' } }),
      prisma.branchMergeRequest.count({ where: { status: 'REJECTED' } }),
      prisma.branchMergeRequest.count({ where: { status: 'MERGED' } }),
    ])
    return { pending, approved, rejected, merged }
  },
}

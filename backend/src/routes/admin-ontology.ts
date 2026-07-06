import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, authorize } from '../middleware/auth'
import {
  bfsGraph, fullGraph, shortestPath, impactGraph, centralityRanking,
} from '../services/graphIntelligence.service'
import { autoLinkObjects } from '../services/ontologyAutoLink.service'
import { OntologyVersioning } from '../services/ontologyVersioning.service'
import { OntologyBranchService } from '../services/ontologyBranch.service'
import { OntologyMerge } from '../services/ontologyMerge.service'
import { CdcService } from '../lib/cdc/cdcService'

const router = Router()
const guard = [authenticate, authorize(['ADMIN'])] as const

// ─── Default object types seeded on first use ─────────────────────────────────
const DEFAULT_TYPES = [
  { name: 'Client',   displayName: 'Client',   icon: 'Briefcase',     color: '#2564ea', description: 'Enterprise clients and their engagements' },
  { name: 'Project',  displayName: 'Project',  icon: 'Kanban',        color: '#7c3aed', description: 'Active delivery projects and workstreams' },
  { name: 'Lead',     displayName: 'Lead',     icon: 'Lightning',     color: '#d97706', description: 'Prospective clients in the revenue pipeline' },
  { name: 'Supplier', displayName: 'Supplier', icon: 'Truck',         color: '#059669', description: 'Vendors and procurement entities' },
  { name: 'Invoice',  displayName: 'Invoice',  icon: 'Receipt',       color: '#dc2626', description: 'Financial billing documents' },
  { name: 'Proposal', displayName: 'Proposal', icon: 'FileText',      color: '#0891b2', description: 'Commercial proposals and RFP responses' },
  { name: 'Resource', displayName: 'Resource', icon: 'User',          color: '#6366f1', description: 'Team members and their capacity allocation' },
  { name: 'Risk',     displayName: 'Risk',     icon: 'Warning',       color: '#ef4444', description: 'Identified risks and mitigation plans' },
]

// ─── Object Types ─────────────────────────────────────────────────────────────

router.get('/types', ...guard, async (req, res) => {
  try {
    const types = await prisma.ontologyObjectType.findMany({
      include: { _count: { select: { instances: true, actions: true } } },
      orderBy: { name: 'asc' },
    })
    res.json({ types })
  } catch {
    res.status(500).json({ error: 'Failed to fetch types' })
  }
})

router.get('/types/:id', ...guard, async (req, res) => {
  try {
    const type = await (prisma.ontologyObjectType.findUniqueOrThrow as any)({
      where: { id: req.params.id },
      include: {
        actions: { orderBy: { executions: 'desc' } },
        instances: { take: 10, orderBy: { createdAt: 'desc' } },
        _count: { select: { instances: true } },
      },
    })
    res.json({ type })
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

router.post('/types', ...guard, async (req, res) => {
  const { name, displayName, icon, description, color, schema } = req.body
  try {
    const type = await prisma.ontologyObjectType.create({
      data: { name, displayName, icon, description, color, schema: schema ?? {} },
    })
    res.json({ type })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/types/:id', ...guard, async (req, res) => {
  const { displayName, icon, description, color, schema } = req.body
  try {
    const type = await prisma.ontologyObjectType.update({
      where: { id: req.params.id },
      data: { displayName, icon, description, color, schema },
    })
    res.json({ type })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

// Seed default Kangqore business object types
router.post('/types/seed', ...guard, async (req, res) => {
  try {
    const results = []
    for (const t of DEFAULT_TYPES) {
      const existing = await prisma.ontologyObjectType.findUnique({ where: { name: t.name } })
      if (!existing) {
        const created = await prisma.ontologyObjectType.create({ data: { ...t, schema: {} } })
        results.push({ created: true, name: created.name })
      } else {
        results.push({ created: false, name: t.name })
      }
    }
    res.json({ results })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── Objects ──────────────────────────────────────────────────────────────────

router.get('/objects', ...guard, async (req, res) => {
  const { typeId, page = '1', limit = '20', search } = req.query as Record<string, string>
  const skip = (parseInt(page) - 1) * parseInt(limit)
  const where: any = {}
  if (typeId) where.typeId = typeId
  if (search) where.OR = [
    { externalId: { contains: search, mode: 'insensitive' } },
    { properties: { path: ['name'],  string_contains: search } },
    { properties: { path: ['title'], string_contains: search } },
  ]
  try {
    const [objects, total] = await Promise.all([
      prisma.ontologyObject.findMany({
        where,
        include: { type: { select: { name: true, displayName: true, icon: true, color: true } } },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.ontologyObject.count({ where }),
    ])
    res.json({ objects, total, pages: Math.ceil(total / parseInt(limit)) })
  } catch {
    res.status(500).json({ error: 'Failed to fetch objects' })
  }
})

router.post('/objects', ...guard, async (req, res) => {
  const { typeId, externalId, properties, markings } = req.body
  try {
    const obj = await prisma.ontologyObject.create({
      data: { typeId, externalId, properties: properties ?? {}, markings: markings ?? [] },
    })
    CdcService.emit('ontology_objects', 'INSERT', null, obj).catch(() => {})
    res.json({ object: obj })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/objects/:id', ...guard, async (req, res) => {
  const { properties, markings } = req.body
  try {
    const obj = await prisma.ontologyObject.update({
      where: { id: req.params.id },
      data: {
        ...(properties !== undefined && { properties }),
        ...(markings !== undefined && { markings }),
      },
    })
    CdcService.emit('ontology_objects', 'UPDATE', null, obj).catch(() => {})
    res.json({ object: obj })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

// ─── Actions ──────────────────────────────────────────────────────────────────

router.get('/actions', ...guard, async (req, res) => {
  const { typeId } = req.query as Record<string, string>
  try {
    const actions = await prisma.ontologyAction.findMany({
      where: typeId ? { typeId } : undefined,
      include: { type: { select: { name: true, displayName: true, icon: true, color: true } } },
      orderBy: { executions: 'desc' },
    })
    res.json({ actions })
  } catch {
    res.status(500).json({ error: 'Failed to fetch actions' })
  }
})

router.post('/actions', ...guard, async (req, res) => {
  const { typeId, name, displayName, description, parameters, allowedRoles } = req.body
  try {
    const action = await prisma.ontologyAction.create({
      data: {
        typeId, name, displayName, description,
        parameters: parameters ?? {},
        allowedRoles: allowedRoles ?? ['ADMIN'],
      },
    })
    res.json({ action })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/actions/:id/execute', ...guard, async (req, res) => {
  try {
    const action = await prisma.ontologyAction.update({
      where: { id: req.params.id },
      data: { executions: { increment: 1 } },
    })
    await prisma.auditLog.create({
      data: {
        userId: (req as any).user?.id,
        action: `ONTOLOGY:${action.name}`,
        resource: `ontology_actions/${action.id}`,
        newValue: req.body as any,
      },
    })
    res.json({ success: true, actionName: action.name, params: req.body })
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
})

// ─── Data Lineage ─────────────────────────────────────────────────────────────

router.get('/lineage', ...guard, async (req, res) => {
  const { agentId, page = '1', limit = '20' } = req.query as Record<string, string>
  const skip = (parseInt(page) - 1) * parseInt(limit)
  const where: any = agentId ? { agentId } : {}
  try {
    const [records, total] = await Promise.all([
      prisma.dataLineage.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
      prisma.dataLineage.count({ where }),
    ])
    res.json({ records, total, pages: Math.ceil(total / parseInt(limit)) })
  } catch {
    res.status(500).json({ error: 'Failed to fetch lineage' })
  }
})

router.post('/lineage', ...guard, async (req, res) => {
  const { agentId, agentName, model, promptHash, inputSources, outputRef, decisionText, confidence, tags } = req.body
  try {
    const record = await prisma.dataLineage.create({
      data: {
        agentId, agentName, model, promptHash,
        inputSources: inputSources ?? [],
        outputRef,
        decisionText,
        confidence,
        tags: tags ?? [],
      },
    })
    res.json({ record })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

// ─── Data Markings (MBAC) ────────────────────────────────────────────────────

router.get('/markings', ...guard, async (req, res) => {
  const { table, classification } = req.query as Record<string, string>
  const where: any = {}
  if (table) where.table = table
  if (classification) where.classification = classification
  try {
    const markings = await prisma.dataMarking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
    })
    res.json({ markings })
  } catch {
    res.status(500).json({ error: 'Failed to fetch markings' })
  }
})

router.post('/markings', ...guard, async (req, res) => {
  const { table, rowId, column, classification, purposes, reason, expiresAt } = req.body
  const createdBy = (req as any).user?.id ?? 'system'
  const col = column ?? ''
  try {
    const existing = await prisma.dataMarking.findFirst({ where: { table, rowId, column: col } })
    const marking = existing
      ? await prisma.dataMarking.update({
          where: { id: existing.id },
          data: { classification, purposes: purposes ?? [], reason, expiresAt: expiresAt ? new Date(expiresAt) : null },
        })
      : await prisma.dataMarking.create({
          data: { table, rowId, column: col, classification, purposes: purposes ?? [], reason, createdBy, expiresAt: expiresAt ? new Date(expiresAt) : null },
        })
    res.json({ marking })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/markings/:id', ...guard, async (req, res) => {
  try {
    await prisma.dataMarking.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

// ─── Semantic Graph ──────────────────────────────────────────────────────────

router.get('/graph', ...guard, async (req, res) => {
  try {
    const { rootId, depth = '2', at } = req.query as Record<string, string>
    if (!rootId) return res.status(400).json({ error: 'rootId required' })
    const asOf = at ? new Date(at) : undefined
    const graph = await bfsGraph(rootId, Math.min(Number(depth), 5), asOf)
    res.json(graph)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.get('/graph/full', ...guard, async (req, res) => {
  try {
    const { typeId, limit = '200' } = req.query as Record<string, string>
    const graph = await fullGraph(typeId, Math.min(Number(limit), 500))
    res.json(graph)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.get('/graph/shortest-path', ...guard, async (req, res) => {
  try {
    const { from, to } = req.query as Record<string, string>
    if (!from || !to) return res.status(400).json({ error: 'from and to required' })
    const path = await shortestPath(from, to)
    res.json({ path })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.get('/graph/impact', ...guard, async (req, res) => {
  try {
    const { rootId, direction = 'both', depth = '4' } = req.query as Record<string, string>
    if (!rootId) return res.status(400).json({ error: 'rootId required' })
    const graph = await impactGraph(rootId, direction as any, Math.min(Number(depth), 6))
    res.json(graph)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.get('/graph/centrality', ...guard, async (req, res) => {
  try {
    const { topN = '20' } = req.query as Record<string, string>
    const ranking = await centralityRanking(Math.min(Number(topN), 50))
    res.json({ ranking })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.post('/graph/auto-link', ...guard, async (req, res) => {
  try {
    const result = await autoLinkObjects()
    res.json(result)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ─── Relationships ────────────────────────────────────────────────────────────

router.get('/relationships', ...guard, async (req, res) => {
  try {
    const { sourceId, targetId } = req.query as Record<string, string>
    const where: any = {}
    if (sourceId) where.sourceId = sourceId
    if (targetId) where.targetId = targetId
    const limit = parseInt(req.query.limit as string) || 100
    const rels = await prisma.ontologyRelationship.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit })
    res.json({ items: rels })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.post('/relationships', ...guard, async (req, res) => {
  try {
    const { sourceId, targetId, relationshipType, label, strength, confidence, reason } = req.body
    if (!sourceId || !targetId || !relationshipType) {
      return res.status(400).json({ error: 'sourceId, targetId, relationshipType required' })
    }

    const [src, tgt] = await Promise.all([
      prisma.ontologyObject.findUniqueOrThrow({ where: { id: sourceId }, include: { type: true } }),
      prisma.ontologyObject.findUniqueOrThrow({ where: { id: targetId }, include: { type: true } }),
    ])

    const rel = await prisma.ontologyRelationship.upsert({
      where: { sourceId_targetId_relationshipType: { sourceId, targetId, relationshipType } },
      create: {
        sourceId, targetId, relationshipType,
        sourceType: (src.type as any).name,
        targetType: (tgt.type as any).name,
        label: label ?? null,
        strength: strength ?? 1.0,
        confidence: confidence ?? 1.0,
        inferredBy: 'USER',
        reason: reason ?? null,
      },
      update: {
        label: label ?? undefined,
        strength: strength ?? undefined,
        confidence: confidence ?? undefined,
        validTo: null,
        reason: reason ?? undefined,
      },
    })
    CdcService.emit('ontology_relationships', 'UPSERT', null, rel).catch(() => {})
    res.status(201).json({ relationship: rel })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.delete('/relationships/:id', ...guard, async (req, res) => {
  try {
    await prisma.ontologyRelationship.update({
      where: { id: req.params.id },
      data: { validTo: new Date() },
    })
    res.json({ ok: true })
  } catch { res.status(404).json({ error: 'Not found' }) }
})

// ─── Events ───────────────────────────────────────────────────────────────────

router.get('/events', ...guard, async (req, res) => {
  try {
    const { objectId, eventType, from, to } = req.query as Record<string, string>
    const where: any = {}
    if (objectId)   where.objectId = objectId
    if (eventType)  where.eventType = eventType
    if (from || to) where.occurredAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to   ? { lte: new Date(to) }   : {}),
    }
    const limit = parseInt(req.query.limit as string) || 100
    const events = await prisma.ontologyEvent.findMany({
      where, orderBy: { occurredAt: 'desc' }, take: limit,
    })
    res.json({ items: events })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.post('/events', ...guard, async (req, res) => {
  try {
    const { objectId, eventType, occurredAt, externalId, properties, actorId } = req.body
    if (!objectId || !eventType || !occurredAt) {
      return res.status(400).json({ error: 'objectId, eventType, occurredAt required' })
    }
    const event = await prisma.ontologyEvent.create({
      data: { objectId, eventType, occurredAt: new Date(occurredAt), externalId, properties: properties ?? {}, actorId },
    })
    res.status(201).json({ event })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ─── Track G: Snapshots ───────────────────────────────────────────────────────

router.get('/snapshots', ...guard, async (req, res) => {
  try {
    const { status, limit } = req.query
    const snaps = await OntologyVersioning.list({
      status: status as any,
      limit: limit ? Number(limit) : undefined,
    })
    const stats = await OntologyVersioning.stats()
    res.json({ snapshots: snaps, stats })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.post('/snapshots', ...guard, async (req, res) => {
  try {
    const { label, description, publish } = req.body
    if (!label) return res.status(400).json({ error: 'label required' })
    const snap = await OntologyVersioning.captureSnapshot({
      label, description, publish: !!publish,
      createdBy: (req as any).user?.id,
    })
    CdcService.emit('ontology_snapshots', 'INSERT', null, snap as any).catch(() => {})
    res.status(201).json({ snapshot: snap })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.get('/snapshots/:id', ...guard, async (req, res) => {
  try {
    const snap = await OntologyVersioning.get(req.params.id)
    res.json({ snapshot: snap })
  } catch (e: any) { res.status(404).json({ error: e.message }) }
})

router.post('/snapshots/:id/publish', ...guard, async (req, res) => {
  try {
    const snap = await OntologyVersioning.publish(req.params.id)
    res.json({ snapshot: snap })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.post('/snapshots/:id/archive', ...guard, async (req, res) => {
  try {
    const snap = await OntologyVersioning.archive(req.params.id)
    res.json({ snapshot: snap })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.post('/snapshots/:id/rollback', ...guard, async (req, res) => {
  try {
    const result = await OntologyVersioning.rollback(req.params.id, (req as any).user?.id)
    res.json({ ok: true, ...result })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.get('/snapshots/:id/diff', ...guard, async (req, res) => {
  try {
    const { toId } = req.query
    const diff = await OntologyVersioning.diff(req.params.id, toId as string | undefined)
    res.json({ diff })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ─── Track G: Branches ────────────────────────────────────────────────────────

router.get('/branches', ...guard, async (req, res) => {
  try {
    const { status, limit } = req.query
    const branches = await OntologyBranchService.list({
      status: status as any,
      limit: limit ? Number(limit) : undefined,
    })
    const stats = await OntologyBranchService.stats()
    res.json({ branches, stats })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.post('/branches', ...guard, async (req, res) => {
  try {
    const { name, description, baseSnapshotId } = req.body
    if (!name) return res.status(400).json({ error: 'name required' })
    const branch = await OntologyBranchService.create({
      name, description, baseSnapshotId,
      createdBy: (req as any).user?.id,
    })
    res.status(201).json({ branch })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.get('/branches/:id', ...guard, async (req, res) => {
  try {
    const branch = await OntologyBranchService.get(req.params.id)
    res.json({ branch })
  } catch (e: any) { res.status(404).json({ error: e.message }) }
})

router.post('/branches/:id/changes', ...guard, async (req, res) => {
  try {
    const { op, payload } = req.body
    if (!op || !payload) return res.status(400).json({ error: 'op and payload required' })
    const branch = await OntologyBranchService.applyChange(req.params.id, {
      op, payload, appliedBy: (req as any).user?.id,
    })
    res.json({ branch })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.delete('/branches/:id/changes/last', ...guard, async (req, res) => {
  try {
    const count = Number(req.query.count ?? 1)
    const branch = await OntologyBranchService.revertLast(req.params.id, count)
    res.json({ branch })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.post('/branches/:id/commit', ...guard, async (req, res) => {
  try {
    const result = await OntologyBranchService.commit(req.params.id)
    res.json({ ok: true, ...result })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.post('/branches/:id/abandon', ...guard, async (req, res) => {
  try {
    const branch = await OntologyBranchService.abandon(req.params.id)
    res.json({ branch })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ─── Track G: Change Impact Analysis ──────────────────────────────────────────

router.get('/branches/:id/impact', ...guard, async (req, res) => {
  try {
    const report = await OntologyMerge.analyzeImpact(req.params.id)
    res.json({ report })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ─── Track G: Merge Requests ──────────────────────────────────────────────────

router.get('/merge-requests', ...guard, async (req, res) => {
  try {
    const { status, limit } = req.query
    const mrs = await OntologyMerge.list({
      status: status as any,
      limit: limit ? Number(limit) : undefined,
    })
    const stats = await OntologyMerge.stats()
    res.json({ mergeRequests: mrs, stats })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.post('/branches/:id/merge-request', ...guard, async (req, res) => {
  try {
    const { title, description } = req.body
    if (!title) return res.status(400).json({ error: 'title required' })
    const mr = await OntologyMerge.createMergeRequest({
      branchId: req.params.id,
      title,
      description,
      requestedBy: (req as any).user?.id,
    })
    res.status(201).json({ mergeRequest: mr })
  } catch (e: any) { res.status(400).json({ error: e.message }) }
})

router.get('/merge-requests/:id', ...guard, async (req, res) => {
  try {
    const mr = await OntologyMerge.get(req.params.id)
    res.json({ mergeRequest: mr })
  } catch (e: any) { res.status(404).json({ error: e.message }) }
})

router.post('/merge-requests/:id/approve', ...guard, async (req, res) => {
  try {
    const { note } = req.body
    const result = await OntologyMerge.approve(req.params.id, (req as any).user?.id, note)
    res.json({ ok: true, applied: result.applied, mergeRequest: result.mr })
  } catch (e: any) { res.status(400).json({ error: e.message }) }
})

router.post('/merge-requests/:id/reject', ...guard, async (req, res) => {
  try {
    const { note } = req.body
    const mr = await OntologyMerge.reject(req.params.id, (req as any).user?.id, note)
    res.json({ mergeRequest: mr })
  } catch (e: any) { res.status(400).json({ error: e.message }) }
})

export default router

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
import { ObjectSetService } from '../services/objectSet.service'
import { ActionEngine } from '../services/actionEngine.service'
import { seedEnterpriseActions, ACTION_LIBRARY } from '../services/actionLibrary.seed'
import { connectorHealth, listConnectors } from '../services/connectors/registry'
import { seedBlastRadiusPolicies } from '../services/policyEngine.service'
import { installActionPack, listInstalledPacks, ITSM_PACK } from '../services/actionPack.service'
import { OntologyTimeSeriesService } from '../services/ontologyTimeSeries.service'
import { OntologyGeoService } from '../services/ontologyGeo.service'
import { OntologyPipelineService } from '../services/ontologyPipeline.service'
import { previewCsv, runCsvImport, listImportBatches } from '../services/ontologyCsvImport.service'
import { OntologySdkGenerator } from '../services/ontologySdkGenerator.service'
import { OntologyToolSchema } from '../services/ontologyToolSchema.service'
import { OntologyWebhookSubscriptionService } from '../services/ontologyWebhookSubscription.service'
import { OntologyGateway, GatewayActor } from '../services/ontologyGateway.service'
import { CardinalityEngine } from '../services/cardinalityEngine.service'
import crypto from 'crypto'
import { getIO } from '../socket'

const router = Router()
const guard = [authenticate, authorize(['ADMIN'])] as const

function actorFrom(req: any): GatewayActor {
  return {
    id: req.user?.id ?? 'unknown',
    type: 'HUMAN',
    clearances: (req.user?.clearances as string[]) ?? [],
  }
}

function sendGatewayResult(res: any, result: Awaited<ReturnType<typeof OntologyGateway.createObject>>) {
  if (result.status === 'OK') return res.json({ object: result.data, relationship: result.data })
  if (result.status === 'PENDING_APPROVAL') return res.status(202).json({ status: 'PENDING_APPROVAL', pendingId: result.pendingId, reason: result.reason })
  if (result.status === 'CARDINALITY_VIOLATION') return res.status(409).json({ error: result.reason })
  return res.status(403).json({ error: result.reason })
}

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
    const actor = actorFrom(req)
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
    const visible = OntologyGateway.filterObjects(objects, actor)
    res.json({ objects: visible, total, pages: Math.ceil(total / parseInt(limit)) })
  } catch {
    res.status(500).json({ error: 'Failed to fetch objects' })
  }
})

// S304 — literal /objects/geo-* paths must be registered before /objects/:id
// (same 2-segment shape) or :id would swallow them.
router.get('/objects/geo-bbox', ...guard, async (req, res) => {
  const { minLat, maxLat, minLng, maxLng, typeId } = req.query as Record<string, string>
  if (![minLat, maxLat, minLng, maxLng].every(v => v !== undefined && !Number.isNaN(Number(v)))) {
    return res.status(400).json({ error: 'minLat, maxLat, minLng, maxLng are required' })
  }
  try {
    const objects = await OntologyGeoService.geoBbox({
      minLat: Number(minLat), maxLat: Number(maxLat), minLng: Number(minLng), maxLng: Number(maxLng),
    }, typeId || undefined)
    res.json({ objects })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/objects/geo-search', ...guard, async (req, res) => {
  const { lat, lng, radiusKm, typeId } = req.body
  if (typeof lat !== 'number' || typeof lng !== 'number' || typeof radiusKm !== 'number') {
    return res.status(400).json({ error: 'lat, lng, radiusKm (numbers) are required' })
  }
  try {
    const objects = await OntologyGeoService.geoSearch({ lat, lng }, radiusKm, typeId || undefined)
    res.json({ objects })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/objects/:id', ...guard, async (req, res) => {
  try {
    const object = await prisma.ontologyObject.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        type: { select: { name: true, displayName: true, icon: true, color: true } },
        outboundRelationships: { where: { validTo: null }, select: { id: true, targetId: true, relationshipType: true, confidence: true, inferredBy: true, validFrom: true, reason: true } },
        inboundRelationships: { where: { validTo: null }, select: { id: true, sourceId: true, relationshipType: true, confidence: true, inferredBy: true, validFrom: true, reason: true } },
      },
    })
    if (!OntologyGateway.canRead(object.markings as string[], actorFrom(req))) {
      return res.status(403).json({ error: 'Insufficient clearance for this object' })
    }
    res.json({ object })
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
})

router.post('/objects', ...guard, async (req, res) => {
  const { typeId, externalId, properties, markings } = req.body
  try {
    const result = await OntologyGateway.createObject(actorFrom(req), {
      typeId, externalId, properties: properties ?? {}, markings: markings ?? [],
    })
    if (result.status !== 'OK') return sendGatewayResult(res, result)
    res.json({ object: result.data })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/objects/:id', ...guard, async (req, res) => {
  const { properties, markings } = req.body
  try {
    const data: Record<string, any> = {}
    if (properties !== undefined) data.properties = properties
    if (markings !== undefined) data.markings = markings
    const result = await OntologyGateway.updateObject(actorFrom(req), req.params.id, data)
    if (result.status !== 'OK') return sendGatewayResult(res, result)
    res.json({ object: result.data })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

// ─── Time-Series — S303 ─────────────────────────────────────────────────────

router.post('/objects/:id/timeseries', ...guard, async (req, res) => {
  const { propertyName, value, unit, timestamp } = req.body
  if (!propertyName || typeof value !== 'number') return res.status(400).json({ error: 'propertyName and numeric value are required' })
  try {
    const point = await OntologyTimeSeriesService.append(req.params.id, propertyName, value, unit, timestamp ? new Date(timestamp) : undefined)
    res.status(201).json({ point })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.get('/objects/:id/timeseries', ...guard, async (req, res) => {
  const { propertyName, from, to, resolution } = req.query as Record<string, string>
  try {
    const series = await OntologyTimeSeriesService.query(req.params.id, {
      propertyName: propertyName || undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      resolution: (resolution as any) || 'raw',
    })
    res.json({ series })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── Pipelines — S305 ────────────────────────────────────────────────────────

router.get('/pipelines', ...guard, async (_req, res) => {
  try {
    const pipelines = await prisma.ontologyPipeline.findMany({
      include: { targetType: { select: { name: true, displayName: true, icon: true, color: true } } },
      orderBy: { createdAt: 'asc' },
    })
    res.json({ pipelines })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/pipelines/seed', ...guard, async (_req, res) => {
  try {
    const results = await OntologyPipelineService.seedBuiltins()
    res.json({ results })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/pipelines', ...guard, async (req, res) => {
  const { name, sourceType, sourceQuery, targetTypeId, fieldMapping, schedule } = req.body
  try {
    const pipeline = await prisma.ontologyPipeline.create({
      data: { name, sourceType, sourceQuery: sourceQuery ?? {}, targetTypeId, fieldMapping: fieldMapping ?? {}, schedule: schedule ?? 'ON_CHANGE' },
    })
    res.status(201).json({ pipeline })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/pipelines/:id', ...guard, async (req, res) => {
  const { name, fieldMapping, schedule, enabled } = req.body
  try {
    const pipeline = await prisma.ontologyPipeline.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(fieldMapping !== undefined && { fieldMapping }),
        ...(schedule !== undefined && { schedule }),
        ...(enabled !== undefined && { enabled }),
      },
    })
    res.json({ pipeline })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/pipelines/:id', ...guard, async (req, res) => {
  try {
    await prisma.ontologyPipeline.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/pipelines/:id/run', ...guard, async (req, res) => {
  try {
    const result = await OntologyPipelineService.run(req.params.id)
    res.json(result)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/pipelines/run-all', ...guard, async (_req, res) => {
  try {
    const results = await OntologyPipelineService.runAll()
    res.json({ results })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── Migration Accelerator — Overshadow Roadmap P7.2 ───────────────────────────
// A one-shot CSV → OntologyObject importer, marketed for "read a ServiceNow
// CMDB export, populate the ontology" but generically CSV-shaped. See
// services/ontologyCsvImport.service.ts header.

router.post('/csv-import/preview', ...guard, async (req, res) => {
  try {
    const { text } = req.body ?? {}
    if (!text || typeof text !== 'string') return res.status(400).json({ error: 'text is required' })
    res.json(await previewCsv(text))
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/csv-import/run', ...guard, async (req, res) => {
  try {
    const { text, typeId, columnMapping, externalIdColumn, objectSetName, fileName } = req.body ?? {}
    if (!text || typeof text !== 'string') return res.status(400).json({ error: 'text is required' })
    if (!typeId) return res.status(400).json({ error: 'typeId is required' })
    if (!columnMapping || typeof columnMapping !== 'object' || Object.keys(columnMapping).length === 0) {
      return res.status(400).json({ error: 'columnMapping (ontologyField -> csvColumn) is required' })
    }
    const result = await runCsvImport({
      text, typeId, columnMapping, externalIdColumn, objectSetName, fileName,
      importedBy: (req as any).user?.id,
    })
    res.status(201).json(result)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.get('/csv-import/batches', ...guard, async (_req, res) => {
  try {
    res.json({ batches: await listImportBatches() })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── Actions ──────────────────────────────────────────────────────────────────

router.get('/actions', ...guard, async (req, res) => {
  const { typeId } = req.query as Record<string, string>
  try {
    const actions = await prisma.ontologyAction.findMany({
      where: typeId ? { typeId } : undefined,
      include: {
        type: { select: { name: true, displayName: true, icon: true, color: true } },
        _count: { select: { validationRules: true, effects: true, executionLog: true } },
      },
      orderBy: { executions: 'desc' },
    })
    res.json({ actions })
  } catch {
    res.status(500).json({ error: 'Failed to fetch actions' })
  }
})

// NOTE: literal /actions/executions* routes must be registered before the
// generic /actions/:id route below — Express matches by segment count, so
// GET /actions/:id would otherwise shadow GET /actions/executions.
router.get('/actions/executions', ...guard, async (req, res) => {
  const { actionId, objectId, actorType, status, from, to, page = '1', limit = '20' } = req.query as Record<string, string>
  const skip = (parseInt(page) - 1) * parseInt(limit)
  const where: any = {}
  if (actionId) where.actionId = actionId
  if (objectId) where.objectId = objectId
  if (actorType) where.actorType = actorType
  if (status) where.status = status
  if (from || to) where.createdAt = { ...(from && { gte: new Date(from) }), ...(to && { lte: new Date(to) }) }
  try {
    const [executions, total] = await Promise.all([
      prisma.actionExecution.findMany({
        where,
        include: {
          action: { select: { name: true, displayName: true } },
          object: { select: { id: true, externalId: true, type: { select: { displayName: true, icon: true, color: true } } } },
        },
        skip, take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.actionExecution.count({ where }),
    ])
    res.json({ executions, total, pages: Math.ceil(total / parseInt(limit)) })
  } catch {
    res.status(500).json({ error: 'Failed to fetch executions' })
  }
})

router.get('/actions/executions/metrics', ...guard, async (req, res) => {
  try {
    const [total, succeeded, byActor, byAction, avgDuration] = await Promise.all([
      prisma.actionExecution.count(),
      prisma.actionExecution.count({ where: { status: 'SUCCESS' } }),
      prisma.actionExecution.groupBy({ by: ['actorType'], _count: { _all: true } }),
      prisma.actionExecution.groupBy({ by: ['actionId'], _count: { _all: true }, orderBy: { _count: { actionId: 'desc' } }, take: 5 }),
      prisma.actionExecution.aggregate({ _avg: { durationMs: true } }),
    ])
    const actionIds = byAction.map(a => a.actionId)
    const actionNames = actionIds.length
      ? await prisma.ontologyAction.findMany({ where: { id: { in: actionIds } }, select: { id: true, displayName: true } })
      : []
    const nameById = new Map(actionNames.map(a => [a.id, a.displayName]))
    res.json({
      total,
      successRate: total > 0 ? succeeded / total : 0,
      avgDurationMs: avgDuration._avg.durationMs ?? 0,
      byActor: byActor.map(a => ({ actorType: a.actorType, count: a._count._all })),
      mostExecuted: byAction.map(a => ({ actionId: a.actionId, displayName: nameById.get(a.actionId) ?? 'Unknown', count: a._count._all })),
    })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/actions/executions/:id', ...guard, async (req, res) => {
  try {
    const execution = await prisma.actionExecution.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        action: true,
        object: { include: { type: { select: { displayName: true, icon: true, color: true } } } },
      },
    })
    res.json({ execution })
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
})

// S313 — must precede /actions/:id or "tool-schemas" gets swallowed as an id
router.get('/actions/tool-schemas', ...guard, async (_req, res) => {
  try {
    const tools = await OntologyToolSchema.generateToolSchemas()
    res.json({ tools })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── P4 — Enterprise Action Library ──────────────────────────────────────────
// GET  /actions/library        — full library grouped by category with live stats
// POST /actions/library/seed   — (re)seed the 37-action library (idempotent)
// Both must precede /actions/:id to avoid the wildcard route swallowing them.

router.get('/actions/library', ...guard, async (_req, res) => {
  try {
    const types = await prisma.ontologyObjectType.findMany({
      where: { name: { in: ACTION_LIBRARY.map(c => c.name) } },
      include: {
        actions: {
          include: {
            _count: { select: { validationRules: true, effects: true, executionLog: true } },
          },
          orderBy: { name: 'asc' },
        },
      },
    })

    const categoryOrder = ACTION_LIBRARY.map(c => c.name)
    const sorted = [...types].sort((a, b) => categoryOrder.indexOf(a.name) - categoryOrder.indexOf(b.name))

    const categories = sorted.map(t => ({
      name: t.name,
      displayName: t.displayName,
      icon: t.icon,
      color: t.color,
      description: t.description,
      count: t.actions.length,
      totalExecutions: t.actions.reduce((s, a) => s + a.executions, 0),
      toolCallableCount: t.actions.filter((a: any) => a.toolCallable).length,
      actions: t.actions.map(a => ({
        id: a.id,
        name: a.name,
        displayName: a.displayName,
        description: a.description,
        parameters: a.parameters,
        allowedRoles: a.allowedRoles,
        toolCallable: a.toolCallable,
        executions: a.executions,
        validationRuleCount: (a._count as any).validationRules,
        effectCount: (a._count as any).effects,
      })),
    }))

    const totalActions    = categories.reduce((s, c) => s + c.count, 0)
    const totalExecutions = categories.reduce((s, c) => s + c.totalExecutions, 0)
    const toolCallable    = categories.reduce((s, c) => s + c.toolCallableCount, 0)

    res.json({ categories, totalActions, totalExecutions, toolCallable })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/actions/library/seed', ...guard, async (_req, res) => {
  try {
    const result = await seedEnterpriseActions()
    res.json({ ok: true, ...result })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// POST /actions/blast-radius-policies — seed REQUIRE_APPROVAL policies for high-blast actions
router.post('/actions/blast-radius-policies', ...guard, async (_req, res) => {
  try {
    const result = await seedBlastRadiusPolicies()
    res.json({ ok: true, ...result })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// POST /actions/packs/install — install an action pack from a JSON manifest
// GET  /actions/packs         — list installed packs
// GET  /actions/packs/example — return the built-in ITSM example pack manifest
router.get('/actions/packs/example', ...guard, (_req, res) => res.json(ITSM_PACK))

router.get('/actions/packs', ...guard, async (_req, res) => {
  try {
    res.json(await listInstalledPacks())
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/actions/packs/install', ...guard, async (req, res) => {
  try {
    const manifest = req.body
    if (!manifest?.pack || !manifest?.category || !manifest?.actions) {
      return res.status(400).json({ error: 'Invalid manifest: pack, category, and actions are required' })
    }
    const result = await installActionPack(manifest)
    res.json({ ok: true, ...result })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// GET /actions/connectors — connector health + capability map
router.get('/actions/connectors', ...guard, async (_req, res) => {
  try {
    const health = connectorHealth()
    const connectors = listConnectors()
    const configured = Object.values(health).filter(c => c.configured).length
    res.json({ health, connectors, configured, total: Object.keys(health).length })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/actions/:id', ...guard, async (req, res) => {
  try {
    const action = await prisma.ontologyAction.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        type: { select: { name: true, displayName: true, icon: true, color: true } },
        validationRules: { orderBy: { order: 'asc' } },
        effects: { orderBy: { order: 'asc' } },
      },
    })
    res.json({ action })
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
})

router.post('/actions', ...guard, async (req, res) => {
  const { typeId, name, displayName, description, parameters, allowedRoles } = req.body
  try {
    const action = await prisma.ontologyAction.create({
      data: {
        typeId, name, displayName, description,
        parameters: parameters ?? [],
        allowedRoles: allowedRoles ?? ['ADMIN'],
      },
    })
    res.json({ action })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/actions/:id', ...guard, async (req, res) => {
  const { displayName, description, parameters, allowedRoles, toolCallable } = req.body
  try {
    const action = await prisma.ontologyAction.update({
      where: { id: req.params.id },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(description !== undefined && { description }),
        ...(parameters !== undefined && { parameters }),
        ...(allowedRoles !== undefined && { allowedRoles }),
        ...(toolCallable !== undefined && { toolCallable }),
      },
    })
    res.json({ action })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/actions/:id', ...guard, async (req, res) => {
  try {
    await prisma.ontologyAction.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

// ── Validation rules — S295 ───────────────────────────────────────────────────

router.post('/actions/:id/validation-rules', ...guard, async (req, res) => {
  const { condition, errorMessage, severity, order } = req.body
  try {
    const rule = await prisma.actionValidationRule.create({
      data: {
        actionId: req.params.id, condition: condition ?? {},
        errorMessage, severity: severity ?? 'BLOCK', order: order ?? 0,
      },
    })
    res.json({ rule })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/actions/validation-rules/:ruleId', ...guard, async (req, res) => {
  const { condition, errorMessage, severity, order } = req.body
  try {
    const rule = await prisma.actionValidationRule.update({
      where: { id: req.params.ruleId },
      data: {
        ...(condition !== undefined && { condition }),
        ...(errorMessage !== undefined && { errorMessage }),
        ...(severity !== undefined && { severity }),
        ...(order !== undefined && { order }),
      },
    })
    res.json({ rule })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/actions/validation-rules/:ruleId', ...guard, async (req, res) => {
  try {
    await prisma.actionValidationRule.delete({ where: { id: req.params.ruleId } })
    res.json({ success: true })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

// ── Effects — S296 ─────────────────────────────────────────────────────────────

router.post('/actions/:id/effects', ...guard, async (req, res) => {
  const { effectType, configuration, order } = req.body
  try {
    const effect = await prisma.actionEffect.create({
      data: { actionId: req.params.id, effectType, configuration: configuration ?? {}, order: order ?? 0 },
    })
    res.json({ effect })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/actions/effects/:effectId', ...guard, async (req, res) => {
  const { effectType, configuration, order } = req.body
  try {
    const effect = await prisma.actionEffect.update({
      where: { id: req.params.effectId },
      data: {
        ...(effectType !== undefined && { effectType }),
        ...(configuration !== undefined && { configuration }),
        ...(order !== undefined && { order }),
      },
    })
    res.json({ effect })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/actions/effects/:effectId', ...guard, async (req, res) => {
  try {
    await prisma.actionEffect.delete({ where: { id: req.params.effectId } })
    res.json({ success: true })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

// ── Execution — S296/S297 ───────────────────────────────────────────────────────

router.post('/actions/:id/validate', ...guard, async (req, res) => {
  const { params, objectId, actorType, actorId } = req.body
  try {
    const result = await ActionEngine.preflight(req.params.id, params ?? {}, objectId, actorType ?? 'HUMAN', actorId)
    res.json(result)
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
})

router.post('/actions/seed-system', ...guard, async (req, res) => {
  try {
    const results = await ActionEngine.seedSystemActions()
    res.json({ results })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ── S299 — Human-in-the-loop ────────────────────────────────────────────────

router.get('/pending-approvals', ...guard, async (req, res) => {
  const { status = 'PENDING', page = '1', limit = '20' } = req.query as Record<string, string>
  const skip = (parseInt(page) - 1) * parseInt(limit)
  try {
    const where = status === 'ALL' ? {} : { status }
    const [items, total] = await Promise.all([
      prisma.pendingApproval.findMany({
        where,
        include: {
          action: { select: { name: true, displayName: true } },
          object: { select: { id: true, externalId: true, type: { select: { displayName: true, icon: true, color: true } } } },
        },
        skip, take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.pendingApproval.count({ where }),
    ])
    res.json({ items, total, pages: Math.ceil(total / parseInt(limit)) })
  } catch {
    res.status(500).json({ error: 'Failed to fetch pending approvals' })
  }
})

router.post('/pending-approvals/:id/approve', ...guard, async (req, res) => {
  try {
    const execution = await ActionEngine.resolvePendingApproval(req.params.id, 'APPROVE', (req as any).user?.id ?? 'admin')
    res.json({ execution })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/pending-approvals/:id/reject', ...guard, async (req, res) => {
  try {
    const execution = await ActionEngine.resolvePendingApproval(req.params.id, 'REJECT', (req as any).user?.id ?? 'admin')
    res.json({ execution })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/actions/:id/execute', ...guard, async (req, res) => {
  const { params, objectId, actorType, confidence } = req.body
  try {
    const execution = await ActionEngine.execute({
      actionId: req.params.id,
      params: params ?? {},
      objectId: objectId ?? null,
      actorId: (req as any).user?.id,
      actorType: actorType ?? 'HUMAN',
      confidence,
    })
    await prisma.auditLog.create({
      data: {
        userId: (req as any).user?.id,
        action: `ONTOLOGY_ACTION:${execution.status}`,
        resource: `ontology_actions/${req.params.id}`,
        newValue: { executionId: execution.id, params } as any,
      },
    }).catch(() => {})
    res.json({ execution })
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
})

// ─── Object Sets — S293 ─────────────────────────────────────────────────────
// Saved, named, composable queries over OntologyObjects. Referenced from KIMMP
// context, canvas seeding, dashboards, and the SDK.

router.get('/object-sets', ...guard, async (req, res) => {
  const { tag, isPublic, search } = req.query as Record<string, string>
  const where: any = {}
  if (tag) where.tags = { has: tag }
  if (isPublic !== undefined) where.isPublic = isPublic === 'true'
  if (search) where.OR = [
    { name: { contains: search, mode: 'insensitive' } },
    { description: { contains: search, mode: 'insensitive' } },
  ]
  try {
    const sets = await prisma.objectSet.findMany({
      where,
      include: { rootType: { select: { name: true, displayName: true, icon: true, color: true } } },
      orderBy: [{ isSystem: 'desc' }, { updatedAt: 'desc' }],
    })
    res.json({ sets })
  } catch {
    res.status(500).json({ error: 'Failed to fetch object sets' })
  }
})

router.get('/object-sets/:id', ...guard, async (req, res) => {
  try {
    const set = await prisma.objectSet.findUniqueOrThrow({
      where: { id: req.params.id },
      include: { rootType: true },
    })
    const members = await prisma.objectSetMembership.findMany({
      where: { objectSetId: set.id },
      include: { object: { include: { type: { select: { name: true, displayName: true, icon: true, color: true } } } } },
      orderBy: { addedAt: 'desc' },
      take: 200,
    })
    res.json({ set, objects: members.map(m => m.object) })
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
})

router.post('/object-sets', ...guard, async (req, res) => {
  const { name, description, rootTypeId, query, tags, isPublic } = req.body
  try {
    const set = await prisma.objectSet.create({
      data: {
        name, description, rootTypeId: rootTypeId || null,
        query: query ?? {}, tags: tags ?? [], isPublic: !!isPublic,
        createdBy: (req as any).user?.id,
      },
    })
    const { count } = await ObjectSetService.execute(set.id)
    res.json({ set: { ...set, lastCount: count } })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/object-sets/:id', ...guard, async (req, res) => {
  const { name, description, query, tags, isPublic } = req.body
  try {
    const set = await prisma.objectSet.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(query !== undefined && { query }),
        ...(tags !== undefined && { tags }),
        ...(isPublic !== undefined && { isPublic }),
      },
    })
    res.json({ set })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/object-sets/:id', ...guard, async (req, res) => {
  try {
    await prisma.objectSet.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/object-sets/preview', ...guard, async (req, res) => {
  try {
    const { objects, count } = await ObjectSetService.preview(req.body.query)
    res.json({ objects: objects.slice(0, 50), count })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/object-sets/:id/execute', ...guard, async (req, res) => {
  try {
    const { objects, count } = await ObjectSetService.execute(req.params.id)
    try { getIO().to(`objectset:${req.params.id}`).emit('objectset:update', { objectSetId: req.params.id, count }) } catch {}
    res.json({ objects, count })
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
})

router.post('/object-sets/:id/subscribe', ...guard, async (req, res) => {
  try {
    const set = await prisma.objectSet.findUniqueOrThrow({ where: { id: req.params.id } })
    res.json({ room: `objectset:${set.id}`, socketEvent: 'objectset:update', lastCount: set.lastCount, lastRunAt: set.lastRunAt })
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
})

router.post('/object-sets/seed', ...guard, async (req, res) => {
  try {
    const results = await ObjectSetService.seedSystemSets()
    res.json({ results })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
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

    const sourceType = (src.type as any).name
    const targetType = (tgt.type as any).name

    const result = await OntologyGateway.upsertRelationship(
      actorFrom(req),
      { sourceId, targetId, sourceType, targetType, relationshipType },
      {
        create: {
          sourceId, targetId, relationshipType, sourceType, targetType,
          label: label ?? null, strength: strength ?? 1.0, confidence: confidence ?? 1.0,
          inferredBy: 'USER', reason: reason ?? null,
        },
        update: {
          label: label ?? undefined, strength: strength ?? undefined,
          confidence: confidence ?? undefined, validTo: null, reason: reason ?? undefined,
        },
      },
    )
    if (result.status !== 'OK') {
      const code = result.status === 'CARDINALITY_VIOLATION' ? 409 : result.status === 'PENDING_APPROVAL' ? 202 : 403
      return res.status(code).json(
        result.status === 'PENDING_APPROVAL'
          ? { status: 'PENDING_APPROVAL', pendingId: result.pendingId, reason: result.reason }
          : { error: result.reason },
      )
    }
    res.status(201).json({ relationship: result.data })
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

// ─── Generated SDK — S306 ───────────────────────────────────────────────────

router.get('/sdk/schema', ...guard, async (_req, res) => {
  try {
    const shapes = await OntologySdkGenerator.schema()
    res.json(shapes)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/sdk/typescript', ...guard, async (_req, res) => {
  try {
    await OntologySdkGenerator.recordVersionIfChanged()
    const sdk = await OntologySdkGenerator.typescript()
    res.setHeader('Content-Disposition', 'attachment; filename="kangqore-ontology-sdk.ts"')
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.send(sdk)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/sdk/python', ...guard, async (_req, res) => {
  try {
    await OntologySdkGenerator.recordVersionIfChanged()
    const sdk = await OntologySdkGenerator.python()
    res.setHeader('Content-Disposition', 'attachment; filename="kangqore_ontology.py"')
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.send(sdk)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/sdk/changelog', ...guard, async (_req, res) => {
  try {
    const versions = await OntologySdkGenerator.changelog()
    res.json({ versions })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── Webhook Subscriptions — S307 ───────────────────────────────────────────

router.get('/subscriptions', ...guard, async (_req, res) => {
  try {
    const subscriptions = await prisma.ontologySubscription.findMany({
      include: { objectType: { select: { name: true, displayName: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ subscriptions: subscriptions.map(s => ({ ...s, secret: s.secret.slice(0, 6) + '••••••••' })) })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/subscriptions', ...guard, async (req, res) => {
  const { name, url, objectTypeId, eventTypes } = req.body
  try {
    if (!name?.trim() || !url?.trim()) { res.status(400).json({ error: 'name and url are required' }); return }
    const subscription = await prisma.ontologySubscription.create({
      data: {
        name: name.trim(),
        url: url.trim(),
        secret: `whsec_${crypto.randomBytes(24).toString('hex')}`,
        objectTypeId: objectTypeId || null,
        eventTypes: eventTypes ?? ['object.created', 'object.updated'],
        createdBy: (req as any).user?.id,
      },
    })
    res.status(201).json({ subscription })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/subscriptions/:id', ...guard, async (req, res) => {
  const { name, url, eventTypes, enabled } = req.body
  try {
    const subscription = await prisma.ontologySubscription.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(url !== undefined && { url }),
        ...(eventTypes !== undefined && { eventTypes }),
        ...(enabled !== undefined && { enabled }),
      },
    })
    res.json({ subscription })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/subscriptions/:id', ...guard, async (req, res) => {
  try {
    await prisma.ontologySubscription.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/subscriptions/:id/test', ...guard, async (req, res) => {
  try {
    const subscription = await OntologyWebhookSubscriptionService.test(req.params.id)
    res.json({ subscription })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

// ─── Cardinality Rules — Phase 1 Governance ───────────────────────────────────

router.get('/cardinality-rules', ...guard, async (_req, res) => {
  try { res.json({ rules: await CardinalityEngine.listRules() }) }
  catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.post('/cardinality-rules', ...guard, async (req, res) => {
  const { sourceType, targetType, relationshipType, cardinality } = req.body
  if (!sourceType || !targetType || !relationshipType || !cardinality) {
    return res.status(400).json({ error: 'sourceType, targetType, relationshipType, cardinality required' })
  }
  const valid = ['ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_ONE', 'MANY_TO_MANY']
  if (!valid.includes(cardinality)) return res.status(400).json({ error: `cardinality must be one of: ${valid.join(', ')}` })
  try { res.status(201).json({ rule: await CardinalityEngine.createRule(sourceType, targetType, relationshipType, cardinality) }) }
  catch (e: any) { res.status(400).json({ error: e.message }) }
})

router.delete('/cardinality-rules/:id', ...guard, async (req, res) => {
  try { res.json({ ok: true, deleted: await CardinalityEngine.deleteRule(req.params.id) }) }
  catch (e: any) { res.status(404).json({ error: e.message }) }
})

// ─── User clearance management ─────────────────────────────────────────────────

router.get('/users/:userId/clearances', ...guard, async (req, res) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.params.userId }, select: { id: true, name: true, email: true, clearances: true } })
    res.json({ user })
  } catch (e: any) { res.status(404).json({ error: e.message }) }
})

router.put('/users/:userId/clearances', ...guard, async (req, res) => {
  const { clearances } = req.body
  if (!Array.isArray(clearances)) return res.status(400).json({ error: 'clearances must be an array of strings' })
  try {
    const user = await prisma.user.update({ where: { id: req.params.userId }, data: { clearances }, select: { id: true, name: true, email: true, clearances: true } })
    res.json({ user })
  } catch (e: any) { res.status(400).json({ error: e.message }) }
})

export default router

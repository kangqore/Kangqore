import { Router } from 'express'
import { prisma } from '../../lib/prisma'
import { authenticate, authorize } from '../../middleware/auth'
import { ActionEngine } from './ActionEngine'
import { seedEnterpriseActions, ACTION_LIBRARY } from './ActionLibrary.seed'
import { connectorHealth, listConnectors } from './connectors/registry'
import { seedBlastRadiusPolicies } from '../esf/PolicyEngine'
import { installActionPack, listInstalledPacks, ITSM_PACK } from './ActionPack'
import { installAllPacks } from './PackAutoInstaller'
import { OntologyToolSchema } from './OntologyToolSchema'

const router = Router()
const guard = [authenticate, authorize(['ADMIN'])] as const

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

router.get('/actions/executions/metrics', ...guard, async (_req, res) => {
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

router.post('/actions/packs/install-all', ...guard, async (_req, res) => {
  try {
    await installAllPacks()
    const installed = await listInstalledPacks()
    res.json({ ok: true, packs: installed.length, installed })
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

router.post('/actions/seed-system', ...guard, async (_req, res) => {
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

export default router

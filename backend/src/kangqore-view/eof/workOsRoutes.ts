// Work OS API — the door onto the chain.
//
//   boards        Work
//   inference     Intelligence
//   assessment    Decision
//   recovery      Governed Action → Outcome
//
// Mounted via routes/work-os.routes.ts so index.ts never reaches into
// kangqore-view directly.

import { Router, Request, Response } from 'express'
import { authenticate, authorize } from '../../middleware/auth'
import { BoardService } from './BoardService'
import { IntelligenceEngine } from './IntelligenceEngine'
import { DecisionEngine } from './DecisionEngine'
import { RecoveryPlanService } from './RecoveryPlanService'
import { EnterpriseProjection } from './EnterpriseProjection'
import { ModelIntrospection } from './ModelIntrospection'
import { IntentCompiler } from './IntentCompiler'
import { ObjectQueryCompiler } from './ObjectQueryCompiler'
import { WorkTemplateEngine } from './WorkTemplateEngine'
import { AgentMissionEngine } from '../kimmp/agents/AgentMissionEngine'
import { ENTERPRISE_OBJECTS } from './EnterpriseObjectModel'
import { prisma } from '../../lib/prisma'
import type { GatewayActor } from './OntologyGateway'

const router = Router()
const guard = [authenticate, authorize(['ADMIN'])]

/** The gateway identity a signed-in operator acts under. */
const actorOf = (req: Request): GatewayActor => ({
  id: (req as any).user?.id ?? 'unknown',
  type: 'HUMAN',
  // Clearances are not yet modelled per user; operators see unmarked data only.
  clearances: [],
})
const fail = (res: Response, e: any, s = 400) => res.status(s).json({ error: e?.message ?? String(e) })

// ── Object model ─────────────────────────────────────────────────────────────

router.get('/types', ...guard, async (_req, res) => {
  const types = await prisma.ontologyObjectType.findMany({
    where: { name: { in: ENTERPRISE_OBJECTS.map(o => o.name) } },
    select: { name: true, displayName: true, icon: true, color: true, description: true,
              schema: true, _count: { select: { instances: true } } },
    orderBy: { displayName: 'asc' },
  })
  res.json({
    types: types.map(t => ({
      name: t.name, displayName: t.displayName, icon: t.icon, color: t.color,
      description: t.description,
      instances: t._count.instances,
      columnCount: Object.keys((t.schema ?? {}) as object).length,
    })),
  })
})

/** Re-mirror real Projects and CRM rows into the enterprise model. */
router.post('/projection/run', ...guard, async (_req, res) => {
  try {
    res.json(await EnterpriseProjection.run())
  } catch (e) { fail(res, e) }
})

// ── Model introspection (what the intelligence layer can see) ────────────────

router.get('/model', ...guard, async (_req, res) => {
  res.json({
    types: ModelIntrospection.catalogue(),
    executionChain: ModelIntrospection.executionChain().map(t => ({ tier: t.tier, name: t.name })),
  })
})

/** How does one type reach another? The basis for cross-tier reasoning. */
router.get('/model/path', ...guard, async (req, res) => {
  const { from, to } = req.query as Record<string, string>
  if (!from || !to) return res.status(400).json({ error: 'from and to are required' })
  const path = ModelIntrospection.pathBetween(from, to)
  return res.json({
    from, to,
    connected: path !== null,
    hops: path?.length ?? null,
    path: path ?? [],
  })
})

/**
 * "Show me all high-risk projects" → a real, executed query.
 * Compilation is deterministic and grounded in the model's own vocabulary, so
 * an unparseable request fails loudly instead of quietly selecting the wrong
 * rows.
 */
router.post('/views/compile', ...guard, async (req, res) => {
  const { text, execute } = req.body ?? {}
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' })
  }
  const intent = await IntentCompiler.compileBound(text)
  if (!intent.ok) return res.status(422).json(intent)

  if (!execute) return res.json(intent)
  try {
    const result = await ObjectQueryCompiler.run(intent.query, actorOf(req))
    return res.json({ ...intent, result })
  } catch (e) { return fail(res, e) }
})

// ── Templates (the path from nothing to real work) ───────────────────────────

router.get('/templates', ...guard, async (req, res) => {
  res.json({ templates: await WorkTemplateEngine.list(req.query.category as string | undefined) })
})

/** Materialise a template: real objects, real edges, optionally a board. */
router.post('/templates/:key/apply', ...guard, async (req, res) => {
  const { values, startDate, createBoard } = req.body ?? {}
  try {
    const result = await WorkTemplateEngine.apply({
      templateKey: req.params.key,
      actorId: (req as any).user?.id ?? 'unknown',
      values,
      startDate: startDate ? new Date(startDate) : undefined,
      createBoard: createBoard !== false,
    }, actorOf(req))
    return res.status(result.status === 'FAILED' ? 422 : 201).json(result)
  } catch (e) { return fail(res, e) }
})

router.get('/templates/runs/:runId', ...guard, async (req, res) => {
  const run = await WorkTemplateEngine.run(req.params.runId)
  if (!run) return res.status(404).json({ error: 'No such template run' })
  return res.json({ run })
})

/** Remove what a run created, keeping anything since edited. */
router.post('/templates/runs/:runId/undo', ...guard, async (req, res) => {
  try {
    res.json(await WorkTemplateEngine.undo(req.params.runId, actorOf(req)))
  } catch (e) { fail(res, e) }
})

// ── Boards (Work) ────────────────────────────────────────────────────────────

router.get('/boards', ...guard, async (req, res) => {
  res.json({ boards: await BoardService.listBoards((req as any).user?.id) })
})

router.post('/boards', ...guard, async (req, res) => {
  try {
    res.status(201).json(await BoardService.createBoard({ ...req.body, ownerId: (req as any).user?.id }))
  } catch (e) { fail(res, e) }
})

router.get('/boards/:id', ...guard, async (req, res) => {
  try {
    res.json(await BoardService.resolve(req.params.id, actorOf(req), {
      limit: Number(req.query.limit) || 200,
      offset: Number(req.query.offset) || 0,
    }))
  } catch (e) { fail(res, e, 404) }
})

router.post('/boards/:id/move', ...guard, async (req, res) => {
  const { objectId, toGroup, index } = req.body ?? {}
  if (!objectId || !toGroup) return res.status(400).json({ error: 'objectId and toGroup are required' })
  try {
    const r = await BoardService.moveItem(req.params.id, objectId, toGroup, actorOf(req), index)
    return res.status(r.status === 'OK' ? 200 : 403).json(r)
  } catch (e) { return fail(res, e) }
})

// ── Intelligence ─────────────────────────────────────────────────────────────

router.get('/intelligence/:objectId', ...guard, async (req, res) => {
  const inf = await IntelligenceEngine.infer(req.params.objectId)
  if (!inf) return res.status(404).json({ error: 'Object not found' })
  return res.json(inf)
})

router.post('/intelligence/infer/:typeName', ...guard, async (req, res) => {
  try {
    res.json(await IntelligenceEngine.inferAndWrite(req.params.typeName))
  } catch (e) { fail(res, e) }
})

// ── Decision ─────────────────────────────────────────────────────────────────

router.get('/assessment', ...guard, async (req, res) => {
  const { targetId, typeName } = req.query as Record<string, string>
  if (!targetId && !typeName) return res.status(400).json({ error: 'targetId or typeName is required' })
  try {
    const a = await DecisionEngine.assess({ targetId, typeName })
    return res.json({ ...a, formatted: DecisionEngine.format(a) })
  } catch (e) { return fail(res, e) }
})

/** Candidate targets for an assessment — goals and outcomes. */
router.get('/assessment/targets', ...guard, async (_req, res) => {
  const types = await prisma.ontologyObjectType.findMany({
    where: { name: { in: ['EnterpriseGoal', 'Outcome', 'StrategicObjective'] } },
    select: { id: true, name: true },
  })
  const objects = await prisma.ontologyObject.findMany({
    where: { typeId: { in: types.map(t => t.id) }, validTo: null },
    include: { type: { select: { name: true } } },
    take: 50,
  })
  res.json({
    targets: objects.map(o => ({
      id: o.id,
      title: String((o.properties as any)?.title ?? o.id),
      typeName: o.type.name,
    })),
  })
})

// ── Governed action (Decision → mission → approval → execute) ────────────────

/** Stage a recovery plan. Changes nothing; parks it for approval. */
router.post('/recovery/propose', ...guard, async (req, res) => {
  const { targetId, typeName } = req.body ?? {}
  if (!targetId && !typeName) return res.status(400).json({ error: 'targetId or typeName is required' })
  try {
    res.status(201).json(await RecoveryPlanService.propose({
      targetId, typeName, actorId: (req as any).user?.id,
    }))
  } catch (e) { fail(res, e) }
})

/** The "Execute recovery plan?" decision. */
router.post('/recovery/:missionId/approve', ...guard, async (req, res) => {
  try {
    res.json(await AgentMissionEngine.decide(req.params.missionId, true, (req as any).user?.id))
  } catch (e) { fail(res, e) }
})

router.post('/recovery/:missionId/reject', ...guard, async (req, res) => {
  try {
    res.json(await AgentMissionEngine.decide(req.params.missionId, false, (req as any).user?.id))
  } catch (e) { fail(res, e) }
})

/** Execute — refuses unless the mission is APPROVED. */
router.post('/recovery/:missionId/execute', ...guard, async (req, res) => {
  try {
    res.json(await AgentMissionEngine.execute(req.params.missionId, (req as any).user?.id))
  } catch (e) { fail(res, e) }
})

/** Outcome — did the action actually reduce risk? */
router.get('/recovery/:missionId/verify', ...guard, async (req, res) => {
  try {
    res.json(await RecoveryPlanService.verify(req.params.missionId))
  } catch (e) { fail(res, e) }
})

router.get('/recovery/:missionId', ...guard, async (req, res) => {
  const m = await AgentMissionEngine.get(req.params.missionId)
  if (!m) return res.status(404).json({ error: 'Mission not found' })
  return res.json({ mission: m })
})

export default router

/**
 * @openapi
 * tags:
 *   - name: v1/OIS
 *     description: Operational Intelligence Score — read and snapshot
 *   - name: v1/Signals
 *     description: KIMMP signals — list and ingest
 *   - name: v1/Decisions
 *     description: Strategic decisions — list, create, and resolve
 *   - name: v1/Blueprints
 *     description: Enterprise deployment blueprints — list and create
 */
import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import crypto from 'crypto'

export const v1Router = Router()

// ── Helpers ──────────────────────────────────────────────────────────────────
function userId(req: Request): string | undefined {
  return (req as any).user?.userId ?? (req as any).user?.id
}

function paginate(query: Record<string, any>): { skip: number; take: number } {
  const page  = Math.max(1, parseInt(String(query.page  ?? 1),  10))
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? 20), 10)))
  return { skip: (page - 1) * limit, take: limit }
}

// ═══════════════════════════════════════════════════════════════════════════════
// OIS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @openapi
 * /v1/ois:
 *   get:
 *     tags: [v1/OIS]
 *     summary: Get the latest OIS snapshot
 *     description: Returns the most recent Gate 8 Operational Intelligence Score and per-pillar breakdown.
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 1, maximum: 50 }
 *         description: Number of snapshots to return (default 1 = latest only)
 *       - in: query
 *         name: label
 *         schema: { type: string, enum: [AUTO, BASELINE, CHECKPOINT] }
 *         description: Filter by snapshot label
 *     responses:
 *       200:
 *         description: OIS snapshot(s)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:             { type: string }
 *                       oisScore:       { type: number }
 *                       decisionScore:  { type: number }
 *                       workflowScore:  { type: number }
 *                       aiScore:        { type: number }
 *                       enterpriseScore:{ type: number }
 *                       goalScore:      { type: number }
 *                       learningScore:  { type: number }
 *                       businessScore:  { type: number }
 *                       trustScore:     { type: number }
 *                       adoptionScore:  { type: number }
 *                       label:          { type: string }
 *                       triggeredBy:    { type: string }
 *                       createdAt:      { type: string, format: date-time }
 */
v1Router.get('/ois', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit ?? 1), 10)))
    const where: any = {}
    if (req.query.label) where.label = String(req.query.label)

    const data = await (prisma as any).gate8Snapshot.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take:    limit,
      select:  {
        id: true, oisScore: true, decisionScore: true, workflowScore: true,
        aiScore: true, enterpriseScore: true, goalScore: true, learningScore: true,
        businessScore: true, trustScore: true, adoptionScore: true,
        label: true, triggeredBy: true, createdAt: true,
      },
    })

    res.json({ data, count: data.length })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

/**
 * @openapi
 * /v1/ois/snapshot:
 *   post:
 *     tags: [v1/OIS]
 *     summary: Trigger a new OIS snapshot
 *     description: Records a new Gate 8 snapshot with the provided pillar scores. Use this to push OIS data from external sources.
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oisScore]
 *             properties:
 *               oisScore:        { type: number, minimum: 0, maximum: 100, description: Overall OIS (0–100) }
 *               decisionScore:   { type: number, minimum: 0, maximum: 100 }
 *               workflowScore:   { type: number, minimum: 0, maximum: 100 }
 *               aiScore:         { type: number, minimum: 0, maximum: 100 }
 *               enterpriseScore: { type: number, minimum: 0, maximum: 100 }
 *               goalScore:       { type: number, minimum: 0, maximum: 100 }
 *               learningScore:   { type: number, minimum: 0, maximum: 100 }
 *               businessScore:   { type: number, minimum: 0, maximum: 100 }
 *               trustScore:      { type: number, minimum: 0, maximum: 100 }
 *               adoptionScore:   { type: number, minimum: 0, maximum: 100 }
 *               label:           { type: string, enum: [AUTO, BASELINE, CHECKPOINT], default: CHECKPOINT }
 *     responses:
 *       201:
 *         description: Snapshot created
 */
v1Router.post('/ois/snapshot', async (req: Request, res: Response) => {
  try {
    const {
      oisScore, decisionScore = 0, workflowScore = 0, aiScore = 0,
      enterpriseScore = 0, goalScore = 0, learningScore = 0,
      businessScore = 0, trustScore = 0, adoptionScore = 0,
      label = 'CHECKPOINT', pillars = {},
    } = req.body

    if (typeof oisScore !== 'number' || oisScore < 0 || oisScore > 100) {
      res.status(400).json({ error: 'oisScore is required and must be 0–100' })
      return
    }

    const snap = await (prisma as any).gate8Snapshot.create({
      data: {
        oisScore, decisionScore, workflowScore, aiScore, enterpriseScore,
        goalScore, learningScore, businessScore, trustScore, adoptionScore,
        label, pillars, triggeredBy: 'API_V1',
      },
    })

    res.status(201).json({ data: snap })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNALS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @openapi
 * /v1/signals:
 *   get:
 *     tags: [v1/Signals]
 *     summary: List KIMMP signals
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: category
 *         schema: { type: string, enum: [BEHAVIOR, INTENT, MARKET, CONTENT, RISK, SYSTEM] }
 *       - in: query
 *         name: severity
 *         schema: { type: string, enum: [LOW, MODERATE, HIGH, CRITICAL] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [NEW, PROCESSED, DISMISSED] }
 *     responses:
 *       200:
 *         description: Paginated signal list
 */
v1Router.get('/signals', async (req: Request, res: Response) => {
  try {
    const { skip, take } = paginate(req.query)
    const where: any = {}
    if (req.query.category) where.signalCategory = String(req.query.category)
    if (req.query.severity) where.severity       = String(req.query.severity)
    if (req.query.status)   where.status         = String(req.query.status)

    const [data, total] = await Promise.all([
      (prisma as any).kimmpSignal.findMany({
        where, orderBy: { createdAt: 'desc' }, skip, take,
        select: {
          id: true, sourceModule: true, signalType: true, signalCategory: true,
          signalValue: true, confidence: true, severity: true, status: true, createdAt: true,
        },
      }),
      (prisma as any).kimmpSignal.count({ where }),
    ])

    res.json({ data, total, page: Math.floor(skip / take) + 1, limit: take })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

/**
 * @openapi
 * /v1/signals:
 *   post:
 *     tags: [v1/Signals]
 *     summary: Ingest a new signal
 *     description: Push an external signal into the KIMMP intelligence layer. KIMMP will process it automatically.
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sourceModule, signalType, signalCategory, signalValue]
 *             properties:
 *               sourceModule:    { type: string, description: "e.g. crm, erp, custom" }
 *               signalType:      { type: string, description: "e.g. lead_quality_drop, revenue_decline" }
 *               signalCategory:  { type: string, enum: [BEHAVIOR, INTENT, MARKET, CONTENT, RISK, SYSTEM] }
 *               signalValue:     { type: string, description: "Human-readable signal description" }
 *               confidence:      { type: number, minimum: 0, maximum: 1, default: 0.8 }
 *               severity:        { type: string, enum: [LOW, MODERATE, HIGH, CRITICAL], default: LOW }
 *               metadata:        { type: object, description: "Arbitrary context object" }
 *     responses:
 *       201:
 *         description: Signal ingested
 */
v1Router.post('/signals', async (req: Request, res: Response) => {
  try {
    const { sourceModule, signalType, signalCategory, signalValue,
            confidence = 0.8, severity = 'LOW', metadata } = req.body

    if (!sourceModule || !signalType || !signalCategory || !signalValue) {
      res.status(400).json({ error: 'sourceModule, signalType, signalCategory, and signalValue are required' })
      return
    }

    const VALID_CATEGORIES = ['BEHAVIOR', 'INTENT', 'MARKET', 'CONTENT', 'RISK', 'SYSTEM']
    const VALID_SEVERITIES = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL']

    if (!VALID_CATEGORIES.includes(signalCategory)) {
      res.status(400).json({ error: `signalCategory must be one of: ${VALID_CATEGORIES.join(', ')}` })
      return
    }
    if (!VALID_SEVERITIES.includes(severity)) {
      res.status(400).json({ error: `severity must be one of: ${VALID_SEVERITIES.join(', ')}` })
      return
    }

    const signal = await (prisma as any).kimmpSignal.create({
      data: { sourceModule, signalType, signalCategory, signalValue, confidence, severity, metadata: metadata ?? null },
    })

    res.status(201).json({ data: signal })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// DECISIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @openapi
 * /v1/decisions:
 *   get:
 *     tags: [v1/Decisions]
 *     summary: List strategic decisions
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: resolved
 *         schema: { type: boolean }
 *         description: Filter by whether a decision has been selected
 *     responses:
 *       200:
 *         description: Paginated decision list
 */
v1Router.get('/decisions', async (req: Request, res: Response) => {
  try {
    const { skip, take } = paginate(req.query)
    const where: any = {}
    if (req.query.resolved === 'true')  where.selected = { not: null }
    if (req.query.resolved === 'false') where.selected = null

    const [data, total] = await Promise.all([
      (prisma as any).kimmpStrategicDecision.findMany({
        where, orderBy: { createdAt: 'desc' }, skip, take,
        select: {
          id: true, question: true, reasoning: true, evidence: true, options: true,
          selected: true, selectedBy: true, outcome: true, confidence: true,
          agentsMixed: true, workflowName: true, stepName: true,
          createdAt: true, resolvedAt: true,
        },
      }),
      (prisma as any).kimmpStrategicDecision.count({ where }),
    ])

    res.json({ data, total, page: Math.floor(skip / take) + 1, limit: take })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

/**
 * @openapi
 * /v1/decisions:
 *   post:
 *     tags: [v1/Decisions]
 *     summary: Create a strategic decision record
 *     description: Submits a question to the KIMMP strategic decision engine. KIMMP will analyse context and generate structured options.
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [question]
 *             properties:
 *               question:     { type: string, description: "The strategic question for KIMMP to analyse" }
 *               context:      { type: object, description: "Additional context (signals, data)" }
 *               workflowName: { type: string, description: "Optional canvas workflow link" }
 *               stepName:     { type: string, description: "Optional canvas step link" }
 *     responses:
 *       201:
 *         description: Decision record created with KIMMP-generated options
 */
v1Router.post('/decisions', async (req: Request, res: Response) => {
  try {
    const { question, context = {}, workflowName, stepName } = req.body

    if (!question?.trim()) {
      res.status(400).json({ error: 'question is required' })
      return
    }

    const decision = await (prisma as any).kimmpStrategicDecision.create({
      data: {
        question:    question.trim(),
        context:     context ?? {},
        reasoning:   'Pending KIMMP analysis — submitted via API v1',
        evidence:    [],
        options:     [],
        confidence:  0,
        agentsMixed: [],
        workflowName: workflowName ?? null,
        stepName:     stepName     ?? null,
      },
    })

    res.status(201).json({ data: decision })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

/**
 * @openapi
 * /v1/decisions/{id}/select:
 *   patch:
 *     tags: [v1/Decisions]
 *     summary: Select an option for a decision
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [selected]
 *             properties:
 *               selected: { type: string, description: "Label of the chosen option" }
 *               outcome:  { type: string, description: "Optional outcome description" }
 *     responses:
 *       200:
 *         description: Decision updated with selected option
 *       404:
 *         description: Decision not found
 */
v1Router.patch('/decisions/:id/select', async (req: Request, res: Response) => {
  try {
    const { selected, outcome } = req.body
    if (!selected?.trim()) {
      res.status(400).json({ error: 'selected is required' })
      return
    }

    const existing = await (prisma as any).kimmpStrategicDecision.findUnique({
      where: { id: req.params.id },
    })
    if (!existing) {
      res.status(404).json({ error: 'Decision not found' })
      return
    }

    const uid   = userId(req)
    const data: any = { selected: selected.trim(), selectedBy: uid ?? 'API_V1', resolvedAt: new Date() }
    if (outcome) data.outcome = outcome

    const updated = await (prisma as any).kimmpStrategicDecision.update({
      where: { id: req.params.id },
      data,
    })

    res.json({ data: updated })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// BLUEPRINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @openapi
 * /v1/blueprints:
 *   get:
 *     tags: [v1/Blueprints]
 *     summary: List enterprise blueprints
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [DRAFT, ACTIVE, ARCHIVED] }
 *     responses:
 *       200:
 *         description: Paginated blueprint list
 */
v1Router.get('/blueprints', async (req: Request, res: Response) => {
  try {
    const { skip, take } = paginate(req.query)
    const where: any = {}
    if (req.query.status) where.status = String(req.query.status)

    const [data, total] = await Promise.all([
      (prisma as any).enterpriseBlueprint.findMany({
        where, orderBy: { createdAt: 'desc' }, skip, take,
        select: {
          id: true, name: true, version: true, pack: true, industry: true,
          description: true, status: true, checksum: true,
          deployedAt: true, importedAt: true, createdAt: true,
        },
      }),
      (prisma as any).enterpriseBlueprint.count({ where }),
    ])

    res.json({ data, total, page: Math.floor(skip / take) + 1, limit: take })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

/**
 * @openapi
 * /v1/blueprints:
 *   post:
 *     tags: [v1/Blueprints]
 *     summary: Create or import a blueprint
 *     description: Creates a new enterprise blueprint from a spec object. The spec defines departments, goals, workflows, agents, KPIs, and OIS targets.
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, spec]
 *             properties:
 *               name:        { type: string }
 *               version:     { type: string, default: "1.0.0" }
 *               pack:        { type: string, description: "Source pack name e.g. professional-services" }
 *               industry:    { type: string }
 *               description: { type: string }
 *               spec:        { type: object, description: "Full blueprint spec — departments, goals, workflows, agents, kpis, oisProfile" }
 *               status:      { type: string, enum: [DRAFT, ACTIVE], default: DRAFT }
 *     responses:
 *       201:
 *         description: Blueprint created
 */
v1Router.post('/blueprints', async (req: Request, res: Response) => {
  try {
    const { name, version = '1.0.0', pack, industry, description, spec, status = 'DRAFT' } = req.body

    if (!name?.trim()) {
      res.status(400).json({ error: 'name is required' })
      return
    }
    if (!spec || typeof spec !== 'object') {
      res.status(400).json({ error: 'spec is required and must be an object' })
      return
    }

    const checksum = crypto.createHash('sha256').update(JSON.stringify(spec)).digest('hex')

    const blueprint = await (prisma as any).enterpriseBlueprint.create({
      data: {
        name: name.trim(), version, pack: pack ?? null, industry: industry ?? null,
        description: description ?? null, spec, status, checksum,
        importedAt: new Date(),
        createdBy: userId(req) ?? 'API_V1',
      },
    })

    res.status(201).json({ data: blueprint })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

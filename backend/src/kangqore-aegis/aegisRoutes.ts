// ---------------------------------------------------------------------------
// AEGIS Routes — ADMIN sovereignty dashboard API
//
// Mounted at /api/admin/aegis (protected by aegisShield upstream).
// ---------------------------------------------------------------------------

import { Router, Request, Response } from 'express'
import { AegisLedger, AegisEventType }  from './aegisLedger.service'
import { AegisSovereignty }             from './aegisSovereignty.service'
import { AegisPolicyEngine }            from './aegisPolicy.service'
import { AegisEngineDispatcher }        from './aegisEngineDispatcher'
import { AegisActionExecutor }          from './aegisActionExecutor'
import { AegisBudget }                  from './aegisBudget.service'
import { aegisConfig }                  from './aegisConfig'
import { verifyAccessToken }            from '../services/token.service'
import { prisma }                       from '../lib/prisma'

export const aegisRouter = Router()

// ── Config / on-off switch ─────────────────────────────────────────────────────
// These routes self-protect with inline auth so they stay safe even when the
// shield is bypassed (build mode).

aegisRouter.get('/config', (_req: Request, res: Response) => {
  res.json(aegisConfig.snapshot())
})

aegisRouter.post('/config/toggle', (req: Request, res: Response) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Auth required to toggle AEGIS' })
    return
  }
  const payload = verifyAccessToken(auth.substring(7)) as any
  if (!payload || payload.role !== 'ADMIN') {
    res.status(403).json({ error: 'Only ADMIN may toggle AEGIS' })
    return
  }
  const enabled = aegisConfig.toggle(payload.userId)
  res.json({ ...aegisConfig.snapshot(), message: enabled ? 'AEGIS activated' : 'AEGIS bypassed — build mode on' })
})

// ── Health ────────────────────────────────────────────────────────────────────

aegisRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    shield:    'AEGIS',
    fullName:  'Kangqore Autonomous Executive Governance & Intelligence Shield',
    status:    'ACTIVE',
    governs:   'KIMMP/WAANDA',
    master:    'ADMIN',
    components: [
      'Sovereignty Engine',
      'Executive Audit Ledger',
      'Autonomy Boundary Monitor',
      'Access Sentinel',
      'Intelligence Registry',
      'Intelligence Egress Control',
      'Policy Engine',
    ],
    timestamp: new Date().toISOString(),
  })
})

// ── Stats — all domains ───────────────────────────────────────────────────────

aegisRouter.get('/stats', async (_req: Request, res: Response) => {
  const [ledgerStats, ownershipSummary] = await Promise.all([
    AegisLedger.stats(),
    AegisSovereignty.ownershipSummary(),
  ])
  res.json({
    shield:           'AEGIS',
    ledger:           ledgerStats,
    sovereignty:      ownershipSummary,
    policies:         AegisPolicyEngine.listPolicies().length,
    timestamp:        new Date().toISOString(),
  })
})

// ── Executive Audit Ledger ────────────────────────────────────────────────────

aegisRouter.get('/audit', async (req: Request, res: Response) => {
  const { eventType, system, limit, offset, from, to } = req.query
  const result = await AegisLedger.query({
    eventType: eventType as AegisEventType | undefined,
    system:    system as string | undefined,
    limit:     limit  ? Number(limit)  : 50,
    offset:    offset ? Number(offset) : 0,
    from:      from   ? new Date(from as string) : undefined,
    to:        to     ? new Date(to   as string) : undefined,
  })
  res.json({ shield: 'AEGIS', domain: 'AUDIT', ...result })
})

// ── Autonomy Boundary Monitor ─────────────────────────────────────────────────

aegisRouter.get('/autonomy', async (req: Request, res: Response) => {
  const { system, limit, offset } = req.query
  const result = await AegisLedger.query({
    autonomous: true,
    system:     system as string | undefined,
    limit:      limit  ? Number(limit)  : 50,
    offset:     offset ? Number(offset) : 0,
  })
  res.json({ shield: 'AEGIS', domain: 'AUTONOMY_BOUNDARY', ...result })
})

// ── Access Sentinel ───────────────────────────────────────────────────────────

aegisRouter.get('/shield', async (req: Request, res: Response) => {
  const { limit, offset } = req.query
  const result = await AegisLedger.query({
    eventType: 'ACCESS_DENIED',
    limit:     limit  ? Number(limit)  : 50,
    offset:    offset ? Number(offset) : 0,
  })
  res.json({ shield: 'AEGIS', domain: 'ACCESS_SENTINEL', ...result })
})

// ── Intelligence Registry ─────────────────────────────────────────────────────

aegisRouter.get('/assets', async (req: Request, res: Response) => {
  const { system, limit, offset } = req.query
  const result = await AegisLedger.query({
    eventType: 'KNOWLEDGE_ASSET',
    system:    system as string | undefined,
    limit:     limit  ? Number(limit)  : 50,
    offset:    offset ? Number(offset) : 0,
  })
  res.json({ shield: 'AEGIS', domain: 'INTELLIGENCE_REGISTRY', ...result })
})

// ── Intelligence Egress Control ───────────────────────────────────────────────

aegisRouter.get('/egress', async (req: Request, res: Response) => {
  const { limit, offset } = req.query
  const result = await AegisLedger.query({
    eventType: 'EGRESS',
    limit:     limit  ? Number(limit)  : 50,
    offset:    offset ? Number(offset) : 0,
  })
  res.json({ shield: 'AEGIS', domain: 'EGRESS_CONTROL', ...result })
})

// ── Sovereignty Engine ────────────────────────────────────────────────────────

aegisRouter.get('/sovereignty', async (_req: Request, res: Response) => {
  const summary = await AegisSovereignty.ownershipSummary()
  res.json({
    shield:  'AEGIS',
    domain:  'SOVEREIGNTY',
    master:  'ADMIN',
    ...summary,
  })
})

// ── Policy Engine ─────────────────────────────────────────────────────────────

aegisRouter.get('/policy/rules', (_req: Request, res: Response) => {
  res.json({
    shield:   'AEGIS',
    domain:   'POLICY_ENGINE',
    policies: AegisPolicyEngine.listPolicies(),
  })
})

// ── Agent Registry ────────────────────────────────────────────────────────────

aegisRouter.get('/agents', (_req: Request, res: Response) => {
  res.json({
    shield:  'AEGIS',
    domain:  'AGENT_REGISTRY',
    ...AegisEngineDispatcher.registryStats(),
    agents:  AegisEngineDispatcher.listAgents(),
  })
})

// ── Agent Corps Summary — latest verdict per engine + health score ────────────

aegisRouter.get('/agents/summary', async (_req: Request, res: Response) => {
  const since24h = new Date(Date.now() - 86_400_000)

  // Latest run per engine (last 7 days)
  const since7d = new Date(Date.now() - 7 * 86_400_000)
  const allEngines = [
    'GOVERNANCE_OPS','SOVEREIGNTY','AUDIT_LEDGER','AUTONOMY_BOUNDARY',
    'ACCESS_SENTINEL','INTELLIGENCE_REGISTRY','EGRESS_CONTROL',
    'POLICY','TRUST_COMPLIANCE','RISK_INTELLIGENCE',
  ]

  const [engineLatest, critical24h, warn24h, reportRun] = await Promise.all([
    // For each engine, find the latest run
    Promise.all(allEngines.map(async engine => {
      const row = await (prisma as any).aegisAgentRun.findFirst({
        where:   { engine, raisedAt: { gte: since7d } },
        orderBy: { raisedAt: 'desc' },
        select:  { verdict: true, raisedAt: true, agentId: true, summary: true },
      }).catch(() => null)
      return { engine, latest: row ?? null }
    })),
    (prisma as any).aegisAgentRun.count({ where: { verdict: 'CRITICAL', raisedAt: { gte: since24h } } }).catch(() => 0),
    (prisma as any).aegisAgentRun.count({ where: { verdict: 'WARN',     raisedAt: { gte: since24h } } }).catch(() => 0),
    // Pull health score from latest govops.reporting run
    (prisma as any).aegisAgentRun.findFirst({
      where:   { agentId: 'govops.reporting' },
      orderBy: { raisedAt: 'desc' },
      select:  { metadata: true, verdict: true, raisedAt: true },
    }).catch(() => null),
  ])

  const healthScore: number = (reportRun?.metadata as any)?.healthScore ?? null

  // Derive overall shield status
  const hasCritical = engineLatest.some(e => e.latest?.verdict === 'CRITICAL') || critical24h > 0
  const hasWarn     = engineLatest.some(e => e.latest?.verdict === 'WARN')     || warn24h > 0
  const overallVerdict = hasCritical ? 'CRITICAL' : hasWarn ? 'WARN' : 'PASS'

  res.json({
    shield:         'AEGIS',
    domain:         'AGENT_CORPS_SUMMARY',
    overallVerdict,
    healthScore,
    critical24h,
    warn24h,
    engines: engineLatest,
    lastChecked: new Date().toISOString(),
  })
})

// ── Agent Runs — queryable history ───────────────────────────────────────────

aegisRouter.get('/agents/runs', async (req: Request, res: Response) => {
  const { engine, verdict, agentId, limit, offset } = req.query

  const where: Record<string, unknown> = {}
  if (engine)  where.engine  = engine
  if (verdict) where.verdict = verdict
  if (agentId) where.agentId = agentId

  const [rows, total] = await Promise.all([
    (prisma as any).aegisAgentRun.findMany({
      where,
      orderBy: { raisedAt: 'desc' },
      take:    limit  ? Number(limit)  : 50,
      skip:    offset ? Number(offset) : 0,
    }),
    (prisma as any).aegisAgentRun.count({ where }),
  ])

  res.json({ shield: 'AEGIS', domain: 'AGENT_RUNS', rows, total })
})

// ── On-demand engine run ─────────────────────────────────────────────────────

aegisRouter.post('/engines/:engine/run', async (req: Request, res: Response) => {
  const { engine } = req.params
  const results = await AegisEngineDispatcher.runEngine(
    engine.toUpperCase(),
    { userId: (req as any).user?.id ?? 'ADMIN' },
  )
  res.json({ shield: 'AEGIS', engine: engine.toUpperCase(), ran: results.length, results })
})

// ── On-demand single agent run ────────────────────────────────────────────────

aegisRouter.post('/agents/:agentId/run', async (req: Request, res: Response) => {
  const { agentId } = req.params
  const result = await AegisEngineDispatcher.runAgent(
    agentId,
    { userId: (req as any).user?.id ?? 'ADMIN' },
  )
  if (!result) return res.status(404).json({ error: `Agent '${agentId}' not found` })
  res.json({ shield: 'AEGIS', result })
})

// ── Phase 2: Pending L3 Actions ───────────────────────────────────────────────

aegisRouter.get('/actions/pending', async (_req: Request, res: Response) => {
  const rows = await (prisma as any).aegisPendingAction.findMany({
    where:   { status: 'PENDING' },
    orderBy: { requestedAt: 'desc' },
  })
  res.json({ shield: 'AEGIS', domain: 'PENDING_ACTIONS', rows, total: rows.length })
})

aegisRouter.post('/actions/:id/approve', async (req: Request, res: Response) => {
  const adminUserId = (req as any).user?.id ?? 'ADMIN'
  const result = await AegisActionExecutor.approveAndExecute(req.params.id, adminUserId)
  res.json({ shield: 'AEGIS', ...result })
})

aegisRouter.post('/actions/:id/reject', async (req: Request, res: Response) => {
  const adminUserId = (req as any).user?.id ?? 'ADMIN'
  await AegisActionExecutor.rejectPending(req.params.id, adminUserId)
  res.json({ shield: 'AEGIS', rejected: true })
})

aegisRouter.get('/actions/log', async (req: Request, res: Response) => {
  const { agentId, status, limit, offset } = req.query
  const where: Record<string, unknown> = {}
  if (agentId) where.agentId = agentId
  if (status)  where.status  = status

  const [rows, total] = await Promise.all([
    (prisma as any).aegisActionLog.findMany({
      where,
      orderBy: { executedAt: 'desc' },
      take:    limit  ? Number(limit)  : 50,
      skip:    offset ? Number(offset) : 0,
    }),
    (prisma as any).aegisActionLog.count({ where }),
  ])

  res.json({ shield: 'AEGIS', domain: 'ACTION_LOG', rows, total })
})

// ── S112: Phase 3 — Per-tenant Budget Enforcement ────────────────────────────
// S298 — the in-memory store + usage check now live in aegisBudget.service.ts
// so the Action Engine can gate on the same budget as this dashboard reads.

aegisRouter.get('/budget', async (_req: Request, res: Response) => {
  // Returns global + per-tenant enforcement config
  const budgets = AegisBudget.listConfigs()
  res.json({
    shield:    'AEGIS',
    domain:    'BUDGET_ENFORCEMENT',
    global:    { egressSizeLimitKb: Number(process.env.AEGIS_EGRESS_LIMIT_KB ?? 512), hardDeny: true },
    tenants:   budgets,
    totalTenants: budgets.length,
  })
})

aegisRouter.post('/budget', async (req: Request, res: Response) => {
  const { tenantId, callLimit, windowHours, hardDeny } = req.body
  if (!tenantId) return res.status(400).json({ error: 'tenantId required' })
  const config = AegisBudget.setBudget(tenantId, { callLimit, windowHours, hardDeny })
  // Emit KIMMP signal for audit
  await prisma.kimmpSignal.create({
    data: {
      sourceModule: 'AEGIS',
      signalType: 'AEGIS_BUDGET_SET',
      signalCategory: 'SYSTEM',
      signalValue: `AEGIS Budget Set — ${tenantId}`,
      severity: 'LOW',
      confidence: 100,
      metadata: { summary: `callLimit=${config.callLimit}/day, hardDeny=${config.hardDeny}` }
    },
  }).catch(() => {})
  res.json({ shield: 'AEGIS', domain: 'BUDGET_ENFORCEMENT', tenantId, config })
})

aegisRouter.get('/budget/:tenantId/usage', async (req: Request, res: Response) => {
  const { tenantId } = req.params
  const usage = await AegisBudget.checkUsage(tenantId)
  if (usage.overBudget && usage.hardDeny) {
    await (prisma as any).aegisActionLog.create({
      data: {
        actionType: 'LOG_AUDIT_ENTRY', level: 0,
        agentId: 'aegis.budget-enforcer', engine: 'AUTONOMY_BOUNDARY',
        params: { tenantId, callCount: usage.callCount, limit: usage.budget },
        result: { blocked: true }, status: 'SUCCESS',
      },
    }).catch(() => {})
  }

  res.json({
    shield: 'AEGIS', domain: 'BUDGET_ENFORCEMENT',
    tenantId, callCount: usage.callCount, budget: usage.budget,
    windowHours: usage.windowHours,
    overBudget: usage.overBudget, hardDeny: usage.hardDeny,
    since: usage.since.toISOString(),
  })
})

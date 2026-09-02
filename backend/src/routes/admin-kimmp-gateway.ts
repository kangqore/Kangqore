// S310 — KIMMP Intelligence Gateway dashboard API.
import { Router } from 'express'
import crypto from 'crypto'
import { prisma } from '../lib/prisma'
import { authenticate, authorize } from '../middleware/auth'
import { complete, GATEWAY_MODEL_MAP } from '../kangqore-view/kimmp/gateway/KimmpGateway'
import { checkBudget } from '../kangqore-view/kimmp/gateway/KimmpGatewayCore'
import { PgvectorIndex } from '../kangqore-view/kimmp/knowledge/PgvectorIndex'
import { embedQuery, isEmbeddingsConfigured } from '../kangqore-view/kimmp/knowledge/EmbeddingsService'
import { KimmpOperationalWebhookService } from '../kangqore-view/kimmp/gateway/KimmpOperationalWebhook'

const router = Router()
const guard = [authenticate, authorize(['ADMIN'])] as const

// ─── Call log ───────────────────────────────────────────────────────────────

router.get('/calls', ...guard, async (req, res) => {
  const { actorType, model, taskType, status, page = '1', limit = '25' } = req.query as Record<string, string>
  const where: any = {}
  if (actorType) where.actorType = actorType
  if (model) where.model = model
  if (taskType) where.taskType = taskType
  if (status) where.status = status
  try {
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [calls, total] = await Promise.all([
      prisma.llmCallLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit) }),
      prisma.llmCallLog.count({ where }),
    ])
    res.json({ calls, total, pages: Math.ceil(total / parseInt(limit)) })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// S319 — was the promptVersion this call used flagged by a Gate 3 drift
// alert? Snapshot-based: any KimmpBenchmarkRun with driftAlert=true whose
// promptVersionSnapshot recorded this exact {name: version} pair as active.
// No new scoring — reads Gate 3's existing drift computation.
async function checkPromptRegression(promptName: string | null, promptVersion: number | null) {
  if (!promptName || promptVersion == null) return null
  const run = await prisma.kimmpBenchmarkRun.findFirst({
    where: {
      driftAlert: true,
      promptVersionSnapshot: { path: [promptName], equals: promptVersion },
    },
    orderBy: { startedAt: 'desc' },
    select: { id: true, driftDelta: true, totalScore: true, startedAt: true },
  }).catch(() => null)
  return run ? { flagged: true, runId: run.id, driftDelta: run.driftDelta, totalScore: run.totalScore, at: run.startedAt } : { flagged: false }
}

// S325 — Unified AI Operations Console: click one call, see everything every
// earlier phase in this roadmap knows about it. All reads, no new tables —
// promptRegression is S319's existing drift check; agent/agentQuality re-use
// S324's KimmpAgent + AIEvaluation join; toolExecutions re-uses the exact
// join /tool-calls (S315) already does, just scoped to one call.
router.get('/calls/:id', ...guard, async (req, res) => {
  try {
    const call = await prisma.llmCallLog.findUniqueOrThrow({ where: { id: req.params.id } })
    const promptRegression = await checkPromptRegression(call.promptName, call.promptVersion)

    const [agent, toolExecutions] = await Promise.all([
      call.sourceModule === 'AGENT_STUDIO' && call.agentRole
        ? prisma.kimmpAgent.findFirst({ where: { name: call.agentRole } })
        : null,
      call.toolExecutionIds.length
        ? prisma.actionExecution.findMany({
            where: { id: { in: call.toolExecutionIds } },
            include: { action: { select: { name: true, displayName: true } }, object: { select: { id: true, properties: true, type: { select: { displayName: true } } } } },
          })
        : [],
    ])

    const agentQuality = agent
      ? await (prisma as any).aIEvaluation.aggregate({
          where: { targetType: 'AGENT', targetId: agent.id },
          _avg: { overall: true }, _count: { _all: true },
        }).catch(() => null)
      : null

    res.json({
      call,
      promptRegression,
      agent,
      agentQuality: agentQuality ? { avgOverall: agentQuality._avg?.overall ?? null, evalCount: agentQuality._count?._all ?? 0 } : null,
      toolExecutions,
    })
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
})

// ─── Cost / model analytics ─────────────────────────────────────────────────

router.get('/analytics/cost', ...guard, async (req, res) => {
  const days = Math.min(90, parseInt(String(req.query.days ?? '30')))
  const since = new Date(Date.now() - days * 86_400_000)
  try {
    const calls = await prisma.llmCallLog.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, totalCost: true, actorType: true, taskType: true, promptTokens: true, completionTokens: true },
    })

    const byDay = new Map<string, number>()
    const byActor = new Map<string, number>()
    const byTaskType = new Map<string, number>()
    let totalCost = 0
    let totalTokens = 0

    for (const c of calls) {
      const day = c.createdAt.toISOString().slice(0, 10)
      byDay.set(day, (byDay.get(day) ?? 0) + c.totalCost)
      byActor.set(c.actorType, (byActor.get(c.actorType) ?? 0) + c.totalCost)
      const tt = c.taskType ?? 'untagged'
      byTaskType.set(tt, (byTaskType.get(tt) ?? 0) + c.totalCost)
      totalCost += c.totalCost
      totalTokens += c.promptTokens + c.completionTokens
    }

    res.json({
      totalCost, totalTokens, callCount: calls.length,
      byDay: Array.from(byDay.entries()).map(([date, cost]) => ({ date, cost })).sort((a, b) => a.date.localeCompare(b.date)),
      byActorType: Array.from(byActor.entries()).map(([actorType, cost]) => ({ actorType, cost })),
      byTaskType: Array.from(byTaskType.entries()).map(([taskType, cost]) => ({ taskType, cost })),
    })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/analytics/models', ...guard, async (req, res) => {
  const days = Math.min(90, parseInt(String(req.query.days ?? '30')))
  const since = new Date(Date.now() - days * 86_400_000)
  try {
    const calls = await prisma.llmCallLog.findMany({
      where: { createdAt: { gte: since } },
      select: { model: true, latencyMs: true, totalCost: true, taskType: true },
    })

    const byModel = new Map<string, { count: number; totalLatency: number; totalCost: number }>()
    for (const c of calls) {
      const row = byModel.get(c.model) ?? { count: 0, totalLatency: 0, totalCost: 0 }
      row.count++
      row.totalLatency += c.latencyMs
      row.totalCost += c.totalCost
      byModel.set(c.model, row)
    }

    res.json({
      models: Array.from(byModel.entries()).map(([model, r]) => ({
        model, callCount: r.count, avgLatencyMs: Math.round(r.totalLatency / r.count), totalCost: r.totalCost,
      })),
    })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── PII incidents ───────────────────────────────────────────────────────────

router.get('/pii-incidents', ...guard, async (req, res) => {
  try {
    const incidents = await prisma.llmCallLog.findMany({
      where: { piiDetected: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { id: true, actorType: true, sourceModule: true, piiPatterns: true, status: true, createdAt: true, taskType: true },
    })
    res.json({ incidents })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── PII scan config ─────────────────────────────────────────────────────────

router.get('/pii-config', ...guard, async (_req, res) => {
  try {
    const configs = await prisma.piiScanConfig.findMany({ orderBy: { name: 'asc' } })
    res.json({ configs })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/pii-config', ...guard, async (req, res) => {
  const { name, mode, enabledPatterns } = req.body
  try {
    const config = await prisma.piiScanConfig.create({
      data: { name, mode: mode ?? 'AUDIT', enabledPatterns: enabledPatterns ?? undefined },
    })
    res.status(201).json({ config })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/pii-config/:id', ...guard, async (req, res) => {
  const { mode, enabledPatterns, active } = req.body
  try {
    if (active === true) {
      await prisma.piiScanConfig.updateMany({ where: { active: true }, data: { active: false } })
    }
    const config = await prisma.piiScanConfig.update({
      where: { id: req.params.id },
      data: {
        ...(mode !== undefined && { mode }),
        ...(enabledPatterns !== undefined && { enabledPatterns }),
        ...(active !== undefined && { active }),
      },
    })
    res.json({ config })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

// ─── Token budgets ───────────────────────────────────────────────────────────

router.get('/budgets', ...guard, async (_req, res) => {
  try {
    const budgets = await prisma.tokenBudget.findMany({ orderBy: { createdAt: 'desc' } })
    const withUsage = await Promise.all(budgets.map(async b => {
      if (!b.userId) return { ...b, usedTokens: 0 }
      const usage = await checkBudget(b.userId)
      return { ...b, usedTokens: usage.usedTokens }
    }))
    res.json({ budgets: withUsage })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/budgets', ...guard, async (req, res) => {
  const { userId, teamId, monthlyTokenLimit, alertThreshold, hardStop } = req.body
  if (!userId && !teamId) { res.status(400).json({ error: 'userId or teamId is required' }); return }
  try {
    const budget = await prisma.tokenBudget.create({
      data: { userId, teamId, monthlyTokenLimit, alertThreshold: alertThreshold ?? 0.8, hardStop: !!hardStop },
    })
    res.status(201).json({ budget })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/budgets/:id', ...guard, async (req, res) => {
  const { monthlyTokenLimit, alertThreshold, hardStop } = req.body
  try {
    const budget = await prisma.tokenBudget.update({
      where: { id: req.params.id },
      data: {
        ...(monthlyTokenLimit !== undefined && { monthlyTokenLimit }),
        ...(alertThreshold !== undefined && { alertThreshold }),
        ...(hardStop !== undefined && { hardStop }),
      },
    })
    res.json({ budget })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/budgets/:id', ...guard, async (req, res) => {
  try {
    await prisma.tokenBudget.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

// ─── Diagnostic: exercise the gateway's explicit complete() path ───────────

router.post('/test-complete', ...guard, async (req, res) => {
  const { system, user, taskType, maxTokens } = req.body
  try {
    const model = (taskType && GATEWAY_MODEL_MAP[taskType]) || 'claude-haiku-4-5-20251001'
    const text = await complete({
      model, system: system || 'You are a test probe for the KIMMP Intelligence Gateway.', user: user || 'Reply with OK.',
      maxTokens: maxTokens ?? 200, userId: (req as any).user?.id, actorType: 'HUMAN', taskType,
    })
    res.json({ text })
  } catch (e: any) {
    res.status(e.name === 'GatewayBudgetExceededError' ? 429 : e.name === 'GatewayBlockedError' ? 400 : 500).json({ error: e.message })
  }
})

router.get('/model-map', ...guard, async (_req, res) => {
  res.json({ modelMap: GATEWAY_MODEL_MAP })
})

// ─── S312: per-prompt usage, sourced from LlmCallLog via the S311 link ─────

router.get('/prompts/:name/usage', ...guard, async (req, res) => {
  try {
    const since = new Date(Date.now() - 30 * 86_400_000)
    const calls = await prisma.llmCallLog.findMany({
      where: { promptName: req.params.name, createdAt: { gte: since } },
      select: { promptVersion: true, totalCost: true, promptTokens: true, completionTokens: true, status: true, createdAt: true },
    })

    const byVersion = new Map<number, { callCount: number; cost: number; tokens: number; errors: number }>()
    for (const c of calls) {
      const v = c.promptVersion ?? 0
      const row = byVersion.get(v) ?? { callCount: 0, cost: 0, tokens: 0, errors: 0 }
      row.callCount++
      row.cost += c.totalCost
      row.tokens += c.promptTokens + c.completionTokens
      if (c.status === 'ERROR') row.errors++
      byVersion.set(v, row)
    }

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
    const callsToday = calls.filter(c => c.createdAt >= todayStart).length

    const versions = Array.from(byVersion.entries()).map(([version, stats]) => ({ version, ...stats })).sort((a, b) => b.version - a.version)
    // S319 — flag any version that was live during a Gate 3 drift alert.
    const versionsWithRegression = await Promise.all(versions.map(async v => ({
      ...v, regression: await checkPromptRegression(req.params.name, v.version),
    })))

    res.json({
      name: req.params.name,
      callsToday,
      last30Days: calls.length,
      byVersion: versionsWithRegression,
    })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── S315: tool-invoked OntologyActions — LlmCallLog joined to ActionExecution ─

router.get('/tool-calls', ...guard, async (req, res) => {
  const { page = '1', limit = '25' } = req.query as Record<string, string>
  try {
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const where = { toolExecutionIds: { isEmpty: false } }
    const [calls, total] = await Promise.all([
      prisma.llmCallLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit) }),
      prisma.llmCallLog.count({ where }),
    ])

    const allExecutionIds = calls.flatMap(c => c.toolExecutionIds)
    const executions = allExecutionIds.length
      ? await prisma.actionExecution.findMany({
          where: { id: { in: allExecutionIds } },
          include: { action: { select: { name: true, displayName: true } }, object: { select: { id: true, properties: true, type: { select: { displayName: true } } } } },
        })
      : []
    const executionMap = new Map(executions.map(e => [e.id, e]))

    const rows = calls.map(c => ({
      call: c,
      executions: c.toolExecutionIds.map(id => executionMap.get(id)).filter(Boolean),
    }))

    res.json({ rows, total, pages: Math.ceil(total / parseInt(limit)) })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── S316-S318: pgvector index health ───────────────────────────────────────

router.get('/pgvector/health', ...guard, async (_req, res) => {
  try {
    const health = await PgvectorIndex.health()
    res.json({ health })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/pgvector/backfill', ...guard, async (_req, res) => {
  try {
    const results = await PgvectorIndex.backfillAll()
    res.json({ results })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/pgvector/benchmark', ...guard, async (_req, res) => {
  try {
    if (!isEmbeddingsConfigured()) { res.status(400).json({ error: 'Embeddings not configured' }); return }
    const emb = await embedQuery('system health check probe query for latency benchmarking')
    const benchmarks = await Promise.all([
      PgvectorIndex.benchmarkLatency('knowledge_chunks', emb),
      PgvectorIndex.benchmarkLatency('kimmp_system_knowledge', emb),
    ])
    res.json({ benchmarks })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── Agent Performance + Audit (S324) ─────────────────────────────────────────
// Full per-row granularity only for KimmpAgent rows run through S321's
// runtime (agentRole = agent.name, sourceModule = 'AGENT_STUDIO', set by
// kimmpAgentRuntime.service.ts). The 38 KIMMP + 80 HANUMANAS hardcoded agents
// are NOT individually attributable in LlmCallLog today: every one of the 38
// orchestrator agent functions tags agentType:'orchestrator' uniformly (see
// kimmpOrchestrator.service.ts's haiku/sonnet/opus wrappers), and HANUMANAS's
// shared callLLM() helper sets no agentRole at all, only a constant
// sourceModule. Shown here as three honest aggregate buckets rather than
// faking per-agent rows the data can't support — full migration of the
// existing 118 hardcoded agents to per-agent attribution is future scope.
router.get('/agents/performance', ...guard, async (_req, res) => {
  try {
    const since = new Date(Date.now() - 30 * 86_400_000)
    const dbAgents = await prisma.kimmpAgent.findMany({ orderBy: { createdAt: 'desc' } })

    const agents = await Promise.all(dbAgents.map(async agent => {
      const [calls, runCount, quality] = await Promise.all([
        prisma.llmCallLog.findMany({
          where: { agentRole: agent.name, sourceModule: 'AGENT_STUDIO', createdAt: { gte: since } },
          select: { totalCost: true, latencyMs: true, status: true, toolExecutionIds: true },
        }),
        (prisma as any).kimmpAgentLog.count({ where: { agentId: agent.id, createdAt: { gte: since } } }).catch(() => 0),
        (prisma as any).aIEvaluation.aggregate({
          where: { targetType: 'AGENT', targetId: agent.id },
          _avg: { overall: true }, _count: { _all: true },
        }).catch(() => null),
      ])
      return {
        agent: { id: agent.id, name: agent.name, role: agent.role, status: agent.status, model: agent.model },
        callCount:       calls.length,
        cost:            calls.reduce((s, c) => s + c.totalCost, 0),
        avgLatencyMs:    calls.length ? Math.round(calls.reduce((s, c) => s + c.latencyMs, 0) / calls.length) : 0,
        errorCount:      calls.filter(c => c.status === 'ERROR').length,
        toolInvocations: calls.reduce((s, c) => s + c.toolExecutionIds.length, 0),
        runCount,
        avgQuality: quality?._avg?.overall ?? null,
        evalCount:  quality?._count?._all ?? 0,
      }
    }))

    const bucket = async (label: string, where: any) => {
      const calls = await prisma.llmCallLog.findMany({ where: { ...where, createdAt: { gte: since } }, select: { totalCost: true, latencyMs: true, status: true } })
      return {
        label,
        callCount:    calls.length,
        cost:         calls.reduce((s, c) => s + c.totalCost, 0),
        avgLatencyMs: calls.length ? Math.round(calls.reduce((s, c) => s + c.latencyMs, 0) / calls.length) : 0,
        errorCount:   calls.filter(c => c.status === 'ERROR').length,
      }
    }
    const legacyBuckets = await Promise.all([
      bucket('KIMMP Orchestrator — 38 hardcoded agents (aggregate)', { agentRole: 'orchestrator' }),
      bucket('KIMMP Speak — system voice synthesis', { agentRole: 'KIMMP_SPEAK' }),
      bucket('HANUMANAS Engine — 80 hardcoded agents (aggregate)', { actorType: 'HANUMANAS' }),
    ])

    res.json({ agents, legacyBuckets })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── Operational Webhook Subscriptions (S326) ────────────────────────────────
// Partner-facing counterpart to admin-ontology.ts's /subscriptions — same
// shape, scoped to KIMMP operational events (eval drift, budget breach)
// instead of ontology object mutations.

router.get('/subscriptions', ...guard, async (_req, res) => {
  try {
    const subscriptions = await (prisma as any).kimmpOperationalSubscription.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ subscriptions: subscriptions.map((s: any) => ({ ...s, secret: s.secret.slice(0, 6) + '••••••••' })) })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/subscriptions', ...guard, async (req, res) => {
  const { name, url, eventTypes } = req.body
  try {
    if (!name?.trim() || !url?.trim()) { res.status(400).json({ error: 'name and url are required' }); return }
    const subscription = await (prisma as any).kimmpOperationalSubscription.create({
      data: {
        name: name.trim(),
        url: url.trim(),
        secret: `whsec_${crypto.randomBytes(24).toString('hex')}`,
        eventTypes: eventTypes ?? ['eval.drift_alert', 'budget.exceeded'],
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
    const subscription = await (prisma as any).kimmpOperationalSubscription.update({
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
    await (prisma as any).kimmpOperationalSubscription.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/subscriptions/:id/test', ...guard, async (req, res) => {
  try {
    const subscription = await KimmpOperationalWebhookService.test(req.params.id)
    res.json({ subscription })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

export default router

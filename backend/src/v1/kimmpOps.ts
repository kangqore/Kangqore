/**
 * @openapi
 * tags:
 *   - name: v1/KimmpOps
 *     description: Partner-facing read access to KIMMP's operational surface — Gateway, Prompt Registry, Eval, Agent Studio. Distinct from v1/Ontology, which covers business objects, not AI operations.
 */
// S326 — KIMMP Operational API. Mounted under /api/v1/kimmp, reachable only
// via apiKeyAuth (see index.ts's /api/v1 mount) — same auth as the S306/S307
// ontology surface. Deliberately read-only and metadata-scoped: call rows
// expose cost/latency/status, never raw prompt/response text; prompts expose
// name/version, never content; agents expose role/model, never systemPrompt.
// A partner building observability tooling against KIMMP needs the former,
// not the latter.
import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const kimmpOpsV1Router = Router()

function paginate(query: Record<string, any>): { skip: number; take: number } {
  const page  = Math.max(1, parseInt(String(query.page  ?? 1),  10))
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? 20), 10)))
  return { skip: (page - 1) * limit, take: limit }
}

/**
 * @openapi
 * /v1/kimmp/calls:
 *   get:
 *     tags: [v1/KimmpOps]
 *     summary: List LLM Gateway calls (metadata only — no prompt/response text)
 *     security: [{ apiKeyAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [SUCCESS, ERROR, BLOCKED] }
 */
kimmpOpsV1Router.get('/calls', async (req: Request, res: Response) => {
  try {
    const { skip, take } = paginate(req.query)
    const where: any = {}
    if (req.query.status) where.status = String(req.query.status)

    const [data, total] = await Promise.all([
      prisma.llmCallLog.findMany({
        where, orderBy: { createdAt: 'desc' }, skip, take,
        select: {
          id: true, actorType: true, model: true, provider: true, promptTokens: true,
          completionTokens: true, totalCost: true, latencyMs: true, taskType: true,
          agentRole: true, status: true, promptName: true, promptVersion: true, createdAt: true,
        },
      }),
      prisma.llmCallLog.count({ where }),
    ])
    res.json({ data, total, page: Math.floor(skip / take) + 1, limit: take })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

/**
 * @openapi
 * /v1/kimmp/cost:
 *   get:
 *     tags: [v1/KimmpOps]
 *     summary: Cost analytics summary over the last N days
 *     security: [{ apiKeyAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema: { type: integer, default: 30, maximum: 90 }
 */
kimmpOpsV1Router.get('/cost', async (req: Request, res: Response) => {
  try {
    const days = Math.min(90, Math.max(1, parseInt(String(req.query.days ?? 30), 10)))
    const since = new Date(Date.now() - days * 86_400_000)
    const agg = await prisma.llmCallLog.aggregate({
      where: { createdAt: { gte: since } },
      _sum: { totalCost: true, promptTokens: true, completionTokens: true },
      _count: { _all: true },
    })
    res.json({
      data: {
        days,
        totalCost:   agg._sum.totalCost ?? 0,
        totalTokens: (agg._sum.promptTokens ?? 0) + (agg._sum.completionTokens ?? 0),
        callCount:   agg._count._all,
      },
    })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

/**
 * @openapi
 * /v1/kimmp/prompts:
 *   get:
 *     tags: [v1/KimmpOps]
 *     summary: List registered prompt names and version counts (metadata only — no content)
 *     security: [{ apiKeyAuth: [] }]
 */
kimmpOpsV1Router.get('/prompts', async (_req: Request, res: Response) => {
  try {
    const { PromptRegistry } = await import('../kangqore-immp/wir/promptRegistry.service')
    const data = await PromptRegistry.listNames()
    res.json({ data, count: data.length })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

/**
 * @openapi
 * /v1/kimmp/readiness:
 *   get:
 *     tags: [v1/KimmpOps]
 *     summary: Platform readiness — Gate 1-7 aggregate (same data as the admin readiness dashboard)
 *     security: [{ apiKeyAuth: [] }]
 */
kimmpOpsV1Router.get('/readiness', async (_req: Request, res: Response) => {
  try {
    const [latestBenchmark, latestGate35] = await Promise.all([
      (prisma as any).kimmpBenchmarkRun.findFirst({ orderBy: { startedAt: 'desc' }, select: { totalScore: true, passCount: true, driftAlert: true, startedAt: true } }).catch(() => null),
      (prisma as any).waandaGate35Run.findFirst({ orderBy: { createdAt: 'desc' }, select: { totalScore: true, passCount: true, failCount: true, completedAt: true } }).catch(() => null),
    ])
    res.json({
      data: {
        benchmark: latestBenchmark ? { score: latestBenchmark.totalScore, passCount: latestBenchmark.passCount, driftAlert: latestBenchmark.driftAlert, at: latestBenchmark.startedAt } : null,
        runtime35: latestGate35 ? { score: latestGate35.totalScore, passCount: latestGate35.passCount, failCount: latestGate35.failCount, at: latestGate35.completedAt } : null,
      },
    })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

/**
 * @openapi
 * /v1/kimmp/agents:
 *   get:
 *     tags: [v1/KimmpOps]
 *     summary: List Agent Studio agents (metadata only — no systemPrompt)
 *     security: [{ apiKeyAuth: [] }]
 */
kimmpOpsV1Router.get('/agents', async (_req: Request, res: Response) => {
  try {
    const agents = await prisma.kimmpAgent.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, role: true, description: true, status: true, model: true, tools: true, maxLevel: true, createdAt: true },
    })
    res.json({ data: agents, count: agents.length })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

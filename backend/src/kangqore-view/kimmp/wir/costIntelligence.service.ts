// E3 — Cost Intelligence
// Per-call cost tracking with full context: workflow, agent, decision, goal.
// Enables: "What did this workflow cost?" "Which agent is most expensive?"

import { prisma } from '../../../lib/prisma'
import { AIModelRegistry } from './modelRegistry.service'

export interface CostContext {
  modelName:     string
  provider?:     string
  agentType?:    string
  capability?:   string
  workflowRunId?: string
  decisionId?:   string
  goalId?:       string
  tokensIn:      number
  tokensOut:     number
  latencyMs:     number
  success:       boolean
}

export interface CostSummary {
  totalUsd:      number
  totalCalls:    number
  totalTokensIn: number
  totalTokensOut: number
  byModel:       Array<{ modelName: string; calls: number; costUsd: number; avgLatencyMs: number }>
  byAgent:       Array<{ agentType: string; calls: number; costUsd: number }>
  byCapability:  Array<{ capability: string; calls: number; costUsd: number }>
  monthlyProjectionUsd: number
}

export class CostIntelligence {

  static async record(ctx: CostContext): Promise<number> {
    const costUsd = AIModelRegistry.estimateCost(ctx.modelName, ctx.tokensIn, ctx.tokensOut)
    try {
      await (prisma as any).aICostEntry.create({
        data: {
          modelName:     ctx.modelName,
          provider:      ctx.provider ?? 'anthropic',
          agentType:     ctx.agentType ?? null,
          capability:    ctx.capability ?? null,
          workflowRunId: ctx.workflowRunId ?? null,
          decisionId:    ctx.decisionId ?? null,
          goalId:        ctx.goalId ?? null,
          tokensIn:      ctx.tokensIn,
          tokensOut:     ctx.tokensOut,
          costUsd,
          latencyMs:     ctx.latencyMs,
          success:       ctx.success,
        },
      })
    } catch {}
    return costUsd
  }

  static async summary(sinceDays = 30): Promise<CostSummary> {
    const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000)
    const entries: any[] = await (prisma as any).aICostEntry.findMany({
      where:   { createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
    }).catch(() => [])

    const totalUsd       = entries.reduce((s, e) => s + e.costUsd, 0)
    const totalCalls     = entries.length
    const totalTokensIn  = entries.reduce((s, e) => s + e.tokensIn,  0)
    const totalTokensOut = entries.reduce((s, e) => s + e.tokensOut, 0)

    // Group by model
    const modelMap = new Map<string, { calls: number; costUsd: number; latencies: number[] }>()
    const agentMap = new Map<string, { calls: number; costUsd: number }>()
    const capMap   = new Map<string, { calls: number; costUsd: number }>()

    for (const e of entries) {
      const m = modelMap.get(e.modelName) ?? { calls: 0, costUsd: 0, latencies: [] }
      m.calls++; m.costUsd += e.costUsd; m.latencies.push(e.latencyMs)
      modelMap.set(e.modelName, m)

      if (e.agentType) {
        const a = agentMap.get(e.agentType) ?? { calls: 0, costUsd: 0 }
        a.calls++; a.costUsd += e.costUsd
        agentMap.set(e.agentType, a)
      }

      if (e.capability) {
        const c = capMap.get(e.capability) ?? { calls: 0, costUsd: 0 }
        c.calls++; c.costUsd += e.costUsd
        capMap.set(e.capability, c)
      }
    }

    // Monthly projection: extrapolate from last 7 days
    const weekEntries = entries.filter(e => new Date(e.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    const weekCost    = weekEntries.reduce((s, e) => s + e.costUsd, 0)
    const monthlyProjectionUsd = (weekCost / 7) * 30

    return {
      totalUsd:   Math.round(totalUsd * 10000) / 10000,
      totalCalls,
      totalTokensIn,
      totalTokensOut,
      byModel: [...modelMap.entries()].map(([modelName, v]) => ({
        modelName,
        calls:       v.calls,
        costUsd:     Math.round(v.costUsd * 10000) / 10000,
        avgLatencyMs: v.latencies.length ? Math.round(v.latencies.reduce((a, b) => a + b) / v.latencies.length) : 0,
      })).sort((a, b) => b.costUsd - a.costUsd),
      byAgent: [...agentMap.entries()].map(([agentType, v]) => ({
        agentType, calls: v.calls, costUsd: Math.round(v.costUsd * 10000) / 10000,
      })).sort((a, b) => b.costUsd - a.costUsd),
      byCapability: [...capMap.entries()].map(([capability, v]) => ({
        capability, calls: v.calls, costUsd: Math.round(v.costUsd * 10000) / 10000,
      })).sort((a, b) => b.costUsd - a.costUsd),
      monthlyProjectionUsd: Math.round(monthlyProjectionUsd * 100) / 100,
    }
  }

  static async workflowCost(workflowRunId: string): Promise<number> {
    const entries: any[] = await (prisma as any).aICostEntry.findMany({
      where: { workflowRunId },
      select: { costUsd: true },
    }).catch(() => [])
    return entries.reduce((s, e) => s + e.costUsd, 0)
  }

  static async recentEntries(limit = 50): Promise<any[]> {
    return (prisma as any).aICostEntry.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    }).catch(() => [])
  }
}

// WIR — WAANDA Intelligence Runtime
// The unified AI infrastructure layer beneath WAOE.
// Every AI capability (planner, simulator, decision engine, coordinator) routes through here.
//
//   WAANDA
//     ↓ WAOE (autonomous operations)
//     ↓ WIR  (intelligence runtime)
//       ├── Model Registry     (which model to use)
//       ├── Prompt Registry    (versioned system prompts)
//       ├── Intelligent Router (capability → model → call)
//       ├── Cost Intelligence  (per-call cost tracking)
//       └── Evaluation        (quality scores)
//         ↓ LLMs

import { AIModelRegistry } from './modelRegistry.service'
import { PromptRegistry } from './promptRegistry.service'
import { CostIntelligence } from './costIntelligence.service'
import { EvaluationFramework } from './evaluationFramework.service'
import { IntelligentRouter, RoutedCallOptions, IntelligentRouterResult } from './intelligentRouter.service'
import { textOf } from '../llm/kimmpLLMRouter'
import { prisma } from '../../lib/prisma'

export { textOf }

export interface WIRCallOptions extends RoutedCallOptions {
  // Optional: auto-evaluate after the call
  autoEval?:     boolean
  evalTargetType?: 'DECISION' | 'WORKFLOW' | 'AGENT'
  evalTargetId?:   string
}

export interface WIRResult extends IntelligentRouterResult {
  text: string
}

export class WIR {
  static readonly VERSION = '1.0.0'
  static readonly NAME    = 'WAANDA Intelligence Runtime'

  // ── Primary call entry point ──────────────────────────────────────────────
  static async call(opts: WIRCallOptions): Promise<WIRResult> {
    const result = await IntelligentRouter.call(opts)
    const text   = textOf(result)

    // Fire-and-forget: auto-evaluate if requested
    if (opts.autoEval && opts.evalTargetId && opts.evalTargetType === 'DECISION') {
      EvaluationFramework.scoreDecision(opts.evalTargetId).catch(() => {})
    }

    return { ...result, text }
  }

  // ── Model Registry ────────────────────────────────────────────────────────
  static get registry() { return AIModelRegistry }

  // ── Prompt Registry ───────────────────────────────────────────────────────
  static get prompts() { return PromptRegistry }

  // ── Cost Intelligence ─────────────────────────────────────────────────────
  static get costs() { return CostIntelligence }

  // ── Evaluation ────────────────────────────────────────────────────────────
  static get evals() { return EvaluationFramework }

  // ── Aggregate dashboard data for E6 ──────────────────────────────────────
  static async dashboard() {
    const [models, costSummary, promptNames, recentEvals, agentQuality] = await Promise.all([
      AIModelRegistry.health(),
      CostIntelligence.summary(30),
      PromptRegistry.listNames(),
      EvaluationFramework.list(undefined, 20),
      EvaluationFramework.agentQuality(30),
    ])

    // Compute overall AI health
    const healthy    = models.filter(m => m.status === 'HEALTHY').length
    const degraded   = models.filter(m => m.status === 'DEGRADED').length
    const offline    = models.filter(m => m.status === 'OFFLINE').length
    const aiHealth   = offline > 0 ? 'DEGRADED' : degraded > 0 ? 'DEGRADED' : 'HEALTHY'

    // Router stats from existing router
    const { getRouterStats } = await import('../llm/kimmpLLMRouter')
    const routerStats = await getRouterStats()

    return {
      version:      WIR.VERSION,
      aiHealth,
      models: {
        all:      models,
        healthy, degraded, offline,
      },
      costs:        costSummary,
      prompts:      promptNames,
      recentEvals,
      agentQuality,
      router:       routerStats,
      generatedAt:  new Date().toISOString(),
    }
  }
}

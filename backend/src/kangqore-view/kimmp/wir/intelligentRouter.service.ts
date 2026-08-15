// E5 — Intelligent Model Router
// Replaces hardcoded `sonnet()` / `haiku()` / `opus()` calls.
// Every AI call flows through: declare capability → registry picks model → call → record cost.

import { routedCall, RouterResult, textOf } from '../llm/kimmpLLMRouter'
import { AIModelRegistry, ModelCapability, ModelPriority } from './modelRegistry.service'
import { PromptRegistry } from './promptRegistry.service'
import { CostIntelligence } from './costIntelligence.service'

export interface RoutedCallOptions {
  // What this call needs to do (registry picks the model)
  capability:    ModelCapability
  priority?:     ModelPriority

  // Prompt content
  system:        string
  user:          string
  maxTokens?:    number

  // Context for cost tracking
  agentType?:    string
  workflowRunId?: string
  decisionId?:   string
  goalId?:       string

  // Optional: fetch system prompt from registry by name (overrides `system` if found)
  promptName?:   string
}

export interface IntelligentRouterResult extends RouterResult {
  modelId:     string
  capability:  ModelCapability
  costUsd:     number
  latencyMs:   number
}

export class IntelligentRouter {

  static async call(opts: RoutedCallOptions): Promise<IntelligentRouterResult> {
    const start     = Date.now()
    const resolved  = AIModelRegistry.resolve({ capability: opts.capability, priority: opts.priority })

    // Optionally load system prompt from registry
    let system = opts.system
    if (opts.promptName) {
      const registered = await PromptRegistry.get(opts.promptName)
      if (registered) system = registered
    }

    let result: RouterResult
    let success = true

    try {
      result = await routedCall(resolved.modelId, system, opts.user, opts.maxTokens ?? 900)
    } catch (err) {
      success = false
      // Try fallback model
      const fallback = AIModelRegistry.resolve({ capability: opts.capability, priority: 'speed' })
      result = await routedCall(fallback.modelId, system, opts.user, opts.maxTokens ?? 900)
    }

    const latencyMs = Date.now() - start

    // Estimate tokens (rough: 1 token ≈ 4 chars)
    const tokensIn  = Math.ceil(system.length / 4 + opts.user.length / 4)
    const tokensOut = Math.ceil(textOf(result).length / 4)

    // Record health + cost (fire and forget)
    AIModelRegistry.recordCall(resolved.modelId, latencyMs, success)
    const costUsd = await CostIntelligence.record({
      modelName:    resolved.modelId,
      provider:     resolved.provider,
      agentType:    opts.agentType,
      capability:   opts.capability,
      workflowRunId: opts.workflowRunId,
      decisionId:   opts.decisionId,
      goalId:       opts.goalId,
      tokensIn,
      tokensOut,
      latencyMs,
      success,
    }).catch(() => 0)

    return {
      ...result,
      modelId:    resolved.modelId,
      capability: opts.capability,
      costUsd,
      latencyMs,
    }
  }
}

// Convenience helpers matching the existing haiku/sonnet/opus API
// but with automatic capability-based routing

export function plan(system: string, user: string, maxTokens = 2000, ctx?: Partial<RoutedCallOptions>) {
  return IntelligentRouter.call({ capability: 'planning', priority: 'quality', system, user, maxTokens, ...ctx })
}

export function reason(system: string, user: string, maxTokens = 1500, ctx?: Partial<RoutedCallOptions>) {
  return IntelligentRouter.call({ capability: 'strategic_reasoning', priority: 'quality', system, user, maxTokens, ...ctx })
}

export function summarise(system: string, user: string, maxTokens = 600, ctx?: Partial<RoutedCallOptions>) {
  return IntelligentRouter.call({ capability: 'summarization', priority: 'speed', system, user, maxTokens, ...ctx })
}

export function classify(system: string, user: string, maxTokens = 300, ctx?: Partial<RoutedCallOptions>) {
  return IntelligentRouter.call({ capability: 'classification', priority: 'cost', system, user, maxTokens, ...ctx })
}

export function fast(system: string, user: string, maxTokens = 500, ctx?: Partial<RoutedCallOptions>) {
  return IntelligentRouter.call({ capability: 'fast_response', priority: 'speed', system, user, maxTokens, ...ctx })
}

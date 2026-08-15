// ---------------------------------------------------------------------------
// WAANDA AI Runtime
//
// The public interface for all AI inference in Kangqore OS.
// Consumers ask for a CAPABILITY — not a provider.
//
//   call('strategic', system, user)   → Claude Opus   (deep reasoning)
//   call('reasoning', system, user)   → Claude Sonnet (balanced)
//   call('fast',      system, user)   → Gemini Flash  (low-latency)
//   call('cheap',     system, user)   → GPT-4o Mini   (cost-sensitive)
//
// This decouples the platform from vendors.
// Swapping providers never requires changes to callers.
//
// The runtime owns:
//   · capability → provider mapping
//   · provider priority chain per capability
//   · circuit breaker state visibility
//   · maintenance mode per provider
//   · health + readiness reporting
// ---------------------------------------------------------------------------

import {
  routedCall,
  haiku, sonnet, opus, textOf,
  getRouterStats, getCircuitBreakerStatus,
  setProviderMaintenance, setProviderWarming, recordWarmingProbe, providerHealth,
  type RouterMeta, type RouterResult, type ProviderHealth,
} from '../llm/kimmpLLMRouter'
import { recordRuntimeCall, recordFailedCall } from './waandaRuntimeIntelligence.service'

// ─── Capability profiles ──────────────────────────────────────────────────────
// Each capability maps to a preferred Claude model (the router then falls through
// to OpenAI → Gemini → Ollama if Claude is unavailable).
//
// Future: when OpenAI / Gemini provider routing is per-capability (not just
// fallback), the profile can specify `preferredProvider` too.

export type Capability =
  | 'strategic'    // deep multi-step reasoning — decisions, analysis, strategy
  | 'reasoning'    // balanced reasoning — planning, structured output
  | 'fast'         // low-latency — short classification, routing, tagging
  | 'cheap'        // cost-sensitive bulk — extraction, summarisation at scale
  | 'command'      // WAANDA chat — conversational, multi-turn

const CAPABILITY_PROFILES: Record<Capability, { claudeModel: string; maxTokens: number }> = {
  strategic: { claudeModel: 'claude-opus-4-8',          maxTokens: 2000 },
  reasoning: { claudeModel: 'claude-sonnet-4-6',        maxTokens: 1200 },
  fast:      { claudeModel: 'claude-haiku-4-5-20251001', maxTokens: 600  },
  cheap:     { claudeModel: 'claude-haiku-4-5-20251001', maxTokens: 800  },
  command:   { claudeModel: 'claude-sonnet-4-6',        maxTokens: 1500 },
}

// ─── Runtime call ─────────────────────────────────────────────────────────────

export async function call(
  capability: Capability,
  system: string,
  user: string,
  meta: RouterMeta = {},
  maxTokensOverride?: number,
): Promise<RouterResult> {
  const profile = CAPABILITY_PROFILES[capability]
  const t0 = Date.now()

  try {
    const result = await routedCall(
      profile.claudeModel,
      system,
      user,
      maxTokensOverride ?? profile.maxTokens,
      { ...meta, tags: [...(meta.tags ?? []), `capability:${capability}`] },
    )
    // fire-and-forget — never awaited so it cannot slow down callers
    recordRuntimeCall({ capability, result, latencyMs: Date.now() - t0, callerHint: meta.hint }).catch(() => {})
    return result
  } catch (err: any) {
    recordFailedCall({ capability, latencyMs: Date.now() - t0, errorCode: err.code ?? 'UNKNOWN', callerHint: meta.hint }).catch(() => {})
    throw err
  }
}

// ─── Health model ─────────────────────────────────────────────────────────────

export interface RuntimeHealth {
  overall:   ProviderHealth   // worst-case across active providers
  providers: Record<string, { health: ProviderHealth; available: boolean; calls: number }>
  anyUp:     boolean
}

export async function getRuntimeHealth(): Promise<RuntimeHealth> {
  const stats = await getRouterStats()
  const providers: RuntimeHealth['providers'] = {}

  for (const p of stats.providers) {
    providers[p.name] = {
      health:    p.health as ProviderHealth,
      available: p.available,
      calls:     p.calls,
    }
  }

  const activeHealths = Object.values(providers)
    .filter(p => p.available)
    .map(p => p.health)

  const healthRank: Record<ProviderHealth, number> = {
    healthy:     0,
    warming:     1,
    degraded:    2,
    recovering:  3,
    offline:     4,
    maintenance: 5,
  }

  const worst = activeHealths.reduce<ProviderHealth>((w, h) =>
    healthRank[h] > healthRank[w] ? h : w,
    'healthy'
  )

  return {
    overall:  activeHealths.length === 0 ? 'offline' : worst,
    providers,
    anyUp:    activeHealths.some(h => h !== 'offline' && h !== 'maintenance'),
  }
}

// ─── Re-exports (backward compat for existing callers) ───────────────────────
// Services that import { sonnet, haiku, opus, textOf } from kimmpLLMRouter
// continue to work unchanged. New code should prefer call() with a capability.

export {
  haiku, sonnet, opus, textOf,
  routedCall, getRouterStats, getCircuitBreakerStatus,
  setProviderMaintenance, setProviderWarming, recordWarmingProbe, providerHealth,
}
export type { RouterMeta, RouterResult, ProviderHealth }

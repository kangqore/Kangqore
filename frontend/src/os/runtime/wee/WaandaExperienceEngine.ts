// WAANDA Experience Engine (WEE) — Generation III Runtime
// Constitutional role: pure projection. No reasoning. No business logic.
// No enterprise state ownership. No API calls. No UI knowledge.

import {
  CognitiveStateAdapter,
  DEFAULT_PROJECTION_POLICY,
  ExperienceContract,
  ExperienceModel,
  ProjectionPolicy,
  ProjectionScope,
  WaandaCognitiveState,
} from './types'
import { WaandaCognitiveMirror } from './WaandaCognitiveMirror'

class WaandaExperienceEngineClass {
  private readonly adapters = new Map<ProjectionScope, CognitiveStateAdapter>()

  registerAdapter(adapter: CognitiveStateAdapter): void {
    this.adapters.set(adapter.projectionScope, adapter)
  }

  async project(
    contract: ExperienceContract,
    policy: ProjectionPolicy = DEFAULT_PROJECTION_POLICY,
    stateOverride?: WaandaCognitiveState,
  ): Promise<ExperienceModel> {
    const waandaState = stateOverride ?? WaandaCognitiveMirror.getState()
    const adapter = this.adapters.get(contract.projectionScope)

    // Law 1 runtime guard: adapters receive a frozen copy — mutation throws at runtime.
    // Law 2 runtime guard: frozen shallow copy prevents adapters enriching the canonical state.
    const frozenState = Object.freeze({ ...waandaState }) as Readonly<WaandaCognitiveState>

    let payload: Record<string, unknown> = {}
    if (adapter) {
      payload = await adapter.adapt(frozenState, contract, policy)
    }

    for (const field of policy.redactedFields) {
      delete payload[field]
    }

    // Inject breadcrumbs from contract context — workspace title passed by WorkspaceOrchestrator.
    if (!payload.breadcrumbs && contract.context?.workspaceTitle) {
      payload.breadcrumbs = [
        { id: 'keos', label: 'KEOS' },
        { id: contract.context.workspaceId ?? contract.projectionScope, label: contract.context.workspaceTitle },
      ]
    }

    // Inject WAANDA suggestions from top briefing recommendations — universal across all workspaces.
    if (!payload.waandaSuggestions) {
      payload.waandaSuggestions = waandaState.systemBriefings.slice(0, 2).map((b, i) => ({
        id:      b.id ?? `sug_${i}`,
        text:    b.summary,
        options: (b.recommendations ?? []).slice(0, 2).map((r, j) => ({
          id: `opt_${i}_${j}`, label: typeof r === 'string' ? r : String(r),
        })),
      }))
    }

    return {
      projectionScope: contract.projectionScope,
      projectedAt: new Date(),
      cognitivePhase: waandaState.phase,
      payload,
      confidence: waandaState.confidence,
    }
  }
}

export const WaandaExperienceEngine = new WaandaExperienceEngineClass()

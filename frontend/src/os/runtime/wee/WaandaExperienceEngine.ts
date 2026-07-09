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
  private adapters = new Map<ProjectionScope, CognitiveStateAdapter>()

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

    let payload: Record<string, unknown> = {}
    if (adapter) {
      payload = await adapter.adapt(waandaState, contract, policy)
    }

    for (const field of policy.redactedFields) {
      delete payload[field]
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

// Operations Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Operations workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const OperationsCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'OPERATIONS',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const pendingExecutionApprovals = state.pendingDecisions.filter(d => d.level <= 2)
    const capacityForecasts = state.enterprisePredictions.filter(
      p => p.target === 'CAPACITY' || p.target === 'INVENTORY'
    )

    return {
      waandaPhase: state.phase,
      pendingExecutionApprovals,
      pendingApprovalCount: pendingExecutionApprovals.length,
      operationalDomains: state.domains.map(d => ({
        id: d.id,
        name: d.name,
        ready: d.ready,
        capabilities: d.capabilities ?? 0,
        kpis: d.kpis ?? [],
      })),
      capacityForecasts,
      kimmSynthesis: state.kimmSynthesis,
      confidence: state.confidence,
    }
  },
}

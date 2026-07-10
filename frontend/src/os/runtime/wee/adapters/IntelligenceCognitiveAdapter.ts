// Enterprise Intelligence Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Enterprise Intelligence workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const IntelligenceCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'INTELLIGENCE',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const activeDrifts = state.enterprisePredictions.filter(p => p.driftDetected)

    return {
      waandaPhase: state.phase,
      predictions: state.enterprisePredictions,
      totalPredictions: state.enterprisePredictions.length,
      activeDrifts: activeDrifts.length,
      highConfidencePredictions: state.enterprisePredictions.filter(p => p.confidence >= 0.8).length,
      analyticsBriefings: state.systemBriefings.slice(0, 5),
      domainIntelligence: state.domains.map(d => ({
        id: d.id,
        name: d.name,
        ready: d.ready,
        kpis: d.kpis ?? [],
      })),
      confidence: state.confidence,
    }
  },
}

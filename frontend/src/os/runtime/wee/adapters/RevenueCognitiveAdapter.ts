// Revenue Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Revenue workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const RevenueCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'REVENUE',

  async adapt(state: WaandaCognitiveState, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const { liveSessions, evidenceLedger } = state.relationshipIntelligence
    const avgTrust =
      liveSessions.length > 0
        ? liveSessions.reduce((sum, s) => sum + s.trustScore, 0) / liveSessions.length
        : 0

    const salesDomain = state.domains.find(
      d => d.id === 'sales' || d.name?.toLowerCase().includes('sales')
    ) ?? null

    return {
      waandaPhase: state.phase,
      liveSessions,
      activeRelationships: liveSessions.length,
      avgTrustScore: Math.round(avgTrust * 10) / 10,
      evidenceLedger,
      evidenceCount: evidenceLedger.length,
      salesDomain,
      kimmSynthesis: state.kimmSynthesis,
      confidence: state.confidence,
    }
  },
}

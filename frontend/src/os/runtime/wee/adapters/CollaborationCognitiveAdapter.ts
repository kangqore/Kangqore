// Collaboration Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Collaboration workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const CollaborationCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'COLLABORATION',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const { liveSessions, evidenceLedger } = state.relationshipIntelligence
    const pendingApprovals = state.pendingDecisions.filter(d => d.level >= 3)

    return {
      waandaPhase: state.phase,
      liveSessions,
      activeSessionCount: liveSessions.length,
      pendingApprovals,
      pendingApprovalCount: pendingApprovals.length,
      evidenceLedger,
      kimmSynthesis: state.kimmSynthesis,
      confidence: state.confidence,
    }
  },
}

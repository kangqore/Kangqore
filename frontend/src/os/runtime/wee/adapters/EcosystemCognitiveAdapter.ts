// Ecosystem Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Ecosystem workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const EcosystemCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'ECOSYSTEM',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const { liveSessions, evidenceLedger } = state.relationshipIntelligence
    const avgExternalTrust = liveSessions.length > 0
      ? liveSessions.reduce((s, e) => s + e.trustScore, 0) / liveSessions.length
      : 0

    return {
      waandaPhase: state.phase,
      externalSessions: liveSessions,
      externalSessionCount: liveSessions.length,
      evidenceLedger,
      evidenceCount: evidenceLedger.length,
      avgExternalTrust: Math.round(avgExternalTrust * 100) / 100,
      ecosystemDomains: state.domains.map(d => ({
        id: d.id,
        name: d.name,
        ready: d.ready,
        capabilities: d.capabilities ?? 0,
      })),
      kimmSynthesis: state.kimmSynthesis,
      confidence: state.confidence,
    }
  },
}

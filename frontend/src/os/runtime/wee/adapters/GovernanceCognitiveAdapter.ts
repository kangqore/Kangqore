// Governance Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Governance workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const GovernanceCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'GOVERNANCE',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const domainRiskExposure = state.domains.map(d => ({
      id: d.id,
      name: d.name,
      ready: d.ready,
      breachedKpis: (d.kpis ?? []).filter(k => k.current < k.target),
    }))

    const domainIntelligence = state.domains.map(d => ({
      id: d.id,
      name: d.name,
      ready: d.ready,
      kpis: d.kpis ?? [],
    }))

    return {
      waandaPhase: state.phase,
      pendingDecisions: state.pendingDecisions,
      openDecisionCount: state.pendingDecisions.length,
      complianceBriefings: state.systemBriefings.slice(0, 3),
      domainRiskExposure,
      domainIntelligence,
      totalBreachedKpis: domainRiskExposure.reduce((sum, d) => sum + d.breachedKpis.length, 0),
      evidenceLedger: state.relationshipIntelligence.evidenceLedger,
      platformConfidence: state.confidence,
    }
  },
}

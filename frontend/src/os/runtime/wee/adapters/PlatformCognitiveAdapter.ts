// Platform Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Platform (DevX) workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const PlatformCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'PLATFORM',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const nominalPhases = state.phases.filter(p => p.status === 'PASS').length
    const domainCapabilities = state.domains.reduce((sum, d) => sum + (d.capabilities ?? 0), 0)

    return {
      waandaPhase: state.phase,
      bootStatus: state.bootStatus,
      phases: state.phases,
      subsystems: state.subsystems,
      activeCapabilities: state.activeCapabilities,
      platformHealth: {
        total: state.phases.length,
        nominal: nominalPhases,
        healthPercent: state.phases.length > 0
          ? Math.round((nominalPhases / state.phases.length) * 100)
          : 0,
      },
      registeredDomains: state.domains.length,
      domainCapabilities,
      confidence: state.confidence,
    }
  },
}

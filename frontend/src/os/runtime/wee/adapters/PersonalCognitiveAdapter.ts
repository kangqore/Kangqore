// Personal Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Personal workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const PersonalCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'PERSONAL',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const totalSubsystems = Object.keys(state.subsystems).length
    const operational = Object.values(state.subsystems).filter(s => s === 'OPERATIONAL').length

    return {
      waandaPhase: state.phase,
      bootStatus: state.bootStatus,
      bootedAt: state.bootedAt,
      phases: state.phases,
      subsystemHealth: {
        total: totalSubsystems,
        operational,
        healthPercent: totalSubsystems > 0 ? Math.round((operational / totalSubsystems) * 100) : 0,
      },
      latestSynthesis: state.kimmSynthesis,
      activeMissions: [],
      lastSynced: state.lastSynced,
      confidence: state.confidence,
    }
  },
}

// Personal Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Personal workspace experience.
// Never fetches. Adapts only what WAANDA already knows (Constitutional Law 2).

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const PersonalCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'PERSONAL',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const totalSubsystems = Object.keys(state.subsystems).length
    const operational = Object.values(state.subsystems).filter(s => s === 'OPERATIONAL').length

    // Derive active missions from high-priority system briefings
    const activeMissions = state.systemBriefings
      .filter(b => b.priority === 'HIGH' || b.priority === 'CRITICAL')
      .map(b => ({
        goal:       b.summary,
        status:     'ACTIVE',
        priority:   b.priority,
        confidence: b.confidence,
        findings:   b.keyFindings ?? [],
      }))

    // Briefings as knowledge items (all priorities)
    const systemBriefings = state.systemBriefings

    // Notifications = briefings that carry alerts
    const notifications = state.systemBriefings.filter(b => b.alerts && b.alerts.length > 0)

    // focusItems — work-mode summary derived from personal task list
    const tasks = state.personalSummary?.tasks ?? []
    const focusItems = {
      critical:  tasks.filter(t => t.overdue).length,
      scheduled: tasks.filter(t => t.dueToday && !t.overdue).length,
      waiting:   tasks.filter(t => t.status === 'IN_REVIEW' || t.status === 'WAITING').length,
      blocked:   tasks.filter(t => t.status === 'BLOCKED').length,
    }

    return {
      waandaPhase:   state.phase,
      bootStatus:    state.bootStatus,
      bootedAt:      state.bootedAt,
      phases:        state.phases,
      subsystemHealth: {
        total:          totalSubsystems,
        operational,
        healthPercent:  totalSubsystems > 0 ? Math.round((operational / totalSubsystems) * 100) : 0,
      },
      latestSynthesis:      state.kimmSynthesis,
      activeMissions,
      systemBriefings,
      briefings:            state.systemBriefings,
      notifications,
      focusItems,
      pendingApprovals:     state.pendingDecisions,
      pendingDecisions:     state.pendingDecisions,
      enterprisePredictions: state.enterprisePredictions,
      tasks:         tasks,
      calendarEvents: state.personalSummary?.calendarEvents ?? [],
      lastSynced:    state.lastSynced,
      confidence:    state.confidence,
    }
  },
}

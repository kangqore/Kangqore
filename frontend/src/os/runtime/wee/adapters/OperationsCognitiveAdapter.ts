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

    const projects = state.projects ?? []
    const atRiskCount  = projects.filter(p => p.status === 'At Risk').length
    const watchCount   = projects.filter(p => p.status === 'Watch').length
    const onTrackCount = projects.filter(p => p.status === 'On Track').length

    // Unique leads with their project count (resource allocation view)
    const leadMap = new Map<string, { lead: string; count: number; atRisk: number }>()
    for (const p of projects) {
      const l = p.lead ?? 'Unassigned'
      const entry = leadMap.get(l) ?? { lead: l, count: 0, atRisk: 0 }
      entry.count++
      if (p.status === 'At Risk') entry.atRisk++
      leadMap.set(l, entry)
    }
    const leads = Array.from(leadMap.values()).sort((a, b) => b.count - a.count)

    // Workflow stats for automation section
    const workflows = state.workflows ?? []
    const workflowRuns = state.workflowRuns ?? []

    const byTrigger = workflows.reduce<Record<string, number>>((acc, w) => {
      acc[w.trigger] = (acc[w.trigger] ?? 0) + 1
      return acc
    }, {})

    const activeRuns    = workflowRuns.filter(r => r.status === 'RUNNING' || r.status === 'PENDING')
    const completedRuns = workflowRuns.filter(r => r.status === 'COMPLETED')
    const failedRuns    = workflowRuns.filter(r => r.status === 'FAILED')

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
      // Projects (live from PMO)
      projects,
      projectCount: projects.length,
      atRiskCount,
      watchCount,
      onTrackCount,
      leads,
      // Automation (live from WAOE)
      workflows,
      workflowRuns,
      workflowStats: {
        total: workflows.length,
        byTrigger,
        activeRuns,
        completedCount: completedRuns.length,
        failedCount: failedRuns.length,
        // Each run already has .workflow.name from the API include
        recentRuns: workflowRuns.slice(0, 6),
      },
    }
  },
}

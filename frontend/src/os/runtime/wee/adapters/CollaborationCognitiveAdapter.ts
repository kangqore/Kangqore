// Collaboration Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Collaboration workspace experience.
// Surfaces URGI enterprise conversations, scheduled meetings (with CRM linkage),
// WAANDA mission rooms, KIMMP strategic decision threads, and voice listening state.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const CollaborationCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'COLLABORATION',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const { liveSessions, evidenceLedger } = state.relationshipIntelligence
    const projects = state.projects ?? []

    // ── URGI enterprise conversations ──────────────────────────────────────────
    const conversations = liveSessions.map(s => {
      const trustPct = Math.round(s.trustScore * 100)
      let tier = 'MED'
      if (trustPct >= 75) tier = 'HIGH'
      else if (trustPct < 50) tier = 'LOW'
      return { ...s, trustPct, tier }
    })
    const highTrustSessions = liveSessions.filter(s => s.trustScore >= 0.75)
    const lowTrustSessions  = liveSessions.filter(s => s.trustScore < 0.5)
    const avgTrust = liveSessions.length > 0
      ? liveSessions.reduce((sum, x) => sum + x.trustScore, 0) / liveSessions.length
      : 0

    // ── Calendar / meetings with CRM project linkage ───────────────────────────
    const calendarEvents = state.personalSummary?.calendarEvents ?? []
    const upcomingMeetings = calendarEvents
      .filter(e => e.status !== 'CANCELLED')
      .slice(0, 6)
      .map(e => {
        const titleLower = (e.title ?? '').toLowerCase()
        const linked = projects.find(p =>
          (p.clientName && titleLower.includes(p.clientName.toLowerCase())) ||
          (p.name && titleLower.includes(p.name.toLowerCase()))
        ) ?? null
        return {
          ...e,
          linkedProject: linked
            ? { id: linked.id, name: linked.name, clientName: linked.clientName, status: linked.status }
            : null,
        }
      })

    // ── KIMMP strategic decision threads ──────────────────────────────────────
    const kimmpDecisions     = state.kimmpDecisions ?? []
    const openDecisions      = kimmpDecisions.filter(d => d.selected === null)
    const resolvedDecisions  = kimmpDecisions.filter(d => d.selected !== null)

    // ── AEGIS autonomy decisions (L3+ requiring human approval) ───────────────
    const pendingApprovals    = state.pendingDecisions.filter(d => d.level >= 3)
    const allPendingDecisions = state.pendingDecisions

    // ── Mission Rooms: WAANDA workflows as collaboration threads ───────────────
    const allWorkflows  = state.workflows ?? []
    const workflowRuns  = state.workflowRuns ?? []
    const missionRooms  = allWorkflows.slice(0, 8).map(w => {
      const runs    = workflowRuns.filter(r => r.workflowId === w.id)
      const lastRun = runs[0] ?? null
      return {
        id:            w.id,
        name:          w.name,
        description:   w.description ?? null,
        status:        w.status,
        stepCount:     w.stepCount ?? 0,
        trigger:       w.trigger,
        lastActivity:  lastRun?.startedAt ?? w.createdAt,
        lastRunStatus: lastRun?.status ?? null,
      }
    })
    const activeMissionCount = allWorkflows.filter(w => w.status === 'ACTIVE' || w.status === 'RUNNING').length

    // Active missions from CRITICAL/HIGH briefings (team mission context)
    const activeMissions = state.systemBriefings
      .filter(b => b.priority === 'HIGH' || b.priority === 'CRITICAL')
      .map(b => ({
        id:         b.id,
        goal:       b.summary,
        priority:   b.priority,
        confidence: b.confidence,
        alerts:     b.alerts ?? [],
      }))

    // ── Voice / KIMMP listening state ─────────────────────────────────────────
    const isListening = state.bootStatus === 'OPERATIONAL'

    // Shared workflow runs (human-triggered, not SYSTEM) — collaboration artifacts
    const sharedRuns = workflowRuns.filter(r => r.triggeredBy && r.triggeredBy !== 'SYSTEM')

    return {
      waandaPhase:          state.phase,
      confidence:           state.confidence,
      kimmSynthesis:        state.kimmSynthesis,

      // URGI enterprise conversations
      conversations,
      liveSessions,
      activeSessionCount:   liveSessions.length,
      highTrustSessions,
      lowTrustSessions,
      avgTrust:             Math.round(avgTrust * 100) / 100,

      // Calendar / meetings
      calendarEvents,
      upcomingMeetings,
      meetingCount:         upcomingMeetings.length,

      // KIMMP strategic decisions
      openDecisions,
      resolvedDecisions,
      openDecisionCount:    openDecisions.length,
      allKimmpDecisions:    kimmpDecisions,

      // AEGIS autonomy decisions
      pendingApprovals,
      pendingApprovalCount: pendingApprovals.length,
      allPendingDecisions,
      decisionCount:        allPendingDecisions.length,

      // Projects
      projects,
      projectCount:         projects.length,
      atRiskProjects:       projects.filter(p => p.status === 'At Risk'),
      watchProjects:        projects.filter(p => p.status === 'Watch'),

      // Mission Rooms
      missionRooms,
      activeMissionCount,
      activeMissions,

      // Evidence
      evidenceLedger,

      // Voice
      isListening,

      // Shared workflow runs
      sharedRuns,
      sharedRunCount:       sharedRuns.length,
    }
  },
}

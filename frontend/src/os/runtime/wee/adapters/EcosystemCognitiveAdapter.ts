// Ecosystem Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Ecosystem workspace experience.
// Surfaces client/partner/vendor/investor portal bridges and external trust signals.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const EcosystemCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'ECOSYSTEM',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const { liveSessions, evidenceLedger } = state.relationshipIntelligence
    const projects   = state.projects ?? []
    const financials = state.financialKpis

    // ── External trust ─────────────────────────────────────────────────────────
    const avgExternalTrust = liveSessions.length > 0
      ? liveSessions.reduce((s, e) => s + e.trustScore, 0) / liveSessions.length
      : 0

    // ── Client portals: projects grouped by clientName ─────────────────────────
    const clientNames  = [...new Set(projects.map(p => p.clientName).filter(Boolean))]
    const clientPortals = clientNames.map(client => {
      const clientProjects = projects.filter(p => p.clientName === client)
      const hasRisk    = clientProjects.some(p => p.status === 'At Risk')
      const avgProgress = clientProjects.length > 0
        ? Math.round(clientProjects.reduce((s, p) => s + (p.progress ?? 0), 0) / clientProjects.length)
        : 0
      const session = liveSessions.find(s => s.company?.toLowerCase() === client.toLowerCase())
      let portalStatus = 'WATCH'
      if (hasRisk) portalStatus = 'AT_RISK'
      else if (avgProgress >= 80) portalStatus = 'ON_TRACK'
      return {
        id:           client,
        name:         client,
        projectCount: clientProjects.length,
        hasRisk,
        avgProgress,
        trustScore:   session?.trustScore ?? null,
        status:       portalStatus,
        portalPath:   '/kangqore-view/client-portal',
      }
    })

    // ── Partner sessions / deliverables ───────────────────────────────────────
    const partnerSessions = liveSessions.filter(s =>
      (s.company ?? '').toLowerCase().includes('partner') ||
      (s as any).sessionType?.toLowerCase().includes('partner')
    )
    const partnerProjects = projects.filter(p => p.status !== 'Completed' && (p.progress ?? 0) < 100)

    // ── Vendor sessions ───────────────────────────────────────────────────────
    const vendorSessions = liveSessions.filter(s =>
      (s.company ?? '').toLowerCase().includes('vendor') ||
      (s as any).sessionType?.toLowerCase().includes('vendor')
    )

    // Remaining sessions (no explicit partner/vendor tag) for fallback lists
    const untaggedSessions = liveSessions.filter(s =>
      !partnerSessions.includes(s) && !vendorSessions.includes(s)
    )

    // ── Investor data: OIS + financials ───────────────────────────────────────
    const oisScore        = state.gate8?.oisScore ?? null
    const arrValue        = financials?.arr ?? null
    const revenueMTD      = financials?.revenueMTD ?? null
    const pipelineValue   = financials?.pipelineValue ?? null
    const activeContracts = financials?.activeContracts ?? null
    const mrrDeltaPct     = financials?.mrrDeltaPct ?? null

    // ── Project board ─────────────────────────────────────────────────────────
    const atRiskCount  = projects.filter(p => p.status === 'At Risk').length
    const watchCount   = projects.filter(p => p.status === 'Watch').length
    const onTrackCount = projects.filter(p => p.status === 'On Track').length

    // ── Portal health ─────────────────────────────────────────────────────────
    const portalHealthy = state.bootStatus === 'OPERATIONAL'

    return {
      waandaPhase: state.phase,
      externalSessions: liveSessions,
      externalSessionCount: liveSessions.length,
      evidenceLedger,
      evidenceCount: evidenceLedger.length,
      avgExternalTrust: Math.round(avgExternalTrust * 100) / 100,

      // Domain intelligence
      ecosystemDomains: state.domains.map(d => ({
        id: d.id, name: d.name, ready: d.ready, capabilities: d.capabilities ?? 0,
      })),
      domainIntelligence: state.domains.map(d => ({
        id: d.id, name: d.name, ready: d.ready, kpis: d.kpis ?? [],
      })),
      activeCapabilities: state.activeCapabilities,
      kimmSynthesis: state.kimmSynthesis,
      confidence: state.confidence,

      // Client portals
      clientPortals,
      clientPortalCount:   clientPortals.length,
      clientPortalsAtRisk: clientPortals.filter(c => c.status === 'AT_RISK').length,

      // Partner portals
      partnerSessions,
      partnerCount:            partnerSessions.length,
      partnerProjects,
      partnerDeliverableCount: partnerProjects.length,
      partnerPortalPath:       '/kangqore-view/partner-portal',

      // Vendor portals
      vendorSessions,
      vendorCount:        vendorSessions.length,
      untaggedSessions,
      vendorPortalPath:   '/kangqore-view/vendor-portal',

      // Investor portal
      oisScore,
      arrValue,
      revenueMTD,
      pipelineValue,
      activeContracts,
      mrrDeltaPct,
      investorPortalPath: '/kangqore-view/investor-portal',

      // Project board
      projects,
      atRiskCount,
      watchCount,
      onTrackCount,

      // Portal health (WAANDA operational state)
      portalHealthy,
    }
  },
}

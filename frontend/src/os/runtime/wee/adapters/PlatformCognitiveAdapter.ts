// Platform Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Platform (DevX) workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

function calcLatencyMs(startedAt: string, endedAt: string | undefined): number | null {
  if (!endedAt) return null
  try {
    return new Date(endedAt).getTime() - new Date(startedAt).getTime()
  } catch { return null }
}

export const PlatformCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'PLATFORM',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    // ── Boot / phase health ────────────────────────────────────────────────────
    const nominalPhases = state.phases.filter(p => p.status === 'PASS').length
    const healthPercent = state.phases.length > 0
      ? Math.round((nominalPhases / state.phases.length) * 100)
      : 0

    // ── Domain registry ────────────────────────────────────────────────────────
    const domains     = state.domains
    const lastSynced  = state.lastSynced ? state.lastSynced.toISOString() : null

    const domainRegistry = domains.map(d => ({
      id:           d.id,
      name:         d.name,
      ready:        d.ready,
      version:      d.version ?? null,
      purpose:      d.purpose ?? null,
      capabilities: d.capabilities ?? 0,
      goals:        d.goals ?? 0,
      objects:      d.objects ?? 0,
      kpiCount:     (d.kpis ?? []).length,
      breachedKpis: (d.kpis ?? []).filter(k => k.current < k.target).length,
      lastSynced,
    }))

    const domainRiskExposure = domains.map(d => ({
      id:          d.id,
      name:        d.name,
      ready:       d.ready,
      breachedKpis: (d.kpis ?? []).filter(k => k.current < k.target),
    }))
    const domainCapabilities = domains.reduce((sum, d) => sum + (d.capabilities ?? 0), 0)
    const totalBreachedKpis  = domainRiskExposure.reduce((sum, d) => sum + d.breachedKpis.length, 0)
    const readyDomainCount   = domains.filter(d => d.ready).length
    const notReadyDomainCount = domains.length - readyDomainCount

    // ── AEGIS security engines ─────────────────────────────────────────────────
    const aegis = state.aegisAgentSummary
    const getEngine = (name: string) => aegis?.engines.find(e => e.engine === name) ?? null

    const accessSentinel  = getEngine('ACCESS_SENTINEL')
    const egressControl   = getEngine('EGRESS_CONTROL')
    const sovereignty     = getEngine('SOVEREIGNTY')
    const wirEngine       = getEngine('INTELLIGENCE_REGISTRY')

    const shieldVerdict    = accessSentinel?.latest?.verdict ?? aegis?.overallVerdict ?? 'UNKNOWN'
    const shieldSummary    = accessSentinel?.latest?.summary ?? null
    const shieldLastEvent  = accessSentinel?.latest?.raisedAt ?? null
    const egressVerdict    = egressControl?.latest?.verdict ?? 'NO_DATA'
    const sovereignVerdict = sovereignty?.latest?.verdict ?? 'NO_DATA'
    const critical24h      = aegis?.critical24h ?? 0
    const warn24h          = aegis?.warn24h ?? 0

    const auditEvents    = state.aegisAudit ?? []
    const deniedEvents   = auditEvents.filter(e =>
      e.verdict === 'CRITICAL' || (e.eventType ?? '').includes('DENY') || (e.eventType ?? '').includes('BLOCK')
    )
    const recentShieldEvents = auditEvents.slice(0, 5)

    // ── WIR / model registry ───────────────────────────────────────────────────
    const wirVerdict  = wirEngine?.latest?.verdict ?? 'NO_DATA'
    const wirSummary  = wirEngine?.latest?.summary ?? null
    const subsystemEntries = Object.entries(state.subsystems ?? {}).map(([name, status]) => ({ name, status }))
    const registeredModels = state.activeCapabilities.map(cap => ({
      id:       `cap-${cap}`,
      name:     cap,
      provider: 'KEOS',
      status:   'LIVE',
    }))

    // ── WAOE mission executions ────────────────────────────────────────────────
    const workflows    = state.workflows ?? []
    const workflowRuns = state.workflowRuns ?? []
    const recentMissionRuns = workflowRuns.slice(0, 8).map(r => {
      const wf      = workflows.find(w => w.id === r.workflowId) ?? null
      const endedAt = r.completedAt ?? r.failedAt ?? undefined
      return {
        id:           r.id,
        workflowName: wf?.name ?? 'Unknown Mission',
        status:       r.status,
        triggeredBy:  r.triggeredBy,
        startedAt:    r.startedAt,
        completedAt:  endedAt ?? null,
        latencyMs:    calcLatencyMs(r.startedAt, endedAt),
        outcome:      r.outcome ?? null,
      }
    })
    const runningCount = workflowRuns.filter(r => r.status === 'RUNNING').length
    const failedCount  = workflowRuns.filter(r => r.status === 'FAILED').length
    const timedRuns    = recentMissionRuns.filter(r => r.latencyMs !== null)
    const avgLatencyMs = timedRuns.length > 0
      ? Math.round(timedRuns.reduce((sum, r) => sum + (r.latencyMs ?? 0), 0) / timedRuns.length)
      : null

    return {
      waandaPhase:         state.phase,
      bootStatus:          state.bootStatus,
      phases:              state.phases,
      subsystems:          state.subsystems,
      subsystemEntries,
      activeCapabilities:  state.activeCapabilities,
      platformHealth: {
        total: state.phases.length,
        nominal: nominalPhases,
        healthPercent,
      },

      // Domain registry
      registeredDomains: domains.length,
      domains,
      domainRegistry,
      domainCapabilities,
      domainRiskExposure,
      totalBreachedKpis,
      readyDomainCount,
      notReadyDomainCount,
      lastSynced,

      // Security / ACCESS_SENTINEL
      shieldVerdict,
      shieldSummary,
      shieldLastEvent,
      egressVerdict,
      sovereignVerdict,
      critical24h,
      warn24h,
      deniedEventCount:    deniedEvents.length,
      recentShieldEvents,
      aegisHealthScore:    aegis?.healthScore ?? null,

      // WIR / model registry
      wirVerdict,
      wirSummary,
      registeredModels,
      subsystemCount:      subsystemEntries.length,

      // Mission executions (WAOE)
      recentMissionRuns,
      runningCount,
      failedCount,
      avgLatencyMs,
      workflowCount:       workflows.length,
      workflowRunCount:    workflowRuns.length,

      confidence: state.confidence,
    }
  },
}

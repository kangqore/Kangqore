// WAANDA Cognitive Mirror — Generation III Runtime
// Transport-agnostic abstraction. Current transport: polling (30s cadence).
// Replace the sync() implementation with event bus, CDC, or streaming when ready.
// The interface — getState(), subscribe(), start(), stop() — never changes.

import { WaandaCognitiveState, EMPTY_WAANDA_STATE } from './types'

const POLL_MS = 30_000

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

function resolveBootStatus(status: any): WaandaCognitiveState['bootStatus'] {
  if (status?.booted)   return 'OPERATIONAL'
  if (status?.bootedAt) return 'DEGRADED'
  return 'OFFLINE'
}

function resolvePhaseStatus(raw: string): 'PASS' | 'WARN' | 'ERROR' {
  if (raw === 'ok')   return 'PASS'
  if (raw === 'warn') return 'WARN'
  return 'ERROR'
}

class WaandaCognitiveMirrorService {
  private state: WaandaCognitiveState = { ...EMPTY_WAANDA_STATE }
  private readonly listeners = new Set<(s: WaandaCognitiveState) => void>()
  private timer: ReturnType<typeof setInterval> | null = null
  private started = false

  getState(): WaandaCognitiveState {
    return this.state
  }

  subscribe(listener: (s: WaandaCognitiveState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  start(): void {
    if (this.started) return
    this.started = true
    void this.sync()
    this.timer = setInterval(() => void this.sync(), POLL_MS)
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer)
    this.started = false
  }

  // Transport implementation — swap this method to replace polling.
  async sync(): Promise<void> {
    const [
      status, history, sessions, decisions,
      edf, epf, personal, edfGoals,
      projects,
      financialKpis, contactsRes,
      gate8, gate8History,
      workflowsRes, workflowRunsRes,
      hanumanasAgentSummary, hanumanasAuditRes, hanumanasAutonomyRes,
      kimmpDecisionsRes, hanumanasPolicyRes,
      kimmpMemoriesRes, twinScenariosRes,
    ] = await Promise.all([
      fetchJson<any>('/api/admin/waanda/status'),
      fetchJson<any>('/api/admin/kangqore-immp/systems/history'),
      fetchJson<any>('/api/kangqore/urgi/sessions/live'),
      fetchJson<any>('/api/admin/hanumanas/actions/pending'),
      // Enterprise Platform — EDF and EPF (satisfies WEE Constitution Law 3)
      fetchJson<any>('/api/os/edf/domains'),
      fetchJson<any>('/api/os/epf/predictions'),
      // Personal Workspace — tasks and calendar for the logged-in user
      fetchJson<any>('/api/os/personal/summary'),
      // Enterprise Goals — EDF domain goals for Executive workspace
      fetchJson<any>('/api/os/edf/goals'),
      // Operations Workspace — live project board
      fetchJson<any>('/api/admin/pmo/projects'),
      // Revenue Workspace — financial KPIs and lead queue
      fetchJson<any>('/api/admin/financial-kpis'),
      fetchJson<any>('/api/contact?limit=12'),
      // Executive Workspace — Gate 8 / OIS score (9-pillar intelligence score)
      fetchJson<any>('/api/admin/gate8/score'),
      fetchJson<any>('/api/admin/gate8/history?limit=6'),
      // Automation — active workflows and recent runs
      fetchJson<any>('/api/admin/kangqore-immp/waoe/workflows?limit=20'),
      fetchJson<any>('/api/admin/kangqore-immp/waoe/runs?limit=10'),
      // HANUMANAS Governance — agent corps summary, audit ledger, autonomy boundary
      fetchJson<any>('/api/admin/hanumanas/agents/summary'),
      fetchJson<any>('/api/admin/hanumanas/audit?limit=10'),
      fetchJson<any>('/api/admin/hanumanas/autonomy?limit=6'),
      // Governance Workspace — KIMMP decision ledger + active policy rules
      fetchJson<any>('/api/admin/kangqore-immp/strategic-decisions?limit=20'),
      fetchJson<any>('/api/admin/hanumanas/policy/rules'),
      // Intelligence Workspace — KIMMP learned memory + Digital Twin scenarios
      fetchJson<any>('/api/admin/kangqore-immp/memory'),
      fetchJson<any>('/api/admin/gate8/twin/scenarios?limit=6'),
    ])

    // EDF domains take precedence over domains from WAANDA status when available
    const domains = (edf?.domains?.length ?? 0) > 0
      ? edf.domains
      : (status?.domains ?? [])

    const normalizedPhases = (status?.phases ?? []).map((p: any) => ({
      name:     p.phase ?? p.name ?? 'unknown',
      status:   resolvePhaseStatus(p.status),
      duration: p.ms ?? p.duration,
    }))

    this.state = {
      phase:              'OBSERVE',
      bootStatus:         resolveBootStatus(status),
      bootedAt:           status?.bootedAt          ?? null,
      phases:             normalizedPhases,
      activeCapabilities: status?.capabilities      ?? [],
      subsystems:         status?.subsystems         ?? {},
      domains,
      enterprisePredictions: epf?.predictions       ?? [],
      kimmSynthesis:      history?.history?.[0]?.kimmSynthesis ?? null,
      systemBriefings:    history?.history           ?? [],
      pendingDecisions:   decisions?.rows            ?? [],
      relationshipIntelligence: {
        liveSessions: (sessions?.data ?? []).map((s: any) => ({
          ...s,
          // URGI returns trustScore as 0–100 integer; WEE expects 0.0–1.0 float
          trustScore: typeof s.trustScore === 'number' && s.trustScore > 1 ? s.trustScore / 100 : (s.trustScore ?? 0),
        })),
        evidenceLedger: [],
      },
      enterpriseGoals:    edfGoals?.goals            ?? [],
      projects:           Array.isArray(projects) ? projects : [],
      workflows:          Array.isArray(workflowsRes?.items) ? workflowsRes.items : [],
      workflowRuns:       Array.isArray(workflowRunsRes?.items) ? workflowRunsRes.items : [],
      gate8:              gate8 ?? null,
      gate8History:       Array.isArray(gate8History) ? gate8History : [],
      financialKpis:      financialKpis              ?? null,
      recentLeads:        Array.isArray(contactsRes?.contacts) ? contactsRes.contacts : [],
      hanumanasAgentSummary:  hanumanasAgentSummary          ?? null,
      hanumanasAudit:         Array.isArray(hanumanasAuditRes?.rows)     ? hanumanasAuditRes.rows     : [],
      hanumanasAutonomy:      Array.isArray(hanumanasAutonomyRes?.rows)  ? hanumanasAutonomyRes.rows  : [],
      kimmpDecisions:     Array.isArray(kimmpDecisionsRes?.items) ? kimmpDecisionsRes.items : [],
      hanumanasPolicies:      Array.isArray(hanumanasPolicyRes?.policies) ? hanumanasPolicyRes.policies.filter((p: any) => p.enabled !== false) : [],
      kimmpMemories:      Array.isArray(kimmpMemoriesRes?.memories) ? kimmpMemoriesRes.memories : [],
      twinScenarios:      Array.isArray(twinScenariosRes) ? twinScenariosRes : [],
      lastSynced:         new Date(),
      confidence:         status?.booted ? 0.9 : 0.4,
      personalSummary:    personal                   ?? undefined,
    }

    this.listeners.forEach(l => l(this.state))
  }
}

export const WaandaCognitiveMirror = new WaandaCognitiveMirrorService()

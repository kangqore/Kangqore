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
      gate8,
    ] = await Promise.all([
      fetchJson<any>('/api/admin/waanda/status'),
      fetchJson<any>('/api/admin/kangqore-immp/systems/history'),
      fetchJson<any>('/api/kangqore/urgi/sessions/live'),
      fetchJson<any>('/api/admin/aegis/actions/pending'),
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
        liveSessions:   sessions?.data ?? [],
        evidenceLedger: [],
      },
      enterpriseGoals:    edfGoals?.goals            ?? [],
      projects:           Array.isArray(projects) ? projects : [],
      gate8:              gate8 ?? null,
      financialKpis:      financialKpis              ?? null,
      recentLeads:        Array.isArray(contactsRes?.contacts) ? contactsRes.contacts : [],
      lastSynced:         new Date(),
      confidence:         status?.booted ? 0.9 : 0.4,
      personalSummary:    personal                   ?? undefined,
    }

    this.listeners.forEach(l => l(this.state))
  }
}

export const WaandaCognitiveMirror = new WaandaCognitiveMirrorService()

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

class WaandaCognitiveMirrorService {
  private state: WaandaCognitiveState = { ...EMPTY_WAANDA_STATE }
  private listeners = new Set<(s: WaandaCognitiveState) => void>()
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
    const [status, history, sessions, decisions, edf, epf, personal, edfGoals] = await Promise.all([
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
    ])

    // EDF domains take precedence over domains from WAANDA status when available
    const domains = (edf?.domains?.length ?? 0) > 0
      ? edf.domains
      : (status?.domains ?? [])

    // Normalize boot phases: backend uses {phase, status:'ok'|'error', ms}
    // WaandaCognitiveState expects {name, status:'PASS'|'WARN'|'ERROR', duration}
    const normalizedPhases = (status?.phases ?? []).map((p: any) => ({
      name:     p.phase ?? p.name ?? 'unknown',
      status:   p.status === 'ok' ? 'PASS' : p.status === 'warn' ? 'WARN' : 'ERROR',
      duration: p.ms ?? p.duration,
    }))

    this.state = {
      phase: 'OBSERVE',
      bootStatus:
        status?.booted ? 'OPERATIONAL'
        : status?.bootedAt ? 'DEGRADED'
        : 'OFFLINE',
      bootedAt:           status?.bootedAt ?? null,
      phases:             normalizedPhases,
      activeCapabilities: status?.capabilities ?? [],
      subsystems:         status?.subsystems   ?? {},
      domains,
      enterprisePredictions: epf?.predictions ?? [],
      kimmSynthesis:      history?.history?.[0]?.kimmSynthesis ?? null,
      systemBriefings:    history?.history     ?? [],
      pendingDecisions:   decisions?.rows      ?? [],
      relationshipIntelligence: {
        liveSessions:  sessions?.data ?? [],
        evidenceLedger: [],
      },
      enterpriseGoals: edfGoals?.goals ?? [],
      lastSynced: new Date(),
      confidence: status?.booted ? 0.9 : 0.4,
      personalSummary: personal ?? undefined,
    }

    this.listeners.forEach(l => l(this.state))
  }
}

export const WaandaCognitiveMirror = new WaandaCognitiveMirrorService()

import { create } from 'zustand'
import type { Decision, ChangeRequest, AuditLog } from './types'

interface GovernanceStore {
  decisions:      Decision[]
  changeRequests: ChangeRequest[]
  auditLogs:      AuditLog[]
  isLoading:      boolean
  error:          string | null
  hydrateDecisions:      (d: Decision[]) => void
  hydrateChangeRequests: (c: ChangeRequest[]) => void
  hydrateAuditLogs:      (l: AuditLog[]) => void
  addDecision:           (d: Decision) => void
  updateDecision:        (id: string, patch: Partial<Decision>) => void
  updateChangeRequest:   (id: string, patch: Partial<ChangeRequest>) => void
}

export const useGovernanceStore = create<GovernanceStore>((set) => ({
  decisions:      [],
  changeRequests: [],
  auditLogs:      [],
  isLoading:      true,
  error:          null,

  hydrateDecisions:      (d) => set({ decisions: d }),
  hydrateChangeRequests: (c) => set({ changeRequests: c }),
  hydrateAuditLogs:      (l) => set({ auditLogs: l }),

  addDecision: (d) => set(s => ({ decisions: [d, ...s.decisions] })),

  updateDecision: (id, patch) =>
    set(s => ({ decisions: s.decisions.map(d => d.id === id ? { ...d, ...patch } : d) })),

  updateChangeRequest: (id, patch) =>
    set(s => ({ changeRequests: s.changeRequests.map(c => c.id === id ? { ...c, ...patch } : c) })),
}))

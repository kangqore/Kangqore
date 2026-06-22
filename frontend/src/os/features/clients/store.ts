import { create } from 'zustand'
import type { Client, Interaction, SLAMetric, Milestone, GovernanceItem } from './types'

interface ClientsStore {
  clients:      Client[]
  interactions: Interaction[]
  slaMetrics:   SLAMetric[]
  milestones:   Milestone[]
  governance:   GovernanceItem[]
  selectedId:   string
  isLoading:    boolean
  error:        string | null
  hydrate:             (clients: Client[])        => void
  hydrateInteractions: (rows: Interaction[])      => void
  hydrateSLAs:         (rows: SLAMetric[])        => void
  hydrateMilestones:   (rows: Milestone[])        => void
  hydrateGovernance:   (rows: GovernanceItem[])   => void
  setSelected:         (id: string)               => void
  updateClient:        (clientId: string, patch: Partial<Client>) => void
  updateSLA:           (id: string, patch: Partial<SLAMetric>)       => void
  updateMilestone:     (id: string, patch: Partial<Milestone>)        => void
  updateGovernance:    (id: string, patch: Partial<GovernanceItem>)   => void
  bulkUpdateClients:   (clientIds: string[], patch: Partial<Client>) => void
  bulkDeleteClients:   (clientIds: string[]) => void
  selectedClient:      () => Client | undefined
  clientInteractions:  (id: string) => Interaction[]
  clientSLAs:          (id: string) => SLAMetric[]
  clientMilestones:    (id: string) => Milestone[]
  clientGovernance:    (id: string) => GovernanceItem[]
}

export const useClientsStore = create<ClientsStore>((set, get) => ({
  clients:      [],
  interactions: [],
  slaMetrics:   [],
  milestones:   [],
  governance:   [],
  selectedId:   '',
  isLoading:    true,
  error:        null,

  hydrate: (clients) => set(s => ({ clients, isLoading: false, error: null, selectedId: s.selectedId || clients[0]?.id || '' })),
  hydrateInteractions: (interactions) => set({ interactions }),
  hydrateSLAs:         (slaMetrics)   => set({ slaMetrics }),
  hydrateMilestones:   (milestones)   => set({ milestones }),
  hydrateGovernance:   (governance)   => set({ governance }),

  setSelected: (id) => set({ selectedId: id }),

  updateClient: (clientId, patch) =>
    set(s => ({ clients: s.clients.map(c => c.id === clientId ? { ...c, ...patch } : c) })),
  updateSLA: (id, patch) =>
    set(s => ({ slaMetrics: s.slaMetrics.map(m => m.id === id ? { ...m, ...patch } : m) })),
  updateMilestone: (id, patch) =>
    set(s => ({ milestones: s.milestones.map(m => m.id === id ? { ...m, ...patch } : m) })),
  updateGovernance: (id, patch) =>
    set(s => ({ governance: s.governance.map(g => g.id === id ? { ...g, ...patch } : g) })),
  bulkUpdateClients: (clientIds, patch) =>
    set(s => ({ clients: s.clients.map(c => clientIds.includes(c.id) ? { ...c, ...patch } : c) })),
  bulkDeleteClients: (clientIds) =>
    set(s => ({ clients: s.clients.filter(c => !clientIds.includes(c.id)) })),

  selectedClient:     () => get().clients.find(c => c.id === get().selectedId),
  clientInteractions: (id) => get().interactions.filter(i => i.clientId === id).sort((a, b) => b.date.localeCompare(a.date)),
  clientSLAs:         (id) => get().slaMetrics.filter(s => s.clientId === id),
  clientMilestones:   (id) => get().milestones.filter(m => m.clientId === id),
  clientGovernance:   (id) => get().governance.filter(g => g.clientId === id).sort((a, b) => b.date.localeCompare(a.date)),
}))

import { create } from 'zustand'
import { CLIENTS, INTERACTIONS, SLA_METRICS, MILESTONES, GOVERNANCE } from './data'
import type { Client, Interaction, SLAMetric, Milestone, GovernanceItem } from './types'

interface ClientsStore {
  clients:      typeof CLIENTS
  interactions: typeof INTERACTIONS
  slaMetrics:   typeof SLA_METRICS
  milestones:   typeof MILESTONES
  governance:   typeof GOVERNANCE
  selectedId:   string
  isLoading:    boolean
  error:        string | null
  hydrate:             (clients: Client[])        => void
  hydrateInteractions: (rows: Interaction[])      => void
  hydrateSLAs:         (rows: SLAMetric[])        => void
  hydrateMilestones:   (rows: Milestone[])        => void
  hydrateGovernance:   (rows: GovernanceItem[])   => void
  setSelected:          (id: string)               => void
  updateClient:         (clientId: string, patch: Partial<Client>) => void
  bulkUpdateClients:    (clientIds: string[], patch: Partial<Client>) => void
  bulkDeleteClients:    (clientIds: string[]) => void
  selectedClient:       () => typeof CLIENTS[0] | undefined
  clientInteractions:   (id: string) => typeof INTERACTIONS
  clientSLAs:           (id: string) => typeof SLA_METRICS
  clientMilestones:     (id: string) => typeof MILESTONES
  clientGovernance:     (id: string) => typeof GOVERNANCE
}

export const useClientsStore = create<ClientsStore>((set, get) => ({
  clients:      CLIENTS,
  interactions: INTERACTIONS,
  slaMetrics:   SLA_METRICS,
  milestones:   MILESTONES,
  governance:   GOVERNANCE,
  selectedId:   'c1',
  isLoading:    false,
  error:        null,

  hydrate:             (clients)     => set({ clients, isLoading: false, error: null }),
  hydrateInteractions: (interactions) => set({ interactions }),
  hydrateSLAs:         (slaMetrics)   => set({ slaMetrics }),
  hydrateMilestones:   (milestones)   => set({ milestones }),
  hydrateGovernance:   (governance)   => set({ governance }),
  setSelected:       (id)         => set({ selectedId: id }),
  updateClient:      (clientId, patch) =>
    set(s => ({ clients: s.clients.map(c => c.id === clientId ? { ...c, ...patch } : c) })),
  bulkUpdateClients: (clientIds, patch) =>
    set(s => ({ clients: s.clients.map(c => clientIds.includes(c.id) ? { ...c, ...patch } : c) })),
  bulkDeleteClients: (clientIds) =>
    set(s => ({ clients: s.clients.filter(c => !clientIds.includes(c.id)) })),

  selectedClient:    () => get().clients.find(c => c.id === get().selectedId),
  clientInteractions: (id) => get().interactions.filter(i => i.clientId === id).sort((a,b) => b.date.localeCompare(a.date)),
  clientSLAs:         (id) => get().slaMetrics.filter(s => s.clientId === id),
  clientMilestones:   (id) => get().milestones.filter(m => m.clientId === id),
  clientGovernance:   (id) => get().governance.filter(g => g.clientId === id).sort((a,b) => b.date.localeCompare(a.date)),
}))

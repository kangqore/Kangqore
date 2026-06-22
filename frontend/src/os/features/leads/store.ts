import { create } from 'zustand'
import type { Lead, LeadStage, eQORESignal, LeadActivity, NurtureSequence } from './types'

interface LeadsStore {
  leads:            Lead[]
  signals:          eQORESignal[]
  activities:       LeadActivity[]
  nurtureSequences: NurtureSequence[]
  selectedId:       string
  isLoading:        boolean
  error:            string | null
  hydrate:          (leads: Lead[]) => void
  setSelected:      (id: string) => void
  moveLeadStage:    (leadId: string, stage: LeadStage) => void
  updateLead:       (leadId: string, patch: Partial<Lead>) => void
  bulkUpdateLeads:  (leadIds: string[], patch: Partial<Lead>) => void
  bulkDeleteLeads:  (leadIds: string[]) => void
  leadSignals:      (id: string) => eQORESignal[]
  leadActivities:   (id: string) => LeadActivity[]
  leadNurture:      (id: string) => NurtureSequence | undefined
  pipelineValue:    () => number
  forecastValue:    () => number
}

export const useLeadsStore = create<LeadsStore>((set, get) => ({
  leads:            [],
  signals:          [],
  activities:       [],
  nurtureSequences: [],
  selectedId:       '',
  isLoading:        true,
  error:            null,

  hydrate: (leads) => set(s => ({
    leads,
    isLoading: false,
    error: null,
    selectedId: s.selectedId || leads[0]?.id || '',
  })),

  setSelected:     (id) => set({ selectedId: id }),
  moveLeadStage:   (leadId, stage) =>
    set(s => ({ leads: s.leads.map(l => l.id === leadId ? { ...l, stage } : l) })),
  updateLead:      (leadId, patch) =>
    set(s => ({ leads: s.leads.map(l => l.id === leadId ? { ...l, ...patch } : l) })),
  bulkUpdateLeads: (leadIds, patch) =>
    set(s => ({ leads: s.leads.map(l => leadIds.includes(l.id) ? { ...l, ...patch } : l) })),
  bulkDeleteLeads: (leadIds) =>
    set(s => ({ leads: s.leads.filter(l => !leadIds.includes(l.id)) })),

  leadSignals:    (id) => get().signals.filter(s => s.leadId === id),
  leadActivities: (id) => get().activities.filter(a => a.leadId === id).sort((a, b) => b.date.localeCompare(a.date)),
  leadNurture:    (id) => get().nurtureSequences.find(n => n.leadId === id),

  pipelineValue: () =>
    get().leads
      .filter(l => !['won', 'lost'].includes(l.stage))
      .reduce((s, l) => s + l.value, 0),

  forecastValue: () =>
    get().leads
      .filter(l => !['won', 'lost'].includes(l.stage))
      .reduce((s, l) => s + (l.value * l.probability / 100), 0),
}))

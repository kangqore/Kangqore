import { create } from 'zustand'
import { LEADS, EQORE_SIGNALS, ACTIVITIES, NURTURE_SEQUENCES } from './data'
import type { LeadStage } from './types'

interface LeadsStore {
  leads:            typeof LEADS
  signals:          typeof EQORE_SIGNALS
  activities:       typeof ACTIVITIES
  nurtureSequences: typeof NURTURE_SEQUENCES
  selectedId:       string
  isLoading:        boolean
  error:            string | null
  hydrate:          (leads: typeof LEADS) => void
  setSelected:      (id: string) => void
  moveLeadStage:    (leadId: string, stage: LeadStage) => void
  updateLead:       (leadId: string, patch: Partial<typeof LEADS[0]>) => void
  bulkUpdateLeads:  (leadIds: string[], patch: Partial<typeof LEADS[0]>) => void
  bulkDeleteLeads:  (leadIds: string[]) => void
  leadSignals:      (id: string) => typeof EQORE_SIGNALS
  leadActivities:   (id: string) => typeof ACTIVITIES
  leadNurture:      (id: string) => typeof NURTURE_SEQUENCES[0] | undefined
  pipelineValue:    () => number
  forecastValue:    () => number
}

export const useLeadsStore = create<LeadsStore>((set, get) => ({
  leads:            LEADS,
  signals:          EQORE_SIGNALS,
  activities:       ACTIVITIES,
  nurtureSequences: NURTURE_SEQUENCES,
  selectedId:       'l1',
  isLoading:        false,
  error:            null,
  hydrate:          (leads) => set({ leads, isLoading: false, error: null }),

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
  leadActivities: (id) => get().activities.filter(a => a.leadId === id).sort((a,b) => b.date.localeCompare(a.date)),
  leadNurture:    (id) => get().nurtureSequences.find(n => n.leadId === id),

  pipelineValue: () =>
    get().leads
      .filter(l => !['won','lost'].includes(l.stage))
      .reduce((s, l) => s + l.value, 0),

  forecastValue: () =>
    get().leads
      .filter(l => !['won','lost'].includes(l.stage))
      .reduce((s, l) => s + (l.value * l.probability / 100), 0),
}))

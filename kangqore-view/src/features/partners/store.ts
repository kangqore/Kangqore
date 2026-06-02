import { create } from 'zustand'
import { PARTNERS, PARTNER_TASKS, DELIVERABLES, PAYMENTS, NOTES } from './data'

interface PartnersStore {
  partners:    typeof PARTNERS
  tasks:       typeof PARTNER_TASKS
  deliverables:typeof DELIVERABLES
  payments:    typeof PAYMENTS
  notes:       typeof NOTES
  selectedId:  string
  setSelected: (id: string) => void
  partnerTasks:        (id: string) => typeof PARTNER_TASKS
  partnerDeliverables: (id: string) => typeof DELIVERABLES
  partnerPayments:     (id: string) => typeof PAYMENTS
  partnerNotes:        (id: string) => typeof NOTES
}

export const usePartnersStore = create<PartnersStore>((set, get) => ({
  partners:     PARTNERS,
  tasks:        PARTNER_TASKS,
  deliverables: DELIVERABLES,
  payments:     PAYMENTS,
  notes:        NOTES,
  selectedId:   'pt1',

  setSelected: (id) => set({ selectedId: id }),

  partnerTasks:        (id) => get().tasks.filter(t => t.partnerId === id),
  partnerDeliverables: (id) => get().deliverables.filter(d => d.partnerId === id),
  partnerPayments:     (id) => get().payments.filter(p => p.partnerId === id).sort((a,b) => b.issuedDate.localeCompare(a.issuedDate)),
  partnerNotes:        (id) => get().notes.filter(n => n.partnerId === id).sort((a,b) => b.date.localeCompare(a.date)),
}))

import { create } from 'zustand'
import { PARTNERS, PARTNER_TASKS, DELIVERABLES, PAYMENTS, NOTES } from './data'
import type { Partner, PartnerTask, Deliverable, PartnerPayment, PartnerNote } from './types'

interface PartnersStore {
  partners:     typeof PARTNERS
  tasks:        typeof PARTNER_TASKS
  deliverables: typeof DELIVERABLES
  payments:     typeof PAYMENTS
  notes:        typeof NOTES
  selectedId:   string
  setSelected:         (id: string)           => void
  hydratePartners:     (p: Partner[])         => void
  hydrateTasks:        (rows: PartnerTask[])  => void
  hydrateDeliverables: (rows: Deliverable[])  => void
  hydratePayments:     (rows: PartnerPayment[]) => void
  hydrateNotes:        (rows: PartnerNote[])  => void
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

  setSelected:         (id)    => set({ selectedId: id }),
  hydratePartners:     (p)     => set({ partners: p, selectedId: p[0]?.id ?? 'pt1' }),
  hydrateTasks:        (tasks)        => set({ tasks }),
  hydrateDeliverables: (deliverables) => set({ deliverables }),
  hydratePayments:     (payments)     => set({ payments }),
  hydrateNotes:        (notes)        => set({ notes }),

  partnerTasks:        (id) => get().tasks.filter(t => t.partnerId === id),
  partnerDeliverables: (id) => get().deliverables.filter(d => d.partnerId === id),
  partnerPayments:     (id) => get().payments.filter(p => p.partnerId === id).sort((a,b) => b.issuedDate.localeCompare(a.issuedDate)),
  partnerNotes:        (id) => get().notes.filter(n => n.partnerId === id).sort((a,b) => b.date.localeCompare(a.date)),
}))

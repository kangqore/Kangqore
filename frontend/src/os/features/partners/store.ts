import { create } from 'zustand'
import type { Partner, PartnerTask, Deliverable, PartnerPayment, PartnerNote } from './types'

interface PartnersStore {
  partners:     Partner[]
  tasks:        PartnerTask[]
  deliverables: Deliverable[]
  payments:     PartnerPayment[]
  notes:        PartnerNote[]
  selectedId:   string
  isLoading:    boolean
  setSelected:         (id: string)             => void
  hydratePartners:     (p: Partner[])           => void
  hydrateTasks:        (rows: PartnerTask[])    => void
  hydrateDeliverables: (rows: Deliverable[])    => void
  hydratePayments:     (rows: PartnerPayment[]) => void
  hydrateNotes:        (rows: PartnerNote[])    => void
  updatePartner:       (id: string, patch: Partial<Partner>) => void
  partnerTasks:        (id: string) => PartnerTask[]
  partnerDeliverables: (id: string) => Deliverable[]
  partnerPayments:     (id: string) => PartnerPayment[]
  partnerNotes:        (id: string) => PartnerNote[]
}

export const usePartnersStore = create<PartnersStore>((set, get) => ({
  partners:     [],
  tasks:        [],
  deliverables: [],
  payments:     [],
  notes:        [],
  selectedId:   '',
  isLoading:    true,

  setSelected: (id) => set({ selectedId: id }),

  hydratePartners: (partners) => set(s => ({
    partners,
    isLoading: false,
    selectedId: s.selectedId || partners[0]?.id || '',
  })),

  hydrateTasks:        (tasks)        => set({ tasks }),
  hydrateDeliverables: (deliverables) => set({ deliverables }),
  hydratePayments:     (payments)     => set({ payments }),
  hydrateNotes:        (notes)        => set({ notes }),

  updatePartner: (id, patch) =>
    set(s => ({ partners: s.partners.map(p => p.id === id ? { ...p, ...patch } : p) })),

  partnerTasks:        (id) => get().tasks.filter(t => t.partnerId === id),
  partnerDeliverables: (id) => get().deliverables.filter(d => d.partnerId === id),
  partnerPayments:     (id) => get().payments.filter(p => p.partnerId === id).sort((a,b) => b.issuedDate.localeCompare(a.issuedDate)),
  partnerNotes:        (id) => get().notes.filter(n => n.partnerId === id).sort((a,b) => b.date.localeCompare(a.date)),
}))

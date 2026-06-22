import { create } from 'zustand'
import type { Risk } from './types'

interface DeliveryStore {
  risks:      Risk[]
  isLoading:  boolean
  error:      string | null
  hydrate:    (risks: Risk[]) => void
  addRisk:    (risk: Risk) => void
  updateRisk: (id: string, patch: Partial<Risk>) => void
}

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  risks:     [],
  isLoading: true,
  error:     null,

  hydrate: (risks) => set({ risks, isLoading: false, error: null }),

  addRisk: (risk) => set(s => ({ risks: [risk, ...s.risks] })),

  updateRisk: (id, patch) =>
    set(s => ({ risks: s.risks.map(r => r.id === id ? { ...r, ...patch } : r) })),
}))

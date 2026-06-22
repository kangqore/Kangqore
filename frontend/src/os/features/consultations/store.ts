import { create } from 'zustand'
import type { Consultation, ConsultationStats } from './types'

interface ConsultationsStore {
  consultations: Consultation[]
  stats:         ConsultationStats
  isLoading:     boolean
  error:         string | null
  hydrate:       (consultations: Consultation[]) => void
  hydrateStats:  (stats: ConsultationStats) => void
  updateConsultation: (id: string, patch: Partial<Consultation>) => void
}

const EMPTY_STATS: ConsultationStats = { total: 0, pending: 0, contacted: 0, scheduled: 0, completed: 0, rescheduled: 0 }

export const useConsultationsStore = create<ConsultationsStore>((set) => ({
  consultations: [],
  stats:         EMPTY_STATS,
  isLoading:     true,
  error:         null,

  hydrate: (consultations) => {
    set({
      consultations,
      isLoading: false,
      error: null,
      stats: {
        total:       consultations.length,
        pending:     consultations.filter(c => c.status === 'PENDING').length,
        contacted:   consultations.filter(c => c.status === 'CONTACTED').length,
        scheduled:   consultations.filter(c => c.status === 'SCHEDULED').length,
        completed:   consultations.filter(c => c.status === 'COMPLETED').length,
        rescheduled: consultations.filter(c => c.status === 'RESCHEDULED').length,
      },
    })
  },

  hydrateStats: (stats) => set({ stats }),

  updateConsultation: (id, patch) =>
    set(s => {
      const updated = s.consultations.map(c => c.id === id ? { ...c, ...patch } : c)
      return {
        consultations: updated,
        stats: {
          total:       updated.length,
          pending:     updated.filter(c => c.status === 'PENDING').length,
          contacted:   updated.filter(c => c.status === 'CONTACTED').length,
          scheduled:   updated.filter(c => c.status === 'SCHEDULED').length,
          completed:   updated.filter(c => c.status === 'COMPLETED').length,
          rescheduled: updated.filter(c => c.status === 'RESCHEDULED').length,
        },
      }
    }),
}))

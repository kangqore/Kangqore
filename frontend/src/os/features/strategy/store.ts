import { create } from 'zustand'
import { PILLARS, PROGRAMS, OBJECTIVES } from './data'
import type { Pillar, Program, Objective, Quarter } from './types'

interface StrategyStore {
  pillars: Pillar[]
  programs: Program[]
  objectives: Objective[]
  selectedQuarter: Quarter
  setSelectedQuarter: (q: Quarter) => void
  filteredObjectives: (pillarId?: string) => Objective[]
  filteredPrograms: (pillarId?: string) => Program[]
  hydrate: (data: { pillars: Pillar[]; objectives: Objective[]; programs: Program[] }) => void
}

export const useStrategyStore = create<StrategyStore>((set, get) => ({
  pillars: PILLARS,
  programs: PROGRAMS,
  objectives: OBJECTIVES,
  selectedQuarter: 'Q2 2026',

  setSelectedQuarter: (q) => set({ selectedQuarter: q }),

  filteredObjectives: (pillarId) => {
    const { objectives, selectedQuarter } = get()
    return objectives.filter(o =>
      o.quarter === selectedQuarter && (!pillarId || o.pillarId === pillarId)
    )
  },

  filteredPrograms: (pillarId) => {
    const { programs } = get()
    return programs.filter(p => !pillarId || p.pillarId === pillarId)
  },

  hydrate: (data) => set({ pillars: data.pillars, objectives: data.objectives, programs: data.programs }),
}))

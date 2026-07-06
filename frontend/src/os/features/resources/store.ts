import { create } from 'zustand'
import type { TeamMember, Allocation } from './types'

type UtilRow = { week: string; [memberId: string]: number | string }

interface ResourcesStore {
  team: TeamMember[]
  allocations: Allocation[]
  utilHistory: UtilRow[]
  selectedMemberId: string | null
  setSelectedMember: (id: string | null) => void
  allocationsForMember: (memberId: string) => Allocation[]
  allocationsForProject: (projectId: string) => Allocation[]
  memberById: (id: string) => TeamMember | undefined
  allSkills: () => string[]
  hydrate: (data: { team: TeamMember[]; allocations: Allocation[] }) => void
}

export const useResourcesStore = create<ResourcesStore>((set, get) => ({
  team: [],
  allocations: [],
  utilHistory: [],
  selectedMemberId: null,

  setSelectedMember: (id) => set({ selectedMemberId: id }),

  allocationsForMember: (memberId) =>
    get().allocations.filter(a => a.memberId === memberId),

  allocationsForProject: (projectId) =>
    get().allocations.filter(a => a.projectId === projectId),

  memberById: (id) =>
    get().team.find(m => m.id === id),

  allSkills: () => {
    const skills = get().team.flatMap(m => m.skills ?? [])
    return [...new Set(skills)].sort()
  },

  hydrate: (data) => {
    // Build synthetic 4-week util history from current utilization (slight variance per week)
    const weeks = ['W-3', 'W-2', 'W-1', 'Now']
    const utilHistory: UtilRow[] = weeks.map((week, wi) => {
      const row: UtilRow = { week }
      data.team.forEach(m => {
        // add small variance so trend chart is readable
        const delta = (wi - 1.5) * 3
        row[m.id] = Math.min(100, Math.max(0, Math.round(m.utilization + delta)))
      })
      return row
    })
    set({ team: data.team, allocations: data.allocations, utilHistory })
  },
}))

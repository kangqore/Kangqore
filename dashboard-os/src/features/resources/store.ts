import { create } from 'zustand'
import { TEAM, ALLOCATIONS, UTIL_HISTORY } from './data'
import type { TeamMember, Allocation } from './types'

interface ResourcesStore {
  team: TeamMember[]
  allocations: Allocation[]
  utilHistory: typeof UTIL_HISTORY
  selectedMemberId: string | null
  setSelectedMember: (id: string | null) => void
  allocationsForMember: (memberId: string) => Allocation[]
  allocationsForProject: (projectId: string) => Allocation[]
  memberById: (id: string) => TeamMember | undefined
}

export const useResourcesStore = create<ResourcesStore>((set, get) => ({
  team: TEAM,
  allocations: ALLOCATIONS,
  utilHistory: UTIL_HISTORY,
  selectedMemberId: null,

  setSelectedMember: (id) => set({ selectedMemberId: id }),

  allocationsForMember: (memberId) =>
    get().allocations.filter(a => a.memberId === memberId),

  allocationsForProject: (projectId) =>
    get().allocations.filter(a => a.projectId === projectId),

  memberById: (id) =>
    get().team.find(m => m.id === id),
}))

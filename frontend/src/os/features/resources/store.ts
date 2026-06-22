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

  hydrate: (data) => set({ team: data.team, allocations: data.allocations }),
}))

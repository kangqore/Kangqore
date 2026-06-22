import { create } from 'zustand'
import type { JobRole, Candidate } from './types'

interface CareersStore {
  roles:            JobRole[]
  candidates:       Candidate[]
  selectedRoleId:   string
  isLoading:        boolean
  error:            string | null
  hydrateRoles:     (roles: JobRole[]) => void
  hydrateCandidates:(candidates: Candidate[]) => void
  setSelectedRole:  (id: string) => void
  roleCandidates:   (id: string) => Candidate[]
}

export const useCareersStore = create<CareersStore>((set, get) => ({
  roles:          [],
  candidates:     [],
  selectedRoleId: '',
  isLoading:      true,
  error:          null,

  hydrateRoles:      (roles)      => set(s => ({ roles, isLoading: false, selectedRoleId: s.selectedRoleId || roles[0]?.id || '' })),
  hydrateCandidates: (candidates) => set({ candidates }),

  setSelectedRole: (id) => set({ selectedRoleId: id }),
  roleCandidates:  (id) => get().candidates.filter(c => c.roleId === id),
}))

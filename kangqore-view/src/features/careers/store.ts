import { create } from 'zustand'
import { JOB_ROLES, CANDIDATES } from './data'

interface CareersStore {
  roles:           typeof JOB_ROLES
  candidates:      typeof CANDIDATES
  selectedRoleId:  string
  isLoading:       boolean
  error:           string | null
  hydrateRoles:    (roles: typeof JOB_ROLES) => void
  hydrateCandidates: (candidates: typeof CANDIDATES) => void
  setSelectedRole: (id: string) => void
  roleCandidates:  (id: string) => typeof CANDIDATES
}

export const useCareersStore = create<CareersStore>((set, get) => ({
  roles:      JOB_ROLES,
  candidates: CANDIDATES,
  selectedRoleId: 'j1',
  isLoading:  false,
  error:      null,
  hydrateRoles:      (roles)      => set({ roles, isLoading: false }),
  hydrateCandidates: (candidates) => set({ candidates }),

  setSelectedRole: (id) => set({ selectedRoleId: id }),
  roleCandidates:  (id) => get().candidates.filter(c => c.roleId === id),
}))

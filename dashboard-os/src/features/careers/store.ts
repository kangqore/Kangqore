import { create } from 'zustand'
import { JOB_ROLES, CANDIDATES } from './data'

interface CareersStore {
  roles:      typeof JOB_ROLES
  candidates: typeof CANDIDATES
  selectedRoleId: string
  setSelectedRole: (id: string) => void
  roleCandidates:  (id: string) => typeof CANDIDATES
}

export const useCareersStore = create<CareersStore>((set, get) => ({
  roles:      JOB_ROLES,
  candidates: CANDIDATES,
  selectedRoleId: 'j1',

  setSelectedRole: (id) => set({ selectedRoleId: id }),
  roleCandidates:  (id) => get().candidates.filter(c => c.roleId === id),
}))

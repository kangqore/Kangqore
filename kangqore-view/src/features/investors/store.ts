import { create } from 'zustand'
import { INVESTORS, CAP_TABLE, INVESTOR_UPDATES, FUNDRAISING_ROUNDS } from './data'

interface InvestorsStore {
  investors:        typeof INVESTORS
  capTable:         typeof CAP_TABLE
  updates:          typeof INVESTOR_UPDATES
  rounds:           typeof FUNDRAISING_ROUNDS
  selectedId:       string
  setSelected:      (id: string) => void
  activeRound:      () => typeof FUNDRAISING_ROUNDS[0] | undefined
  totalCommitted:   () => number
  totalOwnership:   () => number
}

export const useInvestorsStore = create<InvestorsStore>((set, get) => ({
  investors:   INVESTORS,
  capTable:    CAP_TABLE,
  updates:     INVESTOR_UPDATES,
  rounds:      FUNDRAISING_ROUNDS,
  selectedId:  'i1',

  setSelected: (id) => set({ selectedId: id }),

  activeRound: () => get().rounds.find(r => r.status === 'open' || r.status === 'planning'),

  totalCommitted: () =>
    get().investors.filter(i => i.status === 'committed').reduce((s, i) => s + i.committed, 0),

  totalOwnership: () =>
    get().capTable
      .filter(ct => !['founders', 'esop'].includes(ct.investorId))
      .reduce((s, ct) => s + ct.ownership, 0),
}))

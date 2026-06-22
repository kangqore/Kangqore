import { create } from 'zustand'
import type { Investor, CapTable, InvestorUpdate, FundraisingRound } from './types'

interface InvestorsStore {
  investors:        Investor[]
  capTable:         CapTable[]
  updates:          InvestorUpdate[]
  rounds:           FundraisingRound[]
  selectedId:       string
  isLoading:        boolean
  setSelected:      (id: string)                  => void
  hydrateInvestors: (investors: Investor[])        => void
  hydrateUpdates:   (updates: InvestorUpdate[])    => void
  hydrateCapTable:  (rows: CapTable[])             => void
  hydrateRounds:    (rows: FundraisingRound[])     => void
  updateInvestor:   (id: string, patch: Partial<Investor>) => void
  activeRound:      () => FundraisingRound | undefined
  totalCommitted:   () => number
  totalOwnership:   () => number
}

export const useInvestorsStore = create<InvestorsStore>((set, get) => ({
  investors:   [],
  capTable:    [],
  updates:     [],
  rounds:      [],
  selectedId:  '',
  isLoading:   true,

  setSelected: (id) => set({ selectedId: id }),

  hydrateInvestors: (investors) => set(s => ({
    investors,
    isLoading: false,
    selectedId: s.selectedId || investors[0]?.id || '',
  })),

  hydrateUpdates:  (updates)  => set({ updates }),
  hydrateCapTable: (capTable) => set({ capTable }),
  hydrateRounds:   (rounds)   => set({ rounds }),

  updateInvestor: (id, patch) =>
    set(s => ({ investors: s.investors.map(i => i.id === id ? { ...i, ...patch } : i) })),

  activeRound: () => get().rounds.find(r => r.status === 'open' || r.status === 'planning'),

  totalCommitted: () =>
    get().investors.filter(i => i.status === 'committed').reduce((s, i) => s + i.committed, 0),

  totalOwnership: () =>
    get().capTable
      .filter(ct => !['founders', 'esop'].includes(ct.investorId))
      .reduce((s, ct) => s + ct.ownership, 0),
}))

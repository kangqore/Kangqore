import { create } from 'zustand'
import type { Campaign, ContentPiece, MarketingMetrics } from './types'

interface MarketingStore {
  campaigns: Campaign[]
  content:   ContentPiece[]
  metrics:   MarketingMetrics[]
  hydrate:      (data: { campaigns: Campaign[]; content: ContentPiece[]; metrics: MarketingMetrics[] }) => void
  totalSpend:   () => number
  totalMQLs:    () => number
  totalRevenue: () => number
  avgCPL:       () => number
}

export const useMarketingStore = create<MarketingStore>((set, get) => ({
  campaigns: [],
  content:   [],
  metrics:   [],

  hydrate: (data) => set({ campaigns: data.campaigns, content: data.content, metrics: data.metrics }),

  totalSpend:   () => get().campaigns.reduce((s, c) => s + c.spent, 0),
  totalMQLs:    () => get().campaigns.reduce((s, c) => s + c.mqls, 0),
  totalRevenue: () => get().campaigns.reduce((s, c) => s + c.revenue, 0),
  avgCPL: () => {
    const totalLeads = get().campaigns.reduce((s, c) => s + c.leads, 0)
    const totalSpend = get().campaigns.reduce((s, c) => s + c.spent, 0)
    return totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0
  },
}))

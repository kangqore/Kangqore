import { create } from 'zustand'
import { CAMPAIGNS, CONTENT_PIECES, MONTHLY_METRICS } from './data'

interface MarketingStore {
  campaigns:  typeof CAMPAIGNS
  content:    typeof CONTENT_PIECES
  metrics:    typeof MONTHLY_METRICS
  totalSpend:   () => number
  totalMQLs:    () => number
  totalRevenue: () => number
  avgCPL:       () => number
}

export const useMarketingStore = create<MarketingStore>((_set, get) => ({
  campaigns: CAMPAIGNS,
  content:   CONTENT_PIECES,
  metrics:   MONTHLY_METRICS,

  totalSpend:   () => get().campaigns.reduce((s, c) => s + c.spent, 0),
  totalMQLs:    () => get().campaigns.reduce((s, c) => s + c.mqls, 0),
  totalRevenue: () => get().campaigns.reduce((s, c) => s + c.revenue, 0),
  avgCPL: () => {
    const totalLeads = get().campaigns.reduce((s, c) => s + c.leads, 0)
    const totalSpend = get().campaigns.reduce((s, c) => s + c.spent, 0)
    return totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0
  },
}))

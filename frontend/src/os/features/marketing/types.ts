export type CampaignStatus  = 'active' | 'scheduled' | 'completed' | 'draft' | 'paused'
export type CampaignChannel = 'email' | 'linkedin' | 'paid-search' | 'content' | 'event' | 'partner' | 'outbound'

export interface Campaign {
  id: string
  name: string
  channel: CampaignChannel
  status: CampaignStatus
  startDate: string
  endDate?: string
  budget: number          // £
  spent: number           // £
  impressions: number
  clicks: number
  leads: number
  mqls: number            // marketing qualified leads
  sqls: number            // sales qualified leads
  revenue: number         // £ pipeline attributed
  owner: string
  description: string
  tags: string[]
}

export interface ContentPiece {
  id: string
  title: string
  type: 'blog' | 'case-study' | 'whitepaper' | 'video' | 'webinar' | 'social'
  status: 'published' | 'draft' | 'review' | 'scheduled'
  publishDate?: string
  author: string
  views: number
  leads: number
  url?: string
  tags: string[]
}

export interface MarketingMetrics {
  month: string
  spend: number
  mqls: number
  sqls: number
  websiteVisits: number
  conversionRate: number   // %
  cpl: number              // £ cost per lead
  cac: number              // £ customer acquisition cost
}

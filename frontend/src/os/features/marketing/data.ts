import type { Campaign, ContentPiece, MarketingMetrics } from './types'

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'c1', name: 'LinkedIn Thought Leadership', channel: 'linkedin', status: 'active',
    startDate: '2026-04-01', budget: 2500, spent: 1200,
    impressions: 48200, clicks: 1840, leads: 12, mqls: 7, sqls: 3, revenue: 245000,
    owner: 'Sofia Mendez', description: 'CEO and CTO thought leadership posts. Case study amplification.',
    tags: ['brand', 'awareness', 'b2b'],
  },
  {
    id: 'c2', name: 'Healthcare Vertical Campaign', channel: 'content', status: 'active',
    startDate: '2026-03-15', budget: 4000, spent: 2600,
    impressions: 22400, clicks: 890, leads: 18, mqls: 11, sqls: 5, revenue: 420000,
    owner: 'Anika Roy', description: 'Whitepapers, case studies and targeted content for healthcare decision-makers.',
    tags: ['healthcare', 'vertical', 'content'],
  },
  {
    id: 'c3', name: 'Google Ads — Enterprise SaaS', channel: 'paid-search', status: 'active',
    startDate: '2026-05-01', budget: 3000, spent: 1450,
    impressions: 31600, clicks: 720, leads: 9, mqls: 4, sqls: 2, revenue: 175000,
    owner: 'Sofia Mendez', description: 'Paid search targeting enterprise software decision-makers in UK & EU.',
    tags: ['paid', 'saas', 'uk-eu'],
  },
  {
    id: 'c4', name: 'HealthTech Europe Event', channel: 'event', status: 'completed',
    startDate: '2026-05-14', endDate: '2026-05-15', budget: 3500, spent: 3480,
    impressions: 1200, clicks: 0, leads: 4, mqls: 2, sqls: 1, revenue: 120000,
    owner: 'C.O.D.E.', description: 'Sponsorship and speaking slot at HealthTech Europe, Stockholm.',
    tags: ['event', 'healthcare', 'eu'],
  },
  {
    id: 'c5', name: 'Partner Referral Programme', channel: 'partner', status: 'active',
    startDate: '2026-02-01', budget: 5000, spent: 1800,
    impressions: 0, clicks: 0, leads: 7, mqls: 6, sqls: 4, revenue: 635000,
    owner: 'Ravi Nair', description: 'Referral incentive programme for existing clients and delivery partners.',
    tags: ['referral', 'partner', 'high-roi'],
  },
  {
    id: 'c6', name: 'Q3 Fintech Campaign', channel: 'content', status: 'scheduled',
    startDate: '2026-07-01', budget: 4500, spent: 0,
    impressions: 0, clicks: 0, leads: 0, mqls: 0, sqls: 0, revenue: 0,
    owner: 'Anika Roy', description: 'Content campaign targeting CFOs and CDOs in financial services.',
    tags: ['fintech', 'q3', 'planned'],
  },
]

export const CONTENT_PIECES: ContentPiece[] = [
  { id: 'cp1', title: 'How Kangqore helped GlobeMed cut onboarding time by 60%', type: 'case-study', status: 'published', publishDate: '2026-04-15', author: 'Anika Roy',     views: 2840, leads: 8,  tags: ['healthcare', 'case-study'] },
  { id: 'cp2', title: 'Building HIPAA-compliant patient portals: a technical guide',  type: 'whitepaper', status: 'published', publishDate: '2026-03-28', author: 'Dev Patel',    views: 1920, leads: 14, tags: ['healthcare', 'technical', 'compliance'] },
  { id: 'cp3', title: 'The AI-driven CRM: why intent scoring changes everything',    type: 'blog',       status: 'published', publishDate: '2026-05-10', author: 'C.O.D.E.', views: 3450, leads: 6,  tags: ['crm', 'ai', 'thought-leadership'] },
  { id: 'cp4', title: 'Kangqore OS: from strategy to delivery in one platform',     type: 'video',      status: 'published', publishDate: '2026-04-28', author: 'Anika Roy',     views: 1240, leads: 3,  tags: ['product', 'demo'] },
  { id: 'cp5', title: 'Investor reporting automation: 3 hours to 10 minutes',       type: 'blog',       status: 'published', publishDate: '2026-05-20', author: 'C.O.D.E.', views: 2100, leads: 5,  tags: ['finance', 'automation'] },
  { id: 'cp6', title: 'Fintech compliance dashboard — product launch webinar',       type: 'webinar',    status: 'scheduled', publishDate: '2026-06-18', author: 'Dev Patel',    views: 0,    leads: 0,  tags: ['fintech', 'webinar', 'upcoming'] },
  { id: 'cp7', title: 'Q3 Fintech Decision-Maker Research Report',                  type: 'whitepaper', status: 'draft',     author: 'Anika Roy',     views: 0, leads: 0, tags: ['fintech', 'research', 'q3'] },
]

export const MONTHLY_METRICS: MarketingMetrics[] = [
  { month: 'Jan 2026', spend: 4200, mqls: 8,  sqls: 3, websiteVisits: 3400, conversionRate: 2.1, cpl: 525, cac: 14000 },
  { month: 'Feb 2026', spend: 5100, mqls: 11, sqls: 4, websiteVisits: 4200, conversionRate: 2.4, cpl: 464, cac: 12750 },
  { month: 'Mar 2026', spend: 6800, mqls: 14, sqls: 5, websiteVisits: 5600, conversionRate: 2.8, cpl: 486, cac: 13600 },
  { month: 'Apr 2026', spend: 7200, mqls: 18, sqls: 7, websiteVisits: 7100, conversionRate: 3.1, cpl: 400, cac: 10286 },
  { month: 'May 2026', spend: 8900, mqls: 22, sqls: 9, websiteVisits: 9200, conversionRate: 3.5, cpl: 405, cac: 9889  },
]

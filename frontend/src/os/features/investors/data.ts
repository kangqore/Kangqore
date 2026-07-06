import type { Investor, CapTable, InvestorUpdate, FundraisingRound } from './types'

export const INVESTORS: Investor[] = [
  {
    id: 'i1', name: 'James Whitfield', firm: 'Whitfield Ventures', type: 'vc', status: 'committed',
    email: 'james@whitfieldvc.com', phone: '+44 7700 900001', country: 'UK',
    checkSize: { min: 500, max: 2000 }, preferredStage: ['seed', 'series-a'],
    portfolio: 24, leadInvestor: true, committed: 750, ownership: 8.5,
    lastContact: '2026-05-20', nextFollowUp: '2026-06-15',
    tags: ['lead', 'board-observer', 'saas-focus'],
    notes: 'Lead investor in our seed round. Monthly updates. Very hands-on with GTM strategy.',
  },
  {
    id: 'i2', name: 'Priya Sharma', firm: 'Elevate Capital', type: 'vc', status: 'committed',
    email: 'priya@elevatecap.io', phone: '+44 7700 900002', country: 'UK',
    checkSize: { min: 250, max: 1000 }, preferredStage: ['seed', 'series-a'],
    portfolio: 18, leadInvestor: false, committed: 250, ownership: 3.2,
    lastContact: '2026-05-15', nextFollowUp: '2026-06-10',
    tags: ['seed', 'b2b-saas', 'diversity-focused'],
    notes: 'Participated in seed round. Strong network in healthcare and fintech verticals.',
  },
  {
    id: 'i3', name: 'Marcus Chen', firm: 'Angel Syndicate UK', type: 'angel', status: 'committed',
    email: 'm.chen@angelsyndicate.co.uk', country: 'UK',
    checkSize: { min: 25, max: 150 }, preferredStage: ['pre-seed', 'seed'],
    portfolio: 12, leadInvestor: false, committed: 100, ownership: 1.4,
    lastContact: '2026-04-30',
    tags: ['angel', 'tech-founder', 'ai-focused'],
    notes: 'Ex-founder (2× exits). Provides advisory support on product strategy.',
  },
  {
    id: 'i4', name: 'Sophia Müller', firm: 'TechForward Partners', type: 'vc', status: 'engaged',
    email: 's.muller@techforward.de', phone: '+49 160 9001234', country: 'Germany',
    checkSize: { min: 1000, max: 5000 }, preferredStage: ['series-a', 'series-b'],
    portfolio: 31, leadInvestor: true, committed: 0,
    lastContact: '2026-05-25', nextFollowUp: '2026-06-05',
    tags: ['series-a-lead', 'enterprise-saas', 'europe'],
    notes: 'Leading Series A conversations. Requested updated financial model and ARR bridge.',
  },
  {
    id: 'i5', name: 'David Okafor', firm: 'Lagos Growth Fund', type: 'pe', status: 'prospect',
    email: 'd.okafor@lagosgrowth.com', country: 'Nigeria',
    checkSize: { min: 2000, max: 10000 }, preferredStage: ['series-b', 'growth'],
    portfolio: 9, leadInvestor: false, committed: 0,
    lastContact: '2026-05-10',
    tags: ['africa-focus', 'growth-stage', 'infrastructure'],
    notes: 'Intro via Urban Mobility Co. Interest in expansion into West Africa market.',
  },
  {
    id: 'i6', name: 'Rachel Tanaka', firm: 'Horizon Family Office', type: 'family-office', status: 'engaged',
    email: 'r.tanaka@horizonfo.com', phone: '+81 80 5678 9012', country: 'Japan',
    checkSize: { min: 500, max: 3000 }, preferredStage: ['seed', 'series-a', 'series-b'],
    portfolio: 6, leadInvestor: false, committed: 0,
    lastContact: '2026-05-22', nextFollowUp: '2026-06-12',
    tags: ['family-office', 'patient-capital', 'asia-focus'],
    notes: 'Interested in co-investing alongside TechForward in Series A.',
  },
  {
    id: 'i7', name: 'Ben Hartley', firm: 'Independent', type: 'angel', status: 'prospect',
    email: 'b.hartley@orionfinancial.com', country: 'UK',
    checkSize: { min: 50, max: 200 }, preferredStage: ['seed', 'series-a'],
    portfolio: 4, leadInvestor: false, committed: 0,
    lastContact: '2026-04-15',
    tags: ['angel', 'fintech', 'cfo-network'],
    notes: 'CFO at Orion Financial. Has shown personal interest in investing. Pending Series A close.',
  },
  {
    id: 'i8', name: 'Louise Brennan', firm: 'Accelerate IE', type: 'accelerator', status: 'passed',
    email: 'l.brennan@accelerateie.com', country: 'Ireland',
    checkSize: { min: 50, max: 200 }, preferredStage: ['pre-seed', 'seed'],
    portfolio: 45, leadInvestor: false, committed: 0,
    lastContact: '2026-02-20',
    tags: ['accelerator', 'passed', 'too-early'],
    notes: 'Passed — felt we were too post-revenue for their program stage. May revisit for portfolio introductions.',
  },
]

export const CAP_TABLE: CapTable[] = [
  { id: 'ct1', investorId: 'i1', investorName: 'James Whitfield', firm: 'Whitfield Ventures', round: 'seed', amount: 750, ownership: 8.5, shareClass: 'Series A Preferred', date: '2025-09-01', proRataRights: true,  boardSeat: true  },
  { id: 'ct2', investorId: 'i2', investorName: 'Priya Sharma',    firm: 'Elevate Capital',    round: 'seed', amount: 250, ownership: 3.2, shareClass: 'Series A Preferred', date: '2025-09-01', proRataRights: true,  boardSeat: false },
  { id: 'ct3', investorId: 'i3', investorName: 'Marcus Chen',     firm: 'Angel Syndicate UK', round: 'seed', amount: 100, ownership: 1.4, shareClass: 'Series A Preferred', date: '2025-09-01', proRataRights: false, boardSeat: false },
  { id: 'ct4', investorId: 'founders', investorName: 'C.O.D.E. (Founder)', firm: 'Kangqore', round: 'pre-seed', amount: 0, ownership: 72.4, shareClass: 'Ordinary', date: '2024-01-01', proRataRights: false, boardSeat: true },
  { id: 'ct5', investorId: 'esop', investorName: 'ESOP Pool', firm: 'Kangqore', round: 'seed', amount: 0, ownership: 14.5, shareClass: 'Options Pool', date: '2025-09-01', proRataRights: false, boardSeat: false },
]

export const INVESTOR_UPDATES: InvestorUpdate[] = [
  {
    id: 'u1', type: 'monthly', title: 'May 2026 Investor Update', period: 'May 2026',
    sentDate: '2026-06-01',
    metrics: { mrr: 48500, mrrGrowth: 14, arr: 582000, customers: 23, nrr: 118, runway: 16, headcount: 12, cashOnHand: 920 },
    highlights: [
      'Signed Synapse Health (£320k contract) — largest deal to date',
      'Urban Mobility Co. entering contract negotiation stage',
      'NRR hit 118% — first time above 115% target',
      'Hired Senior Backend Engineer (start June 9)',
    ],
    challenges: [
      'BrightPath Academy lost to cheaper competitor — reviewing pricing tier',
      'Q2 hiring behind plan by 1 FTE due to pipeline quality',
    ],
    askItems: [
      'Intros to Series A leads in healthcare vertical (James / Priya)',
      'Warm intro to Andreessen Horowitz Growth (Marcus)',
    ],
  },
  {
    id: 'u2', type: 'monthly', title: 'April 2026 Investor Update', period: 'April 2026',
    sentDate: '2026-05-02',
    metrics: { mrr: 42500, mrrGrowth: 9, arr: 510000, customers: 21, nrr: 112, runway: 18, headcount: 11, cashOnHand: 1050 },
    highlights: [
      'Quantum Analytics project delivered — reference case live',
      'eQORE scoring model v2 deployed — 23% improvement in lead quality',
      'Closed GreenSpark Energy (£130k)',
    ],
    challenges: [
      'MRR growth below 12% target due to delayed Apex Ventures contract',
      'AWS costs up 18% — optimisation sprint scheduled',
    ],
    askItems: ['Series A deck feedback requested (James)', 'Intro to TechForward Partners (Priya)'],
  },
]

export const FUNDRAISING_ROUNDS: FundraisingRound[] = [
  {
    id: 'r1', name: 'Seed Round', stage: 'seed',
    targetAmount: 1200, raisedAmount: 1100,
    status: 'closed', openDate: '2025-07-01', closeDate: '2025-09-01',
    leadInvestorId: 'i1',
    investors: ['i1', 'i2', 'i3'],
    valuation: 8500,
    useOfFunds: [
      { category: 'Product & Engineering', amount: 550, percentage: 50 },
      { category: 'Sales & Marketing',     amount: 330, percentage: 30 },
      { category: 'Operations',            amount: 220, percentage: 20 },
    ],
  },
  {
    id: 'r2', name: 'Series A', stage: 'series-a',
    targetAmount: 5000, raisedAmount: 0,
    status: 'open', openDate: '2026-05-01',
    leadInvestorId: 'i4',
    investors: ['i4', 'i6'],
    valuation: 28000,
    useOfFunds: [
      { category: 'Product & Engineering', amount: 2000, percentage: 40 },
      { category: 'Sales & GTM',           amount: 1750, percentage: 35 },
      { category: 'International Expansion',amount: 750, percentage: 15 },
      { category: 'Operations & G&A',      amount: 500, percentage: 10 },
    ],
  },
]

export type InvestorType   = 'vc' | 'angel' | 'pe' | 'family-office' | 'corporate' | 'accelerator'
export type InvestorStatus = 'active' | 'prospect' | 'engaged' | 'passed' | 'committed'
export type RoundStage     = 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth' | 'bridge'
export type UpdateType     = 'monthly' | 'quarterly' | 'milestone' | 'ad-hoc'

export interface Investor {
  id: string
  name: string
  firm: string
  type: InvestorType
  status: InvestorStatus
  email: string
  phone?: string
  country: string
  checkSize: { min: number; max: number }   // £k
  preferredStage: RoundStage[]
  portfolio: number                          // number of portfolio companies
  leadInvestor: boolean
  committed: number                          // £k committed to Kangqore
  ownership?: number                         // % equity if committed
  lastContact: string
  nextFollowUp?: string
  tags: string[]
  notes: string
}

export interface CapTable {
  id: string
  investorId: string
  investorName: string
  firm: string
  round: RoundStage
  amount: number          // £k invested
  ownership: number       // % equity
  shareClass: string
  date: string
  proRataRights: boolean
  boardSeat: boolean
}

export interface InvestorUpdate {
  id: string
  type: UpdateType
  title: string
  period: string
  sentDate: string
  metrics: {
    mrr: number
    mrrGrowth: number     // %
    arr: number
    customers: number
    nrr: number           // %
    runway: number        // months
    headcount: number
    cashOnHand: number    // £k
  }
  highlights: string[]
  challenges: string[]
  askItems: string[]
}

export interface FundraisingRound {
  id: string
  name: string
  stage: RoundStage
  targetAmount: number    // £k
  raisedAmount: number    // £k
  status: 'planning' | 'open' | 'closing' | 'closed'
  openDate: string
  closeDate?: string
  leadInvestorId?: string
  investors: string[]     // investor ids
  useOfFunds: { category: string; amount: number; percentage: number }[]
  valuation: number       // £k post-money
}

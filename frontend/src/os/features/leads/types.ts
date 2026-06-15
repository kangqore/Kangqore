export type LeadStage      = 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
export type LeadSource     = 'inbound' | 'outbound' | 'referral' | 'eQORE' | 'event' | 'website'
export type SignalCategory = 'intent' | 'fit' | 'engagement' | 'firmographic'
export type ActivityType   = 'email' | 'call' | 'meeting' | 'note' | 'score-change' | 'stage-change'
export type NurtureStatus  = 'active' | 'paused' | 'completed' | 'opted-out'

export interface Lead {
  id: string
  company: string
  contactName: string
  contactRole: string
  email: string
  phone?: string
  country: string
  industry: string
  stage: LeadStage
  source: LeadSource
  score: number          // 0–100 eQORE composite score
  value: number          // estimated deal value £
  probability: number    // win probability %
  owner: string
  createdAt: string
  lastActivity: string
  tags: string[]
  description: string
}

export interface eQORESignal {
  id: string
  leadId: string
  signal: string
  category: SignalCategory
  weight: number         // 0–1 relative weight in scoring model
  rawScore: number       // 0–100 raw signal score
  contribution: number   // weighted contribution to composite score
  description: string
}

export interface LeadActivity {
  id: string
  leadId: string
  type: ActivityType
  title: string
  description: string
  date: string
  owner: string
  metadata?: string      // e.g. "score: 61 → 74" or "stage: Qualified → Proposal"
}

export interface NurtureStep {
  step: number
  title: string
  type: 'email' | 'call' | 'linkedin' | 'wait'
  description: string
  daysFromPrev: number
  completed: boolean
  completedDate?: string
}

export interface NurtureSequence {
  id: string
  leadId: string
  leadCompany: string
  sequenceName: string
  status: NurtureStatus
  currentStep: number
  steps: NurtureStep[]
  nextActionDate: string
  enrolledDate: string
  lastTouched: string
}

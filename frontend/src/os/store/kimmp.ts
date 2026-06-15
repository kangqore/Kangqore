import { create } from 'zustand'

export type InsightCategory = 'revenue' | 'risk' | 'opportunity' | 'ops' | 'talent'
export type InsightPriority = 'critical' | 'high' | 'medium' | 'low'

export interface Insight {
  id: string
  category: InsightCategory
  priority: InsightPriority
  title: string
  summary: string
  detail: string
  action: string
  module: string    // which OS module this signal belongs to
  confidence: number
  impact: string
  createdAt?: string  // ISO string — when the signal was generated
}

interface KIMMPStore {
  insights: Insight[]
  isLoaded: boolean
  setInsights: (insights: Insight[]) => void
  criticalCount: () => number
  signalsForModule: (module: string) => Insight[]
}

export const KIMMP_MOCK: Insight[] = [
  {
    id: 'k1', category: 'revenue', priority: 'critical', module: 'Leads', confidence: 84, impact: '£320k ARR', createdAt: '2026-06-06T07:15:00.000Z',
    title: 'Synapse Health contract — close this week',
    summary: 'Negotiation stalled at payment split. 75% win probability. Delay risk: 10-day threshold.',
    detail: 'Synapse Health has been in negotiation for 8 days. Deals at this stage that run >10 days close at 52% vs 81% for <10 days. Last contact 3 days ago.',
    action: 'Offer 5-milestone payment structure instead of 4. Unlock £320k contract.',
  },
  {
    id: 'k2', category: 'risk', priority: 'critical', module: 'Finance', confidence: 91, impact: 'Budget risk £18k', createdAt: '2026-06-06T06:40:00.000Z',
    title: 'Sales & GTM budget overspend trajectory',
    summary: 'H1 spend at 103% — Q3 events and travel unplanned. Budget at-risk.',
    detail: 'Sales dept has exceeded H1 budget by £3.2k due to unplanned travel for HealthTech Europe. No Q3 headroom flagged.',
    action: 'Review Q3 sales budget with Sofia. Reallocate £8k from travel to paid ads.',
  },
  {
    id: 'k3', category: 'opportunity', priority: 'high', module: 'Clients', confidence: 71, impact: '£45k–85k upsell', createdAt: '2026-06-05T14:20:00.000Z',
    title: 'GreenSpark Energy upsell window',
    summary: 'GreenSpark has shown 3× usage spike on Analytics module — upsell signal detected.',
    detail: 'GreenSpark team accessed analytics 48× in 2 weeks — 3× normal. This signal preceded upsell conversation in 71% of similar cases.',
    action: 'Ravi to schedule QBR with GreenSpark CDO. Propose analytics platform expansion.',
  },
  {
    id: 'k4', category: 'talent', priority: 'high', module: 'Careers', confidence: 77, impact: '8-week hiring delay', createdAt: '2026-06-06T05:00:00.000Z',
    title: 'Backend Engineer offer — Raj Mehta at risk',
    summary: 'Offer sent 2 days ago. No response. LinkedIn updated yesterday. 48h accept window ending.',
    detail: 'Offers not accepted within 48h close at 58% vs 94% for <24h. LinkedIn profile updated — counter-offer signal.',
    action: 'Dev Patel to call Raj Mehta today. Address concerns. Counter-offer ceiling £98k.',
  },
  {
    id: 'k5', category: 'ops', priority: 'medium', module: 'Finance', confidence: 98, impact: '£42k cash at risk', createdAt: '2026-06-05T09:30:00.000Z',
    title: 'Invoice AR: Orion Financial 14-day overdue',
    summary: 'Invoice INV-2024 (£42k) 14 days overdue. Escalation threshold reached. No human action logged.',
    detail: 'Automated workflow escalated yesterday. Sofia Mendez owns Orion. Orion also in leads pipeline — handle delicately.',
    action: 'Sofia to contact Ben Hartley directly — frame as administrative, not a chaser.',
  },
  {
    id: 'k6', category: 'opportunity', priority: 'medium', module: 'Investors', confidence: 88, impact: '£5M Series A risk', createdAt: '2026-06-04T11:00:00.000Z',
    title: 'TechForward Partners — ARR bridge model overdue',
    summary: 'Sophia Müller requested updated financial model 6 days ago. Not delivered. Silent deal-blocker.',
    detail: 'TechForward Partners (Series A lead) requested ARR bridge model on 2026-05-25. Next follow-up 2026-06-05 — model must be ready before that.',
    action: 'Mahesh to send updated ARR bridge model to Sophia Müller by 2026-06-04.',
  },
  {
    id: 'k7', category: 'revenue', priority: 'high', module: 'Leads', confidence: 67, impact: '£95k ARR', createdAt: '2026-06-05T16:45:00.000Z',
    title: 'Quantum Analytics — proposal stage 12 days',
    summary: 'Proposal sent 12 days ago with no response. Industry average close: 8 days at proposal stage.',
    detail: 'Quantum Analytics has been at proposal stage for 12 days (avg 8). Last activity: proposal sent. Decision-maker Ben Sato — no follow-up logged.',
    action: 'Schedule follow-up call. Ask directly if pricing is the blocker.',
  },
  {
    id: 'k8', category: 'ops', priority: 'low', module: 'Projects', confidence: 74, impact: 'Timeline risk', createdAt: '2026-06-03T08:00:00.000Z',
    title: 'eQORE v2 Sprint 14 — velocity drop detected',
    summary: '3 sprints in a row below target velocity (31, 28, 29 vs 42 target). Delivery risk emerging.',
    detail: 'eQORE v2 has had three consecutive under-velocity sprints. At current pace, Phase 2 delivery slips by ~3 weeks.',
    action: 'Dev Patel to review with team. Identify blockers. Adjust scope or deadline.',
  },
]

export function toInsight(raw: Record<string, unknown>, i: number): Insight {
  const cats: InsightCategory[] = ['revenue', 'risk', 'opportunity', 'ops', 'talent']
  const pris: InsightPriority[] = ['critical', 'high', 'medium', 'low']
  const rawCat = String(raw.category ?? '').toLowerCase()
  const rawPri = String(raw.priority ?? 'medium').toLowerCase()
  return {
    id:         String(raw.id ?? `k${i}`),
    category:   cats.includes(rawCat as InsightCategory) ? rawCat as InsightCategory : 'opportunity',
    priority:   pris.includes(rawPri as InsightPriority) ? rawPri as InsightPriority : 'medium',
    title:      String(raw.title ?? 'Untitled insight'),
    summary:    String(raw.summary ?? raw.content ?? '').slice(0, 200),
    detail:     String(raw.content ?? raw.detail ?? ''),
    action:     String(raw.action ?? raw.recommendation ?? ''),
    module:     String(raw.module ?? raw.tags ?? 'System'),
    confidence: Number(raw.confidence ?? raw.score ?? 80),
    impact:     String(raw.impact ?? raw.value ?? '—'),
    createdAt:  raw.createdAt ? String(raw.createdAt) : undefined,
  }
}

export const useKIMMPStore = create<KIMMPStore>((set, get) => ({
  insights: KIMMP_MOCK,
  isLoaded: false,

  setInsights: (insights) => set({ insights, isLoaded: true }),

  criticalCount: () => get().insights.filter(i => i.priority === 'critical').length,

  signalsForModule: (module: string) =>
    get().insights.filter(i =>
      i.module.toLowerCase() === module.toLowerCase()
    ).sort((a, b) => {
      const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
      return (order[a.priority] ?? 9) - (order[b.priority] ?? 9)
    }),
}))

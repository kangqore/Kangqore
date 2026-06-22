import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isDemo } from '@lib/api'

export type InsightCategory = 'revenue' | 'risk' | 'opportunity' | 'ops' | 'talent'
export type InsightPriority = 'critical' | 'high' | 'medium' | 'low'
export type InsightType     = 'reactive' | 'predictive'

export interface Insight {
  id: string
  type?: InsightType          // defaults to 'reactive'
  category: InsightCategory
  priority: InsightPriority
  title: string
  summary: string
  detail: string
  action: string
  module: string
  confidence: number
  impact: string
  createdAt?: string
  forecastHorizon?: string    // predictive only — e.g. "6 weeks", "Q3 2026"
  forecastBasis?: string      // what data underpins the prediction
}

export interface MemoryEntry {
  id: string
  signalId: string
  signalTitle: string
  signalCategory: InsightCategory
  action: 'acknowledged' | 'acted'
  note?: string
  timestamp: string
}

// ─── Persisted slice (acknowledged IDs + memory log) ─────────────────────────

interface KIMMPPersisted {
  acknowledgedIds: string[]
  memoryEntries: MemoryEntry[]
}

interface KIMMPStore extends KIMMPPersisted {
  insights: Insight[]
  isLoaded: boolean

  // mutations
  setInsights:        (insights: Insight[]) => void
  addLiveSignal:      (signal: Insight) => void
  acknowledgeSignal:  (id: string, note?: string) => void
  unacknowledgeSignal:(id: string) => void

  // computed
  criticalCount:      () => number
  signalsForModule:   (module: string) => Insight[]
  isAcknowledged:     (id: string) => boolean
  healthScore:        () => number
  healthByDimension:  () => Record<InsightCategory, number>
}

// ─── Scoring weights ──────────────────────────────────────────────────────────

const PRIORITY_WEIGHT: Record<InsightPriority, number> = {
  critical: 20,
  high:      8,
  medium:    3,
  low:       1,
}

// ─── Mock reactive signals ────────────────────────────────────────────────────

export const KIMMP_MOCK: Insight[] = [
  {
    id: 'k1', type: 'reactive', category: 'revenue', priority: 'critical', module: 'Leads', confidence: 84, impact: '£320k ARR',
    createdAt: '2026-06-06T07:15:00.000Z',
    title: 'Synapse Health contract — close this week',
    summary: 'Negotiation stalled at payment split. 75% win probability. Delay risk: 10-day threshold.',
    detail: 'Synapse Health has been in negotiation for 8 days. Deals at this stage that run >10 days close at 52% vs 81% for <10 days. Last contact 3 days ago.',
    action: 'Offer 5-milestone payment structure instead of 4. Unlock £320k contract.',
  },
  {
    id: 'k2', type: 'reactive', category: 'risk', priority: 'critical', module: 'Finance', confidence: 91, impact: 'Budget risk £18k',
    createdAt: '2026-06-06T06:40:00.000Z',
    title: 'Sales & GTM budget overspend trajectory',
    summary: 'H1 spend at 103% — Q3 events and travel unplanned. Budget at-risk.',
    detail: 'Sales dept has exceeded H1 budget by £3.2k due to unplanned travel for HealthTech Europe. No Q3 headroom flagged.',
    action: 'Review Q3 sales budget with Sofia. Reallocate £8k from travel to paid ads.',
  },
  {
    id: 'k3', type: 'reactive', category: 'opportunity', priority: 'high', module: 'Clients', confidence: 71, impact: '£45k–85k upsell',
    createdAt: '2026-06-05T14:20:00.000Z',
    title: 'GreenSpark Energy upsell window',
    summary: 'GreenSpark has shown 3× usage spike on Analytics module — upsell signal detected.',
    detail: 'GreenSpark team accessed analytics 48× in 2 weeks — 3× normal. This signal preceded upsell conversation in 71% of similar cases.',
    action: 'Ravi to schedule QBR with GreenSpark CDO. Propose analytics platform expansion.',
  },
  {
    id: 'k4', type: 'reactive', category: 'talent', priority: 'high', module: 'Careers', confidence: 77, impact: '8-week hiring delay',
    createdAt: '2026-06-06T05:00:00.000Z',
    title: 'Backend Engineer offer — Raj Mehta at risk',
    summary: 'Offer sent 2 days ago. No response. LinkedIn updated yesterday. 48h accept window ending.',
    detail: 'Offers not accepted within 48h close at 58% vs 94% for <24h. LinkedIn profile updated — counter-offer signal.',
    action: 'Dev Patel to call Raj Mehta today. Address concerns. Counter-offer ceiling £98k.',
  },
  {
    id: 'k5', type: 'reactive', category: 'ops', priority: 'medium', module: 'Finance', confidence: 98, impact: '£42k cash at risk',
    createdAt: '2026-06-05T09:30:00.000Z',
    title: 'Invoice AR: Orion Financial 14-day overdue',
    summary: 'Invoice INV-2024 (£42k) 14 days overdue. Escalation threshold reached. No human action logged.',
    detail: 'Automated workflow escalated yesterday. Sofia Mendez owns Orion. Orion also in leads pipeline — handle delicately.',
    action: 'Sofia to contact Ben Hartley directly — frame as administrative, not a chaser.',
  },
  {
    id: 'k6', type: 'reactive', category: 'opportunity', priority: 'medium', module: 'Investors', confidence: 88, impact: '£5M Series A risk',
    createdAt: '2026-06-04T11:00:00.000Z',
    title: 'TechForward Partners — ARR bridge model overdue',
    summary: 'Sophia Müller requested updated financial model 6 days ago. Not delivered. Silent deal-blocker.',
    detail: 'TechForward Partners (Series A lead) requested ARR bridge model on 2026-05-25. Next follow-up 2026-06-05 — model must be ready before that.',
    action: 'Mahesh to send updated ARR bridge model to Sophia Müller by 2026-06-04.',
  },
  {
    id: 'k7', type: 'reactive', category: 'revenue', priority: 'high', module: 'Leads', confidence: 67, impact: '£95k ARR',
    createdAt: '2026-06-05T16:45:00.000Z',
    title: 'Quantum Analytics — proposal stage 12 days',
    summary: 'Proposal sent 12 days ago with no response. Industry average close: 8 days at proposal stage.',
    detail: 'Quantum Analytics has been at proposal stage for 12 days (avg 8). Last activity: proposal sent. Decision-maker Ben Sato — no follow-up logged.',
    action: 'Schedule follow-up call. Ask directly if pricing is the blocker.',
  },
  {
    id: 'k8', type: 'reactive', category: 'ops', priority: 'low', module: 'Projects', confidence: 74, impact: 'Timeline risk',
    createdAt: '2026-06-03T08:00:00.000Z',
    title: 'eQORE v2 Sprint 14 — velocity drop detected',
    summary: '3 sprints in a row below target velocity (31, 28, 29 vs 42 target). Delivery risk emerging.',
    detail: 'eQORE v2 has had three consecutive under-velocity sprints. At current pace, Phase 2 delivery slips by ~3 weeks.',
    action: 'Dev Patel to review with team. Identify blockers. Adjust scope or deadline.',
  },
]

// ─── Mock predictive signals ──────────────────────────────────────────────────

export const KIMMP_FORECAST: Insight[] = [
  {
    id: 'p1', type: 'predictive', category: 'revenue', priority: 'critical', module: 'Finance', confidence: 79, impact: '£420k ARR gap',
    createdAt: '2026-06-16T06:00:00.000Z',
    forecastHorizon: 'Q3 2026',
    forecastBasis: 'Pipeline velocity × average deal size × historical close rates',
    title: 'Q3 ARR target at risk — pipeline 38% short',
    summary: 'At current pipeline velocity, Q3 close rate will leave a £420k gap against the £1.1M ARR target.',
    detail: 'Q3 pipeline contains 9 active deals totalling £680k. At a 68% historical close rate that yields £462k — £638k short of the £1.1M target. 3 new enterprise deals must enter pipeline by end of July to bridge.',
    action: 'Accelerate enterprise outreach. Target 3 new £200k+ deals before July 31.',
  },
  {
    id: 'p2', type: 'predictive', category: 'risk', priority: 'high', module: 'Finance', confidence: 85, impact: '5-month runway',
    createdAt: '2026-06-16T06:00:00.000Z',
    forecastHorizon: '8 weeks',
    forecastBasis: 'Current burn rate × AR pipeline × planned headcount additions',
    title: 'Cash runway drops below 6 months by August',
    summary: 'Projected burn rate + 2 planned hires brings runway to 5.1 months by mid-August without new revenue.',
    detail: 'Current MRR: £42k. Monthly burn: £67k. Net burn: £25k/mo. With 2 planned hires (+£14k/mo), net burn rises to £39k/mo. Runway drops from 8.2 months to 5.1 months by week 8. Series A close must precede August.',
    action: 'Accelerate Series A timeline. Delay hire #2 by 6 weeks if round not closed by July 15.',
  },
  {
    id: 'p3', type: 'predictive', category: 'talent', priority: 'high', module: 'Resources', confidence: 72, impact: '3-sprint delay',
    createdAt: '2026-06-15T08:00:00.000Z',
    forecastHorizon: '6 weeks',
    forecastBasis: 'Velocity trend × planned scope × current headcount',
    title: 'Engineering capacity will block Q3 product roadmap',
    summary: 'At current velocity and scope, the engineering team cannot deliver Phase 3 within Q3 without additional capacity.',
    detail: 'Phase 3 scope is 186 story points. At current 29pt/sprint velocity (2-week sprints), that\'s 6.4 sprints = 12.8 weeks. Phase 3 must ship by Sept 30 (14 weeks). Buffer: 1.2 weeks. Any scope addition or velocity dip = miss.',
    action: 'Freeze Phase 3 scope immediately. Hire one mid-level engineer or bring in contractor by July 1.',
  },
  {
    id: 'p4', type: 'predictive', category: 'opportunity', priority: 'medium', module: 'Clients', confidence: 68, impact: '£120k upsell',
    createdAt: '2026-06-14T10:00:00.000Z',
    forecastHorizon: '4 weeks',
    forecastBasis: 'Usage pattern analysis × historical upsell trigger correlation',
    title: 'Nexus Partners approaching upsell inflection',
    summary: 'Nexus Partners usage has grown 40% in 6 weeks. Based on 12 prior cases, upsell conversation should open within 4 weeks.',
    detail: 'Nexus has onboarded 3 new internal users in 6 weeks and API call volume is up 40%. In 12 comparable cases, this pattern preceded a platform upgrade discussion within 4–6 weeks at 68% conversion.',
    action: 'Pre-book a success review call with Nexus for Week 3 of July. Come with usage data and upgrade proposal.',
  },
  {
    id: 'p5', type: 'predictive', category: 'ops', priority: 'medium', module: 'Leads', confidence: 81, impact: 'Pipeline gap',
    createdAt: '2026-06-16T05:00:00.000Z',
    forecastHorizon: '3 weeks',
    forecastBasis: 'Deal stage duration × conversion rate × current pipeline composition',
    title: 'Lead pipeline will thin in 3 weeks without new intake',
    summary: '6 active deals are approaching close or stall. No new leads entered pipeline this week. Gap forming.',
    detail: 'Of 9 pipeline deals: 3 are at final negotiation (likely close/drop within 2 weeks), 2 are stalling (>10 days no movement). That leaves 4 active deals by Week 3. Historical minimum for healthy pipeline: 8 active deals.',
    action: 'Activate 2 outbound campaigns this week. Target HealthTech and FinTech verticals with existing case studies.',
  },
  {
    id: 'p6', type: 'predictive', category: 'talent', priority: 'low', module: 'Careers', confidence: 61, impact: 'Culture risk',
    createdAt: '2026-06-13T09:00:00.000Z',
    forecastHorizon: '8 weeks',
    forecastBasis: 'Hiring pace vs team growth model × onboarding load',
    title: 'Onboarding load will exceed capacity if 3 hires start simultaneously',
    summary: '3 offers pending acceptance. If all accept and start same month, onboarding load exceeds safe capacity.',
    detail: 'Current team has 1 designated onboarding lead (Dev Patel). Safe capacity: 1.5 new hires/month. 3 simultaneous starts would compress culture immersion, tooling setup, and mentoring into an unsustainable window.',
    action: 'Stagger start dates by 3 weeks minimum. Nominate a second onboarding buddy for the engineering cohort.',
  },
]

// ─── toInsight mapper ─────────────────────────────────────────────────────────

export function toInsight(raw: Record<string, unknown>, i: number): Insight {
  const cats: InsightCategory[] = ['revenue', 'risk', 'opportunity', 'ops', 'talent']
  const pris: InsightPriority[] = ['critical', 'high', 'medium', 'low']
  const rawCat = String(raw.category ?? '').toLowerCase()
  const rawPri = String(raw.priority ?? 'medium').toLowerCase()
  return {
    id:               String(raw.id ?? `k${i}`),
    type:             raw.type === 'predictive' ? 'predictive' : 'reactive',
    category:         cats.includes(rawCat as InsightCategory) ? rawCat as InsightCategory : 'opportunity',
    priority:         pris.includes(rawPri as InsightPriority) ? rawPri as InsightPriority : 'medium',
    title:            String(raw.title ?? 'Untitled insight'),
    summary:          String(raw.summary ?? raw.content ?? '').slice(0, 200),
    detail:           String(raw.content ?? raw.detail ?? ''),
    action:           String(raw.action ?? raw.recommendation ?? ''),
    module:           String(raw.module ?? raw.tags ?? 'System'),
    confidence:       Number(raw.confidence ?? raw.score ?? 80),
    impact:           String(raw.impact ?? raw.value ?? '—'),
    createdAt:        raw.createdAt ? String(raw.createdAt) : undefined,
    forecastHorizon:  raw.forecastHorizon ? String(raw.forecastHorizon) : undefined,
    forecastBasis:    raw.forecastBasis ? String(raw.forecastBasis) : undefined,
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useKIMMPStore = create<KIMMPStore>()(
  persist(
    (set, get) => ({
      insights:        isDemo() ? [...KIMMP_MOCK, ...KIMMP_FORECAST] : [],
      isLoaded:        false,
      acknowledgedIds: [],
      memoryEntries:   [],

      setInsights: (insights) => set({ insights, isLoaded: true }),

      addLiveSignal: (signal) => set(s => ({
        insights: [signal, ...s.insights.filter(i => i.id !== signal.id)],
      })),

      acknowledgeSignal: (id, note) => {
        const signal = get().insights.find(i => i.id === id)
        if (!signal) return
        const entry: MemoryEntry = {
          id:            `mem-${Date.now()}`,
          signalId:      id,
          signalTitle:   signal.title,
          signalCategory: signal.category,
          action:        'acknowledged',
          note,
          timestamp:     new Date().toISOString(),
        }
        set(s => ({
          acknowledgedIds: [...s.acknowledgedIds.filter(x => x !== id), id],
          memoryEntries:   [entry, ...s.memoryEntries].slice(0, 100),
        }))
      },

      unacknowledgeSignal: (id) => set(s => ({
        acknowledgedIds: s.acknowledgedIds.filter(x => x !== id),
      })),

      isAcknowledged: (id) => get().acknowledgedIds.includes(id),

      criticalCount: () => get().insights
        .filter(i => i.type !== 'predictive')
        .filter(i => i.priority === 'critical').length,

      signalsForModule: (module) =>
        get().insights
          .filter(i => i.module.toLowerCase() === module.toLowerCase())
          .filter(i => i.type !== 'predictive')
          .sort((a, b) => {
            const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
            return (order[a.priority] ?? 9) - (order[b.priority] ?? 9)
          }),

      healthScore: () => {
        const reactive = get().insights.filter(i => i.type !== 'predictive')
        const acknowledged = get().acknowledgedIds
        const active = reactive.filter(i => !acknowledged.includes(i.id))
        const deduction = active.reduce((sum, i) => sum + (PRIORITY_WEIGHT[i.priority] ?? 0), 0)
        return Math.max(0, Math.min(100, 100 - deduction))
      },

      healthByDimension: () => {
        const reactive = get().insights.filter(i => i.type !== 'predictive')
        const acknowledged = get().acknowledgedIds
        const active = reactive.filter(i => !acknowledged.includes(i.id))
        const dims: InsightCategory[] = ['revenue', 'risk', 'opportunity', 'ops', 'talent']
        const scores = {} as Record<InsightCategory, number>
        dims.forEach(dim => {
          const dimSignals = active.filter(i => i.category === dim)
          const deduction = dimSignals.reduce((sum, i) => sum + (PRIORITY_WEIGHT[i.priority] ?? 0), 0)
          scores[dim] = Math.max(0, Math.min(100, 100 - deduction))
        })
        return scores
      },
    }),
    {
      name: 'kangqore-kimmp',
      partialize: s => ({
        acknowledgedIds: s.acknowledgedIds,
        memoryEntries:   s.memoryEntries,
      }),
    }
  )
)

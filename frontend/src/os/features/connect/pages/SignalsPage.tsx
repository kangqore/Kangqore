import { useState } from 'react'
import { Activity, Brain, Zap, AlertTriangle, TrendingUp, Clock } from 'lucide-react'

type SignalLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5'
type SignalDomain = 'Revenue' | 'Delivery' | 'People' | 'Finance' | 'Compliance' | 'Operations'

interface Signal {
  id: string
  source: string
  sourceLogo: string
  level: SignalLevel
  domain: SignalDomain
  entity: string
  description: string
  kimmpAction?: string
  confidence?: number
  timestamp: string
  weight: number
}

const LEVEL_CONFIG: Record<SignalLevel, { label: string; color: string; description: string }> = {
  L1: { label: 'Raw Event',    color: 'var(--os-text-2)', description: 'Unprocessed inbound event from connector' },
  L2: { label: 'Signal',       color: '#2564ea', description: 'Normalised, entity-tagged, weight-scored' },
  L3: { label: 'Correlation',  color: '#7f53f9', description: 'Two or more signals with shared entity overlap' },
  L4: { label: 'Intelligence', color: '#fdab3d', description: 'KIMMP pattern matched, hypothesis formed' },
  L5: { label: 'Decision',     color: '#e2445c', description: 'Actionable recommendation, executive-ready' },
}

const DOMAIN_COLOR: Record<SignalDomain, string> = {
  Revenue:    '#00c875',
  Delivery:   '#2564ea',
  People:     '#7f53f9',
  Finance:    '#fdab3d',
  Compliance: '#e2445c',
  Operations: 'var(--os-text-2)',
}

const signals: Signal[] = [
  {
    id: 'SIG-001',
    source: 'Salesforce',
    sourceLogo: 'SF',
    level: 'L5',
    domain: 'Revenue',
    entity: 'Meridian Logistics',
    description: 'Three converging signals: deal marked at-risk, invoice overdue 18 days, no client contact in 22 days. Pattern matches pre-churn signature.',
    kimmpAction: 'Assign relationship lead. Initiate retention call within 24h. Resolve invoice immediately.',
    confidence: 87,
    timestamp: '4m ago',
    weight: 9.2,
  },
  {
    id: 'SIG-002',
    source: 'Jira',
    sourceLogo: 'JR',
    level: 'L4',
    domain: 'Delivery',
    entity: 'Synapse Health',
    description: 'Sprint 14 velocity dropped 34% vs baseline. Two engineers flagged as blocked. Correlated with resource over-allocation detected in Workday.',
    kimmpAction: 'Review Aarav Shah allocation. Consider contingency resource for Sprint 14.',
    confidence: 94,
    timestamp: '12m ago',
    weight: 8.7,
  },
  {
    id: 'SIG-003',
    source: 'ServiceNow',
    sourceLogo: 'SN',
    level: 'L3',
    domain: 'Compliance',
    entity: 'SOC 2 Type I',
    description: 'Four SOC 2 controls in the Access Management category have evidence submissions overdue by 5+ days. Pattern correlates with upcoming audit window.',
    confidence: 97,
    timestamp: '28m ago',
    weight: 7.8,
  },
  {
    id: 'SIG-004',
    source: 'Jira',
    sourceLogo: 'JR',
    level: 'L2',
    domain: 'Delivery',
    entity: 'Project Meridian',
    description: 'Defect rate increased 22% in Sprint 14 vs Sprint 13. 3 critical bugs open against the HANUMANAS integration layer.',
    timestamp: '45m ago',
    weight: 6.1,
  },
  {
    id: 'SIG-005',
    source: 'Stripe',
    sourceLogo: 'ST',
    level: 'L2',
    domain: 'Finance',
    entity: 'Infinova Corp',
    description: 'Invoice #INV-2026-047 (£42,000) is 7 days overdue. No payment attempt on file. Contract renewal is in 34 days.',
    timestamp: '1h ago',
    weight: 5.9,
  },
  {
    id: 'SIG-006',
    source: 'Salesforce',
    sourceLogo: 'SF',
    level: 'L2',
    domain: 'Revenue',
    entity: 'Apex Financial',
    description: 'Deal stage moved from "Proposal" to "Negotiation" — ACV £380K. Decision expected in 12 days.',
    timestamp: '2h ago',
    weight: 4.5,
  },
  {
    id: 'SIG-007',
    source: 'ServiceNow',
    sourceLogo: 'SN',
    level: 'L1',
    domain: 'Operations',
    entity: 'Internal IT',
    description: 'P3 incident raised: VPN gateway latency spike (avg 340ms, threshold 200ms). 14 users affected.',
    timestamp: '2h ago',
    weight: 2.1,
  },
  {
    id: 'SIG-008',
    source: 'Jira',
    sourceLogo: 'JR',
    level: 'L1',
    domain: 'Delivery',
    entity: 'Ops Centre Sprint 0',
    description: 'Story KAN-218 moved to "In Review" — Entity Graph page complete. Blocking: design freeze confirmation.',
    timestamp: '3h ago',
    weight: 1.8,
  },
]

type LevelFilter = 'all' | SignalLevel

export function SignalsPage() {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all')

  const visible = signals.filter(s => levelFilter === 'all' || s.level === levelFilter)

  const totalToday  = 1847
  const l5Count     = signals.filter(s => s.level === 'L5').length
  const l4Count     = signals.filter(s => s.level === 'L4').length

  return (
    <div className="space-y-8">
      {/* Pyramid summary */}
      <div className="grid grid-cols-5 gap-2">
        {(Object.entries(LEVEL_CONFIG) as [SignalLevel, typeof LEVEL_CONFIG[SignalLevel]][]).map(([level, cfg]) => {
          const count = signals.filter(s => s.level === level).length
          return (
            <button
              key={level}
              onClick={() => setLevelFilter(levelFilter === level ? 'all' : level)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                levelFilter === level
                  ? 'border-white/25 bg-slate-800/60'
                  : 'border-[var(--os-border)] bg-slate-900/40 hover:border-[var(--os-border)]'
              }`}
            >
              <p className="text-lg font-bold" style={{ color: cfg.color }}>{count}</p>
              <p className="text-[10px] font-black uppercase tracking-wider mt-1" style={{ color: cfg.color }}>{level}</p>
              <p className="text-[9px] text-[var(--os-text-2)] mt-0.5 leading-tight">{cfg.label}</p>
            </button>
          )
        })}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[var(--os-text-2)]"><span className="font-bold text-white">{totalToday.toLocaleString()}</span> raw events ingested today</span>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[var(--os-text-2)]"><span className="font-bold text-white">{l4Count + l5Count}</span> require attention</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[var(--os-text-2)]"><span className="font-bold text-white">{l5Count}</span> L5 decisions outstanding</span>
        </div>
      </div>

      {/* Signal feed */}
      <div className="space-y-3">
        {visible.map(sig => {
          const cfg = LEVEL_CONFIG[sig.level]
          return (
            <div key={sig.id} className="p-5 rounded-2xl border border-[var(--os-border)] bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10 hover:border-[var(--os-border)] transition-colors">
              <div className="flex items-start gap-4">
                {/* Source logo */}
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black text-white flex-shrink-0 bg-slate-800 border border-[var(--os-border)]">
                  {sig.sourceLogo}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {/* Level badge */}
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}30` }}>
                      {sig.level} · {cfg.label}
                    </span>
                    {/* Domain */}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: DOMAIN_COLOR[sig.domain], background: `${DOMAIN_COLOR[sig.domain]}15` }}>
                      {sig.domain}
                    </span>
                    {/* Entity */}
                    <span className="text-[10px] font-semibold text-[var(--os-text-2)] bg-slate-800 px-2 py-0.5 rounded-full">{sig.entity}</span>
                    <span className="text-[9px] text-[var(--os-text-2)] ml-auto">{sig.source} · {sig.timestamp}</span>
                  </div>

                  <p className="text-sm text-[var(--os-text-1)] leading-relaxed mb-2">{sig.description}</p>

                  {sig.kimmpAction && (
                    <div className="flex items-start gap-2 mt-3 p-3 rounded-2xl bg-[#0d1117] border border-[#2E2854]">
                      <Brain className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] font-black tracking-widest text-purple-400 uppercase">KIMMP Recommendation</span>
                        <p className="text-xs text-[var(--os-text-2)] mt-0.5 leading-relaxed">{sig.kimmpAction}</p>
                      </div>
                      {sig.confidence && (
                        <span className="text-[10px] font-bold text-purple-400/60 ml-auto flex-shrink-0">{sig.confidence}%</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Weight */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-sm font-bold text-[var(--os-text-1)]">{sig.weight.toFixed(1)}</span>
                  <span className="text-[9px] text-[var(--os-text-2)]">weight</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

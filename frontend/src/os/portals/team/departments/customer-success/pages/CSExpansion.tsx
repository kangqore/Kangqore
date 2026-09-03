import { TrendingUp } from 'lucide-react'

const ACCENT = '#14B8A6'

type ExpansionStage = 'Identified' | 'Qualified' | 'Proposed' | 'Negotiating' | 'Closed'

interface ExpansionOpp {
  account:     string
  currentArr:  string
  opportunity: string
  estValue:    string
  stage:       ExpansionStage
  owner:       string
}

const OPPS: ExpansionOpp[] = [
  { account: 'Acme Corp',    currentArr: '£120k', opportunity: 'Add Cognition module',   estValue: '£40k',  stage: 'Qualified',   owner: 'Lena Park'  },
  { account: 'GlobalMed',   currentArr: '£340k', opportunity: 'HANUMANAS add-on',           estValue: '£80k',  stage: 'Proposed',    owner: 'Raj Mehta'  },
  { account: 'DataCo',      currentArr: '£210k', opportunity: 'Seat expansion +10',     estValue: '£25k',  stage: 'Negotiating', owner: 'Lena Park'  },
  { account: 'RetailGiant', currentArr: '£180k', opportunity: 'BIDS™ Enterprise',       estValue: '£120k', stage: 'Proposed',    owner: 'Raj Mehta'  },
  { account: 'TechScale',   currentArr: '£60k',  opportunity: 'Foundry add-on',         estValue: '£35k',  stage: 'Identified',  owner: 'Raj Mehta'  },
  { account: 'LegalPlus',   currentArr: '£45k',  opportunity: 'Compliance module',      estValue: '£30k',  stage: 'Qualified',   owner: 'Lena Park'  },
]

const STAGE_COLOR: Record<ExpansionStage, { bg: string; text: string }> = {
  'Identified':  { bg: '#6B728022', text: '#9CA3AF' },
  'Qualified':   { bg: '#0EA5E922', text: '#38BDF8' },
  'Proposed':    { bg: '#6366F122', text: '#818CF8' },
  'Negotiating': { bg: '#F59E0B22', text: '#F59E0B' },
  'Closed':      { bg: '#10B98122', text: '#10B981' },
}

export function CSExpansion() {
  const identified    = 14
  const pipelineValue = '£480k'
  const convertedYtd  = '£210k'
  const expansionRate = '28%'

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <TrendingUp size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Expansion Opportunities</h1>
          <p className="text-sm text-[var(--os-text-2)]">Upsell and cross-sell pipeline — KIMMP close probability scoring</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Identified Opportunities', value: String(identified),  color: ACCENT    },
          { label: 'Pipeline Value',            value: pipelineValue,       color: '#A78BFA' },
          { label: 'Converted YTD',             value: convertedYtd,        color: '#10B981' },
          { label: 'Expansion Rate',            value: expansionRate,        color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* KIMMP */}
      <div className="p-4 rounded-2xl border border-teal-500/30 bg-teal-500/10">
        <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">KIMMP Intelligence</p>
        <p className="text-sm text-[var(--os-text-1)]">
          RetailGiant BIDS&#8482; Enterprise opportunity has 78% close probability — they asked about it in last
          QBR and usage data shows they&apos;ve outgrown Starter plan.
        </p>
      </div>

      {/* Expansion table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr_1fr] text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider px-5 py-3 border-b border-white/10">
          <span>Account</span>
          <span>Current ARR</span>
          <span>Opportunity</span>
          <span>Est. Value</span>
          <span>Stage</span>
          <span>Owner</span>
        </div>
        {OPPS.map(o => {
          const sc = STAGE_COLOR[o.stage]
          return (
            <div
              key={`${o.account}-${o.opportunity}`}
              className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr_1fr] items-center px-5 py-4 border-b border-white/5 hover:bg-slate-800/40 transition-colors"
            >
              <span className="text-sm font-semibold text-white">{o.account}</span>
              <span className="text-sm text-[var(--os-text-2)]">{o.currentArr}</span>
              <span className="text-sm text-[var(--os-text-1)]">{o.opportunity}</span>
              <span className="text-sm font-bold" style={{ color: ACCENT }}>{o.estValue}</span>
              <span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>
                  {o.stage}
                </span>
              </span>
              <span className="text-sm text-[var(--os-text-1)]">{o.owner}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

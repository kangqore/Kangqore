import { GraduationCap } from 'lucide-react'

const ACCENT = '#14B8A6'

type OnboardingStage  = 'Kickoff' | 'Platform Setup' | 'Training' | 'Go-Live' | 'Handover'
type OnboardingStatus = 'ON_TRACK' | 'DELAYED'

interface Onboarding {
  client:     string
  startDate:  string
  csm:        string
  stage:      OnboardingStage
  daysActive: number
  status:     OnboardingStatus
}

const ONBOARDINGS: Onboarding[] = [
  { client: 'NovaTech Ltd',     startDate: '2026-06-01', csm: 'Lena Park',  stage: 'Go-Live',       daysActive: 22, status: 'ON_TRACK' },
  { client: 'PrimeRetail',      startDate: '2026-06-08', csm: 'Raj Mehta',  stage: 'Training',      daysActive: 15, status: 'ON_TRACK' },
  { client: 'HealthStartup',    startDate: '2026-05-20', csm: 'Lena Park',  stage: 'Training',      daysActive: 34, status: 'DELAYED'  },
  { client: 'CivicCore',        startDate: '2026-06-15', csm: 'Raj Mehta',  stage: 'Platform Setup',daysActive:  8, status: 'ON_TRACK' },
  { client: 'AquaInfra',        startDate: '2026-06-20', csm: 'Lena Park',  stage: 'Kickoff',       daysActive:  3, status: 'ON_TRACK' },
]

const STAGES: OnboardingStage[] = ['Kickoff', 'Platform Setup', 'Training', 'Go-Live', 'Handover']

const STAGE_COLOR: Record<OnboardingStage, string> = {
  'Kickoff':       '#6366F1',
  'Platform Setup':'#0EA5E9',
  'Training':      '#F59E0B',
  'Go-Live':       '#10B981',
  'Handover':      '#14B8A6',
}

const STATUS_STYLE: Record<OnboardingStatus, { bg: string; text: string; label: string }> = {
  ON_TRACK: { bg: '#10B98122', text: '#10B981', label: 'On Track' },
  DELAYED:  { bg: '#EF444422', text: '#EF4444', label: 'Delayed'  },
}

export function CSOnboarding() {
  const active     = ONBOARDINGS.length
  const avgTtv     = 34
  const onTrack    = ONBOARDINGS.filter(o => o.status === 'ON_TRACK').length
  const delayed    = ONBOARDINGS.filter(o => o.status === 'DELAYED').length

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <GraduationCap size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Client Onboarding</h1>
          <p className="text-sm text-[var(--os-text-2)]">New client onboarding tracker — stages, time-to-value and blockers</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Onboardings', value: String(active),   color: ACCENT    },
          { label: 'Avg Time to Value',  value: `${avgTtv}d`,     color: '#A78BFA' },
          { label: 'On Track',           value: String(onTrack),  color: '#10B981' },
          { label: 'Delayed',            value: String(delayed),  color: '#EF4444' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Stage legend */}
      <div className="flex gap-3 flex-wrap">
        {STAGES.map(s => (
          <span key={s} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold border border-white/10" style={{ color: STAGE_COLOR[s], background: `${STAGE_COLOR[s]}15` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: STAGE_COLOR[s] }} />{s}
          </span>
        ))}
      </div>

      {/* KIMMP */}
      <div className="p-4 rounded-2xl border border-teal-500/30 bg-teal-500/10">
        <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">KIMMP Intelligence</p>
        <p className="text-sm text-[var(--os-text-1)]">
          HealthStartup onboarding is 12 days delayed on Training stage. Root cause: IT admin access not
          provisioned. Escalate to IT immediately.
        </p>
      </div>

      {/* Onboarding Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider px-5 py-3 border-b border-white/10">
          <span>Client</span>
          <span>Start Date</span>
          <span>CSM</span>
          <span>Stage</span>
          <span>Days Active</span>
          <span>Status</span>
        </div>
        {ONBOARDINGS.map(o => {
          const ss = STATUS_STYLE[o.status]
          const sc = STAGE_COLOR[o.stage]
          const isDelayed = o.status === 'DELAYED'
          return (
            <div
              key={o.client}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center px-5 py-4 border-b border-white/5 hover:bg-slate-800/40 transition-colors ${isDelayed ? 'bg-red-500/5' : ''}`}
            >
              <span className="text-sm font-semibold text-white">{o.client}</span>
              <span className="text-sm text-[var(--os-text-1)]">{o.startDate}</span>
              <span className="text-sm text-[var(--os-text-1)]">{o.csm}</span>
              <span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}20`, color: sc }}>
                  {o.stage}
                </span>
              </span>
              <span className={`text-sm font-semibold ${isDelayed ? 'text-red-400' : 'text-[var(--os-text-1)]'}`}>{o.daysActive}d</span>
              <span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: ss.bg, color: ss.text }}>
                  {ss.label}
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

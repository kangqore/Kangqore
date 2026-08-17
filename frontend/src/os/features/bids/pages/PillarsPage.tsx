import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

interface BidsStats { total: number; byStatus: Record<string, number> }

function useBidsStats() {
  return useQuery<{ stats: BidsStats }>({
    queryKey: ['bids-engagements'],
    queryFn: () => api.get('/admin/bids/engagements').then(r => r.data),
    staleTime: 60_000,
  })
}

const PILLAR_GROUPS = [
  {
    label: 'Business & Leadership',
    accent: '#579bfc',
    pillars: [
      { n: 1,  name: 'Business Strategy Intelligence™',  score: 'Strategy Maturity Score™',       desc: 'Evaluates strategic clarity, market positioning, competitive differentiation, and alignment between vision and execution.' },
      { n: 2,  name: 'Leadership Intelligence™',          score: 'Leadership Effectiveness Score™', desc: 'Assesses leadership capability, decision-making quality, organisational trust, and executive alignment.' },
      { n: 3,  name: 'Financial Intelligence™',           score: 'Financial Health Score™',         desc: 'Examines financial resilience, capital efficiency, unit economics, cash flow discipline, and forecast accuracy.' },
    ],
  },
  {
    label: 'Operations & People',
    accent: '#7c3aed',
    pillars: [
      { n: 4,  name: 'Operational Intelligence™',  score: 'Operational Efficiency Score™',   desc: 'Measures process maturity, throughput, waste reduction, operational bottlenecks, and execution velocity.' },
      { n: 5,  name: 'Workforce Intelligence™',    score: 'Workforce Readiness Score™',      desc: 'Diagnoses talent density, skills gaps, retention risk, engagement levels, and future-of-work readiness.' },
      { n: 6,  name: 'Customer Intelligence™',     score: 'Customer Experience Score™',      desc: 'Analyses CX consistency, satisfaction drivers, churn risk, NPS baseline, and journey friction points.' },
    ],
  },
  {
    label: 'Revenue & Growth',
    accent: '#00c875',
    pillars: [
      { n: 7,  name: 'Sales Intelligence™',   score: 'Revenue Engine Score™',   desc: 'Evaluates pipeline health, conversion rates, sales process maturity, forecasting accuracy, and revenue predictability.' },
      { n: 8,  name: 'Growth Intelligence™',  score: 'Digital Growth Score™',   desc: 'Assesses digital channel performance, marketing attribution, acquisition efficiency, and growth lever identification.' },
    ],
  },
  {
    label: 'Technology & Digital',
    accent: '#7c3aed',
    pillars: [
      { n: 9,  name: 'Technology Intelligence™',             score: 'Technology Maturity Score™',      desc: 'Reviews engineering practices, architecture soundness, technical debt exposure, and platform scalability.' },
      { n: 10, name: 'Cloud & Infrastructure Intelligence™', score: 'Infrastructure Readiness Score™',  desc: 'Diagnoses cloud adoption maturity, infrastructure reliability, DR posture, and cost optimisation.' },
      { n: 11, name: 'Data Intelligence™',                   score: 'Data Maturity Score™',            desc: 'Evaluates data governance, data quality, analytics capability, and the organisation\'s data-as-an-asset posture.' },
      { n: 12, name: 'AI Intelligence™',                     score: 'AI Readiness Score™',             desc: 'Assesses AI strategy clarity, model maturity, responsible AI governance, and the breadth of AI deployment.' },
      { n: 13, name: 'Automation Intelligence™',             score: 'Automation Maturity Score™',      desc: 'Measures automation coverage across processes, RPA/AI orchestration, and the potential for intelligent automation.' },
    ],
  },
  {
    label: 'Security & Resilience',
    accent: '#e2445c',
    pillars: [
      { n: 14, name: 'Cybersecurity Intelligence™',     score: 'Cyber Resilience Score™',       desc: 'Analyses threat landscape exposure, security posture maturity, incident response capability, and zero-trust adoption.' },
      { n: 15, name: 'Governance & Risk Intelligence™', score: 'Governance Maturity Score™',    desc: 'Reviews board-level governance structures, risk management frameworks, compliance posture, and audit readiness.' },
    ],
  },
  {
    label: 'Transformation',
    accent: '#fdab3d',
    pillars: [
      { n: 16, name: 'Transformation Intelligence™', score: 'Transformation Readiness Score™', desc: 'Synthesises findings across all 15 pillars to produce a composite Transformation Readiness Score™ and a prioritised change agenda.' },
    ],
  },
]

export function PillarsPage() {
  const { data, isLoading } = useBidsStats()
  const stats: BidsStats = data?.stats ?? { total: 0, byStatus: {} }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>The 16 Diagnostic Intelligence Pillars™</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--os-text-2)' }}>
            Each pillar produces a proprietary scored metric — together they form the complete enterprise diagnostic picture.
          </p>
        </div>
        {!isLoading && stats.total > 0 && (
          <div className="px-3 py-1.5 rounded-2xl" style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}>
            <span className="text-xs" style={{ color: 'var(--os-text-2)' }}>
              All 16 pillars applied across{' '}
              <span className="font-bold" style={{ color: 'var(--os-text-1)' }}>{stats.total}</span> engagement{stats.total !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        {isLoading && <div className="h-7 w-44 rounded-2xl animate-pulse" style={{ background: 'var(--os-surface-0)' }} />}
      </div>

      {PILLAR_GROUPS.map(group => (
        <div key={group.label}>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: group.accent }} />
            <h3 className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>{group.label}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.pillars.map(p => (
              <div key={p.n} className="os-card p-5" style={{ borderLeft: `3px solid ${group.accent}` }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-text-3)' }}>Pillar {p.n}</span>
                <p className="text-sm font-semibold mt-1" style={{ color: group.accent }}>{p.name}</p>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--os-text-3)' }}>{p.score}</p>
                <p className="text-[12px] mt-3 leading-relaxed" style={{ color: 'var(--os-text-2)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

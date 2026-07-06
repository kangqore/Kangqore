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

const ENGINES = [
  {
    name: 'Cognition Intelligence Engine™',
    department: 'AI & GenAI',
    accent: '#7c3aed',
    desc: 'Drives the AI, data, and automation diagnostic cluster. Evaluates the organisation\'s readiness to harness GenAI, deploy autonomous systems, and govern AI responsibly.',
    pillars: ['AI Intelligence™', 'Data Intelligence™', 'Automation Intelligence™'],
    outputs: ['AI Readiness Score™', 'Data Maturity Score™', 'Automation Maturity Score™'],
  },
  {
    name: 'Foundry Intelligence Engine™',
    department: 'Engineering & Infrastructure',
    accent: '#579bfc',
    desc: 'Stress-tests the technology foundation — infrastructure reliability, cloud maturity, engineering discipline, and platform health — to surface systemic risk before transformation.',
    pillars: ['Technology Intelligence™', 'Cloud & Infrastructure Intelligence™'],
    outputs: ['Technology Maturity Score™', 'Infrastructure Readiness Score™'],
  },
  {
    name: 'Reimagine Intelligence Engine™',
    department: 'Transformation & Change',
    accent: '#fdab3d',
    desc: 'Maps the organisation\'s transformation trajectory — identifying modernisation priorities, quantifying legacy debt exposure, and assessing change capacity.',
    pillars: ['Transformation Intelligence™', 'Operational Intelligence™'],
    outputs: ['Transformation Readiness Score™', 'Operational Efficiency Score™'],
  },
  {
    name: 'Shield Intelligence Engine™',
    department: 'Security & Governance',
    accent: '#e2445c',
    desc: 'Delivers the enterprise security and governance diagnostic — from cyber resilience and risk posture to regulatory compliance gaps and audit readiness.',
    pillars: ['Cybersecurity Intelligence™', 'Governance & Risk Intelligence™'],
    outputs: ['Cyber Resilience Score™', 'Governance Maturity Score™'],
  },
  {
    name: 'Platforms Intelligence Engine™',
    department: 'Platform Engineering',
    accent: '#00c875',
    desc: 'Analyses enterprise platform utilisation, integration complexity, process maturity, and consolidation opportunity — identifying where tooling sprawl creates drag.',
    pillars: ['Technology Intelligence™', 'Operational Intelligence™', 'Data Intelligence™'],
    outputs: ['Technology Maturity Score™', 'Operational Efficiency Score™'],
  },
  {
    name: 'Growth Intelligence Engine™',
    department: 'Revenue & Marketing',
    accent: '#fdab3d',
    desc: 'Diagnoses the full revenue engine — from pipeline health and conversion bottlenecks to marketing attribution gaps and digital channel performance.',
    pillars: ['Sales Intelligence™', 'Growth Intelligence™', 'Customer Intelligence™'],
    outputs: ['Revenue Engine Score™', 'Digital Growth Score™', 'Customer Experience Score™'],
  },
]

export function EnginesPage() {
  const { data, isLoading } = useBidsStats()
  const stats: BidsStats = data?.stats ?? { total: 0, byStatus: {} }
  const activeCount = stats.byStatus['ACTIVE'] ?? 0

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>The 6 Intelligence Engines™</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--os-text-2)' }}>
            Each engine aggregates multiple pillars into a domain-specific diagnostic cluster, aligned to Kangqore's 6 service departments.
          </p>
        </div>
        {!isLoading && stats.total > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}>
            <span className="text-xs" style={{ color: 'var(--os-text-2)' }}>
              <span className="font-bold" style={{ color: 'var(--os-text-1)' }}>{stats.total}</span> engagement{stats.total !== 1 ? 's' : ''} running
              {activeCount > 0 && <> · <span className="font-semibold" style={{ color: '#00c875' }}>{activeCount} active</span></>}
            </span>
          </div>
        )}
        {isLoading && <div className="h-7 w-32 rounded-lg animate-pulse" style={{ background: 'var(--os-surface-0)' }} />}
      </div>

      {/* Engine cards */}
      <div className="space-y-4">
        {ENGINES.map(e => (
          <div key={e.name} className="os-card p-6" style={{ borderLeft: `4px solid ${e.accent}` }}>
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.accent }} />
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-3)' }}>{e.department}</span>
                </div>
                <h3 className="text-base font-bold" style={{ color: e.accent }}>{e.name}</h3>
                <p className="text-sm mt-2 leading-relaxed max-w-xl" style={{ color: 'var(--os-text-2)' }}>{e.desc}</p>
              </div>
              <div className="space-y-4 flex-shrink-0 min-w-[200px]">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--os-text-3)' }}>Pillars covered</p>
                  <div className="flex flex-col gap-1">
                    {e.pillars.map(p => (
                      <span key={p} className="text-[11px] font-medium" style={{ color: e.accent }}>{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--os-text-3)' }}>Score outputs</p>
                  <div className="flex flex-col gap-1">
                    {e.outputs.map(o => (
                      <span key={o} className="text-[11px]" style={{ color: 'var(--os-text-2)' }}>{o}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

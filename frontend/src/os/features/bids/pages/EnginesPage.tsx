const ENGINES = [
  {
    name: 'Cognition Intelligence Engine™',
    department: 'AI & GenAI',
    color: 'bg-violet-500/10 border-violet-500/20',
    badge: 'text-violet-300',
    dot: 'bg-violet-400',
    desc: 'Drives the AI, data, and automation diagnostic cluster. Evaluates the organisation\'s readiness to harness GenAI, deploy autonomous systems, and govern AI responsibly.',
    pillars: ['AI Intelligence™', 'Data Intelligence™', 'Automation Intelligence™'],
    outputs: ['AI Readiness Score™', 'Data Maturity Score™', 'Automation Maturity Score™'],
  },
  {
    name: 'Foundry Intelligence Engine™',
    department: 'Engineering & Infrastructure',
    color: 'bg-blue-500/10 border-blue-500/20',
    badge: 'text-blue-300',
    dot: 'bg-blue-400',
    desc: 'Stress-tests the technology foundation — infrastructure reliability, cloud maturity, engineering discipline, and platform health — to surface systemic risk before transformation.',
    pillars: ['Technology Intelligence™', 'Cloud & Infrastructure Intelligence™'],
    outputs: ['Technology Maturity Score™', 'Infrastructure Readiness Score™'],
  },
  {
    name: 'Reimagine Intelligence Engine™',
    department: 'Transformation & Change',
    color: 'bg-amber-500/10 border-amber-500/20',
    badge: 'text-amber-300',
    dot: 'bg-amber-400',
    desc: 'Maps the organisation\'s transformation trajectory — identifying modernisation priorities, quantifying legacy debt exposure, and assessing change capacity.',
    pillars: ['Transformation Intelligence™', 'Operational Intelligence™'],
    outputs: ['Transformation Readiness Score™', 'Operational Efficiency Score™'],
  },
  {
    name: 'Shield Intelligence Engine™',
    department: 'Security & Governance',
    color: 'bg-rose-500/10 border-rose-500/20',
    badge: 'text-rose-300',
    dot: 'bg-rose-400',
    desc: 'Delivers the enterprise security and governance diagnostic — from cyber resilience and risk posture to regulatory compliance gaps and audit readiness.',
    pillars: ['Cybersecurity Intelligence™', 'Governance & Risk Intelligence™'],
    outputs: ['Cyber Resilience Score™', 'Governance Maturity Score™'],
  },
  {
    name: 'Platforms Intelligence Engine™',
    department: 'Platform Engineering',
    color: 'bg-cyan-500/10 border-cyan-500/20',
    badge: 'text-cyan-300',
    dot: 'bg-cyan-400',
    desc: 'Analyses enterprise platform utilisation, integration complexity, process maturity, and consolidation opportunity — identifying where tooling sprawl creates drag.',
    pillars: ['Technology Intelligence™', 'Operational Intelligence™', 'Data Intelligence™'],
    outputs: ['Technology Maturity Score™', 'Operational Efficiency Score™'],
  },
  {
    name: 'Growth Intelligence Engine™',
    department: 'Revenue & Marketing',
    color: 'bg-emerald-500/10 border-emerald-500/20',
    badge: 'text-emerald-300',
    dot: 'bg-emerald-400',
    desc: 'Diagnoses the full revenue engine — from pipeline health and conversion bottlenecks to marketing attribution gaps and digital channel performance.',
    pillars: ['Sales Intelligence™', 'Growth Intelligence™', 'Customer Intelligence™'],
    outputs: ['Revenue Engine Score™', 'Digital Growth Score™', 'Customer Experience Score™'],
  },
]

export function EnginesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-100">The 6 Intelligence Engines™</h2>
        <p className="text-sm text-slate-400 mt-1">
          Each engine aggregates multiple pillars into a domain-specific diagnostic cluster, aligned to Kangqore's 6 service departments.
        </p>
      </div>

      <div className="space-y-4">
        {ENGINES.map(e => (
          <div key={e.name} className={`rounded-2xl border p-6 ${e.color} bg-white/[0.02]`}>
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${e.dot}`} />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{e.department}</span>
                </div>
                <h3 className={`text-base font-semibold ${e.badge}`}>{e.name}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-xl">{e.desc}</p>
              </div>
              <div className="space-y-4 flex-shrink-0">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Pillars covered</p>
                  <div className="flex flex-col gap-1">
                    {e.pillars.map(p => (
                      <span key={p} className={`text-[11px] font-medium ${e.badge}`}>{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Score outputs</p>
                  <div className="flex flex-col gap-1">
                    {e.outputs.map(o => (
                      <span key={o} className="text-[11px] text-slate-400">{o}</span>
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

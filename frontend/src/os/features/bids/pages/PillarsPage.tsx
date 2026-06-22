const PILLAR_GROUPS = [
  {
    label: 'Business & Leadership',
    color: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
    dot: 'bg-blue-400',
    pillars: [
      { n: 1,  name: 'Business Strategy Intelligence™',  score: 'Strategy Maturity Score™',       desc: 'Evaluates strategic clarity, market positioning, competitive differentiation, and alignment between vision and execution.' },
      { n: 2,  name: 'Leadership Intelligence™',          score: 'Leadership Effectiveness Score™', desc: 'Assesses leadership capability, decision-making quality, organisational trust, and executive alignment.' },
      { n: 3,  name: 'Financial Intelligence™',           score: 'Financial Health Score™',         desc: 'Examines financial resilience, capital efficiency, unit economics, cash flow discipline, and forecast accuracy.' },
    ],
  },
  {
    label: 'Operations & People',
    color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
    dot: 'bg-indigo-400',
    pillars: [
      { n: 4,  name: 'Operational Intelligence™',  score: 'Operational Efficiency Score™',   desc: 'Measures process maturity, throughput, waste reduction, operational bottlenecks, and execution velocity.' },
      { n: 5,  name: 'Workforce Intelligence™',    score: 'Workforce Readiness Score™',      desc: 'Diagnoses talent density, skills gaps, retention risk, engagement levels, and future-of-work readiness.' },
      { n: 6,  name: 'Customer Intelligence™',     score: 'Customer Experience Score™',      desc: 'Analyses CX consistency, satisfaction drivers, churn risk, NPS baseline, and journey friction points.' },
    ],
  },
  {
    label: 'Revenue & Growth',
    color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
    dot: 'bg-cyan-400',
    pillars: [
      { n: 7,  name: 'Sales Intelligence™',   score: 'Revenue Engine Score™',   desc: 'Evaluates pipeline health, conversion rates, sales process maturity, forecasting accuracy, and revenue predictability.' },
      { n: 8,  name: 'Growth Intelligence™',  score: 'Digital Growth Score™',   desc: 'Assesses digital channel performance, marketing attribution, acquisition efficiency, and growth lever identification.' },
    ],
  },
  {
    label: 'Technology & Digital',
    color: 'bg-violet-500/10 border-violet-500/20 text-violet-300',
    dot: 'bg-violet-400',
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
    color: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
    dot: 'bg-rose-400',
    pillars: [
      { n: 14, name: 'Cybersecurity Intelligence™',     score: 'Cyber Resilience Score™',       desc: 'Analyses threat landscape exposure, security posture maturity, incident response capability, and zero-trust adoption.' },
      { n: 15, name: 'Governance & Risk Intelligence™', score: 'Governance Maturity Score™',    desc: 'Reviews board-level governance structures, risk management frameworks, compliance posture, and audit readiness.' },
    ],
  },
  {
    label: 'Transformation',
    color: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
    dot: 'bg-amber-400',
    pillars: [
      { n: 16, name: 'Transformation Intelligence™', score: 'Transformation Readiness Score™', desc: 'Synthesises findings across all 15 pillars to produce a composite Transformation Readiness Score™ and a prioritised change agenda.' },
    ],
  },
]

export function PillarsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-base font-semibold text-slate-100">The 16 Diagnostic Intelligence Pillars™</h2>
        <p className="text-sm text-slate-400 mt-1">
          Each pillar produces a proprietary scored metric — together they form the complete enterprise diagnostic picture.
        </p>
      </div>

      {PILLAR_GROUPS.map(group => (
        <div key={group.label}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2 h-2 rounded-full ${group.dot}`} />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">{group.label}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.pillars.map(p => (
              <div key={p.n} className={`rounded-xl border p-5 bg-white/[0.02] ${group.color.replace(/text-\S+/, '')}`}>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pillar {p.n}</span>
                <p className={`text-sm font-semibold mt-1 ${group.color.split(' ').find(c => c.startsWith('text-'))}`}>{p.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{p.score}</p>
                <p className="text-[12px] text-slate-400 mt-3 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

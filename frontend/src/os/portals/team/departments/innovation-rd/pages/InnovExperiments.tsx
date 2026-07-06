import { Sparkles } from 'lucide-react'
import { Flask } from '@phosphor-icons/react'

const ACCENT = '#CA8A04'

type ExperimentOutcome = 'Running' | 'Success' | 'Failed' | 'Inconclusive'

interface Experiment {
  name:       string
  hypothesis: string
  team:       string
  start:      string
  end:        string
  outcome:    ExperimentOutcome
  learnings:  string
}

const EXPERIMENTS: Experiment[] = [
  { name: 'Outcome Pricing Pilot',           hypothesis: 'Outcome-based pricing increases deal size by 20%',            team: 'Kiran Mehta + Sales',  start: '2026-04-01', end: '2026-06-30', outcome: 'Running',      learnings: 'Early signals positive — 2 clients converted to outcome model' },
  { name: 'Compliance Auto PoC',             hypothesis: 'KIMMP can auto-generate 80% of audit evidence',               team: 'Ananya Das + RC',     start: '2026-05-15', end: '2026-06-30', outcome: 'Running',      learnings: 'Prototype generating evidence for 12 ISO controls — accuracy at 84%' },
  { name: 'Voice Interface Alpha',           hypothesis: 'Voice UX reduces mobile OS interaction time by 30%',          team: 'Kiran Mehta',         start: '2026-03-01', end: '2026-05-31', outcome: 'Inconclusive', learnings: 'UX testing showed mixed results — dependent on ambient noise conditions' },
  { name: 'LLM Pipeline Builder Test',       hypothesis: 'Engineers can build data pipelines 3× faster with LLM assist',team: 'Ananya Das + Data',   start: '2026-05-01', end: '2026-05-31', outcome: 'Success',      learnings: 'Build time reduced from avg 4h to 1.2h — statistically significant (p=0.01)' },
  { name: 'Peer Learning Platform Pilot',    hypothesis: 'Internal skill-sharing reduces external training spend by 15%',team: 'Kiran Mehta + HR',   start: '2026-02-01', end: '2026-04-30', outcome: 'Failed',       learnings: 'Participation rate only 22% — engagement too low without manager incentives' },
  { name: 'Async Video Status Pilot',        hypothesis: 'Replacing 3 status meetings/week with async video saves 2h/person',team: 'Ananya Das',   start: '2026-04-15', end: '2026-05-30', outcome: 'Success',      learnings: 'Meeting time reduced by 1.8h/person/week — rolling out to 3 more teams' },
]

const OUTCOME_COLOR: Record<ExperimentOutcome, string> = {
  Running:      '#6366F1',
  Success:      '#10B981',
  Failed:       '#EF4444',
  Inconclusive: '#F59E0B',
}

export function InnovExperiments() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Flask size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Experiments</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Innovation experiments tracker — hypotheses, outcomes and learnings.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Running',      value: String(EXPERIMENTS.filter(e => e.outcome === 'Running').length),      color: '#6366F1' },
          { label: 'Success',      value: String(EXPERIMENTS.filter(e => e.outcome === 'Success').length),      color: '#10B981' },
          { label: 'Failed',       value: String(EXPERIMENTS.filter(e => e.outcome === 'Failed').length),       color: '#EF4444' },
          { label: 'Inconclusive', value: String(EXPERIMENTS.filter(e => e.outcome === 'Inconclusive').length), color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          LLM Pipeline Builder and Async Video pilots both succeeded — prioritise rollout plans for both.
          The Peer Learning failure teaches an important lesson: engagement requires structural incentives, not just
          platform availability. The failed Voice Interface experiment (Inconclusive) should be revisited with noise-cancelling
          hardware tests before fully abandoning the hypothesis — the market opportunity is significant.
        </p>
      </div>

      <div className="space-y-4">
        {EXPERIMENTS.map(e => {
          const oc = OUTCOME_COLOR[e.outcome]
          return (
            <div key={e.name} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{e.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${oc}22`, color: oc }}>{e.outcome}</span>
                  </div>
                  <p className="text-[var(--os-text-2)] text-xs">Team: {e.team} · {e.start} → {e.end}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--os-text-2)] italic">"{e.hypothesis}"</p>
              <p className="text-sm text-[var(--os-text-1)]">{e.learnings}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { Sparkles } from 'lucide-react'
import { PuzzlePiece } from '@phosphor-icons/react'

const ACCENT = '#CA8A04'

type PrototypeStage = 'Concept' | 'PoC' | 'MVP' | 'Pilot'

interface Prototype {
  name:         string
  basedOnIdea:  string
  techStack:    string
  stage:        PrototypeStage
  owner:        string
  targetLaunch: string
}

const PROTOTYPES: Prototype[] = [
  { name: 'Compliance Evidence Generator',   basedOnIdea: 'ID-004', techStack: 'Claude SDK + PostgreSQL + React',     stage: 'PoC',     owner: 'Ananya Das',  targetLaunch: '2026-08-01' },
  { name: 'Outcome Pricing Calculator',      basedOnIdea: 'ID-003', techStack: 'React + Xero API',                    stage: 'Pilot',   owner: 'Kiran Mehta', targetLaunch: '2026-07-01' },
  { name: 'LLM Pipeline Builder',           basedOnIdea: 'ID-007', techStack: 'Claude SDK + dbt + n8n',              stage: 'MVP',     owner: 'Ananya Das',  targetLaunch: '2026-09-01' },
  { name: 'KIMMP Voice Interface',          basedOnIdea: 'ID-002', techStack: 'Whisper + Claude SDK + React Native', stage: 'Concept', owner: 'Kiran Mehta', targetLaunch: '2026-12-01' },
  { name: 'BIDS™ Healthcare Edition',       basedOnIdea: 'ID-005', techStack: 'BIDS™ Core + HIPAA config layer',     stage: 'Concept', owner: 'Ananya Das',  targetLaunch: '2027-Q1' },
  { name: 'Carbon Footprint Tracker',       basedOnIdea: 'ID-006', techStack: 'React + Scope 3 API',                stage: 'Concept', owner: 'Kiran Mehta', targetLaunch: '2027-Q2' },
  { name: 'Contract Auto-Negotiation Agent',basedOnIdea: 'ID-001', techStack: 'Claude SDK + LegalTech APIs',         stage: 'PoC',     owner: 'Ananya Das',  targetLaunch: '2026-10-01' },
]

const STAGE_COLOR: Record<PrototypeStage, string> = {
  Concept: '#6B7280',
  PoC:     '#6366F1',
  MVP:     '#F59E0B',
  Pilot:   '#10B981',
}

export function InnovPrototypes() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <PuzzlePiece size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Prototypes</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Active prototype registry — from Concept to Pilot, linked to the ideas pipeline.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(['Concept', 'PoC', 'MVP', 'Pilot'] as const).map(stage => (
          <div key={stage} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{stage}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: STAGE_COLOR[stage] }}>
              {PROTOTYPES.filter(p => p.stage === stage).length}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          Outcome Pricing Calculator is in Pilot — fastest path to revenue impact. LLM Pipeline Builder is at MVP;
          schedule an internal launch for the Data team this month. Contract Auto-Negotiation PoC needs a legal review
          checkpoint before moving to MVP — ensure the AI governance register is updated before the legal team
          is involved. 3 Concepts are healthy pipeline; prioritise Carbon Tracker last as it is lowest commercial urgency.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Prototype', 'Idea Ref', 'Tech Stack', 'Stage', 'Owner', 'Target Launch'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {PROTOTYPES.map(p => {
                const sc = STAGE_COLOR[p.stage]
                return (
                  <tr key={p.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                    <td className="px-4 py-3"><span className="text-xs font-mono text-amber-400">{p.basedOnIdea}</span></td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] text-xs">{p.techStack}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{p.stage}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.owner}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.targetLaunch}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

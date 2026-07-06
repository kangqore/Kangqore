import { Sparkles } from 'lucide-react'
import { LightbulbFilament } from '@phosphor-icons/react'

const ACCENT = '#CA8A04'

type IdeaStage = 'Raw' | 'Evaluated' | 'Prototyping' | 'Scaling' | 'Dropped'
type IdeaCategory = 'Product' | 'Process' | 'Tech' | 'Business Model'

interface Idea {
  id:        string
  title:     string
  category:  IdeaCategory
  submitter: string
  votes:     number
  stage:     IdeaStage
  score:     number
}

const IDEAS: Idea[] = [
  { id: 'ID-001', title: 'AI-powered contract auto-renewal negotiation',  category: 'Product',        submitter: 'Kiran Mehta',  votes: 24, stage: 'Prototyping',  score: 87 },
  { id: 'ID-002', title: 'KIMMP voice interface for mobile executives',   category: 'Product',        submitter: 'Ananya Das',   votes: 31, stage: 'Evaluated',    score: 82 },
  { id: 'ID-003', title: 'Outcome-based pricing model for BIDS™',        category: 'Business Model', submitter: 'Kiran Mehta',  votes: 18, stage: 'Scaling',      score: 91 },
  { id: 'ID-004', title: 'Automated compliance evidence generation',      category: 'Tech',           submitter: 'Ananya Das',   votes: 42, stage: 'Prototyping',  score: 94 },
  { id: 'ID-005', title: 'BIDS™ industry edition for healthcare',         category: 'Business Model', submitter: 'Kiran Mehta',  votes: 22, stage: 'Evaluated',    score: 78 },
  { id: 'ID-006', title: 'Carbon footprint tracker for Operations',       category: 'Process',        submitter: 'Ananya Das',   votes: 14, stage: 'Raw',          score: 62 },
  { id: 'ID-007', title: 'LLM-native data pipeline builder',             category: 'Tech',           submitter: 'Kiran Mehta',  votes: 36, stage: 'Evaluated',    score: 89 },
  { id: 'ID-008', title: 'Peer learning marketplace for skill gaps',     category: 'Product',        submitter: 'Ananya Das',   votes: 19, stage: 'Raw',          score: 71 },
  { id: 'ID-009', title: 'Async video updates replacing status meetings', category: 'Process',        submitter: 'Kiran Mehta',  votes: 28, stage: 'Evaluated',    score: 75 },
  { id: 'ID-010', title: 'Blockchain-based client delivery proof',       category: 'Tech',           submitter: 'Ananya Das',   votes: 8,  stage: 'Dropped',      score: 34 },
]

const STAGE_COLOR: Record<IdeaStage, string> = {
  Raw:          '#6B7280',
  Evaluated:    '#6366F1',
  Prototyping:  '#F59E0B',
  Scaling:      '#10B981',
  Dropped:      '#EF4444',
}

const CAT_COLOR: Record<IdeaCategory, string> = {
  Product:        '#D946EF',
  Process:        '#6366F1',
  Tech:           '#0284C7',
  'Business Model': '#10B981',
}

export function InnovIdeas() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <LightbulbFilament size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Ideas Pipeline</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Innovation ideas from across the business — voted, staged, and KIMMP-scored.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Ideas',    value: String(IDEAS.length),                                              color: ACCENT },
          { label: 'Prototyping',    value: String(IDEAS.filter(i => i.stage === 'Prototyping').length),    color: '#F59E0B' },
          { label: 'Scaling',        value: String(IDEAS.filter(i => i.stage === 'Scaling').length),        color: '#10B981' },
          { label: 'Avg KIMMP Score',value: String(Math.round(IDEAS.filter(i => i.stage !== 'Dropped').reduce((acc, i) => acc + i.score, 0) / IDEAS.filter(i => i.stage !== 'Dropped').length)), color: '#D946EF' },
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
          ID-004 (automated compliance evidence) is the highest-scoring idea at 94 — it directly solves the RC team's
          audit preparation bottleneck. Fast-track to PoC. ID-003 (outcome-based pricing) is already Scaling — the
          highest commercial-impact idea in the pipeline; ensure it has a dedicated sponsor at Director level.
          ID-010 (blockchain delivery proof) was correctly dropped at score 34; the use case is solved more simply
          with cryptographic timestamping without blockchain overhead.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Title', 'Category', 'Submitter', 'Votes', 'Stage', 'KIMMP Score'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {IDEAS.map(idea => {
                const sc = STAGE_COLOR[idea.stage]
                const cc = CAT_COLOR[idea.category]
                return (
                  <tr key={idea.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-xs font-mono text-[var(--os-text-2)]">{idea.id}</span></td>
                    <td className="px-4 py-3 text-white font-medium">{idea.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${cc}22`, color: cc }}>{idea.category}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{idea.submitter}</td>
                    <td className="px-4 py-3 text-white font-bold">{idea.votes}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{idea.stage}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold" style={{ color: idea.score >= 80 ? '#10B981' : idea.score >= 60 ? '#F59E0B' : '#EF4444' }}>{idea.score}</span>
                    </td>
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

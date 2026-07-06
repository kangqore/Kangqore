import { Sparkles } from 'lucide-react'
import { Article } from '@phosphor-icons/react'

const ACCENT = '#CA8A04'

interface ResearchItem {
  title:     string
  domain:    string
  author:    string
  published: string
  addedBy:   string
  tags:      string[]
  rating:    number
}

const RESEARCH: ResearchItem[] = [
  { title: 'Anthropic Constitutional AI: Harmlessness from AI Feedback', domain: 'AI Safety',       author: 'Anthropic',         published: '2022', addedBy: 'Ananya Das',  tags: ['LLM', 'Safety', 'RLHF'],         rating: 5 },
  { title: 'Outcome-Based Contracting in B2B SaaS',                      domain: 'Business Model', author: 'Harvard Business Review', published: '2024', addedBy: 'Kiran Mehta', tags: ['Pricing', 'SaaS', 'B2B'],  rating: 5 },
  { title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP',  domain: 'ML',             author: 'Meta AI Research',  published: '2020', addedBy: 'Ananya Das',  tags: ['RAG', 'LLM', 'NLP'],             rating: 5 },
  { title: 'The Jobs to Be Done Theory of Innovation',                    domain: 'Innovation',     author: 'Clayton Christensen',published: '2016',addedBy: 'Kiran Mehta', tags: ['JTBD', 'Product', 'Strategy'],  rating: 4 },
  { title: 'AI Governance Frameworks: A Comparative Analysis',            domain: 'Governance',     author: 'Alan Turing Institute', published: '2023', addedBy: 'Ananya Das', tags: ['AI', 'Governance', 'Policy'],  rating: 4 },
  { title: 'Design Thinking: A Method for Creative Problem Solving',      domain: 'Innovation',     author: 'IDEO',              published: '2015', addedBy: 'Kiran Mehta', tags: ['Design', 'Creativity'],          rating: 4 },
  { title: 'The Lean Startup: Build-Measure-Learn Loop',                  domain: 'Product',        author: 'Eric Ries',         published: '2011', addedBy: 'Kiran Mehta', tags: ['Startup', 'MVP', 'Agile'],       rating: 5 },
  { title: 'Attention Is All You Need (Transformer Architecture)',        domain: 'ML',             author: 'Google Brain',      published: '2017', addedBy: 'Ananya Das',  tags: ['Transformer', 'NLP', 'ML'],      rating: 5 },
]

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
  )
}

export function InnovResearch() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Article size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Research Library</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Curated research papers, books and articles informing the R&amp;D programme.</p>
        </div>
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          The RAG paper and Transformer architecture paper are foundational to the KIMMP/WAANDA stack — ensure all
          engineers have read them. The Outcome-Based Contracting research directly supports ID-003 and should be
          shared with the Sales Director. AI Governance Frameworks should be circulated to Risk &amp; Compliance to
          inform the pending AI Governance Policy draft.
        </p>
      </div>

      <div className="space-y-4">
        {RESEARCH.map(r => (
          <div key={r.title} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <p className="text-white font-semibold">{r.title}</p>
                <p className="text-[var(--os-text-2)] text-xs">{r.author} · {r.published} · Added by {r.addedBy}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">{r.domain}</span>
                <Stars rating={r.rating} />
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {r.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-700/60 text-[var(--os-text-2)]">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

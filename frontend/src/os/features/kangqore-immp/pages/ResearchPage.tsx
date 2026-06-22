import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search, Send, ChevronDown, ChevronUp,
  Globe, Clock, RefreshCw, Sparkles,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResearchResult {
  id: string
  question: string
  domain?: string
  summary: string
  insights: string[]
  sources: { title: string; url: string; snippet: string }[]
  confidence: number
  createdAt: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const SUGGESTED_QUERIES = [
  { label: 'Competitor analysis India B2B SaaS',  domain: 'competitor analysis' },
  { label: 'Government education tech tenders 2026', domain: 'government tenders' },
  { label: 'AI regulation India enterprise impact', domain: 'regulatory' },
  { label: 'MSME digital transformation market size', domain: 'market research' },
]

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ result }: { result: ResearchResult }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10 border-t-white/20 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
            <Search className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">{result.question}</p>
            <div className="flex items-center gap-2 mt-1">
              {result.domain && <Badge variant="neutral" size="sm">{result.domain}</Badge>}
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {formatRelative(result.createdAt)}
              </span>
              <span className="ml-auto text-[10px] font-semibold text-teal-600">{result.confidence}% confidence</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed ml-10">{result.summary}</p>

        {result.insights?.length > 0 && (
          <ul className="ml-10 space-y-1.5">
            {result.insights.slice(0, expanded ? undefined : 3).map((insight, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0 mt-1.5" />
                <p className="text-xs text-slate-500 leading-relaxed">{insight}</p>
              </li>
            ))}
          </ul>
        )}

        {expanded && result.sources?.length > 0 && (
          <div className="ml-10 space-y-2 pt-2 border-t border-white/10 border-t-white/20">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Sources
            </p>
            {result.sources.map((s, i) => (
              <div key={i} className="flex items-start gap-2 bg-slate-900 rounded-lg p-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-600 hover:underline truncate cursor-pointer">{s.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{s.snippet}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setExpanded(e => !e)}
          className="ml-10 flex items-center gap-1 text-xs text-teal-600 font-medium hover:text-teal-800 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Collapse' : `Show sources & more (${result.insights?.length ?? 0} insights)`}
        </button>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ResearchPage() {
  const [question, setQuestion] = useState('')
  const [domain,   setDomain]   = useState('')
  const [current,  setCurrent]  = useState<ResearchResult | null>(null)
  const [thinking, setThinking] = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['research-results'],
    queryFn: () => api.get('/admin/kangqore-immp/research/results', { params: { limit: 20 } }).then(r => r.data),
    staleTime: 60_000,
  })

  const results: ResearchResult[] = data?.results ?? []

  async function submit(q?: string, d?: string) {
    const q2 = (q ?? question).trim()
    if (!q2 || thinking) return
    setThinking(true)
    setError(null)
    setCurrent(null)
    try {
      const res = await api.post('/admin/kangqore-immp/research/query', {
        question: q2,
        domain: (d ?? domain).trim() || undefined,
      })
      setCurrent(res.data)
      refetch()
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Research failed. Check ANTHROPIC_API_KEY.')
    } finally {
      setThinking(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Search className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Research Engine</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Deep competitive intelligence via Claude + live web search. Ask anything about your market.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Query interface */}
      <div className="bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10 border-t-white/20 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 space-y-3 border-b border-white/10 border-t-white/20">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="Ask a research question — e.g. 'Who are Kangqore's top 5 competitors in India B2B tech?'"
              className="flex-1 text-sm bg-transparent outline-none text-slate-200 placeholder:text-slate-500"
            />
            <button
              onClick={() => submit()}
              disabled={!question.trim() || thinking}
              className="h-8 px-4 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors disabled:opacity-40 flex items-center gap-1.5"
            >
              {thinking ? <Spinner size="sm" /> : <Send className="w-3 h-3" />}
              Research
            </button>
          </div>
          <input
            value={domain}
            onChange={e => setDomain(e.target.value)}
            placeholder="Domain hint (optional) — e.g. 'competitor analysis', 'government tenders'"
            className="w-full text-xs bg-slate-900 border border-white/10 border-t-white/20 rounded-lg px-3 py-2 outline-none text-slate-300 placeholder:text-slate-300"
          />
        </div>

        {thinking && (
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <span className="text-xs text-slate-500">KIMMP is researching across web sources…</span>
          </div>
        )}

        {error && (
          <div className="px-5 py-3 bg-red-50 text-sm text-red-600">{error}</div>
        )}

        {!thinking && !error && (
          <div className="flex items-center gap-2 px-4 py-2.5 flex-wrap">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Quick:</span>
            {SUGGESTED_QUERIES.map(s => (
              <button
                key={s.label}
                onClick={() => submit(s.label, s.domain)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 border-t-white/20 text-slate-300 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-all"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Latest result */}
      {current && (
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-500" />
            Latest Research
          </h3>
          <ResultCard result={current} />
        </div>
      )}

      {/* History */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          Research History ({results.length})
        </h3>
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10 border-t-white/20 rounded-xl text-center">
            <Search className="w-8 h-8 text-slate-200 mb-3" />
            <p className="text-sm text-slate-500">No research queries yet. Ask your first question above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.filter(r => r.id !== current?.id).map(r => (
              <ResultCard key={r.id} result={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

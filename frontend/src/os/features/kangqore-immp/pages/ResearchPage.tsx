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
    <div className="p-6 space-y-4 transition-transform hover:-translate-y-1" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 32px 64px rgba(0,0,0,0.04)' }}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0">
          <Search className="w-5 h-5 text-teal-600" />
        </div>
        <div className="flex-1 min-w-0 mt-0.5">
          <p className="text-base font-bold text-[var(--os-text-1)] leading-tight">{result.question}</p>
          <div className="flex items-center gap-2 mt-2">
            {result.domain && <Badge variant="neutral" size="sm">{result.domain}</Badge>}
            <span className="text-[11px] font-bold text-[var(--os-text-2)] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formatRelative(result.createdAt)}
            </span>
            <span className="ml-auto text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">{result.confidence}% confidence</span>
          </div>
        </div>
      </div>

      <p className="text-sm font-semibold text-[var(--os-text-1)] leading-relaxed ml-14">{result.summary}</p>

      {result.insights?.length > 0 && (
        <ul className="ml-14 space-y-2">
          {result.insights.slice(0, expanded ? undefined : 3).map((insight, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0 mt-1.5 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
              <p className="text-sm font-medium text-[var(--os-text-2)] leading-relaxed">{insight}</p>
            </li>
          ))}
        </ul>
      )}

      {expanded && result.sources?.length > 0 && (
        <div className="ml-14 space-y-3 pt-4 border-t border-[var(--os-border)]">
          <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Sources
          </p>
          {result.sources.map((s, i) => {
            let sourceDomain = ''
            try { sourceDomain = new URL(s.url).hostname } catch { sourceDomain = s.url }
            return (
              <div key={i} className="flex items-start gap-3 bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-blue-600 hover:underline truncate cursor-pointer">{s.title}</p>
                    <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-[var(--os-card)] border border-[var(--os-border)] text-[var(--os-text-2)] flex-shrink-0">{sourceDomain}</span>
                  </div>
                  <p className="text-xs font-medium text-[var(--os-text-2)] mt-1 line-clamp-2 leading-relaxed">{s.snippet}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <button
        onClick={() => setExpanded(e => !e)}
        className="ml-14 flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-800 transition-colors"
      >
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {expanded ? 'Collapse' : `Show sources & more (${result.insights?.length ?? 0} insights)`}
      </button>
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
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3 pb-5 mb-1 border-b border-[var(--os-border)]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Search className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-[var(--os-text-1)]">Research Engine</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">
            Deep competitive intelligence via Claude + live web search. Ask anything about your market.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--os-text-2)] bg-[var(--os-surface-0)] border border-[var(--os-border)] hover:text-[var(--os-text-1)] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Query interface */}
      <div className="p-6 flex flex-col gap-4 shadow-[0_32px_64px_rgba(0,0,0,0.04)] bg-[var(--os-card)]" style={{ borderRadius: 'var(--os-radius-xl)' }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-teal-600" />
          </div>
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Ask a research question — e.g. 'Who are Kangqore's top 5 competitors in India B2B tech?'"
            className="flex-1 bg-transparent text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] font-semibold outline-none text-base"
          />
          <button
            onClick={() => submit()}
            disabled={!question.trim() || thinking}
            className="h-10 px-6 rounded-full text-white text-sm font-bold hover:-translate-y-1 transition-all disabled:opacity-40 flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2564ea 100%)', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}
          >
            {thinking ? <Spinner size="sm" /> : <Send className="w-4 h-4" />}
            Research
          </button>
        </div>
        <div className="border-b border-[var(--os-border)] mx-14" />
        <div className="ml-14 flex flex-col gap-4">
          <input
            value={domain}
            onChange={e => setDomain(e.target.value)}
            placeholder="Domain hint (optional) — e.g. 'competitor analysis', 'government tenders'"
            className="w-full text-sm font-medium bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-2xl px-4 py-3 outline-none text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)]"
          />

          {thinking && (
            <div className="flex items-center gap-3 bg-teal-50 rounded-2xl p-4">
              <div className="flex gap-1.5">
                {[0,1,2].map(i => (
                  <span key={i} className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
              <span className="text-sm font-bold text-teal-700">KIMMP is researching across web sources…</span>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 bg-red-50 text-red-600 text-sm font-bold rounded-2xl">{error}</div>
          )}

          {!thinking && !error && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-[var(--os-text-2)] font-bold uppercase tracking-widest mr-2">Quick:</span>
              {SUGGESTED_QUERIES.map(s => (
                <button
                  key={s.label}
                  onClick={() => submit(s.label, s.domain)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[var(--os-surface-0)] text-[var(--os-text-2)] hover:bg-slate-100 hover:text-[var(--os-text-1)] transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Latest result */}
      {current && (
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            Latest Research
          </h3>
          <ResultCard result={current} />
        </div>
      )}

      {/* History */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          Research History ({results.length})
        </h3>
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[var(--os-card)] shadow-[0_32px_64px_rgba(0,0,0,0.04)] text-center" style={{ borderRadius: 'var(--os-radius-xl)' }}>
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-[var(--os-text-2)]" />
            </div>
            <p className="text-lg font-bold text-[var(--os-text-1)]">No research queries yet</p>
            <p className="text-sm font-semibold text-[var(--os-text-2)] mt-2">Ask your first question above.</p>
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

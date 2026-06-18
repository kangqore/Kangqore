import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Brain, TrendingUp, AlertTriangle, Lightbulb, Zap, Target,
  ArrowRight, ChevronDown, ChevronUp, BarChart3,
  Briefcase, DollarSign, Users, GraduationCap, Building2,
  RefreshCw, Check, RotateCcw, Send, Mic, MicOff, Sparkles,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'
import {
  useKIMMPStore, toInsight,
  type Insight, type InsightCategory,
} from '@store/kimmp'

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<InsightCategory, {
  label: string
  color: string
  dot: string
  dimColor: string
  Icon: React.FC<{ className?: string }>
}> = {
  revenue:     { label: 'Revenue',     color: 'bg-[#00c875] text-white shadow-[0_2px_8px_rgba(0,200,117,0.25)]',  dot: 'bg-[#00c875]', dimColor: '#00c875', Icon: ({ className }) => <TrendingUp    className={className ?? 'w-4 h-4'} /> },
  risk:        { label: 'Risk',        color: 'bg-[#e2445c] text-white shadow-[0_2px_8px_rgba(226,68,92,0.25)]',   dot: 'bg-[#e2445c]', dimColor: '#e2445c', Icon: ({ className }) => <AlertTriangle className={className ?? 'w-4 h-4'} /> },
  opportunity: { label: 'Opportunity', color: 'bg-[#0073ea] text-white shadow-[0_2px_8px_rgba(0,115,234,0.25)]',  dot: 'bg-[#0073ea]', dimColor: '#0073ea', Icon: ({ className }) => <Lightbulb     className={className ?? 'w-4 h-4'} /> },
  ops:         { label: 'Operations',  color: 'bg-[#fdab3d] text-white shadow-[0_2px_8px_rgba(253,171,61,0.25)]',  dot: 'bg-[#fdab3d]', dimColor: '#fdab3d', Icon: ({ className }) => <Zap           className={className ?? 'w-4 h-4'} /> },
  talent:      { label: 'Talent',      color: 'bg-[#7f53f9] text-white shadow-[0_2px_8px_rgba(127,83,249,0.25)]',  dot: 'bg-[#7f53f9]', dimColor: '#7f53f9', Icon: ({ className }) => <Target        className={className ?? 'w-4 h-4'} /> },
}

const PRIORITY_BORDER: Record<string, string> = {
  critical: 'border-l-[#e2445c]',
  high:     'border-l-[#fdab3d]',
  medium:   'border-l-[#0073ea]',
  low:      'border-l-[#c4c4c4]',
}

const PRIORITY_BADGE: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  critical: 'danger', high: 'warning', medium: 'info', low: 'neutral',
}

// ─── Module pulse grid ────────────────────────────────────────────────────────

const MODULE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Leads:     ({ className }) => <Zap           className={className} />,
  Finance:   ({ className }) => <DollarSign    className={className} />,
  Clients:   ({ className }) => <Briefcase     className={className} />,
  Careers:   ({ className }) => <GraduationCap className={className} />,
  Projects:  ({ className }) => <BarChart3     className={className} />,
  Investors: ({ className }) => <TrendingUp    className={className} />,
  Resources: ({ className }) => <Users         className={className} />,
  System:    ({ className }) => <Building2     className={className} />,
}

function ModulePulse({ module, insights }: { module: string; insights: Insight[] }) {
  const navigate = useNavigate()
  const critical = insights.filter(i => i.priority === 'critical').length
  const high     = insights.filter(i => i.priority === 'high').length
  const Icon = MODULE_ICONS[module] ?? (({ className }) => <Brain className={className} />)

  const cardBorder = critical > 0 ? 'border-l-4 border-l-[#e2445c] border-y border-r border-[#2E2854] bg-[#151C2F]' :
                     high > 0     ? 'border-l-4 border-l-[#fdab3d] border-y border-r border-[#2E2854] bg-[#151C2F]' :
                     insights.length > 0 ? 'border-l-4 border-l-[#0073ea] border-y border-r border-[#2E2854] bg-[#151C2F]' :
                     'border-[#2E2854] bg-[#151C2F]'

  const iconBg = critical > 0 ? 'bg-[#e2445c] text-white shadow-[0_2px_6px_rgba(226,68,92,0.2)]' :
                 high > 0     ? 'bg-[#fdab3d] text-white shadow-[0_2px_6px_rgba(253,171,61,0.2)]' :
                 insights.length > 0 ? 'bg-[#0073ea] text-white shadow-[0_2px_6px_rgba(0,115,234,0.2)]' :
                 'bg-[#151C2F] text-slate-300'

  const path = `/kangqore-view/${module.toLowerCase()}`

  return (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-lg hover:shadow-[#4ab6d4]/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer text-left cursor-pointer hover:border-[#2E2854] border ${cardBorder}`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-200 leading-none">{module}</p>
        <p className="text-[10px] text-slate-500 mt-1.5 leading-none">
          {insights.length === 0 ? 'No signals' : `${insights.length} signal${insights.length > 1 ? 's' : ''}`}
        </p>
      </div>
    </button>
  )
}

// ─── Health Score ring ────────────────────────────────────────────────────────

function HealthRing({ score }: { score: number }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const dash = circ * 0.75
  const offset = dash - (score / 100) * dash
  const color = score >= 75 ? '#00c875' : score >= 50 ? '#fdab3d' : '#e2445c'
  const label = score >= 75 ? 'Healthy' : score >= 50 ? 'Moderate' : 'At Risk'

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={120} height={120} viewBox="0 0 120 120">
        <circle cx={60} cy={60} r={r} fill="none" stroke="#f1f5f9" strokeWidth={8}
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeLinecap="round"
          transform="rotate(135 60 60)" />
        <circle cx={60} cy={60} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(135 60 60)"
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease' }}
        />
        <text x={60} y={54} textAnchor="middle" className="fill-slate-900" style={{ fontSize: 22, fontWeight: 800, fontFamily: 'inherit' }}>
          {score}
        </text>
        <text x={60} y={70} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10, fontFamily: 'inherit' }}>
          / 100
        </text>
      </svg>
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
    </div>
  )
}

function DimensionBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500">{label}</span>
        <span className="text-[11px] font-bold" style={{ color }}>{score}</span>
      </div>
      <div className="h-1.5 bg-[#151C2F] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// ─── Command interface ────────────────────────────────────────────────────────

interface BackendCommandResult {
  response: string
  signalIds: string[]
  confidence: number
  suggestedAction: string | null
  model: string
}

// Typewriter hook — animates text character by character
function useTypewriter(text: string, active: boolean) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    if (!active || !text) { setDisplayed(text); return }
    setDisplayed('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 18)
    return () => clearInterval(id)
  }, [text, active])
  return displayed
}

// Voice input hook — Web Speech API
function useVoiceInput(onResult: (transcript: string) => void) {
  const [listening, setListening]   = useState(false)
  const [supported, setSupported]   = useState(false)
  const [interim,   setInterim]     = useState('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setSupported(!!SR)
  }, [])

  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const recognition = new SR()
    recognitionRef.current = recognition
    recognition.continuous    = false
    recognition.interimResults = true
    recognition.lang          = 'en-GB'

    recognition.onstart  = () => { setListening(true); setInterim('') }
    recognition.onend    = () => { setListening(false); setInterim('') }
    recognition.onerror  = () => { setListening(false); setInterim('') }

    recognition.onresult = (e: any) => {
      let interimText = ''
      let finalText   = ''
      for (const result of Array.from(e.results) as any[]) {
        if (result.isFinal) finalText   += result[0].transcript
        else                interimText += result[0].transcript
      }
      setInterim(interimText)
      if (finalText) { onResult(finalText.trim()); setInterim('') }
    }

    recognition.start()
  }, [onResult])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  return { listening, supported, interim, startListening, stopListening }
}

const SUGGESTED_QUERIES = [
  "What should I focus on today?",
  "What's the biggest risk this week?",
  "Show me deals about to go cold",
  "Finance status",
  "Give me a full brief",
]

function CommandBar({ insights }: { insights: Insight[] }) {
  const [query,   setQuery]   = useState('')
  const [result,  setResult]  = useState<BackendCommandResult | null>(null)
  const [thinking, setThinking] = useState(false)
  const [animate,  setAnimate]  = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const storeInsights = useKIMMPStore(s => s.insights)

  const displayed = useTypewriter(result?.response ?? '', animate)

  // Referenced signals — look up by ID in the store
  const referencedSignals = result?.signalIds
    ?.map(id => storeInsights.find(i => i.id === id))
    .filter(Boolean) as Insight[] ?? []

  const submit = useCallback(async (q?: string) => {
    const text = (q ?? query).trim()
    if (!text) return
    setQuery(text)
    setThinking(true)
    setResult(null)
    setAnimate(false)

    try {
      const res = await api.post('/admin/kangqore-immp/command', { query: text })
      setResult(res.data)
      setAnimate(true)
    } catch {
      // Fallback — client-side keyword response so the UI never goes blank
      const reactive = insights.filter(i => i.type !== 'predictive')
      const critical = reactive.filter(i => i.priority === 'critical')
      const high     = reactive.filter(i => i.priority === 'high')
      const top      = [...critical, ...high]
      setResult({
        response: top.length > 0
          ? `${critical.length} critical and ${high.length} high-priority signals active. Review the feed below.`
          : 'No critical signals right now. All modules appear stable.',
        signalIds:       top.slice(0, 3).map(i => i.id),
        confidence:      60,
        suggestedAction: top.length > 0 ? 'Review the Priority Action Queue below.' : null,
        model:           'fallback',
      })
      setAnimate(true)
    } finally {
      setThinking(false)
    }
  }, [query, insights])

  const { listening, supported, interim, startListening, stopListening } = useVoiceInput(
    useCallback((transcript: string) => {
      setQuery(transcript)
      submit(transcript)
    }, [submit])
  )

  const clear = () => {
    setQuery('')
    setResult(null)
    setAnimate(false)
    inputRef.current?.focus()
  }

  const displayedQuery = listening && interim ? interim : query

  return (
    <div className="rounded-2xl border border-[#2E2854] bg-[#151C2F] shadow-sm overflow-hidden">

      {/* Input row */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b border-[#2E2854] transition-colors ${
        listening ? 'bg-red-50/60' : 'bg-gradient-to-r from-purple-950/[0.03] to-blue-950/[0.03]'
      }`}>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
          listening
            ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse'
            : 'bg-gradient-to-br from-purple-600 to-blue-500'
        }`}>
          <Brain className="w-3.5 h-3.5 text-white" />
        </div>

        <input
          ref={inputRef}
          value={displayedQuery}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder={listening ? 'Listening…' : `Ask KIMMP — "What's the biggest risk?", "Show deals going cold", "What should I focus on?"`}
          className={`flex-1 text-sm bg-transparent outline-none placeholder:text-slate-500 transition-colors ${
            listening ? 'text-red-600 placeholder:text-red-300' : 'text-slate-200'
          }`}
        />

        {displayedQuery && !listening && (
          <button onClick={clear} className="text-slate-300 hover:text-slate-500 transition-colors text-xs">✕</button>
        )}

        {/* Voice button */}
        {supported && (
          <button
            onClick={listening ? stopListening : startListening}
            title={listening ? 'Stop listening' : 'Speak your question'}
            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
              listening
                ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                : 'bg-[#151C2F] text-slate-300 hover:bg-purple-100 hover:text-purple-600'
            }`}
          >
            {listening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
          </button>
        )}

        {/* Send button */}
        <button
          onClick={() => submit()}
          disabled={!displayedQuery.trim() || thinking || listening}
          className="h-7 w-7 rounded-lg flex items-center justify-center bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-40 flex-shrink-0"
        >
          {thinking ? <Spinner size="sm" /> : <Send className="w-3 h-3" />}
        </button>
      </div>

      {/* Thinking state */}
      {thinking && (
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">KIMMP is reasoning across signals…</span>
        </div>
      )}

      {/* Response */}
      {result && !thinking && (
        <div className="p-5 space-y-4">

          {/* Main response with typewriter */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm text-white leading-relaxed font-medium">
                {displayed}
                {animate && displayed.length < (result.response?.length ?? 0) && (
                  <span className="inline-block w-0.5 h-4 bg-purple-500 ml-0.5 animate-pulse align-middle" />
                )}
              </p>

              {/* Confidence + model badge */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-1 w-16 bg-[#151C2F] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-500 transition-all duration-700"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">{result.confidence}% confidence</span>
                </div>
                {result.model !== 'fallback' && (
                  <span className="text-[10px] text-slate-300">· {result.model}</span>
                )}
                {result.model === 'fallback' && (
                  <span className="text-[10px] text-amber-500">· client fallback</span>
                )}
              </div>
            </div>
          </div>

          {/* Suggested action */}
          {result.suggestedAction && (
            <div className="flex items-start gap-2 bg-purple-50 border border-purple-100 rounded-xl px-3.5 py-2.5 ml-9">
              <ArrowRight className="w-3.5 h-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-purple-800">{result.suggestedAction}</p>
            </div>
          )}

          {/* Referenced signals */}
          {referencedSignals.length > 0 && (
            <div className="ml-9 space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Referenced signals</p>
              {referencedSignals.map(insight => (
                <CommandSignalRow key={insight.id} insight={insight} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suggested queries — shown when idle */}
      {!result && !thinking && (
        <div className="flex items-center gap-2 px-4 py-2.5 flex-wrap">
          <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Try:</span>
          {SUGGESTED_QUERIES.map(s => (
            <button
              key={s}
              onClick={() => submit(s)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0F172A] border border-[#2E2854] text-slate-300 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CommandSignalRow({ insight }: { insight: Insight }) {
  const config = CATEGORY_CONFIG[insight.category]
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0F172A] border border-[#2E2854]">
      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${config.color}`}>
        <config.Icon className="w-3 h-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-200 leading-tight">{insight.title}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{insight.summary}</p>
      </div>
      <span className="text-[10px] font-bold text-slate-500 flex-shrink-0">{insight.impact}</span>
    </div>
  )
}

// ─── Insight card ─────────────────────────────────────────────────────────────

function InsightCard({ insight }: { insight: Insight }) {
  const [expanded, setExpanded] = useState(false)
  const config = CATEGORY_CONFIG[insight.category]
  const { isAcknowledged, acknowledgeSignal, unacknowledgeSignal } = useKIMMPStore()
  const acked = isAcknowledged(insight.id)

  return (
    <div className={`bg-[#151C2F] rounded-xl border border-[#2E2854] border-l-4 shadow-sm transition-opacity ${PRIORITY_BORDER[insight.priority]} ${acked ? 'opacity-60' : ''}`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
              <config.Icon className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-semibold leading-tight ${acked ? 'line-through text-slate-500' : 'text-white'}`}>{insight.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant={PRIORITY_BADGE[insight.priority]} size="sm" dot>
                  {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)}
                </Badge>
                <Badge variant="neutral" size="sm">{insight.module}</Badge>
                <span className="text-xs text-slate-500">{insight.confidence}% confidence</span>
                {insight.createdAt && (
                  <span className="text-xs text-slate-500">{formatRelative(insight.createdAt)}</span>
                )}
                {acked && <Badge variant="success" size="sm">Acknowledged</Badge>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider ${config.color}`}>
              {insight.impact}
            </span>
            <button
              onClick={() => acked ? unacknowledgeSignal(insight.id) : acknowledgeSignal(insight.id)}
              title={acked ? 'Mark as active' : 'Acknowledge — mark as actioned'}
              className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                acked
                  ? 'border-green-200 bg-green-50 text-green-600 hover:bg-[#0F172A] hover:text-slate-300'
                  : 'border-[#2E2854] bg-[#151C2F] text-slate-300 hover:border-green-300 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              {acked ? <RotateCcw className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed mb-4 ml-11">{insight.summary}</p>

        {expanded && (
          <div className="ml-11 space-y-3 mb-3 pt-3 border-t border-[#2E2854]">
            <p className="text-sm text-slate-300 leading-relaxed">{insight.detail}</p>
            <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
              <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-blue-800">{insight.action}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded(e => !e)}
          className="ml-11 flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Show less' : 'View detail & action'}
        </button>
      </div>
    </div>
  )
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)   return 'just now'
  if (m < 60)  return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

// ─── Relative time hook ───────────────────────────────────────────────────────

function useRelativeTime(ts: number | undefined) {
  const [label, setLabel] = useState('')
  const compute = useCallback(() => {
    if (!ts) return ''
    const diff = Math.floor((Date.now() - ts) / 60000)
    if (diff < 1) return 'just now'
    if (diff === 1) return '1m ago'
    return `${diff}m ago`
  }, [ts])
  useEffect(() => {
    setLabel(compute())
    const id = setInterval(() => setLabel(compute()), 30000)
    return () => clearInterval(id)
  }, [compute])
  return label
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function KIMMMPage() {
  const [filter, setFilter] = useState<InsightCategory | 'all'>('all')
  const { insights, criticalCount, setInsights, healthScore, healthByDimension } = useKIMMPStore()

  const { data: rawInsights, isLoading, isFetching, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['kimmp-insights'],
    queryFn: () => api.get('/dashboard/insights', { params: { limit: 50 } })
      .then(r => (r.data.insights ?? r.data ?? []) as Record<string, unknown>[]),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 3,
    refetchInterval: 1000 * 60 * 3,
  })

  const lastUpdated = useRelativeTime(dataUpdatedAt || undefined)

  useEffect(() => {
    if (rawInsights?.length) setInsights(rawInsights.map((r, i) => toInsight(r, i)))
  }, [rawInsights, setInsights])

  // Only reactive signals for the intelligence feed
  const reactive = insights.filter(i => i.type !== 'predictive')
  const filtered = filter === 'all' ? reactive : reactive.filter(i => i.category === filter)
  const criticalInsights = reactive.filter(i => i.priority === 'critical')
  const highInsights     = reactive.filter(i => i.priority === 'high')

  const score   = healthScore()
  const dimScores = healthByDimension()

  // Module pulse
  const moduleSignals = reactive.reduce<Record<string, Insight[]>>((acc, insight) => {
    const m = insight.module || 'System'
    if (!acc[m]) acc[m] = []
    acc[m].push(insight)
    return acc
  }, {})
  const allModules = ['Leads', 'Finance', 'Clients', 'Careers', 'Projects', 'Investors', 'Resources']
  allModules.forEach(m => { if (!moduleSignals[m]) moduleSignals[m] = [] })

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            KIMMP Intelligence
            {isLoading && <Spinner size="sm" />}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Cross-module AI signals, risks, and opportunities — the operating brain of the OS.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {lastUpdated && (
            <span className="text-[11px] text-slate-500">Updated {lastUpdated}</span>
          )}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-slate-300 hover:bg-[#151C2F] transition-colors disabled:opacity-40"
            title="Refresh signals"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <Badge variant="success" size="sm" dot>Live</Badge>
        </div>
      </div>

      {/* Command Interface */}
      <CommandBar insights={insights} />

      {/* OS Health Score + Dimensions */}
      <div className="rounded-2xl border border-[#2E2854] bg-[#151C2F] shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">OS Health Score</h3>
          <span className="text-xs text-slate-500 ml-1">— computed live from active signals</span>
        </div>
        <div className="flex items-start gap-8">
          <HealthRing score={score} />
          <div className="flex-1 grid grid-cols-1 gap-2.5 pt-2">
            {(Object.entries(dimScores) as [InsightCategory, number][]).map(([dim, s]) => (
              <DimensionBar
                key={dim}
                label={CATEGORY_CONFIG[dim].label}
                score={s}
                color={CATEGORY_CONFIG[dim].dimColor}
              />
            ))}
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mt-3">
          Score drops as active unacknowledged signals accumulate. Acknowledge a signal after taking action to restore the score.
        </p>
      </div>

      {/* Priority Action Queue */}
      {criticalInsights.length > 0 && (
        <div className="rounded-2xl border border-[#2E2854] bg-[#151C2F] p-5 space-y-3 border-l-4 border-l-[#e2445c] shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-[#e2445c]" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-[0.12em]">Priority Action Queue</h3>
            <span className="ml-auto text-xs px-2.5 py-0.5 rounded-full bg-[#e2445c] text-white font-extrabold shadow-sm">{criticalInsights.length} critical</span>
          </div>
          {criticalInsights.map(insight => (
            <div key={insight.id} className="bg-[#151C2F] rounded-xl border border-[#2E2854] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#e2445c] text-white flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(226,68,92,0.3)]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{insight.title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">{insight.summary}</p>
                  <div className="flex items-start gap-2 mt-2.5 bg-[#0F172A] border border-[#2E2854]/60 rounded-xl p-2.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#e2445c] flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-slate-300">{insight.action}</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#e2445c]/10 text-[#e2445c] flex-shrink-0">{insight.impact}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Module Pulse */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">OS Intelligence Pulse</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {allModules.map(m => (
            <ModulePulse key={m} module={m} insights={moduleSignals[m] ?? []} />
          ))}
        </div>
        <div className="flex items-center gap-5 mt-2.5">
          {[
            { color: 'bg-[#e2445c]', label: 'Critical' },
            { color: 'bg-[#fdab3d]', label: 'High' },
            { color: 'bg-[#0073ea]', label: 'Active' },
            { color: 'bg-slate-200',  label: 'No signals' },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className={`w-2 h-2 rounded-sm flex-shrink-0 ${color}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Signals',    value: reactive.length,                             icon: Brain,         color: 'text-purple-600 bg-purple-50' },
          { label: 'Critical Alerts',   value: criticalCount(),                              icon: AlertTriangle, color: 'text-red-600 bg-red-50'       },
          { label: 'High Priority',     value: highInsights.length,                          icon: Zap,           color: 'text-orange-600 bg-orange-50'  },
          { label: 'Modules Monitored', value: allModules.length,                            icon: BarChart3,     color: 'text-blue-600 bg-blue-50'      },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-[#2E2854] p-5 flex items-center gap-4 shadow-sm" style={{ background: '#151C2F' }}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'revenue', 'risk', 'opportunity', 'ops', 'talent'] as const).map(cat => {
          const count = cat === 'all' ? reactive.length : reactive.filter(i => i.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                filter === cat
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-[#151C2F] text-slate-300 border-[#2E2854] hover:border-slate-400'
              }`}
            >
              {cat === 'all' ? 'All Signals' : CATEGORY_CONFIG[cat].label}
              <span className={`inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] px-1 rounded-full text-[10px] font-bold ${
                filter === cat ? 'bg-[#151C2F]/20 text-white' : 'bg-[#151C2F] text-slate-300'
              }`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Signal feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-[#151C2F] rounded-2xl border border-[#2E2854]">
            <div className="w-12 h-12 rounded-2xl bg-[#151C2F] flex items-center justify-center mb-4">
              {filter === 'all'
                ? <Brain className="w-6 h-6 text-slate-500" />
                : (() => { const Ic = CATEGORY_CONFIG[filter].Icon; return <Ic className="w-6 h-6 text-slate-500" /> })()
              }
            </div>
            <p className="text-sm font-semibold text-slate-300">
              No {filter === 'all' ? '' : `${CATEGORY_CONFIG[filter].label} `}signals right now
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              All clear in this category — check back later or widen the filter.
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors"
              >
                View all signals →
              </button>
            )}
          </div>
        ) : (
          filtered
            .sort((a, b) => {
              const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
              return (order[a.priority] ?? 9) - (order[b.priority] ?? 9)
            })
            .map(insight => <InsightCard key={insight.id} insight={insight} />)
        )}
      </div>
    </div>
  )
}

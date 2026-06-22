import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Brain, TrendingUp, AlertTriangle, Lightbulb, Zap, Target,
  ArrowRight, ChevronDown, ChevronUp, BarChart3,
  Briefcase, DollarSign, Users, GraduationCap, Building2,
  RefreshCw, Check, RotateCcw, Send, Mic, MicOff, Sparkles,
  Activity, Shield, ShieldAlert,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'
import {
  useKIMMPStore, toInsight,
  type Insight, type InsightCategory,
} from '@store/kimmp'

// ─── Category config ──────────────────────────────────────────────────────────

const CAT: Record<InsightCategory, {
  label: string
  color: string        // solid pill bg
  glow: string         // card border glow
  icon: string         // hex for icon
  dim: string          // dim rgba for bg tints
  Icon: React.FC<{ className?: string }>
}> = {
  revenue:     { label: 'Revenue',     color: '#00c875', glow: 'rgba(0,200,117,0.18)',    icon: '#00c875', dim: 'rgba(0,200,117,0.08)',    Icon: p => <TrendingUp    {...p} /> },
  risk:        { label: 'Risk',        color: '#e2445c', glow: 'rgba(226,68,92,0.18)',     icon: '#e2445c', dim: 'rgba(226,68,92,0.08)',     Icon: p => <AlertTriangle {...p} /> },
  opportunity: { label: 'Opportunity', color: '#0073ea', glow: 'rgba(0,115,234,0.18)',     icon: '#0073ea', dim: 'rgba(0,115,234,0.08)',     Icon: p => <Lightbulb     {...p} /> },
  ops:         { label: 'Operations',  color: '#fdab3d', glow: 'rgba(253,171,61,0.18)',    icon: '#fdab3d', dim: 'rgba(253,171,61,0.08)',    Icon: p => <Zap           {...p} /> },
  talent:      { label: 'Talent',      color: '#7f53f9', glow: 'rgba(127,83,249,0.18)',    icon: '#7f53f9', dim: 'rgba(127,83,249,0.08)',    Icon: p => <Target        {...p} /> },
}

const PRIORITY_LEFT: Record<string, string> = {
  critical: '#e2445c',
  high:     '#fdab3d',
  medium:   '#0073ea',
  low:      '#2E2854',
}

// ─── Health ring (SVG) ────────────────────────────────────────────────────────

function HealthRing({ score }: { score: number }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ * 0.75
  const offset = 0
  const color = score >= 75 ? '#00c875' : score >= 50 ? '#fdab3d' : '#e2445c'
  const label = score >= 75 ? 'Healthy' : score >= 50 ? 'Moderate' : 'At Risk'

  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0">
      <svg width={112} height={112} viewBox="0 0 112 112">
        {/* Track */}
        <circle cx={56} cy={56} r={r} fill="none" stroke="#1f2a4a" strokeWidth={8}
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeLinecap="round"
          transform="rotate(135 56 56)" />
        {/* Value arc */}
        <circle cx={56} cy={56} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(135 56 56)"
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease',
                   filter: `drop-shadow(0 0 6px ${color}55)` }}
        />
        {/* Score text */}
        <text x={56} y={50} textAnchor="middle"
          style={{ fontSize: 24, fontWeight: 800, fontFamily: 'inherit', fill: '#ffffff' }}>
          {score}
        </text>
        <text x={56} y={65} textAnchor="middle"
          style={{ fontSize: 10, fontFamily: 'inherit', fill: '#64748b' }}>
          / 100
        </text>
      </svg>
      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
        style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>
        {label}
      </span>
    </div>
  )
}

function DimensionBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400">{label}</span>
        <span className="text-[11px] font-bold tabular-nums" style={{ color }}>{score}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1a2340' }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color,
                   boxShadow: `0 0 6px ${color}55` }} />
      </div>
    </div>
  )
}

// ─── Command bar ──────────────────────────────────────────────────────────────

interface BackendCommandResult {
  response: string
  signalIds: string[]
  confidence: number
  suggestedAction: string | null
  model: string
}

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
    }, 16)
    return () => clearInterval(id)
  }, [text, active])
  return displayed
}

function useVoiceInput(onResult: (t: string) => void) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const [interim,   setInterim]   = useState('')
  const ref = useRef<any>(null)

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setSupported(!!SR)
  }, [])

  const start = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const r = new SR()
    ref.current = r
    r.continuous = false; r.interimResults = true; r.lang = 'en-GB'
    r.onstart  = () => { setListening(true);  setInterim('') }
    r.onend    = () => { setListening(false); setInterim('') }
    r.onerror  = () => { setListening(false); setInterim('') }
    r.onresult = (e: any) => {
      let fin = '', tmp = ''
      for (const res of Array.from(e.results) as any[])
        res.isFinal ? (fin += res[0].transcript) : (tmp += res[0].transcript)
      setInterim(tmp)
      if (fin) { onResult(fin.trim()); setInterim('') }
    }
    r.start()
  }, [onResult])

  const stop = useCallback(() => { ref.current?.stop(); setListening(false) }, [])
  return { listening, supported, interim, start, stop }
}

const SUGGESTED = [
  "What should I focus on today?",
  "What's the biggest risk this week?",
  "Show me deals about to go cold",
  "Finance status",
  "Give me a full brief",
]

function CommandSignalRow({ insight }: { insight: Insight }) {
  const cfg = CAT[insight.category]
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border"
      style={{ background: '#0d1117', borderColor: '#2E2854' }}>
      <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: cfg.dim, border: `1px solid ${cfg.color}30` }}>
        <cfg.Icon className="w-3 h-3" style={{ color: cfg.color } as React.CSSProperties} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-200 leading-tight">{insight.title}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{insight.summary}</p>
      </div>
      <span className="text-[10px] font-bold text-slate-500 flex-shrink-0">{insight.impact}</span>
    </div>
  )
}

function CommandBar({ insights }: { insights: Insight[] }) {
  const [query,    setQuery]    = useState('')
  const [result,   setResult]   = useState<BackendCommandResult | null>(null)
  const [thinking, setThinking] = useState(false)
  const [animate,  setAnimate]  = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const storeInsights = useKIMMPStore(s => s.insights)

  const displayed = useTypewriter(result?.response ?? '', animate)
  const referencedSignals = (result?.signalIds ?? [])
    .map(id => storeInsights.find(i => i.id === id))
    .filter(Boolean) as Insight[]

  const submit = useCallback(async (q?: string) => {
    const text = (q ?? query).trim()
    if (!text) return
    setQuery(text); setThinking(true); setResult(null); setAnimate(false)
    try {
      const res = await api.post('/admin/kangqore-immp/command', { query: text })
      setResult(res.data); setAnimate(true)
    } catch {
      const reactive = insights.filter(i => i.type !== 'predictive')
      const top = [...reactive.filter(i => i.priority === 'critical'), ...reactive.filter(i => i.priority === 'high')]
      setResult({
        response: top.length > 0
          ? `${reactive.filter(i => i.priority === 'critical').length} critical and ${reactive.filter(i => i.priority === 'high').length} high-priority signals active. Review the feed below.`
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

  const { listening, supported, interim, start, stop } = useVoiceInput(
    useCallback((t: string) => { setQuery(t); submit(t) }, [submit])
  )

  const clear = () => { setQuery(''); setResult(null); setAnimate(false); inputRef.current?.focus() }
  const displayedQuery = listening && interim ? interim : query

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ background: '#0d1117', borderColor: '#2E2854' }}>

      {/* Input row */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b transition-all ${
        listening
          ? 'border-red-500/30 bg-red-500/5'
          : 'border-white/10 border-t-white/20 bg-gradient-to-r from-purple-500/[0.04] to-blue-500/[0.04]'
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
          className={`flex-1 text-sm bg-transparent outline-none placeholder:text-slate-600 transition-colors ${
            listening ? 'text-red-400' : 'text-slate-200'
          }`}
        />

        {displayedQuery && !listening && (
          <button onClick={clear} className="text-slate-600 hover:text-slate-400 transition-colors text-xs">✕</button>
        )}

        {supported && (
          <button
            onClick={listening ? stop : start}
            title={listening ? 'Stop' : 'Speak'}
            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
              listening
                ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                : 'text-slate-500 hover:text-purple-400 hover:bg-purple-500/10'
            }`}
          >
            {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
        )}

        <button
          onClick={() => submit()}
          disabled={!displayedQuery.trim() || thinking || listening}
          className="h-7 w-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-30"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #2564ea)' }}
        >
          {thinking ? <Spinner size="sm" /> : <Send className="w-3 h-3 text-white" />}
        </button>
      </div>

      {/* Thinking state */}
      {thinking && (
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
          <span className="text-xs text-slate-500">KIMMP is reasoning across signals…</span>
        </div>
      )}

      {/* Response */}
      {result && !thinking && (
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2564ea)' }}>
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm text-white leading-relaxed font-medium">
                {displayed}
                {animate && displayed.length < (result.response?.length ?? 0) && (
                  <span className="inline-block w-0.5 h-4 bg-purple-500 ml-0.5 animate-pulse align-middle" />
                )}
              </p>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-1 w-16 rounded-full overflow-hidden" style={{ background: '#1a2340' }}>
                    <div className="h-full rounded-full bg-purple-500 transition-all duration-700"
                      style={{ width: `${result.confidence}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-500">{result.confidence}% confidence</span>
                </div>
                {result.model !== 'fallback'
                  ? <span className="text-[10px] text-slate-500">· {result.model}</span>
                  : <span className="text-[10px] text-amber-500">· client fallback</span>
                }
              </div>
            </div>
          </div>

          {result.suggestedAction && (
            <div className="flex items-start gap-2 rounded-xl px-3.5 py-2.5 ml-10"
              style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <ArrowRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-purple-300">{result.suggestedAction}</p>
            </div>
          )}

          {referencedSignals.length > 0 && (
            <div className="ml-10 space-y-2">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Referenced signals</p>
              {referencedSignals.map(i => <CommandSignalRow key={i.id} insight={i} />)}
            </div>
          )}
        </div>
      )}

      {/* Suggested queries — idle */}
      {!result && !thinking && (
        <div className="flex items-center gap-2 px-4 py-3 flex-wrap border-t border-white/10 border-t-white/20/50">
          <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">Try:</span>
          {SUGGESTED.map(s => (
            <button key={s} onClick={() => submit(s)}
              className="text-[11px] px-2.5 py-1 rounded-lg transition-all text-slate-400 hover:text-white"
              style={{ background: '#151C2F', border: '1px solid #2E2854' }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(124,58,237,0.4)'
                ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,58,237,0.08)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#2E2854'
                ;(e.currentTarget as HTMLButtonElement).style.background = '#151C2F'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Module pulse ─────────────────────────────────────────────────────────────

const MODULE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Leads:     p => <Zap           {...p} />,
  Finance:   p => <DollarSign    {...p} />,
  Clients:   p => <Briefcase     {...p} />,
  Careers:   p => <GraduationCap {...p} />,
  Projects:  p => <BarChart3     {...p} />,
  Investors: p => <TrendingUp    {...p} />,
  Resources: p => <Users         {...p} />,
  System:    p => <Building2     {...p} />,
}

function ModulePulse({ module, insights }: { module: string; insights: Insight[] }) {
  const navigate = useNavigate()
  const critical = insights.filter(i => i.priority === 'critical').length
  const high     = insights.filter(i => i.priority === 'high').length
  const Icon = MODULE_ICONS[module] ?? (p => <Brain {...p} />)

  const statusColor = critical > 0 ? '#e2445c' : high > 0 ? '#fdab3d' : insights.length > 0 ? '#0073ea' : '#1f2a4a'
  const textColor   = critical > 0 ? '#e2445c' : high > 0 ? '#fdab3d' : insights.length > 0 ? '#0073ea' : '#475569'
  const count       = critical > 0 ? critical  : high > 0 ? high      : insights.length

  return (
    <button
      onClick={() => navigate(`/kangqore-view/admin/${module.toLowerCase()}`)}
      className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all group"
      style={{
        background: '#0d1117',
        border: `1px solid ${insights.length > 0 ? `${statusColor}30` : '#1f2a4a'}`,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${statusColor}60`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = insights.length > 0 ? `${statusColor}30` : '#1f2a4a'; (e.currentTarget as HTMLElement).style.transform = '' }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
        style={{ background: `${statusColor}18`, border: `1px solid ${statusColor}30`,
                 boxShadow: insights.length > 0 ? `0 0 8px ${statusColor}20` : 'none' }}>
        <Icon className="w-4 h-4" style={{ color: statusColor } as React.CSSProperties} />
      </div>
      <div className="text-center">
        <p className="text-[10px] font-semibold text-slate-400">{module}</p>
        {count > 0 && (
          <p className="text-[10px] font-bold tabular-nums" style={{ color: textColor }}>{count} signal{count !== 1 ? 's' : ''}</p>
        )}
        {count === 0 && (
          <p className="text-[9px] text-slate-600">clear</p>
        )}
      </div>
    </button>
  )
}

// ─── Insight card ─────────────────────────────────────────────────────────────

function InsightCard({ insight }: { insight: Insight }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = CAT[insight.category]
  const { isAcknowledged, acknowledgeSignal, unacknowledgeSignal } = useKIMMPStore()
  const acked = isAcknowledged(insight.id)
  const leftColor = PRIORITY_LEFT[insight.priority]

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: '#0d1117',
        border: `1px solid #2E2854`,
        borderLeft: `3px solid ${leftColor}`,
        opacity: acked ? 0.55 : 1,
        boxShadow: !acked && insight.priority === 'critical' ? `0 0 16px ${leftColor}18` : 'none',
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: cfg.dim, border: `1px solid ${cfg.color}25`,
                       boxShadow: `0 0 8px ${cfg.color}20` }}>
              <cfg.Icon className="w-4 h-4" style={{ color: cfg.color } as React.CSSProperties} />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold leading-tight ${acked ? 'line-through text-slate-600' : 'text-white'}`}>
                {insight.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide"
                  style={{ color: leftColor, background: `${leftColor}18`, border: `1px solid ${leftColor}30` }}>
                  {insight.priority}
                </span>
                <span className="text-[10px] font-medium text-slate-500 px-2 py-0.5 rounded-md"
                  style={{ background: '#151C2F', border: '1px solid #2E2854' }}>
                  {insight.module}
                </span>
                <span className="text-[10px] text-slate-600">{insight.confidence}% conf.</span>
                {insight.createdAt && (
                  <span className="text-[10px] text-slate-600">{formatRelative(insight.createdAt)}</span>
                )}
                {acked && (
                  <span className="text-[10px] font-bold text-emerald-500 px-2 py-0.5 rounded-md"
                    style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.25)' }}>
                    Acknowledged
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {insight.impact && insight.impact !== '—' && (
              <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg"
                style={{ color: cfg.color, background: cfg.dim, border: `1px solid ${cfg.color}25` }}>
                {insight.impact}
              </span>
            )}
            <button
              onClick={() => acked ? unacknowledgeSignal(insight.id) : acknowledgeSignal(insight.id)}
              title={acked ? 'Reopen' : 'Acknowledge'}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{
                border: acked ? '1px solid rgba(5,150,105,0.35)' : '1px solid #2E2854',
                background: acked ? 'rgba(5,150,105,0.1)' : '#151C2F',
                color: acked ? '#059669' : '#475569',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = acked ? '#2E2854' : 'rgba(5,150,105,0.35)'
                el.style.background  = acked ? '#151C2F' : 'rgba(5,150,105,0.1)'
                el.style.color       = acked ? '#475569' : '#059669'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = acked ? 'rgba(5,150,105,0.35)' : '#2E2854'
                el.style.background  = acked ? 'rgba(5,150,105,0.1)' : '#151C2F'
                el.style.color       = acked ? '#059669' : '#475569'
              }}
            >
              {acked ? <RotateCcw className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mt-2.5 pl-11">{insight.summary}</p>

        {expanded && (
          <div className="pl-11 space-y-3 mt-3 pt-3" style={{ borderTop: '1px solid #1f2a4a' }}>
            <p className="text-xs text-slate-300 leading-relaxed">{insight.detail}</p>
            <div className="flex items-start gap-2 rounded-xl px-3.5 py-2.5"
              style={{ background: 'rgba(37,100,234,0.06)', border: '1px solid rgba(37,100,234,0.15)' }}>
              <ArrowRight className="w-3.5 h-3.5 text-os-blue flex-shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-slate-200">{insight.action}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded(e => !e)}
          className="pl-11 mt-2.5 flex items-center gap-1 text-xs font-medium transition-colors text-slate-600 hover:text-os-blue"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Show less' : 'Detail & action'}
        </button>
      </div>
    </div>
  )
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function useRelativeTime(ts: number | undefined) {
  const [label, setLabel] = useState('')
  const compute = useCallback(() => {
    if (!ts) return ''
    const diff = Math.floor((Date.now() - ts) / 60000)
    if (diff < 1)  return 'just now'
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
    queryFn: () => api.get('/admin/kangqore-immp/insights')
      .then(r => (r.data.insights ?? r.data ?? []) as Record<string, unknown>[]),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 3,
    refetchInterval: 1000 * 60 * 3,
  })

  const lastUpdated = useRelativeTime(dataUpdatedAt || undefined)

  useEffect(() => {
    if (rawInsights !== undefined) setInsights((rawInsights ?? []).map((r, i) => toInsight(r, i)))
  }, [rawInsights, setInsights])

  const reactive        = insights.filter(i => i.type !== 'predictive')
  const filtered        = filter === 'all' ? reactive : reactive.filter(i => i.category === filter)
  const criticalInsights = reactive.filter(i => i.priority === 'critical')
  const highInsights    = reactive.filter(i => i.priority === 'high')

  const score     = healthScore()
  const dimScores = healthByDimension()

  const moduleSignals = reactive.reduce<Record<string, Insight[]>>((acc, ins) => {
    const m = ins.module || 'System'
    if (!acc[m]) acc[m] = []
    acc[m].push(ins)
    return acc
  }, {})
  const allModules = ['Leads', 'Finance', 'Clients', 'Careers', 'Projects', 'Investors', 'Resources']
  allModules.forEach(m => { if (!moduleSignals[m]) moduleSignals[m] = [] })

  const sortedFiltered = [...filtered].sort((a, b) => {
    const p: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
    return (p[a.priority] ?? 9) - (p[b.priority] ?? 9)
  })

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #2564ea)',
                   boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}>
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            KIMMP Intelligence
            {isLoading && <Spinner size="sm" />}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-module AI signals, risks, and opportunities — the operating brain of the OS.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {lastUpdated && <span className="text-[11px] text-slate-600">Updated {lastUpdated}</span>}
          <button onClick={() => refetch()} disabled={isFetching}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 transition-colors disabled:opacity-40"
            style={{ background: '#151C2F', border: '1px solid #2E2854' }}>
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
            style={{ color: '#00c875', background: 'rgba(0,200,117,0.1)', border: '1px solid rgba(0,200,117,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c875] animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* ── Command bar ────────────────────────────────────────────────────── */}
      <CommandBar insights={insights} />

      {/* ── Health + Stats row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Health card — 2/5 width */}
        <div className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-bold text-slate-300">OS Health Score</span>
            <span className="text-[10px] text-slate-600 ml-1">live</span>
          </div>
          <div className="flex items-center gap-6">
            <HealthRing score={score} />
            <div className="flex-1 space-y-2.5">
              {(Object.entries(dimScores) as [InsightCategory, number][]).map(([dim, s]) => (
                <DimensionBar key={dim} label={CAT[dim].label} score={s} color={CAT[dim].color} />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-slate-600 mt-4 leading-relaxed">
            Score drops as unacknowledged signals accumulate. Acknowledge after acting.
          </p>
        </div>

        {/* Stats — 3/5 width */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-3">
          {[
            { label: 'Active Signals',    value: reactive.length,    icon: Brain,       color: '#7f53f9', dim: 'rgba(127,83,249,0.12)' },
            { label: 'Critical Alerts',   value: criticalCount(),     icon: ShieldAlert, color: '#e2445c', dim: 'rgba(226,68,92,0.12)'  },
            { label: 'High Priority',     value: highInsights.length, icon: Zap,         color: '#fdab3d', dim: 'rgba(253,171,61,0.12)' },
            { label: 'Modules Monitored', value: allModules.length,   icon: Shield,      color: '#0073ea', dim: 'rgba(0,115,234,0.12)'  },
          ].map(({ label, value, icon: Icon, color, dim }) => (
            <div key={label} className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: '#0d1117', border: `1px solid ${color}20` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: dim, border: `1px solid ${color}30`,
                         boxShadow: `0 0 10px ${color}15` }}>
                <Icon className="w-4 h-4" style={{ color } as React.CSSProperties} />
              </div>
              <div>
                <p className="text-xl font-bold text-white tabular-nums">{value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
              </div>
            </div>
          ))}

          {/* Module pulse — fills remaining bottom */}
          <div className="col-span-2 rounded-xl p-3.5" style={{ background: '#0d1117', border: '1px solid #1f2a4a' }}>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2.5">Intelligence Pulse</p>
            <div className="grid grid-cols-7 gap-1.5">
              {allModules.map(m => (
                <ModulePulse key={m} module={m} insights={moduleSignals[m] ?? []} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Priority action queue ──────────────────────────────────────────── */}
      {criticalInsights.length > 0 && (
        <div className="rounded-2xl p-5 space-y-3"
          style={{ background: 'rgba(226,68,92,0.04)', border: '1px solid rgba(226,68,92,0.2)',
                   borderLeft: '3px solid #e2445c', boxShadow: '0 0 24px rgba(226,68,92,0.06)' }}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#e2445c]" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Priority Action Queue</h3>
            <span className="ml-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full"
              style={{ color: '#e2445c', background: 'rgba(226,68,92,0.15)', border: '1px solid rgba(226,68,92,0.3)' }}>
              {criticalInsights.length} critical
            </span>
          </div>
          {criticalInsights.map(ins => (
            <div key={ins.id} className="rounded-xl p-4"
              style={{ background: '#0d1117', border: '1px solid rgba(226,68,92,0.15)' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(226,68,92,0.15)', border: '1px solid rgba(226,68,92,0.3)',
                           boxShadow: '0 0 10px rgba(226,68,92,0.2)' }}>
                  <AlertTriangle className="w-4 h-4 text-[#e2445c]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{ins.title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">{ins.summary}</p>
                  <div className="flex items-start gap-2 mt-2.5 rounded-xl px-3 py-2"
                    style={{ background: 'rgba(37,100,234,0.06)', border: '1px solid rgba(37,100,234,0.15)' }}>
                    <ArrowRight className="w-3.5 h-3.5 text-os-blue flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-slate-300">{ins.action}</p>
                  </div>
                </div>
                {ins.impact && ins.impact !== '—' && (
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg flex-shrink-0"
                    style={{ color: '#e2445c', background: 'rgba(226,68,92,0.1)', border: '1px solid rgba(226,68,92,0.2)' }}>
                    {ins.impact}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Signal feed ────────────────────────────────────────────────────── */}
      <div>
        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap mb-4">
          {(['all', 'revenue', 'risk', 'opportunity', 'ops', 'talent'] as const).map(cat => {
            const count  = cat === 'all' ? reactive.length : reactive.filter(i => i.category === cat).length
            const active = filter === cat
            const color  = cat === 'all' ? '#7f53f9' : CAT[cat].color
            return (
              <button key={cat} onClick={() => setFilter(cat)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: active ? `${color}14` : '#0d1117',
                  border:     active ? `1px solid ${color}40` : '1px solid #2E2854',
                  color:      active ? '#ffffff' : '#64748b',
                  boxShadow:  active ? `0 0 12px ${color}15` : 'none',
                }}>
                {cat === 'all' ? 'All Signals' : CAT[cat].label}
                <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-md"
                  style={{
                    background: active ? `${color}20` : '#1a2340',
                    color:      active ? '#ffffff' : '#475569',
                  }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Feed */}
        <div className="space-y-3">
          {sortedFiltered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 rounded-2xl"
              style={{ background: '#0d1117', border: '1px solid #1f2a4a' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: '#151C2F', border: '1px solid #2E2854' }}>
                {filter === 'all'
                  ? <Brain className="w-5 h-5 text-slate-600" />
                  : (() => { const CatIcon = CAT[filter].Icon; return <CatIcon className="w-5 h-5" style={{ color: '#475569' }} /> })()
                }
              </div>
              <p className="text-sm font-semibold text-slate-400">
                No {filter === 'all' ? '' : `${CAT[filter].label} `}signals right now
              </p>
              <p className="text-xs text-slate-600 mt-1 max-w-xs text-center">
                All clear — check back later or widen the filter.
              </p>
              {filter !== 'all' && (
                <button onClick={() => setFilter('all')}
                  className="mt-4 text-xs font-medium text-os-blue hover:text-white transition-colors">
                  View all signals →
                </button>
              )}
            </div>
          ) : (
            sortedFiltered.map(ins => <InsightCard key={ins.id} insight={ins} />)
          )}
        </div>
      </div>
    </div>
  )
}

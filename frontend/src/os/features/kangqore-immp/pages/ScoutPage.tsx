import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Satellite, Play, Clock, CheckCircle2, XCircle, RefreshCw,
  Globe, Building, TrendingUp, Shield, Cpu, Handshake,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScoutSource {
  name: string
  signalType: string
  signalCategory: 'COMPETITOR' | 'OPPORTUNITY' | 'MARKET' | 'RISK'
  cadenceMinutes: number
  queryCount: number
}

interface ScoutJob {
  id: string
  sourceName: string
  query: string
  resultsFound: number
  signalsEmitted: number
  status: 'COMPLETED' | 'FAILED'
  createdAt: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SOURCE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  'Competitor Monitor': ({ className }) => <Building    className={className} />,
  'Government Tenders': ({ className }) => <Globe       className={className} />,
  'Market Intelligence':({ className }) => <TrendingUp  className={className} />,
  'Partnership Radar':  ({ className }) => <Handshake   className={className} />,
  'Regulatory Watch':   ({ className }) => <Shield      className={className} />,
  'Tech Radar':         ({ className }) => <Cpu         className={className} />,
}

const CATEGORY_COLORS: Record<string, { bg: string, text: string }> = {
  COMPETITOR:  { bg: 'bg-red-50', text: 'text-red-600' },
  OPPORTUNITY: { bg: 'bg-green-50', text: 'text-green-600' },
  MARKET:      { bg: 'bg-blue-50', text: 'text-blue-600' },
  RISK:        { bg: 'bg-amber-50', text: 'text-amber-600' },
}

const CATEGORY_HEX: Record<string, string> = {
  COMPETITOR:  '#ef4444',
  OPPORTUNITY: '#16a34a',
  MARKET:      '#3b82f6',
  RISK:        '#f59e0b',
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ─── Source card ──────────────────────────────────────────────────────────────

function SourceCard({ source, onRun, running }: { source: ScoutSource; onRun: (name: string) => void; running: boolean }) {
  const Icon = SOURCE_ICONS[source.name] ?? (({ className }) => <Satellite className={className} />)
  const slug = source.name.toLowerCase().replace(/\s+/g, '-')

  const c = CATEGORY_HEX[source.signalCategory] || '#000'

  return (
    <div className={`p-6 flex flex-col gap-4 transition-transform hover:-translate-y-1`} style={{ background: `${c}10`, borderRadius: 'var(--os-radius-xl)', boxShadow: `0 16px 32px ${c}15` }}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${c}20`, color: c }}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0 mt-0.5">
          <p className="text-base font-bold text-[var(--os-text-1)] leading-tight">{source.name}</p>
          <p className="text-sm font-semibold text-[var(--os-text-2)] mt-1">{source.signalType.replace(/_/g, ' ')}</p>
        </div>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${CATEGORY_COLORS[source.signalCategory]?.bg} ${CATEGORY_COLORS[source.signalCategory]?.text}`}>
          {source.signalCategory}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-[var(--os-text-2)]">
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          Every {source.cadenceMinutes}m
        </span>
        <span>{source.queryCount} queries / run</span>
      </div>

      <button
        onClick={() => onRun(slug)}
        disabled={running}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold bg-[var(--os-card)] shadow-[0_8px_16px_rgba(0,0,0,0.04)] text-[var(--os-text-1)] hover:text-blue-600 hover:shadow-sm transition-all disabled:opacity-50 mt-1"
      >
        {running ? <Spinner size="sm" /> : <Play className="w-4 h-4" />}
        {running ? 'Scanning…' : 'Run Now'}
      </button>
    </div>
  )
}

// ─── Job row ──────────────────────────────────────────────────────────────────

function JobRow({ job }: { job: ScoutJob }) {
  return (
    <div className="flex items-center gap-4 py-3 px-6 border-b border-[var(--os-border)] last:border-0 hover:bg-[var(--os-surface-0)] transition-colors">
      {job.status === 'COMPLETED'
        ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
        : <XCircle      className="w-5 h-5 text-red-500 flex-shrink-0" />
      }
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[var(--os-text-1)] truncate">{job.sourceName}</p>
        <p className="text-[11px] font-semibold text-[var(--os-text-2)] truncate mt-1">{job.query}</p>
      </div>
      <div className="flex items-center gap-4 text-xs font-semibold text-[var(--os-text-2)] flex-shrink-0">
        <span>{job.resultsFound} results</span>
        <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">{job.signalsEmitted} signals</span>
        <span>{formatRelative(job.createdAt)}</span>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ScoutPage() {
  const [runningSource, setRunningSource] = useState<string | null>(null)
  const [runningAll,    setRunningAll]    = useState(false)
  const qc = useQueryClient()

  const { data: sourcesData, isLoading: loadingSources } = useQuery({
    queryKey: ['scout-sources'],
    queryFn: () => api.get('/admin/kangqore-immp/scout/sources').then(r => r.data),
    staleTime: 5 * 60_000,
  })

  const { data: jobsData, isLoading: loadingJobs, refetch: refetchJobs } = useQuery({
    queryKey: ['scout-jobs'],
    queryFn: () => api.get('/admin/kangqore-immp/scout/jobs').then(r => r.data),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  const sources: ScoutSource[] = sourcesData?.sources ?? []
  const jobs:    ScoutJob[]    = jobsData?.jobs     ?? []

  const completedJobs = jobs.filter(j => j.status === 'COMPLETED').length
  const totalSignals  = jobs.reduce((s, j) => s + j.signalsEmitted, 0)

  async function runSource(slug: string) {
    setRunningSource(slug)
    try {
      await api.post(`/admin/kangqore-immp/scout/run/${slug}`)
      setTimeout(() => { refetchJobs(); qc.invalidateQueries({ queryKey: ['scout-jobs'] }) }, 5000)
    } finally {
      setRunningSource(null)
    }
  }

  async function runAll() {
    setRunningAll(true)
    try {
      await api.post('/admin/kangqore-immp/scout/run')
      setTimeout(() => { refetchJobs(); qc.invalidateQueries({ queryKey: ['scout-jobs'] }) }, 5000)
    } finally {
      setRunningAll(false)
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3 pb-5 mb-1 border-b border-[var(--os-border)]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Satellite className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-[var(--os-text-1)]">Scout — External Intelligence Radar</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">
            Autonomous web surveillance across 6 signal sources. Runs every 5–15 minutes and feeds the Signal Ledger.
          </p>
        </div>
        <button
          onClick={runAll}
          disabled={runningAll}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-[12px] font-bold hover:-translate-y-1 transition-all disabled:opacity-50 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2564ea 100%)', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}
        >
          {runningAll ? <Spinner size="sm" /> : <Play className="w-4 h-4 fill-white" />}
          Run All Sources
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Sources', value: sources.length, accent: '#00c875', icon: Satellite },
          { label: 'Jobs Today',     value: completedJobs,  accent: '#579bfc', icon: Clock     },
          { label: 'Intel Gathered', value: totalSignals,   accent: '#7c3aed', icon: TrendingUp },
        ].map(s => (
          <div key={s.label} className="relative overflow-hidden flex flex-col p-5 transition-all duration-300"
            style={{
              background: s.accent,
              color: '#ffffff',
              borderRadius: 'var(--os-radius-xl)',
              boxShadow: `0 12px 32px ${s.accent}60`,
              border: 'none',
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: '50%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15))', pointerEvents: 'none' }} />
            
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)' }}>
              <s.icon style={{ width: 18, height: 18, color: '#ffffff' }} />
            </div>
            <p className="text-3xl font-black tracking-tight leading-none mb-1.5" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {s.value}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.9)' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Source grid */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3 flex items-center gap-2">
          <Satellite className="w-4 h-4 text-sky-500" />
          Signal Sources
          {loadingSources && <Spinner size="sm" />}
        </h3>
        {sources.length === 0 && !loadingSources ? (
          <p className="text-sm text-slate-500">No sources found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map(source => (
              <SourceCard
                key={source.name}
                source={source}
                onRun={runSource}
                running={runningSource === source.name.toLowerCase().replace(/\s+/g, '-')}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent jobs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--os-text-2)]" />
            Recent Scan Jobs
          </h3>
          {loadingJobs && <Spinner size="sm" />}
          <button
            onClick={() => refetchJobs()}
            className="ml-auto w-8 h-8 rounded-xl flex items-center justify-center text-[var(--os-text-2)] bg-[var(--os-surface-0)] border border-[var(--os-border)] hover:text-[var(--os-text-1)] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-[var(--os-card)] shadow-[0_32px_64px_rgba(0,0,0,0.04)] overflow-hidden" style={{ borderRadius: 'var(--os-radius-xl)' }}>
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
                <Satellite className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-lg font-bold text-[var(--os-text-1)]">No scan jobs yet</p>
              <p className="text-sm font-semibold text-[var(--os-text-2)] mt-2">Scout runs automatically on cadence.</p>
            </div>
          ) : (
            jobs.slice(0, 30).map(job => <JobRow key={job.id} job={job} />)
          )}
        </div>
      </div>
    </div>
  )
}

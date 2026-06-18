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

const CATEGORY_COLORS: Record<string, string> = {
  COMPETITOR:  'bg-red-50 text-red-700 border-red-200',
  OPPORTUNITY: 'bg-green-50 text-green-700 border-green-200',
  MARKET:      'bg-blue-50 text-blue-700 border-blue-200',
  RISK:        'bg-amber-50 text-amber-700 border-amber-200',
}

const CATEGORY_BORDER: Record<string, string> = {
  COMPETITOR:  'border-l-red-400',
  OPPORTUNITY: 'border-l-green-400',
  MARKET:      'border-l-blue-400',
  RISK:        'border-l-amber-400',
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

  return (
    <div className={`bg-os-s1 border border-os-border border-l-4 ${CATEGORY_BORDER[source.signalCategory]} rounded-xl p-4 shadow-sm flex flex-col gap-3`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-os-s1 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">{source.name}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{source.signalType.replace(/_/g, ' ')}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${CATEGORY_COLORS[source.signalCategory]}`}>
          {source.signalCategory}
        </span>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Every {source.cadenceMinutes}m
        </span>
        <span>{source.queryCount} queries / run</span>
      </div>

      <button
        onClick={() => onRun(slug)}
        disabled={running}
        className="flex items-center justify-center gap-2 w-full py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
      >
        {running ? <Spinner size="sm" /> : <Play className="w-3 h-3" />}
        {running ? 'Scanning…' : 'Run Now'}
      </button>
    </div>
  )
}

// ─── Job row ──────────────────────────────────────────────────────────────────

function JobRow({ job }: { job: ScoutJob }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 border-b border-os-border last:border-0 hover:bg-slate-900 transition-colors">
      {job.status === 'COMPLETED'
        ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
        : <XCircle      className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
      }
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-200 truncate">{job.sourceName}</p>
        <p className="text-[10px] text-slate-500 truncate mt-0.5">{job.query}</p>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-slate-500 flex-shrink-0">
        <span>{job.resultsFound} results</span>
        <span className="font-semibold text-purple-600">{job.signalsEmitted} signals</span>
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
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Satellite className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Scout — External Intelligence Radar</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Autonomous web surveillance across 6 signal sources. Runs every 5–15 minutes and feeds the Signal Ledger.
          </p>
        </div>
        <button
          onClick={runAll}
          disabled={runningAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50 flex-shrink-0"
        >
          {runningAll ? <Spinner size="sm" /> : <Play className="w-4 h-4" />}
          Run All Sources
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Sources',    value: sources.length, color: 'text-blue-600 bg-blue-50'   },
          { label: 'Jobs (Recent 30)',  value: completedJobs,  color: 'text-green-600 bg-green-50' },
          { label: 'Signals Emitted',   value: totalSignals,   color: 'text-purple-600 bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-os-s1 border border-os-border rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
              <Satellite className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Source grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
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
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            Recent Scan Jobs
          </h3>
          {loadingJobs && <Spinner size="sm" />}
          <button
            onClick={() => refetchJobs()}
            className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:bg-os-s1 hover:text-slate-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="bg-os-s1 border border-os-border rounded-xl overflow-hidden shadow-sm">
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Satellite className="w-8 h-8 text-slate-200 mb-3" />
              <p className="text-sm text-slate-500">No scan jobs yet — Scout runs automatically on cadence.</p>
            </div>
          ) : (
            jobs.slice(0, 30).map(job => <JobRow key={job.id} job={job} />)
          )}
        </div>
      </div>
    </div>
  )
}

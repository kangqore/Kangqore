import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  FileText, Play, Clock, ChevronDown, ChevronUp,
  RefreshCw, Calendar, Briefcase, TrendingUp, Sun,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

type ReportType = 'DAILY_BRIEFING' | 'WEEKLY_EXECUTIVE' | 'MONTHLY_BOARD' | 'SALES_PIPELINE'

interface Report {
  id: string
  type: ReportType
  title: string
  content: string
  highlights: string[]
  sections: { heading: string; body: string }[]
  generatedAt: string
  requestedBy?: string
}

// ─── Report type config ───────────────────────────────────────────────────────

const REPORT_TYPES: {
  type: ReportType
  label: string
  desc: string
  icon: React.FC<{ className?: string }>
  color: string
}[] = [
  {
    type:  'DAILY_BRIEFING',
    label: 'Daily Briefing',
    desc:  'Morning intelligence brief — signals, priorities, and actions for today.',
    icon:  ({ className }) => <Sun       className={className} />,
    color: '#f59e0b',
  },
  {
    type:  'WEEKLY_EXECUTIVE',
    label: 'Weekly Executive',
    desc:  'Cross-module summary for leadership — pipeline, risks, and opportunities.',
    icon:  ({ className }) => <Briefcase className={className} />,
    color: '#3b82f6',
  },
  {
    type:  'MONTHLY_BOARD',
    label: 'Monthly Board Report',
    desc:  'Board-level narrative — strategic position, competitive moves, key decisions.',
    icon:  ({ className }) => <Calendar  className={className} />,
    color: '#a855f7',
  },
  {
    type:  'SALES_PIPELINE',
    label: 'Sales Pipeline Report',
    desc:  'Pipeline health, deal velocity, cold leads, and revenue forecast.',
    icon:  ({ className }) => <TrendingUp className={className} />,
    color: '#10b981',
  },
]

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
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

// ─── Report card ──────────────────────────────────────────────────────────────

function ReportCard({ report }: { report: Report }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = REPORT_TYPES.find(r => r.type === report.type)
  const Icon = cfg?.icon ?? (({ className }) => <FileText className={className} />)

  return (
    <div className="p-6 space-y-4 transition-transform hover:-translate-y-1" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 32px 64px rgba(0,0,0,0.04)' }}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${cfg?.color}15` }}>
          <Icon className="w-5 h-5" style={{ color: cfg?.color }} />
        </div>
        <div className="flex-1 min-w-0 mt-0.5">
          <p className="text-base font-bold text-[var(--os-text-1)] leading-tight">{report.title}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="neutral" size="sm">{cfg?.label ?? report.type}</Badge>
            <span className="text-[11px] font-bold text-[var(--os-text-2)] flex items-center gap-1.5 ml-2">
              <Clock className="w-3.5 h-3.5" />
              {formatRelative(report.generatedAt)}
            </span>
            <span className="text-[11px] font-bold text-[var(--os-text-2)] border-l border-[var(--os-border)] pl-3 ml-1">{formatDateTime(report.generatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Content preview */}
      <div className={`ml-14 text-sm font-semibold text-[var(--os-text-2)] leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
        {report.content}
      </div>

      {/* Highlights */}
      {report.highlights?.length > 0 && expanded && (
        <div className="ml-14 space-y-2 mt-4">
          <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-widest mb-3">Key Highlights</p>
          {report.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <p className="text-sm font-medium text-[var(--os-text-1)]">{h}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sections */}
      {report.sections?.length > 0 && expanded && (
        <div className="ml-14 space-y-5 pt-5 border-t border-[var(--os-border)] mt-5">
          {report.sections.map((s, i) => (
            <div key={i}>
              <p className="text-sm font-bold text-[var(--os-text-1)] mb-2">{s.heading}</p>
              <p className="text-sm font-medium text-[var(--os-text-2)] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setExpanded(e => !e)}
        className="ml-14 flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:text-blue-800 transition-colors mt-4"
      >
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {expanded ? 'Collapse' : 'Read full report'}
      </button>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ReportsPage() {
  const [generating, setGenerating] = useState<ReportType | null>(null)
  const [latest,     setLatest]     = useState<Report | null>(null)
  const [error,      setError]      = useState<string | null>(null)
  const qc = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reports'],
    queryFn: () => api.get('/admin/kangqore-immp/reports', { params: { limit: 20 } }).then(r => r.data),
    staleTime: 60_000,
  })

  const reports: Report[] = data?.reports ?? []

  async function generate(type: ReportType) {
    setGenerating(type)
    setError(null)
    try {
      const res = await api.post('/admin/kangqore-immp/reports/generate', { type })
      setLatest(res.data)
      qc.invalidateQueries({ queryKey: ['reports'] })
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Report generation failed.')
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3 pb-5 mb-1 border-b border-[var(--os-border)]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-[var(--os-text-1)]">Report Generator</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">
            KIMMP synthesises live signals, pipeline data, and goals into structured executive reports.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--os-text-2)] bg-[var(--os-surface-0)] border border-[var(--os-border)] hover:text-[var(--os-text-1)] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Generator cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REPORT_TYPES.map(rt => {
          const Icon = rt.icon
          const isRunning = generating === rt.type
          return (
            <div key={rt.type} className={`p-6 transition-transform hover:-translate-y-1`} style={{ background: `${rt.color}0A`, borderRadius: 'var(--os-radius-xl)', boxShadow: `0 16px 32px ${rt.color}15` }}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${rt.color}20`, color: rt.color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 mt-0.5">
                  <p className="text-base font-bold text-[var(--os-text-1)]">{rt.label}</p>
                  <p className="text-sm font-semibold text-[var(--os-text-2)] mt-1.5 leading-snug">{rt.desc}</p>
                </div>
              </div>
              <button
                onClick={() => generate(rt.type)}
                disabled={!!generating}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[var(--os-card)] shadow-[0_8px_16px_rgba(0,0,0,0.04)] text-xs font-bold transition-all disabled:opacity-50"
                style={{ color: rt.color }}
              >
                {isRunning ? <Spinner size="sm" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Generating…' : 'Generate Now'}
              </button>
            </div>
          )
        })}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Latest generated */}
      {latest && (
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3 flex items-center gap-2">
            <Play className="w-3.5 h-3.5 text-[#579bfc]" />
            Just Generated
          </h3>
          <ReportCard report={latest} />
        </div>
      )}

      {/* History */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          Report History ({reports.length})
        </h3>
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[var(--os-card)] shadow-[0_32px_64px_rgba(0,0,0,0.04)] text-center" style={{ borderRadius: 'var(--os-radius-xl)' }}>
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-[var(--os-text-2)]" />
            </div>
            <p className="text-lg font-bold text-[var(--os-text-1)]">No reports generated yet</p>
            <p className="text-sm font-semibold text-[var(--os-text-2)] mt-2">Generate a new report to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.filter(r => r.id !== latest?.id).map(r => (
              <ReportCard key={r.id} report={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Bell, AlertTriangle, X, RefreshCw, CheckCheck,
  ArrowRight, ExternalLink, Play,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'
import { useNavigate } from 'react-router-dom'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProactiveAlert {
  id: string
  ruleId: string
  entityId: string
  category: string
  title: string
  description: string
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  suggestedAction: string | null
  actionType: string | null
  actionPayload: Record<string, any> | null
  dismissed: boolean
  createdAt: string
  expiresAt: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SEV_CONFIG: Record<string, { badge: 'danger' | 'warning' | 'info' | 'neutral'; border: string; icon: string }> = {
  CRITICAL: { badge: 'danger',  border: 'border-l-[#e2445c]', icon: 'text-red-500' },
  HIGH:     { badge: 'warning', border: 'border-l-[#fdab3d]', icon: 'text-amber-500' },
  MODERATE: { badge: 'info',    border: 'border-l-[#0073ea]', icon: 'text-blue-500' },
  LOW:      { badge: 'neutral', border: 'border-l-slate-300', icon: 'text-slate-500' },
}

const CATEGORY_COLORS: Record<string, string> = {
  OPPORTUNITY: 'bg-green-50 text-green-700',
  COMPETITOR:  'bg-red-50 text-red-700',
  LEAD:        'bg-purple-50 text-purple-700',
  PIPELINE:    'bg-blue-50 text-blue-700',
  FINANCE:     'bg-emerald-50 text-emerald-700',
  GOAL:        'bg-violet-50 text-violet-700',
  INTELLIGENCE:'bg-sky-50 text-sky-700',
  SYSTEM:      'bg-slate-900 text-slate-300',
}

const RULE_LABELS: Record<string, string> = {
  TENDER_MATCH:         'Tender Match',
  LEADS_COLD:           'Leads Going Cold',
  PIPELINE_DROUGHT:     'Pipeline Drought',
  REVENUE_ANOMALY:      'Revenue Anomaly',
  COMPETITOR_MOVES:     'Competitor Surge',
  GOAL_AT_RISK:         'Goal at Risk',
  CORRELATION_PATTERN:  'Correlation Pattern',
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

// ─── Alert card ───────────────────────────────────────────────────────────────

function AlertCard({ alert, onDismiss }: { alert: ProactiveAlert; onDismiss: (id: string) => void }) {
  const navigate = useNavigate()
  const sev = SEV_CONFIG[alert.severity] ?? SEV_CONFIG.LOW
  const catColor = CATEGORY_COLORS[alert.category] ?? 'bg-slate-900 text-slate-300'
  const ruleLabel = RULE_LABELS[alert.ruleId] ?? alert.ruleId

  function handleAction() {
    if (!alert.actionPayload) return
    if (alert.actionType === 'NAVIGATE' && alert.actionPayload.route) {
      navigate(alert.actionPayload.route)
    }
  }

  return (
    <div className={`bg-os-s1 border border-os-border border-l-4 ${sev.border} rounded-xl p-4 shadow-sm space-y-3`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${sev.icon}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant={sev.badge} size="sm" dot>{alert.severity}</Badge>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${catColor}`}>{alert.category}</span>
            <span className="text-[10px] text-slate-500 border border-os-border px-1.5 py-0.5 rounded-md">{ruleLabel}</span>
            <span className="text-[10px] text-slate-500 ml-auto">{formatRelative(alert.createdAt)}</span>
          </div>
          <p className="text-sm font-semibold text-white">{alert.title}</p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{alert.description}</p>
        </div>
        <button
          onClick={() => onDismiss(alert.id)}
          className="w-6 h-6 rounded-md flex items-center justify-center text-slate-300 hover:text-slate-300 hover:bg-os-s1 transition-all flex-shrink-0"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {alert.suggestedAction && (
        <div className="flex items-start gap-2 bg-slate-900 border border-os-border rounded-xl px-3 py-2.5 ml-7">
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-slate-300">{alert.suggestedAction}</p>
          {alert.actionType === 'NAVIGATE' && alert.actionPayload?.route && (
            <button
              onClick={handleAction}
              className="ml-auto flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 flex-shrink-0"
            >
              Go <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function AlertsPage() {
  const qc = useQueryClient()
  const [scanning, setScanning] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['proactive-alerts'],
    queryFn: () => api.get('/admin/kangqore-immp/proactive/alerts').then(r => r.data),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  const alerts: ProactiveAlert[] = data?.alerts ?? []

  const dismissMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/proactive/alerts/${id}/dismiss`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['proactive-alerts'] }),
  })

  const dismissAllMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/proactive/alerts/dismiss-all'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['proactive-alerts'] }),
  })

  async function scan() {
    setScanning(true)
    try {
      await api.post('/admin/kangqore-immp/proactive/scan')
      setTimeout(() => { refetch(); qc.invalidateQueries({ queryKey: ['proactive-alerts'] }) }, 3000)
    } finally {
      setScanning(false)
    }
  }

  const bySeverity = {
    CRITICAL: alerts.filter(a => a.severity === 'CRITICAL'),
    HIGH:     alerts.filter(a => a.severity === 'HIGH'),
    MODERATE: alerts.filter(a => a.severity === 'MODERATE'),
    LOW:      alerts.filter(a => a.severity === 'LOW'),
  }

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Proactive Intelligence Alerts</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            7 rules run continuously. KIMMP fires alerts before you notice problems.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => refetch()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-os-s1 hover:text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {alerts.length > 0 && (
            <button
              onClick={() => dismissAllMut.mutate()}
              disabled={dismissAllMut.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-os-s1 text-slate-300 hover:bg-slate-200 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Dismiss All
            </button>
          )}
          <button
            onClick={scan}
            disabled={scanning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {scanning ? <Spinner size="sm" /> : <Play className="w-3.5 h-3.5" />}
            Scan Now
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Critical', count: bySeverity.CRITICAL.length, color: 'text-red-600 bg-red-50' },
          { label: 'High',     count: bySeverity.HIGH.length,     color: 'text-amber-600 bg-amber-50' },
          { label: 'Moderate', count: bySeverity.MODERATE.length, color: 'text-blue-600 bg-blue-50' },
          { label: 'Low',      count: bySeverity.LOW.length,      color: 'text-slate-300 bg-slate-900' },
        ].map(s => (
          <div key={s.label} className="bg-os-s1 border border-os-border rounded-xl p-4 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color.split(' ')[0]}`}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Rule guide */}
      <div className="bg-slate-900 border border-os-border rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
        {Object.entries(RULE_LABELS).map(([k, v]) => (
          <span key={k} className="text-slate-500"><span className="font-semibold text-slate-300">{v}</span></span>
        ))}
      </div>

      {/* Alert feed */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-os-s1 border border-os-border rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
            <CheckCheck className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-sm font-semibold text-slate-300">All clear — no active alerts</p>
          <p className="text-xs text-slate-500 mt-1">KIMMP scans 7 rules automatically. Run a manual scan to check now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Critical first */}
          {(['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).flatMap(sev =>
            bySeverity[sev].map(alert => (
              <AlertCard key={alert.id} alert={alert} onDismiss={id => dismissMut.mutate(id)} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

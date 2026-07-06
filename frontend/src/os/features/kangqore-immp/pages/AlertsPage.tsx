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

const SEV_CONFIG: Record<string, { badge: 'danger' | 'warning' | 'info' | 'neutral'; color: string; icon: string }> = {
  CRITICAL: { badge: 'danger',  color: '#e2445c', icon: 'text-red-500' },
  HIGH:     { badge: 'warning', color: '#fdab3d', icon: 'text-amber-500' },
  MODERATE: { badge: 'info',    color: '#0073ea', icon: 'text-blue-500' },
  LOW:      { badge: 'neutral', color: '#94a3b8', icon: 'text-slate-500' },
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
    <div className={`rounded-[32px] p-6 space-y-4 transition-transform hover:-translate-y-1`} style={{ background: `${sev.color}10`, boxShadow: `0 16px 32px ${sev.color}15` }}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${sev.color}20` }}>
          <AlertTriangle className={`w-5 h-5 ${sev.icon}`} />
        </div>
        <div className="flex-1 min-w-0 mt-0.5">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge variant={sev.badge} size="sm" dot>{alert.severity}</Badge>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${catColor}`}>{alert.category}</span>
            <span className="text-[11px] text-[var(--os-text-2)] bg-[var(--os-surface-0)] px-2 py-0.5 rounded-md">{ruleLabel}</span>
            <span className="text-[11px] font-semibold text-[var(--os-text-2)] ml-auto">{formatRelative(alert.createdAt)}</span>
          </div>
          <p className="text-base font-bold text-[var(--os-text-1)]">{alert.title}</p>
          <p className="text-sm font-semibold text-[var(--os-text-2)] mt-1.5 leading-relaxed">{alert.description}</p>
        </div>
        <button
          onClick={() => onDismiss(alert.id)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)] transition-all flex-shrink-0"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {alert.suggestedAction && (
        <div className="flex items-start gap-3 bg-[var(--os-card)] rounded-2xl p-4 ml-14 shadow-sm">
          <ArrowRight className="w-4 h-4 text-[var(--os-text-2)] flex-shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-[var(--os-text-1)]">{alert.suggestedAction}</p>
          {alert.actionType === 'NAVIGATE' && alert.actionPayload?.route && (
            <button
              onClick={handleAction}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-100 flex-shrink-0 transition-colors"
            >
              Go <ExternalLink className="w-3.5 h-3.5" />
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

  const statTiles = [
    { label: 'Critical', count: bySeverity.CRITICAL.length, accent: '#e2445c' },
    { label: 'High',     count: bySeverity.HIGH.length,     accent: '#fdab3d' },
    { label: 'Moderate', count: bySeverity.MODERATE.length, accent: '#579bfc' },
    { label: 'Low',      count: bySeverity.LOW.length,      accent: '#94a3b8' },
  ]

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3 pb-5 mb-1 border-b border-[var(--os-border)]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Bell className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-[var(--os-text-1)]">Proactive Intelligence Alerts</h2>
          <p className="text-xs text-[var(--os-text-2)]">
            7 rules run continuously. KIMMP fires alerts before you notice problems.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => refetch()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--os-text-2)] bg-[var(--os-surface-0)] border border-[var(--os-border)] hover:text-[var(--os-text-1)] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {alerts.length > 0 && (
            <button
              onClick={() => dismissAllMut.mutate()}
              disabled={dismissAllMut.isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--os-surface-0)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] shadow-sm transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Dismiss All
            </button>
          )}
          <button
            onClick={scan}
            disabled={scanning}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-[12px] font-bold hover:-translate-y-1 transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2564ea 100%)', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}
          >
            {scanning ? <Spinner size="sm" /> : <Play className="w-4 h-4 fill-white" />}
            Scan Now
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {statTiles.map(s => (
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
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <p className="text-3xl font-black tracking-tight leading-none mb-1.5" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {s.count}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.9)' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Rule guide */}
      <div className="p-6" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 16px 32px rgba(0,0,0,0.04)' }}>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-4">Active Rules</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(RULE_LABELS).map(([k, v]) => (
            <span key={k} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[var(--os-surface-0)] text-[var(--os-text-1)]">{v}</span>
          ))}
        </div>
      </div>

      {/* Alert feed */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[var(--os-card)] shadow-[0_32px_64px_rgba(0,0,0,0.04)] text-center" style={{ borderRadius: 'var(--os-radius-xl)' }}>
          <div className="w-16 h-16 rounded-3xl bg-green-50 flex items-center justify-center mb-6">
            <CheckCheck className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-lg font-bold text-[var(--os-text-1)]">All clear — no active alerts</p>
          <p className="text-sm font-semibold text-[var(--os-text-2)] mt-2">KIMMP scans 7 rules automatically. Run a manual scan to check now.</p>
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

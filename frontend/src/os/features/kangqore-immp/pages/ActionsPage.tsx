import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CheckSquare, Check, X, Send, Clock, RefreshCw,
  ArrowRight, Zap, Plus, AlertTriangle, ShieldCheck,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Approval {
  id: string
  action: string
  description: string
  tool?: string
  level: number
  status: 'PENDING' | 'APPROVED' | 'DENIED'
  requestedAt: string
  reviewedAt?: string
  reviewedBy?: string
  input?: { type: string; params?: Record<string, any> }
}

interface ActionHistory {
  id: string
  action: string
  description: string
  tool?: string
  level: number
  status: 'APPROVED' | 'DENIED'
  requestedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

interface ProposedAction {
  actionId?: string
  action: string
  description: string
  tool: string
  level: number
  requiresApproval: boolean
  outcome?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const LEVEL_LABELS: Record<number, string> = {
  0: 'Auto-execute',
  1: 'Notify only',
  2: 'Soft confirm',
  3: 'Hard approve',
  4: 'Board-level',
}

const LEVEL_COLORS: Record<number, string> = {
  0: 'text-[var(--os-text-2)] bg-[var(--os-surface-0)] border-[var(--os-border)]',
  1: 'text-blue-700 bg-blue-50 border-blue-200',
  2: 'text-amber-700 bg-amber-50 border-amber-200',
  3: 'text-orange-700 bg-orange-50 border-orange-200',
  4: 'text-red-700 bg-red-50 border-red-200',
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

// ─── Approval card ────────────────────────────────────────────────────────────

function ApprovalCard({
  approval,
  onApprove,
  onDeny,
  processing,
}: {
  approval: Approval
  onApprove: (id: string) => void
  onDeny: (id: string) => void
  processing: boolean
}) {
  const lvlColor = LEVEL_COLORS[approval.level] ?? LEVEL_COLORS[3]

  return (
    <div className="p-6 space-y-4 overflow-hidden transition-transform hover:-translate-y-1 relative" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 32px 64px rgba(0,0,0,0.04)' }}>
      <div className="absolute top-0 left-0 bottom-0 w-2 bg-amber-400" />
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0 ml-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0 mt-0.5">
          <p className="text-base font-bold text-[var(--os-text-1)]">{approval.action}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className={`text-[11px] font-bold px-2 py-1 rounded-md border ${lvlColor}`}>
              L{approval.level} — {LEVEL_LABELS[approval.level] ?? 'Approval Required'}
            </span>
            {approval.tool && <Badge variant="neutral" size="sm">{approval.tool}</Badge>}
            <span className="text-[11px] font-bold text-[var(--os-text-2)] flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/>{formatRelative(approval.requestedAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onApprove(approval.id)}
            disabled={processing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50 hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #00c875 0%, #10b981 100%)', boxShadow: '0 8px 24px rgba(0,200,117,0.35)' }}
          >
            {processing ? <Spinner size="sm" /> : <Check className="w-4 h-4" />}
            Approve
          </button>
          <button
            onClick={() => onDeny(approval.id)}
            disabled={processing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Deny
          </button>
        </div>
      </div>
      {approval.description && (
        <p className="text-sm font-medium text-[var(--os-text-2)] leading-relaxed ml-16">{approval.description}</p>
      )}
      {approval.action === 'EXTERNAL_API_CALL' && approval.input?.params?.platform && (
        <ExternalApiPreview params={approval.input.params} />
      )}
    </div>
  )
}

const PLATFORM_ICONS: Record<string, string> = {
  slack: '💬', jira: '📋', github: '🐙', salesforce: '☁️',
  hubspot: '🟠', teams: '🔷', linear: '🔺', zendesk: '🎫',
}

function ExternalApiPreview({ params }: { params: Record<string, any> }) {
  const { platform, action, params: p = {} } = params
  const icon = PLATFORM_ICONS[platform] ?? '🔗'
  const displayName = platform.charAt(0).toUpperCase() + platform.slice(1)
  const kvPairs = Object.entries(p).filter(([, v]) => v !== undefined && v !== null && typeof v !== 'object').slice(0, 5)

  return (
    <div className="ml-16 mt-2 rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--os-border)] bg-[var(--os-card)]">
        <span className="text-base">{icon}</span>
        <span className="text-[11px] font-bold text-[var(--os-text-1)]">{displayName}</span>
        <ArrowRight className="w-3 h-3 text-[var(--os-text-2)]" />
        <span className="text-[11px] font-mono text-[#579bfc]">{action}</span>
      </div>
      {kvPairs.length > 0 && (
        <div className="px-3 py-2 space-y-1">
          {kvPairs.map(([k, v]) => (
            <div key={k} className="flex items-start gap-2 text-[11px]">
              <span className="font-semibold text-[var(--os-text-2)] w-24 flex-shrink-0 truncate">{k}</span>
              <span className="text-[var(--os-text-1)] truncate">{String(v)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── History row ──────────────────────────────────────────────────────────────

function HistoryRow({ action }: { action: ActionHistory }) {
  return (
    <div className="flex items-center gap-4 py-4 px-6 border-b border-[var(--os-border)] last:border-0 hover:bg-[var(--os-surface-0)] transition-colors">
      {action.status === 'APPROVED'
        ? <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-green-600" /></div>
        : <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0"><X className="w-4 h-4 text-red-600" /></div>
      }
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[var(--os-text-1)] truncate">{action.action}</p>
        {action.description && (
          <p className="text-[11px] font-semibold text-[var(--os-text-2)] truncate mt-1">{action.description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 text-[11px] font-bold text-[var(--os-text-2)] flex-shrink-0">
        {action.reviewedBy && <span className="bg-[var(--os-surface-0)] px-2 py-1 rounded-md">by {action.reviewedBy.slice(0, 12)}</span>}
        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/>{formatRelative(action.requestedAt)}</span>
        <Badge variant={action.status === 'APPROVED' ? 'success' : 'danger'} size="sm">{action.status}</Badge>
      </div>
    </div>
  )
}

// ─── Propose form ─────────────────────────────────────────────────────────────

function ProposeForm() {
  const [desc,    setDesc]    = useState('')
  const [context, setContext] = useState('')
  const [result,  setResult]  = useState<ProposedAction | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function propose() {
    if (!desc.trim() || loading) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await api.post('/admin/kangqore-immp/actions/propose', {
        description: desc.trim(),
        context: context.trim() || undefined,
      })
      setResult(res.data)
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Proposal failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 shadow-[0_32px_64px_rgba(0,0,0,0.04)] bg-[var(--os-card)] overflow-hidden flex flex-col gap-4" style={{ borderRadius: 'var(--os-radius-xl)' }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Plus className="w-5 h-5 text-slate-600" />
        </div>
        <p className="text-base font-bold text-[var(--os-text-1)]">
          Propose an Action
        </p>
      </div>
      <div className="flex flex-col gap-4 ml-14">
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Describe what you want KIMMP to do — e.g. 'Send a follow-up email to all cold leads from this week'"
          rows={2}
          className="w-full text-sm font-medium border border-[var(--os-border)] bg-[var(--os-surface-0)] rounded-2xl px-4 py-3 outline-none resize-none focus:border-blue-400 text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] transition-colors"
        />
        <div className="flex items-center gap-4">
          <input
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="Context (optional)"
            className="flex-1 text-sm font-medium border border-[var(--os-border)] bg-[var(--os-surface-0)] rounded-xl px-4 py-3 outline-none focus:border-blue-400 text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] transition-colors"
          />
          <button
            onClick={propose}
            disabled={!desc.trim() || loading}
            className="flex items-center justify-center h-[46px] px-6 rounded-full text-white text-sm font-bold hover:-translate-y-1 transition-all disabled:opacity-40 gap-2"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2564ea 100%)', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}
          >
            {loading ? <Spinner size="sm" /> : <Send className="w-4 h-4 text-white" />}
            Propose
          </button>
        </div>
      </div>

      {error && <div className="px-5 py-3 bg-red-50 text-sm font-bold text-red-600 rounded-2xl mx-14">{error}</div>}

      {result && (
        <div className="space-y-4 mx-14 mt-2">
          <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-purple-500" />
            KIMMP Proposed
          </p>
          <div className="bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-3xl p-5 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-base font-bold text-[var(--os-text-1)] leading-tight">{result.action}</p>
                <p className="text-sm font-medium text-[var(--os-text-2)] mt-1.5">{result.description}</p>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex-shrink-0 ${LEVEL_COLORS[result.level] ?? LEVEL_COLORS[3]}`}>
                L{result.level}
              </span>
            </div>
            {result.outcome && (
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-3">
                <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-blue-900 leading-relaxed">{result.outcome}</p>
              </div>
            )}
            <div className="flex items-center gap-3 text-[11px] font-bold text-[var(--os-text-2)]">
              <span className="bg-white border border-[var(--os-border)] px-2 py-1 rounded-md">Tool: <strong className="text-[var(--os-text-1)]">{result.tool}</strong></span>
              {result.requiresApproval && (
                <span className="text-amber-600 flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-md">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Requires approval before execution
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type Tab = 'queue' | 'history'

export function ActionsPage() {
  const [tab,        setTab]        = useState<Tab>('queue')
  const [processing, setProcessing] = useState<string | null>(null)
  const qc = useQueryClient()

  const { data: approvalsData, isLoading: loadingApprovals, refetch: refetchApprovals } = useQuery({
    queryKey: ['approvals'],
    queryFn: () => api.get('/admin/kangqore-immp/authority/approvals').then(r => r.data),
    staleTime: 30_000,
    refetchInterval: 60_000,
    enabled: tab === 'queue',
  })

  const { data: historyData, isLoading: loadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['action-history'],
    queryFn: () => api.get('/admin/kangqore-immp/actions/history', { params: { limit: 30 } }).then(r => r.data),
    staleTime: 60_000,
    enabled: tab === 'history',
  })

  const approvals: Approval[]      = approvalsData?.approvals ?? []
  const history: ActionHistory[]   = historyData?.history     ?? []

  async function approve(id: string) {
    setProcessing(id)
    try {
      await api.post(`/admin/kangqore-immp/authority/approvals/${id}/approve`)
      qc.invalidateQueries({ queryKey: ['approvals'] })
    } finally {
      setProcessing(null)
    }
  }

  async function deny(id: string) {
    setProcessing(id)
    try {
      await api.post(`/admin/kangqore-immp/authority/approvals/${id}/deny`)
      qc.invalidateQueries({ queryKey: ['approvals'] })
    } finally {
      setProcessing(null)
    }
  }

  const isLoading = tab === 'queue' ? loadingApprovals : loadingHistory

  function refresh() {
    if (tab === 'queue') refetchApprovals()
    else                  refetchHistory()
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-4 pb-6 mb-2 border-b border-[var(--os-border)]">
        <div className="w-12 h-12 rounded-[20px] bg-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm">
          <CheckSquare className="w-6 h-6 text-slate-700" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[var(--os-text-1)] tracking-tight">Actions + Approval Queue</h2>
          <p className="text-sm font-semibold text-[var(--os-text-2)] mt-1">
            KIMMP proposes actions from intelligence signals. High-level actions require your approval before execution.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {approvals.length > 0 && (
            <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold">
              {approvals.length} pending
            </span>
          )}
          <button
            onClick={refresh}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--os-text-2)] bg-[var(--os-surface-0)] border border-[var(--os-border)] hover:text-[var(--os-text-1)] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'L3 / L4',  value: approvals.filter(a => a.level >= 3).length, accent: '#e2445c', icon: AlertTriangle },
          { label: 'Pending',   value: approvals.length,                           accent: '#fdab3d', icon: ShieldCheck   },
          { label: 'Approved',  value: history.filter(a => a.status === 'APPROVED').length, accent: '#00c875', icon: Check },
          { label: 'History',   value: history.length,                             accent: '#579bfc', icon: Clock         },
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

      {/* Authority levels legend */}
      <div className="p-6 shadow-sm bg-[var(--os-surface-0)] border border-[var(--os-border)] grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderRadius: 'var(--os-radius-xl)' }}>
        <div className="col-span-1 md:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)]">Authority Levels</p>
        </div>
        {([
          { n: 0, name: LEVEL_LABELS[0], desc: 'Executes immediately, no human needed',         color: '#94a3b8' },
          { n: 1, name: LEVEL_LABELS[1], desc: 'Runs silently, sends a notification only',      color: '#579bfc' },
          { n: 2, name: LEVEL_LABELS[2], desc: 'Soft confirmation — one click to proceed',      color: '#fdab3d' },
          { n: 3, name: LEVEL_LABELS[3], desc: 'Explicit approval required before execution',   color: '#e2445c' },
          { n: 4, name: LEVEL_LABELS[4], desc: 'Board-level sign-off — highest impact actions', color: '#7c3aed' },
        ] as const).map(level => (
          <div key={level.n} className="flex items-center gap-4 bg-[var(--os-card)] p-4 rounded-3xl border border-[var(--os-border)]">
            <span
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black text-white flex-shrink-0 shadow-sm"
              style={{ background: level.color }}
            >
              L{level.n}
            </span>
            <div>
              <p className="text-sm font-bold text-[var(--os-text-1)]">{level.name}</p>
              <p className="text-xs font-semibold text-[var(--os-text-2)] mt-0.5">{level.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Propose form */}
      <ProposeForm />

      {/* Tabs */}
      <div className="flex gap-2 border border-[var(--os-border)] rounded-2xl p-1.5 bg-[var(--os-surface-0)] w-fit">
        {([
          { key: 'queue',   label: `Approval Queue (${approvals.length})`, icon: ShieldCheck },
          { key: 'history', label: 'Action History',                        icon: Clock       },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === t.key
                ? 'bg-[var(--os-card)] shadow-sm text-[var(--os-text-1)]'
                : 'text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-slate-100'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : tab === 'queue' ? (
        approvals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[var(--os-card)] shadow-[0_32px_64px_rgba(0,0,0,0.04)] text-center" style={{ borderRadius: 'var(--os-radius-xl)' }}>
            <div className="w-16 h-16 rounded-3xl bg-green-50 flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-lg font-bold text-[var(--os-text-1)]">No pending approvals</p>
            <p className="text-sm font-semibold text-[var(--os-text-2)] mt-2">KIMMP will surface actions here when they require your sign-off.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {approvals.map(a => (
              <ApprovalCard
                key={a.id}
                approval={a}
                onApprove={approve}
                onDeny={deny}
                processing={processing === a.id}
              />
            ))}
          </div>
        )
      ) : (
        history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[var(--os-card)] shadow-[0_32px_64px_rgba(0,0,0,0.04)] text-center" style={{ borderRadius: 'var(--os-radius-xl)' }}>
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-[var(--os-text-2)]" />
            </div>
            <p className="text-lg font-bold text-[var(--os-text-1)]">No action history yet</p>
            <p className="text-sm font-semibold text-[var(--os-text-2)] mt-2">Past actions will appear here once executed.</p>
          </div>
        ) : (
          <div className="overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.04)] bg-[var(--os-card)]" style={{ borderRadius: 'var(--os-radius-xl)' }}>
            {history.map(a => <HistoryRow key={a.id} action={a} />)}
          </div>
        )
      )}
    </div>
  )
}

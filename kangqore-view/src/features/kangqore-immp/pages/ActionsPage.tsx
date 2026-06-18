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
  0: 'text-slate-300 bg-slate-900 border-os-border',
  1: 'text-blue-600 bg-blue-50 border-blue-200',
  2: 'text-amber-600 bg-amber-50 border-amber-200',
  3: 'text-orange-600 bg-orange-50 border-orange-200',
  4: 'text-red-600 bg-red-50 border-red-200',
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
    <div className="bg-os-s1 border border-os-border rounded-xl shadow-sm p-4 space-y-3 border-l-4 border-l-amber-400">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{approval.action}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${lvlColor}`}>
              L{approval.level} — {LEVEL_LABELS[approval.level] ?? 'Approval Required'}
            </span>
            {approval.tool && <Badge variant="neutral" size="sm">{approval.tool}</Badge>}
            <span className="text-[10px] text-slate-500">{formatRelative(approval.requestedAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onApprove(approval.id)}
            disabled={processing}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {processing ? <Spinner size="sm" /> : <Check className="w-3 h-3" />}
            Approve
          </button>
          <button
            onClick={() => onDeny(approval.id)}
            disabled={processing}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-os-s1 text-red-600 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <X className="w-3 h-3" />
            Deny
          </button>
        </div>
      </div>
      {approval.description && (
        <p className="text-xs text-slate-500 leading-relaxed ml-10">{approval.description}</p>
      )}
    </div>
  )
}

// ─── History row ──────────────────────────────────────────────────────────────

function HistoryRow({ action }: { action: ActionHistory }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 border-b border-os-border last:border-0 hover:bg-slate-900/60 transition-colors">
      {action.status === 'APPROVED'
        ? <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
        : <X     className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
      }
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-200 truncate">{action.action}</p>
        {action.description && (
          <p className="text-[10px] text-slate-500 truncate mt-0.5">{action.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 text-[10px] text-slate-500 flex-shrink-0">
        {action.reviewedBy && <span>by {action.reviewedBy.slice(0, 12)}</span>}
        <span>{formatRelative(action.requestedAt)}</span>
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
    <div className="bg-os-s1 border border-os-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 space-y-3 border-b border-os-border">
        <p className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Plus className="w-4 h-4 text-slate-500" />
          Propose an Action
        </p>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Describe what you want KIMMP to do — e.g. 'Send a follow-up email to all cold leads from this week'"
          rows={2}
          className="w-full text-sm border border-os-border rounded-lg px-3 py-2.5 outline-none resize-none focus:border-blue-300 text-slate-200 placeholder:text-slate-500"
        />
        <div className="flex items-center gap-3">
          <input
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="Context (optional)"
            className="flex-1 text-xs border border-os-border rounded-lg px-3 py-2 outline-none focus:border-blue-300 text-slate-500 placeholder:text-slate-500"
          />
          <button
            onClick={propose}
            disabled={!desc.trim() || loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors disabled:opacity-40"
          >
            {loading ? <Spinner size="sm" /> : <Send className="w-3 h-3" />}
            Propose
          </button>
        </div>
      </div>

      {error && <div className="px-4 py-3 bg-red-50 text-sm text-red-600">{error}</div>}

      {result && (
        <div className="p-4 space-y-3 bg-slate-900">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">KIMMP Proposed</p>
          <div className="bg-os-s1 border border-os-border rounded-xl p-3 space-y-2">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{result.action}</p>
                <p className="text-xs text-slate-500 mt-0.5">{result.description}</p>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border flex-shrink-0 ${LEVEL_COLORS[result.level] ?? LEVEL_COLORS[3]}`}>
                L{result.level}
              </span>
            </div>
            {result.outcome && (
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-2">
                <ArrowRight className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-blue-800">{result.outcome}</p>
              </div>
            )}
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span>Tool: <strong>{result.tool}</strong></span>
              {result.requiresApproval && (
                <span className="text-amber-600 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
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
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center flex-shrink-0 shadow-lg">
          <CheckSquare className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Actions + Approval Queue</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            KIMMP proposes actions from intelligence signals. High-level actions require your approval before execution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {approvals.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
              {approvals.length} pending
            </span>
          )}
          <button
            onClick={refresh}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-os-s1 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Authority levels legend */}
      <div className="grid grid-cols-5 gap-2">
        {[0,1,2,3,4].map(l => (
          <div key={l} className={`text-center p-2 rounded-lg border text-[10px] font-semibold ${LEVEL_COLORS[l]}`}>
            L{l}<br />
            <span className="font-normal opacity-80">{LEVEL_LABELS[l]}</span>
          </div>
        ))}
      </div>

      {/* Propose form */}
      <ProposeForm />

      {/* Tabs */}
      <div className="flex gap-1 border border-os-border rounded-xl p-1 bg-slate-900 w-fit">
        {([
          { key: 'queue',   label: `Approval Queue (${approvals.length})`, icon: ShieldCheck },
          { key: 'history', label: 'Action History',                        icon: Clock       },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.key
                ? 'bg-os-s1 text-white shadow-sm border border-os-border'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : tab === 'queue' ? (
        approvals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-os-s1 border border-os-border rounded-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-sm font-semibold text-slate-300">No pending approvals</p>
            <p className="text-xs text-slate-500 mt-1">KIMMP will surface actions here when they require your sign-off.</p>
          </div>
        ) : (
          <div className="space-y-4">
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
          <div className="flex flex-col items-center justify-center py-16 bg-os-s1 border border-os-border rounded-2xl text-center">
            <Clock className="w-8 h-8 text-slate-200 mb-3" />
            <p className="text-sm text-slate-500">No action history yet.</p>
          </div>
        ) : (
          <div className="bg-os-s1 border border-os-border rounded-xl overflow-hidden shadow-sm">
            {history.map(a => <HistoryRow key={a.id} action={a} />)}
          </div>
        )
      )}
    </div>
  )
}

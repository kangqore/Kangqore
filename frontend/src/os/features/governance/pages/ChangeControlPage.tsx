import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  GitPullRequest, CheckCircle2, XCircle, Clock,
  Search, ThumbsUp, ThumbsDown,
} from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { InlineSelect } from '@components/InlineSelect'
import { EditDrawer } from '@components/EditDrawer'
import { EmptyState } from '@design-system/components/EmptyState'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { StatCard } from '@design-system/components/StatCard'
import { Divider } from '@design-system/components/Divider'
import { api, isDemo } from '@lib/api'
import { useGovernanceStore } from '../store'
import type { ChangeRequest, ChangeStatus, Priority } from '../types'

// ─── constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: ChangeStatus; label: string; variant: 'warning' | 'info' | 'success' | 'danger' | 'neutral' | 'brand' }[] = [
  { value: 'PENDING_APPROVAL', label: 'Pending',     variant: 'warning' },
  { value: 'UNDER_REVIEW',     label: 'Under Review', variant: 'info'   },
  { value: 'APPROVED',         label: 'Approved',    variant: 'success' },
  { value: 'REJECTED',         label: 'Rejected',    variant: 'danger'  },
  { value: 'IMPLEMENTED',      label: 'Implemented', variant: 'brand'   },
  { value: 'DEFERRED',         label: 'Deferred',    variant: 'neutral' },
]

const PRIORITY_V: Record<Priority, 'danger' | 'warning' | 'info' | 'neutral'> = {
  CRITICAL: 'danger', HIGH: 'warning', MEDIUM: 'info', LOW: 'neutral',
}

const STATUS_ICON: Record<ChangeStatus, React.ReactNode> = {
  PENDING_APPROVAL: <Clock        className="w-4 h-4 text-amber-500"   />,
  UNDER_REVIEW:     <Clock        className="w-4 h-4 text-blue-500"    />,
  APPROVED:         <CheckCircle2 className="w-4 h-4 text-green-500"   />,
  REJECTED:         <XCircle      className="w-4 h-4 text-red-500"     />,
  IMPLEMENTED:      <CheckCircle2 className="w-4 h-4 text-purple-500"  />,
  DEFERRED:         <Clock        className="w-4 h-4 text-slate-500"   />,
}

const PIPELINE: ChangeStatus[] = ['PENDING_APPROVAL', 'UNDER_REVIEW', 'APPROVED', 'IMPLEMENTED']
const PIPELINE_LABEL: Record<ChangeStatus, string> = {
  PENDING_APPROVAL: 'Pending', UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved', IMPLEMENTED: 'Implemented',
  REJECTED: 'Rejected', DEFERRED: 'Deferred',
}

const fmtDate = (s?: string) => s ? new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const fmtCost = (n?: number) => n == null ? '—' : n < 0 ? `-₹${Math.abs(n).toLocaleString()}` : `+₹${n.toLocaleString()}`

// ─── status pipeline ──────────────────────────────────────────────────────────

function CRPipeline({ status }: { status: ChangeStatus }) {
  const rejected = status === 'REJECTED'
  const deferred = status === 'DEFERRED'
  const currentIdx = PIPELINE.indexOf(status)

  if (rejected || deferred) {
    return (
      <div className="flex items-center gap-2">
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          rejected ? 'bg-red-100 text-red-700' : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300'
        }`}>
          {PIPELINE_LABEL[status]}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {PIPELINE.map((step, i) => {
        const isActive  = i <= currentIdx
        const isCurrent = i === currentIdx
        return (
          <div key={step} className="flex items-center gap-1.5">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              isActive
                ? isCurrent
                  ? 'bg-os-blue text-white'
                  : 'bg-green-100 text-green-700'
                : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300'
            }`}>
              {PIPELINE_LABEL[step]}
            </span>
            {i < PIPELINE.length - 1 && (
              <div className={`h-px w-4 ${isActive ? 'bg-green-300' : 'bg-slate-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── CR detail drawer ─────────────────────────────────────────────────────────

function CRDetailDrawer({
  cr, onPatch, onClose,
}: {
  cr: ChangeRequest
  onPatch: (id: string, data: Partial<ChangeRequest>) => void
  onClose: () => void
}) {
  const canApprove = cr.status === 'PENDING_APPROVAL' || cr.status === 'UNDER_REVIEW'

  return (
    <EditDrawer
      open onClose={onClose}
      title={cr.title}
      description={[cr.project?.title, cr.client?.name].filter(Boolean).join(' · ')}
      width="lg"
      footer={
        <>
          {canApprove && (
            <>
              <Button variant="secondary" size="sm" leftIcon={<ThumbsDown className="w-3.5 h-3.5" />}
                onClick={() => { onPatch(cr.id, { status: 'REJECTED' }); onClose() }}>
                Reject
              </Button>
              <Button variant="primary" size="sm" leftIcon={<ThumbsUp className="w-3.5 h-3.5" />}
                onClick={() => { onPatch(cr.id, { status: 'APPROVED' }); onClose() }}>
                Approve
              </Button>
            </>
          )}
          {!canApprove && <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>}
        </>
      }
    >
      <div className="space-y-5">
        {/* Pipeline */}
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">Status</p>
          <CRPipeline status={cr.status} />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={PRIORITY_V[cr.priority]} size="sm">{cr.priority}</Badge>
          {cr.decisionType && <Badge variant="neutral" size="sm">{cr.decisionType}</Badge>}
          <span className="text-xs text-slate-500">Requested by {cr.requestedBy}</span>
          <span className="text-xs text-slate-500">· {fmtDate(cr.createdAt)}</span>
        </div>

        <Divider />

        {/* Description */}
        {cr.description && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Description</p>
            <p className="text-sm text-slate-300 leading-relaxed">{cr.description}</p>
          </div>
        )}

        {/* Impact */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Impact</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900 rounded-xl">
              <p className="text-[11px] text-slate-500 mb-0.5">Cost impact</p>
              <p className={`text-sm font-bold ${cr.costImpact != null && cr.costImpact < 0 ? 'text-green-600' : 'text-amber-600'}`}>
                {fmtCost(cr.costImpact)}
              </p>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl">
              <p className="text-[11px] text-slate-500 mb-0.5">Timeline impact</p>
              <p className="text-sm font-bold text-slate-300">{cr.timeImpact ?? '—'}</p>
            </div>
          </div>
          {cr.rejectionImpact && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-[11px] text-amber-600 font-semibold mb-0.5">If rejected</p>
              <p className="text-sm text-amber-700">{cr.rejectionImpact}</p>
            </div>
          )}
        </div>

        {/* Inline status override */}
        <Divider />
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">Override status</p>
          <InlineSelect value={cr.status} options={STATUS_OPTIONS}
            onChange={status => onPatch(cr.id, { status })} size="md" dot />
        </div>
      </div>
    </EditDrawer>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function ChangeControlPage() {
  const { changeRequests, updateChangeRequest } = useGovernanceStore()
  const queryClient = useQueryClient()

  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState<ChangeStatus | 'ALL'>('ALL')
  const [openId,  setOpenId]  = useState<string | null>(null)

  const openCR = changeRequests.find(c => c.id === openId)

  const { mutate: patchCR } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ChangeRequest> }) => {
      if (!isDemo()) await api.patch(`/change-requests/${id}/status`, data)
    },
    onSuccess: (_, { id, data }) => {
      updateChangeRequest(id, data)
      queryClient.invalidateQueries({ queryKey: ['governance', 'changes'] })
    },
  })

  function onPatch(id: string, data: Partial<ChangeRequest>) {
    updateChangeRequest(id, data)
    patchCR({ id, data })
  }

  const visible = changeRequests.filter(c => {
    const matchFilter = filter === 'ALL' || c.status === filter
    const q = search.toLowerCase()
    return matchFilter && (!q || c.title.toLowerCase().includes(q) || (c.project?.title ?? '').toLowerCase().includes(q))
  })

  const byStatus = (s: ChangeStatus) => changeRequests.filter(c => c.status === s).length
  const inFlight = byStatus('PENDING_APPROVAL') + byStatus('UNDER_REVIEW')

  return (
    <div className="space-y-5">
      <KIMMPSignalBar module="Change Control" />

      <div>
        <h2 className="text-xl font-bold text-white">Change Control</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {changeRequests.length} change requests
          {inFlight > 0 && <span className="ml-2 text-amber-600 font-medium">· {inFlight} awaiting decision</span>}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Total"       value={changeRequests.length}     icon={<GitPullRequest className="w-5 h-5" />} iconColor="bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300" />
        <StatCard label="Pending"     value={byStatus('PENDING_APPROVAL')} icon={<Clock className="w-5 h-5" />} iconColor={byStatus('PENDING_APPROVAL') > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300'} />
        <StatCard label="Under Review" value={byStatus('UNDER_REVIEW')} icon={<Clock className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600" />
        <StatCard label="Approved"    value={byStatus('APPROVED')}      icon={<CheckCircle2 className="w-5 h-5" />} iconColor="bg-green-100 text-green-600" />
        <StatCard label="Rejected"    value={byStatus('REJECTED')}      icon={<XCircle className="w-5 h-5" />} iconColor={byStatus('REJECTED') > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300'} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input placeholder="Search change requests…" prefix={<Search className="w-3.5 h-3.5" />}
          className="w-56" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['ALL','PENDING_APPROVAL','UNDER_REVIEW','APPROVED','REJECTED','IMPLEMENTED'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === s ? 'bg-os-blue text-white' : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10 border-t-white/20 text-slate-300 hover:border-blue-300'
              }`}>
              {s === 'ALL' ? 'All' : PIPELINE_LABEL[s] ?? s}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-slate-500">{visible.length} requests</span>
      </div>

      {/* Table */}
      <Card padding="none">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 border-t-white/20 bg-slate-900">
              {['Change Request', 'Project / Client', 'Cost', 'Time', 'Priority', 'Status', 'Requested'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2E2854]">
            {visible.map(c => (
              <tr key={c.id} className="hover:bg-slate-900 transition-colors cursor-pointer group" onClick={() => setOpenId(c.id)}>
                <td className="px-4 py-3.5 max-w-[220px]">
                  <div className="flex items-start gap-2">
                    {STATUS_ICON[c.status]}
                    <p className="text-xs font-medium text-slate-200 leading-snug line-clamp-2">{c.title}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs">
                  <p className="text-slate-300 font-medium">{c.project?.title ?? '—'}</p>
                  {c.client && <p className="text-slate-500">{c.client.name}</p>}
                </td>
                <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                  {c.costImpact != null && (
                    <span className={c.costImpact < 0 ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                      {fmtCost(c.costImpact)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{c.timeImpact ?? '—'}</td>
                <td className="px-4 py-3.5">
                  <Badge variant={PRIORITY_V[c.priority]} size="sm">{c.priority}</Badge>
                </td>
                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                  <InlineSelect value={c.status} options={STATUS_OPTIONS} onChange={status => onPatch(c.id, { status })} dot />
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{fmtDate(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <EmptyState
            icon={<GitPullRequest className="w-6 h-6" />}
            title="No change requests match"
            description="Adjust the status filter or submit a new change request."
          />
        )}
      </Card>

      {openCR && <CRDetailDrawer cr={openCR} onPatch={onPatch} onClose={() => setOpenId(null)} />}
    </div>
  )
}

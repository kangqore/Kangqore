import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CheckCircle2, XCircle, Clock, Pause, Minus,
  Plus, Search, TrendingDown, TrendingUp, DollarSign,
} from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { InlineSelect } from '@components/InlineSelect'
import { EditDrawer } from '@components/EditDrawer'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { Textarea } from '@design-system/components/Textarea'
import { StatCard } from '@design-system/components/StatCard'
import { Divider } from '@design-system/components/Divider'
import { StaggerTableBody, StaggerRow } from '@components/animations/Stagger'
import { EmptyState } from '@design-system/components/EmptyState'
import { api, isDemo } from '@lib/api'
import { useGovernanceStore } from '../store'
import type { Decision, DecisionStatus, Priority } from '../types'

// ─── constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: DecisionStatus; label: string; variant: 'success' | 'danger' | 'warning' | 'info' | 'neutral' }[] = [
  { value: 'PENDING_APPROVAL', label: 'Pending',   variant: 'warning' },
  { value: 'APPROVED',         label: 'Approved',  variant: 'success' },
  { value: 'REJECTED',         label: 'Rejected',  variant: 'danger'  },
  { value: 'DEFERRED',         label: 'Deferred',  variant: 'info'    },
  { value: 'WITHDRAWN',        label: 'Withdrawn', variant: 'neutral' },
]

const PRIORITY_V: Record<Priority, 'danger' | 'warning' | 'info' | 'neutral'> = {
  CRITICAL: 'danger', HIGH: 'warning', MEDIUM: 'info', LOW: 'neutral',
}

const STATUS_ICON: Record<DecisionStatus, React.ReactNode> = {
  PENDING_APPROVAL: <Clock       className="w-4 h-4 text-amber-500"  />,
  APPROVED:         <CheckCircle2 className="w-4 h-4 text-green-500" />,
  REJECTED:         <XCircle     className="w-4 h-4 text-red-500"    />,
  DEFERRED:         <Pause       className="w-4 h-4 text-blue-400"   />,
  WITHDRAWN:        <Minus       className="w-4 h-4 text-slate-500"  />,
}

const fmtDate  = (s?: string) => s ? new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const fmtCost  = (n?: number) => n == null ? '—' : n < 0 ? `-₹${Math.abs(n).toLocaleString()}` : `+₹${n.toLocaleString()}`

// ─── detail drawer ────────────────────────────────────────────────────────────

function DecisionDrawer({
  decision, onPatch, onClose,
}: {
  decision: Decision
  onPatch: (id: string, data: Partial<Decision>) => void
  onClose: () => void
}) {
  return (
    <EditDrawer
      open
      onClose={onClose}
      title={decision.title}
      description={decision.project?.title}
      width="lg"
      footer={<Button variant="secondary" size="sm" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-5">
        {/* Status + priority */}
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Status</p>
            <InlineSelect
              value={decision.status}
              options={STATUS_OPTIONS}
              onChange={status => onPatch(decision.id, { status })}
              size="md" dot
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Priority</p>
            <Badge variant={PRIORITY_V[decision.priority]} size="md">{decision.priority}</Badge>
          </div>
          {decision.dueDate && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">Decision due</p>
              <p className="text-sm font-medium text-slate-300">{fmtDate(decision.dueDate)}</p>
            </div>
          )}
        </div>

        <Divider />

        {/* Description */}
        {decision.description && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Background</p>
            <p className="text-sm text-slate-300 leading-relaxed">{decision.description}</p>
          </div>
        )}

        {/* Rationale */}
        {decision.rationale && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Rationale</p>
            <div className="p-3 bg-green-50 border border-green-100 rounded-xl">
              <p className="text-sm text-slate-300 leading-relaxed">{decision.rationale}</p>
            </div>
          </div>
        )}

        {/* Tradeoffs */}
        {decision.tradeoffs && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Trade-offs</p>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-sm text-slate-300 leading-relaxed">{decision.tradeoffs}</p>
            </div>
          </div>
        )}

        <Divider />

        {/* Impact */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Impact</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-900 rounded-xl text-center">
              <TrendingDown className="w-4 h-4 text-slate-500 mx-auto mb-1" />
              <p className="text-[11px] text-slate-500 mb-0.5">Time</p>
              <p className="text-sm font-bold text-slate-300">{decision.impactTime ?? '—'}</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl text-center">
              <DollarSign className="w-4 h-4 text-slate-500 mx-auto mb-1" />
              <p className="text-[11px] text-slate-500 mb-0.5">Cost</p>
              <p className={`text-sm font-bold ${decision.impactCost != null && decision.impactCost < 0 ? 'text-green-600' : 'text-amber-600'}`}>
                {fmtCost(decision.impactCost)}
              </p>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl text-center">
              <TrendingUp className="w-4 h-4 text-slate-500 mx-auto mb-1" />
              <p className="text-[11px] text-slate-500 mb-0.5">Risk</p>
              <p className="text-sm font-bold text-slate-300">{decision.impactRisk ?? '—'}</p>
            </div>
          </div>
        </div>

        {/* Approver + links */}
        {(decision.approver || decision.client || decision.risk || decision.changeRequest) && (
          <>
            <Divider />
            <div className="grid grid-cols-2 gap-3 text-xs">
              {decision.approver && (
                <div>
                  <p className="text-slate-500 mb-0.5">Approver</p>
                  <p className="font-medium text-slate-300">{decision.approver.name}</p>
                  {decision.approver.authorityRole && <p className="text-slate-500">{decision.approver.authorityRole}</p>}
                </div>
              )}
              {decision.client && (
                <div>
                  <p className="text-slate-500 mb-0.5">Client</p>
                  <p className="font-medium text-slate-300">{decision.client.name}</p>
                </div>
              )}
              {decision.risk && (
                <div>
                  <p className="text-slate-500 mb-0.5">Linked risk</p>
                  <p className="font-medium text-slate-300">{decision.risk.title}</p>
                </div>
              )}
              {decision.changeRequest && (
                <div>
                  <p className="text-slate-500 mb-0.5">Linked CR</p>
                  <p className="font-medium text-slate-300">{decision.changeRequest.title}</p>
                </div>
              )}
            </div>
          </>
        )}
        <div className="text-xs text-slate-500">Logged {fmtDate(decision.createdAt)}</div>
      </div>
    </EditDrawer>
  )
}

// ─── add decision ─────────────────────────────────────────────────────────────

function AddDecisionDrawer({ onAdd, onClose }: { onAdd: (d: Partial<Decision>) => void; onClose: () => void }) {
  const [form, setForm] = useState<{
    title: string; description: string; priority: Priority;
    rationale: string; tradeoffs: string; impactTime: string; impactCost: string; dueDate: string;
  }>({
    title: '', description: '', priority: 'MEDIUM',
    rationale: '', tradeoffs: '', impactTime: '', impactCost: '', dueDate: '',
  })
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <EditDrawer open onClose={onClose} title="Log decision" width="md"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" disabled={!form.title.trim()} onClick={() => onAdd({
            ...form,
            impactCost: form.impactCost ? Number(form.impactCost) : undefined,
            dueDate: form.dueDate || undefined,
            status: 'PENDING_APPROVAL',
          })}>
            Log decision
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Decision title *</label>
          <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="What was decided?" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Background</label>
          <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Context and options evaluated" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Rationale *</label>
          <Textarea value={form.rationale} onChange={e => set('rationale', e.target.value)} rows={3} placeholder="Why this decision was made" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Trade-offs</label>
          <Textarea value={form.tradeoffs} onChange={e => set('tradeoffs', e.target.value)} rows={2} placeholder="What we gave up or accepted" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Priority</label>
            <select value={form.priority} onChange={e => set('priority', e.target.value as Priority)}
              className="w-full border border-white/10 border-t-white/20 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
              {(['LOW','MEDIUM','HIGH','CRITICAL'] as Priority[]).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Decision due</label>
            <Input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Cost impact (₹)</label>
            <Input type="number" value={form.impactCost} onChange={e => set('impactCost', e.target.value)} placeholder="e.g. -5000" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Time impact</label>
            <Input value={form.impactTime} onChange={e => set('impactTime', e.target.value)} placeholder="e.g. +2 weeks" />
          </div>
        </div>
      </div>
    </EditDrawer>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function DecisionLogPage() {
  const { decisions, updateDecision, addDecision } = useGovernanceStore()
  const queryClient = useQueryClient()

  const [search,     setSearch]     = useState('')
  const [filter,     setFilter]     = useState<DecisionStatus | 'ALL'>('ALL')
  const [openId,     setOpenId]     = useState<string | null>(null)
  const [showAdd,    setShowAdd]    = useState(false)

  const openDecision = decisions.find(d => d.id === openId)

  const { mutate: patchDecision } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Decision> }) => {
      if (!isDemo()) await api.patch(`/decisions/${id}/status`, data)
    },
    onSuccess: (_, { id, data }) => {
      updateDecision(id, data)
      queryClient.invalidateQueries({ queryKey: ['governance', 'decisions'] })
    },
  })

  const { mutate: createDecision } = useMutation({
    mutationFn: (data: Partial<Decision>) =>
      (isDemo() ? Promise.resolve({ data: { id: `d${Date.now()}` } }) : api.post('/decisions', data)) as Promise<{ data: { id: string } }>,
    onSuccess: (res, data) => {
      const id = (res as any)?.data?.id ?? `d${Date.now()}`
      addDecision({ ...data, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Decision)
      queryClient.invalidateQueries({ queryKey: ['governance', 'decisions'] })
      setShowAdd(false)
    },
  })

  function onPatch(id: string, data: Partial<Decision>) {
    updateDecision(id, data)
    patchDecision({ id, data })
  }

  const visible = decisions.filter(d => {
    const matchFilter = filter === 'ALL' || d.status === filter
    const q = search.toLowerCase()
    return matchFilter && (!q || d.title.toLowerCase().includes(q) || (d.project?.title ?? '').toLowerCase().includes(q))
  })

  const byStatus = (s: DecisionStatus) => decisions.filter(d => d.status === s).length
  const pending  = byStatus('PENDING_APPROVAL')

  return (
    <div className="space-y-5">
      <KIMMPSignalBar module="Decisions" />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Decision Log</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {decisions.length} decisions logged
            {pending > 0 && <span className="ml-2 text-amber-600 font-medium">· {pending} pending approval</span>}
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>
          Log decision
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Total"    value={decisions.length}     icon={<CheckCircle2 className="w-5 h-5" />} iconColor="bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300" />
        <StatCard label="Pending"  value={pending}              icon={<Clock        className="w-5 h-5" />} iconColor={pending > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300'} />
        <StatCard label="Approved" value={byStatus('APPROVED')} icon={<CheckCircle2 className="w-5 h-5" />} iconColor="bg-green-100 text-green-600" />
        <StatCard label="Rejected" value={byStatus('REJECTED')} icon={<XCircle      className="w-5 h-5" />} iconColor={byStatus('REJECTED') > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300'} />
        <StatCard label="Deferred" value={byStatus('DEFERRED')} icon={<Pause        className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input placeholder="Search decisions…" prefix={<Search className="w-3.5 h-3.5" />}
          className="w-56" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex items-center gap-1.5">
          {(['ALL','PENDING_APPROVAL','APPROVED','REJECTED','DEFERRED'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === s ? 'bg-os-blue text-white' : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10 border-t-white/20 text-slate-300 hover:border-blue-300'
              }`}>
              {s === 'ALL' ? 'All' : s === 'PENDING_APPROVAL' ? 'Pending' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-slate-500">{visible.length} decisions</span>
      </div>

      {/* Table */}
      <Card padding="none">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 border-t-white/20 bg-slate-900">
              {['Decision', 'Project', 'Impact', 'Priority', 'Due', 'Status', 'Logged'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <StaggerTableBody className="divide-y divide-[#2E2854]">
            {visible.map(d => (
              <StaggerRow key={d.id} className="hover:bg-slate-900 transition-colors cursor-pointer group" onClick={() => setOpenId(d.id)}>
                <td className="px-4 py-3.5 max-w-[240px]">
                  <div className="flex items-start gap-2">
                    {STATUS_ICON[d.status]}
                    <p className="text-xs font-medium text-slate-200 leading-snug line-clamp-2">{d.title}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{d.project?.title ?? '—'}</td>
                <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                  {d.impactCost != null && (
                    <span className={d.impactCost < 0 ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                      {fmtCost(d.impactCost)}
                    </span>
                  )}
                  {d.impactTime && <span className="ml-2 text-slate-500">{d.impactTime}</span>}
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={PRIORITY_V[d.priority]} size="sm">{d.priority}</Badge>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{fmtDate(d.dueDate)}</td>
                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                  <InlineSelect value={d.status} options={STATUS_OPTIONS} onChange={status => onPatch(d.id, { status })} dot />
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{fmtDate(d.createdAt)}</td>
              </StaggerRow>
            ))}
          </StaggerTableBody>
        </table>
        {visible.length === 0 && (
          <EmptyState
            icon={<CheckCircle2 className="w-6 h-6" />}
            title="No decisions match"
            description="Try a different status filter."
          />
        )}
      </Card>

      {openDecision && <DecisionDrawer decision={openDecision} onPatch={onPatch} onClose={() => setOpenId(null)} />}
      {showAdd      && <AddDecisionDrawer onAdd={d => createDecision(d)} onClose={() => setShowAdd(false)} />}
    </div>
  )
}

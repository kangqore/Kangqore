import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, GitPullRequest, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { Textarea } from '@design-system/components/Textarea'
import { StatCard } from '@design-system/components/StatCard'
import { Divider } from '@design-system/components/Divider'
import { EditDrawer } from '@components/EditDrawer'
import { api, isDemo } from '@lib/api'
import { useClientChangeRequests } from '../useClientData'

// ─── mock ─────────────────────────────────────────────────────────────────────

const MOCK_CRS = [
  {
    id: 'cr1', title: 'Add offline mode to Patient Portal mobile app',
    description: 'Clinicians in low-connectivity areas need to view patient records offline and sync when reconnected.',
    priority: 'HIGH', status: 'PENDING_APPROVAL',
    costImpact: 12000, timeImpact: '3 weeks',
    requestedBy: 'Dr. Sarah Mitchell', decisionType: 'Scope Change',
    project: { title: 'Patient Portal v2' },
    createdAt: '2026-06-01T10:00:00Z', updatedAt: '2026-06-01T10:00:00Z',
    approvingDecisions: [],
  },
  {
    id: 'cr2', title: 'Integrate with existing Salesforce CRM',
    description: 'We need bi-directional sync between the new Analytics Dashboard and our Salesforce instance for unified reporting.',
    priority: 'MEDIUM', status: 'UNDER_REVIEW',
    costImpact: 8500, timeImpact: '2 weeks',
    requestedBy: 'James Okello', decisionType: 'Integration',
    project: { title: 'Analytics Dashboard' },
    createdAt: '2026-05-25T09:00:00Z', updatedAt: '2026-05-28T11:00:00Z',
    approvingDecisions: [],
  },
  {
    id: 'cr3', title: 'Multi-language support (Arabic + French)',
    description: 'Regulatory requirement for our GCC expansion — patient-facing UI must support Arabic RTL and French.',
    priority: 'HIGH', status: 'APPROVED',
    costImpact: 18000, timeImpact: '5 weeks',
    requestedBy: 'Yasmin Al-Hassan', decisionType: 'Scope Change',
    project: { title: 'Patient Portal v2' },
    createdAt: '2026-05-10T08:00:00Z', updatedAt: '2026-05-20T14:00:00Z',
    approvingDecisions: [{ id: 'd1', title: 'GCC Localisation Approval', status: 'APPROVED' }],
  },
  {
    id: 'cr4', title: 'Remove patient photo upload feature from MVP',
    description: 'Scope reduction request — remove photo upload to reduce HIPAA surface area for MVP. Add back in Phase 2.',
    priority: 'LOW', status: 'APPROVED',
    costImpact: -5000, timeImpact: '-1 week',
    requestedBy: 'Sarah Mitchell', decisionType: 'Scope Reduction',
    project: { title: 'HIPAA Compliance Layer' },
    createdAt: '2026-05-05T10:00:00Z', updatedAt: '2026-05-12T09:00:00Z',
    approvingDecisions: [],
  },
  {
    id: 'cr5', title: 'Add real-time P&L feed from Bloomberg',
    description: 'Connect the financial dashboard to live Bloomberg data via their terminal API.',
    priority: 'HIGH', status: 'REJECTED',
    costImpact: 25000, timeImpact: '6 weeks',
    requestedBy: 'Tom Chen', decisionType: 'Integration',
    project: { title: 'Analytics Dashboard' },
    createdAt: '2026-04-28T14:00:00Z', updatedAt: '2026-05-03T10:00:00Z',
    approvingDecisions: [],
  },
]

type CR = typeof MOCK_CRS[0]

// ─── helpers ──────────────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<string, 'warning' | 'info' | 'success' | 'danger' | 'neutral'> = {
  PENDING_APPROVAL: 'warning', UNDER_REVIEW: 'info', APPROVED: 'success', REJECTED: 'danger',
}
const STATUS_LABEL: Record<string, string> = {
  PENDING_APPROVAL: 'Pending', UNDER_REVIEW: 'Under Review', APPROVED: 'Approved', REJECTED: 'Rejected',
}
const STATUS_ICON: Record<string, React.ReactNode> = {
  PENDING_APPROVAL: <Clock       className="w-4 h-4 text-amber-500" />,
  UNDER_REVIEW:     <Clock       className="w-4 h-4 text-blue-500"  />,
  APPROVED:         <CheckCircle2 className="w-4 h-4 text-green-500"/>,
  REJECTED:         <XCircle     className="w-4 h-4 text-red-500"   />,
}

const fmtDate     = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const fmtCost     = (n: number) => n < 0 ? `-£${Math.abs(n).toLocaleString()}` : `+£${n.toLocaleString()}`
const PRIORITY_V: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  HIGH: 'danger', MEDIUM: 'warning', LOW: 'neutral',
}

// ─── status timeline ──────────────────────────────────────────────────────────

const TIMELINE_STEPS = ['PENDING_APPROVAL', 'UNDER_REVIEW', 'APPROVED']

function StatusTimeline({ status }: { status: string }) {
  const rejected = status === 'REJECTED'
  const currentIdx = TIMELINE_STEPS.indexOf(status)

  return (
    <div className="flex items-center gap-2">
      {TIMELINE_STEPS.map((step, i) => {
        const isActive   = !rejected && i <= currentIdx
        const isCurrent  = !rejected && i === currentIdx
        return (
          <div key={step} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              isActive
                ? isCurrent
                  ? 'bg-[#2564ea] text-white'
                  : 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-400'
            }`}>
              {STATUS_LABEL[step]}
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div className={`h-px w-6 ${isActive ? 'bg-green-300' : 'bg-slate-200'}`} />
            )}
          </div>
        )
      })}
      {rejected && (
        <div className="ml-2 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-semibold">Rejected</div>
      )}
    </div>
  )
}

// ─── CR detail ────────────────────────────────────────────────────────────────

function CRDetail({ cr, onClose }: { cr: CR; onClose: () => void }) {
  return (
    <EditDrawer open onClose={onClose} title={cr.title} description={cr.project?.title} width="lg"
      footer={<Button variant="secondary" size="sm" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-5">
        <StatusTimeline status={cr.status} />
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={PRIORITY_V[cr.priority]} size="sm">{cr.priority}</Badge>
          <Badge variant="neutral" size="sm">{cr.decisionType}</Badge>
          <span className="text-xs text-slate-400">Submitted {fmtDate(cr.createdAt)}</span>
        </div>
        <Divider />
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Description</p>
          <p className="text-sm text-slate-700 leading-relaxed">{cr.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Cost impact</p>
            <p className={`text-sm font-bold ${cr.costImpact < 0 ? 'text-green-600' : 'text-amber-600'}`}>
              {fmtCost(cr.costImpact)}
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Time impact</p>
            <p className="text-sm font-bold text-slate-700">{cr.timeImpact}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-400">Requested by: <span className="text-slate-700 font-medium">{cr.requestedBy}</span></p>
        </div>
        {cr.approvingDecisions?.length > 0 && (
          <>
            <Divider />
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Linked decisions</p>
              {cr.approvingDecisions.map((d: any) => (
                <div key={d.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                  <span className="text-sm text-slate-700">{d.title}</span>
                  <Badge variant="success" size="sm">{d.status}</Badge>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </EditDrawer>
  )
}

// ─── submit CR ────────────────────────────────────────────────────────────────

function SubmitCRDrawer({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    title: '', description: '', priority: 'MEDIUM',
    costImpact: '', timeImpact: '',
  })
  const queryClient = useQueryClient()
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const { mutate, isPending } = useMutation({
    mutationFn: () => isDemo() ? Promise.resolve() : api.post('/change-requests', {
      ...form,
      costImpact: form.costImpact ? Number(form.costImpact) : null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'change-requests'] })
      onClose()
    },
  })

  return (
    <EditDrawer open onClose={onClose} title="Submit change request" width="md"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" disabled={!form.title.trim() || isPending} onClick={() => mutate()}>
            Submit
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Change title *</label>
          <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Brief title for the change" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description *</label>
          <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="What change is needed and why?" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Priority</label>
            <select value={form.priority} onChange={e => set('priority', e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Cost impact (£)</label>
            <Input type="number" value={form.costImpact} onChange={e => set('costImpact', e.target.value)} placeholder="e.g. 5000" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Time impact</label>
          <Input value={form.timeImpact} onChange={e => set('timeImpact', e.target.value)} placeholder="e.g. 2 weeks" />
        </div>
      </div>
    </EditDrawer>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function ClientChangeRequests() {
  const { data }  = useClientChangeRequests()
  const crs: CR[] = (data as any)?.length ? data as CR[] : MOCK_CRS

  const [openId,    setOpenId]    = useState<string | null>(null)
  const [showForm,  setShowForm]  = useState(false)
  const [filter,    setFilter]    = useState('ALL')

  const openCR = crs.find(c => c.id === openId)
  const visible = filter === 'ALL' ? crs : crs.filter(c => c.status === filter)

  const pending  = crs.filter(c => c.status === 'PENDING_APPROVAL' || c.status === 'UNDER_REVIEW').length
  const approved = crs.filter(c => c.status === 'APPROVED').length
  const rejected = crs.filter(c => c.status === 'REJECTED').length

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Change Requests</h2>
          <p className="text-sm text-slate-500 mt-0.5">{crs.length} total · {pending} in review</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
          Submit change
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="In Review" value={pending}  icon={<Clock        className="w-5 h-5" />} iconColor={pending > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'} />
        <StatCard label="Approved"  value={approved} icon={<CheckCircle2 className="w-5 h-5" />} iconColor="bg-green-100 text-green-600" />
        <StatCard label="Rejected"  value={rejected} icon={<XCircle      className="w-5 h-5" />} iconColor={rejected > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'} />
      </div>

      <div className="flex items-center gap-2">
        {['ALL', 'PENDING_APPROVAL', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filter === s ? 'bg-[#2564ea] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
            }`}
          >
            {s === 'ALL' ? 'All' : STATUS_LABEL[s] ?? s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map(cr => (
          <Card key={cr.id} className="cursor-pointer hover:shadow-md transition-all duration-200 group" onClick={() => setOpenId(cr.id)}>
            <div className="flex items-start gap-3">
              {STATUS_ICON[cr.status]}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{cr.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{cr.description}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <Badge variant={STATUS_VARIANT[cr.status]} size="sm">{STATUS_LABEL[cr.status]}</Badge>
                  <Badge variant={PRIORITY_V[cr.priority]} size="sm">{cr.priority}</Badge>
                  {cr.project && <span className="text-[11px] text-slate-400">{cr.project.title}</span>}
                  <span className="text-[11px] text-slate-400">
                    {cr.costImpact !== 0 && <span className={cr.costImpact < 0 ? 'text-green-600' : 'text-amber-600'}>{fmtCost(cr.costImpact)} · </span>}
                    {cr.timeImpact}
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 whitespace-nowrap flex-shrink-0">{fmtDate(cr.createdAt)}</span>
            </div>
          </Card>
        ))}
        {visible.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-400">No change requests match this filter.</div>
        )}
      </div>

      {openCR   && <CRDetail cr={openCR} onClose={() => setOpenId(null)} />}
      {showForm && <SubmitCRDrawer onClose={() => setShowForm(false)} />}
    </div>
  )
}

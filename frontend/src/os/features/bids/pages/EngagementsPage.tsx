import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, ArrowUpRight, Building2, Calendar, X, Loader2, Unlock } from 'lucide-react'
import { api } from '@lib/api'
import { cn } from '@design-system/cn'
import { useUIStore } from '@store/ui'
import { usePageViews } from '@hooks/usePageViews'

const INDUSTRIES = [
  'Manufacturing', 'Education', 'Healthcare', 'Financial Services',
  'Retail & Commerce', 'SaaS & Technology', 'Government', 'Startup', 'Enterprise', 'Non-Profit',
]

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  DRAFT:               { label: 'Draft',              color: 'var(--os-text-2)' },
  INTAKE_IN_PROGRESS:  { label: 'Intake In Progress', color: '#fdab3d' },
  WAANDA_PROCESSING:   { label: 'WAANDA Processing',  color: '#7c3aed' },
  WAANDA_DRAFT:        { label: 'Ready for Review',   color: '#579bfc' },
  CONSULTANT_REVIEW:   { label: 'In Review',          color: '#fdab3d' },
  ACTIVE:              { label: 'Published',          color: '#00c875' },
  PAUSED:              { label: 'Paused',             color: '#fdab3d' },
  COMPLETED:           { label: 'Completed',          color: '#579bfc' },
}

function useEngagements() {
  return useQuery({
    queryKey: ['bids-engagements'],
    queryFn:  () => api.get('/admin/bids/engagements').then(r => r.data),
    staleTime: 30_000,
  })
}

function NewEngagementModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ clientName: '', industry: INDUSTRIES[0], leadConsultant: '', notes: '' })

  const create = useMutation({
    mutationFn: (body: typeof form) => api.post('/admin/bids/engagements', body).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bids-engagements'] }); onClose() },
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--os-border)]">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>New BIDS™ Engagement</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-3)' }}>Create a new diagnostic engagement</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-2xl flex items-center justify-center transition-colors hover:bg-[var(--os-surface-0)]"
            style={{ color: 'var(--os-text-3)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {[
            { key: 'clientName' as const, label: 'Client Name *', placeholder: 'e.g. Tata Steel Ltd', type: 'input' },
            { key: 'leadConsultant' as const, label: 'Lead Consultant', placeholder: 'e.g. C.O.D.E.', type: 'input' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--os-text-2)' }}>{label}</label>
              <input
                value={form[key]}
                onChange={set(key)}
                placeholder={placeholder}
                className="w-full rounded-2xl px-4 py-2.5 text-sm focus:outline-none"
                style={{
                  background: 'var(--os-surface-0)',
                  border: '1px solid var(--os-border)',
                  color: 'var(--os-text-1)',
                }}
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--os-text-2)' }}>Industry Edition *</label>
            <select
              value={form.industry}
              onChange={set('industry')}
              className="w-full rounded-2xl px-4 py-2.5 text-sm focus:outline-none"
              style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-1)' }}
            >
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--os-text-2)' }}>Notes</label>
            <textarea
              value={form.notes}
              onChange={set('notes')}
              rows={3}
              placeholder="Initial context, scope notes..."
              className="w-full rounded-2xl px-4 py-2.5 text-sm focus:outline-none resize-none"
              style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-1)' }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-t border-[var(--os-border)]">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl text-sm font-medium transition-colors hover:bg-[var(--os-surface-0)]"
            style={{ border: '1px solid var(--os-border)', color: 'var(--os-text-2)' }}
          >
            Cancel
          </button>
          <button
            onClick={() => create.mutate(form)}
            disabled={!form.clientName || create.isPending}
            className="flex-1 py-2.5 rounded-2xl text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: '#579bfc' }}
          >
            {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {create.isPending ? 'Creating...' : 'Create Engagement'}
          </button>
        </div>
      </div>
    </div>
  )
}

const STATUS_REVIEW = ['WAANDA_DRAFT', 'CONSULTANT_REVIEW']

function useActivateClient(engagementId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.post(`/admin/bids/engagements/${engagementId}/activate-client`).then(r => r.data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['bids-engagements'] }),
  })
}

export function EngagementsPage() {
  usePageViews(['list', 'board'])
  const viewMode = useUIStore(s => s.viewMode)
  const [showNew, setShowNew] = useState(false)
  const navigate = useNavigate()
  const { data, isLoading } = useEngagements()
  const engagements: any[] = data?.engagements ?? []
  const stats = data?.stats ?? {}

  return (
    <div className="space-y-6">
      {showNew && <NewEngagementModal onClose={() => setShowNew(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Diagnostic Engagements</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--os-text-2)' }}>Active and completed BIDS™ diagnostic engagements</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: '#579bfc' }}
        >
          <Plus className="w-4 h-4" />
          New Engagement
        </button>
      </div>

      {/* Stats */}
      {stats.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['ACTIVE', 'DRAFT', 'PAUSED', 'COMPLETED'] as const).map(s => {
            const m = STATUS_MAP[s]
            return (
              <div key={s} className="os-card px-4 py-3">
                <p className="text-lg font-black tabular-nums" style={{ color: m.color }}>{stats.byStatus?.[s] ?? 0}</p>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--os-text-2)' }}>{m.label}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--os-text-3)' }} />
        </div>
      ) : engagements.length === 0 ? (
        <div className="os-card p-16 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: '#579bfc18', border: '1px solid #579bfc30' }}>
            <Building2 className="w-7 h-7" style={{ color: '#579bfc' }} />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--os-text-1)' }}>No engagements yet</p>
            <p className="text-xs mt-1.5 max-w-xs" style={{ color: 'var(--os-text-3)' }}>
              Create your first BIDS™ diagnostic engagement to start tracking client diagnostics.
            </p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ background: '#579bfc' }}
          >
            <Plus className="w-4 h-4" />
            Create First Engagement
          </button>
        </div>
      ) : viewMode === 'board' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {engagements.map((e: any) => {
            const m = STATUS_MAP[e.status] ?? { label: e.status, color: 'var(--os-text-2)' }
            const isSelfServe = e.status === 'DRAFT' && (e.intakeData as any)?.source === 'self-serve' && !e.clientUserId
            return (
              <div
                key={e.id}
                onClick={() => navigate(`/kangqore-view/admin/bids/engagements/${e.id}`)}
                className="os-card flex flex-col gap-3 p-4 cursor-pointer hover:shadow-md transition-shadow group"
              >
                <div className="h-1.5 rounded-full -mx-4 -mt-4 mb-1" style={{ background: m.color }} />
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#579bfc18', border: '1px solid #579bfc30' }}>
                    <Building2 className="w-4 h-4" style={{ color: '#579bfc' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--os-text-1)' }}>{e.clientName}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--os-text-3)' }}>{e.industry} Edition</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0"
                    style={{ background: m.color + '18', color: m.color, border: `1px solid ${m.color}30` }}>
                    {m.label}
                  </span>
                </div>
                <DeliverableProgress deliverables={e.deliverables} />
                <div className="flex items-center justify-between pt-1">
                  {e.startedAt ? (
                    <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--os-text-3)' }}>
                      <Calendar className="w-3 h-3" />
                      {new Date(e.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  ) : <span />}
                  {isSelfServe
                    ? <ActivateButton engagementId={e.id} onClick={(ev) => ev.stopPropagation()} />
                    : <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: 'var(--os-text-3)' }} />
                  }
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="os-card overflow-hidden">
          {engagements.map((e: any, idx: number) => {
            const m = STATUS_MAP[e.status] ?? { label: e.status, color: 'var(--os-text-2)' }
            const isReviewable = STATUS_REVIEW.includes(e.status) || e.status === 'ACTIVE' || e.status === 'COMPLETED'
            const isSelfServe  = e.status === 'DRAFT' && (e.intakeData as any)?.source === 'self-serve' && !e.clientUserId
            return (
              <div
                key={e.id}
                onClick={() => navigate(`/kangqore-view/admin/bids/engagements/${e.id}`)}
                className={cn(
                  'flex items-center gap-5 px-5 py-4 hover:bg-[var(--os-surface-0)] transition-colors group cursor-pointer',
                  idx < engagements.length - 1 ? 'border-b border-[var(--os-border)]' : ''
                )}
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#579bfc18', border: '1px solid #579bfc30' }}>
                  <Building2 className="w-5 h-5" style={{ color: '#579bfc' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--os-text-1)' }}>{e.clientName}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-3)' }}>
                    {e.industry} Edition{e.leadConsultant ? ` · ${e.leadConsultant}` : ''}
                    {isSelfServe ? ' · Self-serve request' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  {e.startedAt && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--os-text-3)' }}>
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(e.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                  <DeliverableProgress deliverables={e.deliverables} />
                  {isSelfServe && <ActivateButton engagementId={e.id} onClick={(ev) => ev.stopPropagation()} />}
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                    style={{ background: m.color + '18', color: m.color, border: `1px solid ${m.color}30` }}>
                    {m.label}
                  </span>
                  {isReviewable && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: '#579bfc18', color: '#579bfc' }}>
                      Open →
                    </span>
                  )}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--os-text-3)' }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ActivateButton({ engagementId, onClick }: { engagementId: string; onClick: (e: React.MouseEvent) => void }) {
  const activate = useActivateClient(engagementId)
  const handle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Activate client portal? This will create the client account and send them a login email.')) return
    activate.mutate()
    onClick(e)
  }
  if (activate.isSuccess) {
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: '#00c87518', color: '#00c875' }}>
        Activated ✓
      </span>
    )
  }
  return (
    <button
      onClick={handle}
      disabled={activate.isPending}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[11px] font-bold transition-colors hover:opacity-80"
      style={{ background: '#2564ea18', color: '#2564ea', border: '1px solid #2564ea30' }}
    >
      {activate.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unlock className="w-3 h-3" />}
      {activate.isPending ? 'Activating…' : 'Activate Portal'}
    </button>
  )
}

function DeliverableProgress({ deliverables }: { deliverables: any[] }) {
  if (!deliverables?.length) return null
  const done = deliverables.filter(d => d.status === 'COMPLETE').length
  const pct  = Math.round((done / deliverables.length) * 100)
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--os-surface-0)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#579bfc' }} />
      </div>
      <span style={{ color: 'var(--os-text-3)' }}>{done}/{deliverables.length}</span>
    </div>
  )
}

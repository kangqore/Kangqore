import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, ArrowUpRight, Building2, Calendar, X, Loader2 } from 'lucide-react'
import { api } from '@lib/api'
import { cn } from '@design-system/cn'

const INDUSTRIES = [
  'Manufacturing', 'Education', 'Healthcare', 'Financial Services',
  'Retail & Commerce', 'SaaS & Technology', 'Government', 'Startup', 'Enterprise', 'Non-Profit',
]

const STATUS_STYLE: Record<string, string> = {
  ACTIVE:    'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
  COMPLETED: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
  PAUSED:    'bg-amber-500/10 border-amber-500/20 text-amber-300',
  DRAFT:     'bg-white/5 border-white/10 text-slate-400',
}

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'Active', COMPLETED: 'Completed', PAUSED: 'Paused', DRAFT: 'Draft',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">New BIDS™ Engagement</h3>
            <p className="text-xs text-slate-400 mt-0.5">Create a new diagnostic engagement</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Client Name *</label>
            <input
              value={form.clientName}
              onChange={set('clientName')}
              placeholder="e.g. Tata Steel Ltd"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-os-blue/50 focus:ring-1 focus:ring-os-blue/30"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Industry Edition *</label>
            <select
              value={form.industry}
              onChange={set('industry')}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-os-blue/50 focus:ring-1 focus:ring-os-blue/30"
            >
              {INDUSTRIES.map(i => <option key={i} value={i} className="bg-slate-900">{i}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Lead Consultant</label>
            <input
              value={form.leadConsultant}
              onChange={set('leadConsultant')}
              placeholder="e.g. Mahesh Kumar"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-os-blue/50 focus:ring-1 focus:ring-os-blue/30"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Notes</label>
            <textarea
              value={form.notes}
              onChange={set('notes')}
              rows={3}
              placeholder="Initial context, scope notes..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-os-blue/50 focus:ring-1 focus:ring-os-blue/30 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => create.mutate(form)}
            disabled={!form.clientName || create.isPending}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-os-blue to-os-cyan text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {create.isPending ? 'Creating...' : 'Create Engagement'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function EngagementsPage() {
  const [showNew, setShowNew] = useState(false)
  const { data, isLoading } = useEngagements()
  const engagements: any[] = data?.engagements ?? []
  const stats = data?.stats ?? {}

  return (
    <div className="space-y-6">
      {showNew && <NewEngagementModal onClose={() => setShowNew(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Diagnostic Engagements</h2>
          <p className="text-sm text-slate-400 mt-0.5">Active and completed BIDS™ diagnostic engagements</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-os-blue to-os-cyan text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Engagement
        </button>
      </div>

      {/* Stats */}
      {stats.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['ACTIVE', 'DRAFT', 'PAUSED', 'COMPLETED'] as const).map(s => (
            <div key={s} className={cn('rounded-xl border px-4 py-3', STATUS_STYLE[s])}>
              <p className="text-lg font-bold">{stats.byStatus?.[s] ?? 0}</p>
              <p className="text-[11px] font-medium mt-0.5 opacity-80">{STATUS_LABEL[s]}</p>
            </div>
          ))}
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
        </div>
      ) : engagements.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-16 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-os-blue/10 border border-os-blue/20 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-os-cyan" />
          </div>
          <div>
            <p className="text-slate-200 font-semibold text-sm">No engagements yet</p>
            <p className="text-slate-500 text-xs mt-1.5 max-w-xs">
              Create your first BIDS™ diagnostic engagement to start tracking client diagnostics.
            </p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-os-blue to-os-cyan text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create First Engagement
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {engagements.map((e: any) => (
            <div
              key={e.id}
              className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 flex items-center gap-5 hover:bg-white/[0.07] transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-os-blue/10 border border-os-blue/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-os-cyan" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">{e.clientName}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {e.industry} Edition{e.leadConsultant ? ` · ${e.leadConsultant}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                {e.startedAt && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(e.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                )}
                <DeliverableProgress deliverables={e.deliverables} />
                <span className={cn('px-2.5 py-1 rounded-full border text-[11px] font-semibold', STATUS_STYLE[e.status])}>
                  {STATUS_LABEL[e.status]}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DeliverableProgress({ deliverables }: { deliverables: any[] }) {
  if (!deliverables?.length) return null
  const done = deliverables.filter(d => d.status === 'COMPLETE').length
  const pct  = Math.round((done / deliverables.length) * 100)
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-os-cyan" style={{ width: `${pct}%` }} />
      </div>
      <span>{done}/{deliverables.length}</span>
    </div>
  )
}

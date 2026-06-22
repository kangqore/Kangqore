import { useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, GitMerge, Search, Plus, BookOpen } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Avatar } from '@design-system/components/Avatar'
import { Input } from '@design-system/components/Input'
import { InlineSelect } from '@components/InlineSelect'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { useClientsStore } from '../store'
import type { GovernanceType, GovernanceStatus } from '../types'

const GOV_STATUS_OPTIONS = [
  { value: 'open',     label: 'Open',     variant: 'warning' as const },
  { value: 'pending',  label: 'Pending',  variant: 'neutral' as const },
  { value: 'approved', label: 'Approved', variant: 'success' as const },
  { value: 'closed',   label: 'Closed',   variant: 'info'    as const },
  { value: 'rejected', label: 'Rejected', variant: 'danger'  as const },
]
const GOV_PRIORITY_OPTIONS = [
  { value: 'critical', label: 'Critical', variant: 'danger'  as const },
  { value: 'high',     label: 'High',     variant: 'warning' as const },
  { value: 'medium',   label: 'Medium',   variant: 'neutral' as const },
  { value: 'low',      label: 'Low',      variant: 'neutral' as const },
]

const TYPE_ICON: Record<GovernanceType, React.ElementType> = {
  decision:        CheckCircle,
  'change-request':GitMerge,
  steering:        Clock,
  escalation:      AlertTriangle,
}
const TYPE_COLOR: Record<GovernanceType, string> = {
  decision:        'bg-os-blue/10 text-os-blue',
  'change-request':'bg-amber-100 text-amber-600',
  steering:        'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300',
  escalation:      'bg-red-100 text-red-600',
}
const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }
const inputClass = 'w-full rounded-lg px-3 py-2 text-[13px] text-slate-200 placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40'

function AddGovernanceModal({ clients, onClose }: { clients: { id: string; name: string }[]; onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ clientId: '', type: 'decision', title: '', description: '', status: 'open', owner: '', priority: 'medium', date: new Date().toISOString().slice(0, 10) })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }))
  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post('/admin/crm/governance', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin','crm','governance'] }); onClose() },
  })
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative z-10 w-full max-w-[440px] rounded-2xl p-5 flex flex-col gap-3"
        style={{ background: 'rgba(10,13,24,0.98)', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 32px 64px rgba(0,0,0,0.7)' }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[14px] font-bold text-slate-100">Add Governance Item</h3>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-300 text-lg leading-none">×</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Client *</label>
            <select required value={form.clientId} onChange={set('clientId')} className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}>
              <option value="">Select…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Type</label>
            <select value={form.type} onChange={set('type')} className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}>
              <option value="decision">Decision</option>
              <option value="change-request">Change Request</option>
              <option value="steering">Steering</option>
              <option value="escalation">Escalation</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Title *</label>
          <input value={form.title} onChange={set('title')} placeholder="e.g. Scope change for Phase 2" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Description</label>
          <textarea value={form.description} onChange={set('description')} rows={2} placeholder="Details, impact, context…" className={`${inputClass} resize-none`} style={inputStyle} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Status</label>
            <select value={form.status} onChange={set('status')} className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}>
              {['open','pending','approved','closed','rejected'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Priority</label>
            <select value={form.priority} onChange={set('priority')} className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}>
              {['critical','high','medium','low'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Date</label>
            <input type="date" value={form.date} onChange={set('date')} className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }} />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Owner</label>
          <input value={form.owner} onChange={set('owner')} placeholder="e.g. Mahesh Kumar" className={inputClass} style={inputStyle} />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="px-3 py-1.5 text-[13px] text-slate-500 hover:text-slate-300">Cancel</button>
          <button onClick={() => mutate()} disabled={isPending || !form.clientId || !form.title}
            className="px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #2564ea, #0ea5e9)' }}>
            {isPending ? 'Saving…' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function GovernancePage() {
  const { clients, governance, updateGovernance } = useClientsStore()

  function patchGovernance(id: string, patch: Parameters<typeof updateGovernance>[1]) {
    updateGovernance(id, patch)
    api.patch(`/admin/crm/governance/${id}`, patch)
  }
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setType]     = useState<GovernanceType | 'all'>('all')
  const [statusFilter, setStatus] = useState<GovernanceStatus | 'all'>('all')
  const [clientFilter, setClient] = useState('all')

  const visible = governance.filter(g =>
    (typeFilter === 'all'   || g.type === typeFilter) &&
    (statusFilter === 'all' || g.status === statusFilter) &&
    (clientFilter === 'all' || g.clientId === clientFilter) &&
    g.title.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    const p = { critical: 0, high: 1, medium: 2, low: 3 }
    return p[a.priority] - p[b.priority] || b.date.localeCompare(a.date)
  })

  const open      = governance.filter(g => g.status === 'open').length

  const pending   = governance.filter(g => g.status === 'pending').length
  const critical  = governance.filter(g => g.priority === 'critical' && (g.status === 'open' || g.status === 'pending')).length

  return (
    <div className="space-y-6">
      {showAdd && <AddGovernanceModal clients={clients} onClose={() => setShowAdd(false)} />}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Governance</h2>
          <p className="text-sm text-slate-500 mt-0.5">{governance.length} items · decisions, changes, steering, escalations</p>
        </div>
        <div className="flex items-center gap-2">
          {critical > 0 && <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200"><AlertTriangle className="w-3.5 h-3.5"/>{critical} critical open</span>}
          {governance.length > 0 && <>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">{open} open</span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 border border-white/10 border-t-white/20">{pending} pending</span>
          </>}
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-white text-[13px] font-semibold"
            style={{ background: 'linear-gradient(135deg, #2564ea, #0ea5e9)' }}>
            <Plus className="w-3.5 h-3.5" /> Add Item
          </button>
        </div>
      </div>

      {governance.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <BookOpen className="w-10 h-10 text-slate-800" />
          <p className="text-sm font-semibold text-slate-600">No governance items yet</p>
          <p className="text-xs text-slate-700 max-w-xs">Track decisions, change requests, steering discussions, and escalations across all client engagements.</p>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 h-8 px-4 rounded-lg text-white text-[13px] font-semibold mt-2"
            style={{ background: 'linear-gradient(135deg, #2564ea, #0ea5e9)' }}>
            <Plus className="w-3.5 h-3.5" /> Add first item
          </button>
        </div>
      )}

      {governance.length > 0 && <>
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input placeholder="Search…" prefix={<Search className="w-3.5 h-3.5"/>} className="w-52" value={search} onChange={e => setSearch(e.target.value)} />
        <select value={typeFilter} onChange={e => setType(e.target.value as GovernanceType | 'all')}
          className="h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-slate-300 pl-3 pr-8 outline-none focus:border-os-blue focus:ring-2 focus:ring-os-blue/20">
          <option value="all">All Types</option>
          <option value="decision">Decisions</option>
          <option value="change-request">Change Requests</option>
          <option value="steering">Steering</option>
          <option value="escalation">Escalations</option>
        </select>
        <select value={statusFilter} onChange={e => setStatus(e.target.value as GovernanceStatus | 'all')}
          className="h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-slate-300 pl-3 pr-8 outline-none focus:border-os-blue focus:ring-2 focus:ring-os-blue/20">
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="closed">Closed</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={clientFilter} onChange={e => setClient(e.target.value)}
          className="h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-slate-300 pl-3 pr-8 outline-none focus:border-os-blue focus:ring-2 focus:ring-os-blue/20">
          <option value="all">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <span className="ml-auto text-sm text-slate-500">{visible.length} items</span>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {visible.map(item => {
          const client  = clients.find(c => c.id === item.clientId)
          const Icon    = TYPE_ICON[item.type]
          return (
            <Card key={item.id}>
              <div className="flex items-start gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLOR[item.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                        <InlineSelect
                          value={item.priority}
                          options={GOV_PRIORITY_OPTIONS}
                          onChange={v => patchGovernance(item.id, { priority: v as typeof item.priority })}
                        />
                        <InlineSelect
                          value={item.status}
                          options={GOV_STATUS_OPTIONS}
                          onChange={v => patchGovernance(item.id, { status: v as GovernanceStatus })}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 capitalize">{item.type.replace('-',' ')} · {client?.name}</p>
                    </div>
                    <span className="text-xs text-slate-500 flex-shrink-0">{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                  {item.resolution && (
                    <div className="mt-2 flex items-start gap-2 p-2.5 bg-green-50 rounded-xl">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-green-700">{item.resolution}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10 border-t-white/20">
                    <Avatar name={item.owner} size="xs" />
                    <span className="text-xs text-slate-500">{item.owner}</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
        {visible.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">No governance items match your filters.</div>
        )}
      </div>
      </>}
    </div>
  )
}

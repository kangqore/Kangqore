import { useState } from 'react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { Avatar } from '@design-system/components/Avatar'
import { Plus, Truck } from 'lucide-react'
import { InlineSelect } from '@components/InlineSelect'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { useClientsStore } from '../store'
import type { MilestoneStatus } from '../types'

const MS_STATUS_OPTIONS = [
  { value: 'upcoming',    label: 'Upcoming',    variant: 'neutral' as const },
  { value: 'in-progress', label: 'In Progress', variant: 'info'    as const },
  { value: 'completed',   label: 'Completed',   variant: 'success' as const },
  { value: 'delayed',     label: 'Delayed',     variant: 'danger'  as const },
]

const STATUS_COLOR: Record<MilestoneStatus, string> = {
  completed:   'bg-green-500',
  'in-progress':'bg-os-blue',
  upcoming:    'bg-slate-300',
  delayed:     'bg-red-500',
}
const inputStyle = { background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }
const inputClass = 'w-full rounded-2xl px-3 py-2 text-[13px] text-[var(--os-text-1)] placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40'

function AddMilestoneModal({ clients, onClose }: { clients: { id: string; name: string }[]; onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ clientId: '', title: '', description: '', dueDate: '', status: 'upcoming', owner: '' })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }))
  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post('/admin/crm/milestones', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin','crm','milestones'] }); onClose() },
  })
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative z-10 w-full max-w-[420px] rounded-2xl p-5 flex flex-col gap-3"
        style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', boxShadow: '0 32px 64px rgba(0,0,0,0.7)' }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[14px] font-bold text-slate-100">Add Milestone</h3>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)] text-lg leading-none">×</button>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Client *</label>
          <select required value={form.clientId} onChange={set('clientId')} className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}>
            <option value="">Select client…</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Title *</label>
          <input value={form.title} onChange={set('title')} placeholder="e.g. API Integration Complete" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Description</label>
          <textarea value={form.description} onChange={set('description')} rows={2} placeholder="What does this milestone deliver?" className={`${inputClass} resize-none`} style={inputStyle} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Due Date *</label>
            <input type="date" value={form.dueDate} onChange={set('dueDate')} className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Status</label>
            <select value={form.status} onChange={set('status')} className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}>
              <option value="upcoming">Upcoming</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Owner</label>
          <input value={form.owner} onChange={set('owner')} placeholder="e.g. C.O.D.E." className={inputClass} style={inputStyle} />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="px-3 py-1.5 text-[13px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">Cancel</button>
          <button onClick={() => mutate()} disabled={isPending || !form.clientId || !form.title || !form.dueDate}
            className="px-4 py-1.5 rounded-2xl text-[13px] font-semibold text-white disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #2564ea, #0ea5e9)' }}>
            {isPending ? 'Saving…' : 'Add Milestone'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function DeliveryTracking() {
  const { clients, milestones, updateMilestone } = useClientsStore()

  function patchMilestone(id: string, patch: Parameters<typeof updateMilestone>[1]) {
    updateMilestone(id, patch)
    api.patch(`/admin/crm/milestones/${id}`, patch)
  }
  const [showAdd, setShowAdd] = useState(false)
  const activeClients = clients.filter(c => c.status !== 'churned' && c.projectIds.length > 0)

  const overallCompleted = milestones.filter(m => m.status === 'completed').length
  const overallDelayed   = milestones.filter(m => m.status === 'delayed').length
  const overallInProg    = milestones.filter(m => m.status === 'in-progress').length

  return (
    <div className="space-y-6">
      {showAdd && <AddMilestoneModal clients={clients} onClose={() => setShowAdd(false)} />}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Delivery Tracking</h2>
          <p className="text-sm text-[var(--os-text-2)] mt-0.5">{milestones.length} milestones across {activeClients.length} clients</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-2xl text-white text-[13px] font-semibold"
          style={{ background: 'linear-gradient(135deg, #2564ea, #0ea5e9)' }}>
          <Plus className="w-3.5 h-3.5" /> Add Milestone
        </button>
      </div>

      {milestones.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <Truck className="w-10 h-10 text-slate-800" />
          <p className="text-sm font-semibold text-[var(--os-text-2)]">No milestones yet</p>
          <p className="text-xs text-[var(--os-text-2)] max-w-xs">Add milestones to track delivery progress across your client engagements.</p>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 h-8 px-4 rounded-2xl text-white text-[13px] font-semibold mt-2"
            style={{ background: 'linear-gradient(135deg, #2564ea, #0ea5e9)' }}>
            <Plus className="w-3.5 h-3.5" /> Add first milestone
          </button>
        </div>
      )}

      {milestones.length > 0 && <>
      {/* Summary chips */}
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { label: `${overallCompleted} completed`, color: 'bg-green-50 text-green-700 border-green-200' },
          { label: `${overallInProg} in progress`,  color: 'bg-os-blue/5 text-os-blue border-os-blue/20' },
          { label: `${overallDelayed} delayed`,      color: overallDelayed > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-[var(--os-surface-0)] text-[var(--os-text-2)] border-[var(--os-border)]' },
          { label: `${milestones.filter(m=>m.status==='upcoming').length} upcoming`, color: 'bg-[var(--os-surface-0)] text-[var(--os-text-2)] border-[var(--os-border)]' },
        ].map(c => (
          <span key={c.label} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${c.color}`}>{c.label}</span>
        ))}
      </div>

      {/* Per-client delivery cards */}
      <div className="space-y-4">
        {activeClients.map(client => {
          const cms     = milestones.filter(m => m.clientId === client.id)
          const done    = cms.filter(m => m.status === 'completed').length
          const pct     = cms.length > 0 ? Math.round((done / cms.length) * 100) : 0
          const delayed = cms.filter(m => m.status === 'delayed').length

          return (
            <Card key={client.id}>
              {/* Client header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-os-blue to-os-cyan flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{client.logo}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[var(--os-text-1)]">{client.name}</h3>
                    {delayed > 0 && <Badge variant="danger" dot size="sm">{delayed} delayed</Badge>}
                  </div>
                  <p className="text-xs text-[var(--os-text-2)]">{done}/{cms.length} milestones complete</p>
                </div>
                <div className="flex-shrink-0">
                  <Progress value={pct} size="sm" color={delayed > 0 ? 'danger' : pct === 100 ? 'success' : 'brand'} className="w-28" />
                  <p className="text-[10px] text-[var(--os-text-2)] text-right mt-1">{pct}% delivered</p>
                </div>
              </div>

              {/* Milestone timeline */}
              <div className="relative">
                {/* Connector line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--os-border)]" />

                <div className="space-y-3">
                  {cms.map(ms => (
                    <div key={ms.id} className="flex items-start gap-3 relative">
                      <div className={`w-3.5 h-3.5 rounded-full mt-0.5 flex-shrink-0 z-10 ring-2 ring-os-s1 ${STATUS_COLOR[ms.status]}`} />
                      <div className="flex-1 min-w-0 pb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-medium ${ms.status === 'completed' ? 'text-[var(--os-text-2)] line-through' : 'text-[var(--os-text-1)]'}`}>
                            {ms.title}
                          </p>
                          <InlineSelect
                            value={ms.status}
                            options={MS_STATUS_OPTIONS}
                            onChange={v => patchMilestone(ms.id, { status: v as MilestoneStatus })}
                          />
                        </div>
                        <p className="text-xs text-[var(--os-text-2)] mt-0.5 line-clamp-1">{ms.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-[var(--os-text-2)]">
                            {ms.status === 'completed' && ms.completedDate
                              ? `Delivered ${new Date(ms.completedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                              : `Due ${new Date(ms.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                            }
                          </span>
                          <div className="flex items-center gap-1">
                            <Avatar name={ms.owner} size="xs" />
                            <span className="text-[10px] text-[var(--os-text-2)]">{ms.owner.split(' ')[0]}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      </>}
    </div>
  )
}

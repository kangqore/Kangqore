// Automations View — no-code if-this-then-that rules for WorkItems
// Lists WorkAutomation records, allows toggle + delete, create modal

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Plus, RefreshCw, Zap, ToggleRight, Trash2, PlayCircle } from 'lucide-react'
import { cn } from '@design-system/cn'

interface WorkAutomation {
  id: string; name: string; description?: string | null
  triggerType: string; triggerConditions: any
  actionType: string; actionParams: any
  isActive: boolean; runCount: number
  lastRunAt?: string | null; createdAt: string
}

const TRIGGER_LABELS: Record<string, string> = {
  STATUS_CHANGE:     'Status changes',
  PRIORITY_CHANGE:   'Priority changes',
  ASSIGNED:          'Item assigned',
  DUE_DATE_PASSED:   'Due date passes',
  CREATED:           'Item created',
  PROGRESS_REACHED:  'Progress reaches %',
}

const ACTION_LABELS: Record<string, string> = {
  SET_STATUS:     'Set status →',
  SET_PRIORITY:   'Set priority →',
  SET_ASSIGNEE:   'Assign to →',
  SET_FIELD:      'Set field →',
  NOTIFY:         'Send notification',
  CREATE_SUBITEM: 'Create sub-item',
  MARK_BLOCKED:   'Mark as blocked',
}

function CreateAutomationModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    name: '', description: '', triggerType: 'STATUS_CHANGE', actionType: 'SET_STATUS',
    triggerValue: '', actionValue: '',
  })

  const create = useMutation({
    mutationFn: (data: any) => api.post('/admin/work-os/work/automations', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['work', 'automations'] }); onClose() },
  })

  function submit() {
    create.mutate({
      name: form.name,
      description: form.description || undefined,
      triggerType: form.triggerType,
      triggerConditions: form.triggerValue ? { value: form.triggerValue } : {},
      actionType: form.actionType,
      actionParams: form.actionValue ? { value: form.actionValue } : {},
      isActive: true,
    })
  }

  const inp = 'text-sm bg-[var(--os-bg-2)] border border-[var(--os-border)] rounded px-3 py-2 text-[var(--os-text-1)] w-full focus:outline-none focus:border-violet-500'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[var(--os-bg-1)] border border-[var(--os-border)] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
           onClick={e => e.stopPropagation()}>
        <h2 className="text-base font-semibold text-[var(--os-text-1)] mb-4">New Automation</h2>
        <div className="space-y-3">
          <input className={inp} value={form.name} autoFocus
                 onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Automation name…" />
          <textarea className={`${inp} resize-none`} rows={2} value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What does this automation do?" />

          {/* Trigger */}
          <div className="p-3 bg-[var(--os-bg-2)] rounded-2xl border border-[var(--os-border)]">
            <div className="text-xs font-semibold text-violet-400 mb-2 uppercase tracking-wide">When</div>
            <select className={inp} value={form.triggerType} onChange={e => setForm(f => ({ ...f, triggerType: e.target.value }))}>
              {Object.entries(TRIGGER_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input className={`${inp} mt-2`} value={form.triggerValue}
                   onChange={e => setForm(f => ({ ...f, triggerValue: e.target.value }))}
                   placeholder="Condition value (e.g. DONE, 80)" />
          </div>

          {/* Action */}
          <div className="p-3 bg-[var(--os-bg-2)] rounded-2xl border border-[var(--os-border)]">
            <div className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">Then</div>
            <select className={inp} value={form.actionType} onChange={e => setForm(f => ({ ...f, actionType: e.target.value }))}>
              {Object.entries(ACTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input className={`${inp} mt-2`} value={form.actionValue}
                   onChange={e => setForm(f => ({ ...f, actionValue: e.target.value }))}
                   placeholder="Action value (e.g. BLOCKED, HIGH)" />
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={submit} disabled={!form.name.trim() || create.isPending}
              className="flex-1 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded transition-colors disabled:opacity-50">
              {create.isPending ? 'Creating…' : 'Create Automation'}
            </button>
            <button onClick={onClose} className="px-4 py-2 text-sm text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AutomationsView() {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)

  const { data = [], isLoading, isFetching, refetch } = useQuery<WorkAutomation[]>({
    queryKey: ['work', 'automations'],
    queryFn: () => api.get('/admin/work-os/work/automations').then(r => r.data),
    staleTime: 60_000,
  })

  const toggle = useMutation({
    mutationFn: (id: string) => api.post(`/admin/work-os/work/automations/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['work', 'automations'] }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/work-os/work/automations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['work', 'automations'] }),
  })

  const activeCount = data.filter(a => a.isActive).length
  const totalRuns = data.reduce((s, a) => s + a.runCount, 0)

  if (isLoading) return <div className="text-sm text-[var(--os-text-2)] py-8 text-center">Loading automations…</div>

  return (
    <div>
      <div className="flex items-center gap-6 mb-5">
        <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]">
          <Zap className="w-4 h-4" />
          <span>{data.length} automations</span>
        </div>
        {data.length > 0 && (
          <>
            <span className="text-xs text-emerald-400">{activeCount} active</span>
            <span className="text-xs text-[var(--os-text-2)]">{totalRuns} total runs</span>
          </>
        )}
        <button onClick={() => refetch()} className="text-[var(--os-text-3)] hover:text-[var(--os-text-1)]">
          <RefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
        </button>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded transition-colors ml-auto">
          <Plus className="w-3.5 h-3.5" />New Automation
        </button>
      </div>

      {data.length === 0 ? (
        <div className="border border-[var(--os-border)] rounded-2xl h-64 flex flex-col items-center justify-center gap-3 text-[var(--os-text-2)]">
          <Zap className="w-8 h-8 opacity-30" />
          <div className="text-sm">No automations yet.</div>
          <div className="text-xs text-[var(--os-text-3)]">Create rules like: "When status → DONE, notify assignee"</div>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map(auto => (
            <div key={auto.id} className={cn(
              'border rounded-2xl p-4 bg-[var(--os-bg-1)] flex items-start gap-4 transition-colors',
              auto.isActive ? 'border-[var(--os-border)]' : 'border-[var(--os-border)] opacity-60'
            )}>
              {/* Icon */}
              <div className={cn('w-8 h-8 rounded-2xl flex items-center justify-center shrink-0',
                auto.isActive ? 'bg-violet-500/10' : 'bg-[var(--os-bg-2)]')}>
                <Zap className={cn('w-4 h-4', auto.isActive ? 'text-violet-400' : 'text-[var(--os-text-3)]')} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-[var(--os-text-1)]">{auto.name}</span>
                  {!auto.isActive && <span className="text-xs text-[var(--os-text-3)] bg-[var(--os-bg-2)] px-1.5 py-0.5 rounded">paused</span>}
                </div>
                {auto.description && <p className="text-xs text-[var(--os-text-2)] mb-2">{auto.description}</p>}

                {/* Rule pill */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">
                    {TRIGGER_LABELS[auto.triggerType] ?? auto.triggerType}
                    {auto.triggerConditions?.value ? ` = ${auto.triggerConditions.value}` : ''}
                  </span>
                  <span className="text-xs text-[var(--os-text-3)]">→</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                    {ACTION_LABELS[auto.actionType] ?? auto.actionType}
                    {auto.actionParams?.value ? ` ${auto.actionParams.value}` : ''}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--os-text-3)]">
                  <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" />{auto.runCount} runs</span>
                  {auto.lastRunAt && <span>Last: {new Date(auto.lastRunAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggle.mutate(auto.id)} disabled={toggle.isPending}
                  className={cn('p-1.5 rounded hover:bg-[var(--os-bg-2)] transition-colors',
                    auto.isActive ? 'text-violet-400' : 'text-[var(--os-text-3)]')}
                  title={auto.isActive ? 'Pause' : 'Activate'}>
                  <ToggleRight className="w-4 h-4" />
                </button>
                <button onClick={() => remove.mutate(auto.id)} disabled={remove.isPending}
                  className="p-1.5 rounded hover:bg-red-500/10 text-[var(--os-text-3)] hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && <CreateAutomationModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

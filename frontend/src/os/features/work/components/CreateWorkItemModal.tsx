import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { X } from 'lucide-react'
import { type WorkItemType, type WorkItemStatus, type WorkItemPriority } from '../types'

interface Props {
  onClose: () => void
  projectId?: string
  portfolioId?: string
  defaultStatus?: WorkItemStatus
}

export function CreateWorkItemModal({ onClose, projectId, portfolioId, defaultStatus = 'TODO' }: Props) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    title: '', description: '',
    type: 'TASK' as WorkItemType,
    status: defaultStatus as WorkItemStatus,
    priority: 'MEDIUM' as WorkItemPriority,
    dueDate: '', estimatedHours: '', storyPoints: '',
    tags: '',
  })

  const create = useMutation({
    mutationFn: (data: any) => api.post('/admin/work/items', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['work'] })
      onClose()
    },
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    create.mutate({
      title: form.title.trim(),
      description: form.description || undefined,
      type: form.type,
      status: form.status,
      priority: form.priority,
      projectId, portfolioId,
      dueDate: form.dueDate || undefined,
      estimatedHours: form.estimatedHours ? parseFloat(form.estimatedHours) : undefined,
      storyPoints: form.storyPoints ? parseInt(form.storyPoints) : undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    })
  }

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label className="block text-xs font-medium text-[var(--os-text-2)] mb-1">{label}</label>
      {children}
    </div>
  )

  const input = `text-sm bg-[var(--os-bg-2)] border border-[var(--os-border)] rounded px-3 py-2 text-[var(--os-text-1)] w-full focus:outline-none focus:border-violet-500`
  const select = `text-sm bg-[var(--os-bg-2)] border border-[var(--os-border)] rounded px-2 py-2 text-[var(--os-text-1)] w-full`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[var(--os-bg-1)] border border-[var(--os-border)] rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6"
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-[var(--os-text-1)]">New Work Item</h2>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {field('Title *',
            <input className={input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="What needs to be done?" autoFocus />
          )}

          {field('Description',
            <textarea className={`${input} resize-none`} rows={2} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional context…" />
          )}

          <div className="grid grid-cols-3 gap-3">
            {field('Type',
              <select className={select} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as WorkItemType }))}>
                {['TASK','BUG','STORY','EPIC','MILESTONE','INITIATIVE','DELIVERABLE','SPIKE'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            )}
            {field('Status',
              <select className={select} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as WorkItemStatus }))}>
                {['BACKLOG','TODO','IN_PROGRESS','IN_REVIEW','DONE','BLOCKED'].map(s => (
                  <option key={s} value={s}>{s.replace('_',' ')}</option>
                ))}
              </select>
            )}
            {field('Priority',
              <select className={select} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as WorkItemPriority }))}>
                {['CRITICAL','HIGH','MEDIUM','LOW'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {field('Due date', <input type="date" className={input} value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />)}
            {field('Est. hours', <input type="number" className={input} value={form.estimatedHours} onChange={e => setForm(f => ({ ...f, estimatedHours: e.target.value }))} placeholder="0" min="0" step="0.5" />)}
            {field('Points', <input type="number" className={input} value={form.storyPoints} onChange={e => setForm(f => ({ ...f, storyPoints: e.target.value }))} placeholder="0" min="0" />)}
          </div>

          {field('Tags (comma-separated)',
            <input className={input} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="design, backend, urgent" />
          )}

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={create.isPending || !form.title.trim()}
              className="flex-1 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded transition-colors disabled:opacity-50">
              {create.isPending ? 'Creating…' : 'Create Work Item'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

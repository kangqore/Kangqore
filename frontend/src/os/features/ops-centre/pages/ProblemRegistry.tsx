import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link2, Plus, ChevronDown, ChevronRight, X } from 'lucide-react'
import { api } from '@lib/api'

interface Problem {
  id:          string
  number:      string
  title:       string
  description: string
  status:      string
  priority:    string
  rootCause:   string | null
  workaround:  string | null
  solution:    string | null
  resolvedAt:  string | null
  createdAt:   string
  assignee:    { id: string; name: string } | null
  incidents:   { id: string; number: string; title: string; status: string; priority: string }[]
}

const STATUS_C = {
  OPEN:          { bg: 'rgba(226,68,92,0.1)',   text: '#e2445c' },
  INVESTIGATING: { bg: 'rgba(253,171,61,0.1)',  text: '#fdab3d' },
  KNOWN_ERROR:   { bg: 'rgba(124,58,237,0.1)',  text: '#7c3aed' },
  RESOLVED:      { bg: 'rgba(0,200,117,0.08)',  text: '#00c875' },
  CLOSED:        { bg: 'rgba(100,100,100,0.08)', text: 'var(--os-text-2)' },
} as Record<string, { bg: string; text: string }>

const PRI_C = {
  P1: '#e2445c', P2: '#fdab3d', P3: '#579bfc', P4: '#00c875',
} as Record<string, string>

function StatusBadge({ s }: { s: string }) {
  const c = STATUS_C[s] ?? STATUS_C['OPEN']
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider"
      style={{ background: c.bg, color: c.text }}>
      {s.replace('_', ' ')}
    </span>
  )
}

function CreateModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ title: '', description: '', priority: 'P3' })

  const create = useMutation({
    mutationFn: () => api.post('/admin/itil/problems', form),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['itil-problems'] }); onClose() },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl p-6 shadow-2xl" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-[var(--os-text-1)]">New Problem</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <input
            autoFocus
            placeholder="Problem title *"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
          />
          <textarea
            placeholder="Description *"
            rows={3}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc] resize-none"
          />
          <select
            value={form.priority}
            onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
          >
            {['P1','P2','P3','P4'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-2xl text-sm font-bold text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)] transition-colors">Cancel</button>
          <button
            disabled={!form.title.trim() || create.isPending}
            onClick={() => create.mutate()}
            className="px-5 py-2 rounded-2xl text-sm font-bold text-white disabled:opacity-40"
            style={{ background: '#579bfc' }}
          >
            {create.isPending ? 'Creating…' : 'Create Problem'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ProblemRow({ prb }: { prb: Problem }) {
  const [exp, setExp] = useState(false)
  const [rc, setRc]   = useState(prb.rootCause ?? '')
  const [wa, setWa]   = useState(prb.workaround ?? '')
  const qc = useQueryClient()

  const update = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.patch(`/admin/itil/problems/${prb.id}`, data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['itil-problems'] }),
  })

  return (
    <>
      <tr className="hover:bg-[var(--os-surface-0)] transition-colors cursor-pointer" onClick={() => setExp(e => !e)}>
        <td className="px-4 py-3 w-6">
          {exp ? <ChevronDown className="w-3.5 h-3.5 text-[var(--os-text-2)]" /> : <ChevronRight className="w-3.5 h-3.5 text-[var(--os-text-2)]" />}
        </td>
        <td className="px-2 py-3 whitespace-nowrap">
          <span className="text-xs font-mono font-bold text-[var(--os-text-2)]">{prb.number}</span>
        </td>
        <td className="px-2 py-3 max-w-xs">
          <p className="text-xs font-bold text-[var(--os-text-1)] truncate">{prb.title}</p>
        </td>
        <td className="px-2 py-3"><StatusBadge s={prb.status} /></td>
        <td className="px-2 py-3">
          <span className="text-xs font-bold" style={{ color: PRI_C[prb.priority] ?? '#579bfc' }}>{prb.priority}</span>
        </td>
        <td className="px-2 py-3">
          <span className="text-xs font-medium text-[var(--os-text-2)]">{prb.incidents.length} incidents</span>
        </td>
        <td className="px-2 py-3 whitespace-nowrap">
          <span className="text-[10px] text-[var(--os-text-2)]">{new Date(prb.createdAt).toLocaleDateString()}</span>
        </td>
      </tr>

      {exp && (
        <tr>
          <td colSpan={7} className="px-0 pb-0">
            <div className="mx-4 mb-3 p-4 rounded-2xl border border-[var(--os-border)]" style={{ background: 'var(--os-surface-0)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)] mb-1">Description</p>
                    <p className="text-xs text-[var(--os-text-1)] leading-relaxed">{prb.description}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)] mb-1">Root Cause</p>
                    <textarea
                      rows={2}
                      value={rc}
                      onChange={e => setRc(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      placeholder="Document the root cause…"
                      className="w-full px-2.5 py-1.5 text-xs rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc] resize-none"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)] mb-1">Workaround</p>
                    <textarea
                      rows={2}
                      value={wa}
                      onChange={e => setWa(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      placeholder="Known workaround for affected users…"
                      className="w-full px-2.5 py-1.5 text-xs rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc] resize-none"
                    />
                  </div>
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => update.mutate({ rootCause: rc, workaround: wa })}
                      disabled={update.isPending}
                      className="px-3 py-1.5 rounded-2xl text-xs font-bold text-white disabled:opacity-40"
                      style={{ background: '#579bfc' }}
                    >
                      Save
                    </button>
                    {prb.status !== 'RESOLVED' && (
                      <button
                        onClick={() => update.mutate({ status: 'RESOLVED' })}
                        disabled={update.isPending}
                        className="px-3 py-1.5 rounded-2xl text-xs font-bold"
                        style={{ background: 'rgba(0,200,117,0.1)', color: '#00c875' }}
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>

                {/* Linked incidents */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)] mb-2">Linked Incidents</p>
                  {prb.incidents.length === 0 ? (
                    <p className="text-xs text-[var(--os-text-2)]">No linked incidents.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {prb.incidents.map(inc => (
                        <div key={inc.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border border-[var(--os-border)]" style={{ background: 'var(--os-card)' }}>
                          <span className="text-[10px] font-mono font-bold text-[var(--os-text-2)]">{inc.number}</span>
                          <span className="text-xs text-[var(--os-text-1)] flex-1 truncate">{inc.title}</span>
                          <span className="text-[9px] font-bold" style={{ color: PRI_C[inc.priority] ?? '#579bfc' }}>{inc.priority}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export function ProblemRegistry() {
  const [creating, setCreating] = useState(false)
  const [filterStatus, setStatus] = useState('')

  const params = new URLSearchParams()
  if (filterStatus) params.set('status', filterStatus)

  const { data, isLoading } = useQuery<{ rows: Problem[]; total: number }>({
    queryKey: ['itil-problems', filterStatus],
    queryFn:  () => api.get(`/admin/itil/problems?${params}`).then(r => r.data),
    staleTime: 30_000,
  })

  const rows  = data?.rows  ?? []
  const total = data?.total ?? 0

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-white"
          style={{ background: '#7c3aed' }}
        >
          <Plus className="w-3.5 h-3.5" /> New Problem
        </button>
        <div className="flex items-center gap-1.5 ml-auto">
          <select
            value={filterStatus}
            onChange={e => setStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none"
          >
            <option value="">All statuses</option>
            {['OPEN','INVESTIGATING','KNOWN_ERROR','RESOLVED','CLOSED'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
        <span className="text-xs text-[var(--os-text-2)]">{total} problems</span>
      </div>

      <div className="rounded-2xl border border-[var(--os-border)] overflow-hidden" style={{ background: 'var(--os-card)' }}>
        {isLoading ? (
          <div className="p-6 space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-10 rounded-2xl animate-pulse" style={{ background: 'var(--os-surface-0)' }} />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center">
            <Link2 className="w-6 h-6 mx-auto mb-2 text-[var(--os-text-2)]" />
            <p className="text-sm font-bold text-[var(--os-text-1)]">No problems recorded</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--os-border)]">
                  <th className="px-4 py-2.5 w-6" />
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">#</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Title</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Status</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Priority</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Incidents</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--os-border)]">
                {rows.map(prb => <ProblemRow key={prb.id} prb={prb} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {creating && <CreateModal onClose={() => setCreating(false)} />}
    </div>
  )
}

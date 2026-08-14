// Portfolio View — card grid of WorkPortfolios with progress rollup

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Plus, RefreshCw, Briefcase, MoreHorizontal } from 'lucide-react'
import { cn } from '@design-system/cn'

interface WorkPortfolio {
  id: string; name: string; description?: string | null
  status: string; progress: number; ownerId?: string | null
  startDate?: string | null; endDate?: string | null
  objectId?: string | null; tags: string[]
  _count?: { workItems: number }
  createdAt: string
}

const STATUS_STYLE: Record<string, string> = {
  PLANNING:   'text-blue-400 bg-blue-400/10',
  ACTIVE:     'text-emerald-400 bg-emerald-400/10',
  ON_HOLD:    'text-amber-400 bg-amber-400/10',
  COMPLETED:  'text-violet-400 bg-violet-400/10',
  CANCELLED:  'text-[var(--os-text-3)] bg-[var(--os-bg-2)]',
}

const PROGRESS_COLOR = (p: number) => p >= 75 ? 'bg-emerald-500' : p >= 40 ? 'bg-violet-500' : 'bg-amber-500'

function CreatePortfolioModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ name: '', description: '', status: 'ACTIVE' })

  const create = useMutation({
    mutationFn: (data: any) => api.post('/admin/work/portfolios', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['work', 'portfolios'] }); onClose() },
  })

  const inp = 'text-sm bg-[var(--os-bg-2)] border border-[var(--os-border)] rounded px-3 py-2 text-[var(--os-text-1)] w-full focus:outline-none focus:border-violet-500'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[var(--os-bg-1)] border border-[var(--os-border)] rounded-xl shadow-2xl w-full max-w-md mx-4 p-6"
           onClick={e => e.stopPropagation()}>
        <h2 className="text-base font-semibold text-[var(--os-text-1)] mb-4">New Portfolio</h2>
        <div className="space-y-3">
          <input className={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                 placeholder="Portfolio name…" autoFocus />
          <textarea className={`${inp} resize-none`} rows={2} value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description…" />
          <select className={inp} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            {['PLANNING','ACTIVE','ON_HOLD','COMPLETED','CANCELLED'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
          </select>
          <div className="flex gap-3 pt-1">
            <button onClick={() => create.mutate(form)} disabled={!form.name.trim() || create.isPending}
              className="flex-1 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded transition-colors disabled:opacity-50">
              {create.isPending ? 'Creating…' : 'Create Portfolio'}
            </button>
            <button onClick={onClose} className="px-4 py-2 text-sm text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PortfolioView() {
  const [showCreate, setShowCreate] = useState(false)

  const { data = [], isLoading, isFetching, refetch } = useQuery<WorkPortfolio[]>({
    queryKey: ['work', 'portfolios'],
    queryFn: () => api.get('/admin/work/portfolios').then(r => r.data),
    staleTime: 60_000,
  })

  const active = data.filter(p => p.status === 'ACTIVE').length
  const avgProgress = data.length ? Math.round(data.reduce((s, p) => s + p.progress, 0) / data.length) : 0

  if (isLoading) return <div className="text-sm text-[var(--os-text-2)] py-8 text-center">Loading portfolios…</div>

  return (
    <div>
      <div className="flex items-center gap-6 mb-5">
        <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]">
          <Briefcase className="w-4 h-4" />
          <span>{data.length} portfolios</span>
        </div>
        {data.length > 0 && (
          <>
            <span className="text-xs text-emerald-400">{active} active</span>
            <span className="text-xs text-[var(--os-text-2)]">{avgProgress}% avg progress</span>
          </>
        )}
        <button onClick={() => refetch()} className="text-[var(--os-text-3)] hover:text-[var(--os-text-1)]">
          <RefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
        </button>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded transition-colors ml-auto">
          <Plus className="w-3.5 h-3.5" />New Portfolio
        </button>
      </div>

      {data.length === 0 ? (
        <div className="border border-[var(--os-border)] rounded-xl h-64 flex items-center justify-center text-sm text-[var(--os-text-2)]">
          No portfolios yet. Create one to group related projects and initiatives.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {data.map(p => (
            <div key={p.id} className="border border-[var(--os-border)] rounded-xl p-5 bg-[var(--os-bg-1)] hover:bg-[var(--os-bg-hover)] transition-colors flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[var(--os-text-1)] truncate">{p.name}</div>
                    {p.description && (
                      <div className="text-xs text-[var(--os-text-2)] truncate">{p.description}</div>
                    )}
                  </div>
                </div>
                <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded shrink-0', STATUS_STYLE[p.status] ?? STATUS_STYLE['CANCELLED'])}>
                  {p.status.replace('_',' ')}
                </span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[var(--os-text-2)]">Progress</span>
                  <span className="text-xs font-medium text-[var(--os-text-1)]">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-[var(--os-bg-3)] rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full transition-all', PROGRESS_COLOR(p.progress))} style={{ width: `${p.progress}%` }} />
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-[var(--os-text-3)] flex-wrap">
                {p._count?.workItems !== undefined && <span>{p._count.workItems} items</span>}
                {p.endDate && <span>Ends {new Date(p.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span>}
                {p.objectId && <span className="text-violet-400 font-mono">OBJ</span>}
              </div>

              {/* Tags */}
              {p.tags?.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {p.tags.slice(0, 4).map(t => (
                    <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-[var(--os-bg-2)] text-[var(--os-text-3)]">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showCreate && <CreatePortfolioModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

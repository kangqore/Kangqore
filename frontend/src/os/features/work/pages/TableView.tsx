// Table View — sortable spreadsheet with inline status/priority editing

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Plus, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react'
import { CreateWorkItemModal } from '../components/CreateWorkItemModal'
import { type WorkItem, STATUS_COLOR, PRIORITY_COLOR, PRIORITY_DOT, TYPE_ICON, STATUS_COLUMNS } from '../types'
import { cn } from '@design-system/cn'

type SortKey = 'title' | 'status' | 'priority' | 'dueDate' | 'progress' | 'type' | 'createdAt'

function sortItems(items: WorkItem[], key: SortKey, dir: 'asc' | 'desc'): WorkItem[] {
  return [...items].sort((a, b) => {
    let av: any = a[key], bv: any = b[key]
    if (key === 'priority') {
      const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
      av = order[av as keyof typeof order] ?? 4
      bv = order[bv as keyof typeof order] ?? 4
    }
    if (av == null) return 1; if (bv == null) return -1
    if (av < bv) return dir === 'asc' ? -1 : 1
    if (av > bv) return dir === 'asc' ? 1 : -1
    return 0
  })
}

const STATUS_OPTIONS = STATUS_COLUMNS
const PRIORITY_OPTIONS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

interface Props { projectId?: string; portfolioId?: string }

export function TableView({ projectId, portfolioId }: Props) {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'createdAt', dir: 'desc' })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [editCell, setEditCell] = useState<{ id: string; field: string } | null>(null)

  const { data: rawItems = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['work', 'items', projectId, portfolioId, search, statusFilter],
    queryFn: () => api.get('/admin/work-os/work/items', {
      params: { projectId, portfolioId, search: search || undefined, status: statusFilter || undefined, limit: 200 }
    }).then(r => r.data),
    staleTime: 30_000,
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/admin/work-os/work/items/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['work'] }); setEditCell(null) },
  })

  const items: WorkItem[] = sortItems(rawItems, sort.key, sort.dir)

  function toggleSort(key: SortKey) {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sort.key !== k) return null
    return sort.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
  }

  function Th({ label, k }: { label: string; k: SortKey }) {
    return (
      <th
        onClick={() => toggleSort(k)}
        className="text-left text-xs font-medium text-[var(--os-text-2)] px-3 py-2 cursor-pointer hover:text-[var(--os-text-1)] select-none whitespace-nowrap"
      >
        <div className="flex items-center gap-1">{label}<SortIcon k={k} /></div>
      </th>
    )
  }

  function isEditing(id: string, field: string) { return editCell?.id === id && editCell?.field === field }

  function InlineSelect({ id, field, value, options, renderOption }: {
    id: string; field: string; value: string
    options: string[]; renderOption?: (v: string) => React.ReactNode
  }) {
    if (isEditing(id, field)) {
      return (
        <select
          autoFocus
          value={value}
          onChange={e => update.mutate({ id, data: { [field]: e.target.value } })}
          onBlur={() => setEditCell(null)}
          className="text-xs bg-[var(--os-bg-1)] border border-violet-500 rounded px-1 py-0.5"
        >
          {options.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
        </select>
      )
    }
    return (
      <button
        onClick={() => setEditCell({ id, field })}
        className="text-left hover:underline decoration-dotted"
        title="Click to edit"
      >
        {renderOption ? renderOption(value) : value}
      </button>
    )
  }

  if (isLoading) return <div className="text-sm text-[var(--os-text-2)] py-8 text-center">Loading…</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search items…"
          className="text-sm bg-[var(--os-bg-2)] border border-[var(--os-border)] rounded px-3 py-1.5 text-[var(--os-text-1)] w-52 focus:outline-none focus:border-violet-500"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-sm bg-[var(--os-bg-2)] border border-[var(--os-border)] rounded px-2 py-1.5 text-[var(--os-text-1)]"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <button onClick={() => refetch()} className="text-[var(--os-text-3)] hover:text-[var(--os-text-1)]">
          <RefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
        </button>
        <span className="text-xs text-[var(--os-text-3)] ml-auto">{items.length} items</span>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />New
        </button>
      </div>

      <div className="border border-[var(--os-border)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--os-bg-2)] border-b border-[var(--os-border)]">
              <tr>
                <th className="w-6 px-3 py-2" />
                <Th label="Title" k="title" />
                <Th label="Type" k="type" />
                <Th label="Status" k="status" />
                <Th label="Priority" k="priority" />
                <Th label="Due" k="dueDate" />
                <Th label="Progress" k="progress" />
                <th className="text-left text-xs font-medium text-[var(--os-text-2)] px-3 py-2">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-[var(--os-bg-hover)] transition-colors group">
                  {/* Type icon */}
                  <td className="px-3 py-2 text-center text-sm">{TYPE_ICON[item.type]}</td>

                  {/* Title */}
                  <td className="px-3 py-2 max-w-[280px]">
                    <span className={cn('font-medium text-[var(--os-text-1)]', item.status === 'COMPLETED' && 'line-through text-[var(--os-text-3)]')}>
                      {item.title}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="px-3 py-2 text-xs text-[var(--os-text-2)] whitespace-nowrap">{item.type}</td>

                  {/* Status */}
                  <td className="px-3 py-2">
                    <InlineSelect id={item.id} field="status" value={item.status} options={STATUS_OPTIONS}
                      renderOption={v => (
                        <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', STATUS_COLOR[v])}>{v.replace('_',' ')}</span>
                      )}
                    />
                  </td>

                  {/* Priority */}
                  <td className="px-3 py-2">
                    <InlineSelect id={item.id} field="priority" value={item.priority} options={PRIORITY_OPTIONS}
                      renderOption={v => (
                        <div className="flex items-center gap-1.5">
                          <div className={cn('w-2 h-2 rounded-full', PRIORITY_DOT[v])} />
                          <span className={cn('text-xs', PRIORITY_COLOR[v])}>{v}</span>
                        </div>
                      )}
                    />
                  </td>

                  {/* Due date */}
                  <td className="px-3 py-2 text-xs text-[var(--os-text-2)] whitespace-nowrap">
                    {item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                  </td>

                  {/* Progress */}
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <div className="flex-1 h-1.5 bg-[var(--os-bg-3)] rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 transition-all" style={{ width: `${item.progress}%` }} />
                      </div>
                      <span className="text-xs text-[var(--os-text-3)] w-7 text-right">{item.progress}%</span>
                    </div>
                  </td>

                  {/* Tags */}
                  <td className="px-3 py-2">
                    <div className="flex gap-1 flex-wrap">
                      {item.tags?.slice(0, 2).map(t => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-[var(--os-bg-2)] text-[var(--os-text-3)]">{t}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="text-center py-12 text-sm text-[var(--os-text-2)]">
              No items found. Create one to get started.
            </div>
          )}
        </div>
      </div>

      {showCreate && <CreateWorkItemModal onClose={() => setShowCreate(false)} projectId={projectId} portfolioId={portfolioId} />}
    </div>
  )
}

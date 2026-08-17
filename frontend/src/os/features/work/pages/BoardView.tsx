// Board View — Kanban with native HTML5 drag-and-drop
// Columns are WorkItemStatus values. Drag cards between columns to update status.

import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Plus, RefreshCw } from 'lucide-react'
import { WorkItemCard } from '../components/WorkItemCard'
import { CreateWorkItemModal } from '../components/CreateWorkItemModal'
import { type WorkItem, STATUS_COLOR } from '../types'
import { cn } from '@design-system/cn'

const COLUMNS = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED'] as const

const COL_LABEL: Record<string, string> = {
  BACKLOG: 'Backlog', TODO: 'To Do', IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review', DONE: 'Done', BLOCKED: 'Blocked',
}

const COL_ACCENT: Record<string, string> = {
  BACKLOG: 'border-t-[var(--os-border)]',
  TODO: 'border-t-blue-500',
  IN_PROGRESS: 'border-t-violet-500',
  IN_REVIEW: 'border-t-amber-500',
  DONE: 'border-t-emerald-500',
  BLOCKED: 'border-t-red-500',
}

interface Props {
  projectId?: string
  portfolioId?: string
}

export function BoardView({ projectId, portfolioId }: Props) {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [createStatus, setCreateStatus] = useState('TODO')
  const [dragItem, setDragItem] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['work', 'board', projectId, portfolioId],
    queryFn: () => api.get('/admin/work/board', { params: { projectId, portfolioId } }).then(r => r.data),
    staleTime: 30_000,
  })

  const move = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.post(`/admin/work/items/${id}/move`, { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ['work', 'board'] })
      const prev = qc.getQueryData(['work', 'board', projectId, portfolioId])
      qc.setQueryData(['work', 'board', projectId, portfolioId], (old: any) => {
        if (!old) return old
        const newItems = { ...old.items }
        let movedItem: WorkItem | null = null
        for (const col of COLUMNS) {
          newItems[col] = newItems[col].filter((i: WorkItem) => {
            if (i.id === id) { movedItem = { ...i, status: status as any }; return false }
            return true
          })
        }
        if (movedItem) newItems[status] = [movedItem, ...(newItems[status] ?? [])]
        return { ...old, items: newItems }
      })
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['work', 'board', projectId, portfolioId], ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['work', 'board'] }),
  })

  function handleDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.effectAllowed = 'move'
    setDragItem(id)
  }

  function handleDrop(e: React.DragEvent, col: string) {
    e.preventDefault()
    if (dragItem && col !== dragOver) {
      move.mutate({ id: dragItem, status: col })
    }
    setDragItem(null); setDragOver(null)
  }

  const items: Record<string, WorkItem[]> = data?.items ?? {}
  const totalCount = data?.total ?? 0

  if (isLoading) return <div className="text-sm text-[var(--os-text-2)] py-8 text-center">Loading board…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--os-text-2)]">{totalCount} items</span>
          <button onClick={() => refetch()} className="text-[var(--os-text-3)] hover:text-[var(--os-text-1)]">
            <RefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
          </button>
        </div>
        <button
          onClick={() => { setCreateStatus('TODO'); setShowCreate(true) }}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Item
        </button>
      </div>

      {/* Board grid */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(220px, 1fr))`, overflowX: 'auto' }}>
        {COLUMNS.map(col => {
          const colItems = items[col] ?? []
          const isDragTarget = dragOver === col
          return (
            <div
              key={col}
              onDragOver={e => { e.preventDefault(); setDragOver(col) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => handleDrop(e, col)}
              className={cn(
                'flex flex-col gap-2 min-h-[400px] rounded-2xl border-t-2 border border-[var(--os-border)] bg-[var(--os-bg-2)] p-3 transition-colors',
                COL_ACCENT[col],
                isDragTarget && 'bg-violet-500/5 border-violet-500/30',
              )}
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs font-semibold', STATUS_COLOR[col].split(' ')[0])}>
                    {COL_LABEL[col]}
                  </span>
                  <span className="text-xs text-[var(--os-text-3)] bg-[var(--os-bg-3)] px-1.5 py-0.5 rounded-full">
                    {colItems.length}
                  </span>
                </div>
                <button
                  onClick={() => { setCreateStatus(col); setShowCreate(true) }}
                  className="text-[var(--os-text-3)] hover:text-[var(--os-text-1)] p-0.5 rounded hover:bg-[var(--os-bg-3)] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 flex-1">
                {colItems.map((item: WorkItem) => (
                  <WorkItemCard
                    key={item.id}
                    item={item}
                    draggable
                    onDragStart={e => handleDragStart(e, item.id)}
                  />
                ))}
                {colItems.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-xs text-[var(--os-text-3)] py-8 border-2 border-dashed border-[var(--os-border)] rounded-2xl">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showCreate && (
        <CreateWorkItemModal
          onClose={() => setShowCreate(false)}
          projectId={projectId}
          portfolioId={portfolioId}
          defaultStatus={createStatus as any}
        />
      )}
    </div>
  )
}

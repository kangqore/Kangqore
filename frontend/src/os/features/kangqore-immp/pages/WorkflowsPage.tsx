import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@lib/api'
import { GitBranch, CheckCircle2, XCircle, Clock, Play, ChevronRight } from 'lucide-react'
import { cn } from '@design-system/cn'

interface WorkflowDef {
  id:          string
  name:        string
  description: string | null
  trigger:     string
  status:      string
  createdBy:   string
  createdAt:   string
  dag:         { nodes: any[]; edges: any[] }
  runs:        Array<{ id: string; status: string; startedAt: string; completedAt: string | null }>
}

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:   '#00c875',
  ARCHIVED: '#8b8b8b',
}

const RUN_DOT: Record<string, string> = {
  COMPLETED: '#00c875',
  FAILED:    '#e2445c',
  RUNNING:   '#579bfc',
  PAUSED:    '#fdab3d',
  PENDING:   '#8b8b8b',
}

export function WorkflowsPage() {
  const [selected, setSelected] = useState<WorkflowDef | null>(null)

  const { data, isLoading } = useQuery<{ items: WorkflowDef[] }>({
    queryKey: ['waoe-workflows'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/waoe/workflows?limit=50'),
    staleTime: 30_000,
  })

  const workflows = data?.items ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-[var(--os-text-1)]">Workflows</h2>
        <p className="text-[12px] text-[var(--os-text-2)] mt-0.5">
          Reusable DAG definitions compiled from WAOE goal plans.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-2xl bg-[var(--os-surface-0)] animate-pulse" />)}</div>
      ) : workflows.length === 0 ? (
        <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] py-12 text-center">
          <GitBranch className="w-8 h-8 text-[var(--os-text-2)] mx-auto mb-2" />
          <p className="text-sm text-[var(--os-text-2)]">No workflows yet. Launch a goal from the Operations page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {workflows.map(wf => (
            <div
              key={wf.id}
              onClick={() => setSelected(wf === selected ? null : wf)}
              className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-4 cursor-pointer hover:border-[#579bfc]/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <GitBranch className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#579bfc]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] font-semibold text-[var(--os-text-1)] truncate">{wf.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ color: STATUS_COLOR[wf.status], background: `${STATUS_COLOR[wf.status]}20` }}>
                      {wf.status}
                    </span>
                    <span className="text-[10px] text-[var(--os-text-2)] border border-[var(--os-border)] px-1.5 py-0.5 rounded">{wf.trigger}</span>
                  </div>
                  {wf.description && <p className="text-[11px] text-[var(--os-text-2)] mt-0.5 truncate">{wf.description}</p>}
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-[var(--os-text-2)]">{wf.dag.nodes.length} steps · {wf.dag.edges.length} edges</span>
                    <span className="text-[10px] text-[var(--os-text-2)]">{wf.runs.length} run{wf.runs.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                {/* Mini run history dots */}
                <div className="flex items-center gap-1">
                  {wf.runs.slice(0, 8).map(r => (
                    <div key={r.id} className="w-2 h-2 rounded-full" style={{ background: RUN_DOT[r.status] ?? '#8b8b8b' }} title={r.status} />
                  ))}
                </div>
                <ChevronRight className={cn('w-4 h-4 text-[var(--os-text-2)] transition-transform', selected?.id === wf.id && 'rotate-90')} />
              </div>

              {/* Expanded DAG nodes */}
              {selected?.id === wf.id && (
                <div className="mt-4 pt-4 border-t border-[var(--os-border)]">
                  <p className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest mb-2">DAG Steps</p>
                  <div className="space-y-1.5">
                    {wf.dag.nodes.map((node: any, idx: number) => (
                      <div key={node.id} className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--os-text-2)] w-5 text-right">{idx + 1}</span>
                        <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-2xl text-[11px]', node.critical ? 'bg-red-500/10 border border-red-500/20 text-red-300' : 'bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-1)]')}>
                          <span className="font-mono text-[9px] text-[var(--os-text-2)]">{node.type}</span>
                          <span>{node.title}</span>
                          {node.critical && <span className="text-[9px] text-red-400 ml-1">CRITICAL</span>}
                        </div>
                        {node.dependencies.length > 0 && (
                          <span className="text-[10px] text-[var(--os-text-2)]">← {node.dependencies.join(', ')}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Recent runs for this workflow */}
                  {wf.runs.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest mb-2">Recent Runs</p>
                      <div className="space-y-1">
                        {wf.runs.slice(0, 5).map(r => (
                          <div key={r.id} className="flex items-center gap-2 text-[11px]">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: RUN_DOT[r.status] ?? '#8b8b8b' }} />
                            <span className="text-[var(--os-text-2)]">{r.status}</span>
                            <span className="text-[var(--os-text-2)]">{new Date(r.startedAt).toLocaleString()}</span>
                            {r.completedAt && (
                              <span className="text-[var(--os-text-2)]">
                                {Math.round((new Date(r.completedAt).getTime() - new Date(r.startedAt).getTime()) / 1000)}s
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

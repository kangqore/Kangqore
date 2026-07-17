import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api, isDemo } from '@lib/api'
import { getSocket } from '@lib/socket'
import { useKIMMPStore } from '@store/kimmp'

const surface = '#ffffff'
const border  = '1px solid rgba(37,100,234,0.10)'

export function ActPage() {
  const navigate  = useNavigate()
  const qc = useQueryClient()
  const [running, setRunning]     = useState(false)
  const [runStatus, setRunStatus] = useState<'idle' | 'ok' | 'err'>('idle')
  const [wfStarting, setWfStarting] = useState(false)
  const [wfStatus, setWfStatus]     = useState<'idle' | 'ok' | 'err'>('idle')

  const acknowledgeSignal = useKIMMPStore(s => s.acknowledgeSignal)
  const insights          = useKIMMPStore(s => s.insights)
  const acknowledgedIds   = useKIMMPStore(s => s.acknowledgedIds)

  const criticalInsights = useMemo(() =>
    insights
      .filter(i => i.type !== 'predictive' && !acknowledgedIds.includes(i.id))
      .filter(i => i.priority === 'critical')
      .slice(0, 3),
    [insights, acknowledgedIds]
  )

  const pending = useQuery({
    queryKey:  ['waanda-pending-actions'],
    queryFn:   () => api.get('/admin/aegis/actions/pending').then(r => r.data),
    staleTime: 10_000,
  })

  const actionLog = useQuery({
    queryKey:  ['waanda-action-log'],
    queryFn:   () => api.get('/admin/aegis/actions/log').then(r => r.data),
    staleTime: 30_000,
  })

  useEffect(() => {
    if (isDemo()) return
    const socket = getSocket()
    const refresh = () => {
      pending.refetch()
      actionLog.refetch()
    }
    socket.on('aegis:action:pending', refresh)
    return () => { socket.off('aegis:action:pending', refresh) }
  }, [])

  const approve = useMutation({
    mutationFn: (id: string) => api.post(`/admin/aegis/actions/${id}/approve`),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['waanda-pending-actions'] }) },
  })

  const reject = useMutation({
    mutationFn: (id: string) => api.post(`/admin/aegis/actions/${id}/reject`),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['waanda-pending-actions'] }) },
  })

  async function triggerCycle() {
    if (running) return
    setRunning(true)
    setRunStatus('idle')
    try {
      await api.post('/admin/kangqore-immp/loops/trigger')
      setRunStatus('ok')
      qc.invalidateQueries({ queryKey: ['waanda-history'] })
    } catch {
      setRunStatus('err')
    } finally {
      setRunning(false)
    }
  }

  async function startWorkflow() {
    if (wfStarting) return
    setWfStarting(true)
    setWfStatus('idle')
    try {
      const r = await api.post('/admin/kangqore-immp/workflows', {
        name:    'WAANDA-Initiated Workflow',
        trigger: 'WAANDA_CYCLE',
        context: { source: 'waanda-act', kimmpContext: true },
      })
      setWfStatus('ok')
      const id = r.data?.id ?? r.data?.workflow?.id
      if (id) navigate(`/kangqore-view/admin/workflows/${id}`)
      else    navigate('/kangqore-view/admin/workflows')
    } catch {
      setWfStatus('err')
    } finally {
      setWfStarting(false)
    }
  }

  const pendingList: any[] = pending.data?.rows ?? pending.data?.data ?? []
  const logList: any[]     = actionLog.data?.rows ?? actionLog.data?.data ?? []

  return (
    <div className="space-y-8">

      {/* ── Cognitive cycle trigger */}
      <div style={{ background: surface, border, borderRadius: 12, padding: 24 }}>
        <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-3">
          Cognitive Cycle
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={triggerCycle}
            disabled={running}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: running ? 'rgba(37,100,234,0.3)' : '#2564ea',
              color:      '#fff',
              cursor:     running ? 'not-allowed' : 'pointer',
              opacity:    running ? 0.7 : 1,
            }}
          >
            {running ? 'Running…' : 'Run WAANDA'}
          </button>
          {runStatus === 'ok' && (
            <span className="text-sm" style={{ color: '#10b981' }}>
              Cycle complete — Decide workspace updated.
            </span>
          )}
          {runStatus === 'err' && (
            <span className="text-sm" style={{ color: '#f43f5e' }}>
              Cycle failed. Check backend logs.
            </span>
          )}
          {!running && runStatus === 'idle' && (
            <span className="text-sm text-slate-400">
              Triggers the full reasoning pipeline: LEAD_INTEL → ALIS → EQORE → VIS
            </span>
          )}
        </div>
      </div>

      {/* ── Workflow trigger — start from WAANDA cycle */}
      <div
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(37,100,234,0.06) 100%)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 12, padding: 20 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-1">
            Workflow Trigger
          </div>
          <div className="text-sm font-medium text-slate-700">Start a workflow from WAANDA cycle context</div>
          <div className="text-[12px] text-slate-400 mt-0.5">
            Creates a new workflow pre-seeded with KIMMP context from the current cognitive cycle.
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={startWorkflow}
            disabled={wfStarting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: wfStarting ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #10b981 0%, #2564ea 100%)',
              color: '#fff',
              boxShadow: wfStarting ? 'none' : '0 2px 8px rgba(16,185,129,0.25)',
              cursor: wfStarting ? 'not-allowed' : 'pointer',
              opacity: wfStarting ? 0.7 : 1,
            }}
          >
            {wfStarting ? 'Starting…' : 'Start Workflow'}
          </button>
          {wfStatus === 'err' && (
            <span className="text-xs" style={{ color: '#f43f5e' }}>Failed — check logs</span>
          )}
        </div>
      </div>

      {/* ── Critical KIMMP insights requiring immediate action */}
      {criticalInsights.length > 0 && (
        <div style={{ background: 'rgba(244,63,94,0.04)', border: '1px solid rgba(244,63,94,0.18)', borderRadius: 12, padding: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: '#f43f5e' }}>
              Critical · KIMMP
            </div>
            <span className="text-[11px] text-slate-400">{criticalInsights.length} unacknowledged</span>
          </div>
          <div className="space-y-3">
            {criticalInsights.map(insight => (
              <div
                key={insight.id}
                className="p-3 rounded-xl flex items-start justify-between gap-4"
                style={{ background: 'rgba(244,63,94,0.06)' }}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-800 mb-1">{insight.title}</div>
                  <div className="text-[12px] text-slate-500">{insight.action}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{insight.module} · {insight.confidence}% confidence</div>
                </div>
                <button
                  onClick={() => acknowledgeSignal(insight.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-colors"
                  style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}
                >
                  Mark Acted
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Pending decisions awaiting human approval */}
      <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase">
            WAANDA Proposes
          </div>
          <span className="text-sm text-slate-500">{pendingList.length} awaiting approval</span>
        </div>

        {pending.isLoading ? (
          <div className="text-sm text-slate-500">Loading…</div>
        ) : pendingList.length === 0 ? (
          <div className="text-sm text-slate-400">No pending decisions. WAANDA is monitoring.</div>
        ) : (
          <div className="space-y-3">
            {pendingList.map((action: any, i: number) => (
              <div
                key={action.id ?? i}
                className="p-4 rounded-xl flex items-start justify-between gap-4"
                style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.15)' }}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-700 mb-1">
                    WAANDA proposes: <span style={{ color: '#f59e0b' }}>{action.actionType}</span>
                  </div>
                  <div className="text-xs text-slate-500">{action.description}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Triggered by <span className="font-mono">{action.agentId}</span> · {action.engine}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => approve.mutate(action.id)}
                    disabled={approve.isPending}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject.mutate(action.id)}
                    disabled={reject.isPending}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ background: 'rgba(244,63,94,0.10)', color: '#f43f5e' }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Execution log */}
      <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
        <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-4">
          What WAANDA Did
        </div>
        {actionLog.isLoading ? (
          <div className="text-sm text-slate-500">Loading log…</div>
        ) : logList.length === 0 ? (
          <div className="text-sm text-slate-400">No executed actions yet.</div>
        ) : (
          <div className="space-y-1.5" style={{ maxHeight: 280, overflowY: 'auto' }}>
            {logList.slice(0, 10).map((entry: any, i: number) => (
              <div
                key={entry.id ?? i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
                style={{ background: 'rgba(37,100,234,0.02)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: entry.status === 'SUCCESS' ? '#10b981' : '#f43f5e' }}
                />
                <span className="font-mono text-[11px] text-slate-500 flex-shrink-0">{entry.actionType}</span>
                <span className="text-slate-600 flex-1 truncate">{entry.agentId}</span>
                <span className="text-[11px] text-slate-400 flex-shrink-0">
                  L{entry.level}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

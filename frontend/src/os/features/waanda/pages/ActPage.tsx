import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, isDemo } from '@lib/api'
import { getSocket } from '@lib/socket'

const surface = 'rgba(255,255,255,0.04)'
const border  = '1px solid rgba(255,255,255,0.08)'

export function ActPage() {
  const qc = useQueryClient()
  const [running, setRunning]     = useState(false)
  const [runStatus, setRunStatus] = useState<'idle' | 'ok' | 'err'>('idle')

  // Pending AEGIS decisions that need human approval
  const pending = useQuery({
    queryKey:  ['waanda-pending-actions'],
    queryFn:   () => api.get('/admin/aegis/actions/pending').then(r => r.data),
    staleTime: 10_000,
  })

  // Execution log
  const actionLog = useQuery({
    queryKey:  ['waanda-action-log'],
    queryFn:   () => api.get('/admin/aegis/actions/log').then(r => r.data),
    staleTime: 30_000,
  })

  // Live socket refresh for new pending actions
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

  // Approve L3 action
  const approve = useMutation({
    mutationFn: (id: string) => api.post(`/admin/aegis/actions/${id}/approve`),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['waanda-pending-actions'] }) },
  })

  // Reject L3 action
  const reject = useMutation({
    mutationFn: (id: string) => api.post(`/admin/aegis/actions/${id}/reject`),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['waanda-pending-actions'] }) },
  })

  // Trigger cognitive cycle
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

  const pendingList: any[] = pending.data?.rows ?? pending.data?.data ?? []
  const logList: any[]     = actionLog.data?.rows ?? actionLog.data?.data ?? []

  return (
    <div className="space-y-8">

      {/* ── Cognitive cycle trigger */}
      <div style={{ background: surface, border, borderRadius: 12, padding: 24 }}>
        <div className="text-[10px] font-mono tracking-[0.2em] text-white/35 uppercase mb-3">
          Cognitive Cycle
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={triggerCycle}
            disabled={running}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{
              background:   running ? 'rgba(37,100,234,0.3)' : '#2564ea',
              color:        '#fff',
              cursor:       running ? 'not-allowed' : 'pointer',
              opacity:      running ? 0.7 : 1,
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
            <span className="text-sm text-white/30">
              Triggers the full reasoning pipeline: LEAD_INTEL → ALIS → EQORE → VIS
            </span>
          )}
        </div>
      </div>

      {/* ── Pending decisions awaiting human approval */}
      <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] font-mono tracking-[0.2em] text-white/35 uppercase">
            WAANDA Proposes
          </div>
          <span className="text-sm text-white/40">{pendingList.length} awaiting approval</span>
        </div>

        {pending.isLoading ? (
          <div className="text-sm text-white/40">Loading…</div>
        ) : pendingList.length === 0 ? (
          <div className="text-sm text-white/30">No pending decisions. WAANDA is monitoring.</div>
        ) : (
          <div className="space-y-3">
            {pendingList.map((action: any, i: number) => (
              <div
                key={action.id ?? i}
                className="p-4 rounded-xl flex items-start justify-between gap-4"
                style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.15)' }}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-white/75 mb-1">
                    WAANDA proposes: <span style={{ color: '#f59e0b' }}>{action.actionType}</span>
                  </div>
                  <div className="text-xs text-white/40">{action.description}</div>
                  <div className="text-[11px] text-white/25 mt-1">
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
        <div className="text-[10px] font-mono tracking-[0.2em] text-white/35 uppercase mb-4">
          What WAANDA Did
        </div>
        {actionLog.isLoading ? (
          <div className="text-sm text-white/40">Loading log…</div>
        ) : logList.length === 0 ? (
          <div className="text-sm text-white/30">No executed actions yet.</div>
        ) : (
          <div className="space-y-1.5" style={{ maxHeight: 280, overflowY: 'auto' }}>
            {logList.slice(0, 10).map((entry: any, i: number) => (
              <div
                key={entry.id ?? i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: entry.status === 'SUCCESS' ? '#10b981' : '#f43f5e' }}
                />
                <span className="font-mono text-[11px] text-white/45 flex-shrink-0">{entry.actionType}</span>
                <span className="text-white/50 flex-1 truncate">{entry.agentId}</span>
                <span className="text-[11px] text-white/25 flex-shrink-0">
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

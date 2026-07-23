/**
 * Gen3WorkspacePanel — reusable Gen3 dispatch + live progress panel (S119)
 * Used in Finance (phase 5.5) and CRM (phase 5.6) workspaces.
 */
import { useState, useEffect, useRef } from 'react'
import { Brain, Zap, Activity } from 'lucide-react'
import { api, isDemo } from '@lib/api'
import { getSocket, connectSocket } from '../../../lib/socket'

const ROLE_COLOR: Record<string, string> = {
  RESEARCH: '#579bfc', DIAGNOSTICS: '#f59e0b', EXECUTION: '#10b981', COACH: '#7c3aed',
}

interface Subtask {
  id: string; label: string; status: string; agentRole: string; steps: string[]
  result?: string | null; priorResultCount?: number
}

interface PlanProgress {
  planId: string; goal: string; subtasks: Subtask[]; planStatus: string; priorResultCount?: number
}

interface Props {
  dispatchEndpoint: string   // e.g. '/admin/kangqore-immp/gen3/dispatch-finance-task'
  workspaceName: string      // e.g. 'Finance'
  extraBody?: Record<string, unknown>
}

export function Gen3WorkspacePanel({ dispatchEndpoint, workspaceName, extraBody }: Props) {
  const [goal, setGoal] = useState('')
  const [dispatching, setDispatching] = useState(false)
  const [activePlan, setActivePlan] = useState<PlanProgress | null>(null)

  const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)', SURF = 'var(--os-surface-0)'

  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null)

  useEffect(() => {
    try { connectSocket() } catch {}
    const socket = getSocket()
    socketRef.current = socket

    const onProgress = (data: PlanProgress) => {
      setActivePlan(prev => {
        if (!prev || prev.planId !== data.planId) return prev
        const prior = data.priorResultCount ?? 0
        const patched = Array.isArray(data.subtasks)
          ? data.subtasks.map(st => st.status === 'ACTIVE' ? { ...st, priorResultCount: prior } : st)
          : data.subtasks
        return { ...data, subtasks: patched }
      })
    }
    socket.on('PLAN_PROGRESS', onProgress)
    return () => { socket.off('PLAN_PROGRESS', onProgress) }
  }, [])

  async function dispatch() {
    if (!goal.trim() || dispatching) return
    setDispatching(true)
    setActivePlan(null)
    try {
      const r = await api.post(dispatchEndpoint, { goal: goal.trim(), ...extraBody })
      setActivePlan({ planId: r.data.planId, goal: r.data.goal, subtasks: [], planStatus: 'PENDING' })
      setGoal('')
    } catch { /* ignore */ } finally {
      setDispatching(false)
    }
  }

  const planDone = activePlan?.planStatus === 'DONE' || activePlan?.planStatus === 'FAILED'
  const statusColor = activePlan?.planStatus === 'DONE' ? '#10b981' : activePlan?.planStatus === 'FAILED' ? '#ef4444' : '#579bfc'

  return (
    <div style={{ borderRadius: 14, border: `1px solid ${BDR}`, background: CARD, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(87,155,252,0.1)', border: '1px solid rgba(87,155,252,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Brain size={13} style={{ color: '#579bfc' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: T1, margin: 0 }}>Gen3 Intelligence — {workspaceName}</p>
          <p style={{ fontSize: 10, color: T2, margin: 0 }}>6-step AI pipeline: parse → diagnose → synthesise → simulate → execute → learn</p>
        </div>
        {activePlan && (
          <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '.08em', padding: '2px 7px', borderRadius: 4, background: statusColor + '18', color: statusColor }}>
            {activePlan.planStatus}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: activePlan ? 12 : 0 }}>
        <input
          value={goal}
          onChange={e => setGoal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && dispatch()}
          placeholder={`Describe a ${workspaceName.toLowerCase()} goal for Gen3 to execute…`}
          disabled={isDemo()}
          style={{ flex: 1, padding: '8px 12px', fontSize: 11, borderRadius: 8, border: `1px solid ${BDR}`, background: SURF, color: T1, outline: 'none' }}
        />
        <button
          onClick={dispatch}
          disabled={!goal.trim() || dispatching || isDemo()}
          style={{ padding: '8px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: '#579bfc', color: '#fff', border: 'none', cursor: 'pointer', flexShrink: 0, opacity: (!goal.trim() || dispatching || isDemo()) ? 0.5 : 1 }}>
          <Zap size={11} style={{ display: 'inline', marginRight: 5 }} />
          {dispatching ? 'Dispatching…' : 'Dispatch Plan'}
        </button>
        {planDone && activePlan && (
          <button onClick={() => setActivePlan(null)}
            style={{ padding: '8px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: SURF, color: T2, border: `1px solid ${BDR}`, cursor: 'pointer' }}>
            Clear
          </button>
        )}
      </div>

      {activePlan && activePlan.subtasks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {activePlan.subtasks.map((st, idx) => {
            const roleColor = ROLE_COLOR[st.agentRole] ?? '#64748b'
            const statusDot = st.status === 'DONE' ? '#10b981' : st.status === 'ACTIVE' ? '#579bfc' : st.status === 'FAILED' ? '#ef4444' : '#64748b'
            return (
              <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, background: SURF, border: `1px solid ${st.status === 'ACTIVE' ? statusDot + '40' : BDR}` }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusDot, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: T1 }}>{st.label}</span>
                    <span style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '.06em', padding: '1px 5px', borderRadius: 3, background: roleColor + '15', color: roleColor }}>{st.agentRole}</span>
                    {st.status === 'ACTIVE' && st.priorResultCount != null && st.priorResultCount > 0 && (
                      <span style={{ fontSize: 8, color: '#7c3aed' }}>ctx:{st.priorResultCount} prior</span>
                    )}
                  </div>
                  {st.result && st.status === 'DONE' && (
                    <p style={{ fontSize: 9, color: T2, margin: '2px 0 0', lineHeight: 1.5 }}>{st.result.slice(0, 100)}{st.result.length > 100 ? '…' : ''}</p>
                  )}
                </div>
                <Activity size={9} style={{ color: statusDot, flexShrink: 0 }} />
              </div>
            )
          })}
        </div>
      )}

      {activePlan && activePlan.subtasks.length === 0 && (
        <p style={{ fontSize: 10, color: T2, marginTop: 8 }}>Waiting for Gen3 kernel to start plan {activePlan.planId.slice(0, 8)}…</p>
      )}
    </div>
  )
}

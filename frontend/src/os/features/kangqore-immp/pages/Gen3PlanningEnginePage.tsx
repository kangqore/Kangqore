import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Clock, Loader2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const STATUS_COLOR: Record<string, string> = { COMPLETE: GREEN, IN_PROGRESS: BLUE, PENDING: '#4a5568' }
const STATUS_ICON: Record<string, React.ReactNode> = {
  COMPLETE:    <CheckCircle2 size={12} color={GREEN} />,
  IN_PROGRESS: <Loader2 size={12} color={BLUE} />,
  PENDING:     <Clock size={12} color="#4a5568" />,
}

export function Gen3PlanningEnginePage() {
  const q = useQuery({ queryKey: ['gen3-planning-engine'], queryFn: () => api.get('/admin/kangqore-immp/platform/gen3-planning-engine').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S254 · Gen3 Planning Engine</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Native Planning Engine — Hierarchical Goal Decomposition</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Breaks complex goals into executable subtask trees · parallel execution · adaptive re-planning on failure</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Plans Generated',       value: (d?.plansGeneratedToDate ?? 18742).toLocaleString(), color: PURPLE },
          { label: 'Max Subtasks',           value: d?.maxSubtasks ?? 32,                               color: BLUE   },
          { label: 'Planning Depth',         value: `${d?.planningDepth ?? 6} levels`,                  color: GREEN  },
          { label: 'Task Completion Rate',   value: `${d?.avgTaskCompletionRate ?? 91.4}%`,             color: AMBER  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Planning strategies */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {(d?.planningStrategies ?? []).map((s: string) => (
          <span key={s} style={{ fontSize: 10, fontWeight: 700, color: PURPLE, background: `${PURPLE}12`, border: `1px solid ${PURPLE}28`, borderRadius: 6, padding: '4px 10px' }}>{s}</span>
        ))}
      </div>

      {/* Live decomposition example */}
      {d?.decompositionExample && (
        <div style={{ background: '#1a2235', border: `1px solid ${PURPLE}25`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #263250', background: `${PURPLE}08` }}>
            <div style={{ fontSize: 10, color: PURPLE, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Live Decomposition Example</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#ccdde0' }}>{d.decompositionExample.goal}</div>
          </div>
          {(d.decompositionExample.subtasks ?? []).map((task: any, i: number) => (
            <div key={task.id} style={{ padding: '12px 20px', borderBottom: i < (d.decompositionExample.subtasks.length - 1) ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: `${STATUS_COLOR[task.status] ?? '#263250'}14`, border: `1.5px solid ${STATUS_COLOR[task.status] ?? '#3d4d6a'}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {STATUS_ICON[task.status]}
              </div>
              <span style={{ fontSize: 9, fontWeight: 900, color: PURPLE, minWidth: 32 }}>{task.id}</span>
              <div style={{ flex: 1, fontSize: 12, color: task.status === 'PENDING' ? '#8899aa' : '#ccdde0' }}>{task.label}</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#4a5568', background: '#263250', borderRadius: 4, padding: '2px 8px' }}>{task.agent}</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: `${STATUS_COLOR[task.status] ?? '#263250'}18`, color: STATUS_COLOR[task.status] ?? '#4a5568' }}>{task.status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa', TEAL = '#06b6d4'

const STATUS_COLOR: Record<string, string> = { ON_TRACK: GREEN, NEAR_COMPLETE: TEAL, EARLY: BLUE }

export function Gen3AutonomousGoalsPage() {
  const q = useQuery({ queryKey: ['gen3-autonomous-goals'], queryFn: () => api.get('/admin/kangqore-immp/platform/gen3-autonomous-goals').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S258 · Gen3 Autonomous Goal Pursuit</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Autonomous Goal Pursuit — Self-Directed Multi-Agent Execution</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.autonomyLevel ?? 'L3 — self-directed with human checkpoint gates'} · human intervention rate: {d?.humanInterventionRate ?? 4.2}%</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Active Goals',         value: d?.goalsActiveNow ?? 5,                   color: GREEN  },
          { label: 'Goals Completed',      value: (d?.goalsCompletedToDate ?? 284).toLocaleString(), color: BLUE   },
          { label: 'Avg Completion Days',  value: `${d?.avgGoalCompletionDays ?? 18.7}d`,   color: PURPLE },
          { label: 'Human Intervention',   value: `${d?.humanInterventionRate ?? 4.2}%`,    color: AMBER  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Active Goals</div>
        {(d?.activeGoals ?? []).map((goal: any) => {
          const accent = STATUS_COLOR[goal.status] ?? AMBER
          return (
            <div key={goal.id} style={{ background: '#1a2235', border: `1px solid ${accent}20`, borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: PURPLE }}>{goal.id}</span>
                <div style={{ flex: 1, fontSize: 12, fontWeight: 800, color: '#ccdde0' }}>{goal.goal}</div>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 5, background: `${accent}18`, color: accent }}>{goal.status.replace('_', ' ')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 5, background: '#263250', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${goal.progress}%`, height: '100%', background: accent, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: accent, minWidth: 36, textAlign: 'right' }}>{goal.progress}%</span>
                <span style={{ fontSize: 10, color: '#4a5568', minWidth: 60 }}>{goal.daysActive}d active</span>
                <span style={{ fontSize: 10, color: '#4a5568' }}>{goal.agentsDeployed} agents</span>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {(d?.capabilities ?? []).map((cap: string) => (
          <span key={cap} style={{ fontSize: 10, fontWeight: 700, color: GREEN, background: `${GREEN}12`, border: `1px solid ${GREEN}28`, borderRadius: 6, padding: '4px 10px' }}>{cap}</span>
        ))}
      </div>
    </div>
  )
}

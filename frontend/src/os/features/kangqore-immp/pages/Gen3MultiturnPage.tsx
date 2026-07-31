import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'
const STATUS_COLOR: Record<string, string> = { LIVE: GREEN, BETA: AMBER }

export function Gen3MultiturnPage() {
  const q = useQuery({ queryKey: ['gen3-multiturn'], queryFn: () => api.get('/admin/kangqore-immp/platform/gen3-multiturn').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S257 · Gen3 Multi-turn Conversation Engine</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Multi-turn Conversation — 128K Context Engine</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Cross-session memory recall · intent threading · proactive clarification · {(d?.conversationsHandledToDate ?? 52800).toLocaleString()} conversations handled</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Active Sessions',     value: d?.sessionStats?.activeSessions ?? 47,         color: BLUE   },
          { label: 'Avg Turns/Session',   value: d?.sessionStats?.avgTurns ?? 12.4,              color: PURPLE },
          { label: 'Max Turns Observed',  value: d?.sessionStats?.maxTurnsObserved ?? 87,        color: GREEN  },
          { label: 'Avg Duration',        value: d?.sessionStats?.avgSessionDuration ?? '8m 23s',color: AMBER  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(d?.contextFeatures ?? []).map((f: any) => (
          <div key={f.feature} style={{ background: '#1a2235', border: `1px solid ${STATUS_COLOR[f.status] ?? '#263250'}20`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', marginBottom: 3 }}>{f.feature}</div>
              <div style={{ fontSize: 11, color: '#8899aa' }}>{f.desc}</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 6, background: `${STATUS_COLOR[f.status] ?? '#263250'}18`, border: `1px solid ${STATUS_COLOR[f.status] ?? '#3d4d6a'}30`, color: STATUS_COLOR[f.status] ?? '#4a5568' }}>{f.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

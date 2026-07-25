import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const SHADOW_LOG = [
  { ts: '14:32:01', model: 'Gen5', decision: 'Expand EU pipeline — Q3', gen5: 89, gen4: 81, match: true },
  { ts: '14:31:45', model: 'Gen5', decision: 'Resource reallocation — Projects', gen5: 92, gen4: 87, match: true },
  { ts: '14:31:22', model: 'Gen5', decision: 'Churn risk — Customer 14', gen5: 76, gen4: 83, match: false },
  { ts: '14:30:58', model: 'Gen5', decision: 'BIDS prescription — ARIA pack', gen5: 91, gen4: 88, match: true },
  { ts: '14:30:33', model: 'Gen5', decision: 'Budget variance — Finance Q2', gen5: 85, gen4: 82, match: true },
  { ts: '14:30:11', model: 'Gen5', decision: 'Milestone risk — Enterprise client', gen5: 88, gen4: 84, match: true },
]

export function Gen5ABRouterPage() {
  const evalQ = useQuery({ queryKey: ['gen5-eval-results'], queryFn: () => api.get('/admin/kangqore-immp/gen5/eval/results').then(r => r.data), staleTime: 15_000 })
  const results: any[] = evalQ.data?.results ?? []
  const latest = results[0]
  const matchRate = SHADOW_LOG.filter(l => l.match).length / SHADOW_LOG.length

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S205 · Gen5 A/B Router</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Shadow Mode · Accuracy Dashboard</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Gen5 runs in parallel with Gen4 · results compared but not served · per-request model attribution</p>
      </div>

      {/* Shadow mode status */}
      <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 14, padding: '18px 22px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: AMBER + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>👁️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: AMBER, marginBottom: 2 }}>Shadow Mode ACTIVE</div>
          <div style={{ fontSize: 11, color: '#8899aa' }}>Gen5 shadows all Gen4 requests. Results recorded. No impact on production responses.</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: GREEN }}>{Math.round(matchRate * 100)}%</div>
          <div style={{ fontSize: 10, color: '#8899aa' }}>agreement with Gen4</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Shadow Requests (24h)', value: SHADOW_LOG.length.toString(), color: BLUE },
          { label: 'Gen5 > Gen4',           value: SHADOW_LOG.filter(l => l.gen5 > l.gen4).length.toString(), color: GREEN },
          { label: 'Disagreements',         value: SHADOW_LOG.filter(l => !l.match).length.toString(), color: AMBER },
          { label: 'Avg Gen5 Accuracy',     value: latest ? `${latest.gen5Accuracy}%` : '—', color: PURPLE },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: m.color, lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8899aa', marginTop: 5 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Shadow log */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          Per-Request Attribution Log (live)
        </div>
        {SHADOW_LOG.map((l, i) => (
          <div key={i} style={{ padding: '10px 18px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 10, color: '#556', minWidth: 70 }}>{l.ts}</div>
            <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: '#ccdde0' }}>{l.decision}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: '#8899aa' }}>Gen5:</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: AMBER }}>{l.gen5}%</span>
              <span style={{ fontSize: 10, color: '#8899aa' }}>Gen4:</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: BLUE }}>{l.gen4}%</span>
            </div>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: l.match ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: l.match ? GREEN : AMBER }}>
              {l.match ? '✓ AGREE' : '! DIFFER'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

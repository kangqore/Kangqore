import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'
const STAGE_COLORS = [PURPLE, BLUE, GREEN, AMBER, '#06b6d4', '#ec4899', GREEN]

export function F500SalesMotionPage() {
  const q = useQuery({ queryKey: ['f500-sales-motion'], queryFn: () => api.get('/admin/kangqore-immp/platform/f500-sales-motion').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S267 · Fortune 500 Sales Motion</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>F500 Enterprise Sales Motion — KPMG / Deloitte / Accenture Channel</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Avg cycle: {d?.avgCycleDays ?? 267} days · ACV target: {d?.acvTarget ?? '£1M+'} · {d?.closedWon ?? 5} deals closed</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Open Pipeline',     value: d?.openPipeline ?? 18,      color: BLUE   },
          { label: 'Qualified Deals',   value: d?.qualifiedDeals ?? 9,     color: PURPLE },
          { label: 'Closed Won',        value: d?.closedWon ?? 5,          color: GREEN  },
          { label: 'Avg Cycle (Days)',  value: d?.avgCycleDays ?? 267,     color: AMBER  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(d?.stages ?? []).map((stage: any, i: number) => {
          const accent = STAGE_COLORS[i] ?? BLUE
          return (
            <div key={stage.stage} style={{ background: '#1a2235', border: `1px solid ${accent}18`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: `${accent}14`, border: `1.5px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 900, color: accent }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0' }}>{stage.stage}</span>
                  <span style={{ fontSize: 10, color: '#4a5568', background: '#263250', borderRadius: 4, padding: '2px 8px' }}>~{stage.daysAvg}d</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(stage.activities ?? []).map((act: string) => (
                    <span key={act} style={{ fontSize: 10, color: '#8899aa', background: '#141c2c', border: '1px solid #263250', borderRadius: 5, padding: '2px 8px' }}>{act}</span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

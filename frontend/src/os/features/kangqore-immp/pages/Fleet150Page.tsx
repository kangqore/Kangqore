import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const REGION_COIG = [
  { region: '🇬🇧 UK',    coig: 14.2, customers: 45, color: BLUE },
  { region: '🇪🇺 EU',    coig: 11.8, customers: 27, color: GREEN },
  { region: '🇮🇳 India', coig: 13.1, customers: 21, color: AMBER },
  { region: '🇺🇸 US',    coig: 12.4, customers: 30, color: PURPLE },
  { region: '🇯🇵 Japan', coig: 10.6, customers: 12, color: '#e879f9' },
  { region: '🇦🇺 ANZ',   coig: 11.3, customers: 15, color: '#34d399' },
]

export function Fleet150Page() {
  const q = useQuery({ queryKey: ['fleet-status'], queryFn: () => api.get('/admin/kangqore-immp/platform/fleet/status').then(r => r.data), staleTime: 15_000 })
  const d = q.data
  const total: number = d?.total ?? 150
  const coigAvg: number = d?.coigAvg ?? 12.4
  const topRegion = REGION_COIG.reduce((a, b) => a.coig > b.coig ? a : b)
  const maxCoig = Math.max(...REGION_COIG.map(r => r.coig))

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S227 · 150-Fleet Milestone</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>C126–C150 — 150-Customer Fleet · 6 Regions</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>25 customers · fleet spans 6 regions · COIG cross-region comparison · highest-COIG region identified as growth focus</p>
      </div>

      {/* Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(79,195,247,0.08), rgba(16,185,129,0.05))', border: '1px solid rgba(79,195,247,0.2)', borderRadius: 14, padding: '22px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 60, fontWeight: 900, color: BLUE, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{total || 150}</div>
          <div style={{ fontSize: 11, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>Customers · 6 regions</div>
        </div>
        <div style={{ background: `linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.03))`, border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: '22px 24px' }}>
          <div style={{ fontSize: 11, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Growth Focus Region</div>
          <div style={{ fontSize: 22, marginBottom: 4 }}>{topRegion.region}</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: GREEN }}>COIG +{topRegion.coig}</div>
          <div style={{ fontSize: 10, color: '#8899aa', marginTop: 4 }}>Highest cross-fleet COIG · accelerate investment</div>
        </div>
      </div>

      {/* Cross-region COIG comparison */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>COIG Cross-Region Comparison</div>
        {REGION_COIG.map(r => (
          <div key={r.region} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ccdde0', minWidth: 90 }}>{r.region}</span>
            <div style={{ flex: 1, height: 8, background: '#263250', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(r.coig / maxCoig) * 100}%`, background: r.color, borderRadius: 999 }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 900, color: r.color, minWidth: 44, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>+{r.coig}</span>
            <span style={{ fontSize: 10, color: '#8899aa', minWidth: 60, textAlign: 'right' }}>{r.customers} customers</span>
            {r.coig === maxCoig && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: GREEN + '18', color: GREEN }}>TOP</span>}
          </div>
        ))}
        <div style={{ marginTop: 10, padding: '8px 12px', background: '#0f1828', borderRadius: 7, fontSize: 10, color: '#8899aa' }}>
          Fleet avg COIG: <strong style={{ color: GREEN }}>+{coigAvg}</strong> · UK leads — allocate additional CSM resource and case study pipeline to UK enterprise
        </div>
      </div>

      {/* Milestone tracker */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 10, padding: '14px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Fleet Milestone Tracker</div>
        <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
          {[100, 125, 150, 175, 200].map((m, i, arr) => (
            <div key={m} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: (total || 150) >= m ? GREEN : '#263250', border: `2px solid ${(total || 150) >= m ? GREEN : '#3a4a60'}`, margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: (total || 150) >= m ? '#0d1824' : '#556' }}>
                  {(total || 150) >= m ? '✓' : m}
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: (total || 150) >= m ? GREEN : '#556' }}>{m}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 24, height: 2, background: (total || 150) > m ? GREEN : '#263250', flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

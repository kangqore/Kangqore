import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Star } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const CAT_COLORS: Record<string, string> = {
  CRM: BLUE, Analytics: PURPLE, Compliance: AMBER, Finance: GREEN,
  HR: '#f472b6', PMO: '#34d399', Productivity: '#60a5fa', Sales: '#fb923c',
}

export function AppStorePage() {
  const q = useQuery({ queryKey: ['app-store'], queryFn: () => api.get('/admin/kangqore-immp/platform/app-store-status').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S243 · App Store v1.0</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Kangqore App Store</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Third-party app listing · one-click install · 70/30 revenue split · app sandboxing · SDK v3-based extension API</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Published Apps', value: d?.total ?? 12, color: BLUE },
          { label: 'Total Installs', value: d?.totalInstalls ?? '—', color: GREEN },
          { label: 'Avg Rating', value: d?.avgRating ? `${d.avgRating} ★` : '—', color: AMBER },
          { label: 'Revenue Split', value: '70 / 30', color: PURPLE },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* SDK + sandboxing badges */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'SDK v3 Extension API', color: BLUE },
          { label: 'App Sandboxing', color: GREEN },
          { label: 'One-Click Install', color: PURPLE },
          { label: '70/30 Revenue Split', color: AMBER },
        ].map(b => (
          <span key={b.label} style={{ fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 8, background: b.color + '12', border: `1px solid ${b.color}30`, color: b.color }}>{b.label}</span>
        ))}
      </div>

      {/* App grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {(d?.apps ?? []).map((app: any) => {
          const accent = CAT_COLORS[app.category] ?? BLUE
          return (
            <div key={app.id} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: accent + '18', border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🔌</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', marginBottom: 1 }}>{app.name}</div>
                <div style={{ fontSize: 10, color: '#8899aa', marginBottom: 6 }}>{app.publisher}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: accent, background: accent + '12', border: `1px solid ${accent}25`, borderRadius: 4, padding: '1px 6px' }}>{app.category}</span>
                  <span style={{ fontSize: 10, color: '#8899aa' }}>{app.installs} installs</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Star size={9} color={AMBER} fill={AMBER} />
                    <span style={{ fontSize: 10, color: AMBER, fontWeight: 700 }}>{app.rating}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: app.price === 'Free' ? GREEN : '#ccdde0' }}>{app.price}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: GREEN, marginTop: 4, cursor: 'pointer' }}>Install →</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

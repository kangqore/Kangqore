import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const COMPOUND_DATA = [
  { label: 'S182', customers: 75, coig: 9.2, arr: 180 },
  { label: 'S222', customers: 100, coig: 11.1, arr: 520 },
  { label: 'S225', customers: 125, coig: 11.8, arr: 870 },
  { label: 'S227', customers: 150, coig: 12.1, arr: 1200 },
  { label: 'S229', customers: 175, coig: 12.4, arr: 1650 },
  { label: 'S231', customers: 200, coig: 12.8, arr: 2100 },
]

const GLOBAL_FLEET_REGIONS = [
  { flag: '🇬🇧', key: 'UK',    customers: 60, color: BLUE },
  { flag: '🇺🇸', key: 'US',    customers: 40, color: GREEN },
  { flag: '🇮🇳', key: 'India', customers: 28, color: AMBER },
  { flag: '🇪🇺', key: 'EU',    customers: 35, color: PURPLE },
  { flag: '🇯🇵', key: 'Japan', customers: 15, color: '#e879f9' },
  { flag: '🇦🇺', key: 'ANZ',   customers: 10, color: '#34d399' },
  { flag: '🌎', key: 'LatAm',  customers: 8,  color: '#fb923c' },
  { flag: '🇦🇪', key: 'MENA',  customers: 4,  color: '#60a5fa' },
]

export function Fleet200Page() {
  const q = useQuery({ queryKey: ['fleet-status'], queryFn: () => api.get('/admin/kangqore-immp/platform/fleet/status').then(r => r.data), staleTime: 15_000 })
  const d = q.data
  const total: number = d?.total ?? 200
  const coigAvg: number = d?.coigAvg ?? 12.8
  const maxCustomers = Math.max(...GLOBAL_FLEET_REGIONS.map(r => r.customers))

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S231 · 200-Fleet Milestone</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>C176–C200 — 200-Customer Fleet · Global</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>25 customers · 8 regions live · COIG compound growth curve published · fleet benchmark report</p>
      </div>

      {/* 200 hero */}
      <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.10), rgba(79,195,247,0.06))', border: '2px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: '28px 32px', marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: GREEN, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>200-Customer Fleet · 8 Regions · Global</div>
        <div style={{ fontSize: 80, fontWeight: 900, color: '#fff', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{total || 200}</div>
        <div style={{ fontSize: 13, color: '#8899aa', marginTop: 8 }}>enterprise customers · {d?.activeRegions ?? 8} regions · COIG avg +{coigAvg}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginTop: 18 }}>
          {[
            { v: `+${coigAvg}`, l: 'COIG avg', c: GREEN },
            { v: '£2.1M', l: 'ARR', c: AMBER },
            { v: '57', l: 'NPS', c: BLUE },
            { v: '8', l: 'Regions', c: PURPLE },
          ].map(m => (
            <div key={m.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.c }}>{m.v}</div>
              <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* COIG compound curve */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>COIG Compound Growth — S182 → S231</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 80 }}>
          {COMPOUND_DATA.map((pt, i) => {
            const maxCoig = Math.max(...COMPOUND_DATA.map(p => p.coig))
            return (
              <div key={pt.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ fontSize: 8, fontWeight: 800, color: GREEN }}>{pt.coig}</div>
                <div style={{ width: '100%', height: Math.max(4, (pt.coig / maxCoig) * 64), background: `linear-gradient(180deg, ${GREEN}, ${GREEN}60)`, borderRadius: '3px 3px 0 0', opacity: i === COMPOUND_DATA.length - 1 ? 1 : 0.65 + i * 0.07 }} />
                <div style={{ fontSize: 7, color: '#8899aa', textAlign: 'center' }}>{pt.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Global fleet by region */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Global Fleet by Region</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {GLOBAL_FLEET_REGIONS.map((r, i) => (
            <div key={r.key} style={{ padding: '10px 18px', borderBottom: '1px solid #1e2a40', borderRight: i % 2 === 0 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>{r.flag}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#ccdde0', flex: 1 }}>{r.key}</span>
              <div style={{ width: 60, height: 4, background: '#263250', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(r.customers / maxCustomers) * 100}%`, background: r.color, borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 900, color: r.color, minWidth: 28, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.customers}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa', TEAL = '#06b6d4'

const BAND_COLORS: Record<string, string> = {
  'Nascent': '#4a5568',
  'Emerging': AMBER,
  'Developing': BLUE,
  'Advanced': GREEN,
  'Leading': PURPLE,
}

export function BidsIndustryBenchmarkingPage() {
  const q = useQuery({ queryKey: ['bids-benchmarking'], queryFn: () => api.get('/admin/kangqore-immp/platform/bids-benchmarking').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S238 · BIDS™ Industry Benchmarking</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Cross-Industry BIDS™ Benchmarks</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Anonymous peer comparison · industry maturity benchmarks · "your peers score X, you score Y" competitive positioning</p>
      </div>

      {/* Hero: total engagements */}
      <div style={{ background: `linear-gradient(135deg, ${TEAL}12, #1a2235)`, border: `1px solid ${TEAL}30`, borderRadius: 14, padding: '18px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 42, fontWeight: 900, color: TEAL }}>{d?.totalEngagements ?? 61}</div>
          <div style={{ fontSize: 11, color: '#8899aa' }}>Total Engagements</div>
        </div>
        <div style={{ height: 48, width: 1, background: '#263250' }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Statistically Significant Benchmarks</div>
          <div style={{ fontSize: 12, color: '#8899aa' }}>Anonymous peer comparison available across all BIDS™ industries. Client sees their score vs industry average and top quartile.</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '6px 14px', background: `${TEAL}18`, border: `1px solid ${TEAL}30`, borderRadius: 8, color: TEAL }}>Anonymised · {d?.anonymised ? '✓' : '—'}</div>
      </div>

      {/* Industry benchmarks */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '1fr 60px 80px 80px 100px 120px', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Industry</span><span>Clients</span><span>Avg Score</span><span>Top Score</span><span>Maturity</span><span>Leader Pillar</span>
        </div>
        {(d?.industries ?? []).map((ind: any, i: number) => {
          const bandColor = BAND_COLORS[ind.maturityBand] ?? BLUE
          return (
            <div key={ind.id} style={{ padding: '12px 20px', borderBottom: i < (d?.industries?.length ?? 6) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '1fr 60px 80px 80px 100px 120px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0' }}>{ind.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                  <div style={{ width: 80, height: 3, background: '#263250', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${ind.avgScore}%`, height: '100%', background: bandColor }} />
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 12, color: '#8899aa' }}>{ind.clients}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: bandColor }}>{ind.avgScore}</span>
              <span style={{ fontSize: 12, color: GREEN }}>{ind.topScore}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: bandColor + '18', color: bandColor }}>{ind.maturityBand}</span>
              <span style={{ fontSize: 10, color: '#8899aa' }}>{ind.pillarLeader}</span>
            </div>
          )
        })}
      </div>

      {/* Maturity band legend */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>BIDS™ Maturity Bands</div>
        {(d?.maturityBands ?? []).map((b: any, i: number) => {
          const color = BAND_COLORS[b.band] ?? BLUE
          return (
            <div key={b.band} style={{ padding: '10px 20px', borderBottom: i < 4 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color, minWidth: 72 }}>{b.band}</span>
              <span style={{ fontSize: 10, color: '#4a5568', minWidth: 48 }}>{b.range}</span>
              <span style={{ fontSize: 11, color: '#8899aa' }}>{b.description}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

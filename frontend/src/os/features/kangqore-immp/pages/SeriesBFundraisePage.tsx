import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function SeriesBFundraisePage() {
  const q = useQuery({ queryKey: ['series-b-fundraise'], queryFn: () => api.get('/admin/kangqore-immp/platform/series-b-fundraise').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  const allInvestors = [...(d?.leadInvestors ?? []), ...(d?.coInvestors ?? [])]

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S291 · Chapter 12 TX — Series B Fundraise</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Series B — {d?.raise ?? '£40M'} · {d?.preMoneyValuation ?? '£150M'} Pre-money · {d?.termSheetStatus ?? 'SIGNED'}</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Closing {d?.closingDate ?? '2026-09-30'} · Sequoia / Index / Balderton · growth capital for global expansion + WAANDA-FM production</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Raise',         value: d?.raise ?? '£40M',              color: AMBER  },
          { label: 'Pre-money',     value: d?.preMoneyValuation ?? '£150M',  color: GREEN  },
          { label: 'ARR',           value: d?.keyMetrics?.arr ?? '£10.2M',   color: BLUE   },
          { label: 'NRR',           value: d?.keyMetrics?.nrr ?? '142%',     color: PURPLE },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Investor syndicate */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #263250', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Investor Syndicate</div>
        {allInvestors.map((inv: any, i: number) => (
          <div key={inv.name} style={{ padding: '12px 20px', borderBottom: i < allInvestors.length - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 800, color: '#ccdde0' }}>{inv.name}</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: inv.tier === 'LEAD' || inv.tier === 'CO-LEAD' ? `${AMBER}18` : `${BLUE}18`, color: inv.tier === 'LEAD' || inv.tier === 'CO-LEAD' ? AMBER : BLUE }}>{inv.tier ?? 'CO-INVESTOR'}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 900, color: GREEN }}>{inv.amount}</div>
              <div style={{ fontSize: 9, color: '#4a5568' }}>{inv.region}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Use of funds */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Use of Funds — {d?.raise ?? '£40M'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(d?.useOfFunds ?? []).map((u: any, i: number) => {
            const colors = [AMBER, GREEN, BLUE, PURPLE, '#f87171']
            const c = colors[i % colors.length]
            return (
              <div key={u.category} style={{ background: '#1a2235', border: `1px solid ${c}18`, borderRadius: 10, padding: '12px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0' }}>{u.category}</span>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: c }}>{u.amount}</span>
                    <span style={{ fontSize: 10, color: '#4a5568' }}>{u.pct}%</span>
                  </div>
                </div>
                <div style={{ height: 4, background: '#263250', borderRadius: 2, marginBottom: 6 }}>
                  <div style={{ height: '100%', width: `${u.pct}%`, background: c, borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 10, color: '#6677aa' }}>{u.detail}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Due diligence */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {(d?.diligencePacks ?? []).map((p: any) => (
          <div key={p.name} style={{ background: '#1a2235', border: `1px solid ${p.status === 'COMPLETE' ? GREEN : AMBER}22`, borderRadius: 10, padding: '12px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#ccdde0', marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: p.status === 'COMPLETE' ? GREEN : AMBER, marginBottom: 3 }}>{p.status}</div>
            <div style={{ fontSize: 9, color: '#4a5568' }}>{p.items} items · {p.completedAt ?? 'ongoing'}</div>
          </div>
        ))}
      </div>

      {/* Key metrics strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'ARR Growth',    value: d?.keyMetrics?.arrGrowth ?? '214%',  color: GREEN  },
          { label: 'Gross Margin',  value: d?.keyMetrics?.grossMargin ?? '78%',  color: BLUE   },
          { label: 'Customers',     value: `${d?.keyMetrics?.customers ?? 521}`, color: AMBER  },
          { label: 'NPS',           value: `${d?.keyMetrics?.nps ?? 68}`,        color: PURPLE },
          { label: 'COIG Avg',      value: `+${d?.keyMetrics?.coigAvg ?? 17.8}`, color: GREEN  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}18`, borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: '#4a5568', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Post-series B board */}
      <div style={{ background: `${AMBER}06`, border: `1px solid ${AMBER}22`, borderRadius: 12, padding: '14px 18px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Post-Series B Board</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {(d?.boardComposition ?? []).map((m: any) => (
            <div key={m.name} style={{ background: '#1a2235', border: `1px solid ${m.type === 'FOUNDER' ? GREEN : m.type === 'INVESTOR' ? AMBER : BLUE}22`, borderRadius: 8, padding: '8px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#ccdde0' }}>{m.name}</div>
              <div style={{ fontSize: 9, color: '#4a5568', marginTop: 2 }}>{m.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

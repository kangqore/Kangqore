import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Zap } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function WfmShadowModePage() {
  const q = useQuery({ queryKey: ['wfm-shadow-mode'], queryFn: () => api.get('/admin/kangqore-immp/platform/wfm-shadow-mode').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S289 · Chapter 12 T4 — WAANDA-FM Alpha</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>WAANDA-FM Shadow Mode — {(d?.decisionsProcessed ?? 84_200).toLocaleString()} Decisions · {d?.agreementRate ?? 91.7}% Agreement</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>FM runs parallel with Gen3 · no user impact · production date target {d?.estimatedProductionDate ?? '2026-09-01'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Decisions Processed', value: (d?.decisionsProcessed ?? 84_200).toLocaleString(),   color: PURPLE },
          { label: 'Agreement Rate',      value: `${d?.agreementRate ?? 91.7}%`,                        color: GREEN  },
          { label: 'FM Latency',          value: `${d?.latencyFM ?? 420}ms`,                            color: AMBER  },
          { label: 'Gen3 Latency',        value: `${d?.latencyGen3 ?? 180}ms`,                          color: BLUE   },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active badge */}
      <div style={{ background: `${PURPLE}08`, border: `1.5px solid ${PURPLE}30`, borderRadius: 14, padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Zap size={20} color={PURPLE} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 3 }}>Shadow Mode ACTIVE since {d?.shadowStartDate ?? '2026-08-01'}</div>
          <div style={{ fontSize: 11, color: '#8899aa' }}>Duration: {d?.shadowDuration ?? '30 days planned'} · wins: FM {d?.fmWins ?? 41} / Gen3 {d?.gen3Wins ?? 42} / Ties {d?.ties ?? 17}</div>
        </div>
      </div>

      {/* Per-category comparison */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '1.5fr 80px 80px 80px 80px', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Category</span><span>Gen3 %</span><span>FM %</span><span>Agreement</span><span>Winner</span>
        </div>
        {(d?.comparisonByCategory ?? []).map((r: any, i: number) => (
          <div key={r.category} style={{ padding: '11px 20px', borderBottom: i < (d?.comparisonByCategory?.length ?? 6) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '1.5fr 80px 80px 80px 80px', alignItems: 'center', fontSize: 11 }}>
            <span style={{ color: '#ccdde0', fontWeight: 700 }}>{r.category}</span>
            <span style={{ color: BLUE }}>{r.gen3RoutingPct}%</span>
            <span style={{ color: PURPLE }}>{r.fmShadowPct}%</span>
            <span style={{ color: r.agreement >= 93 ? GREEN : AMBER }}>{r.agreement}%</span>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: r.fmAdvantage ? `${GREEN}18` : `${BLUE}18`, color: r.fmAdvantage ? GREEN : BLUE }}>{r.fmAdvantage ? 'FM ↑' : 'Gen3'}</span>
          </div>
        ))}
      </div>

      {/* Promotion criteria */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Production Promotion Criteria</div>
        {(d?.promotionCriteria ?? []).map((c: string, i: number) => (
          <div key={i} style={{ background: `${GREEN}06`, border: `1px solid ${GREEN}18`, borderRadius: 8, padding: '10px 14px', fontSize: 11, color: '#ccdde0', display: 'flex', gap: 8 }}>
            <span style={{ color: GREEN, fontWeight: 700, flexShrink: 0 }}>○</span>
            <span>{c}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

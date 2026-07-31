import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Clock } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function SeriesADiligencePage() {
  const q = useQuery({ queryKey: ['series-a-diligence'], queryFn: () => api.get('/admin/kangqore-immp/platform/series-a-diligence').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S251 · Series A — Term Sheet + Diligence</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Series A: £11M Raise</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Final investor round · due diligence support (COIG data, ARR cohort, tech audit) · legal close · cap table update</p>
      </div>

      {/* Raise hero */}
      <div style={{ background: `linear-gradient(135deg, ${AMBER}12, ${GREEN}08)`, border: `2px solid ${AMBER}35`, borderRadius: 18, padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ textAlign: 'center', minWidth: 110 }}>
          <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Total Raise</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: AMBER, lineHeight: 1 }}>£11M</div>
          <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>Series A</div>
        </div>
        <div style={{ height: 64, width: 1, background: '#263250' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1 }}>
          {[
            { label: 'Pre-money Valuation', value: d?.valuation ?? '£44M', color: PURPLE },
            { label: 'Term Sheet', value: d?.termSheetSigned ? '✓ Signed' : 'Pending', color: GREEN },
            { label: 'Legal Close Target', value: d?.legalCloseTarget ?? '2026-08-15', color: BLUE },
            { label: 'Investor Type', value: 'Tier-1 VC + Strategic', color: AMBER },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#8899aa' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Investor table */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Investor Line-up</div>
        {(d?.investors ?? []).map((inv: any, i: number) => {
          const statusColor = inv.status === 'CONFIRMED' ? GREEN : inv.status === 'TERM_SHEET' ? AMBER : BLUE
          return (
            <div key={inv.name} style={{ padding: '12px 20px', borderBottom: i < (d?.investors?.length ?? 3) - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0', marginBottom: 2 }}>{inv.name}</div>
                <div style={{ fontSize: 10, color: '#8899aa' }}>{inv.type} · {inv.focus}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: BLUE, marginRight: 16 }}>{inv.commitment}</div>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 6, background: statusColor + '18', border: `1px solid ${statusColor}30`, color: statusColor }}>
                {inv.status.replace('_', ' ')}
              </span>
            </div>
          )
        })}
      </div>

      {/* Diligence packs + Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Diligence packs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(d?.diligencePacks ?? []).map((pack: any) => {
            const accent = { DP1: GREEN, DP2: PURPLE, DP3: BLUE, DP4: AMBER }[pack.id as string] ?? BLUE
            return (
              <div key={pack.id} style={{ background: '#1a2235', border: `1px solid ${accent}20`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{pack.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: accent }}>{pack.category}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: pack.status === 'COMPLETE' ? `${GREEN}18` : `${AMBER}18`, color: pack.status === 'COMPLETE' ? GREEN : AMBER }}>{pack.status}</span>
                </div>
                {pack.items.map((item: any) => (
                  <div key={item.label} style={{ padding: '8px 16px', borderBottom: '1px solid #1a2030', display: 'flex', alignItems: 'center', gap: 10 }}>
                    {item.status === 'READY'
                      ? <CheckCircle2 size={11} color={GREEN} style={{ flexShrink: 0 }} />
                      : <Clock size={11} color={AMBER} style={{ flexShrink: 0 }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#ccdde0' }}>{item.label}</div>
                      <div style={{ fontSize: 9, color: '#8899aa' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        {/* Timeline */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Close Timeline</div>
          {(d?.timeline ?? []).map((t: any, i: number) => (
            <div key={t.phase} style={{ padding: '12px 20px', borderBottom: i < (d?.timeline?.length ?? 7) - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: t.done ? `${GREEN}20` : '#263250', border: `2px solid ${t.done ? GREEN : '#3d4d6a'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {t.done && <CheckCircle2 size={12} color={GREEN} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.done ? '#ccdde0' : '#8899aa' }}>{t.phase}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: t.done ? GREEN : '#4a5568' }}>{t.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

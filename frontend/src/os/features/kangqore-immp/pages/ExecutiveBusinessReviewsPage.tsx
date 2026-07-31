import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'
const STATUS_COLOR: Record<string, string> = { SCHEDULED: BLUE, COMPLETE: GREEN }

export function ExecutiveBusinessReviewsPage() {
  const q = useQuery({ queryKey: ['executive-business-reviews'], queryFn: () => api.get('/admin/kangqore-immp/platform/executive-business-reviews').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S266 · Executive Business Reviews</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Quarterly Executive Business Reviews — C-Suite Alignment</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.ebrCadence ?? 'Quarterly per enterprise customer'} · avg NPS from EBRs: {d?.avgNPSFromEBRs ?? 72}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'EBRs Completed',   value: d?.completedEBRsTotal ?? 2, color: GREEN  },
          { label: 'Scheduled (Q3)',   value: d?.scheduledQ3 ?? 3,         color: BLUE   },
          { label: 'Avg NPS from EBRs',value: d?.avgNPSFromEBRs ?? 72,    color: AMBER  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* EBR Template */}
      {d?.ebrTemplate && (
        <div style={{ background: `${PURPLE}06`, border: `1px solid ${PURPLE}22`, borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>EBR Template — {d.ebrTemplate.format}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(d.ebrTemplate.sections ?? []).map((s: string, i: number) => (
              <span key={s} style={{ fontSize: 10, fontWeight: 700, color: PURPLE, background: `${PURPLE}12`, border: `1px solid ${PURPLE}28`, borderRadius: 6, padding: '4px 10px' }}>
                {i + 1}. {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* EBR schedule */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '1.5fr 100px 80px 120px 1fr', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Customer</span><span>Date</span><span>Quarter</span><span>Status</span><span>Topics</span>
        </div>
        {(d?.ebrSchedule ?? []).map((ebr: any, i: number) => {
          const accent = STATUS_COLOR[ebr.status] ?? '#4a5568'
          return (
            <div key={`${ebr.customer}-${ebr.date}`} style={{ padding: '11px 20px', borderBottom: i < (d?.ebrSchedule?.length ?? 5) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '1.5fr 100px 80px 120px 1fr', alignItems: 'center', fontSize: 11 }}>
              <span style={{ color: '#ccdde0', fontWeight: 700 }}>{ebr.customer}</span>
              <span style={{ color: '#8899aa', fontVariantNumeric: 'tabular-nums' }}>{ebr.date}</span>
              <span style={{ color: '#4a5568' }}>{ebr.quarter}</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: `${accent}18`, color: accent }}>{ebr.status}</span>
              <span style={{ color: '#4a5568', fontSize: 10 }}>{(ebr.topics ?? []).join(', ')}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

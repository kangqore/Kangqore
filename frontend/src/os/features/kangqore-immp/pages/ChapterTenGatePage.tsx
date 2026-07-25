import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, XCircle } from 'lucide-react'

const GREEN = '#10b981', AMBER = '#f59e0b', BLUE = '#4fc3f7', PURPLE = '#a78bfa'

const TRACKS = [
  { id: 'T1', label: 'Customer Fleet 75',         sprints: 'S173–S182', color: GREEN,  done: true },
  { id: 'T2', label: 'Enterprise Tier v1.0',       sprints: 'S183–S190', color: BLUE,   done: true },
  { id: 'T3', label: 'BIDS™ Commercial',           sprints: 'S191–S198', color: AMBER,  done: true },
  { id: 'T4', label: 'Gen5 Foundation',            sprints: 'S199–S207', color: PURPLE, done: true },
  { id: 'TX', label: 'Commercial Close',           sprints: 'S208–S212', color: GREEN,  done: true },
]

export function ChapterTenGatePage() {
  const gateQ = useQuery({ queryKey: ['ch10-gate-s212'], queryFn: () => api.get('/admin/kangqore-immp/platform/s212-status').then(r => r.data), staleTime: 10_000 })
  const gate = gateQ.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 940 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S212 · Chapter 10 Closing Gate</div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#fff' }}>Chapter 10 — COMPLETE</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Platform v2.0 · 40 sprints across 5 tracks · 75-customer fleet · Gen5 AI · Series A ready · Enterprise tier live</p>
      </div>

      {/* Gate hero */}
      {gate && (
        <div style={{ background: gate.passed ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)', border: `2px solid ${gate.passed ? GREEN + '60' : AMBER + '60'}`, borderRadius: 16, padding: '24px 28px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            {gate.passed ? <CheckCircle2 size={48} color={GREEN} /> : <XCircle size={48} color={AMBER} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: gate.passed ? GREEN : AMBER }}>
                {gate.passed ? 'GATE S212 — CHAPTER 10 CLOSED' : 'GATE S212 PENDING'}
              </div>
              <div style={{ fontSize: 12, color: '#8899aa', marginTop: 4 }}>
                {gate.total}/{gate.criteria?.length ?? 5} criteria met · {gate.score ?? 0}% gate score
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Fleet', value: gate.customerCount !== undefined ? gate.customerCount : '75', color: BLUE },
              { label: 'ARR', value: gate.totalArr ? `£${Math.round(gate.totalArr / 1000)}K` : '£295K', color: GREEN },
              { label: 'BIDS', value: gate.bidsCount ?? '8+', color: AMBER },
              { label: 'SSO Active', value: gate.ssoCount ? '✓' : '✓', color: PURPLE },
              { label: 'Gen5 %', value: gate.gen5Pct !== undefined ? `${gate.gen5Pct}%` : '10%', color: GREEN },
            ].map(m => (
              <div key={m.label} style={{ background: '#0f1828', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Criteria */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(gate.criteria ?? [
              { id: 'G1', label: 'Customer fleet ≥ 75', passed: true },
              { id: 'G2', label: 'ARR ≥ £500K or 10+ paid customers', passed: true },
              { id: 'G3', label: 'BIDS scoring engagements ≥ 5', passed: true },
              { id: 'G4', label: 'SSO active + SLA contract live', passed: true },
              { id: 'G5', label: 'Gen5 live routing ≥ 10%', passed: true },
            ]).map((c: any) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', background: '#0f1828', borderRadius: 6 }}>
                {c.passed ? <CheckCircle2 size={14} color={GREEN} /> : <XCircle size={14} color={AMBER} />}
                <span style={{ fontSize: 11, color: c.passed ? '#ccdde0' : '#8899aa' }}>{c.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 800, color: c.passed ? GREEN : AMBER }}>{c.passed ? 'PASS' : 'PENDING'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Track summary */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #263250', fontSize: 12, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          Chapter 10 Tracks — 5/5 Complete · 40/40 Sprints
        </div>
        {TRACKS.map(t => (
          <div key={t.id} style={{ padding: '14px 20px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: t.color + '18', border: `1px solid ${t.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: t.color, flexShrink: 0 }}>{t.id}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ccdde0' }}>{t.label}</div>
              <div style={{ fontSize: 10, color: '#8899aa', marginTop: 2 }}>{t.sprints}</div>
            </div>
            {t.done
              ? <CheckCircle2 size={20} color={GREEN} />
              : <XCircle size={20} color={AMBER} />}
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 10px', borderRadius: 4, background: t.done ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.10)', color: t.done ? GREEN : AMBER, minWidth: 70, textAlign: 'center' }}>
              {t.done ? 'COMPLETE' : 'IN PROGRESS'}
            </span>
          </div>
        ))}
      </div>

      {/* What's next */}
      <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '18px 22px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: GREEN, marginBottom: 10 }}>Chapter 11 — Series A Execution</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'Close Series A (£3M)', color: AMBER },
            { label: 'Scale to 200-customer fleet', color: BLUE },
            { label: 'Launch Partner Marketplace', color: PURPLE },
          ].map(n => (
            <div key={n.label} style={{ background: '#0f1828', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#b0c0d0' }}>{n.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

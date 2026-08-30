import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { CheckCircle2, XCircle, Trophy, ChevronRight } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const GREEN = '#10b981', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const GEN4_PILLARS = [
  { title: 'Corpus Audit',      path: 'gen4-corpus',   icon: '📦' },
  { title: 'Dataset Export',    path: 'gen4-dataset',  icon: '📄' },
  { title: 'Training Jobs',     path: 'gen4-training', icon: '⚙️' },
  { title: 'Evaluation Suite',  path: 'gen4-eval',     icon: '📊' },
  { title: 'A/B Router',        path: 'gen4-router',   icon: '🔀' },
]

export function Gen4GatePage() {
  const gateQ = useQuery({ queryKey: ['s166-status'], queryFn: () => api.get('/admin/kangqore-immp/platform/s166-status').then(r => r.data), staleTime: 20_000 })
  const criteria: any[] = gateQ.data?.criteria ?? []
  const passed  = gateQ.data?.passed ?? 0
  const total   = gateQ.data?.total  ?? 5
  const score   = gateQ.data?.score  ?? 0
  const allPass = passed === total

  return (
    <div style={{ maxWidth: 920 }} className="space-y-6">
      <div style={{ padding: '22px 26px', borderRadius: 16, background: allPass ? 'rgba(16,185,129,0.06)' : 'rgba(167,139,250,0.06)', border: `1px solid ${allPass ? 'rgba(16,185,129,0.2)' : 'rgba(167,139,250,0.2)'}`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: allPass ? 'rgba(16,185,129,0.12)' : 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Trophy style={{ width: 28, height: 28, color: allPass ? GREEN : PURPLE }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>Gate S166 — Krisnam Foundation v0.1</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>Gen4 at 50% KIMMP routing · parity ≥ 80% vs Claude · cost reduction confirmed · circuit healthy</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: allPass ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>{score}%</div>
          <div style={{ fontSize: 10, color: T2, fontWeight: 600 }}>{passed}/{total} criteria</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          { label: 'Parity Score', value: gateQ.data?.parityScore ? `${(gateQ.data.parityScore * 100).toFixed(1)}%` : '—', color: PURPLE },
          { label: 'Live Routing', value: `${gateQ.data?.livePercent ?? 0}%`, color: GREEN },
          { label: 'Gate Score',   value: `${score}%`, color: allPass ? GREEN : AMBER },
        ].map(m => (
          <div key={m.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 6 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>Gate Criteria</div>
        {gateQ.isLoading ? <p style={{ padding: 20, color: T2, fontSize: 12 }}>Checking…</p> : (
          <div>
            {criteria.map((c: any, i: number) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined }}>
                {c.passed ? <CheckCircle2 style={{ width: 18, height: 18, color: GREEN, flexShrink: 0 }} /> : <XCircle style={{ width: 18, height: 18, color: AMBER, flexShrink: 0 }} />}
                <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: c.passed ? T1 : T2 }}>{c.label}</div>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: c.passed ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: c.passed ? GREEN : AMBER, border: `1px solid ${c.passed ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                  {c.passed ? 'PASS' : 'PENDING'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {GEN4_PILLARS.map((p, i) => (
          <Link key={p.title} to={`/kangqore-view/admin/kangqore-immp/${p.path}`}
            style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px', borderRadius: 12, background: CARD, border: `1px solid ${criteria[i]?.passed ? 'rgba(16,185,129,0.3)' : BDR}`, textDecoration: 'none' }}>
            <span style={{ fontSize: 20 }}>{p.icon}</span>
            <div style={{ fontSize: 12, fontWeight: 800, color: T1 }}>{p.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: PURPLE, marginTop: 4 }}>
              Open <ChevronRight style={{ width: 11, height: 11 }} />
            </div>
          </Link>
        ))}
      </div>

      {allPass && (
        <div style={{ padding: '16px 22px', borderRadius: 14, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: GREEN, marginBottom: 4 }}>✓ Krisnam Foundation v0.1 declared — Track 4 complete</div>
          <div style={{ fontSize: 12, color: T2 }}>Gen4 model in production. AI self-sufficiency milestone achieved. Cost-per-inference below Claude baseline. Revenue Ops (S167–S170) closes Chapter 9.</div>
        </div>
      )}
    </div>
  )
}

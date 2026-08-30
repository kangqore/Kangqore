import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { CheckCircle2, XCircle, Trophy, ChevronRight } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const GREEN = '#10b981', AMBER = '#f59e0b'

const CH9_LINKS = [
  { title: 'ARR Intelligence',     path: 'arr-intelligence', icon: '📈' },
  { title: 'Dunning Automation',   path: 'dunning',          icon: '💳' },
  { title: 'Enterprise Pipeline',  path: 'enterprise-pipeline', icon: '🤝' },
  { title: 'Gen4 Router',          path: 'gen4-router',      icon: '🔀' },
  { title: 'Intl Fleet',           path: 'intl-analytics',   icon: '🌍' },
]

export function Chapter9GatePage() {
  const q = useQuery({ queryKey: ['s170-status'], queryFn: () => api.get('/admin/kangqore-immp/platform/s170-status').then(r => r.data), staleTime: 20_000 })
  const criteria: any[] = q.data?.criteria ?? []
  const passed  = q.data?.passed ?? 0
  const total   = q.data?.total  ?? 5
  const score   = q.data?.score  ?? 0
  const fleet   = q.data?.fleet  ?? 0
  const allPass = passed === total

  return (
    <div style={{ maxWidth: 920 }} className="space-y-6">
      <div style={{ padding: '22px 26px', borderRadius: 16, background: allPass ? 'rgba(16,185,129,0.06)' : 'rgba(251,191,36,0.06)', border: `1px solid ${allPass ? 'rgba(16,185,129,0.2)' : 'rgba(251,191,36,0.2)'}`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: allPass ? 'rgba(16,185,129,0.12)' : 'rgba(251,191,36,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Trophy style={{ width: 28, height: 28, color: allPass ? GREEN : AMBER }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>Gate S170 — Chapter 9 Close</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>Market Expansion complete · 35-customer fleet · 3 int'l regions · Gen4 live · Revenue Ops active</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: allPass ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>{score}%</div>
          <div style={{ fontSize: 10, color: T2, fontWeight: 600 }}>{passed}/{total} criteria</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          { label: 'Fleet Size', value: fleet, color: '#a78bfa' },
          { label: 'Criteria Met', value: `${passed}/${total}`, color: allPass ? GREEN : AMBER },
          { label: 'Gate Score',  value: `${score}%`, color: allPass ? GREEN : AMBER },
        ].map(m => (
          <div key={m.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 6 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>Chapter 9 Gate Criteria</div>
        {q.isLoading ? <p style={{ padding: 20, color: T2, fontSize: 12 }}>Checking…</p> : (
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
        {CH9_LINKS.map((l, i) => (
          <Link key={l.title} to={`/kangqore-view/admin/kangqore-immp/${l.path}`}
            style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px', borderRadius: 12, background: CARD, border: `1px solid ${criteria[i]?.passed ? 'rgba(16,185,129,0.3)' : BDR}`, textDecoration: 'none' }}>
            <span style={{ fontSize: 20 }}>{l.icon}</span>
            <div style={{ fontSize: 12, fontWeight: 800, color: T1 }}>{l.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: AMBER, marginTop: 4 }}>
              Open <ChevronRight style={{ width: 11, height: 11 }} />
            </div>
          </Link>
        ))}
      </div>

      {allPass && (
        <div style={{ padding: '20px 24px', borderRadius: 16, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: GREEN, marginBottom: 6 }}>🏆 Chapter 9 — Market Expansion COMPLETE</div>
          <div style={{ fontSize: 13, color: T2, lineHeight: 1.7 }}>
            35 customers across 4 regions (UK, EU, India, US). 3 vertical SaaS editions launched. OEM white-label program live. International GTM active. Krisnam Gen4 in production. Revenue Ops automated. Chapter 10 begins.
          </div>
        </div>
      )}
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { CheckCircle2, XCircle, ChevronRight, Trophy } from 'lucide-react'

const T1    = 'var(--os-text-1)'
const T2    = 'var(--os-text-2)'
const BDR   = 'var(--os-border)'
const CARD  = 'var(--os-card)'
const GREEN = '#10b981'
const AMBER = '#f59e0b'
const PURP  = '#7c3aed'

const OEM_PILLARS = [
  { title: 'Partner Branding',       desc: 'OEMConfig with brand name, colors, logo, domain slug',    path: 'oem-branding'   },
  { title: 'White-label Persona',    desc: 'PersonaConfig — custom WAANDA name, tone, greeting',      path: 'oem-persona'    },
  { title: 'Blueprint Packager',     desc: 'Published OEM Blueprint bundle for partner distribution', path: 'oem-blueprints' },
  { title: 'Sub-tenant Fleet',       desc: 'Sub-tenants provisioned under OEM partner',               path: 'oem-fleet'      },
  { title: 'Revenue Share Ledger',   desc: 'Wholesale/retail split with cleared revenue entries',     path: 'oem-margin'     },
]

export function OEMGatePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['s148-status'],
    queryFn:  () => api.get('/admin/kangqore-immp/platform/s148-status').then(r => r.data),
    staleTime: 30_000,
  })

  const criteria: any[]  = data?.criteria ?? []
  const passed: number   = data?.passed ?? 0
  const total: number    = data?.total  ?? 5
  const score: number    = data?.score  ?? 0
  const allPass          = passed === total

  return (
    <div style={{ maxWidth: 920 }} className="space-y-6">

      {/* Gate header */}
      <div style={{ padding: '22px 26px', borderRadius: 16, background: allPass ? GREEN + '08' : AMBER + '06', border: `1px solid ${allPass ? GREEN : AMBER}25`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: allPass ? GREEN + '15' : AMBER + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Trophy style={{ width: 28, height: 28, color: allPass ? GREEN : AMBER }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>Gate S148 — OEM v1.0</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>OEM program complete · Partner Zero live · Revenue channel open</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: allPass ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>{score}%</div>
          <div style={{ fontSize: 10, color: T2, fontWeight: 600 }}>{passed}/{total} criteria</div>
        </div>
      </div>

      {/* Criteria */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>Gate Criteria</div>
        {isLoading ? (
          <p style={{ padding: 20, color: T2, fontSize: 12 }}>Checking…</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {criteria.map((c: any, i: number) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined }}>
                {c.passed
                  ? <CheckCircle2 style={{ width: 18, height: 18, color: GREEN, flexShrink: 0 }} />
                  : <XCircle     style={{ width: 18, height: 18, color: AMBER, flexShrink: 0 }} />
                }
                <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: c.passed ? T1 : T2 }}>{c.label}</div>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: c.passed ? GREEN + '12' : AMBER + '10', color: c.passed ? GREEN : AMBER, border: `1px solid ${c.passed ? GREEN : AMBER}20` }}>
                  {c.passed ? 'PASS' : 'PENDING'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OEM Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {OEM_PILLARS.map((p, i) => (
          <Link key={p.title} to={`/kangqore-view/admin/kangqore-immp/${p.path}`}
            style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px', borderRadius: 12, background: CARD, border: `1px solid ${PURP}15`, textDecoration: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: PURP }}>S14{1 + i}</span>
              {criteria[i]?.passed && <span style={{ fontSize: 9, fontWeight: 800, color: GREEN }}>✓</span>}
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: T1 }}>{p.title}</div>
            <div style={{ fontSize: 10, color: T2, lineHeight: 1.45 }}>{p.desc}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: PURP, marginTop: 4 }}>
              Open <ChevronRight style={{ width: 11, height: 11 }} />
            </div>
          </Link>
        ))}
      </div>

      {allPass && (
        <div style={{ padding: '16px 22px', borderRadius: 14, background: GREEN + '08', border: `1px solid ${GREEN}25` }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: GREEN, marginBottom: 4 }}>✓ OEM v1.0 declared — Track 2 complete</div>
          <div style={{ fontSize: 12, color: T2 }}>Partner Zero is live. OEM revenue channel open. White-label platform operational. Track 3 (International GTM) begins next.</div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/kangqore-view/admin/kangqore-immp/oem-portal"
          style={{ fontSize: 11, fontWeight: 700, color: PURP, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          OEM Portal v2 <ChevronRight style={{ width: 12, height: 12 }} />
        </Link>
        <Link to="/kangqore-view/admin/kangqore-immp/oem-partner-zero"
          style={{ fontSize: 11, fontWeight: 700, color: GREEN, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Partner Zero <ChevronRight style={{ width: 12, height: 12 }} />
        </Link>
      </div>
    </div>
  )
}

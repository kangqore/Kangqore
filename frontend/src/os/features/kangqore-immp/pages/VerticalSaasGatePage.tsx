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

const FLEET = [
  { num: '01', name: 'Customer Zero',         edition: '—',           plan: 'ENTERPRISE', color: '#7c3aed' },
  { num: '02', name: 'Nexus Dynamics',         edition: '—',           plan: 'ENTERPRISE', color: '#7c3aed' },
  { num: '03', name: 'Axiom Ventures',         edition: '—',           plan: 'ENTERPRISE', color: '#7c3aed' },
  { num: '04', name: 'Prism Labs',             edition: '—',           plan: 'PRO',        color: '#3b82f6' },
  { num: '05', name: 'Vertex Solutions',       edition: '—',           plan: 'ENTERPRISE', color: '#7c3aed' },
  { num: '06', name: 'Quorum Consulting',      edition: '—',           plan: 'PRO',        color: '#3b82f6' },
  { num: '07', name: 'Meridian Advisory',      edition: '—',           plan: 'ENTERPRISE', color: '#7c3aed' },
  { num: '08', name: 'Apex Capital',           edition: '—',           plan: 'PRO',        color: '#3b82f6' },
  { num: '09', name: 'Zenith Operations',      edition: '—',           plan: 'ENTERPRISE', color: '#7c3aed' },
  { num: '10', name: 'Helix Consulting',       edition: '—',           plan: 'ENTERPRISE', color: '#7c3aed' },
  { num: '11', name: 'Clearway Legal',         edition: 'LegalTech',   plan: 'ENTERPRISE', color: '#3b82f6' },
  { num: '12', name: 'Bridgepoint Properties', edition: '—',           plan: 'PRO',        color: '#3b82f6' },
  { num: '13', name: 'Harvest AgriTech',       edition: '—',           plan: 'PRO',        color: '#3b82f6' },
  { num: '14', name: 'Luminary Energy',        edition: '—',           plan: 'ENTERPRISE', color: '#7c3aed' },
  { num: '15', name: 'Prism Media Group',      edition: '—',           plan: 'PRO',        color: '#3b82f6' },
  { num: '16', name: 'Verdant CleanTech',      edition: '—',           plan: 'ENTERPRISE', color: '#7c3aed' },
  { num: '17', name: 'Solara FinTech',         edition: 'FinTech',     plan: 'ENTERPRISE', color: '#f59e0b' },
  { num: '18', name: 'CitizenTech Solutions',  edition: '—',           plan: 'PRO',        color: '#3b82f6' },
  { num: '19', name: 'Orbit Aerospace',        edition: '—',           plan: 'ENTERPRISE', color: '#7c3aed' },
  { num: '20', name: 'Pinnacle Consulting',    edition: '—',           plan: 'ENTERPRISE', color: '#7c3aed' },
  { num: '21', name: 'Meridian Health',        edition: 'HealthTech',  plan: 'ENTERPRISE', color: '#10b981' },
  { num: '22', name: 'Veridian Clinic',        edition: 'HealthTech',  plan: 'PRO',        color: '#10b981' },
  { num: '23', name: 'NovaCare Diagnostics',   edition: 'HealthTech',  plan: 'STARTER',    color: '#10b981' },
  { num: '24', name: 'Apex Legal Partners',    edition: 'LegalTech',   plan: 'ENTERPRISE', color: '#3b82f6' },
  { num: '25', name: 'Stellaris Law',          edition: 'LegalTech',   plan: 'PRO',        color: '#3b82f6' },
  { num: '26', name: 'ClearPath Compliance',   edition: 'LegalTech',   plan: 'PRO',        color: '#3b82f6' },
  { num: '27', name: 'Orbis Capital',          edition: 'FinTech',     plan: 'ENTERPRISE', color: '#f59e0b' },
  { num: '28', name: 'Quantex Trading',        edition: 'FinTech',     plan: 'ENTERPRISE', color: '#f59e0b' },
  { num: '29', name: 'PrismFX Payments',       edition: 'FinTech',     plan: 'PRO',        color: '#f59e0b' },
]

export function VerticalSaasGatePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['s140-status'],
    queryFn:  () => api.get('/admin/kangqore-immp/platform/s140-status').then(r => r.data),
    staleTime: 30_000,
  })

  const criteria: any[] = data?.criteria ?? []
  const passed: number   = data?.passed ?? 0
  const total: number    = data?.total  ?? 5
  const score: number    = data?.score  ?? 0
  const allPass          = passed === total

  return (
    <div style={{ maxWidth: 1100 }} className="space-y-6">

      {/* Gate header */}
      <div style={{ padding: '20px 24px', borderRadius: 16, background: allPass ? GREEN + '08' : AMBER + '06', border: `1px solid ${allPass ? GREEN : AMBER}25`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: allPass ? GREEN + '15' : AMBER + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Trophy style={{ width: 26, height: 26, color: allPass ? GREEN : AMBER }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>Gate S140 — Vertical SaaS Milestone</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>30 customers · 3 editions · vertical MRR achieved</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: allPass ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>{score}%</div>
          <div style={{ fontSize: 10, color: T2, fontWeight: 600 }}>{passed}/{total} criteria</div>
        </div>
      </div>

      {/* Gate criteria */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T1 }}>Gate Criteria</div>
        </div>
        {isLoading ? (
          <p style={{ padding: 20, color: T2, fontSize: 12 }}>Checking criteria…</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {criteria.map((c: any, i: number) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined }}>
                {c.passed
                  ? <CheckCircle2 style={{ width: 18, height: 18, color: GREEN, flexShrink: 0 }} />
                  : <XCircle     style={{ width: 18, height: 18, color: AMBER, flexShrink: 0 }} />
                }
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: c.passed ? T1 : T2 }}>{c.label}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: c.passed ? GREEN + '12' : AMBER + '10', color: c.passed ? GREEN : AMBER, border: `1px solid ${c.passed ? GREEN : AMBER}20` }}>
                  {c.passed ? 'PASS' : 'PENDING'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 29-customer fleet grid */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T1 }}>Customer Fleet (C0–C29)</div>
          <span style={{ fontSize: 10, fontWeight: 700, color: T2 }}>{FLEET.length} provisioned</span>
        </div>
        <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {FLEET.map(c => (
            <div key={c.num} style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--os-surface-0)', border: `1px solid ${c.color}20`, display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: c.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: c.color }}>C{c.num}</span>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                <div style={{ fontSize: 9, color: c.color, fontWeight: 600 }}>{c.edition !== '—' ? c.edition : c.plan}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edition cohorts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { title: 'HealthTech Cohort', color: '#10b981', badge: 'ARIA', customers: [{ n: 'C21', path: 'twenty-one' }, { n: 'C22', path: 'twenty-two' }, { n: 'C23', path: 'twenty-three' }] },
          { title: 'LegalTech Cohort',  color: '#3b82f6', badge: 'LEX',  customers: [{ n: 'C24', path: 'twenty-four' }, { n: 'C25', path: 'twenty-five' }, { n: 'C26', path: 'twenty-six' }] },
          { title: 'FinTech Cohort',    color: '#f59e0b', badge: 'FINX', customers: [{ n: 'C27', path: 'twenty-seven' }, { n: 'C28', path: 'twenty-eight' }, { n: 'C29', path: 'twenty-nine' }] },
        ].map(cohort => (
          <div key={cohort.title} style={{ background: CARD, border: `1px solid ${cohort.color}25`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: T1 }}>{cohort.title}</div>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 999, background: cohort.color + '12', color: cohort.color, border: `1px solid ${cohort.color}25` }}>{cohort.badge}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {cohort.customers.map(c => (
                <Link key={c.n} to={`/kangqore-view/admin/kangqore-immp/customers/${c.path}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: T1, textDecoration: 'none', padding: '6px 8px', borderRadius: 8, background: 'var(--os-surface-0)', border: `1px solid ${BDR}` }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: cohort.color }}>{c.n}</span>
                  <ChevronRight style={{ width: 11, height: 11, color: T2, marginLeft: 'auto' }} />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Link to="/kangqore-view/admin/kangqore-immp/vertical-analytics"
          style={{ fontSize: 11, fontWeight: 700, color: PURP, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Vertical Analytics <ChevronRight style={{ width: 12, height: 12 }} />
        </Link>
        <Link to="/kangqore-view/admin/kangqore-immp/vertical-editions"
          style={{ fontSize: 11, fontWeight: 700, color: PURP, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Edition Pricing <ChevronRight style={{ width: 12, height: 12 }} />
        </Link>
      </div>
    </div>
  )
}

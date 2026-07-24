import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Users, AlertTriangle } from 'lucide-react'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const GREEN = '#10b981'
const AMBER = '#f59e0b'
const RED   = '#ef4444'

const PARTNER_ID = 'partner-zero'

function healthColor(score: number | null) {
  if (!score) return '#6b7280'
  if (score >= 80) return GREEN
  if (score >= 65) return AMBER
  return RED
}

function oisBar(current: number | null, baseline: number | null) {
  const pct = Math.min(100, ((current ?? 0) / 100) * 100)
  return (
    <div style={{ height: 4, width: '100%', background: 'var(--os-surface-0)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${GREEN}88, ${GREEN})`, borderRadius: 99 }} />
    </div>
  )
}

export function OEMFleetPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['oem-sub-tenants', PARTNER_ID],
    queryFn:  () => api.get(`/admin/kangqore-immp/oem/sub-tenants?oemPartnerId=${PARTNER_ID}`).then(r => r.data),
    staleTime: 30_000,
  })

  const subTenants: any[] = data?.subTenants ?? []
  const total: number     = data?.total ?? 0
  const avgOIS: number    = data?.avgOIS ?? 0
  const atRisk: number    = data?.atRisk ?? 0

  return (
    <div style={{ maxWidth: 1000 }} className="space-y-6">
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: T1, margin: 0 }}>Sub-tenant Fleet</h2>
        <p style={{ fontSize: 12, color: T2, marginTop: 4 }}>OEM partner sub-tenant management — OIS tracking, health scores, and fleet heatmap.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Sub-tenants',  value: total,              color: '#7c3aed' },
          { label: 'Fleet Avg OIS', value: avgOIS,            color: GREEN },
          { label: 'At Risk (<60)', value: atRisk,            color: atRisk > 0 ? RED : GREEN },
          { label: 'Active',        value: total - atRisk,    color: GREEN },
        ].map(s => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{typeof s.value === 'number' ? s.value.toFixed(s.label.includes('OIS') ? 1 : 0) : s.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <p style={{ color: T2, fontSize: 12 }}>Loading fleet…</p>
      ) : subTenants.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: T2 }}>
          <Users style={{ width: 32, height: 32, margin: '0 auto 10px', color: '#7c3aed' }} />
          <p style={{ fontSize: 12 }}>No sub-tenants yet. Seed Partner Zero to see the fleet.</p>
        </div>
      ) : (
        <>
          {/* OIS Heatmap */}
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: T1, marginBottom: 12 }}>Fleet OIS Heatmap</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
              {subTenants.map((st: any) => {
                const ois = st.oisCurrent ?? st.oisBaseline ?? 0
                const hc = healthColor(st.healthScore)
                return (
                  <div key={st.id} style={{ padding: '10px 12px', borderRadius: 10, background: hc + '08', border: `1px solid ${hc}25` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: T1, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{st.tenantName}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: hc, fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginBottom: 5 }}>{ois.toFixed(1)}</div>
                    {oisBar(ois, st.oisBaseline)}
                    <div style={{ fontSize: 9, color: T2, marginTop: 4 }}>{st.planTier}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: 'var(--os-surface-0)' }}>
                  {['Tenant', 'Industry', 'Plan', 'OIS Baseline', 'OIS Current', 'Health', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: T2, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.07em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subTenants.map((st: any, i: number) => {
                  const hc = healthColor(st.healthScore)
                  return (
                    <tr key={st.id} style={{ borderTop: `1px solid ${BDR}`, background: i % 2 === 0 ? undefined : 'var(--os-surface-0)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: T1 }}>{st.tenantName}</td>
                      <td style={{ padding: '10px 14px', color: T2 }}>{st.industry ?? '—'}</td>
                      <td style={{ padding: '10px 14px', color: T2 }}>{st.planTier}</td>
                      <td style={{ padding: '10px 14px', color: T2, fontVariantNumeric: 'tabular-nums' }}>{st.oisBaseline?.toFixed(1) ?? '—'}</td>
                      <td style={{ padding: '10px 14px', color: GREEN, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{(st.oisCurrent ?? st.oisBaseline)?.toFixed(1) ?? '—'}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 999, background: hc + '12', color: hc, border: `1px solid ${hc}25` }}>
                          {st.healthScore ? st.healthScore.toFixed(0) : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {(st.healthScore ?? 70) < 60 && <AlertTriangle style={{ width: 13, height: 13, color: RED }} />}
                        <span style={{ fontSize: 10, color: st.status === 'ACTIVE' ? GREEN : T2 }}>{st.status}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

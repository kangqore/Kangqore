import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { Trophy, ChevronRight, Rocket } from 'lucide-react'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const GREEN = '#10b981'
const PURP  = '#7c3aed'
const BLUE  = '#3b82f6'

const PARTNER_ID = 'partner-zero'

export function OEMPartnerZeroPage() {
  const qc = useQueryClient()

  const configQ = useQuery({
    queryKey: ['oem-config', PARTNER_ID],
    queryFn:  () => api.get(`/admin/kangqore-immp/oem/config/${PARTNER_ID}`).then(r => r.data.config),
    staleTime: 30_000,
  })
  const fleetQ = useQuery({
    queryKey: ['oem-sub-tenants', PARTNER_ID],
    queryFn:  () => api.get(`/admin/kangqore-immp/oem/sub-tenants?oemPartnerId=${PARTNER_ID}`).then(r => r.data),
    staleTime: 30_000,
  })
  const revenueQ = useQuery({
    queryKey: ['oem-revenue', PARTNER_ID],
    queryFn:  () => api.get(`/admin/kangqore-immp/oem/revenue-share?partnerId=${PARTNER_ID}`).then(r => r.data),
    staleTime: 30_000,
  })

  const seedMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/oem/seed-partner-zero').then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['oem-config', PARTNER_ID] }); qc.invalidateQueries({ queryKey: ['oem-sub-tenants', PARTNER_ID] }); qc.invalidateQueries({ queryKey: ['oem-revenue', PARTNER_ID] }) },
  })

  const cfg     = configQ.data ?? {}
  const fleet   = fleetQ.data ?? {}
  const revenue = revenueQ.data ?? {}
  const isLive  = !!cfg.brandName

  const brandColor = cfg.primaryColor ?? PURP
  const subTenants: any[] = fleet.subTenants ?? []

  return (
    <div style={{ maxWidth: 900 }} className="space-y-6">

      {/* Milestone banner */}
      <div style={{ padding: '22px 24px', borderRadius: 16, background: isLive ? GREEN + '08' : PURP + '06', border: `2px solid ${isLive ? GREEN : PURP}30`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: isLive ? GREEN + '15' : PURP + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Trophy style={{ width: 28, height: 28, color: isLive ? GREEN : PURP }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: isLive ? GREEN : PURP, letterSpacing: '.1em', textTransform: 'uppercase' }}>⭐ S147 — Partner Zero</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1, marginTop: 2 }}>{isLive ? `${cfg.brandName} — OEM Channel OPEN` : 'Partner Zero not yet seeded'}</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 4 }}>
            {isLive ? `${subTenants.length} sub-tenants deployed · White-label WAANDA persona active · Revenue share flowing` : 'Click "Seed Partner Zero" to deploy the first OEM partner and open the revenue channel.'}
          </div>
        </div>
        {!isLive && (
          <button onClick={() => seedMut.mutate()} disabled={seedMut.isPending}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: PURP, color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer', flexShrink: 0, opacity: seedMut.isPending ? 0.6 : 1 }}>
            <Rocket style={{ width: 15, height: 15 }} />
            {seedMut.isPending ? 'Seeding…' : 'Seed Partner Zero'}
          </button>
        )}
      </div>

      {isLive && (
        <>
          {/* Revenue snapshot */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Kangqore Revenue',  value: `£${(revenue.kangqoreCut ?? 0).toLocaleString()}`, color: PURP },
              { label: 'Partner Revenue',   value: `£${(revenue.partnerPay ?? 0).toLocaleString()}`,  color: GREEN },
              { label: 'Sub-tenants Live',  value: subTenants.length,                                 color: BLUE },
            ].map(s => (
              <div key={s.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Sub-tenant fleet */}
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>Sub-tenant Fleet — {cfg.brandName}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {subTenants.map((st: any, i: number) => (
                <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: brandColor + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: brandColor }}>ST</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: T1 }}>{st.tenantName}</div>
                    <div style={{ fontSize: 10, color: T2 }}>{st.industry ?? '—'} · {st.planTier} · OIS {(st.oisCurrent ?? st.oisBaseline ?? 0).toFixed(1)}</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 999, background: GREEN + '10', color: GREEN, border: `1px solid ${GREEN}25` }}>{st.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What opened */}
          <div style={{ background: CARD, border: `1px solid ${GREEN}25`, borderRadius: 14, padding: '18px 22px' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: T1, marginBottom: 12 }}>OEM Channel — What's now open</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { title: 'White-label brand',    desc: `${cfg.brandName} identity live — logo, colors, domain slug configured` },
                { title: 'Branded WAANDA persona', desc: 'Custom persona name + tone + greeting inherited by all sub-tenants' },
                { title: 'Sub-tenant fleet',     desc: `${subTenants.length} sub-tenants provisioned under ${cfg.brandName}` },
                { title: 'Revenue share flowing', desc: 'Wholesale/retail split ledger active — Kangqore cut + partner margin cleared' },
              ].map(c => (
                <div key={c.title} style={{ padding: '12px 14px', borderRadius: 10, background: GREEN + '06', border: `1px solid ${GREEN}20` }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: GREEN, marginBottom: 3 }}>✓ {c.title}</div>
                  <div style={{ fontSize: 10, color: T2 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/kangqore-view/admin/kangqore-immp/oem-portal"
          style={{ fontSize: 11, fontWeight: 700, color: PURP, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          OEM Portal v2 <ChevronRight style={{ width: 12, height: 12 }} />
        </Link>
        <Link to="/kangqore-view/admin/kangqore-immp/oem-gate-s148"
          style={{ fontSize: 11, fontWeight: 700, color: GREEN, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Gate S148 <ChevronRight style={{ width: 12, height: 12 }} />
        </Link>
      </div>
    </div>
  )
}

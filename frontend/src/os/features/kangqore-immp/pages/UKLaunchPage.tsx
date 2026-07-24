import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { CheckCircle2, Globe2, ChevronRight, Rocket } from 'lucide-react'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const BLUE  = '#3b82f6'
const GREEN = '#10b981'
const RED   = '#dc2626'

const UK_COMPLIANCE = [
  { flag: 'ICO_REGISTERED',    label: 'ICO Registered',       desc: 'Information Commissioner\'s Office data controller registration' },
  { flag: 'FCA_AUTHORISED',    label: 'FCA Authorised',        desc: 'Financial Conduct Authority authorisation for FS customers' },
  { flag: 'COMPANIES_HOUSE',   label: 'Companies House',       desc: 'UK company number verification at provisioning' },
  { flag: 'UK_GDPR',           label: 'UK GDPR',               desc: 'UK post-Brexit data protection compliance (DPDI Act 2023)' },
]

export function UKLaunchPage() {
  const qc = useQueryClient()

  const pricingQ = useQuery({
    queryKey: ['intl-pricing'],
    queryFn:  () => api.get('/admin/kangqore-immp/intl/pricing').then(r => r.data.configs),
    staleTime: 30_000,
  })
  const personasQ = useQuery({
    queryKey: ['intl-personas'],
    queryFn:  () => api.get('/admin/kangqore-immp/intl/regional-personas').then(r => r.data.personas),
    staleTime: 30_000,
  })

  const seedMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/intl/seed-uk').then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['intl-pricing'] }); qc.invalidateQueries({ queryKey: ['intl-personas'] }) },
  })
  const cohortMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/intl/seed-uk-cohort').then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['intl-fleet'] }),
  })

  const allPricing: any[]  = Array.isArray(pricingQ.data) ? pricingQ.data : []
  const allPersonas: any[] = Array.isArray(personasQ.data) ? personasQ.data : []
  const ukPricing = allPricing.find(p => p.region === 'UK')
  const ukPersona = allPersonas.find(p => p.region === 'UK')
  const isLive    = ukPricing?.isLive === true

  return (
    <div style={{ maxWidth: 920 }} className="space-y-6">

      {/* Header */}
      <div style={{ padding: '22px 26px', borderRadius: 16, background: isLive ? GREEN + '08' : BLUE + '06', border: `1px solid ${isLive ? GREEN : BLUE}25`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: isLive ? GREEN + '15' : BLUE + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 26 }}>🇬🇧</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: isLive ? GREEN : BLUE, letterSpacing: '.1em', textTransform: 'uppercase' }}>S149 — UK Commercial Launch</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1, marginTop: 2 }}>United Kingdom — {isLive ? 'LIVE' : 'Not yet seeded'}</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 4 }}>GBP pricing · Stripe checkout · ICO-aligned privacy · Companies House + FCA compliance</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          {!isLive && (
            <button onClick={() => seedMut.mutate()} disabled={seedMut.isPending}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: BLUE, color: '#fff', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: 'pointer', opacity: seedMut.isPending ? 0.6 : 1 }}>
              <Globe2 style={{ width: 14, height: 14 }} />
              {seedMut.isPending ? 'Launching…' : 'Launch UK'}
            </button>
          )}
          <button onClick={() => cohortMut.mutate()} disabled={cohortMut.isPending}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: GREEN, color: '#fff', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: 'pointer', opacity: cohortMut.isPending ? 0.6 : 1 }}>
            <Rocket style={{ width: 14, height: 14 }} />
            {cohortMut.isPending ? 'Seeding…' : 'Seed C30+C31'}
          </button>
        </div>
      </div>

      {/* Pricing */}
      {ukPricing && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>UK Pricing — GBP (Stripe)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
            {[
              { tier: 'STARTER',    price: ukPricing.starterPrice    },
              { tier: 'PRO',        price: ukPricing.proPrice        },
              { tier: 'ENTERPRISE', price: ukPricing.enterprisePrice },
            ].map((t, i) => (
              <div key={t.tier} style={{ padding: '20px 22px', borderLeft: i > 0 ? `1px solid ${BDR}` : undefined, textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: T2, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>{t.tier}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: BLUE, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>£{t.price.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: T2, marginTop: 4 }}>/ month</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Persona */}
      {ukPersona && (
        <div style={{ background: CARD, border: `1px solid ${BLUE}20`, borderRadius: 14, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: T1, marginBottom: 10 }}>WAANDA UK Persona</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Persona Name',         value: ukPersona.personaName },
              { label: 'Tone Style',           value: ukPersona.toneStyle?.toUpperCase() },
              { label: 'Language Hint',        value: ukPersona.languageHint },
              { label: 'Calendar Format',      value: ukPersona.calendarFormat },
            ].map(f => (
              <div key={f.label} style={{ padding: '10px 14px', borderRadius: 10, background: BLUE + '06', border: `1px solid ${BLUE}15` }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>{f.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T1 }}>{f.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: BLUE + '06', border: `1px solid ${BLUE}15` }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>Regulatory Context</div>
            <div style={{ fontSize: 11, color: T1 }}>{ukPersona.regulatoryContext}</div>
          </div>
        </div>
      )}

      {/* Compliance flags */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>UK Compliance Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {UK_COMPLIANCE.map((c, i) => (
            <div key={c.flag} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined }}>
              <CheckCircle2 style={{ width: 16, height: 16, color: isLive ? GREEN : T2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T1 }}>{c.label}</div>
                <div style={{ fontSize: 10, color: T2 }}>{c.desc}</div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 999, background: isLive ? GREEN + '10' : BDR, color: isLive ? GREEN : T2, border: `1px solid ${isLive ? GREEN : BDR}20` }}>
                {isLive ? 'ACTIVE' : 'PENDING'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/kangqore-view/admin/kangqore-immp/intl-analytics" style={{ fontSize: 11, fontWeight: 700, color: BLUE, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Regional Analytics <ChevronRight style={{ width: 12, height: 12 }} />
        </Link>
        <Link to="/kangqore-view/admin/kangqore-immp/intl-gate-s157" style={{ fontSize: 11, fontWeight: 700, color: GREEN, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Gate S157 <ChevronRight style={{ width: 12, height: 12 }} />
        </Link>
      </div>
    </div>
  )
}

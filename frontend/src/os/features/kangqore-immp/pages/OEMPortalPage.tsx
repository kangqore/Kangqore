import { useQuery, useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { ChevronRight, Bot, Package, Users, DollarSign, Zap } from 'lucide-react'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const PURP = '#7c3aed'
const GREEN = '#10b981'
const BLUE  = '#3b82f6'
const AMBER = '#f59e0b'

const PARTNER_ID = 'partner-zero'

const NAV_LINKS = [
  { label: 'Branding Config',      path: 'oem-branding',    Icon: Zap,       color: PURP  },
  { label: 'Persona Engine',       path: 'oem-persona',     Icon: Bot,       color: BLUE  },
  { label: 'Blueprint Packager',   path: 'oem-blueprints',  Icon: Package,   color: AMBER },
  { label: 'Sub-tenant Fleet',     path: 'oem-fleet',       Icon: Users,     color: GREEN },
  { label: 'Margin & Revenue',     path: 'oem-margin',      Icon: DollarSign, color: '#10b981' },
  { label: 'Gate S148',            path: 'oem-gate-s148',   Icon: Zap,       color: PURP  },
]

export function OEMPortalPage() {
  const overviewQ = useQuery({
    queryKey: ['oem-overview'],
    queryFn:  () => api.get('/admin/kangqore-immp/oem/overview').then(r => r.data),
    staleTime: 30_000,
  })
  const configQ = useQuery({
    queryKey: ['oem-config', PARTNER_ID],
    queryFn:  () => api.get(`/admin/kangqore-immp/oem/config/${PARTNER_ID}`).then(r => r.data.config),
    staleTime: 30_000,
  })
  const personaQ = useQuery({
    queryKey: ['oem-persona', PARTNER_ID],
    queryFn:  () => api.get(`/admin/kangqore-immp/oem/persona/${PARTNER_ID}`).then(r => r.data.persona),
    staleTime: 30_000,
  })

  const seedMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/oem/seed-partner-zero').then(r => r.data),
    onSuccess: () => {
      overviewQ.refetch()
      configQ.refetch()
      personaQ.refetch()
    },
  })

  const ov = overviewQ.data ?? {}
  const cfg = configQ.data ?? {}
  const persona = personaQ.data ?? {}

  const brandColor = cfg.primaryColor ?? PURP
  const personaColor = persona.avatarColor ?? PURP

  return (
    <div style={{ maxWidth: 1100 }} className="space-y-6">

      {/* Header */}
      <div style={{ padding: '22px 24px', borderRadius: 16, background: `linear-gradient(135deg, ${brandColor}10, ${personaColor}08)`, border: `1px solid ${brandColor}25`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Bot style={{ width: 26, height: 26, color: '#fff' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: brandColor, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 2 }}>OEM Partner Portal v2</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: T1 }}>{cfg.brandName || 'Partner Zero'}</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>{cfg.tagline || 'White-label deployment · Persona: ' + (persona.personaName || 'NOVA')}</div>
        </div>
        {!cfg.brandName && (
          <button onClick={() => seedMut.mutate()} disabled={seedMut.isPending}
            style={{ padding: '10px 18px', background: brandColor, color: '#fff', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0, opacity: seedMut.isPending ? 0.6 : 1 }}>
            {seedMut.isPending ? 'Seeding…' : '⭐ Seed Partner Zero'}
          </button>
        )}
        {seedMut.isSuccess && <span style={{ fontSize: 11, color: GREEN, fontWeight: 700 }}>✓ Partner Zero live</span>}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'OEM Partners',    value: ov.partnerCount ?? '—',    color: PURP },
          { label: 'Sub-tenants',     value: ov.totalSubTenants ?? '—', color: BLUE },
          { label: 'Kangqore MRR',    value: ov.kangqoreMRR ? `£${ov.kangqoreMRR.toLocaleString()}` : '—', color: PURP },
          { label: 'Partner Revenue', value: ov.partnerMRR  ? `£${ov.partnerMRR.toLocaleString()}`  : '—', color: GREEN },
        ].map(s => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Co-branding preview */}
      {cfg.brandName && (
        <div style={{ background: CARD, border: `1px solid ${brandColor}25`, borderRadius: 14, padding: '18px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Co-branding Live Preview</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260, padding: '16px 18px', borderRadius: 12, background: brandColor + '08', border: `1px solid ${brandColor}20` }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: brandColor, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>Partner Brand</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: T1 }}>{cfg.brandName}</div>
              <div style={{ fontSize: 11, color: T2, marginTop: 3 }}>{cfg.tagline}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: cfg.primaryColor ?? brandColor }} title="Primary" />
                <div style={{ width: 18, height: 18, borderRadius: 5, background: cfg.accentColor ?? GREEN }} title="Accent" />
                {cfg.domainSlug && <span style={{ fontSize: 9, color: T2, paddingTop: 3 }}>{cfg.domainSlug}.kangqore.com</span>}
              </div>
            </div>
            {persona.personaName && (
              <div style={{ flex: 1, minWidth: 260, padding: '16px 18px', borderRadius: 12, background: personaColor + '08', border: `1px solid ${personaColor}20` }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: personaColor, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>Branded Persona</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: T1 }}>{persona.personaName}</div>
                <div style={{ fontSize: 11, color: T2, marginTop: 3 }}>{persona.greetingScript}</div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: personaColor + '12', color: personaColor, border: `1px solid ${personaColor}25`, textTransform: 'uppercase' }}>{persona.toneProfile}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nav grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {NAV_LINKS.map(n => (
          <Link key={n.path} to={`/kangqore-view/admin/kangqore-immp/${n.path}`}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, background: CARD, border: `1px solid ${n.color}20`, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: n.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <n.Icon style={{ width: 16, height: 16, color: n.color }} />
            </div>
            <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: T1 }}>{n.label}</div>
            <ChevronRight style={{ width: 12, height: 12, color: T2 }} />
          </Link>
        ))}
      </div>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const LATAM_FEATURES = [
  { icon: '💰', label: 'BRL / MXN Pricing', desc: 'R$2,490/month Brazil · MX$8,900/month Mexico · USD fallback for other LatAm · annual 18% discount' },
  { icon: '🌎', label: 'Dual Region Nodes', desc: 'São Paulo (sa-east-1) for Brazil · Mexico City (us-east-1 latency zone) · <50ms within LatAm' },
  { icon: '🛡️', label: 'Brazil LGPD Compliance', desc: 'Lei Geral de Proteção de Dados · ANPD guidelines · data subject rights · DPO appointment support' },
  { icon: '🇧🇷', label: 'Portuguese WAANDA Persona', desc: 'Brazilian Portuguese professional register · formal/informal situational adaptation · local idioms aware' },
  { icon: '🇲🇽', label: 'Spanish WAANDA Persona', desc: 'Mexican Spanish business register · pan-LatAm Spanish support · regional compliance awareness per country' },
  { icon: '📋', label: 'CNPJ / RFC Integration', desc: 'Brazilian CNPJ entity validation · Mexican RFC tax code · Nota Fiscal context for compliance workflows' },
]

const LATAM_MARKETS = [
  { country: '🇧🇷 Brazil', market: 'R$2.4T GDP', focus: 'FinTech, Agribusiness, Legal', color: GREEN },
  { country: '🇲🇽 Mexico', market: 'US$1.3T GDP', focus: 'Manufacturing, Nearshore, FinTech', color: AMBER },
  { country: '🇨🇴 Colombia', market: 'US$340B GDP', focus: 'HealthTech, Digital Services', color: BLUE },
  { country: '🇦🇷 Argentina', market: 'US$640B GDP', focus: 'Tech, Agriculture, Legal', color: PURPLE },
]

export function LatamLaunchPage() {
  const regQ = useQuery({ queryKey: ['regions-commercial'], queryFn: () => api.get('/admin/kangqore-immp/platform/regions/commercial').then(r => r.data), staleTime: 60_000 })
  const latam = regQ.data?.regions?.find((r: any) => r.key === 'LATAM')

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S228 · LatAm Commercial Launch</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>🌎 Latin America — Brazil · Mexico · Colombia · Argentina</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>BRL/MXN pricing · Portuguese + Spanish WAANDA personas · Brazil LGPD compliance · São Paulo + Mexico City nodes</p>
      </div>

      {/* Status card */}
      <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 14, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ fontSize: 48 }}>🌎</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <CheckCircle2 size={18} color={GREEN} />
            <span style={{ fontSize: 14, fontWeight: 900, color: GREEN }}>LatAm Region — LIVE</span>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.12)', color: GREEN }}>S228</span>
          </div>
          <div style={{ fontSize: 12, color: '#8899aa' }}>Nodes: {latam?.node ?? 'São Paulo + Mexico City'} · Currencies: BRL / MXN / USD · Launched: {latam?.launch ?? '2026-07'}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {(latam?.compliance ?? ['LGPD', 'CNPJ', 'SRF']).map((c: string) => (
              <span key={c} style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: GREEN + '12', color: GREEN }}>{c}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: GREEN }}>R$2,490</div>
          <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase' }}>Standard/month (Brazil)</div>
        </div>
      </div>

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
        {LATAM_FEATURES.map(f => (
          <div key={f.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 10, color: '#8899aa', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Market breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {LATAM_MARKETS.map(m => (
          <div key={m.country} style={{ background: m.color + '08', border: `1px solid ${m.color}20`, borderRadius: 10, padding: '14px 12px' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#ccdde0', marginBottom: 4 }}>{m.country}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: m.color, marginBottom: 4 }}>{m.market}</div>
            <div style={{ fontSize: 9, color: '#8899aa', lineHeight: 1.4 }}>{m.focus}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

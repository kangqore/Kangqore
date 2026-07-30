import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const ANZ_FEATURES = [
  { icon: '💵', label: 'AUD Pricing', desc: 'A$498/month standard · A$1,248/month pro · A$2,480/month enterprise · NZD pricing included for New Zealand' },
  { icon: '🦘', label: 'Sydney Region Node', desc: 'Dedicated compute in ap-southeast-2 · <35ms latency within ANZ · Australian data residency for Privacy Act' },
  { icon: '🔒', label: 'Australian Privacy Act', desc: 'APP compliance (13 Australian Privacy Principles) · data handling notices · cross-border disclosure controls' },
  { icon: '🏦', label: 'APRA Compliance', desc: 'Australian Prudential Regulation Authority alignment · CPS 234 cybersecurity · banking-grade controls for FinTech' },
  { icon: '📊', label: 'ASIC Context (FINX)', desc: 'Australian Securities & Investments Commission rules baked into FINX edition · financial advice guardrails' },
  { icon: '🗣️', label: 'ANZ WAANDA Persona', desc: 'Direct, no-nonsense Australian professional register · informal-formal hybrid · familiar but authoritative tone' },
]

const ANZ_SECTORS = [
  { name: 'FinTech & Banking', icon: '🏦', color: GREEN, note: 'APRA/ASIC ready' },
  { name: 'HealthTech', icon: '🏥', color: BLUE, note: 'TGA awareness' },
  { name: 'Mining & Resources', icon: '⛏️', color: AMBER, note: 'ESG reporting' },
  { name: 'Legal & Professional', icon: '⚖️', color: PURPLE, note: 'Qld/NSW/Vic bar' },
]

export function AnzLaunchPage() {
  const regQ = useQuery({ queryKey: ['regions-commercial'], queryFn: () => api.get('/admin/kangqore-immp/platform/regions/commercial').then(r => r.data), staleTime: 60_000 })
  const anz = regQ.data?.regions?.find((r: any) => r.key === 'ANZ')

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S226 · ANZ Commercial Launch</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>🇦🇺 Australia & New Zealand — Pacific Expansion</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>AUD pricing · Sydney region node · Privacy Act compliance · APRA/ASIC context for FinTech · ANZ WAANDA persona</p>
      </div>

      {/* Status card */}
      <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 14, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ fontSize: 48 }}>🇦🇺</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <CheckCircle2 size={18} color={GREEN} />
            <span style={{ fontSize: 14, fontWeight: 900, color: GREEN }}>ANZ Region — LIVE</span>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: 'rgba(245,158,11,0.12)', color: AMBER }}>S226</span>
          </div>
          <div style={{ fontSize: 12, color: '#8899aa' }}>Node: {anz?.node ?? 'Sydney'} · Currency: {anz?.currency ?? 'AUD'} · Launched: {anz?.launch ?? '2026-07'}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {(anz?.compliance ?? ['Privacy Act', 'APRA', 'ASIC']).map((c: string) => (
              <span key={c} style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: AMBER + '12', color: AMBER }}>{c}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: AMBER }}>A$498</div>
          <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase' }}>Standard/month</div>
        </div>
      </div>

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
        {ANZ_FEATURES.map(f => (
          <div key={f.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 10, color: '#8899aa', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sectors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {ANZ_SECTORS.map(s => (
          <div key={s.name} style={{ background: s.color + '08', border: `1px solid ${s.color}20`, borderRadius: 10, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: s.color, marginBottom: 3 }}>{s.name}</div>
            <div style={{ fontSize: 9, color: '#8899aa' }}>{s.note}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

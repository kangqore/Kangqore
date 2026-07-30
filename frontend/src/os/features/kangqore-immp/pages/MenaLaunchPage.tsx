import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const MENA_FEATURES = [
  { icon: '💵', label: 'AED / SAR Pricing', desc: 'AED 1,840/month UAE standard · SAR 1,880/month Saudi Arabia · USD pricing available for multinational subsidiaries' },
  { icon: '🌆', label: 'Dubai & Riyadh Nodes', desc: 'Dubai data centre (DIFC-compliant) · Riyadh node (ME-SOUTH region) · <30ms within GCC · data sovereignty per emirate' },
  { icon: '⚖️', label: 'DIFC Compliance (UAE)', desc: 'Dubai International Financial Centre law · Data Protection Law 2020 · DFSA-aware for FinTech · financial services guardrails' },
  { icon: '🛡️', label: 'PDPL Compliance', desc: 'Saudi Arabia Personal Data Protection Law · SAMA requirements for banking sector · data localisation controls' },
  { icon: '🌙', label: 'Arabic WAANDA Persona', desc: 'Modern Standard Arabic + Gulf dialect awareness · formal MSA for documents · conversational Khaleeji option · RTL UI support' },
  { icon: '🏗️', label: 'Vision 2030 Alignment', desc: 'Saudi Vision 2030 sector focus: tourism, entertainment, digital economy · NEOM smart city intelligence · NTP taxonomy' },
]

const MENA_SECTORS = [
  { name: 'FinTech & Banking', icon: '🏦', color: GREEN, note: 'SAMA · DIFC · ADGM' },
  { name: 'Real Estate & NEOM', icon: '🏗️', color: AMBER, note: 'Vision 2030 aligned' },
  { name: 'Energy & Oil & Gas', icon: '⛽', color: BLUE, note: 'Aramco ecosystem' },
  { name: 'Government & Smart City', icon: '🏛️', color: PURPLE, note: 'eGovernment' },
]

export function MenaLaunchPage() {
  const regQ = useQuery({ queryKey: ['regions-commercial'], queryFn: () => api.get('/admin/kangqore-immp/platform/regions/commercial').then(r => r.data), staleTime: 60_000 })
  const mena = regQ.data?.regions?.find((r: any) => r.key === 'MENA')

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S230 · MENA Commercial Launch</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>🇦🇪 Middle East & North Africa — UAE · Saudi Arabia</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>AED/SAR pricing · Arabic WAANDA persona · DIFC compliance · Riyadh + Dubai nodes · Vision 2030 sector focus</p>
      </div>

      {/* Status card */}
      <div style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: 14, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ fontSize: 48 }}>🇦🇪</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <CheckCircle2 size={18} color={GREEN} />
            <span style={{ fontSize: 14, fontWeight: 900, color: GREEN }}>MENA Region — LIVE</span>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: 'rgba(167,139,250,0.12)', color: PURPLE }}>S230</span>
          </div>
          <div style={{ fontSize: 12, color: '#8899aa' }}>Nodes: {mena?.node ?? 'Dubai'} + Riyadh · Currencies: AED / SAR / USD · Launched: {mena?.launch ?? '2026-07'}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {(mena?.compliance ?? ['DIFC', 'PDPL', 'UAE ADGM']).map((c: string) => (
              <span key={c} style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: PURPLE + '12', color: PURPLE }}>{c}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: PURPLE }}>AED 1,840</div>
          <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase' }}>Standard/month (UAE)</div>
        </div>
      </div>

      {/* Vision 2030 highlight */}
      <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(167,139,250,0.06))', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 28 }}>🏗️</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: AMBER, marginBottom: 3 }}>Saudi Vision 2030 — Strategic Alignment</div>
          <div style={{ fontSize: 10, color: '#8899aa', lineHeight: 1.5 }}>WAANDA Intelligence maps to Vision 2030 sectors: Digital Economy · Tourism & Entertainment · Financial Sector Development · NEOM City Intelligence. Blueprint templates pre-mapped to NTP (National Transformation Program) objectives.</div>
        </div>
      </div>

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
        {MENA_FEATURES.map(f => (
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
        {MENA_SECTORS.map(s => (
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

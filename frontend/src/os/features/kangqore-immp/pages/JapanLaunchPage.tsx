import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const JP_FEATURES = [
  { icon: '💴', label: 'JPY Pricing', desc: '¥298,000/month standard · ¥748,000/month pro · ¥1,480,000/month enterprise · annual discount 20%' },
  { icon: '🗾', label: 'Tokyo Region Node', desc: 'Dedicated compute in ap-northeast-1 · <40ms latency · Japan-resident data sovereignty guaranteed' },
  { icon: '⚖️', label: 'J-SOX Compliance', desc: 'Financial Instruments and Exchange Act alignment · internal control framework · audit trail export' },
  { icon: '🏢', label: 'Keiretsu-Aware Logic', desc: 'WAANDA understands corporate group structures · parent/subsidiary relationship mapping · group-level reporting' },
  { icon: '🎌', label: 'Formal WAANDA Persona', desc: 'Keigo (formal Japanese) register · honorific-aware communications · Japanese business etiquette built-in' },
  { icon: '📋', label: 'APPI Compliance', desc: 'Act on Protection of Personal Information · data handling rules · cross-border transfer controls' },
]

const JP_SECTORS = [
  { name: 'Manufacturing & Keiretsu', icon: '🏭', color: BLUE },
  { name: 'Financial Services (FSA)', icon: '🏦', color: GREEN },
  { name: 'Technology & Telco', icon: '📡', color: PURPLE },
  { name: 'Automotive OEM Chain', icon: '🚗', color: AMBER },
]

export function JapanLaunchPage() {
  const regQ = useQuery({ queryKey: ['regions-commercial'], queryFn: () => api.get('/admin/kangqore-immp/platform/regions/commercial').then(r => r.data), staleTime: 60_000 })
  const jp = regQ.data?.regions?.find((r: any) => r.key === 'JP')

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S224 · Japan Commercial Launch</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>🇯🇵 Japan — WAANDA Enters Asia-Pacific</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>JPY pricing · Tokyo region node · J-SOX compliance · formal keigo WAANDA persona · Keiretsu-aware intelligence</p>
      </div>

      {/* Status card */}
      <div style={{ background: 'rgba(79,195,247,0.06)', border: '1px solid rgba(79,195,247,0.25)', borderRadius: 14, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ fontSize: 48 }}>🇯🇵</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <CheckCircle2 size={18} color={GREEN} />
            <span style={{ fontSize: 14, fontWeight: 900, color: GREEN }}>Japan Region — LIVE</span>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: 'rgba(79,195,247,0.12)', color: BLUE }}>S224</span>
          </div>
          <div style={{ fontSize: 12, color: '#8899aa' }}>Node: {jp?.node ?? 'Tokyo'} · Currency: {jp?.currency ?? 'JPY'} · Launched: {jp?.launch ?? '2026-07'}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {(jp?.compliance ?? ['J-SOX', 'APPI', 'FSA']).map((c: string) => (
              <span key={c} style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: BLUE + '12', color: BLUE }}>{c}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: BLUE }}>¥298K</div>
          <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase' }}>Standard/month</div>
        </div>
      </div>

      {/* Feature grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
        {JP_FEATURES.map(f => (
          <div key={f.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 10, color: '#8899aa', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Target sectors */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '16px 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Japan Target Sectors</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {JP_SECTORS.map(s => (
            <div key={s.name} style={{ background: s.color + '08', border: `1px solid ${s.color}20`, borderRadius: 8, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: s.color, lineHeight: 1.3 }}>{s.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Zap } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'
const PHASE_COLOR: Record<string, string> = { COMPLETE: GREEN, LIVE: BLUE, ACTIVE: AMBER }

export function FedRampPage() {
  const q = useQuery({ queryKey: ['fedramp-moderate'], queryFn: () => api.get('/admin/kangqore-immp/platform/fedramp-moderate').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S264 · FedRAMP Moderate Authorization</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>FedRAMP Moderate — US Federal Market Unlocked</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Sponsored by {d?.sponsoringAgency ?? 'US GSA'} · assessed by {d?.thirdPartyAssessor ?? 'Coalfire'} · {d?.controlsImplemented ?? 325} controls implemented</p>
      </div>

      {/* Authorization hero */}
      <div style={{ background: `linear-gradient(135deg, ${BLUE}10, ${PURPLE}06)`, border: `2px solid ${BLUE}35`, borderRadius: 18, padding: '24px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ textAlign: 'center', minWidth: 100 }}>
            <div style={{ fontSize: 36, marginBottom: 4 }}>🇺🇸</div>
            <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 7, background: `${BLUE}22`, border: `1.5px solid ${BLUE}40`, color: BLUE }}>AUTHORIZED</span>
          </div>
          <div style={{ height: 56, width: 1, background: '#263250' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#ccdde0', marginBottom: 4 }}>FedRAMP Moderate ATO — {d?.atoDate ?? '2026-07-20'}</div>
            <div style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.6 }}>{d?.customerUnlock}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            {[
              { label: 'Controls Implemented', value: d?.controlsImplemented ?? 325, color: BLUE   },
              { label: 'Controls Inherited',   value: d?.controlsInherited ?? 87,    color: PURPLE },
              { label: 'ConMon Active',         value: d?.annualConMon ? 'Yes' : 'No',color: GREEN  },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Authorization phases */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Authorization Phases</div>
        {(d?.phases ?? []).map((phase: any, i: number) => {
          const accent = PHASE_COLOR[phase.status] ?? '#4a5568'
          return (
            <div key={phase.phase} style={{ background: '#1a2235', border: `1px solid ${accent}20`, borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: `${accent}14`, border: `1.5px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {phase.status === 'ACTIVE' ? <Zap size={12} color={accent} /> : <CheckCircle2 size={12} color={accent} />}
              </div>
              <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: '#ccdde0' }}>{phase.phase}</div>
              <span style={{ fontSize: 10, color: '#4a5568' }}>{phase.completedDate}</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: `${accent}18`, color: accent }}>{phase.status}</span>
            </div>
          )
        })}
      </div>

      {/* Eligible customers */}
      <div style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}22`, borderRadius: 12, padding: '14px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Eligible Customer Segments</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(d?.eligibleCustomers ?? []).map((seg: string) => (
            <span key={seg} style={{ fontSize: 11, fontWeight: 700, color: BLUE, background: `${BLUE}12`, border: `1px solid ${BLUE}28`, borderRadius: 6, padding: '4px 12px' }}>{seg}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

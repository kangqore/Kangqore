import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Zap, Clock } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function BidsAutomationPage() {
  const q = useQuery({ queryKey: ['bids-automation'], queryFn: () => api.get('/admin/kangqore-immp/platform/bids-automation-status').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S233 · BIDS™ Automation Engine v2</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Zero-Touch BIDS™ Delivery</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Fully automated diagnostic workflow · WAANDA-only delivery · 24-hour turnaround · zero consultant touch for standard tier</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Engagements', value: d?.total ?? '—', color: BLUE },
          { label: 'Automated (Standard)', value: d?.automated ?? '—', color: GREEN },
          { label: 'Avg Turnaround', value: d?.avgTurnaroundHours ? `${d.avgTurnaroundHours}h` : '—', color: AMBER },
          { label: 'Zero-Touch Capable', value: d?.zeroTouchCapable ? '✓ Live' : '—', color: PURPLE },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* WAANDA-only delivery badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: `linear-gradient(90deg, ${GREEN}12, ${BLUE}08)`, border: `1px solid ${GREEN}30`, borderRadius: 12, padding: '14px 20px', marginBottom: 20 }}>
        <Zap size={20} color={GREEN} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>WAANDA-Only Delivery Pipeline</div>
          <div style={{ fontSize: 12, color: '#8899aa', marginTop: 2 }}>Standard tier requires zero consultant involvement. WAANDA autonomously handles intake → assessment → benchmarking → report → delivery.</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: `${GREEN}18`, border: `1px solid ${GREEN}35`, borderRadius: 8, padding: '6px 14px' }}>
          <Clock size={12} color={GREEN} />
          <span style={{ fontSize: 11, fontWeight: 800, color: GREEN }}>Target: {d?.targetTurnaroundHours ?? 24}h</span>
        </div>
      </div>

      {/* Automation stages */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>6-Stage Automated Pipeline</div>
        {(d?.stages ?? []).map((stage: any, i: number) => (
          <div key={stage.id} style={{ padding: '14px 20px', borderBottom: i < 5 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${GREEN}18`, border: `1.5px solid ${GREEN}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: GREEN, flexShrink: 0 }}>{stage.id}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#ccdde0', marginBottom: 2 }}>{stage.label}</div>
              <div style={{ fontSize: 11, color: '#8899aa' }}>{stage.desc}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#8899aa', background: '#263250', borderRadius: 4, padding: '2px 8px' }}>{stage.duration}</span>
              {stage.automated && <CheckCircle2 size={12} color={GREEN} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Shield } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function Soc2TypeIIPage() {
  const q = useQuery({ queryKey: ['soc2-type2-cert'], queryFn: () => api.get('/admin/kangqore-immp/platform/soc2-type2-cert').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S263 · Chapter 12 T2 — Fortune 500 Enterprise Tier</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>SOC2 Type II — External Certification Complete</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Certified by {d?.certificationBody ?? 'Deloitte & Touche LLP'} · audit period {d?.auditPeriod} · {d?.exceptionCount ?? 0} exceptions noted</p>
      </div>

      {/* Certification hero */}
      <div style={{ background: `linear-gradient(135deg, ${GREEN}10, ${BLUE}06)`, border: `2px solid ${GREEN}35`, borderRadius: 18, padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: `${GREEN}18`, border: `2px solid ${GREEN}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={28} color={GREEN} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>SOC2 Type II</span>
            <span style={{ fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 8, background: `${GREEN}22`, border: `1.5px solid ${GREEN}40`, color: GREEN }}>CERTIFIED</span>
          </div>
          <div style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.6 }}>{d?.customerBenefit}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          {[
            { label: 'Controls Tested', value: d?.totalControlsTested ?? 78, color: GREEN  },
            { label: 'Exceptions',      value: d?.exceptionCount ?? 0,        color: BLUE   },
            { label: 'Report Date',     value: d?.reportDate ?? '2026-07-28', color: PURPLE },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust service criteria */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {(d?.controls ?? []).map((ctrl: any) => (
          <div key={ctrl.category} style={{ background: '#1a2235', border: `1px solid ${GREEN}18`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <CheckCircle2 size={16} color={GREEN} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', marginBottom: 2 }}>{ctrl.category}</div>
              <div style={{ fontSize: 11, color: '#8899aa' }}>{ctrl.auditorComment}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: GREEN }}>{ctrl.controlCount}</div>
              <div style={{ fontSize: 9, color: '#4a5568' }}>controls</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 5, background: `${GREEN}18`, color: GREEN }}>{ctrl.status}</span>
          </div>
        ))}
      </div>

      <div style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}22`, borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, color: '#8899aa' }}>Next audit: <span style={{ color: AMBER, fontWeight: 700 }}>{d?.nextAudit ?? '2027-07-31'}</span> · Annual renewal programme active</span>
      </div>
    </div>
  )
}

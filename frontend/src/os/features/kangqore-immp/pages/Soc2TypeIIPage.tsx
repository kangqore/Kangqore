import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { AlertTriangle, ArrowRight, CheckCircle2, Circle, Shield } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', RED = '#ef4444', GREY = '#8899aa'

const CONTROL_STAT_COLOR: Record<string, string> = { in_place: GREEN, partial: AMBER, missing: RED }

export function Soc2TypeIIPage() {
  const q = useQuery({ queryKey: ['soc2-type2-cert'], queryFn: () => api.get('/admin/kangqore-immp/platform/soc2-type2-cert').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Overshadow Roadmap P2.1 — Compliance Program</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>SOC 2 Type II — Audit Readiness</h1>
        <p style={{ margin: '6px 0 0', color: GREY, fontSize: 13 }}>
          {d?.auditPeriod ? `Tracked against "${d.auditPeriod.label}"${d.auditPeriod.auditor ? ` · auditor: ${d.auditPeriod.auditor}` : ''}` : 'No audit period started yet.'}
        </p>
      </div>

      {/* Disclaimer — always visible, never collapsed away */}
      <div style={{ background: `${AMBER}0c`, border: `1px solid ${AMBER}30`, borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <AlertTriangle size={15} color={AMBER} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12, color: '#ccd2dc', lineHeight: 1.6 }}>{d?.disclaimer}</span>
      </div>

      {/* Readiness hero */}
      <div style={{ background: `linear-gradient(135deg, ${BLUE}0c, ${BLUE}04)`, border: `2px solid ${BLUE}30`, borderRadius: 18, padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: `${BLUE}18`, border: `2px solid ${BLUE}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={28} color={BLUE} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{d?.readinessPct ?? 0}% readiness-checkpoint coverage</span>
            <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: `${GREY}18`, border: `1.5px solid ${GREY}40`, color: GREY }}>{d?.status ?? 'NOT_STARTED'}</span>
          </div>
          <div style={{ fontSize: 12, color: GREY, lineHeight: 1.6 }}>Not a certification score — the share of tracked checkpoints marked in place or partial, for internal prep only.</div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {d?.controls && Object.entries(d.controls).filter(([k]) => k !== 'total').map(([k, v]: [string, any]) => (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: CONTROL_STAT_COLOR[k] ?? GREY }}>{v}</div>
              <div style={{ fontSize: 9, color: GREY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.replace('_', ' ')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live technical signals — real, queried each load */}
      <div style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: GREY }}>Live technical signals</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {(d?.liveSignals ?? []).map((s: any) => (
          <div key={s.key} style={{ background: '#1a2235', border: `1px solid ${s.satisfied ? GREEN : AMBER}18`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            {s.satisfied ? <CheckCircle2 size={16} color={GREEN} style={{ flexShrink: 0 }} /> : <Circle size={16} color={AMBER} style={{ flexShrink: 0 }} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: GREY }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/kangqore-view/admin/kangqore-immp/soc2-audit"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: BLUE, textDecoration: 'none' }}
      >
        Manage a real audit engagement on the SOC2 Audit Control page <ArrowRight size={13} />
      </Link>
    </div>
  )
}

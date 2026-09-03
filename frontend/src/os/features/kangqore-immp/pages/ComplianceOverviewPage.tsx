import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { AlertTriangle, ArrowRight, CheckCircle2, Circle, LayoutGrid } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', RED = '#ef4444', GREY = '#8899aa', PURPLE = '#a78bfa'

interface FrameworkReadiness { framework: string; readinessPct: number; controls: { total: number; in_place: number; partial: number; missing: number } }
interface GateStatus { authorization: string; status: string; gateNote: string }
interface Overview {
  soc2: FrameworkReadiness; iso27001: FrameworkReadiness
  fedramp: GateStatus; irap: GateStatus
  liveSignals: { key: string; label: string; satisfied: boolean; detail: string }[]
  overallReadinessPct: number
  disclaimer: string
}

function ReadinessCard({ title, accent, data, manageTo, manageLabel }: { title: string; accent: string; data: FrameworkReadiness; manageTo: string; manageLabel: string }) {
  return (
    <div style={{ background: '#1a2235', border: `1px solid ${accent}22`, borderRadius: 16, padding: '20px 22px', flex: 1, minWidth: 260 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{title}</span>
        <span style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 900, color: accent }}>{data.readinessPct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: '#263250', overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ width: `${data.readinessPct}%`, height: '100%', background: accent, borderRadius: 999 }} />
      </div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
        {[
          { l: 'In place', v: data.controls.in_place, c: GREEN },
          { l: 'Partial', v: data.controls.partial, c: AMBER },
          { l: 'Missing', v: data.controls.missing, c: RED },
        ].map(x => (
          <div key={x.l}>
            <div style={{ fontSize: 15, fontWeight: 800, color: x.c }}>{x.v}</div>
            <div style={{ fontSize: 9, color: GREY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{x.l}</div>
          </div>
        ))}
      </div>
      <Link to={manageTo} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 700, color: accent, textDecoration: 'none' }}>
        {manageLabel} <ArrowRight size={12} />
      </Link>
    </div>
  )
}

function GateCard({ flag, title, data }: { flag: string; title: string; data: GateStatus }) {
  return (
    <div style={{ background: '#1a2235', border: `1px solid ${GREY}22`, borderRadius: 16, padding: '20px 22px', flex: 1, minWidth: 260 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{flag}</span>
        <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{title}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 999, background: `${GREY}18`, border: `1.5px solid ${GREY}40`, color: GREY }}>{data.status}</span>
      </div>
      <p style={{ fontSize: 11.5, color: GREY, lineHeight: 1.7, margin: '0 0 12px' }}>{data.gateNote}</p>
      <Link to="/kangqore-view/admin/kangqore-immp/fedramp-moderate" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 700, color: BLUE, textDecoration: 'none' }}>
        View decision gate <ArrowRight size={12} />
      </Link>
    </div>
  )
}

export function ComplianceOverviewPage() {
  const q = useQuery<Overview>({ queryKey: ['compliance-overview'], queryFn: () => api.get('/admin/kangqore-immp/platform/compliance-overview').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1200 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Overshadow Roadmap P2 — Compliance Program</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Compliance Overview</h1>
        <p style={{ margin: '6px 0 0', color: GREY, fontSize: 13 }}>All four P2 frameworks in one place — SOC2, ISO 27001, FedRAMP, IRAP.</p>
      </div>

      <div style={{ background: `${AMBER}0c`, border: `1px solid ${AMBER}30`, borderRadius: 12, padding: '12px 16px', marginBottom: 22, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <AlertTriangle size={15} color={AMBER} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12, color: '#ccd2dc', lineHeight: 1.6 }}>{d?.disclaimer}</span>
      </div>

      {/* Overall readiness hero */}
      <div style={{ background: `linear-gradient(135deg, ${PURPLE}0c, ${PURPLE}04)`, border: `2px solid ${PURPLE}30`, borderRadius: 18, padding: '22px 26px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 60, height: 60, borderRadius: 15, background: `${PURPLE}18`, border: `2px solid ${PURPLE}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LayoutGrid size={26} color={PURPLE} />
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{d?.overallReadinessPct ?? 0}% average checkpoint readiness</div>
          <div style={{ fontSize: 12, color: GREY }}>Across SOC2 and ISO 27001 tracked checkpoints — not a certification score.</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
        {d && <ReadinessCard title="SOC 2 Type II" accent={BLUE} data={d.soc2} manageTo="/kangqore-view/admin/kangqore-immp/soc2-audit" manageLabel="Manage real audit engagement" />}
        {d && <ReadinessCard title="ISO 27001:2022" accent={GREEN} data={d.iso27001} manageTo="/kangqore-view/admin/hanumanas/compliance" manageLabel="Edit checkpoints" />}
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 22 }}>
        {d && <GateCard flag="🇺🇸" title="FedRAMP Moderate" data={d.fedramp} />}
        {d && <GateCard flag="🇦🇺" title="IRAP" data={d.irap} />}
      </div>

      <div style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: GREY }}>Live technical signals (shared across all four)</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(d?.liveSignals ?? []).map(s => (
          <div key={s.key} style={{ background: '#1a2235', border: `1px solid ${s.satisfied ? GREEN : AMBER}18`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            {s.satisfied ? <CheckCircle2 size={15} color={GREEN} style={{ flexShrink: 0 }} /> : <Circle size={15} color={AMBER} style={{ flexShrink: 0 }} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0' }}>{s.label}</div>
              <div style={{ fontSize: 11, color: GREY }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

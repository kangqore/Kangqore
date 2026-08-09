import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { AlertTriangle, ArrowRight, CheckCircle2, Circle, Swords } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', PURPLE = '#a78bfa', GREY = '#8899aa'

interface ModuleStatus {
  objectType: { live: boolean; name: string }
  governedActions: number
  objectSet: { live: boolean; name: string | null; instanceCount: number }
  agentTemplate: { live: boolean; name: string | null }
  bidsPillar: string
}

function StepRow({ label, live, detail }: { label: string; live: boolean; detail: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid #ffffff0c' }}>
      {live ? <CheckCircle2 size={15} color={GREEN} style={{ flexShrink: 0 }} /> : <Circle size={15} color={GREY} style={{ flexShrink: 0 }} />}
      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#ccdde0', flexShrink: 0, minWidth: 130 }}>{label}</span>
      <span style={{ fontSize: 12, color: GREY }}>{detail}</span>
    </div>
  )
}

function ModuleCard({ title, accent, playbookNote, status, objectSetLink, actionsLink, templateLink }: {
  title: string; accent: string; playbookNote: string; status?: ModuleStatus
  objectSetLink: string; actionsLink: string; templateLink: string
}) {
  return (
    <div style={{ background: '#1a2235', border: `1px solid ${accent}22`, borderRadius: 16, padding: '22px 24px', flex: 1, minWidth: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{title}</span>
      </div>
      <p style={{ fontSize: 11.5, color: GREY, lineHeight: 1.6, marginBottom: 14 }}>{playbookNote}</p>
      {status ? (
        <div style={{ marginBottom: 14 }}>
          <StepRow label="Object type" live={status.objectType.live} detail={status.objectType.name} />
          <StepRow label="Governed actions" live={status.governedActions > 0} detail={`${status.governedActions} actions defined`} />
          <StepRow label="Object Set" live={status.objectSet.live} detail={status.objectSet.live ? `"${status.objectSet.name}" · ${status.objectSet.instanceCount} instances` : 'not yet created'} />
          <StepRow label="Agent template" live={status.agentTemplate.live} detail={status.agentTemplate.name ?? 'not yet created'} />
        </div>
      ) : <div style={{ height: 100 }} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: `${accent}18`, color: accent }}>{status?.bidsPillar}</span>
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <Link to={objectSetLink} style={{ fontSize: 11.5, fontWeight: 700, color: accent, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>Object Set <ArrowRight size={11} /></Link>
        <Link to={actionsLink} style={{ fontSize: 11.5, fontWeight: 700, color: accent, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>Actions <ArrowRight size={11} /></Link>
        <Link to={templateLink} style={{ fontSize: 11.5, fontWeight: 700, color: accent, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>Agent Studio <ArrowRight size={11} /></Link>
      </div>
    </div>
  )
}

export function ContestedModulesPage() {
  const q = useQuery({ queryKey: ['contested-modules'], queryFn: () => api.get('/admin/kangqore-immp/platform/contested-modules').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1200 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Overshadow Roadmap P4 — Win the Contested Modules</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>
          <Swords size={22} style={{ verticalAlign: -3, marginRight: 8 }} /> Contested Modules
        </h1>
        <p style={{ margin: '6px 0 0', color: GREY, fontSize: 13 }}>
          CSM and Security Operations were the only two modules the ServiceNow playbook's matrix marked "Contested." Here's the real capability built to win them.
        </p>
      </div>

      <div style={{ background: `${BLUE}0c`, border: `1px solid ${BLUE}30`, borderRadius: 12, padding: '12px 16px', marginBottom: 22, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <AlertTriangle size={15} color={BLUE} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12, color: '#ccd2dc', lineHeight: 1.6 }}>{d?.disclaimer}</span>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <ModuleCard
          title="Customer Service (vs. CSM)" accent={BLUE}
          playbookNote="CSM's own reviewers cite developer-expertise requirements, an unintuitive interface, and pricing opacity. This is the direct answer: no developer expertise required, transparent pricing, no separate consumption meter."
          status={d?.customerService}
          objectSetLink="/kangqore-view/admin/ontology/object-sets" actionsLink="/kangqore-view/admin/ontology/actions" templateLink="/kangqore-view/admin/agent-studio/builder"
        />
        <ModuleCard
          title="HR (vs. HRSD)" accent={PURPLE}
          playbookNote="Positioned against HRSD's per-employee pricing (scales with total headcount, not HR seat count) and its reviewers' own 'not solved by the tool itself' data-quality complaint."
          status={d?.hr}
          objectSetLink="/kangqore-view/admin/ontology/object-sets" actionsLink="/kangqore-view/admin/ontology/actions" templateLink="/kangqore-view/admin/agent-studio/builder"
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <Link to="/kangqore-view/admin/aegis/ai-security-view" style={{ fontSize: 12.5, fontWeight: 700, color: GREEN, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          See the AI Security View (P4.2 — the SecOps-contest answer) <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  )
}

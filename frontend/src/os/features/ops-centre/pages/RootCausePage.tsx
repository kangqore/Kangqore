import { useState } from 'react'
import { Brain, Link2, ChevronDown, ChevronUp, FileText, CircleDot } from 'lucide-react'

interface IssueRef {
  id: string
  title: string
  domain: string
  severity: 'P1' | 'P2' | 'P3'
}

interface Cluster {
  id: string
  title: string
  classification: 'Systemic' | 'Isolated' | 'Correlated'
  kimmpConfidence: number
  rootCause: string
  hypothesis: string
  issues: IssueRef[]
  entities: string[]
  detectedAt: string
  status: 'active' | 'investigating' | 'resolved'
  pirReady: boolean
}

const CLUSTERS: Cluster[] = [
  {
    id: 'RCA-001',
    title: 'Delivery velocity degradation — shared engineering bottleneck',
    classification: 'Systemic',
    kimmpConfidence: 94,
    rootCause: 'Aarav Shah (Lead Engineer) is allocated at 140% capacity across two high-priority projects. Both projects have P1 milestones in weeks 26–28, creating a single-resource bottleneck that is cascading into missed sprint commitments.',
    hypothesis: 'Removing the double-allocation or providing a contingency resource will restore velocity on both projects within 5 business days.',
    issues: [
      { id: 'ISS-001', title: 'Synapse Health delivery milestone missed', domain: 'Delivery', severity: 'P1' },
      { id: 'ISS-004', title: 'Key resource conflict — Aarav Shah double-booked', domain: 'People', severity: 'P2' },
    ],
    entities: ['Synapse Health', 'Project Meridian', 'Aarav Shah'],
    detectedAt: '2026-06-21T07:45:00Z',
    status: 'investigating',
    pirReady: false,
  },
  {
    id: 'RCA-002',
    title: 'Revenue risk cluster — Meridian Logistics disengagement',
    classification: 'Correlated',
    kimmpConfidence: 87,
    rootCause: 'Three independent signals (deal flagged at-risk in CRM, invoice overdue 18 days, no client contact in 22 days) converge on the same entity within a 30-day window. Historical pattern matches pre-churn signature in 87% of similar cases.',
    hypothesis: 'Proactive retention engagement within 24h, combined with invoice resolution, will reverse the churn signal within 2 weeks.',
    issues: [
      { id: 'ISS-002', title: 'Client churn risk elevated — Meridian Logistics', domain: 'Revenue', severity: 'P1' },
      { id: 'ISS-003', title: 'Finance: AR overdue threshold exceeded', domain: 'Finance', severity: 'P2' },
    ],
    entities: ['Meridian Logistics'],
    detectedAt: '2026-06-21T06:15:00Z',
    status: 'active',
    pirReady: false,
  },
  {
    id: 'RCA-003',
    title: 'Compliance control drift — access review failure',
    classification: 'Isolated',
    kimmpConfidence: 100,
    rootCause: 'The 90-day access review cycle was not enforced due to the absence of automated scheduling. 12 accounts exceeded the review window, triggering an AEGIS SOC 2 control violation flag. Root cause is a process gap, not a security incident.',
    hypothesis: 'Completing the review today and implementing automated 85-day reminder automation will prevent recurrence.',
    issues: [
      { id: 'ISS-005', title: 'GDPR access review overdue — 12 users', domain: 'Compliance', severity: 'P2' },
    ],
    entities: ['AEGIS', 'IT Admin'],
    detectedAt: '2026-06-21T00:00:00Z',
    status: 'active',
    pirReady: false,
  },
  {
    id: 'RCA-004',
    title: 'Pipeline generation failure — marketing execution gap',
    classification: 'Isolated',
    kimmpConfidence: 76,
    rootCause: 'Three planned campaigns in Q2 were delayed due to copy review bottleneck. No backup pipeline generation mechanism was in place. The result is a 38% shortfall in lead volume with 10 days remaining.',
    hypothesis: 'Activating the backup outbound sequence can recover approximately 6–9 leads in the remaining window, partially closing the gap.',
    issues: [
      { id: 'ISS-006', title: 'Marketing: Q2 lead pipeline 38% below target', domain: 'Operations', severity: 'P3' },
      { id: 'ISS-007', title: 'Consultation show-rate dropped to 58%', domain: 'Revenue', severity: 'P3' },
    ],
    entities: ['Marketing', 'Sales Pipeline'],
    detectedAt: '2026-06-19T14:00:00Z',
    status: 'investigating',
    pirReady: true,
  },
]

const CLASS_COLOR: Record<Cluster['classification'], string> = {
  Systemic:   '#e2445c',
  Correlated: '#fdab3d',
  Isolated:   '#2564ea',
}

function ClusterCard({ cluster }: { cluster: Cluster }) {
  const [open, setOpen] = useState(false)
  const classColor = CLASS_COLOR[cluster.classification]

  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: '#0d1117', border: `1px solid #2E2854`, borderLeft: `3px solid ${classColor}` }}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: `${classColor}14`, border: `1px solid ${classColor}28` }}>
            <Link2 className="w-4 h-4" style={{ color: classColor }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white leading-tight">{cluster.title}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                    style={{ color: classColor, background: `${classColor}14`, border: `1px solid ${classColor}28` }}>
                    {cluster.classification}
                  </span>
                  <span className="text-[10px] text-slate-500">{cluster.id}</span>
                  <span className="text-[10px] text-slate-600">·</span>
                  <span className="text-[10px] text-slate-500">{cluster.issues.length} issue{cluster.issues.length !== 1 ? 's' : ''}</span>
                  <span className="text-[10px] text-slate-600">·</span>
                  <span className="text-[10px] text-slate-500">{cluster.entities.join(', ')}</span>
                </div>
              </div>
              <span className="flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg capitalize"
                style={{
                  color: cluster.status === 'resolved' ? '#00c875' : cluster.status === 'investigating' ? '#fdab3d' : '#64748b',
                  background: cluster.status === 'resolved' ? 'rgba(0,200,117,0.1)' : cluster.status === 'investigating' ? 'rgba(253,171,61,0.1)' : 'rgba(100,116,139,0.1)',
                  border: `1px solid ${cluster.status === 'resolved' ? 'rgba(0,200,117,0.3)' : cluster.status === 'investigating' ? 'rgba(253,171,61,0.3)' : 'rgba(100,116,139,0.2)'}`,
                }}>
                {cluster.status}
              </span>
            </div>

            {/* KIMMP root cause */}
            <div className="mt-2.5 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Brain className="w-3 h-3 text-purple-400 flex-shrink-0" />
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  KIMMP Root Cause · {cluster.kimmpConfidence}% confidence
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{cluster.rootCause}</p>
            </div>

            {/* Linked issues */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {cluster.issues.map(iss => (
                <span key={iss.id} className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg"
                  style={{ background: '#1a2035', border: '1px solid #2E2854', color: '#94a3b8' }}>
                  <CircleDot className="w-2.5 h-2.5 text-slate-600" />
                  {iss.id} · {iss.severity}
                </span>
              ))}
            </div>

            {open && (
              <div className="mt-3 pt-3 space-y-2.5" style={{ borderTop: '1px solid #1f2a4a' }}>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Resolution Hypothesis</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{cluster.hypothesis}</p>
                </div>
                {cluster.pirReady && (
                  <button className="flex items-center gap-2 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                    style={{ background: 'rgba(0,200,117,0.08)', border: '1px solid rgba(0,200,117,0.2)', color: '#00c875' }}>
                    <FileText className="w-3.5 h-3.5" />
                    Open Post-Issue Review (PIR) Template
                  </button>
                )}
              </div>
            )}

            <button onClick={() => setOpen(o => !o)}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-os-blue transition-colors">
              {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {open ? 'Collapse' : 'Expand hypothesis'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function RootCausePage() {
  const systemic   = CLUSTERS.filter(c => c.classification === 'Systemic').length
  const correlated = CLUSTERS.filter(c => c.classification === 'Correlated').length

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { label: 'Systemic',   count: systemic,   color: '#e2445c', desc: 'Root cause spans multiple entities' },
          { label: 'Correlated', count: correlated,  color: '#fdab3d', desc: 'Issues share timing or entity proximity' },
          { label: 'Isolated',   count: CLUSTERS.filter(c => c.classification === 'Isolated').length, color: '#2564ea', desc: 'Single-entity, contained root cause' },
        ] as const).map(s => (
          <div key={s.label} className="rounded-xl p-3.5"
            style={{ background: '#0d1117', border: `1px solid ${s.color}20` }}>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white tabular-nums">{s.count}</span>
              <span className="text-[11px] font-bold" style={{ color: s.color }}>{s.label}</span>
            </div>
            <p className="text-[10px] text-slate-600 mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Signal pyramid note */}
      <div className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
        <Brain className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-bold text-purple-300 mb-1">KIMMP Correlation Engine — Level 3 Signal Processing</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            KIMMP groups issues by entity overlap, timing proximity, and domain pattern. Clusters classified as Systemic require strategic intervention.
            Correlated clusters share a probable common trigger. Isolated issues are self-contained and addressable independently.
          </p>
        </div>
      </div>

      {/* Clusters */}
      <div className="space-y-3">
        {CLUSTERS.map(c => <ClusterCard key={c.id} cluster={c} />)}
      </div>
    </div>
  )
}

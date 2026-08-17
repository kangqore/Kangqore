import { useState } from 'react'
import { Brain, Link2, ChevronDown, ChevronUp, FileText, CircleDot, Database } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

interface LiveProject { id: string; name: string; health: string; status: string }
interface AuditLogsResponse { logs: { id: string; action: string; createdAt: string }[]; pagination: { total: number } }

function useLiveRCAData() {
  const projects = useQuery<{ projects: LiveProject[] } | LiveProject[]>({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
    staleTime: 60_000,
  })
  const auditLogs = useQuery<AuditLogsResponse>({
    queryKey: ['audit-logs'],
    queryFn: () => api.get('/admin/audit-logs').then(r => r.data),
    staleTime: 60_000,
  })
  return { projects, auditLogs }
}

function getProjects(data: { projects: LiveProject[] } | LiveProject[] | undefined): LiveProject[] {
  if (!data) return []
  return Array.isArray(data) ? data : (data.projects ?? [])
}

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
  Isolated:   '#579bfc',
}

function ClusterCard({ cluster }: { cluster: Cluster }) {
  const [open, setOpen] = useState(false)
  const classColor = CLASS_COLOR[cluster.classification]

  const statusColor = cluster.status === 'resolved' ? '#00c875' : cluster.status === 'investigating' ? '#fdab3d' : 'var(--os-text-3)'
  const statusBg    = cluster.status === 'resolved' ? '#00c87512' : cluster.status === 'investigating' ? '#fdab3d12' : 'var(--os-surface-0)'
  const statusBorder = cluster.status === 'resolved' ? '#00c87530' : cluster.status === 'investigating' ? '#fdab3d30' : 'var(--os-border)'

  return (
    <div className="os-card overflow-hidden" style={{ borderLeft: `4px solid ${classColor}` }}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: classColor + '14', border: `1px solid ${classColor}28` }}>
            <Link2 className="w-4 h-4" style={{ color: classColor }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--os-text-1)' }}>{cluster.title}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-2xl"
                    style={{ color: classColor, background: classColor + '14', border: `1px solid ${classColor}28` }}>
                    {cluster.classification}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--os-text-3)' }}>{cluster.id}</span>
                  <span className="text-[10px]" style={{ color: 'var(--os-text-3)' }}>·</span>
                  <span className="text-[10px]" style={{ color: 'var(--os-text-3)' }}>{cluster.issues.length} issue{cluster.issues.length !== 1 ? 's' : ''}</span>
                  <span className="text-[10px]" style={{ color: 'var(--os-text-3)' }}>·</span>
                  <span className="text-[10px]" style={{ color: 'var(--os-text-3)' }}>{cluster.entities.join(', ')}</span>
                </div>
              </div>
              <span className="flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-2xl capitalize"
                style={{ color: statusColor, background: statusBg, border: `1px solid ${statusBorder}` }}>
                {cluster.status}
              </span>
            </div>

            {/* KIMMP root cause */}
            <div className="mt-2.5 px-3 py-2 rounded-2xl"
              style={{ background: '#7c3aed08', border: '1px solid #7c3aed18' }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Brain className="w-3 h-3 flex-shrink-0" style={{ color: '#7c3aed' }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#7c3aed' }}>
                  KIMMP Root Cause · {cluster.kimmpConfidence}% confidence
                </span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--os-text-2)' }}>{cluster.rootCause}</p>
            </div>

            {/* Linked issues */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {cluster.issues.map(iss => (
                <span key={iss.id} className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-2xl"
                  style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-2)' }}>
                  <CircleDot className="w-2.5 h-2.5" style={{ color: 'var(--os-text-3)' }} />
                  {iss.id} · {iss.severity}
                </span>
              ))}
            </div>

            {open && (
              <div className="mt-3 pt-3 space-y-2.5 border-t border-[var(--os-border)]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--os-text-3)' }}>Resolution Hypothesis</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--os-text-2)' }}>{cluster.hypothesis}</p>
                </div>
                {cluster.pirReady && (
                  <button className="flex items-center gap-2 text-[11px] font-semibold px-3 py-1.5 rounded-2xl transition-all hover:opacity-80"
                    style={{ background: '#00c87510', border: '1px solid #00c87525', color: '#00c875' }}>
                    <FileText className="w-3.5 h-3.5" />
                    Open Post-Issue Review (PIR) Template
                  </button>
                )}
              </div>
            )}

            <button onClick={() => setOpen(o => !o)}
              className="mt-2 flex items-center gap-1 text-xs font-medium transition-colors hover:text-[#579bfc]"
              style={{ color: 'var(--os-text-3)' }}>
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

  const { projects: { data: projectData, isLoading: projectsLoading }, auditLogs: { data: auditData, isLoading: auditLoading } } = useLiveRCAData()
  const projects = getProjects(projectData)
  const atRiskProjects = projects.filter(p =>
    p.health === 'at-risk' || p.health === 'AT_RISK' ||
    p.health === 'critical' || p.health === 'CRITICAL' ||
    p.health === 'behind' || p.health === 'BEHIND'
  )
  const auditTotal = auditData?.pagination?.total ?? 0
  const isLoading = projectsLoading || auditLoading

  return (
    <div className="space-y-5">
      {/* Live data context */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl"
        style={{ background: '#579bfc08', border: '1px solid #579bfc20' }}>
        <Database className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#579bfc' }} />
        <p className="text-[11px]" style={{ color: 'var(--os-text-2)' }}>
          {isLoading ? (
            <span style={{ color: 'var(--os-text-3)' }}>Loading data signals…</span>
          ) : (
            <>
              Analysis based on{' '}
              {projects.length > 0 && <><span className="font-semibold" style={{ color: 'var(--os-text-1)' }}>{projects.length}</span> projects (<span style={{ color: '#fdab3d' }}>{atRiskProjects.length}</span> at risk) · </>}
              {auditTotal > 0 && <><span className="font-semibold" style={{ color: 'var(--os-text-1)' }}>{auditTotal}</span> governance events</>}
            </>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Systemic',   count: systemic,   color: '#e2445c', desc: 'Root cause spans multiple entities' },
          { label: 'Correlated', count: correlated,  color: '#fdab3d', desc: 'Issues share timing or entity proximity' },
          { label: 'Isolated',   count: CLUSTERS.filter(c => c.classification === 'Isolated').length, color: '#579bfc', desc: 'Single-entity, contained root cause' },
        ].map(s => (
          <div key={s.label} className="os-card p-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tabular-nums" style={{ color: s.color }}>{s.count}</span>
              <span className="text-[11px] font-bold" style={{ color: s.color }}>{s.label}</span>
            </div>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--os-text-3)' }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* KIMMP note */}
      <div className="os-card p-4 flex items-start gap-3">
        <Brain className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#7c3aed' }} />
        <div>
          <p className="text-[11px] font-bold mb-1" style={{ color: '#7c3aed' }}>KIMMP Correlation Engine — Level 3 Signal Processing</p>
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--os-text-2)' }}>
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

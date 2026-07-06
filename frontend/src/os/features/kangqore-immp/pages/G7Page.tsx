import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import {
  CheckCircle2, AlertTriangle, Clock, Rocket, RefreshCw,
  ChevronDown, ChevronRight, Loader2, Shield, GitCommit, Calendar,
  Hash, Play, RotateCcw, Zap, Server, Building2,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ReleaseVerdict = 'DEPLOY' | 'REVIEW' | 'BLOCK'
type FactorSeverity = 'BLOCKER' | 'WARNING'
type FactorCategory = 'CERTIFICATION' | 'RUNTIME' | 'ENVIRONMENT' | 'POLICY' | 'APPROVAL'

interface ChangeWindow {
  daysOfWeek: number[]
  startHour:  number
  endHour:    number
  timezone?:  string
}

interface DecisionFactor {
  id:          string
  category:    FactorCategory
  severity:    FactorSeverity
  description: string
  evidence?:   Record<string, unknown>
}

interface Approval {
  approver:   string
  role:       string
  approvedAt: string
}

interface DeploymentEnvironment {
  id:                  string
  name:                string
  code:                string
  certRequired:        boolean
  minCertLevel:        string | null
  approvalRequired:    boolean
  changeWindowEnabled: boolean
  changeWindows:       ChangeWindow[] | null
  decisionValidityMs:  number
  enabled:             boolean
}

interface DeploymentDecision {
  id:               string
  decisionId:       string
  rgsVersion:       string
  verdict:          ReleaseVerdict
  certId:           string
  certLevel:        string
  environment:      DeploymentEnvironment
  blockers:         DecisionFactor[]
  warnings:         DecisionFactor[]
  approvals:        Approval[]
  emergencyOverride: boolean
  overrideReason?:  string
  evaluatedBy:      string
  evaluatedAt:      string
  validUntil:       string
  sha256:           string
}

interface DeploymentRecord {
  id:          string
  deployId:    string
  rgsVersion:  string
  decisionId:  string
  decision:    { decisionId: string; verdict: string; emergencyOverride: boolean }
  certId:      string
  certLevel:   string
  environment: DeploymentEnvironment
  deployedBy:  string
  deployedAt:  string
  rollbackOf?: string
  outcome?:    'SUCCESS' | 'FAILED' | 'ROLLED_BACK'
  outcomeAt?:  string
  outcomeNote?: string
  sha256:      string
}

interface PreflightResult {
  environment:    DeploymentEnvironment | null
  factors:        DecisionFactor[]
  previewVerdict: ReleaseVerdict
  cert:           any
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const CARD    = 'var(--os-card)'
const BORDER  = 'var(--os-border)'
const TEXT1   = 'var(--os-text-1)'
const TEXT2   = 'var(--os-text-2)'
const SURFACE = 'var(--os-surface-0)'
const GREEN   = '#22c55e'
const RED     = '#ef4444'
const AMBER   = '#f59e0b'
const BLUE    = '#3b82f6'
const SLATE   = '#64748b'
const PURPLE  = '#a855f7'
const INDIGO  = '#6366f1'

const VERDICT_META: Record<ReleaseVerdict, { label: string; color: string; bg: string; icon: string }> = {
  DEPLOY: { label: 'DEPLOY',  color: GREEN,  bg: '#22c55e12', icon: '✓' },
  REVIEW: { label: 'REVIEW',  color: AMBER,  bg: '#f59e0b12', icon: '⚠' },
  BLOCK:  { label: 'BLOCK',   color: RED,    bg: '#ef444412', icon: '✗' },
}

const CATEGORY_ICON: Record<FactorCategory, any> = {
  CERTIFICATION: Shield,
  RUNTIME:       Zap,
  ENVIRONMENT:   Server,
  POLICY:        Calendar,
  APPROVAL:      CheckCircle2,
}

const ENV_ICON: Record<string, any> = {
  dev:        Building2,
  staging:    Server,
  production: Rocket,
}

function verdictColor(v: ReleaseVerdict): string { return VERDICT_META[v].color }

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function fmtHour(h: number): string {
  const period = h >= 12 ? 'PM' : 'AM'
  const display = h % 12 === 0 ? 12 : h % 12
  return `${display}:00 ${period} UTC`
}

// ─── Change Freeze Indicator ──────────────────────────────────────────────────

function ChangeFreezeIndicator({ env }: { env: DeploymentEnvironment | undefined }) {
  const status = useMemo(() => {
    if (!env?.changeWindowEnabled || !env.changeWindows?.length) return null

    const now = new Date()
    const day  = now.getUTCDay()
    const hour = now.getUTCHours()

    const inWindow = env.changeWindows.some(
      w => w.daysOfWeek.includes(day) && hour >= w.startHour && hour < w.endHour
    )

    if (inWindow) return { inside: true, label: 'Inside Change Window', next: null }

    // Find next window opening (scan next 7 days × 24 hours)
    let nextMs: number | null = null
    for (let offsetH = 1; offsetH <= 7 * 24; offsetH++) {
      const future  = new Date(now.getTime() + offsetH * 3_600_000)
      const fDay    = future.getUTCDay()
      const fHour   = future.getUTCHours()
      const hit     = env.changeWindows.some(w => w.daysOfWeek.includes(fDay) && fHour === w.startHour)
      if (hit) { nextMs = future.getTime(); break }
    }

    const hoursUntil = nextMs ? Math.round((nextMs - now.getTime()) / 3_600_000) : null
    return { inside: false, label: 'Outside Change Window', hoursUntil }
  }, [env])

  if (!status) return null

  const color = status.inside ? GREEN : AMBER
  const bg    = status.inside ? '#22c55e10' : '#f59e0b10'
  const borderColor = status.inside ? '#22c55e30' : '#f59e0b30'

  const schedule = env?.changeWindows?.map(w =>
    `${w.daysOfWeek.map(d => DAY_NAMES[d]).join('/')} ${fmtHour(w.startHour)}–${fmtHour(w.endHour)}`
  ).join(' · ')

  return (
    <div style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 10, padding: '10px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{status.label}</span>
        {!status.inside && status.hoursUntil !== null && (
          <span style={{ fontSize: 11, color: TEXT2 }}>— next window opens in <strong>{status.hoursUntil}h</strong></span>
        )}
      </div>
      {schedule && (
        <span style={{ fontSize: 10, color: SLATE, fontFamily: 'monospace' }}>{schedule}</span>
      )}
    </div>
  )
}

// ─── Approval History Panel ───────────────────────────────────────────────────

interface Approval {
  approver:   string
  role:       string
  approvedAt: string
}

function ApprovalHistoryPanel({ decision }: { decision: { decisionId: string; verdict: string; approvals: Approval[]; emergencyOverride: boolean; overrideReason?: string; evaluatedAt: string } }) {
  if (!decision.approvals.length && !decision.emergencyOverride) return null

  return (
    <div style={{ background: `${GREEN}06`, border: `1px solid ${GREEN}25`, borderRadius: 10, padding: '14px 18px', marginTop: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        Electronic Sign-off — {decision.decisionId}
        {decision.emergencyOverride && (
          <span style={{ marginLeft: 8, color: AMBER, background: `${AMBER}18`, borderRadius: 3, padding: '1px 6px' }}>
            Emergency Override
          </span>
        )}
      </div>

      {decision.approvals.length === 0 ? (
        <div style={{ fontSize: 11, color: SLATE }}>No manual approvals required for this environment.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {decision.approvals.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 style={{ width: 14, height: 14, color: GREEN, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: TEXT1 }}>{a.approver}</span>
                <span style={{ fontSize: 11, color: TEXT2, marginLeft: 8 }}>{a.role}</span>
              </div>
              <span style={{ fontSize: 10, color: SLATE, fontFamily: 'monospace', flexShrink: 0 }}>
                {new Date(a.approvedAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {decision.emergencyOverride && decision.overrideReason && (
        <div style={{ marginTop: 10, padding: '8px 12px', background: `${AMBER}10`, borderRadius: 6, fontSize: 11, color: AMBER }}>
          Override reason: {decision.overrideReason}
        </div>
      )}
    </div>
  )
}

// ─── Provenance Panel ─────────────────────────────────────────────────────────

interface ProvenanceRecord {
  deployId:        string
  rgsVersion:      string
  decisionId:      string | null
  verdict:         string | null
  emergencyOverride: boolean
  approvals:       Approval[]
  certId:          string | null
  certLevel:       string | null
  certScore:       number | null
  certIssuedAt:    string | null
  certifiedBy:     string | null
  gitCommit:       string | null
  dockerImage:     string | null
  environment:     string | null
  environmentCode: string | null
  deployedBy:      string
  deployedAt:      string
  outcome:         string | null
  rollbackOf:      string | null
  sha256Deploy:    string
  sha256Decision:  string | null
}

function ProvenanceNode({ label, value, mono = false, color = TEXT1 }: { label: string; value: string; mono?: boolean; color?: string }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', flex: '0 0 auto' }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color, fontFamily: mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{value}</div>
    </div>
  )
}

function ProvenancePanel({ deployId }: { deployId: string }) {
  const { data, isLoading } = useQuery<ProvenanceRecord>({
    queryKey: ['rgs-provenance', deployId],
    queryFn:  () => api.get(`/admin/release/deployments/${deployId}/provenance`).then(r => r.data),
    staleTime: 60_000,
  })

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: TEXT2, padding: '10px 0' }}>
      <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: 11 }}>Loading provenance…</span>
    </div>
  )
  if (!data) return null

  const outcomeColor = data.outcome === 'SUCCESS' ? GREEN : data.outcome === 'FAILED' ? RED : data.outcome === 'ROLLED_BACK' ? AMBER : SLATE

  const chain: Array<{ label: string; value: string; mono?: boolean; color?: string }> = [
    { label: 'Deployment', value: data.deployId, mono: true, color: data.outcome ? outcomeColor : BLUE },
    ...(data.decisionId ? [{ label: 'Release Decision', value: data.decisionId, mono: true }] : []),
    ...(data.certId      ? [{ label: 'QEF Certificate', value: data.certId, mono: true, color: GREEN }] : []),
    ...(data.gitCommit   ? [{ label: 'Git Commit', value: data.gitCommit.substring(0, 12), mono: true, color: PURPLE }] : []),
    ...(data.dockerImage ? [{ label: 'Docker Image', value: data.dockerImage, mono: true, color: INDIGO }] : []),
  ]

  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px', marginTop: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
        Deployment Provenance — Chain of Custody
      </div>

      {/* Chain of custody nodes */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {chain.map((node, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ProvenanceNode label={node.label} value={node.value} mono={node.mono} color={node.color} />
            {i < chain.length - 1 && (
              <span style={{ fontSize: 14, color: SLATE, fontWeight: 300 }}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* Metadata strip */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
        {[
          { label: 'Deployed By',  value: data.deployedBy },
          { label: 'Environment',  value: data.environment ?? data.environmentCode ?? '—' },
          { label: 'Cert Level',   value: (data.certLevel ?? '—').replace(/_/g, ' ') },
          ...(data.certScore !== null ? [{ label: 'Cert Score', value: `${data.certScore?.toFixed(1)}` }] : []),
          { label: 'Deployed At',  value: new Date(data.deployedAt).toLocaleString() },
          { label: 'RGS Version',  value: data.rgsVersion },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: 9, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 11, color: TEXT1 }}>{value}</div>
          </div>
        ))}

        {data.rollbackOf && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: AMBER, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Rolls Back</div>
            <div style={{ fontSize: 11, color: AMBER, fontFamily: 'monospace' }}>{data.rollbackOf}</div>
          </div>
        )}
      </div>

      {/* SHA integrity */}
      <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 9, color: SLATE }}>
          <Shield style={{ width: 9, height: 9, display: 'inline', marginRight: 4 }} />
          Deploy SHA-256: <span style={{ fontFamily: 'monospace' }}>{data.sha256Deploy.substring(0, 16)}…</span>
        </div>
        {data.sha256Decision && (
          <div style={{ fontSize: 9, color: SLATE }}>
            Decision SHA-256: <span style={{ fontFamily: 'monospace' }}>{data.sha256Decision.substring(0, 16)}…</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Executive Release Gate ───────────────────────────────────────────────────

type DomainStatus = 'PASS' | 'WARN' | 'FAIL' | 'UNKNOWN'

interface ExecutiveDomain {
  name:   string
  status: DomainStatus
  score:  number | null
  detail: string
}

const DOMAIN_META: Record<DomainStatus, { color: string; bg: string; symbol: string }> = {
  PASS:    { color: GREEN,  bg: '#22c55e10', symbol: '✓' },
  WARN:    { color: AMBER,  bg: '#f59e0b10', symbol: '⚠' },
  FAIL:    { color: RED,    bg: '#ef444410', symbol: '✗' },
  UNKNOWN: { color: SLATE,  bg: '#64748b10', symbol: '—' },
}

function gateScore(snap: Record<string, any> | null, key: string): number | null {
  if (!snap) return null
  const g = snap[key]
  return g && typeof g === 'object' ? (g.score ?? null) : null
}

function scoreStatus(score: number | null, passAt = 90, warnAt = 70): DomainStatus {
  if (score === null) return 'UNKNOWN'
  return score >= passAt ? 'PASS' : score >= warnAt ? 'WARN' : 'FAIL'
}

function buildDomains(preflight: PreflightResult): ExecutiveDomain[] {
  const cert      = preflight.cert
  const snap      = cert?.gateSnapshot ?? null
  const blockers  = preflight.factors.filter(f => f.severity === 'BLOCKER')
  const warnings  = preflight.factors.filter(f => f.severity === 'WARNING')

  const certBlocks    = blockers.filter(f => f.category === 'CERTIFICATION')
  const runtimeBlocks = blockers.filter(f => f.category === 'RUNTIME')
  const runtimeWarns  = warnings.filter(f => f.category === 'RUNTIME')
  const policyBlocks  = blockers.filter(f => f.category === 'POLICY' || f.category === 'ENVIRONMENT' || f.category === 'APPROVAL')
  const policyWarns   = warnings.filter(f => f.category === 'POLICY' || f.category === 'ENVIRONMENT' || f.category === 'APPROVAL')

  const g1 = gateScore(snap, 'gate1'), g2 = gateScore(snap, 'gate2')
  const archAvg = g1 !== null && g2 !== null ? (g1 + g2) / 2 : (g1 ?? g2)

  const g3 = gateScore(snap, 'gate3'), g35 = gateScore(snap, 'gate35')
  const perfAvg = g3 !== null && g35 !== null ? (g3 + g35) / 2 : (g3 ?? g35)

  const g4 = gateScore(snap, 'gate4'), g6 = gateScore(snap, 'gate6')
  const opAvg = g4 !== null && g6 !== null ? (g4 + g6) / 2 : (g4 ?? g6)

  const g5 = gateScore(snap, 'gate5')
  const g8 = gateScore(snap, 'gate8')
  const qualScore = cert?.overallScore ?? null

  return [
    {
      name: 'Architecture',
      status: certBlocks.length > 0 ? 'FAIL' : scoreStatus(archAvg),
      score: archAvg !== null ? Math.round(archAvg) : null,
      detail: 'G1 · G2',
    },
    {
      name: 'Quality',
      status: certBlocks.length > 0 ? 'FAIL' : scoreStatus(qualScore),
      score: qualScore !== null ? Math.round(qualScore) : null,
      detail: 'QEF Overall',
    },
    {
      name: 'Security',
      status: certBlocks.length > 0 ? 'FAIL' : scoreStatus(g5),
      score: g5 !== null ? Math.round(g5) : null,
      detail: 'G5',
    },
    {
      name: 'Performance',
      status: runtimeBlocks.length > 0 ? 'FAIL' : runtimeWarns.length > 0 ? 'WARN' : scoreStatus(perfAvg),
      score: perfAvg !== null ? Math.round(perfAvg) : null,
      detail: 'G3 · G3.5',
    },
    {
      name: 'Operational',
      status: runtimeBlocks.length > 0 ? 'FAIL' : runtimeWarns.length > 0 ? 'WARN' : scoreStatus(opAvg),
      score: opAvg !== null ? Math.round(opAvg) : null,
      detail: 'G4 · G6 · Runtime',
    },
    {
      name: 'Enterprise',
      status: policyBlocks.length > 0 ? 'FAIL' : policyWarns.length > 0 ? 'WARN' : scoreStatus(g8),
      score: g8 !== null ? Math.round(g8) : null,
      detail: 'G8 · Policy',
    },
  ]
}

function deployConfidence(domains: ExecutiveDomain[], certScore: number | null, blockerCount: number, warningCount: number): number {
  const base        = certScore ?? 50
  const domainFails = domains.filter(d => d.status === 'FAIL').length
  const domainWarns = domains.filter(d => d.status === 'WARN').length
  const unknowns    = domains.filter(d => d.status === 'UNKNOWN').length
  const raw = base - domainFails * 12 - domainWarns * 4 - unknowns * 6 - blockerCount * 8 - warningCount * 2
  return Math.max(0, Math.min(100, Math.round(raw)))
}

// ─── Why? — Confidence explanation panel ──────────────────────────────────────

interface ConfidenceFactor {
  type:      'positive' | 'risk'
  label:     string
  detail?:   string
  severity?: 'BLOCKER' | 'WARNING'
}

function buildWhyFactors(preflight: PreflightResult, domains: ExecutiveDomain[]): { positives: ConfidenceFactor[]; risks: ConfidenceFactor[] } {
  const cert      = preflight.cert
  const blockers  = preflight.factors.filter(f => f.severity === 'BLOCKER')
  const warnings  = preflight.factors.filter(f => f.severity === 'WARNING')

  const runtimeBlocks = blockers.filter(f => f.category === 'RUNTIME')
  const runtimeWarns  = warnings.filter(f => f.category === 'RUNTIME')
  const policyBlocks  = blockers.filter(f => f.category === 'POLICY' || f.category === 'ENVIRONMENT' || f.category === 'APPROVAL')
  const policyWarns   = warnings.filter(f => f.category === 'POLICY' || f.category === 'ENVIRONMENT' || f.category === 'APPROVAL')

  const positives: ConfidenceFactor[] = []
  const risks: ConfidenceFactor[]     = []

  // ── Positive signals ───────────────────────────────────────
  if (cert) {
    const lvl = cert.level ?? ''
    if (lvl === 'ENTERPRISE_CERTIFIED')
      positives.push({ type: 'positive', label: 'QEF Enterprise Certified', detail: `${cert.certId} · Score ${(cert.overallScore ?? 0).toFixed(1)}` })
    else if (lvl === 'ADVANCED_CERTIFIED')
      positives.push({ type: 'positive', label: 'QEF Advanced Certified', detail: `${cert.certId} · Score ${(cert.overallScore ?? 0).toFixed(1)}` })
    else if (lvl === 'CERTIFIED')
      positives.push({ type: 'positive', label: 'QEF Certified', detail: `${cert.certId} · Score ${(cert.overallScore ?? 0).toFixed(1)}` })

    const score = cert.overallScore ?? 0
    if (score >= 95)      positives.push({ type: 'positive', label: `Exceptional Quality Score — ${score.toFixed(1)}` })
    else if (score >= 85) positives.push({ type: 'positive', label: `Strong Quality Score — ${score.toFixed(1)}` })
  }

  if (runtimeBlocks.length === 0 && runtimeWarns.length === 0)
    positives.push({ type: 'positive', label: 'Runtime Healthy', detail: 'No incidents or service degradation detected' })

  if (policyBlocks.length === 0 && policyWarns.length === 0)
    positives.push({ type: 'positive', label: 'Zero Critical Policies', detail: 'All policy and environment checks passed' })

  const passDomains = domains.filter(d => d.status === 'PASS')
  if (passDomains.length === domains.length)
    positives.push({ type: 'positive', label: 'All Governance Domains Clear', detail: '6/6 architecture, quality, security, performance, operational, enterprise' })
  else if (passDomains.length >= 4)
    positives.push({ type: 'positive', label: `${passDomains.length}/6 Governance Domains Clear`, detail: passDomains.map(d => d.name).join(' · ') })

  if (preflight.factors.length === 0)
    positives.push({ type: 'positive', label: 'Zero Blockers or Warnings', detail: 'All preflight checks passed cleanly' })

  // ── Risk signals ───────────────────────────────────────────
  for (const f of blockers) {
    risks.push({ type: 'risk', label: f.description, detail: `${f.category} · ${f.id}`, severity: 'BLOCKER' })
  }
  for (const f of warnings) {
    risks.push({ type: 'risk', label: f.description, detail: `${f.category} · ${f.id}`, severity: 'WARNING' })
  }

  // Domain-level failures not covered by a factor
  for (const d of domains) {
    if (d.status === 'FAIL' && !blockers.some(b => b.category === 'CERTIFICATION'))
      risks.push({ type: 'risk', label: `${d.name} Domain Below Threshold`, detail: d.score !== null ? `Score ${d.score} · ${d.detail}` : d.detail, severity: 'BLOCKER' })
    else if (d.status === 'UNKNOWN' && !cert)
      risks.push({ type: 'risk', label: `${d.name} — No Certificate Data`, detail: d.detail, severity: 'WARNING' })
  }

  if (!cert)
    risks.push({ type: 'risk', label: 'No Active QEF Certificate', detail: 'Issue a certificate from the QEF tab before evaluating a release', severity: 'BLOCKER' })

  // Deduplicate by label
  const dedup = (arr: ConfidenceFactor[]) => arr.filter((f, i, a) => a.findIndex(x => x.label === f.label) === i)
  return { positives: dedup(positives), risks: dedup(risks) }
}

function DeploymentWhyPanel({ envCode, certId }: { envCode: string; certId?: string }) {
  const { data } = useQuery<PreflightResult>({
    queryKey:       ['rgs-preflight', envCode, certId],
    queryFn:        () => api.get(`/admin/release/environments/${envCode}/status${certId ? `?certId=${certId}` : ''}`).then(r => r.data),
    refetchInterval: 30_000,
  })

  if (!data) return null

  const domains = buildDomains(data)
  const { positives, risks } = buildWhyFactors(data, domains)

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '20px 24px', marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
        Why?
        <span style={{ marginLeft: 8, fontWeight: 400, color: SLATE, textTransform: 'none', letterSpacing: 0 }}>
          — the reasoning behind this confidence score
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Positive factors */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Primary Positive Factors
          </div>
          {positives.length === 0 ? (
            <div style={{ fontSize: 11, color: SLATE }}>No positive signals to report</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {positives.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <CheckCircle2 style={{ width: 13, height: 13, color: GREEN, flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: TEXT1 }}>{f.label}</div>
                    {f.detail && <div style={{ fontSize: 10, color: SLATE, marginTop: 1 }}>{f.detail}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Risk factors */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: risks.some(r => r.severity === 'BLOCKER') ? RED : AMBER, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Primary Risks
          </div>
          {risks.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: GREEN }}>
              <CheckCircle2 style={{ width: 12, height: 12 }} /> No risks identified
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {risks.map((f, i) => {
                const color = f.severity === 'BLOCKER' ? RED : AMBER
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <AlertTriangle style={{ width: 13, height: 13, color, flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: TEXT1 }}>{f.label}</div>
                      {f.detail && <div style={{ fontSize: 10, color: SLATE, marginTop: 1 }}>{f.detail}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ExecutiveGatePanel({ envCode, certId }: { envCode: string; certId?: string }) {
  const { data, isLoading } = useQuery<PreflightResult>({
    queryKey:       ['rgs-preflight', envCode, certId],
    queryFn:        () => api.get(`/admin/release/environments/${envCode}/status${certId ? `?certId=${certId}` : ''}`).then(r => r.data),
    refetchInterval: 30_000,
  })

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: TEXT2, padding: '20px 0' }}>
      <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: 12 }}>Running executive assessment…</span>
    </div>
  )
  if (!data) return null

  const domains    = buildDomains(data)
  const verdict    = data.previewVerdict
  const meta       = VERDICT_META[verdict]
  const confidence = deployConfidence(
    domains,
    data.cert?.overallScore ?? null,
    data.factors.filter(f => f.severity === 'BLOCKER').length,
    data.factors.filter(f => f.severity === 'WARNING').length,
  )
  const confColor = confidence >= 90 ? GREEN : confidence >= 70 ? AMBER : RED

  return (
    <div style={{ background: CARD, border: `1px solid ${meta.color}35`, borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
      {/* Header */}
      <div style={{
        background: `${meta.color}09`, borderBottom: `1px solid ${meta.color}20`,
        padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            Executive Release Gate
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: meta.color, letterSpacing: '-0.02em' }}>
            {meta.icon} Recommended: {verdict}
          </div>
          {data.cert && (
            <div style={{ fontSize: 11, color: SLATE, marginTop: 5, fontFamily: 'monospace' }}>
              {data.cert.certId} · {(data.cert.level ?? '').replace(/_/g, ' ')}
            </div>
          )}
          {!data.cert && (
            <div style={{ fontSize: 11, color: AMBER, marginTop: 5 }}>
              ⚠ No active QEF certificate — issue one first
            </div>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Deploy Confidence
          </div>
          <div style={{ fontSize: 40, fontWeight: 900, color: confColor, lineHeight: 1 }}>
            {confidence}<span style={{ fontSize: 20 }}>%</span>
          </div>
        </div>
      </div>

      {/* 6 domain grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {domains.map((d, i) => {
          const dm = DOMAIN_META[d.status]
          return (
            <div
              key={d.name}
              style={{
                padding: '14px 10px', textAlign: 'center',
                borderRight: i < 5 ? `1px solid ${BORDER}` : 'none',
                background: d.status === 'FAIL' ? `${dm.color}06` : 'transparent',
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 900, color: dm.color, marginBottom: 3 }}>{dm.symbol}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: dm.color, letterSpacing: '0.02em' }}>{d.status}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: TEXT1, marginTop: 5 }}>{d.name}</div>
              <div style={{ fontSize: 9, color: TEXT2, marginTop: 2 }}>{d.detail}</div>
              {d.score !== null && (
                <div style={{ fontSize: 10, color: SLATE, marginTop: 3 }}>{d.score}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FactorRow({ factor }: { factor: DecisionFactor }) {
  const [open, setOpen] = useState(false)
  const Icon  = CATEGORY_ICON[factor.category] ?? Shield
  const color = factor.severity === 'BLOCKER' ? RED : AMBER
  const bg    = factor.severity === 'BLOCKER' ? '#ef444410' : '#f59e0b10'

  return (
    <div style={{ background: bg, borderRadius: 8, marginBottom: 6, overflow: 'hidden' }}>
      <div
        style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', cursor: 'pointer' }}
        onClick={() => setOpen(o => !o)}
      >
        <Icon style={{ width: 13, height: 13, color, flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {factor.severity}
            </span>
            <span style={{ fontSize: 10, color: SLATE, background: `${SLATE}15`, borderRadius: 3, padding: '1px 5px' }}>
              {factor.category}
            </span>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: SLATE }}>{factor.id}</span>
          </div>
          <div style={{ fontSize: 12, color: TEXT1, marginTop: 2 }}>{factor.description}</div>
        </div>
        {factor.evidence && (
          open
            ? <ChevronDown  style={{ width: 12, height: 12, color: TEXT2, flexShrink: 0 }} />
            : <ChevronRight style={{ width: 12, height: 12, color: TEXT2, flexShrink: 0 }} />
        )}
      </div>
      {open && factor.evidence && (
        <div style={{ borderTop: `1px solid ${color}20`, padding: '6px 12px' }}>
          <pre style={{ fontSize: 10, color: SLATE, margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(factor.evidence, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

// ─── Preflight Panel ──────────────────────────────────────────────────────────

function PreflightPanel({ envCode, certId }: { envCode: string; certId?: string }) {
  const { data, isLoading } = useQuery<PreflightResult>({
    queryKey:  ['rgs-preflight', envCode, certId],
    queryFn:   () => api.get(`/admin/release/environments/${envCode}/status${certId ? `?certId=${certId}` : ''}`).then(r => r.data),
    refetchInterval: 30_000,
  })

  if (isLoading) return (
    <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 8, color: TEXT2 }}>
      <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: 12 }}>Running preflight checks…</span>
    </div>
  )
  if (!data) return null

  const v    = data.previewVerdict
  const meta = VERDICT_META[v]

  return (
    <div style={{ background: CARD, border: `1px solid ${verdictColor(v)}40`, borderRadius: 14, padding: '18px 22px', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            Preflight · {data.environment?.name}
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: meta.color, background: meta.bg, borderRadius: 8, padding: '6px 16px' }}>
            {meta.icon} {meta.label}
          </span>
        </div>
        {data.cert && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: TEXT2, marginBottom: 2 }}>Certificate</div>
            <div style={{ fontSize: 12, fontFamily: 'monospace', color: TEXT1, fontWeight: 600 }}>{data.cert.certId}</div>
            <div style={{ fontSize: 11, color: SLATE }}>{data.cert.level?.replace(/_/g, ' ')}</div>
          </div>
        )}
      </div>

      {data.factors.length === 0 && (
        <div style={{ fontSize: 12, color: GREEN }}>✓ All checks passed — no blockers or warnings</div>
      )}
      {data.factors.map(f => <FactorRow key={f.id} factor={f} />)}
    </div>
  )
}

// ─── Decision record card ─────────────────────────────────────────────────────

function DecisionCard({ decision, onDeploy }: { decision: DeploymentDecision; onDeploy?: () => void }) {
  const [showHash, setShowHash] = useState(false)
  const meta    = VERDICT_META[decision.verdict]
  const expired = new Date() > new Date(decision.validUntil)

  return (
    <div style={{ background: CARD, border: `1px solid ${meta.color}30`, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: meta.color, background: meta.bg, borderRadius: 7, padding: '4px 12px' }}>
              {meta.icon} {meta.label}
            </span>
            {decision.emergencyOverride && (
              <span style={{ fontSize: 10, fontWeight: 700, color: AMBER, background: `${AMBER}18`, borderRadius: 4, padding: '2px 7px', letterSpacing: '0.06em' }}>
                EMERGENCY OVERRIDE
              </span>
            )}
            {expired && (
              <span style={{ fontSize: 10, fontWeight: 700, color: SLATE, background: `${SLATE}15`, borderRadius: 4, padding: '2px 7px', letterSpacing: '0.06em' }}>
                EXPIRED
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Decision', value: decision.decisionId, mono: true, icon: Hash },
              { label: 'Certificate', value: decision.certId, mono: true, icon: Shield },
              { label: 'Environment', value: decision.environment.name, mono: false, icon: Server },
              { label: 'Level', value: decision.certLevel.replace(/_/g, ' '), mono: false, icon: GitCommit },
              { label: 'Valid Until', value: new Date(decision.validUntil).toLocaleTimeString(), mono: false, icon: Clock },
              { label: 'Evaluated', value: new Date(decision.evaluatedAt).toLocaleString(), mono: false, icon: Calendar },
            ].map(({ label, value, mono, icon: Icon }) => (
              <div key={label}>
                <div style={{ fontSize: 9, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon style={{ width: 11, height: 11, color: SLATE, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: TEXT1, fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {decision.verdict === 'DEPLOY' && !expired && onDeploy && (
          <button
            onClick={onDeploy}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: GREEN, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
          >
            <Rocket style={{ width: 13, height: 13 }} /> Record Deploy
          </button>
        )}
      </div>

      {(decision.blockers.length > 0 || decision.warnings.length > 0 || decision.approvals.length > 0) && (
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: '10px 18px' }}>
          {decision.blockers.map(f  => <FactorRow key={f.id} factor={f} />)}
          {decision.warnings.map(f  => <FactorRow key={f.id} factor={f} />)}
          {decision.emergencyOverride && decision.overrideReason && (
            <div style={{ fontSize: 11, color: AMBER, marginTop: 4 }}>
              Override reason: {decision.overrideReason}
            </div>
          )}
          {decision.approvals.length > 0 && (
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              {decision.approvals.map(a => (
                <div key={a.approver}>
                  <div style={{ fontSize: 9, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Approved By</div>
                  <div style={{ fontSize: 11, color: GREEN, fontWeight: 600 }}>{a.approver}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ borderTop: `1px solid ${BORDER}`, padding: '6px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Shield style={{ width: 11, height: 11, color: SLATE }} />
        <span style={{ fontSize: 10, color: SLATE }}>{decision.rgsVersion} · SHA-256</span>
        <button
          onClick={() => setShowHash(h => !h)}
          style={{ fontSize: 10, color: BLUE, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {showHash ? 'hide' : 'show'}
        </button>
        {showHash && <span style={{ fontSize: 9, fontFamily: 'monospace', color: SLATE, wordBreak: 'break-all' }}>{decision.sha256}</span>}
      </div>
    </div>
  )
}

// ─── Incident panel ───────────────────────────────────────────────────────────

interface IncidentRow {
  id:          string
  number:      string
  title:       string
  priority:    string
  status:      string
  description?: string
  createdAt:   string
  resolvedAt?: string
}

const PRIORITY_META: Record<string, { label: string; color: string }> = {
  'P1-CRITICAL': { label: 'P1 Critical', color: RED   },
  'P2-HIGH':     { label: 'P2 High',     color: AMBER },
  'P3-MEDIUM':   { label: 'P3 Medium',   color: BLUE  },
  'P4-LOW':      { label: 'P4 Low',      color: SLATE },
}

function IncidentPanel() {
  const qc = useQueryClient()
  const [declaring, setDeclaring] = useState(false)

  const { data: incidents = [] } = useQuery<IncidentRow[]>({
    queryKey: ['rgs-incidents'],
    queryFn:  () => api.get('/admin/release/incidents').then(r => r.data),
    refetchInterval: 30_000,
  })

  const declareIncident = useMutation({
    mutationFn: (vars: { title: string; priority: string; description?: string }) =>
      api.post('/admin/release/incidents', vars).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rgs-incidents'] })
      qc.invalidateQueries({ queryKey: ['rgs-preflight'] })
      setDeclaring(false)
    },
  })

  const resolveIncident = useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) =>
      api.patch(`/admin/release/incidents/${id}/resolve`, { resolution }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rgs-incidents'] })
      qc.invalidateQueries({ queryKey: ['rgs-preflight'] })
    },
  })

  const handleDeclare = () => {
    const title    = window.prompt('Incident title:')
    if (!title?.trim()) return
    const priority = window.prompt('Priority (P1-CRITICAL / P2-HIGH / P3-MEDIUM / P4-LOW):') ?? 'P3-MEDIUM'
    const desc     = window.prompt('Description (optional):') ?? undefined
    declareIncident.mutate({ title: title.trim(), priority: priority.trim(), description: desc?.trim() })
  }

  const handleResolve = (id: string) => {
    const resolution = window.prompt('Resolution note:') ?? 'Resolved'
    resolveIncident.mutate({ id, resolution })
  }

  const open     = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED')
  const resolved = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').slice(0, 5)
  const blocking = open.filter(i => i.priority === 'P1-CRITICAL' || i.priority === 'P2-HIGH')

  return (
    <div style={{ background: CARD, border: `1px solid ${blocking.length > 0 ? RED : BORDER}`, borderRadius: 14, padding: '18px 22px', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Incident Registry
            {blocking.length > 0 && (
              <span style={{ marginLeft: 8, fontSize: 10, color: RED, background: `${RED}15`, borderRadius: 4, padding: '1px 7px', fontWeight: 700 }}>
                {blocking.length} BLOCKING DEPLOYMENT
              </span>
            )}
          </div>
          <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>P1-CRITICAL and P2-HIGH incidents block deployment</div>
        </div>
        <button
          onClick={handleDeclare}
          disabled={declareIncident.isPending}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 13px', borderRadius: 7, border: `1px solid ${RED}40`, background: `${RED}08`, color: RED, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
        >
          <AlertTriangle style={{ width: 12, height: 12 }} />
          Declare Incident
        </button>
      </div>

      {open.length === 0 ? (
        <div style={{ fontSize: 12, color: GREEN }}>✓ No active incidents — deployment path is clear</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {open.map(i => {
            const pm = PRIORITY_META[i.priority] ?? { label: i.priority, color: SLATE }
            return (
              <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: `${pm.color}10`, borderRadius: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: pm.color, minWidth: 80 }}>{pm.label}</span>
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: SLATE, flexShrink: 0 }}>{i.number}</span>
                <span style={{ fontSize: 12, color: TEXT1, flex: 1 }}>{i.title}</span>
                <span style={{ fontSize: 10, color: SLATE, background: `${SLATE}15`, borderRadius: 4, padding: '1px 6px' }}>{i.status}</span>
                <button
                  onClick={() => handleResolve(i.id)}
                  disabled={resolveIncident.isPending}
                  style={{ fontSize: 10, color: GREEN, background: `${GREEN}12`, border: `1px solid ${GREEN}30`, borderRadius: 4, padding: '2px 8px', cursor: 'pointer', flexShrink: 0 }}
                >
                  Resolve
                </button>
              </div>
            )
          })}
        </div>
      )}

      {resolved.length > 0 && (
        <div style={{ marginTop: 10, borderTop: `1px solid ${BORDER}`, paddingTop: 8 }}>
          <div style={{ fontSize: 10, color: SLATE, marginBottom: 4 }}>Recently resolved</div>
          {resolved.map(i => (
            <div key={i.id} style={{ fontSize: 11, color: SLATE, marginBottom: 2 }}>
              ✓ {i.number} — {i.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Deployment record row ────────────────────────────────────────────────────

function DeploymentRow({ record, onOutcome }: { record: DeploymentRecord; onOutcome?: (deployId: string, outcome: string) => void }) {
  const outcomeColor = record.outcome === 'SUCCESS' ? GREEN : record.outcome === 'FAILED' ? RED : record.outcome === 'ROLLED_BACK' ? AMBER : SLATE

  return (
    <tr>
      <td style={{ padding: '10px 16px', fontSize: 11, fontFamily: 'monospace', color: TEXT1 }}>{record.deployId}</td>
      <td style={{ padding: '10px 16px', fontSize: 11, color: TEXT2 }}>{record.environment.name}</td>
      <td style={{ padding: '10px 16px', fontSize: 11, fontFamily: 'monospace', color: SLATE }}>{record.certId}</td>
      <td style={{ padding: '10px 16px', fontSize: 11, color: TEXT2 }}>{record.deployedBy}</td>
      <td style={{ padding: '10px 16px' }}>
        {record.outcome
          ? <span style={{ fontSize: 10, fontWeight: 700, color: outcomeColor, background: `${outcomeColor}15`, borderRadius: 4, padding: '2px 7px' }}>{record.outcome}</span>
          : <span style={{ fontSize: 10, color: SLATE }}>—</span>
        }
      </td>
      {record.rollbackOf && (
        <td style={{ padding: '10px 16px', fontSize: 10, color: AMBER }}>
          <RotateCcw style={{ width: 11, height: 11, display: 'inline', marginRight: 4 }} />
          rollback
        </td>
      )}
      <td style={{ padding: '10px 16px', fontSize: 11, color: TEXT2 }}>
        {new Date(record.deployedAt).toLocaleString()}
      </td>
      <td style={{ padding: '10px 16px' }}>
        {!record.outcome && onOutcome && (
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => onOutcome(record.deployId, 'SUCCESS')} style={{ fontSize: 10, color: GREEN, background: `${GREEN}12`, border: `1px solid ${GREEN}30`, borderRadius: 4, padding: '2px 7px', cursor: 'pointer' }}>Success</button>
            <button onClick={() => onOutcome(record.deployId, 'FAILED')}  style={{ fontSize: 10, color: RED,   background: `${RED}12`,   border: `1px solid ${RED}30`,   borderRadius: 4, padding: '2px 7px', cursor: 'pointer' }}>Failed</button>
          </div>
        )}
      </td>
    </tr>
  )
}

// ─── Environment selector ─────────────────────────────────────────────────────

function EnvSelector({ envs, selected, onSelect }: { envs: DeploymentEnvironment[]; selected: string; onSelect: (code: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
      {envs.map(e => {
        const Icon    = ENV_ICON[e.code] ?? Server
        const active  = selected === e.code
        return (
          <button
            key={e.code}
            onClick={() => onSelect(e.code)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 9,
              border: `1px solid ${active ? BLUE : BORDER}`,
              background: active ? `${BLUE}12` : CARD,
              color: active ? BLUE : TEXT2,
              fontSize: 12, fontWeight: active ? 700 : 400, cursor: 'pointer',
            }}
          >
            <Icon style={{ width: 13, height: 13 }} />
            {e.name}
            {e.approvalRequired && <span style={{ fontSize: 9, color: AMBER }}>approval</span>}
            {e.changeWindowEnabled && <span style={{ fontSize: 9, color: PURPLE }}>window</span>}
          </button>
        )
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function G7Page() {
  const qc = useQueryClient()

  const [selectedEnv,    setSelectedEnv]    = useState('production')
  const [showDecisions,  setShowDecisions]  = useState(false)
  const [showDeployments,setShowDeployments]= useState(true)
  const [selectedDeploy, setSelectedDeploy] = useState<string | null>(null)

  // Inline approval sign-off form state (replaces window.prompt)
  const [approverName,  setApproverName]  = useState('')
  const [approverRole,  setApproverRole]  = useState('')
  const [deployerName,  setDeployerName]  = useState('')
  const [overrideForm,  setOverrideForm]  = useState<{ approver1: string; approver2: string; reason: string } | null>(null)

  const { data: envs = [] } = useQuery<DeploymentEnvironment[]>({
    queryKey: ['rgs-environments'],
    queryFn:  () => api.get('/admin/release/environments').then(r => r.data),
  })

  const { data: decisions = [], isLoading: decisionsLoading } = useQuery<DeploymentDecision[]>({
    queryKey: ['rgs-decisions', selectedEnv],
    queryFn:  () => api.get(`/admin/release/decisions?environment=${selectedEnv}&limit=10`).then(r => r.data),
    refetchInterval: 30_000,
  })

  const { data: deployments = [] } = useQuery<DeploymentRecord[]>({
    queryKey: ['rgs-deployments', selectedEnv],
    queryFn:  () => api.get(`/admin/release/deployments?environment=${selectedEnv}&limit=10`).then(r => r.data),
    refetchInterval: 30_000,
  })

  const latestCert = useQuery<{ certId: string } | null>({
    queryKey: ['qef-latest'],
    queryFn:  () => api.get('/admin/kangqore-immp/certificates/latest').then(r => r.data),
  })

  const evaluate = useMutation({
    mutationFn: (vars: { certId: string; environment: string; approver?: string }) =>
      api.post('/admin/release/evaluate', vars).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rgs-decisions'] })
      qc.invalidateQueries({ queryKey: ['rgs-preflight'] })
      setApproverName('')
      setApproverRole('')
    },
  })

  const deploy = useMutation({
    mutationFn: (vars: { decisionId: string; deployedBy: string }) =>
      api.post('/admin/release/deploy', vars).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rgs-deployments'] })
      qc.invalidateQueries({ queryKey: ['rgs-decisions'] })
      setDeployerName('')
    },
  })

  const outcome = useMutation({
    mutationFn: (vars: { deployId: string; outcome: string; outcomeNote?: string }) =>
      api.post('/admin/release/outcome', vars).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rgs-deployments'] }),
  })

  const override = useMutation({
    mutationFn: (vars: { decisionId: string; approver1: string; approver2: string; reason: string }) =>
      api.post('/admin/release/override', vars).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rgs-decisions'] })
      qc.invalidateQueries({ queryKey: ['rgs-preflight'] })
      setOverrideForm(null)
    },
  })

  const certId         = latestCert.data?.certId
  const latestDecision = decisions[0] ?? null
  const env            = envs.find(e => e.code === selectedEnv)

  const handleEvaluate = () => {
    if (!certId) return
    if (env?.approvalRequired && !approverName.trim()) return
    const fullApprover = approverName.trim()
      ? (approverRole.trim() ? `${approverName.trim()} (${approverRole.trim()})` : approverName.trim())
      : undefined
    evaluate.mutate({ certId, environment: selectedEnv, approver: fullApprover })
  }

  const handleDeploy = (decisionId: string) => {
    if (!deployerName.trim()) return
    deploy.mutate({ decisionId, deployedBy: deployerName.trim() })
  }

  const handleOutcome = (deployId: string, o: string) => {
    const note = o === 'FAILED' ? window.prompt('Failure note (optional):') ?? undefined : undefined
    outcome.mutate({ deployId, outcome: o, outcomeNote: note })
  }

  const handleOverrideSubmit = (decisionId: string) => {
    if (!overrideForm) return
    const { approver1, approver2, reason } = overrideForm
    if (!approver1.trim() || !approver2.trim() || !reason.trim()) return
    override.mutate({ decisionId, approver1: approver1.trim(), approver2: approver2.trim(), reason: reason.trim() })
  }

  const INPUT_STYLE: React.CSSProperties = {
    padding: '7px 11px', borderRadius: 7, border: `1px solid ${BORDER}`,
    background: SURFACE, color: TEXT1, fontSize: 12, outline: 'none', width: '100%',
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT1, margin: 0 }}>Executive Release Gate</h1>
          <p style={{ fontSize: 12, color: TEXT2, margin: '3px 0 0' }}>
            RGS/1.0 · 6-domain assessment · deploy confidence · immutable deployment ledger
          </p>
        </div>
        <button
          onClick={() => { qc.invalidateQueries({ queryKey: ['rgs-decisions'] }); qc.invalidateQueries({ queryKey: ['rgs-preflight'] }) }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD, color: TEXT2, fontSize: 12, cursor: 'pointer' }}
        >
          <RefreshCw style={{ width: 13, height: 13 }} /> Refresh
        </button>
      </div>

      {/* Environment selector */}
      {envs.length > 0 && (
        <EnvSelector envs={envs} selected={selectedEnv} onSelect={setSelectedEnv} />
      )}

      {/* Change Freeze Window indicator */}
      <ChangeFreezeIndicator env={env} />

      {/* Executive Release Gate — CTO / release manager summary */}
      <ExecutiveGatePanel envCode={selectedEnv} certId={certId} />

      {/* Why? — reasoning behind the confidence score */}
      <DeploymentWhyPanel envCode={selectedEnv} certId={certId} />

      {/* Incident registry — P0/P1 incidents block deployment */}
      <IncidentPanel />

      {/* Preflight */}
      <PreflightPanel envCode={selectedEnv} certId={certId} />

      {/* ── Sign-off & Evaluate ───────────────────────────────────────────── */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '18px 22px', marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
          Release Sign-off
        </div>

        {/* Approval required: show named approver form */}
        {env?.approvalRequired && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 180px', minWidth: 160 }}>
              <div style={{ fontSize: 10, color: TEXT2, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Approver Name <span style={{ color: RED }}>*</span></div>
              <input
                value={approverName}
                onChange={e => setApproverName(e.target.value)}
                placeholder="e.g. C.O.D.E."
                style={INPUT_STYLE}
              />
            </div>
            <div style={{ flex: '1 1 140px', minWidth: 120 }}>
              <div style={{ fontSize: 10, color: TEXT2, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</div>
              <input
                value={approverRole}
                onChange={e => setApproverRole(e.target.value)}
                placeholder="e.g. CTO"
                style={INPUT_STYLE}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={handleEvaluate}
            disabled={evaluate.isPending || !certId || (env?.approvalRequired && !approverName.trim())}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 9,
              border: 'none', background: BLUE, color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: evaluate.isPending || !certId || (env?.approvalRequired && !approverName.trim()) ? 'not-allowed' : 'pointer',
              opacity: evaluate.isPending || !certId || (env?.approvalRequired && !approverName.trim()) ? 0.6 : 1,
            }}
          >
            {evaluate.isPending
              ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
              : <Play style={{ width: 14, height: 14 }} />
            }
            {evaluate.isPending ? 'Evaluating…' : 'Evaluate Release'}
          </button>
          {!certId && (
            <span style={{ fontSize: 11, color: AMBER }}>⚠ No active QEF certificate — issue one from the QEF tab first</span>
          )}
          {env?.approvalRequired && certId && !approverName.trim() && (
            <span style={{ fontSize: 11, color: AMBER }}>⚠ Approver name required for {env.name}</span>
          )}
        </div>
      </div>

      {/* Latest decision */}
      {decisionsLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: TEXT2, marginBottom: 24 }}>
          <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 12 }}>Loading decisions…</span>
        </div>
      ) : latestDecision ? (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Latest Decision
          </div>
          <DecisionCard
            decision={latestDecision}
            onDeploy={undefined}
          />

          {/* Approval sign-off chain */}
          <ApprovalHistoryPanel decision={latestDecision} />

          {/* Record Deploy — inline deployer sign-off */}
          {latestDecision.verdict === 'DEPLOY' && !latestDecision.approvals.find(() => false) && (
            <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 180px', minWidth: 160 }}>
                <div style={{ fontSize: 10, color: TEXT2, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deployed By</div>
                <input
                  value={deployerName}
                  onChange={e => setDeployerName(e.target.value)}
                  placeholder="Your name"
                  style={INPUT_STYLE}
                />
              </div>
              <button
                onClick={() => handleDeploy(latestDecision.decisionId)}
                disabled={deploy.isPending || !deployerName.trim() || !!latestDecision.approvals.length === false}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 8,
                  border: 'none', background: GREEN, color: '#fff', fontSize: 12, fontWeight: 700,
                  cursor: deploy.isPending || !deployerName.trim() ? 'not-allowed' : 'pointer',
                  opacity: deploy.isPending || !deployerName.trim() ? 0.6 : 1, flexShrink: 0,
                }}
              >
                <Rocket style={{ width: 13, height: 13 }} />
                {deploy.isPending ? 'Recording…' : 'Record Deployment'}
              </button>
            </div>
          )}

          {/* Emergency override form */}
          {latestDecision.verdict === 'BLOCK' && (
            <div style={{ marginTop: 12 }}>
              {!overrideForm ? (
                <button
                  onClick={() => setOverrideForm({ approver1: '', approver2: '', reason: '' })}
                  style={{ fontSize: 11, color: AMBER, background: `${AMBER}12`, border: `1px solid ${AMBER}40`, borderRadius: 7, padding: '6px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Zap style={{ width: 12, height: 12 }} />
                  Emergency Override (requires 2 approvers)
                </button>
              ) : (
                <div style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}30`, borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: AMBER, marginBottom: 12 }}>
                    Emergency Override — 2 approvers required · AEGIS logged
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                    <div style={{ flex: '1 1 160px' }}>
                      <div style={{ fontSize: 10, color: TEXT2, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>First Approver</div>
                      <input value={overrideForm.approver1} onChange={e => setOverrideForm(f => f ? { ...f, approver1: e.target.value } : f)} placeholder="Release authority" style={INPUT_STYLE} />
                    </div>
                    <div style={{ flex: '1 1 160px' }}>
                      <div style={{ fontSize: 10, color: TEXT2, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Second Approver</div>
                      <input value={overrideForm.approver2} onChange={e => setOverrideForm(f => f ? { ...f, approver2: e.target.value } : f)} placeholder="Second authority" style={INPUT_STYLE} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: TEXT2, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Override Reason <span style={{ color: RED }}>*</span></div>
                    <input value={overrideForm.reason} onChange={e => setOverrideForm(f => f ? { ...f, reason: e.target.value } : f)} placeholder="Why is it safe to deploy despite the blocker?" style={INPUT_STYLE} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleOverrideSubmit(latestDecision.decisionId)}
                      disabled={override.isPending || !overrideForm.approver1.trim() || !overrideForm.approver2.trim() || !overrideForm.reason.trim()}
                      style={{ padding: '7px 16px', borderRadius: 7, border: 'none', background: AMBER, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: override.isPending ? 0.6 : 1 }}
                    >
                      {override.isPending ? 'Applying…' : 'Apply Override'}
                    </button>
                    <button onClick={() => setOverrideForm(null)} style={{ padding: '7px 14px', borderRadius: 7, border: `1px solid ${BORDER}`, background: CARD, color: TEXT2, fontSize: 12, cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: CARD, border: `1px dashed ${BORDER}`, borderRadius: 12, padding: '28px', textAlign: 'center', marginBottom: 24 }}>
          <Rocket style={{ width: 28, height: 28, color: SLATE, margin: '0 auto 10px' }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: TEXT1, marginBottom: 4 }}>No release decisions yet</div>
          <div style={{ fontSize: 12, color: TEXT2 }}>Evaluate a release to generate the first RGS decision for {env?.name ?? selectedEnv}.</div>
        </div>
      )}

      {/* Decision history */}
      {decisions.length > 1 && (
        <div style={{ marginBottom: 28 }}>
          <button
            onClick={() => setShowDecisions(o => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {showDecisions ? <ChevronDown style={{ width: 13, height: 13 }} /> : <ChevronRight style={{ width: 13, height: 13 }} />}
            Decision History ({decisions.length - 1} earlier)
          </button>
          {showDecisions && decisions.slice(1).map(d => (
            <div key={d.decisionId}>
              <DecisionCard decision={d} />
              <ApprovalHistoryPanel decision={d} />
            </div>
          ))}
        </div>
      )}

      {/* Deployment ledger */}
      <div>
        <button
          onClick={() => setShowDeployments(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {showDeployments ? <ChevronDown style={{ width: 13, height: 13 }} /> : <ChevronRight style={{ width: 13, height: 13 }} />}
          Deployment Ledger
        </button>
        {showDeployments && (
          deployments.length === 0 ? (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: TEXT2 }}>No deployments recorded for {env?.name ?? selectedEnv} yet.</div>
            </div>
          ) : (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {['Deploy ID', 'Environment', 'Certificate', 'Deployed By', 'Outcome', '', 'When', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '9px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deployments.map(r => (
                    <DeploymentRow
                      key={r.deployId}
                      record={r}
                      onOutcome={handleOutcome}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Deployment Provenance — chain of custody for selected deployment */}
      {showDeployments && deployments.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Deployment Provenance
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {deployments.slice(0, 5).map(r => (
              <button
                key={r.deployId}
                onClick={() => setSelectedDeploy(r.deployId === selectedDeploy ? null : r.deployId)}
                style={{
                  fontSize: 10, fontFamily: 'monospace', padding: '4px 10px', borderRadius: 6,
                  border: `1px solid ${r.deployId === selectedDeploy ? BLUE : BORDER}`,
                  background: r.deployId === selectedDeploy ? `${BLUE}12` : CARD,
                  color: r.deployId === selectedDeploy ? BLUE : TEXT2,
                  cursor: 'pointer',
                }}
              >
                {r.deployId}
              </button>
            ))}
          </div>
          {selectedDeploy && <ProvenancePanel deployId={selectedDeploy} />}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

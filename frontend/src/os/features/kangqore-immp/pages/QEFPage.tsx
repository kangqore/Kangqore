import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import {
  CheckCircle2, XCircle, Clock, AlertTriangle, RefreshCw,
  ShieldCheck, Cpu, Activity, GitBranch, Eye, Building2, Rocket,
  ChevronDown, ChevronRight, Play, Loader2, Award, Hash, GitCommit,
  Calendar, Shield, ExternalLink,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type GateStatus = 'PASS' | 'FAIL' | 'DEGRADED' | 'PARTIAL' | 'PENDING'

type CertLevel =
  | 'ENTERPRISE_CERTIFIED'
  | 'ADVANCED_CERTIFIED'
  | 'CERTIFIED'
  | 'NOT_CERTIFIED'

type CertificateStatus = 'DRAFT' | 'ACTIVE' | 'SUPERSEDED' | 'REVOKED' | 'EXPIRED'

interface GateDelta {
  name:            string
  previousScore:   number
  currentScore:    number
  scoreDelta:      number
  previousStatus:  string
  currentStatus:   string
  statusChanged:   boolean
  improved:        boolean
  regressed:       boolean
}

interface CertificateDiff {
  fromCertId:       string
  toCertId:         string
  fromLevel:        string
  toLevel:          string
  levelChanged:     boolean
  scoreImprovement: number
  gates:            Record<string, GateDelta>
  improvements:     string[]
  regressions:      string[]
  unchanged:        string[]
}

interface GateEvidence {
  name:          string
  status:        string
  score:         number
  passCount:     number
  failCount:     number
  detail:        string
  runnerVersion: string
  executionMs:   number
  at?:           string
}

interface ScopeItem {
  id:        string
  label:     string
  gate:      string
  certified: boolean
}

interface QEFCertificate {
  certId:             string
  version:            string
  qefSchemaVersion?:  string   // versioned contract identifier, e.g. "QEF/1.0"
  status:             'CERTIFIED' | 'NOT_CERTIFIED'
  level:              CertLevel
  certificateStatus:  CertificateStatus
  previousCertId?:    string
  overallScore:       number
  gitCommit?:         string
  schemaVersion?:     string
  migrationStatus?:   string
  environment:        string
  sha256:             string
  gateSnapshot:       Record<string, GateEvidence>
  scope:              ScopeItem[]
  certifiedBy:        string
  reviewedBy?:        string
  approvedBy?:        string
  revokedAt?:         string
  revokedReason?:     string
  issuedAt:           string
}

interface CertHistoryRow {
  certId:            string
  version:           string
  status:            'CERTIFIED' | 'NOT_CERTIFIED'
  level:             CertLevel
  certificateStatus: CertificateStatus
  previousCertId?:   string
  overallScore:      number
  gitCommit?:        string
  environment:       string
  issuedAt:          string
  sha256:            string
  revokedAt?:        string
}

interface ReadinessData {
  readyForRelease:   boolean
  overall:           number
  blockingIssues:    string[]
  warnings:          string[]
  recommendedAction: 'Deploy' | 'Block' | 'Review'
  timestamp:         string
  gates:  Record<string, { name: string; status: GateStatus; weight: number }>
  detail: Record<string, any>
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const CARD    = 'var(--os-card)'
const BORDER  = 'var(--os-border)'
const TEXT1   = 'var(--os-text-1)'
const TEXT2   = 'var(--os-text-2)'
const SURFACE = 'var(--os-surface-0)'
const BLUE    = '#3b82f6'
const GREEN   = '#22c55e'
const RED     = '#ef4444'
const AMBER   = '#f59e0b'
const GOLD    = '#eab308'
const SILVER  = '#94a3b8'
const BRONZE  = '#b45309'
const PURPLE  = '#a855f7'
const SLATE   = '#64748b'
const CYAN    = '#06b6d4'

const LEVEL_META: Record<CertLevel, { label: string; medal: string; color: string; min: number }> = {
  ENTERPRISE_CERTIFIED: { label: 'Enterprise Certified', medal: '🥇', color: GOLD,   min: 95  },
  ADVANCED_CERTIFIED:   { label: 'Advanced Certified',   medal: '🥈', color: SILVER, min: 85  },
  CERTIFIED:            { label: 'Certified',             medal: '🥉', color: BRONZE, min: 75  },
  NOT_CERTIFIED:        { label: 'Not Certified',         medal: '✗',  color: RED,    min: 0   },
}

const GATE_ICON: Record<string, any> = {
  gate1:  ShieldCheck,
  gate2:  Activity,
  gate3:  Cpu,
  gate35: Cpu,
  gate4:  GitBranch,
  gate5:  Eye,
  gate6:  Building2,
  gate7:  Rocket,
}

const GATE_MATURITY: Record<string, { label: string; color: string }> = {
  gate1:  { label: 'L1 Engineering', color: BLUE   },
  gate2:  { label: 'L1 Engineering', color: BLUE   },
  gate3:  { label: 'L2 AI',          color: PURPLE },
  gate35: { label: 'L2 AI',          color: PURPLE },
  gate4:  { label: 'L2 AI',          color: PURPLE },
  gate5:  { label: 'L3 Experience',  color: CYAN   },
  gate6:  { label: 'L4 Enterprise',  color: AMBER  },
  gate7:  { label: 'L4 Enterprise',  color: AMBER  },
}

const GATE_ID_LABEL: Record<string, string> = {
  gate1:  'QEF-G1',
  gate2:  'QEF-G2',
  gate3:  'QEF-G3',
  gate35: 'QEF-G3.5',
  gate4:  'QEF-G4',
  gate5:  'QEF-G5',
  gate6:  'QEF-G6',
  gate7:  'QEF-G7',
}

function statusDisplayLabel(s: string): string {
  if (s === 'PASS')     return 'Verified'
  if (s === 'FAIL')     return 'Criterion Not Met'
  if (s === 'PENDING')  return 'Awaiting Verification'
  if (s === 'PARTIAL')  return 'Partially Verified'
  if (s === 'DEGRADED') return 'Degraded'
  return s
}

function statusColor(s: string): string {
  if (s === 'PASS')     return GREEN
  if (s === 'FAIL')     return RED
  if (s === 'PARTIAL')  return AMBER
  if (s === 'DEGRADED') return AMBER
  return SLATE
}
function statusBg(s: string): string {
  if (s === 'PASS')     return '#22c55e18'
  if (s === 'FAIL')     return '#ef444418'
  if (s === 'PARTIAL')  return '#f59e0b18'
  if (s === 'DEGRADED') return '#f59e0b18'
  return '#64748b18'
}

function StatusIcon({ status, size = 15 }: { status: string; size?: number }) {
  const s = { width: size, height: size }
  if (status === 'PASS')    return <CheckCircle2 style={{ ...s, color: GREEN }} />
  if (status === 'FAIL')    return <XCircle      style={{ ...s, color: RED   }} />
  if (status === 'PENDING') return <Clock        style={{ ...s, color: SLATE }} />
  return <AlertTriangle style={{ ...s, color: AMBER }} />
}

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, label, size = 80 }: { score: number; label: string; size?: number }) {
  const R    = (size - 10) / 2
  const C    = 2 * Math.PI * R
  const dash = (score / 100) * C
  const color = score >= 95 ? GOLD : score >= 85 ? SILVER : score >= 75 ? GREEN : score >= 50 ? AMBER : RED

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={R} fill="none" stroke={BORDER} strokeWidth={7} />
        <circle
          cx={size/2} cy={size/2} r={R} fill="none"
          stroke={color} strokeWidth={7} strokeLinecap="round"
          strokeDasharray={`${dash} ${C - dash}`}
          strokeDashoffset={C / 4}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size < 90 ? 16 : 24, fontWeight: 700, color, lineHeight: 1 }}>{score.toFixed(1)}</span>
        {label && <span style={{ fontSize: 9, color: TEXT2, marginTop: 2, textAlign: 'center', lineHeight: 1.2 }}>{label}</span>}
      </div>
    </div>
  )
}

// ─── Certificate status badge ─────────────────────────────────────────────────

const CERT_STATUS_META: Record<CertificateStatus, { label: string; color: string }> = {
  DRAFT:      { label: 'DRAFT',      color: BLUE   },
  ACTIVE:     { label: 'ACTIVE',     color: GREEN  },
  SUPERSEDED: { label: 'SUPERSEDED', color: SLATE  },
  REVOKED:    { label: 'REVOKED',    color: RED    },
  EXPIRED:    { label: 'EXPIRED',    color: AMBER  },
}

// ─── Certification artifact ───────────────────────────────────────────────────

function CertificateArtifact({ cert, onRevoke, onApprove }: { cert: QEFCertificate; onRevoke?: () => void; onApprove?: () => void }) {
  const [showHash,     setShowHash]     = useState(false)
  const [showEvidence, setShowEvidence] = useState(false)

  const meta       = LEVEL_META[cert.level]
  const statusMeta = CERT_STATUS_META[cert.certificateStatus]
  const issued     = new Date(cert.issuedAt)
  const isCert     = cert.status === 'CERTIFIED'
  const isActive   = cert.certificateStatus === 'ACTIVE'

  const borderColor = cert.certificateStatus === 'REVOKED' ? RED : isCert ? meta.color : SLATE
  const bgColor     = cert.certificateStatus === 'REVOKED' ? '#ef444408' : isCert ? `${meta.color}06` : '#64748b06'

  return (
    <div style={{ border: `1px solid ${borderColor}40`, borderRadius: 16, overflow: 'hidden', background: bgColor, marginBottom: 28 }}>

      {/* ── Header ── */}
      <div style={{ padding: '22px 28px 18px', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: TEXT2, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>
              Kangqore Quality Engineering Framework
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: TEXT1, marginBottom: 10, letterSpacing: '-0.02em' }}>
              QEF Certification
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: meta.color, background: `${meta.color}18`, borderRadius: 8, padding: '5px 14px' }}>
                {meta.medal} {meta.label}
              </span>
              {/* Certificate lifecycle status */}
              <span style={{ fontSize: 11, fontWeight: 700, color: statusMeta.color, background: `${statusMeta.color}18`, borderRadius: 6, padding: '3px 9px', letterSpacing: '0.06em' }}>
                {statusMeta.label}
              </span>
              <span style={{ fontSize: 11, color: TEXT2 }}>v{cert.version}</span>
            </div>
          </div>
          <ScoreRing score={cert.overallScore} label="Certification Score" size={90} />
        </div>

        {/* ── Lineage ── */}
        {cert.previousCertId && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: TEXT2 }}>
            <ChevronRight style={{ width: 12, height: 12 }} />
            <span>Supersedes</span>
            <span style={{ fontFamily: 'monospace', color: SLATE }}>{cert.previousCertId}</span>
          </div>
        )}

        {/* ── Revocation notice ── */}
        {cert.certificateStatus === 'REVOKED' && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: '#ef444415', borderRadius: 8, fontSize: 11, color: RED }}>
            ✗ Revoked{cert.revokedAt ? ` ${new Date(cert.revokedAt).toLocaleDateString()}` : ''}{cert.revokedReason ? ` — ${cert.revokedReason}` : ''}
          </div>
        )}
      </div>

      {/* ── Verification Criteria ── */}
      <div>
        {Object.entries(cert.gateSnapshot).map(([key, g], i, arr) => {
          const color    = statusColor(g.status)
          const gateId   = GATE_ID_LABEL[key] ?? key
          return (
            <div
              key={key}
              style={{
                display: 'flex', alignItems: 'center', padding: '13px 28px',
                borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none',
                gap: 12,
              }}
            >
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: TEXT2, flexShrink: 0, minWidth: 52 }}>{gateId}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: TEXT1 }}>{g.name}</span>
              <span style={{ fontSize: 11, color: TEXT2, marginRight: 8, maxWidth: 300, textAlign: 'right' }}>{g.detail}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <StatusIcon status={g.status} size={14} />
                <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 100, textAlign: 'right' }}>{statusDisplayLabel(g.status)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Build provenance ── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: '16px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Certificate ID',  value: cert.certId,          mono: true,  icon: Hash       },
          { label: 'Issued',          value: issued.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), mono: false, icon: Calendar },
          { label: 'Valid Until',     value: 'Next Successful Release', mono: false, icon: Shield  },
          { label: 'QEF Schema',      value: cert.qefSchemaVersion ?? 'QEF/1.0', mono: true, icon: Hash },
          { label: 'Git Commit',      value: cert.gitCommit ?? '—', mono: true, icon: GitCommit  },
          { label: 'DB Schema',       value: cert.schemaVersion ? `Migration ${cert.schemaVersion.substring(0, 8)}…` : '—', mono: false, icon: ExternalLink },
        ].map(({ label, value, mono, icon: Icon }) => (
          <div key={label}>
            <div style={{ fontSize: 10, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon style={{ width: 12, height: 12, color: TEXT2, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: TEXT1, fontWeight: 500, fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Evidence versioning ── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: '10px 28px' }}>
        <button
          onClick={() => setShowEvidence(e => !e)}
          style={{ fontSize: 11, color: BLUE, background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 5 }}
        >
          {showEvidence ? <ChevronDown style={{ width: 12, height: 12 }} /> : <ChevronRight style={{ width: 12, height: 12 }} />}
          Verification Engines
        </button>
        {showEvidence && (
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {Object.entries(cert.gateSnapshot).map(([key, g]) => (
              <div key={key} style={{ fontSize: 10, color: TEXT2 }}>
                <span style={{ color: TEXT1, fontWeight: 600, fontFamily: 'monospace' }}>{GATE_ID_LABEL[key] ?? key}</span>
                <span style={{ fontFamily: 'monospace', marginLeft: 4 }}>v{g.runnerVersion ?? '1.0.0'}</span>
                {g.executionMs != null && <span style={{ color: SLATE, marginLeft: 4 }}>{g.executionMs}ms</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Signatures ── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: '14px 28px', display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {[
            { role: 'Certified By', name: cert.certifiedBy         },
            { role: 'Reviewed By',  name: cert.reviewedBy ?? 'Pending' },
            { role: 'Approved By',  name: cert.approvedBy ?? 'Pending' },
          ].map(({ role, name }) => (
            <div key={role}>
              <div style={{ fontSize: 10, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{role}</div>
              <div style={{ fontSize: 12, color: name === 'Pending' ? SLATE : TEXT1, fontWeight: 500 }}>{name}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Approve DRAFT → ACTIVE */}
          {cert.certificateStatus === 'DRAFT' && onApprove && (
            <button
              onClick={onApprove}
              style={{ fontSize: 11, color: GREEN, background: `${GREEN}12`, border: `1px solid ${GREEN}40`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 }}
            >
              Approve → ACTIVE
            </button>
          )}
          {/* Revoke — only on ACTIVE */}
          {isActive && onRevoke && (
            <button
              onClick={onRevoke}
              style={{ fontSize: 11, color: RED, background: 'none', border: `1px solid ${RED}40`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}
            >
              Revoke
            </button>
          )}
        </div>
      </div>

      {/* ── Tamper-evident hash ── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: '10px 28px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Shield style={{ width: 12, height: 12, color: SLATE, flexShrink: 0 }} />
        <span style={{ fontSize: 10, color: TEXT2 }}>Tamper-evident · SHA-256</span>
        <button
          onClick={() => setShowHash(h => !h)}
          style={{ fontSize: 10, color: BLUE, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {showHash ? 'hide' : 'show hash'}
        </button>
        {showHash && (
          <span style={{ fontSize: 10, color: SLATE, fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {cert.sha256}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Scope panel ─────────────────────────────────────────────────────────────

function ScopePanel({ scope }: { scope: ScopeItem[] }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        Certification Scope
      </div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {scope.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {s.certified
                ? <CheckCircle2 style={{ width: 13, height: 13, color: GREEN, flexShrink: 0 }} />
                : <XCircle      style={{ width: 13, height: 13, color: RED,   flexShrink: 0 }} />
              }
              <span style={{ fontSize: 12, color: TEXT1 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Release history ──────────────────────────────────────────────────────────

function ReleaseHistory({ history }: { history: CertHistoryRow[] }) {
  if (!history.length) return null
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        Certification History
      </div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Certificate ID', 'Level', 'Status', 'Score', 'Lineage', 'Commit', 'Issued'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((row, i) => {
              const levelMeta  = LEVEL_META[row.level]
              const statusMeta = CERT_STATUS_META[row.certificateStatus]
              return (
                <tr key={row.certId} style={{ borderBottom: i < history.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  <td style={{ padding: '11px 16px', fontSize: 12, fontFamily: 'monospace', color: TEXT1 }}>{row.certId}</td>
                  <td style={{ padding: '11px 16px', fontSize: 12, color: levelMeta.color }}>{levelMeta.medal} {levelMeta.label}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: statusMeta.color, background: `${statusMeta.color}15`, borderRadius: 4, padding: '2px 7px', letterSpacing: '0.06em' }}>
                      {statusMeta.label}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 12, color: TEXT1, fontWeight: 600 }}>{row.overallScore.toFixed(1)}</td>
                  <td style={{ padding: '11px 16px', fontSize: 11, fontFamily: 'monospace', color: SLATE }}>
                    {row.previousCertId ? `← ${row.previousCertId}` : '—'}
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 11, fontFamily: 'monospace', color: TEXT2 }}>{row.gitCommit ?? '—'}</td>
                  <td style={{ padding: '11px 16px', fontSize: 11, color: TEXT2 }}>
                    {new Date(row.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Release Readiness panel (separate from certification) ────────────────────

function ReadinessSeparation({ readiness }: { readiness: ReadinessData }) {
  const action      = readiness.recommendedAction
  const actionColor = action === 'Deploy' ? GREEN : action === 'Block' ? RED : AMBER

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 22px', marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        Release Readiness
        <span style={{ fontSize: 10, fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: SLATE, marginLeft: 8 }}>
          — answers "should we deploy right now?" (dynamic, not historical)
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: readiness.blockingIssues.length + readiness.warnings.length > 0 ? 12 : 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: actionColor, background: `${actionColor}15`, borderRadius: 7, padding: '6px 14px' }}>
          {action === 'Deploy' ? '✓ Deploy' : action === 'Block' ? '✗ Blocked' : '⚠ Review'}
        </span>
        <span style={{ fontSize: 12, color: TEXT2 }}>
          Runtime score {readiness.overall}% · {new Date(readiness.timestamp).toLocaleTimeString()}
        </span>
      </div>

      {readiness.blockingIssues.map(i => (
        <div key={i} style={{ fontSize: 11, color: RED,   marginBottom: 2 }}>✗ {i}</div>
      ))}
      {readiness.warnings.map(w => (
        <div key={w} style={{ fontSize: 11, color: AMBER, marginBottom: 2 }}>⚠ {w}</div>
      ))}
    </div>
  )
}

// ─── Certification criteria detail ────────────────────────────────────────────

function CriteriaDetail({ snapshot }: { snapshot: Record<string, GateEvidence> }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        Verification Criteria — Evidence
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(snapshot).map(([key, g]) => {
          const Icon    = GATE_ICON[key] ?? ShieldCheck
          const maturity = GATE_MATURITY[key]
          const color   = statusColor(g.status)
          const bg      = statusBg(g.status)
          const isOpen  = open === key

          return (
            <div key={key} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', cursor: 'pointer' }}
                onClick={() => setOpen(isOpen ? null : key)}
              >
                <div style={{ width: 3, alignSelf: 'stretch', background: color, borderRadius: 4, flexShrink: 0 }} />
                <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 15, height: 15, color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: TEXT2, flexShrink: 0 }}>{GATE_ID_LABEL[key] ?? key}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: TEXT1 }}>{g.name}</span>
                    {maturity && (
                      <span style={{ fontSize: 9, fontWeight: 600, color: maturity.color, background: `${maturity.color}18`, borderRadius: 4, padding: '1px 5px' }}>
                        {maturity.label}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: TEXT2 }}>{g.detail}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color, background: bg, borderRadius: 5, padding: '2px 8px' }}>{statusDisplayLabel(g.status)}</span>
                  {isOpen ? <ChevronDown style={{ width: 14, height: 14, color: TEXT2 }} /> : <ChevronRight style={{ width: 14, height: 14, color: TEXT2 }} />}
                </div>
              </div>
              {isOpen && (
                <div style={{ borderTop: `1px solid ${BORDER}`, padding: '10px 16px', background: SURFACE, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: GREEN }}>✓ {g.passCount} verified</span>
                  {g.failCount > 0 && <span style={{ fontSize: 11, color: RED }}>✗ {g.failCount} not met</span>}
                  <span style={{ fontSize: 11, color: TEXT2 }}>Certification Score {g.score.toFixed(1)}</span>
                  {g.runnerVersion && <span style={{ fontSize: 11, color: SLATE, fontFamily: 'monospace' }}>verification engine v{g.runnerVersion}</span>}
                  {g.executionMs != null && <span style={{ fontSize: 11, color: SLATE }}>{g.executionMs}ms</span>}
                  {g.at && <span style={{ fontSize: 11, color: TEXT2 }}>Last verified {new Date(g.at).toLocaleString()}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── No certificate placeholder ───────────────────────────────────────────────

// ─── Certificate Diff — release notes from evidence ──────────────────────────

function CertificateDiffPanel({ fromCertId, toCertId }: { fromCertId: string; toCertId: string }) {
  const [open, setOpen] = useState(false)

  const { data: diff, isLoading } = useQuery<CertificateDiff>({
    queryKey: ['qef-diff', fromCertId, toCertId],
    queryFn:  () => api.get(`/admin/kangqore-immp/certificates/diff?from=${fromCertId}&to=${toCertId}`).then(r => r.data),
    enabled:  open,
  })

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', cursor: 'pointer' }}
        onClick={() => setOpen(o => !o)}
      >
        <div>
          <span style={{ fontSize: 12, fontWeight: 600, color: TEXT1 }}>Changes from {fromCertId}</span>
          <span style={{ fontSize: 11, color: TEXT2, marginLeft: 8 }}>— release notes generated from evidence</span>
        </div>
        {open ? <ChevronDown style={{ width: 14, height: 14, color: TEXT2 }} /> : <ChevronRight style={{ width: 14, height: 14, color: TEXT2 }} />}
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${BORDER}` }}>
          {isLoading && (
            <div style={{ padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 8, color: TEXT2 }}>
              <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 12 }}>Computing diff…</span>
            </div>
          )}
          {diff && (
            <div style={{ padding: '14px 18px' }}>
              {/* Summary line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: diff.scoreImprovement >= 0 ? GREEN : RED }}>
                  {diff.scoreImprovement >= 0 ? '+' : ''}{diff.scoreImprovement.toFixed(1)} overall
                </span>
                {diff.levelChanged && (
                  <span style={{ fontSize: 11, color: TEXT2 }}>
                    {LEVEL_META[diff.fromLevel as CertLevel]?.medal} → {LEVEL_META[diff.toLevel as CertLevel]?.medal} {LEVEL_META[diff.toLevel as CertLevel]?.label}
                  </span>
                )}
              </div>

              {/* Gate-by-gate delta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                {Object.entries(diff.gates).map(([key, g]) => {
                  const color = g.improved ? GREEN : g.regressed ? RED : TEXT2
                  const arrow = g.improved ? '↑' : g.regressed ? '↓' : '→'
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color, width: 14, textAlign: 'center', fontWeight: 700 }}>{arrow}</span>
                      <span style={{ fontSize: 12, color: TEXT1, flex: 1 }}>{g.name}</span>
                      <span style={{ fontSize: 11, fontFamily: 'monospace', color: TEXT2 }}>
                        {g.previousScore.toFixed(1)} → {g.currentScore.toFixed(1)}
                      </span>
                      {g.statusChanged && (
                        <span style={{ fontSize: 10, color }}>
                          {statusDisplayLabel(g.previousStatus)} → {statusDisplayLabel(g.currentStatus)}
                        </span>
                      )}
                      {!g.statusChanged && !g.improved && !g.regressed && (
                        <span style={{ fontSize: 10, color: SLATE }}>no change</span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Narrative summary */}
              {diff.regressions.length > 0 && (
                <div style={{ background: '#ef444410', borderRadius: 8, padding: '8px 12px', marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: RED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Regressions</div>
                  {diff.regressions.map(r => <div key={r} style={{ fontSize: 11, color: RED }}>✗ {r}</div>)}
                </div>
              )}
              {diff.improvements.length > 0 && (
                <div style={{ background: '#22c55e10', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Improvements</div>
                  {diff.improvements.map(i => <div key={i} style={{ fontSize: 11, color: GREEN }}>✓ {i}</div>)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Quality Trend sparkline ──────────────────────────────────────────────────

function QualityTrend({ history }: { history: CertHistoryRow[] }) {
  if (history.length < 2) return null

  const sorted  = [...history].sort((a, b) => new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime())
  const last10  = sorted.slice(-10)
  const scores  = last10.map(r => r.overallScore)
  const minS    = Math.min(...scores)
  const maxS    = Math.max(...scores)
  const range   = Math.max(maxS - minS, 5)

  const W = 480; const H = 60; const PAD = 14

  const pts = last10.map((r, i) => {
    const x = PAD + (i / Math.max(last10.length - 1, 1)) * (W - PAD * 2)
    const y = H - PAD - ((r.overallScore - minS) / range) * (H - PAD * 2)
    return { x, y, r }
  })

  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ')
  const area     = `M${pts[0].x},${H - PAD} ` + pts.map(p => `L${p.x},${p.y}`).join(' ') + ` L${pts[pts.length-1].x},${H - PAD} Z`

  const latest   = last10[last10.length - 1]
  const previous = last10[last10.length - 2]
  const delta    = latest ? latest.overallScore - previous.overallScore : 0
  const trend    = delta > 0.5 ? 'up' : delta < -0.5 ? 'down' : 'flat'

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 22px', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Quality Trend
          </div>
          <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>Last {last10.length} certificates</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: trend === 'up' ? GREEN : trend === 'down' ? RED : TEXT2, lineHeight: 1 }}>
            {latest?.overallScore.toFixed(1)}
          </span>
          <span style={{ fontSize: 13, color: trend === 'up' ? GREEN : trend === 'down' ? RED : SLATE, fontWeight: 600 }}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {Math.abs(delta).toFixed(1)}
          </span>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
          {/* Reference lines */}
          {[75, 85, 95].map(val => {
            const y = H - PAD - ((val - minS) / range) * (H - PAD * 2)
            if (y < 0 || y > H) return null
            return (
              <g key={val}>
                <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke={BORDER} strokeWidth={1} strokeDasharray="3,3" />
                <text x={PAD - 2} y={y + 3} fontSize={7} fill={SLATE} textAnchor="end">{val}</text>
              </g>
            )
          })}

          {/* Area fill */}
          <path d={area} fill={BLUE} fillOpacity={0.06} />

          {/* Line */}
          <polyline points={polyline} fill="none" stroke={BLUE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {/* Dots */}
          {pts.map((p, i) => {
            const lvl   = p.r.level
            const color = lvl === 'ENTERPRISE_CERTIFIED' ? GOLD : lvl === 'ADVANCED_CERTIFIED' ? SILVER : lvl === 'CERTIFIED' ? GREEN : RED
            return (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={5} fill={CARD} stroke={color} strokeWidth={2.5} />
              </g>
            )
          })}
        </svg>
      </div>

      {/* X-axis labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {last10.map((r, i) => (
          (i === 0 || i === last10.length - 1 || (last10.length <= 5)) ? (
            <span key={r.certId} style={{ fontSize: 9, color: SLATE, whiteSpace: 'nowrap' }}>
              {new Date(r.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
          ) : <span key={r.certId} />
        ))}
      </div>
    </div>
  )
}

// ─── Quality Debt panel ───────────────────────────────────────────────────────

function QualityDebt({ snapshot, readiness, history }: {
  snapshot:  Record<string, GateEvidence> | undefined
  readiness: ReadinessData | undefined
  history:   CertHistoryRow[]
}) {
  const pendingGates  = snapshot ? Object.entries(snapshot).filter(([, g]) => g.status === 'PENDING') : []
  const failedGates   = snapshot ? Object.entries(snapshot).filter(([, g]) => g.status === 'FAIL')    : []
  const degradedGates = snapshot ? Object.entries(snapshot).filter(([, g]) => g.status === 'DEGRADED' || g.status === 'PARTIAL') : []
  const warnings      = readiness?.warnings ?? []
  const blocking      = readiness?.blockingIssues ?? []

  const totalItems = pendingGates.length + failedGates.length + degradedGates.length + warnings.length + blocking.length

  // Score momentum: positive or negative over last 3 certs
  const recent = [...history].sort((a, b) => new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime()).slice(-3)
  const momentum = recent.length >= 2 ? recent[recent.length - 1].overallScore - recent[0].overallScore : 0

  if (totalItems === 0 && momentum >= 0) return null

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 22px', marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
        Quality Debt
        <span style={{ fontSize: 10, fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: SLATE, marginLeft: 8 }}>
          — known gaps that need resolution
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {blocking.map(b => (
          <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 10px', background: '#ef444410', borderRadius: 8 }}>
            <XCircle style={{ width: 13, height: 13, color: RED, flexShrink: 0, marginTop: 1 }} />
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 8 }}>Blocking</span>
              <span style={{ fontSize: 12, color: TEXT1 }}>{b}</span>
            </div>
          </div>
        ))}

        {failedGates.map(([key, g]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 10px', background: '#ef444410', borderRadius: 8 }}>
            <XCircle style={{ width: 13, height: 13, color: RED, flexShrink: 0, marginTop: 1 }} />
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 8 }}>Gate Failed</span>
              <span style={{ fontSize: 12, color: TEXT1 }}>{g.name}</span>
              {g.failCount > 0 && <span style={{ fontSize: 11, color: TEXT2, marginLeft: 8 }}>{g.failCount} check{g.failCount > 1 ? 's' : ''} failing</span>}
            </div>
          </div>
        ))}

        {degradedGates.map(([key, g]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 10px', background: `${AMBER}10`, borderRadius: 8 }}>
            <AlertTriangle style={{ width: 13, height: 13, color: AMBER, flexShrink: 0, marginTop: 1 }} />
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: AMBER, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 8 }}>{g.status}</span>
              <span style={{ fontSize: 12, color: TEXT1 }}>{g.name}</span>
              <span style={{ fontSize: 11, color: TEXT2, marginLeft: 8 }}>{g.detail}</span>
            </div>
          </div>
        ))}

        {pendingGates.map(([key, g]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 10px', background: `${SLATE}10`, borderRadius: 8 }}>
            <Clock style={{ width: 13, height: 13, color: SLATE, flexShrink: 0, marginTop: 1 }} />
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 8 }}>Pending Evidence</span>
              <span style={{ fontSize: 12, color: TEXT1 }}>{g.name}</span>
              <span style={{ fontSize: 11, color: TEXT2, marginLeft: 8 }}>no run recorded — blocks Enterprise tier</span>
            </div>
          </div>
        ))}

        {warnings.map(w => (
          <div key={w} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 10px', background: `${AMBER}10`, borderRadius: 8 }}>
            <AlertTriangle style={{ width: 13, height: 13, color: AMBER, flexShrink: 0, marginTop: 1 }} />
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: AMBER, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 8 }}>Warning</span>
              <span style={{ fontSize: 12, color: TEXT1 }}>{w}</span>
            </div>
          </div>
        ))}

        {momentum < -1 && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 10px', background: `${RED}08`, borderRadius: 8 }}>
            <AlertTriangle style={{ width: 13, height: 13, color: RED, flexShrink: 0, marginTop: 1 }} />
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 8 }}>Score Declining</span>
              <span style={{ fontSize: 12, color: TEXT1 }}>Quality score has dropped {Math.abs(momentum).toFixed(1)} points over the last {recent.length} releases</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function NoCertificate({ onIssue, isPending }: { onIssue: () => void; isPending: boolean }) {
  return (
    <div style={{
      background: CARD, border: `1px dashed ${BORDER}`, borderRadius: 16,
      padding: '40px 32px', textAlign: 'center', marginBottom: 28,
    }}>
      <Award style={{ width: 36, height: 36, color: SLATE, margin: '0 auto 12px' }} />
      <div style={{ fontSize: 16, fontWeight: 700, color: TEXT1, marginBottom: 6 }}>No certificate issued yet</div>
      <div style={{ fontSize: 13, color: TEXT2, marginBottom: 20 }}>
        Issue the first QEF certificate for this platform build.
      </div>
      <button
        onClick={onIssue}
        disabled={isPending}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 22px', borderRadius: 9, border: 'none',
          background: BLUE, color: '#fff', fontSize: 13, fontWeight: 600,
          cursor: isPending ? 'wait' : 'pointer', opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : <Award style={{ width: 14, height: 14 }} />}
        {isPending ? 'Issuing…' : 'Issue QEF Certificate'}
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function QEFPage() {
  const qc = useQueryClient()

  const { data: certData, isLoading: certLoading } = useQuery<{ latest: QEFCertificate | null; history: CertHistoryRow[] }>({
    queryKey: ['qef-certificates'],
    queryFn:  () => api.get('/admin/kangqore-immp/certificates').then(r => r.data),
    refetchInterval: 60_000,
  })

  const { data: readiness } = useQuery<ReadinessData>({
    queryKey: ['qef-readiness'],
    queryFn:  () => api.get('/admin/kangqore-immp/readiness').then(r => r.data),
    refetchInterval: 30_000,
  })

  const issueCert = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/certificates/issue', {}),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['qef-certificates'] })
      qc.invalidateQueries({ queryKey: ['qef-readiness'] })
    },
  })

  const revokeCert = useMutation({
    mutationFn: ({ certId, reason }: { certId: string; reason: string }) =>
      api.post(`/admin/kangqore-immp/certificates/${certId}/revoke`, { reason }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['qef-certificates'] }),
  })

  const approveCert = useMutation({
    mutationFn: ({ certId, approver }: { certId: string; approver: string }) =>
      api.post(`/admin/kangqore-immp/certificates/${certId}/approve`, { approver }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['qef-certificates'] }),
  })

  const handleRevoke = (certId: string) => {
    const reason = window.prompt('Reason for revocation:')
    if (reason?.trim()) revokeCert.mutate({ certId, reason: reason.trim() })
  }

  const handleApprove = (certId: string) => {
    const approver = window.prompt('Approver name:')
    if (approver?.trim()) approveCert.mutate({ certId, approver: approver.trim() })
  }

  if (certLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 10, color: TEXT2 }}>
        <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: 13 }}>Loading QEF certification…</span>
      </div>
    )
  }

  const latest  = certData?.latest  ?? null
  const history = certData?.history ?? []

  return (
    <div style={{ maxWidth: 920, margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT1, margin: 0 }}>QEF Certification</h1>
          <p style={{ fontSize: 12, color: TEXT2, margin: '3px 0 0' }}>
            Quality Governance System · QEF/1.0 Frozen · every build earns a certificate
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['qef-certificates'] })}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD, color: TEXT2, fontSize: 12, cursor: 'pointer' }}
          >
            <RefreshCw style={{ width: 13, height: 13 }} /> Refresh
          </button>
          {latest && (
            <button
              onClick={() => issueCert.mutate()}
              disabled={issueCert.isPending}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${BORDER}`, background: BLUE, color: '#fff', fontSize: 12, cursor: issueCert.isPending ? 'wait' : 'pointer', opacity: issueCert.isPending ? 0.7 : 1 }}
            >
              {issueCert.isPending ? <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} /> : <Award style={{ width: 12, height: 12 }} />}
              {issueCert.isPending ? 'Issuing…' : 'Issue New Certificate'}
            </button>
          )}
        </div>
      </div>

      {/* Certificate artifact — primary view */}
      {latest
        ? <CertificateArtifact
            cert={latest}
            onRevoke={() => handleRevoke(latest.certId)}
            onApprove={() => handleApprove(latest.certId)}
          />
        : <NoCertificate onIssue={() => issueCert.mutate()} isPending={issueCert.isPending} />
      }

      {/* Quality Trend — score sparkline across last 10 certs */}
      {history.length >= 2 && <QualityTrend history={history} />}

      {/* Quality Debt — known gaps needing resolution */}
      <QualityDebt snapshot={latest?.gateSnapshot} readiness={readiness} history={history} />

      {/* Certificate diff — release notes vs previous cert */}
      {latest?.previousCertId && (
        <CertificateDiffPanel fromCertId={latest.previousCertId} toCertId={latest.certId} />
      )}

      {/* Scope */}
      {latest?.scope && <ScopePanel scope={latest.scope} />}

      {/* Release Readiness — separated */}
      {readiness && <ReadinessSeparation readiness={readiness} />}

      {/* Criteria with evidence (from latest cert snapshot) */}
      {latest?.gateSnapshot && <CriteriaDetail snapshot={latest.gateSnapshot} />}

      {/* Certification history */}
      <ReleaseHistory history={history} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

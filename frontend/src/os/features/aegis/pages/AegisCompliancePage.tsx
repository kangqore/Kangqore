import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Brain, CheckCircle, AlertTriangle, XCircle, Download, ChevronDown, ChevronUp, Clock, TrendingUp, Zap, Flag, Radio, Database, Pencil, Check } from 'lucide-react'
import { api } from '@lib/api'

type ControlStatus = 'PASS' | 'WARN' | 'FAIL'
type Framework = 'SOC 2' | 'ISO 27001' | 'NIST CSF'

interface ComplianceControl {
  id: string
  criterion: string
  framework: Framework
  category: string
  description: string
  status: ControlStatus
  lastChecked: string
  evidence: string
  kimmpSignal?: string
  issueRef?: string
}

const CONTROLS: ComplianceControl[] = [
  // SOC 2 — CC6 Logical Access
  {
    id: 'CC6.1',
    criterion: 'CC6.1',
    framework: 'SOC 2',
    category: 'Logical & Physical Access (CC6)',
    description: 'Logical access controls are implemented to restrict access to information assets to authorised individuals only.',
    status: 'PASS',
    lastChecked: '2026-06-21',
    evidence: 'AEGIS Access Sentinel active. All API endpoints require JWT. Role-based access enforced on 100% of admin routes.',
  },
  {
    id: 'CC6.2',
    criterion: 'CC6.2',
    framework: 'SOC 2',
    category: 'Logical & Physical Access (CC6)',
    description: 'Access provisioning process ensures new users receive only the minimum necessary access.',
    status: 'WARN',
    lastChecked: '2026-06-19',
    evidence: 'New user provisioning is manual. Average time from request to access grant: 3.2 days (target: <1 day). No automated workflow exists.',
    kimmpSignal: 'Manual provisioning process detected. Recommend implementing automated role assignment on user creation.',
  },
  {
    id: 'CC6.3',
    criterion: 'CC6.3',
    framework: 'SOC 2',
    category: 'Logical & Physical Access (CC6)',
    description: 'Periodic review of user access rights. Access removed within required window when no longer needed.',
    status: 'FAIL',
    lastChecked: '2026-06-21',
    evidence: '12 user accounts have not been reviewed in 91 days, exceeding the 90-day review requirement. Control CC6.3 is currently failing.',
    kimmpSignal: 'ISS-005 raised: 12 users at 91-day review threshold. SOC 2 control breach active. Immediate remediation required.',
    issueRef: 'ISS-005',
  },
  {
    id: 'CC6.6',
    criterion: 'CC6.6',
    framework: 'SOC 2',
    category: 'Logical & Physical Access (CC6)',
    description: 'Authentication controls include multi-factor authentication for all administrative access.',
    status: 'PASS',
    lastChecked: '2026-06-21',
    evidence: 'JWT-based auth with refresh token rotation. All admin routes protected. Session timeout enforced at 8h.',
  },
  {
    id: 'CC6.7',
    criterion: 'CC6.7',
    framework: 'SOC 2',
    category: 'Logical & Physical Access (CC6)',
    description: 'Transmission of confidential or sensitive information is protected using encryption.',
    status: 'PASS',
    lastChecked: '2026-06-20',
    evidence: 'All API traffic over HTTPS. TLS 1.2+ enforced. Data at rest encrypted via AES-256.',
  },
  // SOC 2 — CC7 System Operations
  {
    id: 'CC7.1',
    criterion: 'CC7.1',
    framework: 'SOC 2',
    category: 'System Operations (CC7)',
    description: 'System monitoring detects and responds to anomalies in a timely manner.',
    status: 'PASS',
    lastChecked: '2026-06-21',
    evidence: 'AEGIS monitoring 80-agent corps in real time. KIMMP Correlation Engine active. Anomaly detection running continuously.',
  },
  {
    id: 'CC7.2',
    criterion: 'CC7.2',
    framework: 'SOC 2',
    category: 'System Operations (CC7)',
    description: 'Vulnerability scanning performed on a scheduled basis and findings remediated.',
    status: 'WARN',
    lastChecked: '2026-06-06',
    evidence: 'Last full vulnerability scan completed 45 days ago. Target cadence is monthly. Scan overdue by 15 days.',
    kimmpSignal: 'Vulnerability scan cadence lapsed. Risk window open. Schedule scan within 5 days to restore control.',
  },
  {
    id: 'CC7.4',
    criterion: 'CC7.4',
    framework: 'SOC 2',
    category: 'System Operations (CC7)',
    description: 'Security incidents are identified, classified, and responded to following a documented procedure.',
    status: 'PASS',
    lastChecked: '2026-06-21',
    evidence: 'Ops Centre Issues Feed active with P1–P4 classification. Incident response SLA: 4h acknowledgement (P1), 8h (P2). KIMMP auto-escalation wired.',
  },
  // SOC 2 — CC8 Change Management
  {
    id: 'CC8.1',
    criterion: 'CC8.1',
    framework: 'SOC 2',
    category: 'Change Management (CC8)',
    description: 'Changes to infrastructure, data, and software are authorised, tested, and approved prior to implementation.',
    status: 'WARN',
    lastChecked: '2026-06-21',
    evidence: 'CHG-041 (emergency change) pending CAB sign-off for >36 hours. Emergency change SLA is 24h CAB review. Overdue by 12h.',
    kimmpSignal: 'Emergency change CHG-041 missing CAB approval within SLA. Risk of unapproved change proceeding.',
  },
  // SOC 2 — CC9 Risk Mitigation
  {
    id: 'CC9.1',
    criterion: 'CC9.1',
    framework: 'SOC 2',
    category: 'Risk Mitigation (CC9)',
    description: 'Entity identifies, selects, and develops risk mitigation activities. Risk assessment is performed annually.',
    status: 'PASS',
    lastChecked: '2026-05-15',
    evidence: 'Annual risk assessment completed 2026-05-15. KIMMP Root Cause Engine provides continuous risk correlation. Ops Centre Commitments tracking 9 risk areas.',
  },
  {
    id: 'CC9.2',
    criterion: 'CC9.2',
    framework: 'SOC 2',
    category: 'Risk Mitigation (CC9)',
    description: 'Entity assesses and manages risks associated with vendors and business partners.',
    status: 'WARN',
    lastChecked: '2026-04-01',
    evidence: '2 of 6 vendors have not had an annual security assessment. Last review cycle was 12 weeks ago (target: quarterly).',
    kimmpSignal: 'Vendor risk review cadence overdue for GlobalTech Infra and one additional vendor. Exposure window active.',
  },
  // SOC 2 — Availability
  {
    id: 'A1.1',
    criterion: 'A1.1',
    framework: 'SOC 2',
    category: 'Availability (A1)',
    description: 'System availability commitments and SLAs are monitored and reported.',
    status: 'PASS',
    lastChecked: '2026-06-21',
    evidence: 'Uptime monitoring active. Commitment tracking in Ops Centre. SLA breach prediction via KIMMP Commitment Intelligence.',
  },
  {
    id: 'A1.2',
    criterion: 'A1.2',
    framework: 'SOC 2',
    category: 'Availability (A1)',
    description: 'Recovery point and time objectives are defined and tested.',
    status: 'WARN',
    lastChecked: '2026-01-15',
    evidence: 'Last DR test completed 2026-01-15 (157 days ago). Target: bi-annual. RPO/RTO documented but untested since H1 2025.',
    kimmpSignal: 'DR test overdue. Bi-annual cycle requires test before 2026-07-15. KIMMP recommends scheduling now.',
  },
  // ISO 27001
  {
    id: 'A.9.2.1',
    criterion: 'Annex A.9.2.1',
    framework: 'ISO 27001',
    category: 'User Access Management (A.9)',
    description: 'Formal user access provisioning process implemented.',
    status: 'WARN',
    lastChecked: '2026-06-19',
    evidence: 'Matches CC6.2 — manual provisioning, 3.2-day average. Automated SCIM provisioning not yet implemented.',
    kimmpSignal: 'SCIM automation would close both ISO A.9.2.1 and SOC 2 CC6.2 simultaneously.',
  },
  {
    id: 'A.9.4.1',
    criterion: 'Annex A.9.4.1',
    framework: 'ISO 27001',
    category: 'User Access Management (A.9)',
    description: 'Information access is restricted in accordance with the access control policy.',
    status: 'FAIL',
    lastChecked: '2026-06-21',
    evidence: '12 accounts with outdated access rights. Directly maps to CC6.3 failure. Same remediation resolves both controls.',
    kimmpSignal: 'Linked to ISS-005. Completing access review resolves this control and CC6.3 simultaneously.',
    issueRef: 'ISS-005',
  },
  {
    id: 'A.12.6.1',
    criterion: 'Annex A.12.6.1',
    framework: 'ISO 27001',
    category: 'Vulnerability Management (A.12)',
    description: 'Technical vulnerabilities are identified and managed in a timely manner.',
    status: 'WARN',
    lastChecked: '2026-06-06',
    evidence: 'Vulnerability scan cadence lapsed — matches CC7.2. Last scan: 45 days ago.',
    kimmpSignal: 'Same scan resolves both ISO A.12.6.1 and SOC 2 CC7.2.',
  },
  // NIST CSF
  {
    id: 'PR.AC-1',
    criterion: 'PR.AC-1',
    framework: 'NIST CSF',
    category: 'Protect — Access Control (PR.AC)',
    description: 'Identities and credentials are managed for authorised devices, users, and processes.',
    status: 'FAIL',
    lastChecked: '2026-06-21',
    evidence: 'Access review failure (ISS-005) places this control in FAIL state. Credential lifecycle management is incomplete.',
    kimmpSignal: 'NIST PR.AC-1 failure is the third framework control impacted by ISS-005. Single remediation closes all three.',
    issueRef: 'ISS-005',
  },
  {
    id: 'PR.DS-1',
    criterion: 'PR.DS-1',
    framework: 'NIST CSF',
    category: 'Protect — Data Security (PR.DS)',
    description: 'Data at rest is protected.',
    status: 'PASS',
    lastChecked: '2026-06-20',
    evidence: 'AES-256 encryption at rest. Postgres encrypted volumes. TLS for all transit.',
  },
  {
    id: 'DE.CM-1',
    criterion: 'DE.CM-1',
    framework: 'NIST CSF',
    category: 'Detect — Continuous Monitoring (DE.CM)',
    description: 'The network is monitored to detect potential cybersecurity events.',
    status: 'PASS',
    lastChecked: '2026-06-21',
    evidence: 'AEGIS Egress Control + Intelligence Egress active. All outbound KIMMP traffic logged and monitored.',
  },
  {
    id: 'RS.RP-1',
    criterion: 'RS.RP-1',
    framework: 'NIST CSF',
    category: 'Respond — Response Planning (RS.RP)',
    description: 'Response plan is executed during or after an incident.',
    status: 'PASS',
    lastChecked: '2026-06-21',
    evidence: 'Ops Centre Issues Feed provides structured incident response. P1 SLA clock active. KIMMP auto-suggests resolution path.',
  },
]

// ── Certification Roadmap ─────────────────────────────────────────────────────

const CERTS = [
  { name: 'SOC 2 Type I',  done: true,  date: '2026-03', unlocks: 'Enterprise conversations',                         color: '#00c875' },
  { name: 'SOC 2 Type II', done: false, date: '2026-10',  daysLeft: 47, current: true, readiness: 73, target: 85,     unlocks: 'Enterprise procurement approval',          color: '#7f53f9' },
  { name: 'ISO 27001',     done: false, date: '2027-06', unlocks: 'European enterprises, regulated industries',        color: '#2564ea' },
  { name: 'HIPAA BAA',     done: false, date: '2027-12', unlocks: 'Healthcare vertical ($50B TAM)',                    color: '#fdab3d' },
  { name: 'FedRAMP',       done: false, date: '2028-12', unlocks: 'US Federal / DoD (largest contracts)',              color: 'var(--os-text-2)' },
] as const

function CertificationRoadmap() {
  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Flag className="w-3.5 h-3.5 text-violet-400" />
        <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider">Certification Roadmap</p>
        <span className="ml-auto text-[10px] text-[var(--os-text-2)]">SOC 2 Type I complete → working toward enterprise procurement gate</span>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-5 right-5 h-px" style={{ background: 'linear-gradient(90deg, #00c875, #7f53f9, #2564ea, #fdab3d, #334155)' }} />

        <div className="grid grid-cols-5 gap-2 relative">
          {CERTS.map((cert) => (
            <div key={cert.name} className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                style={{
                  background: cert.done ? `${cert.color}18` : cert.current ? `${cert.color}12` : 'var(--os-card)',
                  border: `2px solid ${cert.done || cert.current ? cert.color : 'var(--os-border)'}`,
                  boxShadow: cert.current ? `0 0 12px ${cert.color}40` : 'none',
                }}>
                {cert.done
                  ? <CheckCircle style={{ width: 16, height: 16, color: cert.color }} />
                  : cert.current
                    ? <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: cert.color }} />
                    : <div className="w-2 h-2 rounded-full bg-slate-700" />
                }
              </div>

              <div>
                <p className="text-[10px] font-bold leading-tight" style={{ color: cert.done || cert.current ? cert.color : 'var(--os-text-2)' }}>{cert.name}</p>
                <p className="text-[9px] text-[var(--os-text-2)] mt-0.5">{cert.date}</p>
                {cert.current && 'daysLeft' in cert && (
                  <p className="text-[9px] font-bold mt-0.5" style={{ color: cert.color }}>
                    {cert.daysLeft}d remaining
                  </p>
                )}
                {cert.done && <p className="text-[9px] text-emerald-600 font-bold mt-0.5">Complete</p>}
              </div>

              <p className="text-[9px] text-[var(--os-text-2)] leading-tight hidden lg:block">{cert.unlocks}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Audit Countdown ───────────────────────────────────────────────────────────

function AuditCountdown() {
  const daysLeft   = 47
  const readiness  = 73
  const target     = 85
  const gap        = target - readiness
  const urgency    = daysLeft < 30 ? '#e2445c' : daysLeft < 60 ? '#fdab3d' : '#7f53f9'

  return (
    <div className="rounded-xl p-5 flex items-center gap-6" style={{ background: `${urgency}06`, border: `1px solid ${urgency}20` }}>
      <div className="flex-shrink-0 text-center">
        <p className="text-4xl font-black tabular-nums" style={{ color: urgency }}>{daysLeft}</p>
        <p className="text-[10px] font-bold" style={{ color: urgency }}>days</p>
      </div>
      <div className="w-px h-12 bg-[var(--os-border)] flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-[var(--os-text-1)] mb-0.5">SOC 2 Type II Audit</p>
        <p className="text-[11px] text-[var(--os-text-2)]">Current readiness <span className="font-bold text-amber-400">{readiness}%</span> — target <span className="font-bold text-emerald-400">{target}%</span> — gap <span className="font-bold" style={{ color: urgency }}>+{gap}% needed</span></p>
        <div className="mt-2 h-1.5 rounded-full" style={{ background: 'var(--os-border)' }}>
          <div className="h-full rounded-full relative" style={{ width: `${readiness}%`, background: `linear-gradient(90deg, ${urgency}88, ${urgency})` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px]" style={{ borderBottomColor: '#00c875', transform: `translateX(${(target - readiness) / readiness * 100}%) translateY(-50%)` }} />
          </div>
          {/* Target marker */}
          <div className="relative h-0" style={{ marginTop: '-6px', marginLeft: `${target}%`, width: 0 }}>
            <div className="w-px h-3 absolute top-0" style={{ background: '#00c875', left: 0, marginTop: '-3px' }} />
          </div>
        </div>
        <p className="text-[10px] text-[var(--os-text-2)] mt-1">Close ISS-005 + schedule DR test + run vuln scan → readiness reaches {target}%</p>
      </div>
    </div>
  )
}

// ── Resolution Impact ─────────────────────────────────────────────────────────

const QUICK_WINS = [
  {
    action:    'Complete access review — ISS-005',
    detail:    '12 user accounts at 91-day review threshold. Manual review ~2h.',
    controls:  3,
    scoreGain: 16,
    frameworks: ['SOC 2 CC6.3', 'ISO A.9.4.1', 'NIST PR.AC-1'],
    effort:    'LOW',
    effortColor: '#00c875',
  },
  {
    action:    'Schedule & run vulnerability scan',
    detail:    'Last scan 45 days ago (target: monthly). Overdue by 15 days.',
    controls:  2,
    scoreGain: 8,
    frameworks: ['SOC 2 CC7.2', 'ISO A.12.6.1'],
    effort:    'LOW',
    effortColor: '#00c875',
  },
  {
    action:    'Complete disaster recovery test',
    detail:    'RPO/RTO untested since H1 2025 (157 days). Bi-annual requirement.',
    controls:  1,
    scoreGain: 5,
    frameworks: ['SOC 2 A1.2'],
    effort:    'MED',
    effortColor: '#fdab3d',
  },
] as const

function ResolutionImpact({ currentScore }: { currentScore: number }) {
  const totalGain   = QUICK_WINS.reduce((s, w) => s + w.scoreGain, 0)
  const projScore   = Math.min(100, currentScore + totalGain)

  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider">KIMMP Resolution Impact</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] text-[var(--os-text-2)]">Current</span>
          <span className="text-base font-black text-amber-400">{currentScore}%</span>
          <span className="text-[var(--os-text-2)] text-sm">→</span>
          <span className="text-base font-black text-emerald-400">{projScore}%</span>
          <span className="text-[11px] text-[var(--os-text-2)]">after 3 fixes</span>
        </div>
      </div>

      <div className="space-y-2">
        {QUICK_WINS.map((w) => (
          <div key={w.action} className="flex items-start gap-3 rounded-lg p-3"
            style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}>
            <Zap className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <p className="text-[12px] font-semibold text-[var(--os-text-1)] leading-tight">{w.action}</p>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ color: w.effortColor, background: `${w.effortColor}10`, border: `1px solid ${w.effortColor}25` }}>
                    {w.effort} EFFORT
                  </span>
                  <span className="text-[11px] font-black text-emerald-400">+{w.scoreGain}%</span>
                </div>
              </div>
              <p className="text-[10px] text-[var(--os-text-2)] mb-1.5">{w.detail}</p>
              <div className="flex flex-wrap gap-1">
                {w.frameworks.map(f => (
                  <span key={f} className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(127,83,249,0.08)', color: '#a78bfa', border: '1px solid rgba(127,83,249,0.2)' }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const STATUS_COLOR: Record<ControlStatus, string> = {
  PASS: '#00c875',
  WARN: '#fdab3d',
  FAIL: '#e2445c',
}

const FRAMEWORK_COLOR: Record<Framework, string> = {
  'SOC 2':    '#7f53f9',
  'ISO 27001':'#2564ea',
  'NIST CSF': '#00c875',
}

// ── Live AEGIS engine mapping per control ─────────────────────────────────────

const ENGINE_FOR_CONTROL: Record<string, string> = {
  // SOC 2 — CC6 Logical Access → Access Sentinel
  'CC6.1': 'ACCESS_SENTINEL', 'CC6.2': 'ACCESS_SENTINEL', 'CC6.3': 'ACCESS_SENTINEL',
  'CC6.6': 'ACCESS_SENTINEL', 'CC6.7': 'ACCESS_SENTINEL',
  // SOC 2 — CC7 System Operations → Governance Ops
  'CC7.1': 'GOVERNANCE_OPS',  'CC7.2': 'GOVERNANCE_OPS', 'CC7.4': 'GOVERNANCE_OPS',
  // SOC 2 — CC8 Change Management → Policy
  'CC8.1': 'POLICY',
  // SOC 2 — CC9 Risk → Risk Intelligence
  'CC9.1': 'RISK_INTELLIGENCE', 'CC9.2': 'RISK_INTELLIGENCE',
  // Availability → Governance Ops
  'A1.1': 'GOVERNANCE_OPS', 'A1.2': 'GOVERNANCE_OPS',
  // ISO 27001 — Asset Management → Intelligence Registry
  'A5.1': 'AUDIT_LEDGER',  'A5.2': 'AUDIT_LEDGER',
  'A6.1': 'AUDIT_LEDGER',  'A6.2': 'AUDIT_LEDGER',
  'A8.1': 'INTELLIGENCE_REGISTRY', 'A8.2': 'INTELLIGENCE_REGISTRY', 'A8.3': 'INTELLIGENCE_REGISTRY',
  // ISO 27001 — Access Control → Access Sentinel
  'A9.1': 'ACCESS_SENTINEL', 'A9.2': 'ACCESS_SENTINEL',
  'A9.3': 'ACCESS_SENTINEL', 'A9.4': 'ACCESS_SENTINEL',
  // ISO 27001 — Operations → Governance Ops
  'A12.1': 'GOVERNANCE_OPS', 'A12.2': 'GOVERNANCE_OPS',
  'A12.4': 'AUDIT_LEDGER',
  // ISO 27001 — Compliance → Trust Compliance
  'A18.1': 'TRUST_COMPLIANCE', 'A18.2': 'TRUST_COMPLIANCE',
  // NIST — Identify/Protect → Autonomy Boundary
  'ID.AM': 'INTELLIGENCE_REGISTRY', 'PR.AC': 'ACCESS_SENTINEL',
  'PR.DS': 'EGRESS_CONTROL',        'PR.IP': 'POLICY',
  // NIST — Detect/Respond/Recover → Risk Intelligence
  'DE.AE': 'RISK_INTELLIGENCE',     'RS.RP': 'RISK_INTELLIGENCE', 'RC.RP': 'GOVERNANCE_OPS',
}

function aegisVerdictToStatus(verdict: string | undefined): ControlStatus | null {
  if (!verdict) return null
  if (verdict === 'CRITICAL') return 'FAIL'
  if (verdict === 'WARN')     return 'WARN'
  if (verdict === 'PASS' || verdict === 'INFO') return 'PASS'
  return null
}

function StatusIcon({ status }: { status: ControlStatus }) {
  if (status === 'PASS') return <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
  if (status === 'WARN') return <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
  return <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
}

function ControlRow({ control, liveStatus, liveCheckedAt, engineId }: {
  control: ComplianceControl
  liveStatus?: ControlStatus | null
  liveCheckedAt?: string
  engineId?: string
}) {
  const effectiveStatus = liveStatus ?? control.status
  const [open, setOpen] = useState(effectiveStatus === 'FAIL')
  const sc = STATUS_COLOR[effectiveStatus]

  return (
    <div className="rounded-xl overflow-hidden transition-all"
      style={{
        background: 'var(--os-card)',
        border: `1px solid ${effectiveStatus === 'FAIL' ? '#e2445c30' : 'var(--os-border)'}`,
        borderLeft: `3px solid ${sc}`,
      }}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <StatusIcon status={effectiveStatus} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-black text-[var(--os-text-1)] font-mono">{control.criterion}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ color: FRAMEWORK_COLOR[control.framework], background: `${FRAMEWORK_COLOR[control.framework]}14`, border: `1px solid ${FRAMEWORK_COLOR[control.framework]}25` }}>
                    {control.framework}
                  </span>
                  <span className="text-[9px] text-[var(--os-text-2)]">{control.category}</span>
                  {control.issueRef && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(226,68,92,0.1)', color: '#e2445c', border: '1px solid rgba(226,68,92,0.25)' }}>
                      → {control.issueRef}
                    </span>
                  )}
                </div>
                <p className="text-[13px] font-semibold text-[var(--os-text-1)] leading-tight">{control.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {liveStatus && (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-full">
                    <Radio className="w-2 h-2" /> LIVE
                  </span>
                )}
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg"
                  style={{ color: sc, background: `${sc}10`, border: `1px solid ${sc}30` }}>
                  {effectiveStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-1.5">
              <Clock className="w-2.5 h-2.5 text-[var(--os-text-2)]" />
              <span className="text-[10px] text-[var(--os-text-2)]">
                {liveCheckedAt
                  ? <>AEGIS {engineId} · {new Date(liveCheckedAt).toLocaleString()}</>
                  : <>Last checked {control.lastChecked}</>
                }
              </span>
            </div>

            {control.kimmpSignal && (
              <div className="mt-2.5 flex items-start gap-2 px-3 py-2 rounded-lg"
                style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                <Brain className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-[var(--os-text-1)] leading-relaxed">{control.kimmpSignal}</p>
              </div>
            )}

            {open && (
              <div className="mt-2.5 pt-2.5" style={{ borderTop: '1px solid var(--os-border)' }}>
                <p className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-wider mb-1">Evidence</p>
                <p className="text-xs text-[var(--os-text-2)] leading-relaxed">{control.evidence}</p>
              </div>
            )}

            <button onClick={() => setOpen(o => !o)}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-[var(--os-text-2)] hover:text-violet-400 transition-colors">
              {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {open ? 'Hide evidence' : 'View evidence'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BreachReadinessScore() {
  const score = 73
  const color = score >= 80 ? '#00c875' : score >= 60 ? '#fdab3d' : '#e2445c'

  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-wider mb-1">KIMMP Breach Readiness Score</p>
          <p className="text-[11px] text-[var(--os-text-2)] leading-relaxed max-w-xs">
            If a breach occurred today, how prepared is Kangqore to detect, respond, and recover?
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-4xl font-black tabular-nums" style={{ color }}>{score}</p>
          <p className="text-[10px] font-bold" style={{ color }}>/ 100</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-2 rounded-full mb-4" style={{ background: 'var(--os-border)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {([
          { label: 'Detection',  score: 88, note: 'AEGIS + Ops Centre active' },
          { label: 'Response',   score: 74, note: 'IRP documented; DR test overdue' },
          { label: 'Recovery',   score: 58, note: 'RPO/RTO untested since H1 2025' },
        ] as const).map(d => (
          <div key={d.label} className="rounded-lg p-2.5" style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}>
            <p className="text-lg font-bold tabular-nums"
              style={{ color: d.score >= 80 ? '#00c875' : d.score >= 60 ? '#fdab3d' : '#e2445c' }}>{d.score}</p>
            <p className="text-[10px] font-bold text-[var(--os-text-2)]">{d.label}</p>
            <p className="text-[9px] text-[var(--os-text-2)] mt-0.5 leading-tight">{d.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AegisCompliancePage() {
  const [frameworkFilter, setFrameworkFilter] = useState<Framework | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<ControlStatus | 'issues'>('issues')

  // Live AEGIS engine verdicts
  const { data: agentSummary } = useQuery({
    queryKey: ['aegis-agents-summary'],
    queryFn: () => api.get('/admin/aegis/agents/summary').then(r => r.data),
    staleTime: 60_000,
    refetchInterval: 120_000,
  })

  // Build a map: engineId → { verdict, raisedAt }
  const engineVerdicts: Record<string, { verdict: string; raisedAt: string }> = {}
  if (agentSummary?.engines) {
    for (const e of agentSummary.engines) {
      if (e.latest) engineVerdicts[e.engine] = e.latest
    }
  }

  // Resolve per-control live status
  function resolveControl(c: ComplianceControl) {
    const engineId = ENGINE_FOR_CONTROL[c.id]
    const live = engineId ? engineVerdicts[engineId] : undefined
    const liveStatus = live ? aegisVerdictToStatus(live.verdict) : null
    return { liveStatus, liveCheckedAt: live?.raisedAt, engineId }
  }

  const resolvedControls = CONTROLS.map(c => ({ ...c, ...resolveControl(c) }))

  const pass  = resolvedControls.filter(c => (c.liveStatus ?? c.status) === 'PASS').length
  const warn  = resolvedControls.filter(c => (c.liveStatus ?? c.status) === 'WARN').length
  const fail  = resolvedControls.filter(c => (c.liveStatus ?? c.status) === 'FAIL').length
  const total = CONTROLS.length
  const score = Math.round((pass + warn * 0.5) / total * 100)
  const liveCount = resolvedControls.filter(c => c.liveStatus !== null).length

  const filtered = resolvedControls
    .filter(c => frameworkFilter === 'all' || c.framework === frameworkFilter)
    .filter(c => {
      const s = c.liveStatus ?? c.status
      return statusFilter === 'all' || (statusFilter === 'issues' ? s !== 'PASS' : s === statusFilter)
    })

  const frameworks: Framework[] = ['SOC 2', 'ISO 27001', 'NIST CSF']

  return (
    <div className="space-y-5">

      {/* Certification Roadmap */}
      <CertificationRoadmap />

      {/* Audit Countdown */}
      <AuditCountdown />

      {/* Live SOC2 DB Controls (S70) */}
      <LiveSoc2Controls />

      {/* Resolution Impact */}
      <ResolutionImpact currentScore={score} />

      {/* Summary strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl p-4 col-span-2 lg:col-span-1"
          style={{ background: 'var(--os-card)', border: '1px solid rgba(124,58,237,0.25)' }}>
          <p className="text-4xl font-black text-[var(--os-text-1)] tabular-nums">{score}<span className="text-lg text-[var(--os-text-2)]">%</span></p>
          <p className="text-[10px] text-purple-400 font-bold mt-0.5">Overall compliance score</p>
          <p className="text-[9px] text-[var(--os-text-2)] mt-1">{total} controls across 3 frameworks</p>
          {liveCount > 0 && (
            <p className="text-[9px] text-green-400 mt-0.5 flex items-center gap-1">
              <Radio className="w-2.5 h-2.5" /> {liveCount} backed by live AEGIS data
            </p>
          )}
        </div>
        {([
          { label: 'Passing',  count: pass, color: '#00c875' },
          { label: 'Warning',  count: warn, color: '#fdab3d' },
          { label: 'Failing',  count: fail, color: '#e2445c' },
        ] as const).map(s => (
          <div key={s.label} className="rounded-xl p-4"
            style={{ background: 'var(--os-card)', border: `1px solid ${s.color}20` }}>
            <p className="text-3xl font-bold text-[var(--os-text-1)] tabular-nums">{s.count}</p>
            <p className="text-[10px] mt-0.5" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Breach readiness + export */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <BreachReadinessScore />
        </div>

        {/* Audit evidence export */}
        <div className="rounded-xl p-5 flex flex-col gap-3" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
          <div>
            <p className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-wider mb-1">Audit Evidence Package</p>
            <p className="text-[11px] text-[var(--os-text-2)] leading-relaxed">
              KIMMP compiles all logs, access records, policy docs, and change history into a regulator-ready export.
            </p>
          </div>
          <div className="space-y-2 flex-1">
            {([
              { label: 'Access logs',       count: '2,847 entries' },
              { label: 'Change records',    count: '7 changes'     },
              { label: 'Policy documents',  count: '6 policies'    },
              { label: 'Agent audit trail', count: '80 agents'     },
            ] as const).map(r => (
              <div key={r.label} className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--os-text-2)]">{r.label}</span>
                <span className="text-[var(--os-text-1)] font-semibold tabular-nums">{r.count}</span>
              </div>
            ))}
          </div>
          <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[12px] font-bold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7f53f9 0%, #2564ea 100%)', color: '#fff' }}>
            <Download className="w-3.5 h-3.5" />
            Export Audit Package
          </button>
          <p className="text-[9px] text-[var(--os-text-2)] text-center">Formatted for Big Four auditor review</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setStatusFilter('issues')}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
          style={{
            background: statusFilter === 'issues' ? 'rgba(226,68,92,0.1)' : 'var(--os-card)',
            border: `1px solid ${statusFilter === 'issues' ? 'rgba(226,68,92,0.3)' : 'var(--os-border)'}`,
            color: statusFilter === 'issues' ? '#e2445c' : 'var(--os-text-2)',
          }}>
          Issues only ({warn + fail})
        </button>
        {(['PASS', 'WARN', 'FAIL', 'all'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: statusFilter === s ? `${STATUS_COLOR[s as ControlStatus] ?? 'rgba(100,116,139'}0.1)` : 'var(--os-card)',
              border: `1px solid ${statusFilter === s ? `${STATUS_COLOR[s as ControlStatus] ?? 'rgba(100,116,139'}0.3)` : 'var(--os-border)'}`,
              color: statusFilter === s ? (s === 'all' ? '#a78bfa' : STATUS_COLOR[s as ControlStatus]) : 'var(--os-text-2)',
            }}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
        <div className="w-px bg-[var(--os-border)]" />
        {frameworks.map(f => (
          <button key={f} onClick={() => setFrameworkFilter(frameworkFilter === f ? 'all' : f)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: frameworkFilter === f ? `${FRAMEWORK_COLOR[f]}14` : 'var(--os-card)',
              border: `1px solid ${frameworkFilter === f ? `${FRAMEWORK_COLOR[f]}35` : 'var(--os-border)'}`,
              color: frameworkFilter === f ? FRAMEWORK_COLOR[f] : 'var(--os-text-2)',
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Controls list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 rounded-2xl"
            style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
            <CheckCircle className="w-8 h-8 text-emerald-500" />
            <p className="text-sm font-semibold text-[var(--os-text-2)]">All controls passing for this filter</p>
          </div>
        ) : filtered.map(c => (
          <ControlRow
            key={c.id}
            control={c}
            liveStatus={c.liveStatus}
            liveCheckedAt={c.liveCheckedAt}
            engineId={c.engineId}
          />
        ))}
      </div>
    </div>
  )
}

// ── Live SOC2 Controls from DB (S70) ─────────────────────────────────────────

interface LiveControl {
  id: string; code: string; criteria: string; name: string
  description: string; status: string
  evidenceUrl: string | null; evidenceNote: string | null
  lastTestedAt: string | null; ownerId: string | null
  createdAt: string; updatedAt: string
}

const LIVE_STATUS_CFG: Record<string, { color: string; bg: string; label: string }> = {
  IN_PLACE: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'In Place'  },
  PARTIAL:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Partial'   },
  MISSING:  { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  label: 'Missing'   },
}

function LiveSoc2Controls() {
  const qc = useQueryClient()
  const [collapsed, setCollapsed]   = useState(false)
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [editForm, setEditForm]     = useState({ status: 'IN_PLACE', evidenceNote: '' })
  const [framework, setFramework]   = useState<'SOC2' | 'ISO27001'>('SOC2')

  const { data, isLoading } = useQuery<{ framework: string; controls: LiveControl[] }>({
    queryKey: ['live-compliance-controls', framework],
    queryFn:  () => api.get(`/admin/kangqore-immp/aegis/compliance-controls?framework=${framework}`).then(r => r.data),
    staleTime: 60_000,
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, string> }) =>
      api.patch(`/admin/kangqore-immp/aegis/compliance-controls/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['live-compliance-controls'] })
      setEditingId(null)
    },
  })

  const controls = data?.controls ?? []
  const inPlace  = controls.filter(c => c.status === 'IN_PLACE').length
  const missing  = controls.filter(c => c.status === 'MISSING').length

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--os-card)', borderColor: 'var(--os-border)' }}>
      <div className="flex items-center gap-3 w-full px-5 py-4" style={{ borderBottom: collapsed ? undefined : '1px solid var(--os-border)' }}>
        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-3 flex-1 text-left">
          <Database className="w-4 h-4" style={{ color: '#7c3aed' }} />
          <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>{framework === 'SOC2' ? 'SOC2' : 'ISO 27001'} Readiness Checkpoints</p>
        </button>
        <div className="flex rounded-lg overflow-hidden flex-shrink-0" style={{ border: '1px solid var(--os-border)' }} onClick={e => e.stopPropagation()}>
          {(['SOC2', 'ISO27001'] as const).map(fw => (
            <button key={fw} onClick={() => setFramework(fw)}
              className="text-[10px] font-bold px-2.5 py-1 transition-colors"
              style={{ background: framework === fw ? '#7c3aed22' : 'transparent', color: framework === fw ? '#7c3aed' : 'var(--os-text-2)' }}>
              {fw === 'SOC2' ? 'SOC2' : 'ISO27001'}
            </button>
          ))}
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{inPlace}/{controls.length} IN PLACE</span>
        {missing > 0 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{missing} MISSING</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="flex-shrink-0">
          {collapsed ? <ChevronDown className="w-4 h-4" style={{ color: 'var(--os-text-2)' }} /> : <ChevronUp className="w-4 h-4" style={{ color: 'var(--os-text-2)' }} />}
        </button>
      </div>

      {!collapsed && (
        isLoading ? (
          <div className="p-5 space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'var(--os-surface-0)' }} />)}</div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--os-border)' }}>
            {controls.map(c => {
              const cfg = LIVE_STATUS_CFG[c.status] ?? LIVE_STATUS_CFG.MISSING
              const editing = editingId === c.id
              return (
                <div key={c.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 flex-shrink-0"
                      style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>{c.code}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-bold" style={{ color: 'var(--os-text-1)' }}>{c.name}</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-2)' }}>{c.criteria}</span>
                      </div>
                      <p className="text-[11px] mt-1" style={{ color: 'var(--os-text-2)' }}>{c.description}</p>
                      {c.evidenceNote && <p className="text-[10px] mt-1 italic" style={{ color: 'var(--os-text-2)' }}>{c.evidenceNote}</p>}
                      {c.lastTestedAt && <p className="text-[10px] mt-0.5" style={{ color: 'var(--os-text-2)' }}>Last tested: {new Date(c.lastTestedAt).toLocaleDateString()}</p>}
                    </div>
                    <button onClick={() => { setEditingId(editing ? null : c.id); setEditForm({ status: c.status, evidenceNote: c.evidenceNote ?? '' }) }}
                      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg flex-shrink-0"
                      style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-2)' }}>
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                  </div>

                  {editing && (
                    <div className="mt-3 flex items-center gap-3 pl-10">
                      <select value={editForm.status}
                        onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                        className="px-2 py-1.5 text-[10px] rounded-lg border focus:outline-none"
                        style={{ borderColor: 'var(--os-border)', background: 'var(--os-surface-0)', color: 'var(--os-text-1)' }}>
                        {['IN_PLACE', 'PARTIAL', 'MISSING'].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <input value={editForm.evidenceNote}
                        onChange={e => setEditForm(f => ({ ...f, evidenceNote: e.target.value }))}
                        placeholder="Evidence note…"
                        className="flex-1 px-2 py-1.5 text-[10px] rounded-lg border focus:outline-none"
                        style={{ borderColor: 'var(--os-border)', background: 'var(--os-surface-0)', color: 'var(--os-text-1)' }} />
                      <button disabled={update.isPending}
                        onClick={() => update.mutate({ id: c.id, payload: { status: editForm.status, evidenceNote: editForm.evidenceNote } })}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold disabled:opacity-40"
                        style={{ background: '#10b981', color: '#fff' }}>
                        <Check className="w-3 h-3" /> Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-[10px] px-2 py-1.5 rounded-lg" style={{ color: 'var(--os-text-2)' }}>Cancel</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}

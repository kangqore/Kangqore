import { useState } from 'react'
import { Brain, CheckCircle, AlertTriangle, XCircle, Download, ChevronDown, ChevronUp, Clock, TrendingUp, Zap, Flag } from 'lucide-react'

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
  { name: 'FedRAMP',       done: false, date: '2028-12', unlocks: 'US Federal / DoD (largest contracts)',              color: '#64748b' },
] as const

function CertificationRoadmap() {
  return (
    <div className="rounded-xl p-5" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
      <div className="flex items-center gap-2 mb-4">
        <Flag className="w-3.5 h-3.5 text-violet-400" />
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Certification Roadmap</p>
        <span className="ml-auto text-[10px] text-slate-600">SOC 2 Type I complete → working toward enterprise procurement gate</span>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-5 right-5 h-px" style={{ background: 'linear-gradient(90deg, #00c875, #7f53f9, #2564ea, #fdab3d, #334155)' }} />

        <div className="grid grid-cols-5 gap-2 relative">
          {CERTS.map((cert) => (
            <div key={cert.name} className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                style={{
                  background: cert.done ? `${cert.color}18` : cert.current ? `${cert.color}12` : '#0d1117',
                  border: `2px solid ${cert.done || cert.current ? cert.color : '#2E2854'}`,
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
                <p className="text-[10px] font-bold leading-tight" style={{ color: cert.done || cert.current ? cert.color : '#475569' }}>{cert.name}</p>
                <p className="text-[9px] text-slate-600 mt-0.5">{cert.date}</p>
                {cert.current && 'daysLeft' in cert && (
                  <p className="text-[9px] font-bold mt-0.5" style={{ color: cert.color }}>
                    {cert.daysLeft}d remaining
                  </p>
                )}
                {cert.done && <p className="text-[9px] text-emerald-600 font-bold mt-0.5">Complete</p>}
              </div>

              <p className="text-[9px] text-slate-600 leading-tight hidden lg:block">{cert.unlocks}</p>
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
      <div className="w-px h-12 bg-[#2E2854] flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-white mb-0.5">SOC 2 Type II Audit</p>
        <p className="text-[11px] text-slate-500">Current readiness <span className="font-bold text-amber-400">{readiness}%</span> — target <span className="font-bold text-emerald-400">{target}%</span> — gap <span className="font-bold" style={{ color: urgency }}>+{gap}% needed</span></p>
        <div className="mt-2 h-1.5 rounded-full" style={{ background: '#1f2a4a' }}>
          <div className="h-full rounded-full relative" style={{ width: `${readiness}%`, background: `linear-gradient(90deg, ${urgency}88, ${urgency})` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px]" style={{ borderBottomColor: '#00c875', transform: `translateX(${(target - readiness) / readiness * 100}%) translateY(-50%)` }} />
          </div>
          {/* Target marker */}
          <div className="relative h-0" style={{ marginTop: '-6px', marginLeft: `${target}%`, width: 0 }}>
            <div className="w-px h-3 absolute top-0" style={{ background: '#00c875', left: 0, marginTop: '-3px' }} />
          </div>
        </div>
        <p className="text-[10px] text-slate-600 mt-1">Close ISS-005 + schedule DR test + run vuln scan → readiness reaches {target}%</p>
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
    <div className="rounded-xl p-5" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">KIMMP Resolution Impact</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] text-slate-500">Current</span>
          <span className="text-base font-black text-amber-400">{currentScore}%</span>
          <span className="text-slate-600 text-sm">→</span>
          <span className="text-base font-black text-emerald-400">{projScore}%</span>
          <span className="text-[11px] text-slate-500">after 3 fixes</span>
        </div>
      </div>

      <div className="space-y-2">
        {QUICK_WINS.map((w) => (
          <div key={w.action} className="flex items-start gap-3 rounded-lg p-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1f2a4a' }}>
            <Zap className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <p className="text-[12px] font-semibold text-white leading-tight">{w.action}</p>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ color: w.effortColor, background: `${w.effortColor}10`, border: `1px solid ${w.effortColor}25` }}>
                    {w.effort} EFFORT
                  </span>
                  <span className="text-[11px] font-black text-emerald-400">+{w.scoreGain}%</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mb-1.5">{w.detail}</p>
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

function StatusIcon({ status }: { status: ControlStatus }) {
  if (status === 'PASS') return <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
  if (status === 'WARN') return <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
  return <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
}

function ControlRow({ control }: { control: ComplianceControl }) {
  const [open, setOpen] = useState(control.status === 'FAIL')
  const sc = STATUS_COLOR[control.status]

  return (
    <div className="rounded-xl overflow-hidden transition-all"
      style={{
        background: '#0d1117',
        border: `1px solid ${control.status === 'FAIL' ? '#e2445c30' : '#2E2854'}`,
        borderLeft: `3px solid ${sc}`,
      }}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <StatusIcon status={control.status} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-black text-slate-300 font-mono">{control.criterion}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ color: FRAMEWORK_COLOR[control.framework], background: `${FRAMEWORK_COLOR[control.framework]}14`, border: `1px solid ${FRAMEWORK_COLOR[control.framework]}25` }}>
                    {control.framework}
                  </span>
                  <span className="text-[9px] text-slate-600">{control.category}</span>
                  {control.issueRef && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(226,68,92,0.1)', color: '#e2445c', border: '1px solid rgba(226,68,92,0.25)' }}>
                      → {control.issueRef}
                    </span>
                  )}
                </div>
                <p className="text-[13px] font-semibold text-white leading-tight">{control.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg"
                  style={{ color: sc, background: `${sc}10`, border: `1px solid ${sc}30` }}>
                  {control.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-1.5">
              <Clock className="w-2.5 h-2.5 text-slate-600" />
              <span className="text-[10px] text-slate-600">Last checked {control.lastChecked}</span>
            </div>

            {control.kimmpSignal && (
              <div className="mt-2.5 flex items-start gap-2 px-3 py-2 rounded-lg"
                style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                <Brain className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-300 leading-relaxed">{control.kimmpSignal}</p>
              </div>
            )}

            {open && (
              <div className="mt-2.5 pt-2.5" style={{ borderTop: '1px solid #1f2a4a' }}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Evidence</p>
                <p className="text-xs text-slate-400 leading-relaxed">{control.evidence}</p>
              </div>
            )}

            <button onClick={() => setOpen(o => !o)}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-violet-400 transition-colors">
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
    <div className="rounded-xl p-5" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">KIMMP Breach Readiness Score</p>
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
            If a breach occurred today, how prepared is Kangqore to detect, respond, and recover?
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-4xl font-black tabular-nums" style={{ color }}>{score}</p>
          <p className="text-[10px] font-bold" style={{ color }}>/ 100</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-2 rounded-full mb-4" style={{ background: '#1f2a4a' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {([
          { label: 'Detection',  score: 88, note: 'AEGIS + Ops Centre active' },
          { label: 'Response',   score: 74, note: 'IRP documented; DR test overdue' },
          { label: 'Recovery',   score: 58, note: 'RPO/RTO untested since H1 2025' },
        ] as const).map(d => (
          <div key={d.label} className="rounded-lg p-2.5" style={{ background: '#111827', border: '1px solid #1f2a4a' }}>
            <p className="text-lg font-bold tabular-nums"
              style={{ color: d.score >= 80 ? '#00c875' : d.score >= 60 ? '#fdab3d' : '#e2445c' }}>{d.score}</p>
            <p className="text-[10px] font-bold text-slate-400">{d.label}</p>
            <p className="text-[9px] text-slate-600 mt-0.5 leading-tight">{d.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AegisCompliancePage() {
  const [frameworkFilter, setFrameworkFilter] = useState<Framework | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<ControlStatus | 'issues'>('issues')

  const pass = CONTROLS.filter(c => c.status === 'PASS').length
  const warn = CONTROLS.filter(c => c.status === 'WARN').length
  const fail = CONTROLS.filter(c => c.status === 'FAIL').length
  const total = CONTROLS.length
  const score = Math.round((pass + warn * 0.5) / total * 100)

  const filtered = CONTROLS
    .filter(c => frameworkFilter === 'all' || c.framework === frameworkFilter)
    .filter(c => statusFilter === 'all' || (statusFilter === 'issues' ? c.status !== 'PASS' : c.status === statusFilter))

  const frameworks: Framework[] = ['SOC 2', 'ISO 27001', 'NIST CSF']

  return (
    <div className="space-y-5">

      {/* Certification Roadmap */}
      <CertificationRoadmap />

      {/* Audit Countdown */}
      <AuditCountdown />

      {/* Resolution Impact */}
      <ResolutionImpact currentScore={score} />

      {/* Summary strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl p-4 col-span-2 lg:col-span-1"
          style={{ background: '#0d1117', border: '1px solid rgba(124,58,237,0.25)' }}>
          <p className="text-4xl font-black text-white tabular-nums">{score}<span className="text-lg text-slate-600">%</span></p>
          <p className="text-[10px] text-purple-400 font-bold mt-0.5">Overall compliance score</p>
          <p className="text-[9px] text-slate-600 mt-1">{total} controls across 3 frameworks</p>
        </div>
        {([
          { label: 'Passing',  count: pass, color: '#00c875' },
          { label: 'Warning',  count: warn, color: '#fdab3d' },
          { label: 'Failing',  count: fail, color: '#e2445c' },
        ] as const).map(s => (
          <div key={s.label} className="rounded-xl p-4"
            style={{ background: '#0d1117', border: `1px solid ${s.color}20` }}>
            <p className="text-3xl font-bold text-white tabular-nums">{s.count}</p>
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
        <div className="rounded-xl p-5 flex flex-col gap-3" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Audit Evidence Package</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
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
                <span className="text-slate-500">{r.label}</span>
                <span className="text-slate-300 font-semibold tabular-nums">{r.count}</span>
              </div>
            ))}
          </div>
          <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[12px] font-bold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7f53f9 0%, #2564ea 100%)', color: '#fff' }}>
            <Download className="w-3.5 h-3.5" />
            Export Audit Package
          </button>
          <p className="text-[9px] text-slate-600 text-center">Formatted for Big Four auditor review</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setStatusFilter('issues')}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
          style={{
            background: statusFilter === 'issues' ? 'rgba(226,68,92,0.1)' : '#0d1117',
            border: `1px solid ${statusFilter === 'issues' ? 'rgba(226,68,92,0.3)' : '#2E2854'}`,
            color: statusFilter === 'issues' ? '#e2445c' : '#64748b',
          }}>
          Issues only ({warn + fail})
        </button>
        {(['PASS', 'WARN', 'FAIL', 'all'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: statusFilter === s ? `${STATUS_COLOR[s as ControlStatus] ?? 'rgba(100,116,139'}0.1)` : '#0d1117',
              border: `1px solid ${statusFilter === s ? `${STATUS_COLOR[s as ControlStatus] ?? 'rgba(100,116,139'}0.3)` : '#2E2854'}`,
              color: statusFilter === s ? (s === 'all' ? '#a78bfa' : STATUS_COLOR[s as ControlStatus]) : '#64748b',
            }}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
        <div className="w-px bg-[#2E2854]" />
        {frameworks.map(f => (
          <button key={f} onClick={() => setFrameworkFilter(frameworkFilter === f ? 'all' : f)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: frameworkFilter === f ? `${FRAMEWORK_COLOR[f]}14` : '#0d1117',
              border: `1px solid ${frameworkFilter === f ? `${FRAMEWORK_COLOR[f]}35` : '#2E2854'}`,
              color: frameworkFilter === f ? FRAMEWORK_COLOR[f] : '#64748b',
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Controls list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 rounded-2xl"
            style={{ background: '#0d1117', border: '1px solid #1f2a4a' }}>
            <CheckCircle className="w-8 h-8 text-emerald-500" />
            <p className="text-sm font-semibold text-slate-400">All controls passing for this filter</p>
          </div>
        ) : filtered.map(c => <ControlRow key={c.id} control={c} />)}
      </div>
    </div>
  )
}

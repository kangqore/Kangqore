import { BookOpen } from 'lucide-react'
import { SharedPlaybooks, type PlaybookTemplate } from '../../shared/SharedPlaybooks'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['risk-compliance']

const TEMPLATES: PlaybookTemplate[] = [
  {
    id: 'rc-001',
    name: 'Breach Response',
    category: 'Incident',
    stepCount: 5,
    lastRun: '2mo ago',
    steps: [
      { id: 's1', label: 'Detect & Classify',    instructions: 'Confirm the breach. Classify severity (P1 regulatory notification required / P2 internal / P3 minor). Log in AEGIS audit trail immediately. Identify affected data categories and estimated volume.', assignee: 'Maya Nair', sla: '1h of detection', status: 'PENDING' },
      { id: 's2', label: 'Contain',              instructions: 'Isolate affected systems. Revoke compromised credentials. Engage IT to block exfiltration vectors. Preserve forensic evidence — do not wipe systems without legal approval.', assignee: 'IT / Maya Nair', sla: '2h of detection', status: 'PENDING', kimmHint: 'KIMMP can cross-reference AEGIS access logs to identify the blast radius within 5 minutes — trigger via the AEGIS Intelligence Registry.' },
      { id: 's3', label: 'Notify Stakeholders',  instructions: 'Brief the Managing Director and legal counsel. For GDPR P1: notify ICO within 72 hours of awareness (Article 33). For DPDP: notify Data Protection Board within 72 hours. Prepare draft notification.', assignee: 'Arjun Singh', sla: '4h of detection', status: 'PENDING' },
      { id: 's4', label: 'Remediate',            instructions: 'Close the attack vector. Apply patches, rotate credentials, update firewall rules. Document all actions in AEGIS. Run a secondary scan to confirm containment. Update risk register.', assignee: 'IT / Maya Nair', sla: '24h of containment', status: 'PENDING', kimmHint: 'Remediation steps that are undocumented in AEGIS will not satisfy ICO investigation evidence requirements — log every action with timestamp and operator.' },
      { id: 's5', label: 'Post-Incident Review',  instructions: '72-hour debrief with IT, Legal and Risk. Update risk register, exception register and affected policies. Run lessons-learned session. Circulate PIR report to senior leadership within 5 business days.', assignee: 'Maya Nair', sla: '5 business days', status: 'PENDING' },
    ],
  },
  {
    id: 'rc-002',
    name: 'Audit Preparation',
    category: 'Compliance',
    stepCount: 4,
    steps: [
      { id: 's1', label: 'Evidence Collection',  instructions: 'Pull all control evidence for audit scope: access logs, change records, policy sign-offs, training completion, vendor assessments. Store in the shared audit evidence folder. Assign evidence owners per control.', assignee: 'Arjun Singh', sla: '4 weeks before audit', status: 'PENDING' },
      { id: 's2', label: 'Gap Review',           instructions: 'Run internal pre-audit against the framework control set. Identify any gaps, exceptions or overdue items. Raise remediation tasks in AEGIS. Obtain management sign-off on accepted gaps.', assignee: 'Maya Nair', sla: '2 weeks before audit', status: 'PENDING', kimmHint: 'KIMMP can generate a pre-audit gap analysis from the live risk register and exception register — run this first to avoid surprises.' },
      { id: 's3', label: 'Auditor Coordination', instructions: 'Send evidence package to auditor. Schedule opening meeting, fieldwork days and closing meeting. Confirm scope with auditor in writing. Prepare a point-of-contact list for each audit domain.', assignee: 'Arjun Singh', sla: '1 week before audit', status: 'PENDING' },
      { id: 's4', label: 'Audit Closure',        instructions: 'Attend closing meeting. Log all findings (non-conformities, observations, opportunities) in AEGIS. Assign owners and target dates for each finding. Update the audit register. Submit corrective action plan within agreed SLA.', assignee: 'Maya Nair', sla: 'Within 5 days of closing meeting', status: 'PENDING', kimmHint: 'Corrective action plans submitted within 3 days have a 94% acceptance rate vs 71% for plans submitted after 5 days — prioritise speed of response.' },
    ],
  },
]

export function RCPlaybooks() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#B91C1C20' }}>
          <BookOpen className="w-6 h-6" style={{ color: '#B91C1C' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Risk &amp; Compliance Playbooks</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Breach response and audit preparation runbooks with KIMMP checkpoints.</p>
        </div>
      </div>
      <SharedPlaybooks config={cfg} templates={TEMPLATES} />
    </div>
  )
}

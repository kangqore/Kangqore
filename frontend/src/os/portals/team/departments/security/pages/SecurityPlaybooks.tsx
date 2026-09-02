import { BookOpen } from 'lucide-react'
import { SharedPlaybooks, type PlaybookTemplate } from '../../shared/SharedPlaybooks'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['security']

const TEMPLATES: PlaybookTemplate[] = [
  {
    id: 'secp-001', name: 'Data Breach Response', category: 'Incidents', stepCount: 6, lastRun: '2w ago',
    steps: [
      { id: 's1', label: 'Isolate & Contain',       instructions: 'Isolate affected systems immediately. Disable compromised accounts. Snapshot evidence.', assignee: 'Security Analyst', sla: '15m', status: 'PENDING', kimmHint: 'KIMMP has identified 3 systems with anomalous outbound traffic in the last 6h. Prioritise isolation.' },
      { id: 's2', label: 'Assess Scope',            instructions: 'Determine data classification of breach, number of records affected, jurisdictions involved.', assignee: 'Security Lead', sla: '30m', status: 'PENDING' },
      { id: 's3', label: 'Notify Legal & DPO',      instructions: 'Brief DPO immediately. Assess GDPR 72-hour notification requirement. Contact legal team.', assignee: 'Security Lead', sla: '1h', status: 'PENDING', kimmHint: '⚠ GDPR 72h clock starts at point of knowledge. Log the exact time now.' },
      { id: 's4', label: 'Eradicate Threat',        instructions: 'Remove malicious artifacts, patch vulnerability, revoke stolen credentials, reset API keys.', assignee: 'Security Analyst', sla: '4h', status: 'PENDING' },
      { id: 's5', label: 'Regulatory Notification', instructions: 'File ICO notification if >72h personal data breach. Notify affected individuals per GDPR Art. 34.', assignee: 'DPO', sla: '72h', status: 'PENDING' },
      { id: 's6', label: 'Post-Incident Review',    instructions: 'Complete forensic report, update threat model, remediate root cause, brief board within 7 days.', assignee: 'Security Lead', sla: '7d', status: 'PENDING' },
    ],
  },
  {
    id: 'secp-002', name: 'Access Revocation — Offboarding', category: 'Access', stepCount: 4,
    steps: [
      { id: 's1', label: 'Disable Identity',         instructions: 'Disable AD/Okta account immediately. Revoke all active SSO sessions and MFA devices.', assignee: 'Security', sla: '30m', status: 'PENDING' },
      { id: 's2', label: 'Revoke Cloud & SaaS Access',instructions: 'Remove from AWS IAM, GitHub orgs, all SaaS tools. Check KIMMP access registry for hidden permissions.', assignee: 'Security', sla: '2h', status: 'PENDING', kimmHint: 'HANUMANAS found 2 shadow admin roles not in the primary access inventory. Review registry before closing.' },
      { id: 's3', label: 'Audit & Evidence',         instructions: 'Export last 90 days of user activity logs. Store in evidence vault. Note any anomalous access.', assignee: 'Security', sla: '4h', status: 'PENDING' },
      { id: 's4', label: 'Certificate & Key Rotation',instructions: 'Rotate any service accounts, API keys, or certificates the user had access to.', assignee: 'Security Analyst', sla: '24h', status: 'PENDING' },
    ],
  },
]

export function SecurityPlaybooks() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Security Playbooks</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Enforced incident response and access management runbooks — GDPR-compliant, HANUMANAS-integrated.</p>
        </div>
      </div>
      <SharedPlaybooks config={cfg} templates={TEMPLATES} />
    </div>
  )
}

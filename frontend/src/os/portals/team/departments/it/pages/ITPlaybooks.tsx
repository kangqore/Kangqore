import { BookOpen } from 'lucide-react'
import { SharedPlaybooks, type PlaybookTemplate } from '../../shared/SharedPlaybooks'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['it']

const TEMPLATES: PlaybookTemplate[] = [
  {
    id: 'pb-001', name: 'P1 Incident Response', category: 'Incidents', stepCount: 6, lastRun: '2d ago',
    steps: [
      { id: 's1', label: 'Declare P1 & Notify',   instructions: 'Create incident ticket, page on-call, open Slack #incident war-room, notify IT Director.', assignee: 'Incident Commander', sla: '5m',  status: 'PENDING', kimmHint: 'KIMMP will auto-page on-call and create the Slack channel if Slack integration is connected.' },
      { id: 's2', label: 'Assemble Response Team', instructions: 'Confirm Network + Security engineers and relevant SME are in the war-room. Assign scribe role.',     assignee: 'Incident Commander', sla: '10m', status: 'PENDING' },
      { id: 's3', label: 'Diagnose Root Cause',    instructions: 'Review Datadog dashboard, recent deployments, and on-call log. Rule out infra vs. app vs. config.',  assignee: 'Lead Engineer',       sla: '30m', status: 'PENDING', kimmHint: 'Check CVE-2024-1182 — linked to 3 similar outages this quarter.' },
      { id: 's4', label: 'Implement Fix',          instructions: 'Deploy hotfix or rollback. Use emergency change process (fast-track CAB). Document all actions.',     assignee: 'Lead Engineer',       sla: '60m', status: 'PENDING' },
      { id: 's5', label: 'Verify Resolution',      instructions: 'Confirm service restored via synthetic monitoring. All affected users confirmed functional.',          assignee: 'Lead Engineer',       sla: '15m', status: 'PENDING' },
      { id: 's6', label: 'Post-Incident Report',   instructions: 'Complete PIR within 24h: timeline, root cause, action items, KIMMP pattern analysis.',                assignee: 'Incident Commander', sla: '24h', status: 'PENDING' },
    ],
  },
  {
    id: 'pb-002', name: 'Emergency Change Procedure', category: 'Changes', stepCount: 5, lastRun: '1w ago',
    steps: [
      { id: 's1', label: 'Risk Assessment',        instructions: 'Document change scope, blast radius, rollback plan. Complete risk matrix.', assignee: 'Change Owner', sla: '30m', status: 'PENDING' },
      { id: 's2', label: 'Fast-Track CAB Approval',instructions: 'Notify CAB Chair. Minimum 2 approvers required for emergency changes.',    assignee: 'CAB Chair',    sla: '1h',  status: 'PENDING', kimmHint: 'C.O.D.E. K. is current CAB Chair. Avg approval time: 22 min for emergency changes.' },
      { id: 's3', label: 'Security Sign-Off',      instructions: 'Security Lead reviews network / access impact. Required for all infra changes.', assignee: 'Security Lead', sla: '30m', status: 'PENDING' },
      { id: 's4', label: 'Deploy & Monitor',       instructions: 'Execute change in maintenance window. Monitor for 30 min post-change.', assignee: 'Change Owner', sla: '2h', status: 'PENDING' },
      { id: 's5', label: 'Close & Document',       instructions: 'Update CMDB, close ticket, notify stakeholders, file change record.', assignee: 'Change Owner', sla: '1h', status: 'PENDING' },
    ],
  },
  {
    id: 'pb-003', name: 'New Employee IT Setup', category: 'Onboarding', stepCount: 5,
    steps: [
      { id: 's1', label: 'Provision Accounts',     instructions: 'Create AD/Okta account, assign licence groups, enable MFA.',          assignee: 'IT Support', sla: '2h',  status: 'PENDING' },
      { id: 's2', label: 'Configure Devices',      instructions: 'Enrol laptop in MDM, deploy standard software bundle, set disk encryption.', assignee: 'IT Support', sla: '4h', status: 'PENDING' },
      { id: 's3', label: 'Network & VPN Access',   instructions: 'Assign VLAN, configure VPN profile, test remote connectivity.',         assignee: 'Network Eng', sla: '2h', status: 'PENDING' },
      { id: 's4', label: 'Security Briefing',      instructions: 'Complete security awareness onboarding module. Confirm policy signed.', assignee: 'Security',    sla: '1d', status: 'PENDING' },
      { id: 's5', label: 'Verify & Hand Over',     instructions: 'Test all accounts, hand over credentials, confirm in CMDB.',           assignee: 'IT Support', sla: '1h', status: 'PENDING' },
    ],
  },
]

export function ITPlaybooks() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">IT Playbooks</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Enforced step-sequence runbooks for IT Ops — P1 response, change management, onboarding.</p>
        </div>
      </div>
      <SharedPlaybooks config={cfg} templates={TEMPLATES} />
    </div>
  )
}

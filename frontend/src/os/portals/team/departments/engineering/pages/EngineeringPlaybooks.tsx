import { BookOpen } from 'lucide-react'
import { SharedPlaybooks, type PlaybookTemplate } from '../../shared/SharedPlaybooks'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['engineering']

const TEMPLATES: PlaybookTemplate[] = [
  {
    id: 'pb-eng-001', name: 'P1 Production Incident', category: 'Incidents', stepCount: 6, lastRun: '3d ago',
    steps: [
      { id: 's1', label: 'Declare Incident & Page On-Call', instructions: 'Create incident ticket, page primary on-call (Siddharth R), open #incident Slack channel. Set severity P1.', assignee: 'Incident Commander', sla: '5m', status: 'PENDING', kimmHint: 'KIMMP will cross-reference active monitoring alerts to auto-populate root cause candidates.' },
      { id: 's2', label: 'Assemble War Room',              instructions: 'Confirm Siddharth (lead), Kavya (backend), Aryan (frontend) in Slack. Assign scribe. Notify CTO within 15 min.',  assignee: 'Incident Commander', sla: '10m', status: 'PENDING' },
      { id: 's3', label: 'Diagnose Root Cause',            instructions: 'Check Monitoring dashboard, recent deployments (last 2h), AEGIS audit log, and DB metrics. Rule out each service.', assignee: 'Lead Engineer',      sla: '30m', status: 'PENDING', kimmHint: 'Email service is currently degraded — if incident is comms-related, check SMTP relay first.' },
      { id: 's4', label: 'Deploy Fix or Rollback',         instructions: 'Deploy hotfix using emergency change procedure. If rollback: revert last merge commit, rebuild, deploy.', assignee: 'Lead Engineer',      sla: '60m', status: 'PENDING' },
      { id: 's5', label: 'Verify & Monitor',               instructions: 'Confirm services UP in monitoring dashboard. Monitor for 30 min. All-clear confirmation from Siddharth.', assignee: 'Lead Engineer',      sla: '30m', status: 'PENDING' },
      { id: 's6', label: 'Post-Incident Report',           instructions: 'Complete PIR within 24h: timeline, root cause, KIMMP pattern analysis, action items. Add to Tech Debt Register.', assignee: 'Incident Commander', sla: '24h', status: 'PENDING' },
    ],
  },
  {
    id: 'pb-eng-002', name: 'Code Review & Merge', category: 'Process', stepCount: 4, lastRun: '1d ago',
    steps: [
      { id: 's1', label: 'Open PR & Self-Review',     instructions: 'Author reviews own diff, checks for linting errors, confirms build passes locally. Fills PR template.', assignee: 'PR Author',   sla: '2h',  status: 'PENDING' },
      { id: 's2', label: 'Peer Review',               instructions: 'Assign at least 1 reviewer. Cover: logic correctness, security, type safety, test coverage. No rubber stamps.', assignee: 'Reviewer',     sla: '24h', status: 'PENDING', kimmHint: 'Changes touching auth or DB require security sign-off from Siddharth per Tech Debt TD-001.' },
      { id: 's3', label: 'Address Feedback & Update', instructions: 'Author resolves all comments. Re-request review for blocking changes. Trivial suggestions can be marked resolved.', assignee: 'PR Author',   sla: '8h',  status: 'PENDING' },
      { id: 's4', label: 'Merge & Monitor',           instructions: 'Squash-merge to main. Monitor deployment pipeline. Confirm no regressions in monitoring dashboard within 15 min.', assignee: 'PR Author',   sla: '30m', status: 'PENDING' },
    ],
  },
]

export function EngineeringPlaybooks() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-lime-500/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-lime-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Engineering Playbooks</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Enforced step-sequence runbooks — P1 incident response and code review process.</p>
        </div>
      </div>
      <SharedPlaybooks config={cfg} templates={TEMPLATES} />
    </div>
  )
}

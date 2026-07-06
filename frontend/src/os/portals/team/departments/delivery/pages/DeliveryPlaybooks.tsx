import { BookOpen } from 'lucide-react'
import { SharedPlaybooks, type PlaybookTemplate } from '../../shared/SharedPlaybooks'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['delivery']

const TEMPLATES: PlaybookTemplate[] = [
  {
    id: 'pb-del-001', name: 'Project Kick-off', category: 'Delivery', stepCount: 5, lastRun: '1w ago',
    steps: [
      { id: 's1', label: 'Confirm Scope & SOW',      instructions: 'Review signed SOW. Confirm deliverables, timeline, acceptance criteria, and commercial terms with PM and CS lead.', assignee: 'PM',                 sla: '1d',  status: 'PENDING', kimmHint: 'KIMMP will flag any scope items not reflected in the SOW before you proceed.' },
      { id: 's2', label: 'Internal Kick-off',         instructions: 'Brief the delivery team: roles, timeline, risks, escalation path. Assign leads per workstream.', assignee: 'PM',                 sla: '2d',  status: 'PENDING' },
      { id: 's3', label: 'Client Kick-off Meeting',   instructions: 'Present project plan, introduce team, agree comms cadence (weekly status report + fortnightly call). Share RACI.', assignee: 'PM + CS Lead',      sla: '5d',  status: 'PENDING', kimmHint: 'Clients who receive a structured kick-off have 22% lower churn rate in first 90 days.' },
      { id: 's4', label: 'RAID Log Setup',            instructions: 'Create RAID log (Risks, Assumptions, Issues, Dependencies). Pre-populate with known items from discovery.', assignee: 'PM',                 sla: '3d',  status: 'PENDING' },
      { id: 's5', label: 'Governance & Reporting',    instructions: 'Set up weekly status report template, agree escalation triggers, book first milestone review.', assignee: 'PM',                 sla: '5d',  status: 'PENDING' },
    ],
  },
  {
    id: 'pb-del-002', name: 'Escalation & Recovery', category: 'Incidents', stepCount: 5, lastRun: '2w ago',
    steps: [
      { id: 's1', label: 'Declare Escalation',         instructions: 'PM declares escalation in KIMMP. Notify Delivery Lead and CS Lead immediately. Create incident thread in Slack.', assignee: 'PM',          sla: '30m', status: 'PENDING', kimmHint: 'Escalation criteria: RAG Red for 2+ consecutive weeks, or SLA breach with client impact.' },
      { id: 's2', label: 'Root Cause Analysis',        instructions: 'Identify whether escalation is: scope, resource, technical, or client-side. Document in escalation log.', assignee: 'PM + DL',     sla: '4h',  status: 'PENDING' },
      { id: 's3', label: 'Recovery Plan',              instructions: 'Draft recovery plan: revised timeline, resource uplift, scope change, or risk acceptance. Get internal sign-off.', assignee: 'Delivery Lead', sla: '1d',  status: 'PENDING', kimmHint: 'KIMMP pattern: projects with recovery plan shared within 48h of escalation have 68% higher client retention.' },
      { id: 's4', label: 'Client Communication',       instructions: 'Present recovery plan to client sponsor. Be direct: what went wrong, what changes, revised commitment.', assignee: 'PM + CS Lead',  sla: '2d',  status: 'PENDING' },
      { id: 's5', label: 'Monitor & Close',            instructions: 'Track recovery milestones weekly. Formally close escalation when RAG returns to Green for 2 consecutive weeks.', assignee: 'PM',          sla: '4w',  status: 'PENDING' },
    ],
  },
]

export function DeliveryPlaybooks() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-rose-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Delivery Playbooks</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Enforced step-sequence runbooks — project kick-off and escalation recovery.</p>
        </div>
      </div>
      <SharedPlaybooks config={cfg} templates={TEMPLATES} />
    </div>
  )
}

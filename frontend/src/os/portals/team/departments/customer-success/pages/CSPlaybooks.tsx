import { BookOpen } from 'lucide-react'
import { SharedPlaybooks, type PlaybookTemplate } from '../../shared/SharedPlaybooks'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['customer-success']

const TEMPLATES: PlaybookTemplate[] = [
  {
    id: 'cs-001', name: 'At-Risk Account Recovery', category: 'Retention', stepCount: 5, lastRun: '5d ago',
    steps: [
      { id: 's1', label: 'Health Audit',           instructions: 'Pull 90-day health score trend, CSAT, support ticket volume, and product usage data from KIMMP dashboard. Document all risk signals.',             assignee: 'CSM',              sla: '2h',  status: 'PENDING', kimmHint: 'KIMMP health audit: FinServ Ltd shows usage −22%, 3 open tickets, last CSM touch 8d ago.' },
      { id: 's2', label: 'Root Cause Analysis',    instructions: 'Identify whether risk is driven by product issues, service gaps, internal champion change, or competitive pressure. Tag primary cause in CRM.',    assignee: 'CSM',              sla: '4h',  status: 'PENDING' },
      { id: 's3', label: 'Executive Escalation',   instructions: 'Brief CS Director and account executive. If ARR >£100k or renewal <60 days, involve executive sponsor on customer side within 24h.',                assignee: 'CS Director',      sla: '24h', status: 'PENDING', kimmHint: 'FinServ Ltd ARR is £95k with 28-day renewal window — escalate immediately.' },
      { id: 's4', label: 'Recovery Plan',           instructions: 'Draft joint success plan with customer: 3 specific outcomes to achieve in 30 days, agreed cadence, named owner each side. Get sign-off.',           assignee: 'CSM + Customer',   sla: '48h', status: 'PENDING' },
      { id: 's5', label: '30-Day Check-In',         instructions: 'Validate recovery plan progress. Re-score health. If score has not improved by ≥10 points, escalate to executive retention protocol.',              assignee: 'CSM',              sla: '30d', status: 'PENDING' },
    ],
  },
  {
    id: 'cs-002', name: 'New Client Onboarding', category: 'Onboarding', stepCount: 6,
    steps: [
      { id: 's1', label: 'Welcome & Kickoff',      instructions: 'Send welcome pack within 24h of contract signing. Schedule kickoff call within 3 business days. Assign dedicated CSM and introduce to client.',      assignee: 'CSM',             sla: '24h', status: 'PENDING', kimmHint: 'KIMMP will auto-generate a personalised success plan based on client industry and contract tier.' },
      { id: 's2', label: 'Platform Setup',          instructions: 'Provision SSO, admin users, and data integrations. Complete technical setup checklist. Confirm IT admin access with client IT lead.',                assignee: 'CSM + IT Ops',    sla: '3d',  status: 'PENDING' },
      { id: 's3', label: 'Admin Training',          instructions: 'Run 2-hour admin training session covering platform settings, user management, reporting, and integrations. Record and share recording.',             assignee: 'CSM',             sla: '5d',  status: 'PENDING' },
      { id: 's4', label: 'User Training',           instructions: 'Deliver role-specific training for end users. Provide KB links and quick-start guides. Confirm users can complete core workflows independently.',    assignee: 'CSM',             sla: '10d', status: 'PENDING' },
      { id: 's5', label: 'Go-Live',                 instructions: 'Confirm go-live readiness with client sign-off. Monitor platform usage for first 48h. Proactively address any friction points same day.',            assignee: 'CSM',             sla: '14d', status: 'PENDING' },
      { id: 's6', label: '30-Day Review',           instructions: 'Conduct 30-day review call. Share usage metrics, early ROI data, and agree 90-day success goals. Transition to standard QBR cadence.',             assignee: 'CSM',             sla: '30d', status: 'PENDING' },
    ],
  },
]

export function CSPlaybooks() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">CS Playbooks</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Enforced runbooks for account recovery, onboarding, and retention.</p>
        </div>
      </div>
      <SharedPlaybooks config={cfg} templates={TEMPLATES} />
    </div>
  )
}

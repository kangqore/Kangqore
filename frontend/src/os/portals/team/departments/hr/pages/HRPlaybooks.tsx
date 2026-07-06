import { BookOpen } from 'lucide-react'
import { SharedPlaybooks, type PlaybookTemplate } from '../../shared/SharedPlaybooks'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['hr']

const TEMPLATES: PlaybookTemplate[] = [
  {
    id: 'hrp-001', name: 'New Employee Onboarding', category: 'Onboarding', stepCount: 6, lastRun: '1d ago',
    steps: [
      { id: 's1', label: 'Pre-Hire Paperwork',     instructions: 'Send offer letter, contract, and right-to-work checks. Confirm start date.', assignee: 'HR Admin', sla: '2d before start', status: 'PENDING' },
      { id: 's2', label: 'Workspace Setup',         instructions: 'Raise IT ticket for laptop + accounts. Assign desk, building pass, and parking (if applicable).', assignee: 'HR Admin', sla: '1d before start', status: 'PENDING', kimmHint: 'Average IT setup takes 3.2 hours — raise ticket at least 24h in advance.' },
      { id: 's3', label: 'Day 1 Welcome',            instructions: 'Assign buddy, complete HR system onboarding, team introductions, culture briefing.', assignee: 'HR Business Partner', sla: 'Day 1 AM', status: 'PENDING' },
      { id: 's4', label: 'Role-Specific Training',  instructions: 'Enrol in mandatory compliance modules and role training. Set 30-day learning goals.', assignee: 'Line Manager', sla: 'Week 1', status: 'PENDING' },
      { id: 's5', label: '30-Day Check-In',          instructions: 'HRBP meets employee: wellbeing, integration, blockers. Document feedback.', assignee: 'HR Business Partner', sla: 'Day 30', status: 'PENDING' },
      { id: 's6', label: 'Probation Review',         instructions: 'Line manager probation meeting. Confirm pass or extend. Update HR system.', assignee: 'Line Manager', sla: 'Month 3', status: 'PENDING' },
    ],
  },
  {
    id: 'hrp-002', name: 'Employee Offboarding', category: 'Offboarding', stepCount: 5,
    steps: [
      { id: 's1', label: 'Resignation Confirmation',instructions: 'Countersign resignation letter, confirm last working day, communicate to payroll.', assignee: 'HRBP', sla: '24h of receipt', status: 'PENDING' },
      { id: 's2', label: 'Knowledge Transfer',       instructions: 'Employee completes handover doc, schedules knowledge transfer with team.', assignee: 'Line Manager', sla: 'Week 1 of notice', status: 'PENDING' },
      { id: 's3', label: 'IT & Access Revocation',  instructions: 'Raise security offboarding ticket. All access revoked by 17:00 on last day.', assignee: 'HR Admin', sla: 'Last day', status: 'PENDING', kimmHint: 'AEGIS offboarding checklist has 14 access points for this role. Ensure all are covered.' },
      { id: 's4', label: 'Exit Interview',           instructions: 'Conduct exit interview (HRBP). Log feedback themes in HR system.', assignee: 'HRBP', sla: 'Week before leave', status: 'PENDING' },
      { id: 's5', label: 'Payroll & Reference',     instructions: 'Process final payroll, provide P45, set up reference process.', assignee: 'HR Admin', sla: 'Last day', status: 'PENDING' },
    ],
  },
]

export function HRPlaybooks() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">HR Playbooks</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Enforced onboarding and offboarding runbooks with compliance checkpoints.</p>
        </div>
      </div>
      <SharedPlaybooks config={cfg} templates={TEMPLATES} />
    </div>
  )
}

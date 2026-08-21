import { BookOpen } from 'lucide-react'
import { SharedPlaybooks, type PlaybookTemplate } from '../../shared/SharedPlaybooks'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['support']

const TEMPLATES: PlaybookTemplate[] = [
  {
    id: 'sp-001', name: 'Major Incident — Customer Impact', category: 'Incidents', stepCount: 5, lastRun: '3d ago',
    steps: [
      { id: 's1', label: 'Assess Impact',         instructions: 'Determine number of affected accounts, ARR impact, and geographic scope. Check Datadog and Stripe dashboards.', assignee: 'Support Lead', sla: '5m',  status: 'PENDING', kimmHint: 'KIMMP is checking affected client SLA tiers — enterprise clients will breach within 2h.' },
      { id: 's2', label: 'Notify Customers',       instructions: 'Send proactive update to affected customers via in-app banner AND email. Template: KB-090.',                     assignee: 'Support Lead', sla: '15m', status: 'PENDING' },
      { id: 's3', label: 'Escalate to Engineering',instructions: 'Create P1 ticket in IT Ops, link all customer tickets, join war-room. Provide customer ARR context.',           assignee: 'Support Lead', sla: '10m', status: 'PENDING' },
      { id: 's4', label: 'Customer Comms Loop',    instructions: 'Update customers every 30 min until resolved. Log each update in the ticket.',                                   assignee: 'Agent on Call', sla: 'ongoing', status: 'PENDING' },
      { id: 's5', label: 'Resolution & Follow-Up', instructions: 'Send resolution email, offer credits per policy (KB-091), log CSAT request, complete PIR within 48h.',         assignee: 'Support Lead', sla: '1h', status: 'PENDING' },
    ],
  },
  {
    id: 'sp-002', name: 'Enterprise Churn Risk', category: 'Escalation', stepCount: 4,
    steps: [
      { id: 's1', label: 'Identify Risk Signals',  instructions: 'KIMMP flags CSAT <3, >3 P1 tickets in 30d, or engagement drop >50%. Confirm and document.',  assignee: 'Senior Agent', sla: '2h',  status: 'PENDING', kimmHint: 'Client scored 2.8 CSAT this month — below 3.0 churn threshold. ARR: £180K.' },
      { id: 's2', label: 'Internal Review',         instructions: 'Pull 90-day ticket history, CSAT trend, NPS, and open items. Brief Customer Success and Sales.', assignee: 'Senior Agent', sla: '4h',  status: 'PENDING' },
      { id: 's3', label: 'Executive Outreach',      instructions: 'Support Director calls client exec within 24h. Offer tailored remediation plan.',               assignee: 'Support Director', sla: '24h', status: 'PENDING' },
      { id: 's4', label: 'Retention Action Plan',   instructions: 'Agree action items, schedule check-in cadence, flag in CRM, monitor for 30 days.',            assignee: 'Support Director', sla: '48h', status: 'PENDING' },
    ],
  },
]

export function SupportPlaybooks() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-[#2564ea]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Support Playbooks</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Enforced runbooks for major incidents, escalation, and churn risk management.</p>
        </div>
      </div>
      <SharedPlaybooks config={cfg} templates={TEMPLATES} />
    </div>
  )
}

import { BookOpen } from 'lucide-react'
import { SharedPlaybooks, type PlaybookTemplate } from '../../shared/SharedPlaybooks'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['sales']

const TEMPLATES: PlaybookTemplate[] = [
  {
    id: 'slp-001', name: 'Enterprise Deal Playbook', category: 'Enterprise', stepCount: 6, lastRun: '5d ago',
    steps: [
      { id: 's1', label: 'Discovery Call',        instructions: 'Conduct a 60-min discovery call. Map decision-makers, budget authority, timeline, and core pain points. Log in CRM immediately.',                  assignee: 'Account Executive', sla: '1 week',  status: 'PENDING', kimmHint: 'KIMMP cross-references contact title against org chart — confirm economic buyer vs technical champion.' },
      { id: 's2', label: 'Technical Deep-Dive',   instructions: 'Run a 90-min technical session with the prospect\'s IT/Engineering team. Cover integration, security, and data residency requirements.',         assignee: 'Account Executive', sla: '2 weeks', status: 'PENDING' },
      { id: 's3', label: 'Business Case',         instructions: 'Build a bespoke ROI model. Include productivity savings, risk reduction, and revenue impact. Use Kangqore BIDS™ ROI calculator.',               assignee: 'Account Executive', sla: '1 week',  status: 'PENDING', kimmHint: 'KIMMP generates first-draft ROI from CRM data — saves 3h per deal on average.' },
      { id: 's4', label: 'Proposal',              instructions: 'Submit formal proposal document. Include pricing tiers, SOW outline, implementation timeline, and named CSM. Send via DocuSign link.',          assignee: 'Account Executive', sla: '3 days',  status: 'PENDING' },
      { id: 's5', label: 'Negotiation',           instructions: 'Enter negotiation within defined discount authority (max 15% without VP approval). Document all concessions in CRM. Include legal if MSA edits.', assignee: 'Account Executive', sla: 'Ongoing', status: 'PENDING' },
      { id: 's6', label: 'Close & Handover',      instructions: 'Obtain signed contract. Create handover pack for Delivery and Customer Success. Schedule onboarding kick-off within 5 business days.',          assignee: 'Account Executive', sla: '2 days',  status: 'PENDING' },
    ],
  },
  {
    id: 'slp-002', name: 'SMB Fast-Track', category: 'SMB', stepCount: 3, lastRun: '2d ago',
    steps: [
      { id: 's1', label: 'Qualify',              instructions: 'Run 30-min BANT qualification call. Confirm budget (min £30k), authority, need, and timeline <90 days. Score in CRM. Disqualify if criteria not met.', assignee: 'SDR',               sla: '48h',    status: 'PENDING', kimmHint: 'KIMMP scores lead against 12 fit signals — auto-qualifies 60% of inbound. Only escalate KIMMP-flagged leads.' },
      { id: 's2', label: 'Demo',                 instructions: 'Deliver a tailored 45-min product demo focused on the prospect\'s stated pain. Use Kangqore Cognition live environment. Share recording after.',       assignee: 'Account Executive', sla: '1 week', status: 'PENDING' },
      { id: 's3', label: 'Proposal & Close',     instructions: 'Send standard SMB proposal within 24h of demo. Follow up at 48h and 96h. Escalate to VP if no response after 7 days.',                               assignee: 'Account Executive', sla: '1 week', status: 'PENDING' },
    ],
  },
]

export function SalesPlaybooks() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sales Playbooks</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Enforced runbooks for enterprise deals and SMB fast-track closings.</p>
        </div>
      </div>
      <SharedPlaybooks config={cfg} templates={TEMPLATES} />
    </div>
  )
}

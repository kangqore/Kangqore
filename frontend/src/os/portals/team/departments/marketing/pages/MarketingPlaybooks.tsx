import { BookOpen } from 'lucide-react'
import { SharedPlaybooks, type PlaybookTemplate } from '../../shared/SharedPlaybooks'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['marketing']

const TEMPLATES: PlaybookTemplate[] = [
  {
    id: 'mktp-001',
    name: 'Campaign Launch Playbook',
    category: 'Campaign',
    stepCount: 5,
    lastRun: '3d ago',
    steps: [
      { id: 's1', label: 'Brief & Objectives',  instructions: 'Define campaign brief: target audience, MQL target, channels, budget, and success metrics. Align with Sales on ICP.', assignee: 'Marketing Manager', sla: 'Week -3', status: 'PENDING' },
      { id: 's2', label: 'Creative Production', instructions: 'Brief design team on ad creatives, landing page assets, email templates, and social copy. Review against brand guidelines v2.4.', assignee: 'Content Lead', sla: 'Week -2', status: 'PENDING', kimmHint: 'Campaigns with 3+ creative variants outperform single-creative campaigns by 28% on LinkedIn based on your Q1 data.' },
      { id: 's3', label: 'Approval',             instructions: 'Legal and brand review of all campaign assets. Get sign-off from Marketing Director. Stage assets in CMS/ad platforms.', assignee: 'Marketing Manager', sla: 'Week -1', status: 'PENDING' },
      { id: 's4', label: 'Launch',               instructions: 'Activate all channels simultaneously. Verify tracking pixels, UTM parameters, and CRM lead routing. Confirm landing page live.', assignee: 'Performance Analyst', sla: 'Launch day', status: 'PENDING' },
      { id: 's5', label: 'Performance Review',   instructions: 'Weekly performance check: CTR, CPL, MQL volume, pipeline influenced. Optimise spend allocation. 30-day full debrief.', assignee: 'Performance Analyst', sla: 'Weekly + Day 30', status: 'PENDING', kimmHint: 'Set KIMMP alert for MQL pace vs target at day 7 — early signals enable spend reallocation before budget is consumed.' },
    ],
  },
  {
    id: 'mktp-002',
    name: 'PR & Crisis Comms',
    category: 'Comms',
    stepCount: 4,
    steps: [
      { id: 's1', label: 'Assess & Brief',   instructions: 'Classify incident severity (P1/P2/P3). Brief MD and relevant stakeholders within 1 hour. Identify affected audiences and potential media exposure.', assignee: 'Marketing Manager', sla: '1h of incident', status: 'PENDING' },
      { id: 's2', label: 'Draft Response',   instructions: 'Draft holding statement and full response. Align messaging with brand voice. Prepare FAQ document for internal teams. Do not publish without sign-off.', assignee: 'Content Lead', sla: '2h of incident', status: 'PENDING' },
      { id: 's3', label: 'Legal Review',     instructions: 'Submit draft to Legal for review. Confirm no liability admission. Adjust language per Legal guidance. Obtain written approval.', assignee: 'Legal', sla: '3h of incident', status: 'PENDING', kimmHint: 'KIMMP has flagged 3 monitored mentions. Social sentiment is currently neutral — window to control narrative is open.' },
      { id: 's4', label: 'Publish',          instructions: 'Distribute approved statement across owned channels (website, LinkedIn, press release if required). Notify customer success for client comms. Log incident in AEGIS audit trail.', assignee: 'Marketing Manager', sla: '4h of incident', status: 'PENDING' },
    ],
  },
]

export function MarketingPlaybooks() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Marketing Playbooks</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Campaign launch and crisis comms runbooks with KIMMP checkpoints.</p>
        </div>
      </div>
      <SharedPlaybooks config={cfg} templates={TEMPLATES} />
    </div>
  )
}

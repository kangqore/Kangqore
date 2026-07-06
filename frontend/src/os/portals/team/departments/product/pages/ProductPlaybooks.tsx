import { BookOpen } from 'lucide-react'
import { SharedPlaybooks, type PlaybookTemplate } from '../../shared/SharedPlaybooks'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['product']

const TEMPLATES: PlaybookTemplate[] = [
  {
    id: 'prp-001', name: 'Feature Scoping Playbook', category: 'Discovery', stepCount: 5,
    steps: [
      { id: 's1', label: 'Discovery & Research',  instructions: 'Gather existing user research, support tickets, and sales feedback. Run at least 3 customer discovery calls. Document insights in Notion.', assignee: 'UX Researcher', sla: 'Week 1', status: 'PENDING', kimmHint: 'KIMMP can cross-reference existing research studies to surface related insights automatically.' },
      { id: 's2', label: 'Problem Framing',        instructions: 'Write a clear problem statement. Define who is affected, how often, and what the current workaround is. Get stakeholder sign-off.', assignee: 'Product Manager', sla: 'Week 2', status: 'PENDING' },
      { id: 's3', label: 'Solution Design',        instructions: 'Create low-fidelity wireframes. Run a design critique with 2+ team members. Iterate based on feedback.', assignee: 'Product Designer', sla: 'Week 3', status: 'PENDING' },
      { id: 's4', label: 'Tech Scoping',           instructions: 'Engineering lead reviews designs for feasibility. Produce a rough effort estimate (S/M/L/XL). Identify dependencies and risks.', assignee: 'Tech Lead', sla: 'Week 3', status: 'PENDING', kimmHint: 'KIMMP will flag similar past scoping decisions and known technical debt that may affect this estimate.' },
      { id: 's5', label: 'Go / No-Go Decision',   instructions: 'PM presents business case, UX, tech scope, and effort to leadership. Record decision, rationale, and any conditions in the product brief.', assignee: 'Product Manager', sla: 'Week 4', status: 'PENDING' },
    ],
  },
  {
    id: 'prp-002', name: 'Release Readiness', category: 'Release', stepCount: 5,
    steps: [
      { id: 's1', label: 'Feature Freeze',                  instructions: 'All features for this release are merged and code-complete. No new features accepted without PM approval. Notify Engineering.', assignee: 'Product Manager', sla: 'T−7 days', status: 'PENDING' },
      { id: 's2', label: 'QA Sign-Off',                     instructions: 'QA completes regression suite. All P0/P1 bugs fixed. Sign-off documented in the release checklist.', assignee: 'QA Lead', sla: 'T−4 days', status: 'PENDING', kimmHint: 'KIMMP will scan the test suite coverage report and flag untested modules before sign-off.' },
      { id: 's3', label: 'Docs & Release Notes',            instructions: 'Release notes written and reviewed. In-app changelogs updated. Help centre articles updated for any changed flows.', assignee: 'Product Manager', sla: 'T−2 days', status: 'PENDING' },
      { id: 's4', label: 'Staged Rollout',                  instructions: 'Deploy to 10% of production traffic via feature flags. Monitor error rates, latency, and support ticket volume for 24 hours.', assignee: 'Engineering Lead', sla: 'T+0 to T+1', status: 'PENDING' },
      { id: 's5', label: 'Monitor & Retrospective',         instructions: 'Full rollout to 100% after staged validation. Schedule sprint retrospective within 3 days. Log lessons learned.', assignee: 'Product Manager', sla: 'T+3 days', status: 'PENDING', kimmHint: 'KIMMP will generate a post-release impact report comparing key metrics vs pre-release baseline.' },
    ],
  },
]

export function ProductPlaybooks() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Product Playbooks</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Enforced discovery and release runbooks with KIMMP checkpoints.</p>
        </div>
      </div>
      <SharedPlaybooks config={cfg} templates={TEMPLATES} />
    </div>
  )
}

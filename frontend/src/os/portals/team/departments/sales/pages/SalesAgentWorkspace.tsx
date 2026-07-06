import { Monitor } from 'lucide-react'
import { SharedAgentWorkspace, type WorkspaceItem, type WorkspaceAgent } from '../../shared/SharedAgentWorkspace'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['sales']

const ITEMS: WorkspaceItem[] = [
  { id: 'DEAL-001', title: 'GlobalMed Negotiation — exec sponsor call required before 2026-07-01', priority: 'P1', status: 'IN_PROGRESS',  assignee: 'Arjun Shah',  sla: '2h 00m', slaOk: true,  opened: '1d ago', category: 'Deal'     },
  { id: 'LEAD-042', title: 'TechScale Inbound — qualify and schedule discovery call',               priority: 'P2', status: 'OPEN',         assignee: 'Unassigned',  sla: '4h 00m', slaOk: true,  opened: '2h ago', category: 'Lead'     },
  { id: 'PROP-008', title: 'FinServ Ltd proposal revision — pricing model update required',         priority: 'P2', status: 'IN_PROGRESS',  assignee: 'Meera Nair',  sla: '6h 00m', slaOk: true,  opened: '4h ago', category: 'Proposal' },
  { id: 'DEAL-002', title: 'Acme Corp upsell — Enterprise OS Licence expansion opportunity',        priority: 'P3', status: 'OPEN',         assignee: 'Dev Patel',   sla: '8h 00m', slaOk: true,  opened: '6h ago', category: 'Deal'     },
  { id: 'LEAD-043', title: 'HealthCo referral — inbound from GlobalMed contact',                   priority: 'P3', status: 'OPEN',         assignee: 'Unassigned',  sla: '24h 00m',slaOk: true,  opened: '1h ago', category: 'Lead'     },
  { id: 'PROP-009', title: 'TechWave draft proposal — Kangqore Cognition package',                 priority: 'P3', status: 'IN_PROGRESS',  assignee: 'Meera Nair',  sla: '24h 00m',slaOk: true,  opened: '3h ago', category: 'Proposal' },
]

const AGENTS: WorkspaceAgent[] = [
  { id: 's1', name: 'Arjun Shah',  initials: 'AS', status: 'ON_ITEM',  currentItemId: 'DEAL-001', color: '#0EA5E9' },
  { id: 's2', name: 'Meera Nair',  initials: 'MN', status: 'ON_ITEM',  currentItemId: 'PROP-008', color: '#8B5CF6' },
  { id: 's3', name: 'Dev Patel',   initials: 'DP', status: 'ONLINE',   currentItemId: null,        color: '#10B981' },
]

function kimmContext(item: WorkspaceItem): string[] {
  if (item.id === 'DEAL-001') return [
    'GlobalMed at 90% close probability — highest in active pipeline. Q2 closes 2026-07-01.',
    'Exec sponsor (Dr. Patel, CFO) has not been contacted in 14 days. Recommend Arjun schedules call today.',
    'Deal value £340k — largest in current negotiation stage. Win seals Q2 target at 109%.',
  ]
  if (item.id === 'PROP-008') return [
    'FinServ requested pricing adjustment on professional services line — currently £45k, they flagged £35k ceiling.',
    'Meera has handled 3 FinServ interactions — best relationship owner for this revision.',
    'Decision deadline 2026-06-30. Delay beyond that risks losing to competitor bid.',
  ]
  return []
}

export function SalesAgentWorkspace() {
  return (
    <div>
      <div className="flex items-center gap-3 px-6 lg:px-10 pt-8 pb-4">
        <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
          <Monitor className="w-5 h-5 text-sky-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Agent Workspace</h1>
          <p className="text-xs text-[var(--os-text-2)]">Sales · deals, leads and proposals queue with KIMMP context</p>
        </div>
      </div>
      <div className="px-6 lg:px-10">
        <SharedAgentWorkspace config={cfg} items={ITEMS} agents={AGENTS} kimmContextFn={kimmContext} />
      </div>
    </div>
  )
}

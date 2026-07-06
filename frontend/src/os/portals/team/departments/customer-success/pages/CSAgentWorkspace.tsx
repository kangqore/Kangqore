import { Monitor } from 'lucide-react'
import { SharedAgentWorkspace, type WorkspaceItem, type WorkspaceAgent } from '../../shared/SharedAgentWorkspace'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['customer-success']

const ITEMS: WorkspaceItem[] = [
  { id: 'ACC-001', title: 'FinServ At-Risk Review — health score 61, declining 14pts in 30d',           priority: 'P1', status: 'IN_PROGRESS',  assignee: 'Lena Park',  sla: '4h',   slaOk: true,  opened: '2h ago',  category: 'Accounts'    },
  { id: 'REN-007', title: 'ManuFlex Renewal Prep — renewal in 98 days, amber health',                  priority: 'P1', status: 'OPEN',         assignee: 'Unassigned', sla: '8h',   slaOk: true,  opened: '3h ago',  category: 'Renewals'    },
  { id: 'QBR-012', title: 'GlobalMed QBR Prep — session in 3 days, last NPS +62',                      priority: 'P2', status: 'IN_PROGRESS',  assignee: 'Raj Mehta',  sla: '24h',  slaOk: true,  opened: '1d ago',  category: 'QBRs'        },
  { id: 'EXP-004', title: 'RetailGiant BIDS™ Enterprise Upsell — 78% close probability',               priority: 'P2', status: 'IN_PROGRESS',  assignee: 'Raj Mehta',  sla: '48h',  slaOk: true,  opened: '2d ago',  category: 'Expansion'   },
  { id: 'ONB-003', title: 'HealthStartup Onboarding Unblocked — IT access now provisioned',            priority: 'P2', status: 'IN_PROGRESS',  assignee: 'Lena Park',  sla: '4h',   slaOk: true,  opened: '12h ago', category: 'Onboarding'  },
  { id: 'ACC-002', title: 'DataCo Quarterly Check-in — usage up 28%, expansion candidate',             priority: 'P3', status: 'IN_PROGRESS',  assignee: 'Raj Mehta',  sla: '72h',  slaOk: true,  opened: '3d ago',  category: 'Accounts'    },
]

const AGENTS: WorkspaceAgent[] = [
  { id: 'cs1', name: 'Lena Park',  initials: 'LP', status: 'ONLINE',  currentItemId: null,      color: '#14B8A6' },
  { id: 'cs2', name: 'Raj Mehta',  initials: 'RM', status: 'ON_ITEM', currentItemId: 'QBR-012', color: '#2DD4BF' },
]

function kimmContext(item: WorkspaceItem): string[] {
  if (item.id === 'ACC-001') return [
    'FinServ Ltd health dropped from 75 → 61 in 30 days. Last support ticket (3 open) unresolved for 8 days.',
    'Usage drop: −22% monthly active users. Last CSM touch was 8 days ago — outside 5-day SLA.',
    'Recommend: immediate CSM call + recovery plan draft today. Renewal in 28 days.',
  ]
  if (item.id === 'QBR-012') return [
    'GlobalMed last QBR NPS was +62 — highest of any account in portfolio.',
    'Lead with BIDS™ ROI data: they reported 3.2× ROI in post-QBR survey. They expanded 2× after last year\'s QBR.',
    'AEGIS flagged 2 compliance items resolved since last QBR — include in deck as proof of responsiveness.',
  ]
  if (item.id === 'EXP-004') return [
    'RetailGiant asked about BIDS™ Enterprise directly in last QBR — high intent signal.',
    'Current Starter plan usage at 94% of limits for 3 consecutive months. Natural expansion trigger.',
    '78% close probability. Suggest demo + early-bird pricing to drive Q3 close.',
  ]
  return []
}

export function CSAgentWorkspace() {
  return (
    <div>
      <div className="flex items-center gap-3 px-6 lg:px-10 pt-8 pb-4">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
          <Monitor className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Agent Workspace</h1>
          <p className="text-xs text-[var(--os-text-2)]">Customer Success · CS task queue with KIMMP account context</p>
        </div>
      </div>
      <div className="px-6 lg:px-10">
        <SharedAgentWorkspace config={cfg} items={ITEMS} agents={AGENTS} kimmContextFn={kimmContext} />
      </div>
    </div>
  )
}

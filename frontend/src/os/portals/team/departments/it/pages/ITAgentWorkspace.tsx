import { Monitor } from 'lucide-react'
import { SharedAgentWorkspace, type WorkspaceItem, type WorkspaceAgent } from '../../shared/SharedAgentWorkspace'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['it']

const ITEMS: WorkspaceItem[] = [
  { id: 'IT-0051', title: 'VPN certificate renewal failure — all remote users locked out', priority: 'P1', status: 'IN_PROGRESS',  assignee: 'Arjun S.',   sla: '1h 12m', slaOk: true,  opened: '3h ago',  category: 'Network' },
  { id: 'IT-0049', title: 'Okta SSO loop for Google Workspace on Chrome 125',           priority: 'P2', status: 'OPEN',         assignee: 'Rohan M.',   sla: '3h 40m', slaOk: true,  opened: '5h ago',  category: 'Identity' },
  { id: 'IT-0048', title: 'Production DB disk at 94% — urgent cleanup needed',           priority: 'P1', status: 'OPEN',         assignee: 'Priya N.',   sla: '0h 20m', slaOk: false, opened: '1h ago',  category: 'Infrastructure' },
  { id: 'IT-0046', title: 'Email delivery delay >30 min (marketing campaign affected)',  priority: 'P2', status: 'OPEN',         assignee: 'Unassigned', sla: '5h 00m', slaOk: true,  opened: '2h ago',  category: 'Email' },
  { id: 'IT-0044', title: 'GitHub Actions CI pipeline failing on PR merge triggers',     priority: 'P3', status: 'OPEN',         assignee: 'Arjun S.',   sla: '9h 00m', slaOk: true,  opened: '4h ago',  category: 'DevOps' },
  { id: 'IT-0042', title: 'Datadog alert: CPU spike >95% on api-gateway-prod',          priority: 'P2', status: 'IN_PROGRESS',  assignee: 'Rohan M.',   sla: '2h 30m', slaOk: true,  opened: '6h ago',  category: 'Infrastructure' },
  { id: 'IT-0040', title: 'Conference room AV system not connecting to Zoom',            priority: 'P4', status: 'OPEN',         assignee: 'Unassigned', sla: '23h 00m',slaOk: true,  opened: '1d ago',  category: 'Hardware' },
]

const AGENTS: WorkspaceAgent[] = [
  { id: 'a1', name: 'Arjun Sharma',   initials: 'AS', status: 'ON_ITEM',  currentItemId: 'IT-0051', color: '#2564ea' },
  { id: 'a2', name: 'Rohan Mehta',    initials: 'RM', status: 'ON_ITEM',  currentItemId: 'IT-0042', color: '#10B981' },
  { id: 'a3', name: 'Priya Nair',     initials: 'PN', status: 'ON_ITEM',  currentItemId: 'IT-0048', color: '#8B5CF6' },
  { id: 'a4', name: 'Vikram Sharma',  initials: 'VS', status: 'IDLE',     currentItemId: null,       color: '#F59E0B' },
  { id: 'a5', name: 'Kavya Reddy',    initials: 'KR', status: 'OFFLINE',  currentItemId: null,       color: '#6366F1' },
]

function kimmContext(item: WorkspaceItem): string[] {
  if (item.id === 'IT-0051') return [
    'Arjun has resolved 3 identical VPN certificate issues (avg 1.4h). Pattern: renewal cron job silent failure.',
    'Client Acme Ltd (£240K ARR) affected — SLA breach in 1h 12m is business-critical.',
    'Fix path: renew cert via /opt/certs/renew.sh, restart openvpn@tun0, validate with test user.',
  ]
  if (item.id === 'IT-0048') return [
    '🚨 SLA breach in 20 min. Disk at 94% — logs directory is primary cause (78% of used space).',
    'Recommended: `sudo journalctl --vacuum-size=1G` then archive /var/log/app/*.gz to cold storage.',
    'Priya resolved identical issue on DB-02 in 34 min last quarter.',
  ]
  if (item.id === 'IT-0049') return [
    'Okta SSO loop is a known Chrome 125 regression — Google published advisory 2026-06-18.',
    'Workaround: disable third-party cookie blocking in Chrome flags. Permanent fix: patch Okta SAML metadata.',
    'Affects 23 users. Rohan has Okta expert proficiency (4.8/5 — highest on team).',
  ]
  return [
    'No prior incidents matching this exact pattern.',
    'Suggested category: verify against Knowledge Base before creating new procedure.',
  ]
}

export function ITAgentWorkspace() {
  return (
    <div>
      <div className="flex items-center gap-3 px-6 lg:px-10 pt-8 pb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Monitor className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Agent Workspace</h1>
          <p className="text-xs text-[var(--os-text-2)]">IT Ops · tabbed queue with KIMMP context</p>
        </div>
      </div>
      <div className="px-6 lg:px-10">
        <SharedAgentWorkspace
          config={cfg}
          items={ITEMS}
          agents={AGENTS}
          kimmContextFn={kimmContext}
        />
      </div>
    </div>
  )
}

import { Monitor } from 'lucide-react'
import { SharedAgentWorkspace, type WorkspaceItem, type WorkspaceAgent } from '../../shared/SharedAgentWorkspace'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['support']

const ITEMS: WorkspaceItem[] = [
  { id: 'TK-1201', title: 'Payment gateway timeout on checkout — multiple Acme users affected',   priority: 'P1', status: 'IN_PROGRESS',  assignee: 'Meera J.',   sla: '0h 45m', slaOk: false, opened: '2h ago',  category: 'Billing' },
  { id: 'TK-1198', title: 'Login 2FA email not arriving — corporate email domain blocked',         priority: 'P2', status: 'OPEN',         assignee: 'Dev P.',     sla: '3h 20m', slaOk: true,  opened: '4h ago',  category: 'Auth' },
  { id: 'TK-1195', title: 'Export to CSV producing corrupted file — Firefox only',                 priority: 'P2', status: 'OPEN',         assignee: 'Unassigned', sla: '5h 00m', slaOk: true,  opened: '6h ago',  category: 'Product Bug' },
  { id: 'TK-1190', title: 'How do I set up recurring invoice templates?',                          priority: 'P4', status: 'OPEN',         assignee: 'Raj P.',     sla: '23h 00m',slaOk: true,  opened: '1d ago',  category: 'How-To' },
  { id: 'TK-1188', title: 'Onboarding call not showing in calendar integration (Google Cal)',      priority: 'P3', status: 'OPEN',         assignee: 'Unassigned', sla: '11h 00m',slaOk: true,  opened: '3h ago',  category: 'Integration' },
  { id: 'TK-1185', title: 'Custom domain SSL certificate showing as invalid in Chrome',            priority: 'P2', status: 'IN_PROGRESS',  assignee: 'Meera J.',   sla: '4h 00m', slaOk: true,  opened: '8h ago',  category: 'Security' },
]

const AGENTS: WorkspaceAgent[] = [
  { id: 'b1', name: 'Meera Joshi',   initials: 'MJ', status: 'ON_ITEM',  currentItemId: 'TK-1201', color: '#06B6D4' },
  { id: 'b2', name: 'Dev Patel',     initials: 'DP', status: 'ON_ITEM',  currentItemId: 'TK-1198', color: '#10B981' },
  { id: 'b3', name: 'Raj Pillai',    initials: 'RP', status: 'IDLE',     currentItemId: null,       color: '#8B5CF6' },
  { id: 'b4', name: 'Nisha Singh',   initials: 'NS', status: 'ONLINE',   currentItemId: null,       color: '#F59E0B' },
]

function kimmContext(item: WorkspaceItem): string[] {
  if (item.id === 'TK-1201') return [
    '🚨 SLA breach in 45 min. Acme Ltd (£320K ARR) — business-critical. Escalate immediately.',
    'Payment gateway timeouts: 4 similar tickets resolved by linking Stripe webhook delay. Check Stripe status page first.',
    'Meera resolved identical Acme billing issue in 38 min (Jan). KB-081 has the fix steps.',
  ]
  if (item.id === 'TK-1198') return [
    'Corporate domain block on 2FA emails is a known issue with strict SPF policies.',
    'Resolution: add support@kangqore.com to customer allowlist or switch delivery to SendGrid backup route.',
    'Dev has 94% CSAT on auth tickets — best match for this.',
  ]
  return []
}

export function SupportAgentWorkspace() {
  return (
    <div>
      <div className="flex items-center gap-3 px-6 lg:px-10 pt-8 pb-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <Monitor className="w-5 h-5 text-[#2564ea]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Agent Workspace</h1>
          <p className="text-xs text-[var(--os-text-2)]">Customer Support · tabbed queue with KIMMP context</p>
        </div>
      </div>
      <div className="px-6 lg:px-10">
        <SharedAgentWorkspace config={cfg} items={ITEMS} agents={AGENTS} kimmContextFn={kimmContext} />
      </div>
    </div>
  )
}

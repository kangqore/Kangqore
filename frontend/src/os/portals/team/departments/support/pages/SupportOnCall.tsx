import { Phone } from 'lucide-react'
import { SharedOnCall, type OnCallMember, type EscalationTier, type RotationWeek } from '../../shared/SharedOnCall'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['support']

const CURRENT: OnCallMember = { id: 'b1', name: 'Meera Joshi',  initials: 'MJ', color: '#06B6D4', phone: '+44 7700 900789' }
const BACKUP:  OnCallMember = { id: 'b2', name: 'Dev Patel',    initials: 'DP', color: '#10B981', phone: '+44 7700 900321' }

const TIERS: EscalationTier[] = [
  { level: 'L1',      name: 'Meera Joshi',      sla: '0 min' },
  { level: 'L2',      name: 'Dev Patel',         sla: '10 min' },
  { level: 'L3',      name: 'Support Director',  sla: '20 min' },
  { level: 'Manager', name: 'C.O.D.E.',      sla: '45 min' },
]

const ROTATION: RotationWeek[] = [
  { weekLabel: 'Jun 23–29',   primary: 'Meera Joshi',  backup: 'Dev Patel' },
  { weekLabel: 'Jun 30–Jul 6',primary: 'Dev Patel',    backup: 'Raj Pillai' },
  { weekLabel: 'Jul 7–13',    primary: 'Raj Pillai',   backup: 'Nisha Singh' },
  { weekLabel: 'Jul 14–20',   primary: 'Nisha Singh',  backup: 'Meera Joshi' },
  { weekLabel: 'Jul 21–27',   primary: 'Meera Joshi',  backup: 'Dev Patel' },
  { weekLabel: 'Jul 28–Aug 3',primary: 'Dev Patel',    backup: 'Raj Pillai' },
]

export function SupportOnCall() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-4xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <Phone className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Support On-Call</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Current on-call for customer-facing escalations.</p>
        </div>
      </div>
      <SharedOnCall config={cfg} current={CURRENT} backup={BACKUP} rotationEnd="Sun Jun 29" tiers={TIERS} rotation={ROTATION} />
    </div>
  )
}

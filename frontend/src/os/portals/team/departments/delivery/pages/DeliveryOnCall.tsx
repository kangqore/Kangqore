import { Phone } from 'lucide-react'
import { SharedOnCall, type OnCallMember, type EscalationTier, type RotationWeek } from '../../shared/SharedOnCall'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['delivery']

const CURRENT: OnCallMember = { id: 'a1', name: 'Riya Desai',   initials: 'RD', color: '#F43F5E', phone: '+44 7700 900411' }
const BACKUP:  OnCallMember = { id: 'a2', name: 'Sanjay Verma', initials: 'SV', color: '#F97316', phone: '+44 7700 900522' }

const TIERS: EscalationTier[] = [
  { level: 'L1',      name: 'Riya Desai',         sla: '0 min' },
  { level: 'L2',      name: 'Sanjay Verma',       sla: '15 min' },
  { level: 'L3',      name: 'Delivery Lead',       sla: '30 min' },
  { level: 'Manager', name: 'C.O.D.E.',        sla: '60 min' },
]

const ROTATION: RotationWeek[] = [
  { weekLabel: 'Jun 23–29',   primary: 'Riya Desai',   backup: 'Sanjay Verma' },
  { weekLabel: 'Jun 30–Jul 6',primary: 'Sanjay Verma', backup: 'Riya Desai' },
  { weekLabel: 'Jul 7–13',    primary: 'Riya Desai',   backup: 'Sanjay Verma' },
  { weekLabel: 'Jul 14–20',   primary: 'Sanjay Verma', backup: 'Riya Desai' },
  { weekLabel: 'Jul 21–27',   primary: 'Riya Desai',   backup: 'Sanjay Verma' },
  { weekLabel: 'Jul 28–Aug 3',primary: 'Sanjay Verma', backup: 'Riya Desai' },
]

export function DeliveryOnCall() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-4xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
          <Phone className="w-6 h-6 text-rose-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Delivery On-Call</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Current on-call PM, escalation chain, and 6-week rotation.</p>
        </div>
      </div>
      <SharedOnCall
        config={cfg}
        current={CURRENT}
        backup={BACKUP}
        rotationEnd="Sun Jun 29"
        tiers={TIERS}
        rotation={ROTATION}
      />
    </div>
  )
}

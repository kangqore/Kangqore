import { Phone } from 'lucide-react'
import { SharedOnCall, type OnCallMember, type EscalationTier, type RotationWeek } from '../../shared/SharedOnCall'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['it']

const CURRENT: OnCallMember  = { id: 'a1', name: 'Arjun Sharma',  initials: 'AS', color: '#2564ea', phone: '+44 7700 900123' }
const BACKUP:  OnCallMember  = { id: 'a2', name: 'Rohan Mehta',   initials: 'RM', color: '#10B981', phone: '+44 7700 900456' }

const TIERS: EscalationTier[] = [
  { level: 'L1',      name: 'Arjun Sharma',  sla: '0 min' },
  { level: 'L2',      name: 'Rohan Mehta',   sla: '15 min' },
  { level: 'L3',      name: 'Priya Nair',    sla: '30 min' },
  { level: 'Manager', name: 'C.O.D.E.',  sla: '60 min' },
]

const ROTATION: RotationWeek[] = [
  { weekLabel: 'Jun 23–29',  primary: 'Arjun Sharma',  backup: 'Rohan Mehta' },
  { weekLabel: 'Jun 30–Jul 6',primary: 'Rohan Mehta',  backup: 'Priya Nair' },
  { weekLabel: 'Jul 7–13',   primary: 'Priya Nair',    backup: 'Vikram Sharma' },
  { weekLabel: 'Jul 14–20',  primary: 'Vikram Sharma', backup: 'Kavya Reddy' },
  { weekLabel: 'Jul 21–27',  primary: 'Kavya Reddy',   backup: 'Arjun Sharma' },
  { weekLabel: 'Jul 28–Aug 3',primary: 'Arjun Sharma', backup: 'Rohan Mehta' },
]

export function ITOnCall() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-4xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Phone className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">IT On-Call</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Current on-call roster, escalation chain, and 6-week rotation.</p>
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

import { Phone } from 'lucide-react'
import { SharedOnCall, type OnCallMember, type EscalationTier, type RotationWeek } from '../../shared/SharedOnCall'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['engineering']

const CURRENT: OnCallMember = { id: 'a1', name: 'Siddharth R', initials: 'SR', color: '#84CC16', phone: '+44 7700 900211' }
const BACKUP:  OnCallMember = { id: 'a2', name: 'Kavya N',     initials: 'KN', color: '#10B981', phone: '+44 7700 900322' }

const TIERS: EscalationTier[] = [
  { level: 'L1',      name: 'Siddharth R',    sla: '0 min' },
  { level: 'L2',      name: 'Kavya N',        sla: '15 min' },
  { level: 'L3',      name: 'Aryan M',        sla: '30 min' },
  { level: 'Manager', name: 'C.O.D.E. (CTO)', sla: '60 min' },
]

const ROTATION: RotationWeek[] = [
  { weekLabel: 'Jun 23–29',   primary: 'Siddharth R', backup: 'Kavya N' },
  { weekLabel: 'Jun 30–Jul 6',primary: 'Kavya N',     backup: 'Aryan M' },
  { weekLabel: 'Jul 7–13',    primary: 'Aryan M',     backup: 'Siddharth R' },
  { weekLabel: 'Jul 14–20',   primary: 'Siddharth R', backup: 'Kavya N' },
  { weekLabel: 'Jul 21–27',   primary: 'Kavya N',     backup: 'Aryan M' },
  { weekLabel: 'Jul 28–Aug 3',primary: 'Aryan M',     backup: 'Siddharth R' },
]

export function EngineeringOnCall() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-4xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-lime-500/20 flex items-center justify-center flex-shrink-0">
          <Phone className="w-6 h-6 text-lime-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Engineering On-Call</h1>
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

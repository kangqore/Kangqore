import { Phone } from 'lucide-react'
import { SharedOnCall, type OnCallMember, type EscalationTier, type RotationWeek } from '../../shared/SharedOnCall'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['security']

const CURRENT: OnCallMember = { id: 'sec1', name: 'Security Lead',   initials: 'SL', color: '#EF4444', phone: '+44 7700 900555' }
const BACKUP:  OnCallMember = { id: 'sec2', name: 'Security Analyst', initials: 'SA', color: '#F87171', phone: '+44 7700 900666' }

const TIERS: EscalationTier[] = [
  { level: 'L1',      name: 'Security Lead',   sla: '0 min' },
  { level: 'L2',      name: 'Sec Analyst',     sla: '10 min' },
  { level: 'L3',      name: 'CTO / C.O.D.E. K.', sla: '20 min' },
  { level: 'Manager', name: 'Board DPO',        sla: '60 min' },
]

const ROTATION: RotationWeek[] = [
  { weekLabel: 'Jun 23–29',    primary: 'Security Lead',    backup: 'Sec Analyst' },
  { weekLabel: 'Jun 30–Jul 6', primary: 'Sec Analyst',     backup: 'Security Lead' },
  { weekLabel: 'Jul 7–13',     primary: 'Security Lead',   backup: 'Sec Analyst' },
  { weekLabel: 'Jul 14–20',    primary: 'Sec Analyst',     backup: 'Security Lead' },
  { weekLabel: 'Jul 21–27',    primary: 'Security Lead',   backup: 'Sec Analyst' },
  { weekLabel: 'Jul 28–Aug 3', primary: 'Sec Analyst',     backup: 'Security Lead' },
]

export function SecurityOnCall() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-4xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <Phone className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Security On-Call</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">24/7 security incident response coverage — GDPR-compliant escalation chain.</p>
        </div>
      </div>
      <SharedOnCall config={cfg} current={CURRENT} backup={BACKUP} rotationEnd="Sun Jun 29" tiers={TIERS} rotation={ROTATION} />
    </div>
  )
}

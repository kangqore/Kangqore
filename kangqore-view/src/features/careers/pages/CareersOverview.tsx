import { GraduationCap, Users, Clock, CheckCircle2 } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { StatCard } from '@design-system/components/StatCard'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { useCareersStore } from '../store'

const STATUS_BADGE: Record<string, 'success' | 'info' | 'warning' | 'neutral' | 'danger'> = {
  open: 'success', interview: 'info', offer: 'warning', closed: 'neutral', 'on-hold': 'danger',
}

const STAGE_BADGE: Record<string, 'success' | 'info' | 'warning' | 'neutral' | 'danger'> = {
  hired: 'success', offer: 'warning', final: 'info', technical: 'info',
  screening: 'neutral', applied: 'neutral', rejected: 'danger',
}

const DEPT_COLOR: Record<string, string> = {
  engineering: 'bg-blue-50 text-blue-700',
  product: 'bg-purple-50 text-purple-700',
  sales: 'bg-green-50 text-green-700',
  delivery: 'bg-orange-50 text-orange-700',
  ops: 'bg-slate-100 text-slate-600',
  design: 'bg-pink-50 text-pink-700',
}

export function CareersOverview() {
  const { roles, candidates, setSelectedRole } = useCareersStore()
  const openRoles    = roles.filter(r => ['open', 'interview', 'offer'].includes(r.status))
  const totalApps    = roles.reduce((s, r) => s + r.applications, 0)
  const activeOffer  = candidates.filter(c => c.stage === 'offer')

  return (
    <div className="space-y-8">
      <KIMMPSignalBar module="Careers" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open Roles"   value={openRoles.length}                              icon={<GraduationCap className="w-5 h-5" />} changeLabel={`${roles.filter(r => r.status === 'on-hold').length} on hold`} />
        <StatCard label="Applications" value={totalApps}                                     icon={<Users         className="w-5 h-5" />} changeLabel="All open roles" />
        <StatCard label="In Pipeline"  value={roles.reduce((s, r) => s + r.inPipeline, 0)}  icon={<Clock         className="w-5 h-5" />} changeLabel="Active candidates" />
        <StatCard label="Offers Out"   value={activeOffer.length}                            icon={<CheckCircle2  className="w-5 h-5" />} changeLabel="Awaiting response" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role cards */}
        <div className="lg:col-span-2 space-y-4">
          {roles.map(role => (
            <Card
              key={role.id}
              className="cursor-pointer hover:border-blue-200 transition-colors"
              onClick={() => setSelectedRole(role.id)}
            >
              <CardBody className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{role.title}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DEPT_COLOR[role.department]}`}>
                        {role.department}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {role.location} · {role.remote ? 'Remote OK' : 'On-site'} · {role.type} · £{role.salaryMin}k–£{role.salaryMax}k
                    </p>
                  </div>
                  <Badge variant={STATUS_BADGE[role.status]} size="sm" dot>
                    {role.status.charAt(0).toUpperCase() + role.status.slice(1)}
                  </Badge>
                </div>

                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{role.description}</p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex gap-4">
                    <span><span className="font-semibold text-slate-800">{role.applications}</span> applications</span>
                    <span><span className="font-semibold text-slate-800">{role.inPipeline}</span> in pipeline</span>
                    {role.targetStartDate && (
                      <span>Target start: <span className="font-semibold text-slate-800">{role.targetStartDate}</span></span>
                    )}
                  </div>
                  <span>HM: {role.hiringManager}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Active candidates */}
        <Card>
          <CardHeader>
            <CardTitle>Active Candidates</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-slate-100">
              {candidates
                .filter(c => !['rejected'].includes(c.stage))
                .sort((a, b) => (b.cvScore ?? 0) - (a.cvScore ?? 0))
                .map(c => {
                  const role = roles.find(r => r.id === c.roleId)
                  return (
                    <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                      <Avatar name={c.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
                        <p className="text-xs text-slate-500 truncate">{role?.title}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={STAGE_BADGE[c.stage] ?? 'neutral'} size="sm">{c.stage}</Badge>
                        {c.cvScore && (
                          <span className={`text-xs font-semibold ${c.cvScore >= 80 ? 'text-green-600' : c.cvScore >= 65 ? 'text-orange-600' : 'text-slate-500'}`}>
                            {c.cvScore}pts
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Avatar } from '@design-system/components/Avatar'
import { Progress } from '@design-system/components/Progress'
import { Tooltip } from '@design-system/components/Tooltip'
import { useResourcesStore } from '../store'

const WEEKS = ['W18', 'W19', 'W20', 'W21', 'W22', 'W23', 'W24']

const UTIL_BG = (u: number) =>
  u >= 95 ? 'bg-red-500'    :
  u >= 80 ? 'bg-amber-500'  :
  u >= 60 ? 'bg-blue-500' :
  'bg-green-500'

export function CapacityPage() {
  const { team, allocationsForMember, utilHistory } = useResourcesStore()

  const totalCapacity = team.reduce((s, m) => s + m.availability, 0)
  const totalUsed     = team.reduce((s, m) => s + Math.round(m.availability * m.utilization / 100), 0)
  const overloaded    = team.filter(m => m.utilization >= 95)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Capacity Planning</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {totalUsed}h used / {totalCapacity}h total weekly capacity
        </p>
      </div>

      {/* Overload warnings */}
      {overloaded.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <span className="text-red-500 text-sm font-semibold">⚠ Overloaded:</span>
          {overloaded.map(m => (
            <span key={m.id} className="flex items-center gap-1.5">
              <Avatar name={m.name} size="xs" />
              <span className="text-sm text-red-700 font-medium">{m.name} ({m.utilization}%)</span>
            </span>
          ))}
        </div>
      )}

      {/* Capacity table */}
      <Card padding="none">
        <CardHeader className="px-5 pt-5 pb-3">
          <CardTitle>Weekly Allocation by Person</CardTitle>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {[{ color: 'bg-green-500', label: '<60%' }, { color: 'bg-blue-500', label: '60–80%' }, { color: 'bg-amber-500', label: '80–95%' }, { color: 'bg-red-500', label: '≥95%' }].map(l => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                {l.label}
              </span>
            ))}
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 border-t-white/20 bg-slate-900">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-52">Person</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Capacity</th>
                {WEEKS.map(w => (
                  <th key={w} className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{w}</th>
                ))}
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Projects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2854]">
              {team.map(member => {
                const allocs = allocationsForMember(member.id)
                const history = utilHistory.map(h => (h as Record<string, number | string>)[member.id] as number | undefined)
                return (
                  <tr key={member.id} className="hover:bg-slate-900 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={member.name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-slate-200">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.role.split(' ').slice(0, 2).join(' ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Progress
                        value={member.utilization}
                        size="sm"
                        color={member.utilization >= 95 ? 'danger' : member.utilization >= 80 ? 'warning' : 'success'}
                      />
                      <p className="text-[10px] text-slate-500 mt-1">{Math.round(member.availability * member.utilization / 100)}h / {member.availability}h</p>
                    </td>
                    {WEEKS.map((w, i) => {
                      const util = i < history.length ? history[i] : member.utilization
                      return (
                        <td key={w} className="px-3 py-4 text-center">
                          <Tooltip content={`${util ?? member.utilization}% utilized`} side="top">
                            <div className="flex flex-col items-center gap-1">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold ${UTIL_BG(util ?? member.utilization)}`}>
                                {util ?? member.utilization}
                              </div>
                            </div>
                          </Tooltip>
                        </td>
                      )
                    })}
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5 flex-wrap max-w-[200px]">
                        {allocs.map(a => (
                          <Tooltip key={a.id} content={`${a.projectName} — ${a.allocationPct}% (${a.hoursPerWeek}h/wk)`} side="top">
                            <span className="w-3 h-3 rounded-full cursor-default" style={{ background: a.projectColor }} />
                          </Tooltip>
                        ))}
                        <span className="text-xs text-slate-500 self-center">{allocs.length} project{allocs.length !== 1 ? 's' : ''}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dept summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(['Engineering', 'Design', 'Product', 'Sales', 'Operations', 'Finance'] as const).map(dept => {
          const members = team.filter(m => m.department === dept)
          if (!members.length) return null
          const avgUtil = Math.round(members.reduce((s, m) => s + m.utilization, 0) / members.length)
          return (
            <Card key={dept} className="text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{dept}</p>
              <p className="text-2xl font-bold tracking-tight text-white mb-3">{avgUtil}%</p>
              <Progress value={avgUtil} size="sm" color={avgUtil >= 95 ? 'danger' : avgUtil >= 80 ? 'warning' : 'success'} />
              <p className="text-xs text-slate-500 mt-2">{members.length} member{members.length !== 1 ? 's' : ''}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

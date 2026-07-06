import { Avatar } from '@design-system/components/Avatar'
import { Tooltip } from '@design-system/components/Tooltip'
import { useResourcesStore } from '../store'

const WEEKS = ['W18', 'W19', 'W20', 'W21', 'W22', 'W23', 'W24']

function utilColor(u: number) {
  if (u >= 95) return '#e2445c'
  if (u >= 80) return '#fdab3d'
  if (u >= 60) return '#00c875'
  return '#579bfc'
}

function utilBadgeStyle(u: number) {
  const c = utilColor(u)
  return { background: c + '20', color: c }
}

export function CapacityPage() {
  const { team, allocationsForMember, utilHistory } = useResourcesStore()

  const totalCapacity = team.reduce((s, m) => s + m.availability, 0)
  const totalUsed     = team.reduce((s, m) => s + Math.round(m.availability * m.utilization / 100), 0)
  const overloaded    = team.filter(m => m.utilization >= 95)

  const depts = ['Engineering', 'Design', 'Product', 'Sales', 'Operations', 'Finance'] as const

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Capacity Planning</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>
          {totalUsed}h used / {totalCapacity}h total weekly capacity
        </p>
      </div>

      {/* Overload warnings */}
      {overloaded.length > 0 && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl flex-wrap"
          style={{ background: '#e2445c10', border: '1px solid #e2445c40' }}
        >
          <span className="text-sm font-bold" style={{ color: '#e2445c' }}>Overloaded:</span>
          {overloaded.map(m => (
            <span key={m.id} className="flex items-center gap-1.5">
              <Avatar name={m.name} size="xs" />
              <span className="text-sm font-semibold" style={{ color: '#e2445c' }}>{m.name} ({m.utilization}%)</span>
            </span>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--os-text-2)' }}>
        {[
          { color: '#579bfc', label: '<60%'    },
          { color: '#00c875', label: '60–80%'  },
          { color: '#fdab3d', label: '80–95%'  },
          { color: '#e2445c', label: '≥95%'    },
        ].map(l => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      {/* Capacity table */}
      <div className="os-card" style={{ padding: 0 }}>
        <div
          className="px-5 pt-5 pb-3"
          style={{ borderBottom: '1px solid var(--os-border)' }}
        >
          <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>Weekly Allocation by Person</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--os-border)', background: 'var(--os-surface-0)' }}>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest w-52" style={{ color: 'var(--os-text-2)' }}>Person</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest w-32" style={{ color: 'var(--os-text-2)' }}>Capacity</th>
                {WEEKS.map(w => (
                  <th key={w} className="text-center px-3 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>{w}</th>
                ))}
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>Projects</th>
              </tr>
            </thead>
            <tbody>
              {team.map(member => {
                const allocs  = allocationsForMember(member.id)
                const history = utilHistory.map(h => (h as Record<string, number | string>)[member.id] as number | undefined)
                const uc = utilColor(member.utilization)

                return (
                  <tr
                    key={member.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--os-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-0)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={member.name} size="sm" />
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>{member.name}</p>
                          <p className="text-xs" style={{ color: 'var(--os-text-2)' }}>{member.role.split(' ').slice(0, 2).join(' ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-1.5 rounded-full mb-1" style={{ background: 'var(--os-surface-0)' }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, member.utilization)}%`, background: uc }}
                        />
                      </div>
                      <p className="text-[10px]" style={{ color: 'var(--os-text-2)' }}>
                        {Math.round(member.availability * member.utilization / 100)}h / {member.availability}h
                      </p>
                    </td>
                    {WEEKS.map((w, i) => {
                      const util = i < history.length ? history[i] : member.utilization
                      const uw   = util ?? member.utilization
                      const wc   = utilColor(uw)
                      return (
                        <td key={w} className="px-3 py-4 text-center">
                          <Tooltip content={`${uw}% utilized`} side="top">
                            <div className="flex flex-col items-center gap-1">
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
                                style={{ background: wc }}
                              >
                                {uw}
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
                        <span className="text-xs self-center" style={{ color: 'var(--os-text-2)' }}>
                          {allocs.length} project{allocs.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dept summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {depts.map(dept => {
          const members = team.filter(m => m.department === dept)
          if (!members.length) return null
          const avgUtil = Math.round(members.reduce((s, m) => s + m.utilization, 0) / members.length)
          const uc = utilColor(avgUtil)
          return (
            <div key={dept} className="os-card p-5 text-center">
              <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--os-text-2)' }}>{dept}</p>
              <p className="text-3xl font-black tracking-tight mb-3" style={{ color: uc }}>{avgUtil}%</p>
              <div className="h-1.5 rounded-full mb-2" style={{ background: 'var(--os-surface-0)' }}>
                <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, avgUtil)}%`, background: uc }} />
              </div>
              <p className="text-xs" style={{ color: 'var(--os-text-2)' }}>{members.length} member{members.length !== 1 ? 's' : ''}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

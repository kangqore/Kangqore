import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { Tooltip } from '@design-system/components/Tooltip'
import { useResourcesStore } from '../store'

const PROJECTS = [
  { id: 'pj1', name: 'Alpha CRM',    color: '#1d54d8', short: 'CRM'    },
  { id: 'pj2', name: 'eQORE v2',     color: '#2563eb', short: 'eQORE'  },
  { id: 'pj3', name: 'Nexus Portal', color: '#059669', short: 'Nexus'  },
  { id: 'pj4', name: 'OS Dashboard', color: '#1d54d8', short: 'OS'     },
  { id: 'pj5', name: 'FinTrack',     color: '#d97706', short: 'Fin'    },
  { id: 'pj6', name: 'GlobeMed',     color: '#dc2626', short: 'Globe'  },
]

export function AssignmentsPage() {
  const { team, allocations } = useResourcesStore()

  function getAlloc(memberId: string, projectId: string) {
    return allocations.find(a => a.memberId === memberId && a.projectId === projectId)
  }

  const projectTotals = PROJECTS.map(p => ({
    ...p,
    totalHours: allocations.filter(a => a.projectId === p.id).reduce((s, a) => s + a.hoursPerWeek, 0),
    memberCount: new Set(allocations.filter(a => a.projectId === p.id).map(a => a.memberId)).size,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Assignments</h2>
        <p className="text-sm text-slate-500 mt-0.5">Allocation matrix — people × projects</p>
      </div>

      {/* Project summary row */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {projectTotals.map(p => (
          <Card key={p.id} className="text-center py-3 px-2">
            <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: p.color }} />
            <p className="text-xs font-semibold text-slate-300 mb-1">{p.short}</p>
            <p className="text-lg font-bold text-white">{p.totalHours}h</p>
            <p className="text-[10px] text-slate-500">{p.memberCount} people/wk</p>
          </Card>
        ))}
      </div>

      {/* Assignment matrix */}
      <Card padding="none">
        <CardHeader className="px-5 pt-5 pb-3">
          <CardTitle>Allocation Matrix</CardTitle>
          <span className="text-xs text-slate-500">Cell = hours/week · % of capacity</span>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-os-border bg-slate-900">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Person</th>
                {PROJECTS.map(p => (
                  <th key={p.id} className="text-center px-3 py-3">
                    <Tooltip content={p.name} side="top">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">{p.short}</span>
                      </div>
                    </Tooltip>
                  </th>
                ))}
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total / Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2854]">
              {team.map(member => {
                const memberAllocs = allocations.filter(a => a.memberId === member.id)
                const totalHrs = memberAllocs.reduce((s, a) => s + a.hoursPerWeek, 0)

                return (
                  <tr key={member.id} className="hover:bg-slate-900 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={member.name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-slate-200">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.availability}h/wk</p>
                        </div>
                      </div>
                    </td>
                    {PROJECTS.map(p => {
                      const alloc = getAlloc(member.id, p.id)
                      return (
                        <td key={p.id} className="px-3 py-4 text-center">
                          {alloc ? (
                            <Tooltip content={`${alloc.projectName} — ${alloc.hoursPerWeek}h/wk (${alloc.allocationPct}%)`} side="top">
                              <div
                                className="inline-flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl cursor-default"
                                style={{ background: p.color + '18', border: `1px solid ${p.color}40` }}
                              >
                                <span className="text-xs font-bold" style={{ color: p.color }}>{alloc.hoursPerWeek}h</span>
                                <span className="text-[10px]" style={{ color: p.color + 'aa' }}>{alloc.allocationPct}%</span>
                              </div>
                            </Tooltip>
                          ) : (
                            <span className="text-slate-200">—</span>
                          )}
                        </td>
                      )
                    })}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${totalHrs > member.availability ? 'text-red-600' : 'text-slate-200'}`}>
                          {totalHrs}h
                        </span>
                        <span className="text-xs text-slate-500">/ {member.availability}h</span>
                        {totalHrs > member.availability && (
                          <Badge variant="danger" size="sm">over</Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

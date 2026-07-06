import { useMemo } from 'react'
import { Avatar } from '@design-system/components/Avatar'
import { Tooltip } from '@design-system/components/Tooltip'
import { useResourcesStore } from '../store'

export function AssignmentsPage() {
  const { team, allocations } = useResourcesStore()

  const projects = useMemo(() => {
    const seen = new Map<string, { id: string; name: string; color: string; short: string }>()
    for (const a of allocations) {
      if (!seen.has(a.projectId)) {
        const words = a.projectName.split(' ')
        seen.set(a.projectId, {
          id:    a.projectId,
          name:  a.projectName,
          color: a.projectColor,
          short: words.length >= 2 ? words[0].slice(0, 3) + words[1].slice(0, 3) : words[0].slice(0, 5),
        })
      }
    }
    return [...seen.values()]
  }, [allocations])

  function getAlloc(memberId: string, projectId: string) {
    return allocations.find(a => a.memberId === memberId && a.projectId === projectId)
  }

  const projectTotals = projects.map(p => ({
    ...p,
    totalHours:  allocations.filter(a => a.projectId === p.id).reduce((s, a) => s + a.hoursPerWeek, 0),
    memberCount: new Set(allocations.filter(a => a.projectId === p.id).map(a => a.memberId)).size,
  }))

  if (team.length === 0) {
    return (
      <div className="py-20 text-center text-sm" style={{ color: 'var(--os-text-2)' }}>
        Loading team assignments…
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Assignments</h2>
          <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>
            Allocation matrix — people × projects
          </p>
        </div>
        <div className="py-20 text-center text-sm" style={{ color: 'var(--os-text-2)' }}>
          No project allocations found. Assign team members to projects to populate this view.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Assignments</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>
          Allocation matrix — people × projects
        </p>
      </div>

      {/* Project summary cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {projectTotals.map(p => (
          <div key={p.id} className="os-card p-4 text-center">
            <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: p.color }} />
            <p className="text-xs font-bold mb-1" style={{ color: 'var(--os-text-1)' }}>{p.short}</p>
            <p className="text-3xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>{p.totalHours}h</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--os-text-2)' }}>{p.memberCount} people/wk</p>
          </div>
        ))}
      </div>

      {/* Assignment matrix */}
      <div className="os-card" style={{ padding: 0 }}>
        <div
          className="flex items-center justify-between px-5 pt-5 pb-3"
          style={{ borderBottom: '1px solid var(--os-border)' }}
        >
          <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>Allocation Matrix</p>
          <span className="text-xs" style={{ color: 'var(--os-text-2)' }}>Cell = hours/week · % of capacity</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--os-border)', background: 'var(--os-surface-0)' }}>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>Person</th>
                {projects.map(p => (
                  <th key={p.id} className="text-center px-3 py-3">
                    <Tooltip content={p.name} side="top">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                        <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--os-text-2)' }}>{p.short}</span>
                      </div>
                    </Tooltip>
                  </th>
                ))}
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>Total / Capacity</th>
              </tr>
            </thead>
            <tbody>
              {team.map(member => {
                const memberAllocs = allocations.filter(a => a.memberId === member.id)
                const totalHrs = memberAllocs.reduce((s, a) => s + a.hoursPerWeek, 0)
                const overCap  = totalHrs > member.availability

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
                          <p className="text-xs" style={{ color: 'var(--os-text-2)' }}>{member.availability}h/wk</p>
                        </div>
                      </div>
                    </td>
                    {projects.map(p => {
                      const alloc = getAlloc(member.id, p.id)
                      return (
                        <td key={p.id} className="px-3 py-4 text-center">
                          {alloc ? (
                            <Tooltip content={`${alloc.projectName} — ${alloc.hoursPerWeek}h/wk (${alloc.allocationPct}%)`} side="top">
                              <div
                                className="inline-flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl cursor-default"
                                style={{
                                  background: p.color + '18',
                                  border: `1px solid ${p.color}40`,
                                }}
                              >
                                <span className="text-xs font-black" style={{ color: p.color }}>{alloc.hoursPerWeek}h</span>
                                <span className="text-[10px]" style={{ color: p.color + 'aa' }}>{alloc.allocationPct}%</span>
                              </div>
                            </Tooltip>
                          ) : (
                            <span style={{ color: 'var(--os-text-2)' }}>—</span>
                          )}
                        </td>
                      )
                    })}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black" style={{ color: overCap ? '#e2445c' : 'var(--os-text-1)' }}>
                          {totalHrs}h
                        </span>
                        <span className="text-xs" style={{ color: 'var(--os-text-2)' }}>/ {member.availability}h</span>
                        {overCap && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: '#e2445c20', color: '#e2445c' }}>
                            over
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

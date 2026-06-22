import { Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { useDepartmentsStore } from '../store'
import type { OrgNode } from '../types'

const DEPT_COLORS: Record<string, string> = {
  'Engineering':      'bg-blue-50 border-blue-200 text-blue-700',
  'Design & Product': 'bg-purple-50 border-purple-200 text-purple-700',
  'Sales & GTM':      'bg-green-50 border-green-200 text-green-700',
  'Client Delivery':  'bg-orange-50 border-orange-200 text-orange-700',
  'Finance & Ops':    'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border-white/10 border-t-white/20 text-slate-300',
}

function OrgNodeCard({ node }: { node: OrgNode }) {
  const color = DEPT_COLORS[node.department] ?? 'bg-slate-900 border-white/10 border-t-white/20 text-slate-300'
  return (
    <div className={`rounded-xl border p-3 min-w-[160px] text-center ${color}`}>
      <Avatar name={node.name} size="sm" className="mx-auto mb-2" />
      <p className="text-sm font-semibold leading-tight">{node.name}</p>
      <p className="text-xs opacity-70 mt-0.5">{node.title}</p>
      {node.headcount && (
        <div className="flex items-center justify-center gap-1 mt-1.5">
          <Users className="w-3 h-3 opacity-60" />
          <span className="text-xs opacity-70">{node.headcount} reports</span>
        </div>
      )}
    </div>
  )
}

export function OrgChartPage() {
  const { orgNodes, departments } = useDepartmentsStore()

  const ceo      = orgNodes.find(n => n.level === 0)
  const cSuite   = orgNodes.filter(n => n.level === 1)
  const level2   = orgNodes.filter(n => n.level === 2)
  const level3   = orgNodes.filter(n => n.level >= 3)

  const getReports = (parentId: string, nodes: OrgNode[]) =>
    nodes.filter(n => n.reportsTo === parentId)

  return (
    <div className="space-y-6">
      {/* Dept legend */}
      <div className="flex flex-wrap gap-2">
        {departments.map(d => (
          <div
            key={d.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${DEPT_COLORS[d.name] ?? 'bg-slate-900 border-white/10 border-t-white/20'}`}
          >
            <span>{d.name}</span>
            <Badge variant="neutral" size="sm">{d.headcount}</Badge>
          </div>
        ))}
      </div>

      {/* Org tree */}
      <Card>
        <CardHeader>
          <CardTitle>Organisation Chart</CardTitle>
        </CardHeader>
        <CardBody className="overflow-x-auto pb-6">
          <div className="min-w-[700px]">
            {/* CEO */}
            {ceo && (
              <div className="flex justify-center mb-6">
                <OrgNodeCard node={ceo} />
              </div>
            )}

            {/* Connector line */}
            <div className="flex justify-center mb-2">
              <div className="w-px h-6 bg-slate-200" />
            </div>
            <div className="flex justify-center mb-2">
              <div className="h-px bg-slate-200" style={{ width: `${cSuite.length * 200}px` }} />
            </div>

            {/* C-Suite row */}
            <div className="flex justify-around gap-4 mb-2">
              {cSuite.map(node => (
                <div key={node.id} className="flex flex-col items-center gap-2">
                  <div className="w-px h-4 bg-slate-200" />
                  <OrgNodeCard node={node} />
                </div>
              ))}
            </div>

            {/* Level 2 & 3 grouped under their head */}
            <div className="flex justify-around gap-4 mt-4">
              {cSuite.map(head => {
                const reports = getReports(head.id, [...level2, ...level3])
                if (!reports.length) return <div key={head.id} className="flex-1" />
                return (
                  <div key={head.id} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-px h-4 bg-slate-200" />
                    <div className="flex flex-col gap-2 items-center">
                      {reports.map(r => (
                        <div key={r.id} className="flex flex-col items-center gap-1">
                          <OrgNodeCard node={r} />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Headcount table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Directory</CardTitle>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 border-t-white/20 bg-slate-900/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Department</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Reports To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2854]">
              {orgNodes.map(node => {
                const manager = orgNodes.find(n => n.id === node.reportsTo)
                return (
                  <tr key={node.id} className="hover:bg-slate-900 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={node.name} size="xs" />
                        <span className="font-medium text-white">{node.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{node.title}</td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral" size="sm">{node.department}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{manager?.name ?? '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GitMerge, ChevronDown, ChevronRight, Clock, AlertTriangle } from 'lucide-react'
import { api } from '@lib/api'

interface ChangeRequest {
  id:          string
  title:       string
  description: string
  status:      string
  priority:    string
  decisionType: string
  rationale:   string | null
  tradeoffs:   string | null
  costImpact:  number | null
  timeImpact:  string | null
  createdAt:   string
  updatedAt:   string
  client:      { id: string; name: string }
  project:     { id: string; name: string }
}

const STATUS_C = {
  PROPOSED:   { bg: 'rgba(87,155,252,0.1)',   text: '#579bfc',  label: 'Proposed'   },
  APPROVED:   { bg: 'rgba(0,200,117,0.08)',   text: '#00c875',  label: 'Approved'   },
  REJECTED:   { bg: 'rgba(226,68,92,0.1)',    text: '#e2445c',  label: 'Rejected'   },
  IN_REVIEW:  { bg: 'rgba(253,171,61,0.1)',   text: '#fdab3d',  label: 'In Review'  },
  IMPLEMENTED:{ bg: 'rgba(124,58,237,0.1)',   text: '#7c3aed',  label: 'Implemented'},
  CANCELLED:  { bg: 'rgba(100,100,100,0.08)', text: 'var(--os-text-2)', label: 'Cancelled' },
} as Record<string, { bg: string; text: string; label: string }>

const PRI_C = { HIGH: '#e2445c', MEDIUM: '#fdab3d', LOW: '#579bfc', CRITICAL: '#e2445c' } as Record<string, string>

function ChangeRow({ cr }: { cr: ChangeRequest }) {
  const [exp, setExp] = useState(false)
  const qc = useQueryClient()

  const update = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.patch(`/change-requests/${cr.id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['itil-changes'] }),
  })

  const sc = STATUS_C[cr.status] ?? STATUS_C['PROPOSED']

  return (
    <>
      <tr className="hover:bg-[var(--os-surface-0)] transition-colors cursor-pointer" onClick={() => setExp(e => !e)}>
        <td className="px-4 py-3 w-6">
          {exp ? <ChevronDown className="w-3.5 h-3.5 text-[var(--os-text-2)]" /> : <ChevronRight className="w-3.5 h-3.5 text-[var(--os-text-2)]" />}
        </td>
        <td className="px-2 py-3 max-w-xs">
          <p className="text-xs font-bold text-[var(--os-text-1)] truncate">{cr.title}</p>
          <p className="text-[10px] text-[var(--os-text-2)]">{cr.project.name}</p>
        </td>
        <td className="px-2 py-3 whitespace-nowrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded-2xl text-[10px] font-bold" style={{ background: sc.bg, color: sc.text }}>
            {sc.label}
          </span>
        </td>
        <td className="px-2 py-3 whitespace-nowrap">
          <span className="text-[10px] font-bold" style={{ color: PRI_C[cr.priority] ?? '#579bfc' }}>{cr.priority}</span>
        </td>
        <td className="px-2 py-3 whitespace-nowrap">
          <span className="text-[10px] text-[var(--os-text-2)]">{cr.client.name}</span>
        </td>
        {cr.costImpact != null && (
          <td className="px-2 py-3 whitespace-nowrap">
            <span className="text-xs font-bold text-[var(--os-text-2)]">£{Number(cr.costImpact).toLocaleString()}</span>
          </td>
        )}
        {cr.costImpact == null && <td className="px-2 py-3" />}
        <td className="px-2 py-3 whitespace-nowrap">
          <span className="text-[10px] text-[var(--os-text-2)] flex items-center gap-1">
            <Clock className="w-3 h-3" />{new Date(cr.createdAt).toLocaleDateString()}
          </span>
        </td>
      </tr>

      {exp && (
        <tr>
          <td colSpan={7}>
            <div className="mx-4 mb-3 p-4 rounded-2xl border border-[var(--os-border)]" style={{ background: 'var(--os-surface-0)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)] mb-1">Description</p>
                  <p className="text-xs text-[var(--os-text-1)] leading-relaxed mb-3">{cr.description}</p>
                  {cr.rationale && (
                    <>
                      <p className="text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)] mb-1">Rationale</p>
                      <p className="text-xs text-[var(--os-text-1)] leading-relaxed mb-3">{cr.rationale}</p>
                    </>
                  )}
                  {cr.tradeoffs && (
                    <>
                      <p className="text-[10px] font-black uppercase tracking-wider text-amber-500 mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Tradeoffs
                      </p>
                      <p className="text-xs text-[var(--os-text-1)] leading-relaxed">{cr.tradeoffs}</p>
                    </>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)] mb-2">CAB Decision</p>
                  <div className="flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
                    {['APPROVED','REJECTED','IN_REVIEW','IMPLEMENTED','CANCELLED']
                      .filter(s => s !== cr.status)
                      .map(s => {
                        const c = STATUS_C[s]
                        return (
                          <button
                            key={s}
                            onClick={() => update.mutate({ status: s })}
                            disabled={update.isPending}
                            className="px-3 py-1.5 rounded-2xl text-[10px] font-bold transition-colors disabled:opacity-40"
                            style={{ background: c?.bg, color: c?.text }}
                          >
                            {c?.label ?? s}
                          </button>
                        )
                      })}
                  </div>

                  {cr.timeImpact && (
                    <div className="mt-4">
                      <p className="text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)] mb-1">Time Impact</p>
                      <p className="text-xs text-[var(--os-text-1)]">{cr.timeImpact}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export function ChangePipeline() {
  const [filterStatus, setStatus] = useState('')

  const params = new URLSearchParams()
  if (filterStatus) params.set('status', filterStatus)

  const { data, isLoading } = useQuery<{ changeRequests: ChangeRequest[]; total: number }>({
    queryKey: ['itil-changes', filterStatus],
    queryFn:  () => api.get(`/change-requests?${params}&limit=100`).then(r => r.data),
    staleTime: 30_000,
  })

  const rows  = data?.changeRequests ?? []
  const total = data?.total ?? rows.length

  const byStatus = ['PROPOSED','IN_REVIEW','APPROVED','IMPLEMENTED','REJECTED','CANCELLED']
    .map(s => ({ s, count: rows.filter(r => r.status === s).length }))
    .filter(x => x.count > 0)

  return (
    <div>
      {/* Status summary pills */}
      {byStatus.length > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {byStatus.map(({ s, count }) => {
            const c = STATUS_C[s]
            return (
              <button
                key={s}
                onClick={() => setStatus(filterStatus === s ? '' : s)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[10px] font-bold transition-all"
                style={{
                  background: filterStatus === s ? (c?.text ?? '#579bfc') : (c?.bg ?? 'rgba(87,155,252,0.1)'),
                  color:      filterStatus === s ? '#fff'                  : (c?.text ?? '#579bfc'),
                  border:     `1px solid ${c?.text ?? '#579bfc'}33`,
                }}
              >
                {c?.label ?? s}
                <span className="bg-white/20 rounded-full px-1.5 py-0.5 text-[9px]">{count}</span>
              </button>
            )
          })}
          {filterStatus && (
            <button onClick={() => setStatus('')} className="text-[10px] font-bold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
              Clear filter ×
            </button>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-[var(--os-border)] overflow-hidden" style={{ background: 'var(--os-card)' }}>
        {isLoading ? (
          <div className="p-6 space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-10 rounded-2xl animate-pulse" style={{ background: 'var(--os-surface-0)' }} />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center">
            <GitMerge className="w-6 h-6 mx-auto mb-2 text-[var(--os-text-2)]" />
            <p className="text-sm font-bold text-[var(--os-text-1)]">No change requests</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--os-border)]">
                  <th className="px-4 py-2.5 w-6" />
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Title</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Status</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Priority</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Client</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Cost Impact</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Raised</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--os-border)]">
                {rows
                  .filter(r => !filterStatus || r.status === filterStatus)
                  .map(cr => <ChangeRow key={cr.id} cr={cr} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[10px] text-[var(--os-text-2)] mt-3">{total} total change requests — sourced from project delivery data</p>
    </div>
  )
}

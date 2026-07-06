import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Shield, Download, Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { api } from '@lib/api'

interface AuditRow {
  id:         string
  eventType:  string
  system:     string | null
  trigger:    string | null
  actor:      string
  autonomous: boolean
  priority:   string | null
  durationMs: number | null
  createdAt:  string
}

interface AuditResponse {
  rows:  AuditRow[]
  total: number
  page:  number
  limit: number
}

function EventTypeBadge({ type }: { type: string }) {
  const colour = type.includes('DENIED') || type.includes('DELETE')
    ? { bg: 'rgba(226,68,92,0.1)', text: '#e2445c', border: 'rgba(226,68,92,0.2)' }
    : type === 'ACTIVATION'
    ? { bg: 'rgba(87,155,252,0.1)', text: '#579bfc', border: 'rgba(87,155,252,0.2)' }
    : { bg: 'rgba(0,200,117,0.08)', text: '#00c875', border: 'rgba(0,200,117,0.2)' }

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
      style={{ background: colour.bg, color: colour.text, border: `1px solid ${colour.border}` }}
    >
      {type}
    </span>
  )
}

export function DataPrivacyPage() {
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(0)
  const [deleteInput, setDelete]  = useState('')
  const [deleteReason, setReason] = useState('')
  const [exportDone, setExportDone] = useState(false)
  const [deleteSent, setDeleteSent] = useState(false)

  const { data: audit, isLoading } = useQuery<AuditResponse>({
    queryKey:  ['data-privacy-audit', page, search],
    queryFn:   () => api.get(`/admin/data-privacy/audit-log?page=${page}&limit=20&search=${encodeURIComponent(search)}`).then(r => r.data),
    staleTime: 30_000,
  })

  const deleteRequest = useMutation({
    mutationFn: () => api.post('/admin/data-privacy/delete-request', { reason: deleteReason }),
    onSuccess:  () => setDeleteSent(true),
  })

  const handleExport = async () => {
    const res = await api.get('/admin/data-privacy/export', { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/json' }))
    const a   = document.createElement('a')
    a.href    = url
    a.download = `kangqore-data-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportDone(true)
  }

  const rows  = audit?.rows  ?? []
  const total = audit?.total ?? 0
  const limit = audit?.limit ?? 20

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Export */}
      <div className="rounded-2xl p-5 border border-[var(--os-border)]" style={{ background: 'var(--os-card)' }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(87,155,252,0.1)' }}>
            <Download className="w-5 h-5" style={{ color: '#579bfc' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-[var(--os-text-1)] mb-1">Export My Data</p>
            <p className="text-xs font-medium text-[var(--os-text-2)] mb-3">
              Download a JSON file containing your profile, projects, tasks, and activity — in accordance with GDPR Article 20.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                style={{ background: '#579bfc', color: '#fff' }}
              >
                <Download className="w-3.5 h-3.5" />
                Download Export
              </button>
              {exportDone && (
                <span className="flex items-center gap-1 text-xs font-bold text-green-500">
                  <CheckCircle className="w-3.5 h-3.5" /> Downloaded
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="rounded-2xl border border-[var(--os-border)]" style={{ background: 'var(--os-card)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--os-border)]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--os-text-2)]" />
            <p className="text-sm font-bold text-[var(--os-text-1)]">Activity Log</p>
            <span className="text-xs text-[var(--os-text-2)]">{total} entries</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--os-text-2)]" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="Search events…"
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc] w-44"
            />
          </div>
        </div>

        {isLoading && (
          <div className="p-5 space-y-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: 'var(--os-surface-0)' }} />
            ))}
          </div>
        )}

        {!isLoading && rows.length === 0 && (
          <div className="py-12 text-center text-sm font-medium text-[var(--os-text-2)]">No activity found.</div>
        )}

        {!isLoading && rows.length > 0 && (
          <>
            <div className="divide-y divide-[var(--os-border)]">
              {rows.map(row => (
                <div key={row.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                    <EventTypeBadge type={row.eventType} />
                    {row.system && (
                      <span className="text-[10px] font-bold text-[var(--os-text-2)]">{row.system}</span>
                    )}
                    {row.trigger && (
                      <span className="text-[10px] text-[var(--os-text-2)] font-mono truncate max-w-[180px]">{row.trigger}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {row.autonomous && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 uppercase">auto</span>
                    )}
                    <span className="text-[10px] text-[var(--os-text-2)] flex items-center gap-1 whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {new Date(row.createdAt).toLocaleDateString()} {new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {total > limit && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--os-border)]">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  className="text-xs font-bold text-[var(--os-text-2)] disabled:opacity-30 hover:text-[var(--os-text-1)] transition-colors"
                >
                  ← Prev
                </button>
                <span className="text-xs text-[var(--os-text-2)]">{page + 1} / {Math.ceil(total / limit)}</span>
                <button
                  disabled={(page + 1) * limit >= total}
                  onClick={() => setPage(p => p + 1)}
                  className="text-xs font-bold text-[var(--os-text-2)] disabled:opacity-30 hover:text-[var(--os-text-1)] transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Danger zone — account deletion */}
      <div className="rounded-2xl p-5 border border-red-500/20" style={{ background: 'rgba(226,68,92,0.04)' }}>
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-500 mb-0.5">Delete Account</p>
            <p className="text-xs font-medium text-[var(--os-text-2)]">
              Submit a GDPR deletion request. Your data will be removed within 30 days. This cannot be undone.
            </p>
          </div>
        </div>

        {deleteSent ? (
          <div className="flex items-center gap-2 text-sm font-bold text-green-500">
            <CheckCircle className="w-4 h-4" />
            Deletion request submitted. You will be contacted within 30 days.
          </div>
        ) : (
          <div className="space-y-3">
            <input
              value={deleteReason}
              onChange={e => setReason(e.target.value)}
              placeholder="Reason for deletion (optional)"
              className="w-full px-3 py-2 text-xs rounded-lg border border-red-500/20 bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-red-500/50 placeholder:text-[var(--os-text-2)]"
            />
            <input
              value={deleteInput}
              onChange={e => setDelete(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              className="w-full px-3 py-2 text-xs rounded-lg border border-red-500/20 bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-red-500/50 placeholder:text-[var(--os-text-2)]"
            />
            <button
              disabled={deleteInput !== 'DELETE' || deleteRequest.isPending}
              onClick={() => deleteRequest.mutate()}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-40"
              style={{ background: '#e2445c', color: '#fff' }}
            >
              {deleteRequest.isPending ? 'Submitting…' : 'Submit Deletion Request'}
            </button>
          </div>
        )}
      </div>

    </div>
  )
}

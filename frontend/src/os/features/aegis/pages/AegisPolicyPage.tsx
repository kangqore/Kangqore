import { useQuery } from '@tanstack/react-query'
import { FileText, CheckCircle } from 'lucide-react'
import { api } from '@lib/api'

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: 'text-red-400 bg-red-500/10 border-red-500/20',
  HIGH:     'text-amber-400 bg-amber-500/10 border-amber-500/20',
  MODERATE: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  LOW:      'text-[var(--os-text-2)] bg-[var(--os-surface-0)] border-[var(--os-border)]',
}

export function AegisPolicyPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['aegis-policy'],
    queryFn:  () => api.get('/admin/aegis/policy/rules').then(r => r.data),
    staleTime: 300_000,
  })

  const policies: any[] = data?.policies ?? []

  return (
    <div className="space-y-6">
      <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4 flex items-start gap-3">
        <FileText className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-cyan-300 mb-0.5">Policy Engine</p>
          <p className="text-xs text-[var(--os-text-2)] leading-relaxed">
            Governance rules evaluated at runtime before any sensitive action proceeds. Violations are logged to the AEGIS audit ledger.
            Policies with a DENY verdict block the action immediately.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--os-surface-0)] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : policies.length === 0 ? (
        <div className="text-center py-16 text-[var(--os-text-2)] text-sm">No policies loaded.</div>
      ) : (
        <div className="space-y-3">
          {policies.map((p: any) => (
            <div key={p.id} className="bg-[var(--os-surface-0)] border border-[var(--os-border)] hover:border-[var(--os-border)] rounded-xl p-4 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-[var(--os-text-1)]">{p.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--os-text-2)]">{p.id}</span>
                </div>
                <span className={`flex-shrink-0 text-[11px] font-mono border rounded px-2 py-0.5 ${SEVERITY_COLORS[p.severity] ?? SEVERITY_COLORS.LOW}`}>
                  {p.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-[var(--os-text-2)] text-center">
        {policies.length} policies enforced · All active · Runtime evaluation
      </div>
    </div>
  )
}

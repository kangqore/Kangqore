import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CreditCard, CheckCircle2 } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const GREEN = '#10b981', AMBER = '#f59e0b', RED = '#ef4444'

const STAGE_LABEL: Record<string, string> = { DAY_3: 'Day 3', DAY_7: 'Day 7', DAY_14: 'Day 14', DAY_30: 'Day 30' }
const STATUS_COLOR: Record<string, string> = { PENDING: AMBER, SENT: '#3b82f6', RESOLVED: GREEN, CHURNED: RED }

export function DunningPage() {
  const qc = useQueryClient()
  const seqQ = useQuery({ queryKey: ['dunning-sequences'], queryFn: () => api.get('/admin/kangqore-immp/revenue/dunning/sequences').then(r => r.data), staleTime: 20_000 })
  const resolveM = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/revenue/dunning/${id}/resolve`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dunning-sequences'] }),
  })
  const triggerM = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/revenue/dunning/trigger', { stage: 'DAY_3', amountGbp: 799 }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dunning-sequences'] }),
  })
  const seqs: any[] = seqQ.data ?? []
  const resolved = seqs.filter(s => s.status === 'RESOLVED').length
  const pending  = seqs.filter(s => s.status !== 'RESOLVED' && s.status !== 'CHURNED').length

  return (
    <div style={{ maxWidth: 920 }} className="space-y-6">
      <div style={{ padding: '22px 26px', borderRadius: 16, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(251,191,36,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CreditCard style={{ width: 28, height: 28, color: AMBER }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>S168 — Revenue Ops Automation</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>Automated dunning (Day 3/7/14/30) · payment recovery · invoice dispute pipeline · KIMMP churn alert</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: resolved > 0 ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>{resolved}</div>
          <div style={{ fontSize: 10, color: T2, fontWeight: 600 }}>Resolved</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          { label: 'Total Sequences', value: seqs.length, color: AMBER },
          { label: 'Active',           value: pending,     color: '#3b82f6' },
          { label: 'Resolved',         value: resolved,    color: GREEN },
        ].map(m => (
          <div key={m.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => triggerM.mutate()} disabled={triggerM.isPending} style={{ padding: '8px 18px', borderRadius: 8, background: 'rgba(251,191,36,0.1)', color: AMBER, border: '1px solid rgba(251,191,36,0.2)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
          {triggerM.isPending ? 'Triggering…' : 'Trigger Demo Dunning Sequence'}
        </button>
      </div>

      {seqs.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>Dunning Sequences</div>
          {seqs.map((s: any, i: number) => (
            <div key={s.id} style={{ padding: '14px 20px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>{STAGE_LABEL[s.stage] ?? s.stage}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: STATUS_COLOR[s.status] + '15', color: STATUS_COLOR[s.status], border: `1px solid ${STATUS_COLOR[s.status]}25` }}>{s.status}</span>
                  {s.invoiceRef && <span style={{ fontSize: 10, color: T2 }}>{s.invoiceRef}</span>}
                </div>
                <div style={{ fontSize: 11, color: T2 }}>
                  {s.amountGbp ? `£${s.amountGbp.toLocaleString()}` : '—'} · Tenant {s.tenantId}
                  {s.sentAt && ` · Sent ${new Date(s.sentAt).toLocaleDateString()}`}
                  {s.resolvedAt && ` · Resolved ${new Date(s.resolvedAt).toLocaleDateString()}`}
                </div>
              </div>
              {(s.status === 'SENT' || s.status === 'PENDING') && (
                <button onClick={() => resolveM.mutate(s.id)} disabled={resolveM.isPending} style={{ padding: '6px 12px', borderRadius: 7, background: 'rgba(16,185,129,0.1)', color: GREEN, border: '1px solid rgba(16,185,129,0.2)', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 style={{ width: 12, height: 12 }} /> Resolve
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Briefcase, ChevronRight } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const AMBER = '#f59e0b', GREEN = '#10b981', RED = '#ef4444'

const STAGES = ['QUALIFIED', 'POC', 'LEGAL', 'WON', 'LOST'] as const
const STAGE_COLOR: Record<string, string> = { QUALIFIED: '#3b82f6', POC: '#8b5cf6', LEGAL: AMBER, WON: GREEN, LOST: RED }

export function EnterprisePipelinePage() {
  const qc = useQueryClient()
  const q = useQuery({ queryKey: ['enterprise-pipeline'], queryFn: () => api.get('/admin/kangqore-immp/revenue/sales/pipeline').then(r => r.data), staleTime: 20_000 })
  const advanceM = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) => api.patch(`/admin/kangqore-immp/revenue/sales/leads/${id}`, { stage }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enterprise-pipeline'] }),
  })
  const d = q.data
  const leads: any[] = d?.leads ?? []

  function nextStage(stage: string) {
    const idx = STAGES.indexOf(stage as any)
    return idx >= 0 && idx < STAGES.length - 2 ? STAGES[idx + 1] : null
  }

  return (
    <div style={{ maxWidth: 920 }} className="space-y-6">
      <div style={{ padding: '22px 26px', borderRadius: 16, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(251,191,36,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Briefcase style={{ width: 28, height: 28, color: AMBER }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>S169 — Enterprise Sales Pipeline</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>KIMMP intent scoring · Qualified→POC→Legal→Won · deal velocity · MSA auto-fill from SOC2 evidence</div>
        </div>
        {d && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: AMBER, fontVariantNumeric: 'tabular-nums' }}>£{(d.totalPipelineArr / 1000).toFixed(0)}k</div>
            <div style={{ fontSize: 10, color: T2, fontWeight: 600 }}>Pipeline ARR</div>
          </div>
        )}
      </div>

      {d && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
          {STAGES.map(s => (
            <div key={s} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: STAGE_COLOR[s], fontVariantNumeric: 'tabular-nums' }}>{d.stageCounts?.[s] ?? 0}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 4 }}>{s}</div>
            </div>
          ))}
        </div>
      )}

      {leads.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>Leads</div>
          {leads.map((l: any, i: number) => {
            const next = nextStage(l.stage)
            return (
              <div key={l.id} style={{ padding: '16px 20px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 900, color: T1 }}>{l.companyName}</span>
                    <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: STAGE_COLOR[l.stage] + '15', color: STAGE_COLOR[l.stage], border: `1px solid ${STAGE_COLOR[l.stage]}25` }}>{l.stage}</span>
                    {l.industry && <span style={{ fontSize: 10, color: T2 }}>{l.industry}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: T2, fontVariantNumeric: 'tabular-nums' }}>
                    ARR est. £{l.estimatedArr?.toLocaleString() ?? '—'}
                    {l.intentScore != null && ` · Intent ${l.intentScore}/100`}
                    {l.dealVelocityDays != null && ` · ${l.dealVelocityDays}d velocity`}
                  </div>
                  {l.wonAt && <div style={{ fontSize: 10, color: GREEN, marginTop: 3 }}>Won {new Date(l.wonAt).toLocaleDateString()}</div>}
                </div>
                {next && (
                  <button onClick={() => advanceM.mutate({ id: l.id, stage: next })} disabled={advanceM.isPending} style={{ padding: '6px 12px', borderRadius: 7, background: STAGE_COLOR[next] + '12', color: STAGE_COLOR[next], border: `1px solid ${STAGE_COLOR[next]}25`, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    Advance to {next} <ChevronRight style={{ width: 11, height: 11 }} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

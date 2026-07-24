import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Trophy } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const GREEN = '#10b981', RED = '#ef4444', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function Gen4Scale80Page() {
  const qc = useQueryClient()
  const statusQ = useQuery({ queryKey: ['s172-status'], queryFn: () => api.get('/admin/kangqore-immp/platform/s172-status').then(r => r.data), staleTime: 15_000 })
  const pushM = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen4/router/push-80').then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['s172-status'] }); qc.invalidateQueries({ queryKey: ['gen4-router'] }) },
  })

  const s = statusQ.data
  const allPass = s?.passed === s?.total && s?.total > 0
  const declared = s?.livePercent >= 80

  return (
    <div style={{ maxWidth: 900 }} className="space-y-6">
      {/* Header */}
      <div style={{ padding: '22px 26px', borderRadius: 16, background: declared ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.03)', border: `1px solid ${declared ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.15)'}`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Trophy style={{ width: 26, height: 26, color: GREEN }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>S172 — Gen4 Production Declaration ⭐</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>WAANDAx Foundation v0.1 handles 80% of KIMMP reasoning · parity ≥ 85% · cost savings ≥ 30% · Kangqore's own AI runs the platform</div>
        </div>
        {s && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: allPass ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>{s.score}%</div>
            <div style={{ fontSize: 10, color: T2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em' }}>Gate Score</div>
          </div>
        )}
      </div>

      {/* Production declared banner */}
      {declared && (
        <div style={{ padding: '18px 24px', borderRadius: 14, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 28 }}>🏆</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: GREEN }}>Gen4 Declared Production AI</div>
            <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>WAANDAx Foundation v0.1 is the primary KIMMP reasoning engine. Kangqore is now self-sufficient — running its own AI at scale. Gen5 architecture begins next.</div>
          </div>
        </div>
      )}

      {/* Key stats */}
      {s && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {[
            { label: 'Live %',             value: `${s.livePercent}%`,                                              color: s.livePercent >= 80 ? GREEN : AMBER },
            { label: 'Parity Score',       value: s.parityScore ? `${(s.parityScore * 100).toFixed(1)}%` : '—',    color: s.parityScore >= 0.85 ? GREEN : RED },
            { label: 'Cost Saving',        value: `${s.costSavingPct}%`,                                            color: s.costSavingPct >= 30 ? GREEN : AMBER },
            { label: 'Gen4 Decisions',     value: s.gen4DecisionsServed?.toLocaleString() ?? '0',                  color: s.gen4DecisionsServed >= 1000 ? GREEN : AMBER },
          ].map(m => (
            <div key={m.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Gate criteria */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: T1, marginBottom: 14 }}>Gate S172 Criteria</div>
        <div className="space-y-3">
          {s?.criteria?.map((c: any) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: c.passed ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.04)', border: `1px solid ${c.passed ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.15)'}` }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.passed ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)', flexShrink: 0, fontSize: 12 }}>
                {c.passed ? '✓' : '○'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: c.passed ? T1 : T2 }}>{c.label}</div>
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: c.passed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)', color: c.passed ? GREEN : RED, border: `1px solid ${c.passed ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)'}` }}>
                {c.id}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Push action */}
      <div style={{ background: CARD, border: `1px solid ${declared ? 'rgba(16,185,129,0.3)' : BDR}`, borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: T1, marginBottom: 8 }}>Declare Gen4 Production</div>
        <div style={{ fontSize: 12, color: T2, marginBottom: 16 }}>Pushes Gen4 to handle 80% of all KIMMP reasoning. Simulates 5 000 requests. Requires 50%+ live, parity ≥85%, zero consecutive fails, cost savings ≥30%.</div>
        {declared
          ? <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', color: GREEN, fontSize: 13, fontWeight: 700, border: '1px solid rgba(16,185,129,0.2)' }}>✓ Gen4 Production Declared — {s.livePercent}% live · Gate S172 passed</div>
          : <button onClick={() => pushM.mutate()} disabled={pushM.isPending || !allPass} style={{ padding: '11px 24px', borderRadius: 10, background: allPass ? GREEN : 'rgba(255,255,255,0.04)', color: allPass ? '#fff' : T2, border: `1px solid ${allPass ? GREEN : BDR}`, fontSize: 13, fontWeight: 700, cursor: allPass ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trophy style={{ width: 14, height: 14 }} />
              {pushM.isPending ? 'Declaring…' : 'Declare Gen4 Production'}
            </button>
        }
        {pushM.isError && <div style={{ fontSize: 11, color: RED, marginTop: 8 }}>{(pushM.error as any)?.response?.data?.error}</div>}
        {pushM.isSuccess && <div style={{ fontSize: 11, color: GREEN, marginTop: 8 }}>{pushM.data?.message}</div>}
        {!allPass && s && <div style={{ fontSize: 11, color: AMBER, marginTop: 8 }}>{s.total - s.passed} gate criteria unmet. Check router page and eval suite.</div>}
      </div>

      {/* What's next */}
      {declared && (
        <div style={{ background: CARD, border: `1px solid ${PURPLE}44`, borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T1, marginBottom: 10 }}>What's Next — WAANDAx Gen5</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { label: 'Corpus Growth',    desc: 'Scale training data to 50k+ decisions · annual re-fine-tune cadence' },
              { label: 'Gen5 Architecture', desc: 'WAANDA native reasoning engine — larger model, multi-step planning, agent specialisation' },
              { label: '100% Routing',      desc: 'Push Gen4 to 100% once Gen5 enters shadow mode alongside · Claude becomes fallback only' },
            ].map(n => (
              <div key={n.label} style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(167,139,250,0.04)', border: '1px solid rgba(167,139,250,0.15)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: PURPLE, marginBottom: 4 }}>{n.label}</div>
                <div style={{ fontSize: 11, color: T2 }}>{n.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

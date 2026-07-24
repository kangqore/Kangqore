import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Database, RefreshCw, Award } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const GOLD = '#f59e0b', SILVER = '#94a3b8', BRONZE = '#d97706'

export function CorpusAuditPage() {
  const qc = useQueryClient()
  const [auditResult, setAuditResult] = useState<any>(null)
  const statsQ = useQuery({ queryKey: ['corpus-stats'], queryFn: () => api.get('/admin/kangqore-immp/gen4/corpus/stats').then(r => r.data), staleTime: 30_000 })
  const auditM = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen4/corpus/audit').then(r => r.data),
    onSuccess: (d) => { setAuditResult(d); qc.invalidateQueries({ queryKey: ['corpus-stats'] }) },
  })
  const s = statsQ.data ?? auditResult ?? {}
  const ready = s.total > 0

  return (
    <div style={{ maxWidth: 920 }} className="space-y-6">
      <div style={{ padding: '22px 26px', borderRadius: 16, background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Database style={{ width: 28, height: 28, color: '#a78bfa' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>S158 — Corpus Quality Audit</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>Scan all decisions + signals · Quality tier tagging (gold/silver/bronze) · Deduplication pass</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#a78bfa', fontVariantNumeric: 'tabular-nums' }}>{s.readinessScore ?? 0}%</div>
          <div style={{ fontSize: 10, color: T2, fontWeight: 600 }}>Readiness Score</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
        {[
          { label: 'Total Records', value: s.total ?? 0, color: '#a78bfa' },
          { label: 'Gold', value: s.gold ?? 0, color: GOLD },
          { label: 'Silver', value: s.silver ?? 0, color: SILVER },
          { label: 'Bronze', value: s.bronze ?? 0, color: BRONZE },
          { label: 'Duplicates', value: s.dupes ?? 0, color: '#ef4444' },
        ].map(m => (
          <div key={m.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value.toLocaleString()}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {ready && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>Quality Tier Breakdown</div>
          {[
            { tier: 'Gold',   count: s.gold ?? 0,   color: GOLD,   desc: 'High confidence decisions (≥85%)' },
            { tier: 'Silver', count: s.silver ?? 0, color: SILVER, desc: 'Medium confidence (65–85%)' },
            { tier: 'Bronze', count: s.bronze ?? 0, color: BRONZE, desc: 'Lower confidence / signals (<65%)' },
          ].map((t, i) => {
            const total = (s.gold ?? 0) + (s.silver ?? 0) + (s.bronze ?? 0)
            const pct = total > 0 ? Math.round((t.count / total) * 100) : 0
            return (
              <div key={t.tier} style={{ padding: '14px 20px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined, display: 'flex', alignItems: 'center', gap: 14 }}>
                <Award style={{ width: 16, height: 16, color: t.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T1 }}>{t.tier} — {t.desc}</div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999, marginTop: 6 }}>
                    <div style={{ height: 4, width: `${pct}%`, background: t.color, borderRadius: 999 }} />
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 900, color: t.color, fontVariantNumeric: 'tabular-nums' }}>{t.count}</span>
              </div>
            )
          })}
        </div>
      )}

      {s.byType && Object.keys(s.byType).length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: T2, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Records by Type</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(s.byType).map(([type, count]: any) => (
              <div key={type} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', fontSize: 12, fontWeight: 700, color: '#a78bfa' }}>
                {type}: <span style={{ fontVariantNumeric: 'tabular-nums' }}>{count}</span>
              </div>
            ))}
          </div>
          {s.totalTokens && <div style={{ marginTop: 10, fontSize: 11, color: T2 }}>Total tokens: <strong>{s.totalTokens.toLocaleString()}</strong></div>}
        </div>
      )}

      <button onClick={() => auditM.mutate()} disabled={auditM.isPending} style={{ padding: '10px 24px', borderRadius: 10, background: '#a78bfa', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
        <RefreshCw style={{ width: 14, height: 14 }} />
        {auditM.isPending ? 'Auditing corpus…' : 'Run Corpus Audit'}
      </button>
      {auditM.isError && <p style={{ color: '#ef4444', fontSize: 12 }}>{(auditM.error as any)?.response?.data?.error}</p>}
    </div>
  )
}

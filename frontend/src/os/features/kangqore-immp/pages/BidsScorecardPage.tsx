import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const CAT_COLOR: Record<string, string> = {
  Leadership: '#4fc3f7', People: '#a78bfa', Finance: '#10b981',
  Operations: '#f59e0b', Technology: '#06b6d4', Customer: '#f97316',
  Commercial: '#00ddaa', Innovation: '#ec4899', Governance: '#8b5cf6',
}

const GRADE_COLOR: Record<string, string> = { 'A+': '#10b981', A: '#22c55e', B: '#4fc3f7', C: '#f59e0b', D: '#ef4444' }

function ScoreBar({ score, weight }: { score: number; weight: number }) {
  const color = score >= 72 ? GREEN : score >= 55 ? AMBER : '#ef4444'
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>{score}</span>
        <span style={{ fontSize: 9, color: T2 }}>w:{weight}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 999, transition: 'width .4s ease' }} />
      </div>
    </div>
  )
}

export function BidsScorecardPage() {
  const qc = useQueryClient()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState({ customerId: '', customerName: '', title: '', tier: 'STANDARD', verticalPack: 'STANDARD' })

  const engQ = useQuery({ queryKey: ['bids-engagements'], queryFn: () => api.get('/admin/kangqore-immp/bids/engagements').then(r => r.data), staleTime: 15_000 })
  const detailQ = useQuery({ queryKey: ['bids-engagement', selectedId], queryFn: () => selectedId ? api.get(`/admin/kangqore-immp/bids/engagements/${selectedId}`).then(r => r.data) : null, enabled: !!selectedId, staleTime: 10_000 })

  const createMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/bids/engagements', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bids-engagements'] }); setForm({ customerId: '', customerName: '', title: '', tier: 'STANDARD', verticalPack: 'STANDARD' }) },
  })
  const scoreMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/bids/engagements/${id}/score-all`, {}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bids-engagements'] }); qc.invalidateQueries({ queryKey: ['bids-engagement', selectedId] }) },
  })

  const engagements: any[] = engQ.data?.engagements ?? []
  const stats              = engQ.data?.stats ?? {}
  const detail             = detailQ.data
  const scores: any[]      = detail?.scores ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S191 · BIDS™ Scorecard Engine</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>16-Pillar Diagnostic Scorecard</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>WAANDA-evaluated scoring · weighted model · pillar dependency graph · Diagnostic Scorecard™ generator</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}>
        {[
          { label: 'Total Engagements', value: stats.total ?? 0, color: BLUE },
          { label: 'Active',            value: stats.active ?? 0, color: GREEN },
          { label: 'Completed',         value: stats.completed ?? 0, color: PURPLE },
          { label: 'Converted',         value: stats.converted ?? 0, color: AMBER },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .08em, color: '#8899aa', marginTop: 5 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: engagement list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
              Engagements ({engagements.length})
            </div>
            {engagements.length === 0 ? (
              <div style={{ padding: 24, color: '#556', fontSize: 13, textAlign: 'center' }}>No engagements yet. Create one below.</div>
            ) : engagements.map((e: any) => (
              <div key={e.id} onClick={() => setSelectedId(e.id === selectedId ? null : e.id)}
                style={{ padding: '12px 18px', borderBottom: '1px solid #1e2a40', cursor: 'pointer', background: e.id === selectedId ? '#1e2d42' : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: '#263250', color: BLUE }}>{e.tier}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: '#1e2d42', color: PURPLE }}>{e.verticalPack}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: e.status === 'COMPLETED' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.10)', color: e.status === 'COMPLETED' ? GREEN : AMBER }}>{e.status}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ccdde0' }}>{e.customerName}</div>
                <div style={{ fontSize: 11, color: '#8899aa' }}>{e.title}</div>
                {e.overallScore != null && (
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: GRADE_COLOR[e.scoreGrade] ?? GREEN, fontVariantNumeric: 'tabular-nums' }}>{e.overallScore}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: GRADE_COLOR[e.scoreGrade] ?? GREEN }}>Grade {e.scoreGrade}</span>
                  </div>
                )}
                {e.overallScore == null && (
                  <button onClick={ev => { ev.stopPropagation(); scoreMut.mutate(e.id) }}
                    disabled={scoreMut.isPending}
                    style={{ marginTop: 6, background: BLUE + '20', border: `1px solid ${BLUE}44`, color: BLUE, padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>
                    {scoreMut.isPending ? 'Scoring…' : '⚡ Run WAANDA Scoring'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Create form */}
          <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>New Engagement</div>
            <input placeholder="Customer ID" value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}
              style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '8px 12px', borderRadius: 7, fontSize: 12, marginBottom: 7, boxSizing: 'border-box' }} />
            <input placeholder="Customer Name" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
              style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '8px 12px', borderRadius: 7, fontSize: 12, marginBottom: 7, boxSizing: 'border-box' }} />
            <input placeholder="Engagement Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '8px 12px', borderRadius: 7, fontSize: 12, marginBottom: 7, boxSizing: 'border-box' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 10 }}>
              <select value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}
                style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '8px 10px', borderRadius: 7, fontSize: 12 }}>
                {['ENTERPRISE', 'STANDARD', 'SMB'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={form.verticalPack} onChange={e => setForm(f => ({ ...f, verticalPack: e.target.value }))}
                style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '8px 10px', borderRadius: 7, fontSize: 12 }}>
                {['STANDARD', 'ARIA', 'LEX', 'FINX'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <button onClick={() => createMut.mutate()} disabled={!form.customerId || !form.customerName || !form.title || createMut.isPending}
              style={{ width: '100%', background: BLUE, border: 'none', color: '#0d1824', padding: 10, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: createMut.isPending ? 0.7 : 1 }}>
              {createMut.isPending ? 'Creating…' : 'Open Engagement'}
            </button>
          </div>
        </div>

        {/* Right: pillar scores */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '13px 18px', borderBottom: '1px solid #263250', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
              {detail ? `${detail.customerName} · 16 Pillars` : 'Select an engagement'}
            </span>
            {detail && detail.overallScore == null && (
              <button onClick={() => scoreMut.mutate(detail.id)} disabled={scoreMut.isPending}
                style={{ background: BLUE + '20', border: `1px solid ${BLUE}44`, color: BLUE, padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>
                {scoreMut.isPending ? 'Scoring…' : '⚡ Run WAANDA Scoring'}
              </button>
            )}
            {detail?.overallScore != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: GRADE_COLOR[detail.scoreGrade] ?? GREEN }}>{detail.overallScore}</span>
                <span style={{ fontSize: 12, fontWeight: 800, padding: '2px 8px', borderRadius: 5, background: (GRADE_COLOR[detail.scoreGrade] ?? GREEN) + '20', color: GRADE_COLOR[detail.scoreGrade] ?? GREEN }}>Grade {detail.scoreGrade}</span>
              </div>
            )}
          </div>
          {scores.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#556', fontSize: 12 }}>
              {detail ? 'Click "Run WAANDA Scoring" to evaluate all 16 pillars.' : 'Select an engagement to view pillar scores.'}
            </div>
          ) : (
            <div style={{ maxHeight: 560, overflowY: 'auto' }}>
              {scores.map((s: any) => (
                <div key={s.id} style={{ padding: '10px 18px', borderBottom: '1px solid #1e2a40' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: (CAT_COLOR[s.pillarCategory] ?? BLUE) + '18', color: CAT_COLOR[s.pillarCategory] ?? BLUE }}>{s.pillarCategory}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0', flex: 1 }}>{s.pillarName}</span>
                    <ScoreBar score={s.score} weight={s.weight} />
                  </div>
                  {s.waandaEvaluation && <div style={{ fontSize: 10, color: '#8899aa', lineHeight: 1.5 }}>{s.waandaEvaluation}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

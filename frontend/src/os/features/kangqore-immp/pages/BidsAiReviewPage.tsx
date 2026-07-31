import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Cpu, AlertTriangle } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function BidsAiReviewPage() {
  const statusQ = useQuery({ queryKey: ['bids-ai-review-status'], queryFn: () => api.get('/admin/kangqore-immp/platform/bids-ai-review-status').then(r => r.data), staleTime: 60_000 })
  const s = statusQ.data

  const [result, setResult] = useState<any>(null)
  const mut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/platform/bids-ai-review', { engagementId: 'demo' }).then(r => r.data),
    onSuccess: (data) => setResult(data),
  })

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S237 · BIDS™ AI Review</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gen5-Powered BIDS™ Review</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Gen5 reviews and challenges BIDS™ findings · contradiction detection across pillars · confidence calibration per pillar score</p>
      </div>

      {/* Status cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Reviews Completed', value: s?.reviewsCompleted ?? '—', color: GREEN },
          { label: 'Avg Gen5 Confidence', value: s?.avgConfidence ? `${s.avgConfidence}%` : '—', color: BLUE },
          { label: 'Pillars Analysed', value: s?.pillarsAnalysed ?? 16, color: PURPLE },
          { label: 'Contradiction Detection', value: s?.contradictionDetection ? 'Live' : '—', color: AMBER },
        ].map(st => (
          <div key={st.label} style={{ background: '#1a2235', border: `1px solid ${st.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: st.color }}>{st.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Capability badges */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { icon: '🧠', label: 'Gen5 Cross-Pillar Analysis', color: PURPLE },
          { icon: '⚠️', label: 'Contradiction Detection', color: AMBER },
          { icon: '📊', label: 'Confidence Calibration', color: BLUE },
          { icon: '🎯', label: '50-Engagement Baseline', color: GREEN },
        ].map(b => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 6, background: b.color + '10', border: `1px solid ${b.color}28`, borderRadius: 8, padding: '7px 14px' }}>
            <span style={{ fontSize: 13 }}>{b.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: b.color }}>{b.label}</span>
          </div>
        ))}
      </div>

      {/* Run review button */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Cpu size={16} color={PURPLE} />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Run Gen5 AI Review</span>
          </div>
          <div style={{ fontSize: 11, color: '#8899aa' }}>Gen5 will analyse all 16 pillars, detect contradictions, and calibrate confidence scores against the engagement corpus.</div>
        </div>
        <button
          onClick={() => mut.mutate()}
          disabled={mut.isPending}
          style={{ background: PURPLE, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 12, fontWeight: 800, cursor: mut.isPending ? 'not-allowed' : 'pointer', opacity: mut.isPending ? 0.6 : 1, flexShrink: 0 }}
        >
          {mut.isPending ? 'Reviewing…' : 'Run AI Review'}
        </button>
      </div>

      {/* Review results */}
      {result && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Gen5 Review Results</span>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 11, color: PURPLE, fontWeight: 700 }}>Confidence: {result.overallConfidence}%</span>
              {result.contradictionCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={12} color={AMBER} />
                  <span style={{ fontSize: 11, color: AMBER, fontWeight: 700 }}>{result.contradictionCount} contradictions</span>
                </div>
              )}
            </div>
          </div>
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {result.pillarReviews?.map((p: any, i: number) => (
              <div key={p.pillar} style={{ padding: '10px 20px', borderBottom: i < result.pillarReviews.length - 1 ? '1px solid #1e2a40' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0', flex: 1 }}>{p.pillar}</span>
                  <span style={{ fontSize: 10, color: '#8899aa' }}>Score: <span style={{ color: BLUE }}>{p.originalScore}</span> → <span style={{ color: GREEN }}>{p.calibratedScore}</span></span>
                  <span style={{ fontSize: 10, color: PURPLE }}>Gen5: {p.gen5Confidence}%</span>
                </div>
                {p.contradictions?.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {p.contradictions.map((c: string) => (
                      <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: AMBER }}>
                        <AlertTriangle size={9} color={AMBER} />
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

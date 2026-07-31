import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, BookOpen } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function BidsFiftyEngagementPage() {
  const q = useQuery({ queryKey: ['bids-fifty'], queryFn: () => api.get('/admin/kangqore-immp/platform/bids-fifty-engagement').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S240 · BIDS™ 50-Engagement Milestone</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>50 BIDS™ Engagements · Milestone Reached</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Cross-engagement learnings feed Gen5 corpus · case study library published · corpus contributions confirmed</p>
      </div>

      {/* Milestone hero */}
      <div style={{ background: `linear-gradient(135deg, ${AMBER}12, ${GREEN}08)`, border: `1px solid ${AMBER}35`, borderRadius: 16, padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ textAlign: 'center', minWidth: 90 }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: AMBER, lineHeight: 1 }}>{d?.totalEngagements ?? 51}</div>
          <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>Total Engagements</div>
        </div>
        <div style={{ height: 60, width: 1, background: '#263250' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1 }}>
          {[
            { label: 'Completed', value: d?.completed ?? 42, color: GREEN },
            { label: 'Active', value: d?.active ?? 9, color: BLUE },
            { label: 'Gen5 Corpus Contributions', value: d?.gen5CorpusContributions ?? 51, color: PURPLE },
            { label: 'Milestone Reached', value: d?.milestoneReached ? '✓ Yes' : 'Pending', color: AMBER },
          ].map(st => (
            <div key={st.label}>
              <div style={{ fontSize: 18, fontWeight: 900, color: st.color }}>{st.value}</div>
              <div style={{ fontSize: 10, color: '#8899aa' }}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Corpus learnings */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={14} color={PURPLE} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Cross-Engagement Corpus Learnings</span>
        </div>
        {(d?.corpusLearnings ?? []).map((l: any, i: number) => {
          const weightColor = l.weight === 'Critical' ? AMBER : l.weight === 'High' ? GREEN : BLUE
          return (
            <div key={l.category} style={{ padding: '12px 20px', borderBottom: i < (d?.corpusLearnings?.length ?? 6) - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <span style={{ fontSize: 9, fontWeight: 900, padding: '3px 8px', borderRadius: 4, background: weightColor + '18', color: weightColor, flexShrink: 0, marginTop: 2 }}>{l.weight}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ccdde0', marginBottom: 2 }}>{l.category}</div>
                <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.5 }}>{l.insight}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Case studies */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Case Study Library (Featured)</div>
        {(d?.caseStudies ?? []).map((cs: any, i: number) => (
          <div key={cs.client} style={{ padding: '14px 20px', borderBottom: i < (d?.caseStudies?.length ?? 3) - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#ccdde0', marginBottom: 2 }}>{cs.client}</div>
              <div style={{ fontSize: 11, color: '#8899aa' }}>{cs.sector} · {cs.timeframe} · {cs.primaryGain}</div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: AMBER, fontWeight: 700 }}>{cs.before}</div>
                <div style={{ fontSize: 9, color: '#8899aa' }}>Before</div>
              </div>
              <div style={{ fontSize: 12, color: '#4a5568' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: GREEN, fontWeight: 700 }}>{cs.after}</div>
                <div style={{ fontSize: 9, color: '#8899aa' }}>After</div>
              </div>
              <div style={{ marginLeft: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: GREEN }}>{cs.blueprintROI}</div>
                <div style={{ fontSize: 9, color: '#8899aa' }}>Blueprint ROI</div>
              </div>
              <CheckCircle2 size={14} color={GREEN} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const DELIVERABLE_ICONS: Record<string, string> = {
  DIAGNOSTIC_SCORECARD: '📊', EXEC_REPORT: '📋', TRANSFORMATION_BLUEPRINT: '🗺️',
  RISK_REGISTER: '⚠️', OPPORTUNITY_REGISTER: '💡', SERVICE_PRESCRIPTION: '💊',
  ROADMAP_30: '📅', ROADMAP_60: '📅', ROADMAP_90: '📅', ROADMAP_180: '📅',
}

const DELIVERABLE_COLOR: Record<string, string> = {
  DIAGNOSTIC_SCORECARD: '#4fc3f7', EXEC_REPORT: '#a78bfa', TRANSFORMATION_BLUEPRINT: '#10b981',
  RISK_REGISTER: '#ef4444', OPPORTUNITY_REGISTER: '#00ddaa', SERVICE_PRESCRIPTION: '#f97316',
  ROADMAP_30: '#f59e0b', ROADMAP_60: '#f59e0b', ROADMAP_90: '#f59e0b', ROADMAP_180: '#f59e0b',
}

export function BidsReportGeneratorPage() {
  const qc = useQueryClient()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [previewDel, setPreviewDel] = useState<any>(null)

  const engQ  = useQuery({ queryKey: ['bids-engagements'], queryFn: () => api.get('/admin/kangqore-immp/bids/engagements').then(r => r.data), staleTime: 15_000 })
  const delQ  = useQuery({ queryKey: ['bids-deliverables', selectedId], queryFn: () => selectedId ? api.get(`/admin/kangqore-immp/bids/deliverables/${selectedId}`).then(r => r.data) : null, enabled: !!selectedId, staleTime: 10_000 })

  const genMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/bids/engagements/${id}/generate-all`, {}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bids-deliverables', selectedId] }); qc.invalidateQueries({ queryKey: ['bids-engagements'] }) },
  })

  const engagements: any[] = engQ.data?.engagements ?? []
  const deliverables: any[] = delQ.data ?? []
  const selectedEng = engagements.find((e: any) => e.id === selectedId)
  const complete    = deliverables.filter((d: any) => d.status === 'COMPLETE').length

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1200 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S192 · Executive Report Generator</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>WAANDA Deliverable Suite</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>10 deliverables · WAANDA-authored · Exec Report · Transformation Blueprint · Risk + Opportunity Registers</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        {/* Engagement selector */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
            Engagements
          </div>
          {engagements.map((e: any) => (
            <div key={e.id} onClick={() => { setSelectedId(e.id); setPreviewDel(null) }}
              style={{ padding: '11px 16px', borderBottom: '1px solid #1e2a40', cursor: 'pointer', background: e.id === selectedId ? '#1e2d42' : undefined }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0', marginBottom: 3 }}>{e.customerName}</div>
              <div style={{ fontSize: 10, color: '#8899aa' }}>{e.tier} · {e.verticalPack}</div>
              {e.overallScore != null && (
                <div style={{ fontSize: 11, fontWeight: 800, color: GREEN, marginTop: 4 }}>{e.overallScore}/100 · Grade {e.scoreGrade}</div>
              )}
              {e.overallScore == null && <div style={{ fontSize: 10, color: AMBER, marginTop: 4 }}>⚠ Score first</div>}
            </div>
          ))}
          {engagements.length === 0 && <div style={{ padding: 20, color: '#556', fontSize: 12 }}>No engagements.</div>}
        </div>

        {/* Deliverables panel */}
        <div>
          {selectedId && selectedEng ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{selectedEng.customerName}</div>
                  <div style={{ fontSize: 11, color: '#8899aa' }}>{complete}/10 deliverables complete</div>
                </div>
                {selectedEng.overallScore != null && complete < 10 && (
                  <button onClick={() => genMut.mutate(selectedId)} disabled={genMut.isPending}
                    style={{ background: PURPLE, border: 'none', color: '#fff', padding: '9px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, opacity: genMut.isPending ? 0.7 : 1 }}>
                    {genMut.isPending ? 'WAANDA generating…' : '⚡ Generate All 10 Deliverables'}
                  </button>
                )}
                {complete === 10 && <span style={{ fontSize: 11, fontWeight: 800, color: GREEN, padding: '4px 12px', borderRadius: 20, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>✓ All Deliverables Complete</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {deliverables.map((d: any) => (
                  <div key={d.id} onClick={() => d.status === 'COMPLETE' ? setPreviewDel(previewDel?.id === d.id ? null : d) : undefined}
                    style={{ background: '#1a2235', border: `1px solid ${d.status === 'COMPLETE' ? (DELIVERABLE_COLOR[d.type] ?? BLUE) + '40' : '#263250'}`, borderRadius: 10, padding: '14px 16px', cursor: d.status === 'COMPLETE' ? 'pointer' : 'default' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 18 }}>{DELIVERABLE_ICONS[d.type] ?? '📄'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: d.status === 'COMPLETE' ? '#ccdde0' : '#8899aa' }}>{d.label}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, marginTop: 2, color: d.status === 'COMPLETE' ? GREEN : AMBER }}>
                          {d.status === 'COMPLETE' ? '✓ Complete' : 'Pending'}
                        </div>
                      </div>
                    </div>
                    {d.status === 'COMPLETE' && previewDel?.id === d.id && d.content && (
                      <div style={{ marginTop: 8, padding: '10px 12px', background: '#0f1828', borderRadius: 7, border: '1px solid #1e2a40' }}>
                        <pre style={{ fontSize: 10, color: '#8899aa', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.5, maxHeight: 200, overflowY: 'auto', margin: 0 }}>
                          {JSON.stringify(d.content, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#556', fontSize: 13 }}>
              Select an engagement to view its deliverables.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const DELIVERABLE_LABELS: Record<string, string> = {
  DIAGNOSTIC_SCORECARD: 'Diagnostic Scorecard™', EXEC_REPORT: 'Executive Intelligence Report™',
  TRANSFORMATION_BLUEPRINT: 'Transformation Blueprint™', RISK_REGISTER: 'Risk Register™',
  OPPORTUNITY_REGISTER: 'Opportunity Register™', SERVICE_PRESCRIPTION: 'Service Prescription Matrix™',
  ROADMAP_30: '30-Day Roadmap™', ROADMAP_60: '60-Day Roadmap™', ROADMAP_90: '90-Day Roadmap™', ROADMAP_180: '180-Day Roadmap™',
}

export function BidsClientPortalPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [briefingForm, setBriefingForm] = useState({ date: '', attendees: '', agenda: '' })

  const engQ  = useQuery({ queryKey: ['bids-engagements'], queryFn: () => api.get('/admin/kangqore-immp/bids/engagements').then(r => r.data), staleTime: 15_000 })
  const delQ  = useQuery({ queryKey: ['bids-deliverables', selectedId], queryFn: () => selectedId ? api.get(`/admin/kangqore-immp/bids/deliverables/${selectedId}`).then(r => r.data) : null, enabled: !!selectedId, staleTime: 15_000 })

  const engagements: any[] = engQ.data?.engagements ?? []
  const deliverables: any[] = delQ.data ?? []
  const selectedEng = engagements.find((e: any) => e.id === selectedId)
  const complete = deliverables.filter((d: any) => d.status === 'COMPLETE').length
  const progress = deliverables.length > 0 ? Math.round((complete / deliverables.length) * 100) : 0

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S193 · Client Engagement Portal</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>BIDS™ Client Portal</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Live assessment progress · deliverable status · secure report sharing · executive briefing scheduler</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Client Accounts</div>
            {engagements.map((e: any) => (
              <div key={e.id} onClick={() => setSelectedId(e.id === selectedId ? null : e.id)}
                style={{ padding: '12px 16px', borderBottom: '1px solid #1e2a40', cursor: 'pointer', background: e.id === selectedId ? 'rgba(79,195,247,0.06)' : undefined }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0' }}>{e.customerName}</div>
                <div style={{ fontSize: 10, color: '#8899aa', marginTop: 2 }}>{e.tier} · {e.verticalPack}</div>
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, height: 3, background: '#263250', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${e.deliverables?.filter((d: any) => d.status === 'COMPLETE').length / Math.max(e.deliverables?.length, 1) * 100}%`, background: e.status === 'COMPLETED' ? GREEN : BLUE, borderRadius: 999 }} />
                  </div>
                  <span style={{ fontSize: 9, color: '#8899aa' }}>{e.deliverables?.filter((d: any) => d.status === 'COMPLETE').length ?? 0}/10</span>
                </div>
              </div>
            ))}
            {engagements.length === 0 && <div style={{ padding: 20, color: '#556', fontSize: 12 }}>No client engagements.</div>}
          </div>
        </div>

        {/* Main */}
        {selectedEng ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Header */}
            <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{selectedEng.customerName}</div>
                  <div style={{ fontSize: 12, color: '#8899aa' }}>{selectedEng.title}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 20, background: '#263250', color: BLUE }}>{selectedEng.tier}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 20, background: '#263250', color: PURPLE }}>{selectedEng.verticalPack}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 20, background: selectedEng.status === 'COMPLETED' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.10)', color: selectedEng.status === 'COMPLETED' ? GREEN : AMBER }}>{selectedEng.status}</span>
                  </div>
                </div>
                {selectedEng.overallScore != null && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: GREEN, lineHeight: 1 }}>{selectedEng.overallScore}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#8899aa', marginTop: 2 }}>Grade {selectedEng.scoreGrade}</div>
                  </div>
                )}
              </div>
              {/* Progress bar */}
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#8899aa' }}>Engagement Progress</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: BLUE }}>{progress}%</span>
                </div>
                <div style={{ height: 6, background: '#263250', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${BLUE}, ${GREEN})`, borderRadius: 999, transition: 'width .5s ease' }} />
                </div>
              </div>
            </div>

            {/* Deliverable status timeline */}
            <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '13px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
                Deliverable Status · {complete}/10 Complete
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0 }}>
                {deliverables.map((d: any, i: number) => (
                  <div key={d.id} style={{ padding: '12px 18px', borderBottom: i < deliverables.length - 2 ? '1px solid #1e2a40' : undefined, borderRight: i % 2 === 0 ? '1px solid #1e2a40' : undefined, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: d.status === 'COMPLETE' ? 'rgba(16,185,129,0.12)' : '#263250', border: `1px solid ${d.status === 'COMPLETE' ? 'rgba(16,185,129,0.3)' : '#3a4a60'}` }}>
                      <span style={{ fontSize: 12 }}>{d.status === 'COMPLETE' ? '✓' : '○'}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: d.status === 'COMPLETE' ? '#ccdde0' : '#8899aa' }}>{DELIVERABLE_LABELS[d.type] ?? d.label}</div>
                      {d.generatedAt && <div style={{ fontSize: 9, color: '#556', marginTop: 2 }}>{new Date(d.generatedAt).toLocaleDateString()}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Executive Briefing Scheduler */}
            <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Schedule Executive Briefing</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input type="date" value={briefingForm.date} onChange={e => setBriefingForm(f => ({ ...f, date: e.target.value }))}
                  style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '8px 12px', borderRadius: 7, fontSize: 12 }} />
                <input placeholder="Attendees (names/emails)" value={briefingForm.attendees} onChange={e => setBriefingForm(f => ({ ...f, attendees: e.target.value }))}
                  style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '8px 12px', borderRadius: 7, fontSize: 12 }} />
              </div>
              <input placeholder="Agenda focus areas" value={briefingForm.agenda} onChange={e => setBriefingForm(f => ({ ...f, agenda: e.target.value }))}
                style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '8px 12px', borderRadius: 7, fontSize: 12, marginTop: 8, marginBottom: 10, boxSizing: 'border-box' }} />
              <button onClick={() => setBriefingForm({ date: '', attendees: '', agenda: '' })}
                style={{ background: BLUE, border: 'none', color: '#0d1824', padding: '9px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                Schedule Briefing
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#556', fontSize: 13 }}>
            Select a client account to view their portal.
          </div>
        )}
      </div>
    </div>
  )
}

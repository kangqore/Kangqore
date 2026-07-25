import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const ROADMAP_TABS = [
  { key: 'ROADMAP_30',  label: '30-Day',  color: AMBER },
  { key: 'ROADMAP_60',  label: '60-Day',  color: '#f97316' },
  { key: 'ROADMAP_90',  label: '90-Day',  color: '#ef4444' },
  { key: 'ROADMAP_180', label: '180-Day', color: PURPLE },
]

export function BidsBlueprintPrescriptionPage() {
  const qc = useQueryClient()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [roadmapTab, setRoadmapTab] = useState('ROADMAP_30')

  const engQ = useQuery({ queryKey: ['bids-engagements'], queryFn: () => api.get('/admin/kangqore-immp/bids/engagements').then(r => r.data), staleTime: 15_000 })
  const delQ = useQuery({ queryKey: ['bids-deliverables', selectedId], queryFn: () => selectedId ? api.get(`/admin/kangqore-immp/bids/deliverables/${selectedId}`).then(r => r.data) : null, enabled: !!selectedId, staleTime: 15_000 })

  const convertMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/bids/engagements/${id}/convert-to-blueprint`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bids-engagements'] }),
  })

  const engagements: any[]  = engQ.data?.engagements ?? []
  const deliverables: any[] = delQ.data ?? []
  const selectedEng = engagements.find((e: any) => e.id === selectedId)

  const getDeliverable = (type: string) => deliverables.find((d: any) => d.type === type && d.status === 'COMPLETE')
  const prescription   = getDeliverable('SERVICE_PRESCRIPTION')
  const roadmapDel     = getDeliverable(roadmapTab)

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S194 · Blueprint Prescription</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Diagnostic → Blueprint Mapping</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Service Prescription Matrix™ · 30/60/90/180-Day Roadmap™ builder · convert BIDS client to Blueprint customer</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
        {/* Sidebar */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
            Completed Engagements
          </div>
          {engagements.filter((e: any) => e.status === 'COMPLETED').map((e: any) => (
            <div key={e.id} onClick={() => setSelectedId(e.id === selectedId ? null : e.id)}
              style={{ padding: '12px 16px', borderBottom: '1px solid #1e2a40', cursor: 'pointer', background: e.id === selectedId ? 'rgba(245,158,11,0.06)' : undefined }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0' }}>{e.customerName}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: GREEN }}>{e.overallScore}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#8899aa' }}>Grade {e.scoreGrade}</span>
              </div>
              {e.convertedToBlueprint && <div style={{ fontSize: 10, fontWeight: 800, color: GREEN, marginTop: 4 }}>✓ Blueprint Customer</div>}
            </div>
          ))}
          {engagements.filter((e: any) => e.status === 'COMPLETED').length === 0 && (
            <div style={{ padding: 20, color: '#556', fontSize: 12 }}>Complete engagements will appear here.</div>
          )}
        </div>

        {/* Main */}
        {selectedEng ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Header */}
            <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>{selectedEng.customerName}</div>
                <div style={{ fontSize: 11, color: '#8899aa', marginTop: 2 }}>BIDS™ Score: {selectedEng.overallScore}/100 · Grade {selectedEng.scoreGrade} · {selectedEng.verticalPack} Pack</div>
              </div>
              {!selectedEng.convertedToBlueprint ? (
                <button onClick={() => convertMut.mutate(selectedEng.id)} disabled={convertMut.isPending}
                  style={{ background: GREEN, border: 'none', color: '#fff', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 700, opacity: convertMut.isPending ? 0.7 : 1 }}>
                  {convertMut.isPending ? 'Converting…' : '→ Convert to Blueprint Customer'}
                </button>
              ) : (
                <div style={{ fontSize: 12, fontWeight: 800, color: GREEN, padding: '8px 16px', borderRadius: 10, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  ✓ Blueprint Customer
                </div>
              )}
            </div>

            {/* Service Prescription Matrix */}
            {prescription?.content?.prescriptions ? (
              <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '13px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Service Prescription Matrix™
                </div>
                {prescription.content.prescriptions.map((p: any, i: number) => (
                  <div key={i} style={{ padding: '14px 18px', borderBottom: '1px solid #1e2a40' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#ccdde0' }}>{p.pillar}</span>
                        <span style={{ fontSize: 9, marginLeft: 8, padding: '2px 7px', borderRadius: 4, background: 'rgba(79,195,247,0.12)', color: BLUE }}>{p.kangqoreModule}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: GREEN }}>{p.expectedROI}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#8899aa' }}>Blueprint Pack: <span style={{ color: '#ccdde0', fontWeight: 600 }}>{p.blueprint}</span></div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 20, background: '#1a2235', border: '1px solid #263250', borderRadius: 12, color: '#556', fontSize: 13, textAlign: 'center' }}>
                Generate all deliverables to see the Service Prescription Matrix™.
              </div>
            )}

            {/* Roadmap tabs */}
            <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #263250' }}>
                {ROADMAP_TABS.map(t => (
                  <button key={t.key} onClick={() => setRoadmapTab(t.key)}
                    style={{ flex: 1, padding: '11px 0', background: roadmapTab === t.key ? t.color + '14' : 'transparent', border: 'none', borderBottom: roadmapTab === t.key ? `2px solid ${t.color}` : '2px solid transparent', color: roadmapTab === t.key ? t.color : '#8899aa', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all .15s' }}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div style={{ padding: '18px 20px' }}>
                {roadmapDel?.content ? (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ccdde0', marginBottom: 10 }}>{roadmapDel.content.horizon} Horizon</div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Objectives</div>
                      {roadmapDel.content.objectives?.map((o: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: GREEN }}>→</span>
                          <span style={{ fontSize: 11, color: '#ccdde0' }}>{o}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Milestones</div>
                      {roadmapDel.content.milestones?.map((m: any, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 5, background: AMBER + '18', color: AMBER, minWidth: 50, textAlign: 'center' }}>Day {m.day}</span>
                          <span style={{ fontSize: 11, color: '#ccdde0' }}>{m.action}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ color: '#556', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>Generate deliverables to view roadmap.</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#556', fontSize: 13 }}>
            Select a completed engagement to view prescriptions.
          </div>
        )}
      </div>
    </div>
  )
}

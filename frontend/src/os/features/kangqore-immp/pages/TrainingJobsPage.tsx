import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Cpu, Play, ChevronDown } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const PURPLE = '#a78bfa'

const STATUS_COLORS: Record<string, string> = {
  QUEUED: '#94a3b8', RUNNING: '#3b82f6', COMPLETED: '#10b981', FAILED: '#ef4444', CANCELLED: '#6b7280',
}

export function TrainingJobsPage() {
  const qc = useQueryClient()
  const [versionsOpen, setVersionsOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<string>('')
  const jobsQ    = useQuery({ queryKey: ['training-jobs'], queryFn: () => api.get('/admin/kangqore-immp/gen4/training/jobs').then(r => r.data), staleTime: 20_000 })
  const versionsQ = useQuery({ queryKey: ['dataset-versions'], queryFn: () => api.get('/admin/kangqore-immp/gen4/dataset/versions').then(r => r.data), staleTime: 60_000 })
  const createM = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen4/training/create', { datasetVersionId: selectedVersion || undefined, loraRank: 16, batchSize: 8, epochs: 3, learningRate: 0.0002 }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['training-jobs'] }),
  })
  const runM = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/gen4/training/${id}/run`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['training-jobs'] }),
  })
  const jobs: any[] = jobsQ.data ?? []
  const versions: any[] = versionsQ.data ?? []

  return (
    <div style={{ maxWidth: 920 }} className="space-y-6">
      <div style={{ padding: '22px 26px', borderRadius: 16, background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Cpu style={{ width: 28, height: 28, color: PURPLE }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>S160–S161 — Training Jobs</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>Llama 3.1 8B fine-tune · LoRA adapters · RunPod GPU · checkpoint management</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>{jobs.filter(j => j.status === 'COMPLETED').length}</div>
          <div style={{ fontSize: 10, color: T2, fontWeight: 600 }}>Completed</div>
        </div>
      </div>

      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '20px', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T2, marginBottom: 6 }}>Dataset Version</div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setVersionsOpen(o => !o)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BDR}`, color: T1, fontSize: 12, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {selectedVersion ? versions.find(v => v.id === selectedVersion)?.version ?? 'Selected' : 'No dataset (optional)'}
              <ChevronDown style={{ width: 14, height: 14 }} />
            </button>
            {versionsOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: CARD, border: `1px solid ${BDR}`, borderRadius: 8, marginTop: 4, zIndex: 20 }}>
                <div onClick={() => { setSelectedVersion(''); setVersionsOpen(false) }} style={{ padding: '8px 14px', fontSize: 12, color: T2, cursor: 'pointer' }}>None</div>
                {versions.map(v => (
                  <div key={v.id} onClick={() => { setSelectedVersion(v.id); setVersionsOpen(false) }} style={{ padding: '8px 14px', fontSize: 12, color: T1, cursor: 'pointer', borderTop: `1px solid ${BDR}` }}>
                    {v.version} — {v.totalRecords} records
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button onClick={() => createM.mutate()} disabled={createM.isPending} style={{ padding: '10px 22px', borderRadius: 10, background: PURPLE, color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {createM.isPending ? 'Creating…' : 'New Training Job'}
        </button>
      </div>

      {jobs.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>Training Jobs</div>
          {jobs.map((j: any, i: number) => (
            <div key={j.id} style={{ padding: '16px 20px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: PURPLE }}>{j.jobRef}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: STATUS_COLORS[j.status] + '15', color: STATUS_COLORS[j.status], border: `1px solid ${STATUS_COLORS[j.status]}25` }}>{j.status}</span>
                  <span style={{ fontSize: 10, color: T2 }}>{j.baseModel} · {j.provider}</span>
                </div>
                <div style={{ fontSize: 11, color: T2, fontVariantNumeric: 'tabular-nums' }}>
                  LoRA rank {j.loraRank} · batch {j.batchSize} · {j.epochs} epochs · lr {j.learningRate}
                  {j.datasetVersion && ` · ${j.datasetVersion.version}`}
                </div>
                {j.status === 'COMPLETED' && (
                  <div style={{ fontSize: 11, color: '#10b981', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                    Train loss {j.trainLoss} · Val loss {j.valLoss} · Perplexity {j.perplexity} · ${j.costUsd} · {j.durationMinutes}min
                  </div>
                )}
                {j.checkpointPath && <div style={{ fontSize: 10, color: T2, marginTop: 2 }}>📦 {j.checkpointPath}</div>}
                {j.evalResults?.length > 0 && <div style={{ fontSize: 10, color: '#10b981', marginTop: 4 }}>Parity: {(j.evalResults[0].parityScore * 100).toFixed(1)}% {j.evalResults[0].passedThreshold ? '✓' : ''}</div>}
              </div>
              {j.status === 'QUEUED' && (
                <button onClick={() => runM.mutate(j.id)} disabled={runM.isPending} style={{ padding: '7px 14px', borderRadius: 8, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <Play style={{ width: 12, height: 12 }} /> Run Alpha Training
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

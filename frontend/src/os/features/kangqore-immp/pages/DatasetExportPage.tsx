import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { FileJson, Upload, CheckCircle2 } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const PURPLE = '#a78bfa'

export function DatasetExportPage() {
  const qc = useQueryClient()
  const [changelog, setChangelog] = useState('')
  const versionsQ = useQuery({ queryKey: ['dataset-versions'], queryFn: () => api.get('/admin/kangqore-immp/gen4/dataset/versions').then(r => r.data), staleTime: 30_000 })
  const exportM = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen4/dataset/export', { changelog }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dataset-versions'] }),
  })
  const pushM = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/gen4/dataset/${id}/push-hf`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dataset-versions'] }),
  })
  const versions: any[] = versionsQ.data ?? []

  return (
    <div style={{ maxWidth: 920 }} className="space-y-6">
      <div style={{ padding: '22px 26px', borderRadius: 16, background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FileJson style={{ width: 28, height: 28, color: PURPLE }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>S159 — Training Dataset Pipeline</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>JSONL versioned export · 80/10/10 train/val/test split · Hugging Face push</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: PURPLE, fontVariantNumeric: 'tabular-nums' }}>{versions.length}</div>
          <div style={{ fontSize: 10, color: T2, fontWeight: 600 }}>Versions</div>
        </div>
      </div>

      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '20px' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: T1, marginBottom: 14 }}>Export New Version</div>
        <textarea
          value={changelog}
          onChange={e => setChangelog(e.target.value)}
          placeholder="Changelog notes for this export (optional)…"
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BDR}`, color: T1, fontSize: 12, resize: 'vertical', minHeight: 72, fontFamily: 'inherit' }}
        />
        <button onClick={() => exportM.mutate()} disabled={exportM.isPending} style={{ marginTop: 12, padding: '10px 22px', borderRadius: 10, background: PURPLE, color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          {exportM.isPending ? 'Exporting…' : 'Export Dataset'}
        </button>
        {exportM.isError && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 8 }}>{(exportM.error as any)?.response?.data?.error}</p>}
      </div>

      {versions.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>Dataset Versions</div>
          {versions.map((v: any, i: number) => (
            <div key={v.id} style={{ padding: '16px 20px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: PURPLE }}>{v.version}</span>
                  {v.hfPushed && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>HF Pushed</span>}
                </div>
                <div style={{ fontSize: 11, color: T2, fontVariantNumeric: 'tabular-nums' }}>
                  {v.totalRecords.toLocaleString()} records · {v.trainCount} train / {v.valCount} val / {v.testCount} test · {(v.totalTokens ?? 0).toLocaleString()} tokens
                </div>
                {v.changelog && <div style={{ fontSize: 11, color: T2, marginTop: 4 }}>{v.changelog}</div>}
                {v.hfRepoId && <div style={{ fontSize: 10, color: '#10b981', marginTop: 4 }}>📦 {v.hfRepoId}</div>}
                {v.trainingJobs?.length > 0 && <div style={{ fontSize: 10, color: T2, marginTop: 4 }}>{v.trainingJobs.length} training job(s)</div>}
              </div>
              {!v.hfPushed ? (
                <button onClick={() => pushM.mutate(v.id)} disabled={pushM.isPending} style={{ padding: '7px 14px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Upload style={{ width: 12, height: 12 }} /> Push to HF
                </button>
              ) : (
                <CheckCircle2 style={{ width: 18, height: 18, color: '#10b981', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

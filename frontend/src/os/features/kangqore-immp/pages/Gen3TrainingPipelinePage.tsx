import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Zap } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'
const STATUS_COLOR: Record<string, string> = { COMPLETE: GREEN, LIVE: BLUE, ACTIVE: AMBER }

export function Gen3TrainingPipelinePage() {
  const q = useQuery({ queryKey: ['gen3-training-pipeline'], queryFn: () => api.get('/admin/kangqore-immp/platform/gen3-training-pipeline').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S260 · Gen3 Training Pipeline</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gen3 Training Pipeline — 70B Model on Kangqore Operational Corpus</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{(d?.totalCorpusRecords ?? 56200000).toLocaleString()} total training records · {d?.gpuCluster ?? '512× H100'} · {d?.trainingDaysTotal ?? 21} training days</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Model Parameters', value: d?.modelParams ?? '70B',                                            color: PURPLE },
          { label: 'Corpus Records',   value: `${((d?.totalCorpusRecords ?? 56200000) / 1e6).toFixed(1)}M`,      color: BLUE   },
          { label: 'GPU Cluster',      value: d?.gpuCluster ?? '512× H100',                                       color: GREEN  },
          { label: 'Checkpoint',       value: d?.checkpointVersion ?? 'gen3-v1.0',                                 color: AMBER  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {(d?.stages ?? []).map((stage: any, i: number) => {
          const accent = STATUS_COLOR[stage.status] ?? '#4a5568'
          const isLast = i === (d?.stages?.length ?? 8) - 1
          return (
            <div key={stage.stage} style={{ background: '#1a2235', border: `1px solid ${accent}20`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: `${accent}14`, border: `1.5px solid ${accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {stage.status === 'LIVE' || stage.status === 'ACTIVE'
                  ? <Zap size={13} color={accent} />
                  : <CheckCircle2 size={13} color={accent} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0' }}>{i + 1}. {stage.stage}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: `${accent}18`, color: accent }}>{stage.status}</span>
                  {isLast && <span style={{ fontSize: 9, fontWeight: 800, color: BLUE, background: `${BLUE}14`, border: `1px solid ${BLUE}28`, borderRadius: 4, padding: '2px 7px' }}>PRODUCTION</span>}
                </div>
                <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.5 }}>{stage.desc}</div>
              </div>
              {stage.records > 0 && (
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: accent, fontVariantNumeric: 'tabular-nums' }}>{(stage.records / 1e6).toFixed(1)}M</div>
                  <div style={{ fontSize: 9, color: '#4a5568' }}>records</div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {d?.continuousTraining && (
        <div style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}25`, borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={14} color={GREEN} />
          <span style={{ fontSize: 12, color: '#8899aa' }}>Continuous training active · cadence: <span style={{ color: GREEN, fontWeight: 700 }}>{d?.retrainingCadence ?? 'Weekly incremental checkpoint'}</span></span>
        </div>
      )}
    </div>
  )
}

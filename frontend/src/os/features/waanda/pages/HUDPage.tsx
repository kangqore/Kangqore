import { useQuery }   from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api }         from '@lib/api'

const BASE   = '/kangqore-view/admin/WAANDA'
const surface = 'rgba(255,255,255,0.04)'
const border  = '1px solid rgba(255,255,255,0.08)'

const STAGE_META = [
  { path: 'observe',    label: 'Observe',    question: 'What is happening?',   color: '#2564ea' },
  { path: 'understand', label: 'Understand', question: 'Why is it happening?', color: '#7c3aed' },
  { path: 'decide',     label: 'Decide',     question: 'What should we do?',   color: '#0891b2' },
  { path: 'act',        label: 'Act',        question: 'What are we doing?',   color: '#10b981' },
  { path: 'learn',      label: 'Learn',      question: 'What did we learn?',   color: '#f59e0b' },
]

function phaseColor(status: string) {
  if (status === 'ok')    return '#10b981'
  if (status === 'warn')  return '#f59e0b'
  if (status === 'error') return '#f43f5e'
  return '#6b7280'
}

export function HUDPage() {
  const navigate = useNavigate()

  const health = useQuery({
    queryKey:  ['waanda-health'],
    queryFn:   () => api.get('/admin/waanda/health').then(r => r.data),
    staleTime: 30_000,
  })

  const status = useQuery({
    queryKey:  ['waanda-status'],
    queryFn:   () => api.get('/admin/waanda/status').then(r => r.data),
    staleTime: 30_000,
  })

  const pipeline = useQuery({
    queryKey:  ['waanda-pipeline'],
    queryFn:   () => api.get('/admin/waanda/pipeline').then(r => r.data),
    staleTime: 60_000,
  })

  const domains = useQuery({
    queryKey:  ['waanda-domains'],
    queryFn:   () => api.get('/admin/waanda/domains').then(r => r.data),
    staleTime: 60_000,
  })

  const phases: any[]  = status.data?.phases ?? []
  const okCount        = phases.filter(p => p.status === 'ok').length
  const capacity       = phases.length > 0 ? Math.round((okCount / phases.length) * 100) : 0
  const pipelineStages: any[] = pipeline.data?.pipeline ?? []
  const domainList: any[]     = domains.data?.domains  ?? []
  const isOperational = health.data?.status === 'OPERATIONAL'

  return (
    <div className="space-y-8">

      {/* ── Identity + status bar ───────────────────────────────────────────── */}
      <div
        style={{ background: surface, border, borderRadius: 16, padding: '24px 28px' }}
        className="flex items-start justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-[10px] font-mono tracking-[0.25em] uppercase px-2.5 py-1 rounded-full"
              style={{
                background: isOperational ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                color:      isOperational ? '#10b981' : '#f59e0b',
              }}
            >
              {health.data?.status ?? 'LOADING'}
            </span>
            <span className="text-[11px] text-white/30 font-mono">
              {health.data?.bootedAt ? `booted ${new Date(health.data.bootedAt).toLocaleTimeString()}` : ''}
            </span>
          </div>
          <div className="text-white/90 text-lg font-light leading-snug">
            {health.data?.fullName ?? 'Kangqore Enterprise Cognitive Operating System'}
          </div>
          <div className="text-white/30 text-sm mt-1">
            {pipeline.data?.rule ?? ''}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div
            className="text-4xl font-light mb-1"
            style={{ color: capacity >= 90 ? '#10b981' : capacity >= 60 ? '#f59e0b' : '#f43f5e' }}
          >
            {capacity}%
          </div>
          <div className="text-[11px] text-white/30">{okCount} / {phases.length} phases</div>
        </div>
      </div>

      {/* ── Cognitive pipeline — 5 stage cards ─────────────────────────────── */}
      <div>
        <div className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-4">
          Cognitive Pipeline
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {STAGE_META.map((meta, i) => {
            const pipelineStage = pipelineStages.find((s: any) => s.stage === meta.label.toUpperCase()) ?? pipelineStages[i]
            const subsystems: string[] = pipelineStage?.subsystems ?? []
            const isActive = pipelineStage?.status === 'ACTIVE'

            return (
              <button
                key={meta.path}
                onClick={() => navigate(`${BASE}/${meta.path}`)}
                className="text-left rounded-xl p-4 transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: `${meta.color}0d`,
                  border:     `1px solid ${meta.color}22`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono tracking-[0.15em] uppercase" style={{ color: meta.color }}>
                    {meta.label}
                  </span>
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: isActive ? meta.color : 'rgba(255,255,255,0.2)' }}
                  />
                </div>
                <div className="text-[12px] text-white/55 mb-3 leading-snug">
                  {meta.question}
                </div>
                <div className="flex flex-wrap gap-1">
                  {subsystems.slice(0, 4).map((s: string) => (
                    <span
                      key={s}
                      className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}
                    >
                      {s}
                    </span>
                  ))}
                  {subsystems.length > 4 && (
                    <span className="text-[9px] text-white/20 font-mono">+{subsystems.length - 4}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Boot phases ─────────────────────────────────────────────────────── */}
      {phases.length > 0 && (
        <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
          <div className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-4">
            Boot Manifest
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
            {phases.map((p: any, i: number) => (
              <div
                key={i}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px]"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: phaseColor(p.status) }}
                />
                <span className="text-white/50 truncate">
                  {p.phase?.replace(/Phase \d+ · /, '') ?? p.phase}
                </span>
                <span className="text-white/20 ml-auto flex-shrink-0 font-mono text-[10px]">
                  {p.ms}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Enterprise Domain Registry ───────────────────────────────────────── */}
      {domainList.length > 0 && (
        <div>
          <div className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-4">
            Enterprise Domain Registry
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {domainList.map((d: any) => (
              <div
                key={d.id}
                style={{ background: surface, border, borderRadius: 12, padding: '16px 20px' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm text-white/80 font-medium">{d.name}</div>
                    <div className="text-[11px] text-white/30 mt-0.5">{d.purpose}</div>
                  </div>
                  <span
                    className="text-[9px] font-mono px-2 py-0.5 rounded-full flex-shrink-0 ml-3"
                    style={{
                      background: d.ready ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                      color:      d.ready ? '#10b981' : '#f59e0b',
                    }}
                  >
                    {d.ready ? 'READY' : 'LOADING'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  {[
                    { label: 'objects',      count: d.objects      },
                    { label: 'capabilities', count: d.capabilities },
                    { label: 'goals',        count: d.goals        },
                    { label: 'events',       count: d.events       },
                  ].map(({ label, count }) => count > 0 && (
                    <div key={label} className="text-center">
                      <div className="text-sm font-light text-white/60">{count}</div>
                      <div className="text-[9px] text-white/25 uppercase tracking-wide">{label}</div>
                    </div>
                  ))}
                  <span className="text-[9px] font-mono text-white/20 ml-auto">v{d.version}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

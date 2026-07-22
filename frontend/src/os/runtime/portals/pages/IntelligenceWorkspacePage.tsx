import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import {
  Brain, Zap, BarChart3, Activity, TrendingUp, FlaskConical,
  Cpu, CheckCircle2, AlertTriangle, Database, GitBranch, Eye,
} from 'lucide-react'

const S: Record<string, React.CSSProperties> = {
  page:    { display: 'flex', flexDirection: 'column', gap: 24, padding: '4px 0' },
  grid3:   { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  grid2:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card:    { background: 'var(--os-surface-1)', border: '1px solid var(--os-border)', borderRadius: 10, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 },
  cardH:   { fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: 'var(--os-text-3)', textTransform: 'uppercase' as const },
  row:     { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 7, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' },
  badge:   { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20 },
}

function relDate(d: string): string {
  if (!d) return '—'
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return '1d ago'
  if (diff < 7) return `${diff}d ago`
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function confidenceColor(c: number | null | undefined): string {
  if (c == null) return 'var(--os-text-3)'
  if (c >= 80) return 'var(--os-success)'
  if (c >= 60) return '#579bfc'
  if (c >= 40) return 'var(--os-warning)'
  return 'var(--os-danger)'
}

export const IntelligenceWorkspacePage: React.FC = () => {
  const [signalFilter, setSignalFilter] = useState<string>('ALL')

  const { data: insights } = useQuery({
    queryKey: ['ws-intel-insights'],
    queryFn: () => api.get('/admin/kangqore-immp/insights?limit=20').then(r => r.data).catch(() => []),
  })
  const { data: benchmarks } = useQuery({
    queryKey: ['ws-benchmarks'],
    queryFn: () => api.get('/admin/kangqore-immp/benchmarks').then(r => r.data).catch(() => null),
  })
  const { data: benchRuns } = useQuery({
    queryKey: ['ws-bench-runs'],
    queryFn: () => api.get('/admin/kangqore-immp/benchmarks/runs?limit=5').then(r => r.data).catch(() => []),
  })
  const { data: fmStatus } = useQuery({
    queryKey: ['ws-fm-status'],
    queryFn: () => api.get('/admin/bids/waanda-fm/status').then(r => r.data).catch(() => null),
  })
  const { data: readiness } = useQuery({
    queryKey: ['ws-readiness'],
    queryFn: () => api.get('/admin/kangqore-immp/readiness').then(r => r.data).catch(() => null),
  })

  const insightList = Array.isArray(insights) ? insights : (insights?.insights ?? insights?.data ?? [])
  const types = ['ALL', ...Array.from(new Set(insightList.map((i: any) => i.type ?? i.category ?? 'SIGNAL').filter(Boolean)))] as string[]
  const filtered = signalFilter === 'ALL' ? insightList : insightList.filter((i: any) => (i.type ?? i.category) === signalFilter)

  const runList = Array.isArray(benchRuns) ? benchRuns : (benchRuns?.runs ?? [])
  const latestRun = runList[0] ?? null

  const totalExamples = fmStatus?.totalIncludedExamples ?? 0
  const latestScan    = fmStatus?.latestScan ?? null
  const evals         = fmStatus?.evals ?? []

  return (
    <div style={S.page}>

      {/* ── Signal Ledger ── */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={13} color="#a78bfa" />
            <span style={S.cardH}>KIMMP Signal Ledger</span>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {types.slice(0, 5).map(t => (
              <button
                key={t}
                onClick={() => setSignalFilter(t)}
                style={{
                  fontSize: 9, fontWeight: 600, padding: '3px 8px', borderRadius: 20, cursor: 'pointer', border: 'none',
                  background: signalFilter === t ? '#a78bfa' : 'var(--os-surface-3)',
                  color: signalFilter === t ? '#fff' : 'var(--os-text-3)',
                }}
              >{t}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { label: 'Total Signals', val: insightList.length.toString(), col: '#a78bfa' },
            { label: 'High Confidence', val: insightList.filter((i: any) => (i.confidence ?? 0) >= 80).length.toString(), col: 'var(--os-success)' },
            { label: 'Today', val: insightList.filter((i: any) => relDate(i.createdAt) === 'Today').length.toString(), col: '#579bfc' },
            { label: 'Types', val: (types.length - 1).toString(), col: '#f59e0b' },
          ].map(m => (
            <div key={m.label} style={{ padding: '10px', borderRadius: 8, background: m.col + '12', border: `1px solid ${m.col}22`, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: m.col, fontVariantNumeric: 'tabular-nums' }}>{m.val}</div>
              <div style={{ fontSize: 9.5, color: 'var(--os-text-4)', marginTop: 2 }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 260, overflowY: 'auto' }}>
          {filtered.slice(0, 12).length === 0 ? (
            <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: 16 }}>No signals</div>
          ) : filtered.slice(0, 12).map((ins: any, i: number) => (
            <div key={ins.id ?? i} style={S.row}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: confidenceColor(ins.confidence), flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ins.title ?? ins.type ?? 'Signal'}
                </div>
                {ins.body && (
                  <div style={{ fontSize: 10, color: 'var(--os-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ins.body}</div>
                )}
              </div>
              {ins.confidence != null && (
                <span style={{ ...S.badge, background: confidenceColor(ins.confidence) + '18', color: confidenceColor(ins.confidence), flexShrink: 0 }}>
                  {ins.confidence}%
                </span>
              )}
              <span style={{ fontSize: 9, color: 'var(--os-text-4)', flexShrink: 0 }}>{relDate(ins.createdAt ?? '')}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={S.grid3}>
        {/* ── Model Health ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Brain size={13} color="#579bfc" />
            <span style={S.cardH}>Model Health</span>
          </div>

          {benchmarks ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(benchmarks).filter(([k]) => !['id','createdAt','runs'].includes(k)).slice(0, 6).map(([k, v]: [string, any]) => (
                <div key={k} style={S.row}>
                  <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-2)' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>
                    {typeof v === 'number' ? v.toFixed(2) : String(v ?? '—')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: 12 }}>Loading benchmarks…</div>
          )}

          {latestRun && (
            <div style={{ padding: '8px 10px', borderRadius: 7, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' }}>
              <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginBottom: 3 }}>Latest Benchmark Run</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--os-text-1)' }}>{latestRun.name ?? latestRun.type ?? 'Run'}</span>
                <span style={{ ...S.badge, background: latestRun.status === 'PASS' ? 'var(--os-success)18' : 'var(--os-danger)18', color: latestRun.status === 'PASS' ? 'var(--os-success)' : 'var(--os-danger)' }}>
                  {latestRun.status ?? '—'}
                </span>
              </div>
              <div style={{ fontSize: 9.5, color: 'var(--os-text-3)', marginTop: 3 }}>{relDate(latestRun.runAt ?? latestRun.createdAt ?? '')}</div>
            </div>
          )}

          {readiness && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {Object.entries(readiness).filter(([k]) => typeof (readiness as any)[k] !== 'object').slice(0, 4).map(([k, v]: [string, any]) => (
                <div key={k} style={{ padding: '7px 8px', borderRadius: 7, background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>
                    {typeof v === 'boolean' ? (v ? '✓' : '✗') : String(v ?? '—')}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--os-text-4)' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── WAANDA-FM / A/B Stats ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FlaskConical size={13} color="#f59e0b" />
            <span style={S.cardH}>WAANDA-FM & A/B Stats</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ padding: '12px 10px', borderRadius: 8, background: '#f59e0b12', border: '1px solid #f59e0b22', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b', fontVariantNumeric: 'tabular-nums' }}>{totalExamples}</div>
              <div style={{ fontSize: 9.5, color: 'var(--os-text-4)', marginTop: 2 }}>Training Examples</div>
            </div>
            <div style={{ padding: '12px 10px', borderRadius: 8, background: '#a78bfa12', border: '1px solid #a78bfa22', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#a78bfa', fontVariantNumeric: 'tabular-nums' }}>{evals.length}</div>
              <div style={{ fontSize: 9.5, color: 'var(--os-text-4)', marginTop: 2 }}>Eval Runs</div>
            </div>
          </div>

          {latestScan && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 10, color: 'var(--os-text-4)', fontWeight: 600 }}>LATEST CORPUS SCAN</span>
              <div style={S.row}>
                <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-2)' }}>Scanned</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{latestScan.totalScanned}</span>
              </div>
              <div style={S.row}>
                <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-2)' }}>Included</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-success)', fontVariantNumeric: 'tabular-nums' }}>{latestScan.totalIncluded}</span>
              </div>
              <div style={S.row}>
                <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-2)' }}>Quality threshold</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{latestScan.qualityThreshold}</span>
              </div>
              {latestScan.byPhase && typeof latestScan.byPhase === 'object' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>By Phase</span>
                  {Object.entries(latestScan.byPhase).map(([phase, count]: [string, any]) => (
                    <div key={phase} style={S.row}>
                      <span style={{ flex: 1, fontSize: 10.5, color: 'var(--os-text-2)' }}>{phase}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: '#a78bfa', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {evals.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--os-text-4)', fontWeight: 600 }}>RECENT EVALS</span>
              {evals.slice(0, 3).map((ev: any, i: number) => (
                <div key={ev.id ?? i} style={S.row}>
                  <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-1)' }}>{ev.modelCandidate ?? 'Eval'}</span>
                  {ev.overallScore != null && (
                    <span style={{ ...S.badge, background: '#10b98118', color: '#10b981' }}>{ev.overallScore.toFixed(1)}</span>
                  )}
                  <span style={{ fontSize: 9, color: 'var(--os-text-4)' }}>{relDate(ev.evalDate ?? '')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Bench run timeline ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={13} color="#10b981" />
            <span style={S.cardH}>Benchmark Runs</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {runList.slice(0, 8).length === 0 ? (
              <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: 12 }}>No runs yet</div>
            ) : runList.slice(0, 8).map((run: any, i: number) => (
              <div key={run.id ?? i} style={S.row}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: run.status === 'PASS' ? 'var(--os-success)' : run.status === 'FAIL' ? 'var(--os-danger)' : 'var(--os-text-3)', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {run.name ?? run.type ?? `Run #${i + 1}`}
                </span>
                {run.score != null && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#579bfc', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{run.score.toFixed(1)}</span>
                )}
                <span style={{ fontSize: 9, color: 'var(--os-text-4)', flexShrink: 0 }}>{relDate(run.runAt ?? run.createdAt ?? '')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

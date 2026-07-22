import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import {
  MessageSquare, Users, GitMerge, Share2, Clock, CheckCircle2,
  ChevronRight, Hash, User, AlertCircle, Play, Pause,
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

function wfStatusColor(s: string): string {
  const u = (s ?? '').toUpperCase()
  if (u === 'ACTIVE' || u === 'RUNNING') return '#579bfc'
  if (u === 'COMPLETE' || u === 'DONE') return 'var(--os-success)'
  if (u === 'FAILED' || u === 'ERROR') return 'var(--os-danger)'
  if (u === 'PAUSED') return 'var(--os-warning)'
  return 'var(--os-text-3)'
}

export const CollaborationWorkspacePage: React.FC = () => {
  const [wfFilter, setWfFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETE'>('ALL')

  const { data: workflows } = useQuery({
    queryKey: ['ws-workflows'],
    queryFn: () => api.get('/admin/os-workflows?limit=30').then(r => r.data).catch(() => []),
  })
  const { data: wfRuns } = useQuery({
    queryKey: ['ws-wf-runs'],
    queryFn: () => api.get('/admin/os-workflows/runs?limit=15').then(r => r.data).catch(() => []),
  })
  const { data: decisions } = useQuery({
    queryKey: ['ws-collab-decisions'],
    queryFn: () => api.get('/admin/governance/decisions?limit=8').then(r => r.data).catch(() => []),
  })

  const wfList  = Array.isArray(workflows) ? workflows : (workflows?.workflows ?? workflows?.data ?? [])
  const runList = Array.isArray(wfRuns)    ? wfRuns    : (wfRuns?.runs ?? wfRuns?.data ?? [])
  const decList = Array.isArray(decisions) ? decisions : (decisions?.decisions ?? decisions?.data ?? [])

  const filteredWf = wfFilter === 'ALL' ? wfList
    : wfFilter === 'ACTIVE' ? wfList.filter((w: any) => ['ACTIVE','RUNNING','DRAFT'].includes((w.status ?? '').toUpperCase()))
    : wfList.filter((w: any) => ['COMPLETE','DONE','ARCHIVE'].includes((w.status ?? '').toUpperCase()))

  const activeRuns = runList.filter((r: any) => ['RUNNING','ACTIVE'].includes((r.status ?? '').toUpperCase())).length
  const activeWf   = wfList.filter((w: any) => ['ACTIVE','RUNNING'].includes((w.status ?? '').toUpperCase())).length

  return (
    <div style={S.page}>

      {/* ── Stats bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { icon: GitMerge,     label: 'Shared Workflows', val: wfList.length.toString(), col: '#579bfc' },
          { icon: Play,         label: 'Active Runs', val: activeRuns.toString(), col: '#10b981' },
          { icon: Users,        label: 'Active Workflows', val: activeWf.toString(), col: '#a78bfa' },
          { icon: CheckCircle2, label: 'Decisions Logged', val: decList.length.toString(), col: '#f59e0b' },
        ].map(m => (
          <div key={m.label} style={{ ...S.card, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: m.col + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <m.icon size={18} color={m.col} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{m.val}</div>
              <div style={{ fontSize: 10, color: 'var(--os-text-3)' }}>{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={S.grid2}>
        {/* ── Shared Workflows ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <GitMerge size={13} color="#579bfc" />
              <span style={S.cardH}>Shared Workflows</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['ALL', 'ACTIVE', 'COMPLETE'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setWfFilter(f)}
                  style={{
                    fontSize: 9, fontWeight: 600, padding: '3px 8px', borderRadius: 20, cursor: 'pointer', border: 'none',
                    background: wfFilter === f ? '#579bfc' : 'var(--os-surface-3)',
                    color: wfFilter === f ? '#fff' : 'var(--os-text-3)',
                  }}
                >{f}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 300, overflowY: 'auto' }}>
            {filteredWf.slice(0, 10).length === 0 ? (
              <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>No workflows</div>
            ) : filteredWf.slice(0, 10).map((wf: any, i: number) => (
              <div key={wf.id ?? i} style={S.row}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: wfStatusColor(wf.status ?? ''), flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {wf.name ?? wf.title ?? `Workflow ${i + 1}`}
                  </div>
                  {wf.stepCount != null && (
                    <div style={{ fontSize: 9.5, color: 'var(--os-text-4)' }}>{wf.stepCount} steps</div>
                  )}
                </div>
                <span style={{ ...S.badge, background: wfStatusColor(wf.status ?? '') + '18', color: wfStatusColor(wf.status ?? ''), flexShrink: 0 }}>
                  {wf.status ?? 'DRAFT'}
                </span>
                <span style={{ fontSize: 9, color: 'var(--os-text-4)', flexShrink: 0 }}>
                  {relDate(wf.updatedAt ?? wf.createdAt ?? '')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Active Workflow Runs ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Play size={13} color="#10b981" />
            <span style={S.cardH}>Workflow Run Log</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {runList.slice(0, 10).length === 0 ? (
              <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>No runs</div>
            ) : runList.slice(0, 10).map((r: any, i: number) => {
              const col = r.status === 'RUNNING' || r.status === 'ACTIVE' ? '#10b981'
                : r.status === 'DONE' || r.status === 'COMPLETE' ? 'var(--os-success)'
                : r.status === 'FAILED' ? 'var(--os-danger)'
                : 'var(--os-text-3)'
              return (
                <div key={r.id ?? i} style={S.row}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: col, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.workflowName ?? r.name ?? `Run #${i + 1}`}
                  </span>
                  {r.progress != null && (
                    <span style={{ fontSize: 10, color: '#579bfc', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                      {r.progress}%
                    </span>
                  )}
                  <span style={{ ...S.badge, background: col + '18', color: col, flexShrink: 0 }}>
                    {r.status ?? '—'}
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--os-text-4)', flexShrink: 0 }}>
                    {relDate(r.startedAt ?? r.createdAt ?? '')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Decision Log ── */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CheckCircle2 size={13} color="#f59e0b" />
          <span style={S.cardH}>Collaborative Decision Log</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {decList.slice(0, 6).length === 0 ? (
            <div style={{ gridColumn: '1/-1', color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: 12 }}>No decisions recorded</div>
          ) : decList.slice(0, 6).map((d: any, i: number) => (
            <div key={d.id ?? i} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--os-text-1)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {d.title ?? d.question ?? d.description ?? 'Decision'}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {d.type && <span style={{ ...S.badge, background: '#f59e0b18', color: '#f59e0b' }}>{d.type}</span>}
                {d.status && <span style={{ ...S.badge, background: 'var(--os-surface-3)', color: 'var(--os-text-3)' }}>{d.status}</span>}
              </div>
              <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 5 }}>
                {relDate(d.createdAt ?? d.decidedAt ?? '')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

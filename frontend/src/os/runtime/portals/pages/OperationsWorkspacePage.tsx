import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import {
  AlertCircle, Clock, CheckCircle2, XCircle, BarChart3,
  Wrench, Users, Package, Activity, Layers, Timer, TrendingUp,
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

function slaColor(pct: number | null): string {
  if (pct == null) return 'var(--os-text-3)'
  if (pct >= 95) return 'var(--os-success)'
  if (pct >= 80) return 'var(--os-warning)'
  return 'var(--os-danger)'
}

function severityColor(s: string): string {
  const sv = (s ?? '').toUpperCase()
  if (sv === 'CRITICAL' || sv === 'P1') return 'var(--os-danger)'
  if (sv === 'HIGH' || sv === 'P2') return '#f59e0b'
  if (sv === 'MEDIUM' || sv === 'P3') return '#579bfc'
  return 'var(--os-text-3)'
}

function relDate(d: string): string {
  if (!d) return '—'
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return '1d ago'
  return `${diff}d ago`
}

export const OperationsWorkspacePage: React.FC = () => {
  const [incidentFilter, setIncidentFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL')

  const { data: sla } = useQuery({
    queryKey: ['ws-sla'],
    queryFn: () => api.get('/admin/itil').then(r => r.data).catch(() => null),
  })
  const { data: incidents } = useQuery({
    queryKey: ['ws-incidents'],
    queryFn: () => api.get('/admin/release/incidents').then(r => r.data).catch(() => []),
  })
  const { data: resources } = useQuery({
    queryKey: ['ws-resources'],
    queryFn: () => api.get('/admin/pmo/projects').then(r => r.data).catch(() => []),
  })
  const { data: portfolio } = useQuery({
    queryKey: ['ws-portfolio'],
    queryFn: () => api.get('/admin/projects/ops/portfolio').then(r => r.data).catch(() => null),
  })

  const incidentList = Array.isArray(incidents) ? incidents : (incidents?.incidents ?? incidents?.data ?? [])
  const filtered = incidentFilter === 'ALL' ? incidentList
    : incidentList.filter((i: any) => incidentFilter === 'OPEN'
      ? !['RESOLVED','CLOSED'].includes((i.status ?? '').toUpperCase())
      : ['RESOLVED','CLOSED'].includes((i.status ?? '').toUpperCase()))

  const openCount     = incidentList.filter((i: any) => !['RESOLVED','CLOSED'].includes((i.status ?? '').toUpperCase())).length
  const resolvedCount = incidentList.filter((i: any) => ['RESOLVED','CLOSED'].includes((i.status ?? '').toUpperCase())).length
  const criticalCount = incidentList.filter((i: any) => ['CRITICAL','P1'].includes((i.severity ?? '').toUpperCase())).length

  const projectList = Array.isArray(resources) ? resources : []
  const totalCapacity   = portfolio?.capacity ?? portfolio?.totalCapacity ?? null
  const usedCapacity    = portfolio?.used ?? portfolio?.usedCapacity ?? null
  const utilization     = totalCapacity && usedCapacity ? Math.round((usedCapacity / totalCapacity) * 100) : null

  // SLA metrics
  const slaData = sla?.sla ?? sla ?? null
  const slaMetrics: Array<{ name: string; target: number; actual: number | null; pct: number | null }> = Array.isArray(slaData)
    ? slaData.map((s: any) => ({ name: s.name ?? s.service ?? 'SLA', target: s.target ?? 99, actual: s.actual ?? s.current ?? null, pct: s.compliance ?? s.pct ?? null }))
    : slaData && typeof slaData === 'object'
    ? Object.entries(slaData).slice(0, 6).map(([k, v]: [string, any]) => ({
        name: k, target: v?.target ?? 99, actual: v?.actual ?? null, pct: typeof v === 'number' ? v : v?.pct ?? null,
      }))
    : []

  return (
    <div style={S.page}>

      {/* ── Summary stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { icon: AlertCircle, label: 'Open Incidents', val: openCount.toString(), col: openCount > 0 ? 'var(--os-danger)' : 'var(--os-success)' },
          { icon: XCircle,     label: 'Critical',       val: criticalCount.toString(), col: criticalCount > 0 ? 'var(--os-danger)' : 'var(--os-text-1)' },
          { icon: CheckCircle2, label: 'Resolved',      val: resolvedCount.toString(), col: 'var(--os-success)' },
          { icon: Activity,    label: 'Utilization',    val: utilization != null ? `${utilization}%` : '—', col: utilization != null && utilization > 85 ? 'var(--os-danger)' : 'var(--os-text-1)' },
        ].map(m => (
          <div key={m.label} style={{ ...S.card, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: m.col + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <m.icon size={18} color={m.col} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: m.col, fontVariantNumeric: 'tabular-nums' }}>{m.val}</div>
              <div style={{ fontSize: 10, color: 'var(--os-text-3)' }}>{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={S.grid2}>
        {/* ── SLA Grid ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <BarChart3 size={13} color="#579bfc" />
            <span style={S.cardH}>SLA Grid</span>
          </div>
          {slaMetrics.length === 0 ? (
            <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>No SLA data available</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {slaMetrics.map(sla => (
                <div key={sla.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: 'var(--os-text-2)', fontWeight: 600 }}>
                      {sla.name.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {sla.actual != null && <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>actual: {sla.actual}%</span>}
                      <span style={{ fontSize: 11, fontWeight: 800, color: slaColor(sla.pct), fontVariantNumeric: 'tabular-nums' }}>
                        {sla.pct != null ? `${sla.pct}%` : `target: ${sla.target}%`}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 5, borderRadius: 5, background: 'var(--os-surface-3)' }}>
                    <div style={{
                      height: '100%', borderRadius: 5,
                      width: `${Math.min(100, sla.pct ?? sla.target)}%`,
                      background: slaColor(sla.pct),
                      transition: 'width .4s',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SLA summary badges */}
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {[
              { label: 'Meeting SLA', val: slaMetrics.filter(s => s.pct != null && s.pct >= 95).length, col: 'var(--os-success)' },
              { label: 'At Risk', val: slaMetrics.filter(s => s.pct != null && s.pct >= 80 && s.pct < 95).length, col: 'var(--os-warning)' },
              { label: 'Breached', val: slaMetrics.filter(s => s.pct != null && s.pct < 80).length, col: 'var(--os-danger)' },
            ].map(b => (
              <div key={b.label} style={{ flex: 1, padding: '6px 8px', borderRadius: 7, background: b.col + '12', border: `1px solid ${b.col}22`, textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: b.col, fontVariantNumeric: 'tabular-nums' }}>{b.val}</div>
                <div style={{ fontSize: 9, color: 'var(--os-text-4)' }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Incident Queue ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertCircle size={13} color="var(--os-danger)" />
              <span style={S.cardH}>Incident Queue</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['ALL', 'OPEN', 'RESOLVED'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setIncidentFilter(f)}
                  style={{
                    fontSize: 9, fontWeight: 600, padding: '3px 8px', borderRadius: 20, cursor: 'pointer',
                    background: incidentFilter === f ? '#579bfc' : 'var(--os-surface-3)',
                    color: incidentFilter === f ? '#fff' : 'var(--os-text-3)',
                    border: 'none',
                  }}
                >{f}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 280, overflowY: 'auto' }}>
            {filtered.slice(0, 10).length === 0 ? (
              <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>No incidents</div>
            ) : filtered.slice(0, 10).map((inc: any, i: number) => (
              <div key={inc.id ?? i} style={S.row}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: severityColor(inc.severity ?? ''), flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {inc.title ?? inc.name ?? inc.description ?? 'Incident'}
                </span>
                <span style={{ ...S.badge, background: severityColor(inc.severity ?? '') + '18', color: severityColor(inc.severity ?? ''), flexShrink: 0 }}>
                  {inc.severity ?? 'LOW'}
                </span>
                <span style={{ fontSize: 9, color: 'var(--os-text-4)', flexShrink: 0 }}>
                  {relDate(inc.createdAt ?? inc.detectedAt ?? '')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Capacity View ── */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Layers size={13} color="#10b981" />
            <span style={S.cardH}>Capacity View — Active Projects</span>
          </div>
          {utilization != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-3)' }}>Overall utilization:</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: utilization > 85 ? 'var(--os-danger)' : utilization > 70 ? 'var(--os-warning)' : 'var(--os-success)', fontVariantNumeric: 'tabular-nums' }}>
                {utilization}%
              </span>
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {projectList.slice(0, 8).length === 0 ? (
            <div style={{ gridColumn: '1/-1', color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: 12 }}>No project data</div>
          ) : projectList.slice(0, 8).map((p: any, i: number) => {
            const progress = p.progress ?? p.completion ?? null
            return (
              <div key={p.id ?? i} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                    {p.name ?? p.title ?? 'Project'}
                  </span>
                  {progress != null && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#579bfc', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                      {progress}%
                    </span>
                  )}
                </div>
                {progress != null && (
                  <div style={{ height: 3, borderRadius: 3, background: 'var(--os-surface-3)' }}>
                    <div style={{ height: '100%', borderRadius: 3, width: `${Math.min(100, progress)}%`, background: progress >= 80 ? 'var(--os-success)' : progress >= 50 ? '#579bfc' : 'var(--os-warning)' }} />
                  </div>
                )}
                <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
                  {p.status && (
                    <span style={{ ...S.badge, background: 'var(--os-surface-3)', color: 'var(--os-text-3)' }}>{p.status}</span>
                  )}
                  {p.dueDate && (
                    <span style={{ fontSize: 9, color: 'var(--os-text-4)' }}>{new Date(p.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

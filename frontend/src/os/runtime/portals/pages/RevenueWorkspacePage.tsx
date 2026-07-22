import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import {
  DollarSign, TrendingUp, Users, Percent, PieChart, ChevronDown, ChevronUp,
  Building2, ArrowUpRight, Flame, Clock, Target, Star,
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

function stageColor(stage: string): string {
  const s = (stage ?? '').toUpperCase()
  if (s.includes('CLOSE') || s.includes('WON')) return 'var(--os-success)'
  if (s.includes('PROPOSAL') || s.includes('NEGOTIAT')) return '#579bfc'
  if (s.includes('DEMO') || s.includes('QUALIFY')) return '#a78bfa'
  if (s.includes('LOST') || s.includes('DEAD')) return 'var(--os-danger)'
  return '#f59e0b'
}

function fmt(n: number | null | undefined, prefix = ''): string {
  if (n == null) return '—'
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(1)}K`
  return `${prefix}${n.toFixed(0)}`
}

const STAGES = [
  'PROSPECTING', 'QUALIFICATION', 'DEMO', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST',
]

export const RevenueWorkspacePage: React.FC = () => {
  const [expandedLead, setExpandedLead] = useState<string | null>(null)

  const { data: leads } = useQuery({
    queryKey: ['ws-leads'],
    queryFn: () => api.get('/admin/eqore/leads?limit=50').then(r => r.data).catch(() => []),
  })
  const { data: clients } = useQuery({
    queryKey: ['ws-clients'],
    queryFn: () => api.get('/admin/clients?limit=20').then(r => r.data).catch(() => []),
  })
  const { data: kpis } = useQuery({
    queryKey: ['ws-rev-kpis'],
    queryFn: () => api.get('/admin/financial-kpis').then(r => r.data).catch(() => null),
  })

  const leadList = Array.isArray(leads) ? leads : (leads?.leads ?? leads?.data ?? [])
  const clientList = Array.isArray(clients) ? clients : (clients?.clients ?? clients?.data ?? [])

  // Pipeline funnel: count by stage
  const stageCounts: Record<string, number> = {}
  const stageValues: Record<string, number> = {}
  leadList.forEach((l: any) => {
    const st = l.stage ?? l.status ?? 'UNKNOWN'
    stageCounts[st] = (stageCounts[st] ?? 0) + 1
    stageValues[st]  = (stageValues[st] ?? 0) + (l.value ?? l.dealValue ?? 0)
  })
  const totalPipeline = leadList.reduce((s: number, l: any) => s + (l.value ?? l.dealValue ?? 0), 0)
  const maxStageCount = Math.max(1, ...Object.values(stageCounts))

  // ARR tracker from KPIs or clients
  const arr  = kpis?.arr ?? kpis?.annualRecurringRevenue ?? null
  const mrr  = kpis?.mrr ?? kpis?.monthlyRecurringRevenue ?? null
  const winRate = kpis?.winRate ?? (leadList.length > 0
    ? ((leadList.filter((l: any) => (l.stage ?? '').includes('WON')).length / leadList.length) * 100).toFixed(1)
    : null)
  const avgDeal = totalPipeline > 0 && leadList.length > 0 ? totalPipeline / leadList.length : null

  return (
    <div style={S.page}>

      {/* ── ARR Tracker ── */}
      <div style={S.card}>
        <span style={S.cardH}>ARR Tracker</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { icon: DollarSign, label: 'ARR', val: fmt(arr, '$'), col: '#10b981', sub: 'Annual Recurring Revenue' },
            { icon: TrendingUp,  label: 'MRR', val: fmt(mrr, '$'), col: '#579bfc', sub: 'Monthly Recurring Revenue' },
            { icon: Target, label: 'Pipeline', val: fmt(totalPipeline, '$'), col: '#a78bfa', sub: 'Total pipeline value' },
            { icon: Percent, label: 'Win Rate', val: winRate ? `${winRate}%` : '—', col: '#f59e0b', sub: 'Deals closed won' },
          ].map(m => (
            <div key={m.label} style={{ padding: '14px 12px', borderRadius: 9, background: 'var(--os-surface-2)', border: `1px solid ${m.col}22`, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <m.icon size={13} color={m.col} />
                <span style={{ fontSize: 10, color: 'var(--os-text-3)', fontWeight: 600 }}>{m.label}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{m.val}</div>
              <div style={{ fontSize: 9.5, color: 'var(--os-text-4)' }}>{m.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'Avg Deal Size', val: fmt(avgDeal, '$') },
            { label: 'Total Leads', val: leadList.length.toString() },
            { label: 'Active Clients', val: clientList.length.toString() },
          ].map(m => (
            <div key={m.label} style={{ padding: '8px 10px', borderRadius: 7, background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{m.val}</div>
              <div style={{ fontSize: 9, color: 'var(--os-text-4)' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.grid2}>
        {/* ── Pipeline Funnel ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <PieChart size={13} color="#a78bfa" />
            <span style={S.cardH}>Pipeline Funnel</span>
          </div>
          {Object.keys(stageCounts).length === 0 ? (
            <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>No pipeline data</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(stageCounts).sort((a, b) => STAGES.indexOf(a[0]) - STAGES.indexOf(b[0])).map(([stage, count]) => {
                const pct = Math.round((count / maxStageCount) * 100)
                const col = stageColor(stage)
                return (
                  <div key={stage}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 10.5, color: 'var(--os-text-2)', fontWeight: 600 }}>
                        {stage.replace(/_/g, ' ')}
                      </span>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>{fmt(stageValues[stage], '$')}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: col, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                      </div>
                    </div>
                    <div style={{ height: 5, borderRadius: 5, background: 'var(--os-surface-3)' }}>
                      <div style={{ height: '100%', borderRadius: 5, width: `${pct}%`, background: col, transition: 'width .4s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Deal velocity metrics */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <div style={{ flex: 1, padding: '8px 10px', borderRadius: 7, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                {leadList.filter((l: any) => (l.stage ?? '').includes('WON')).length}
              </div>
              <div style={{ fontSize: 9, color: 'var(--os-text-4)' }}>Won</div>
            </div>
            <div style={{ flex: 1, padding: '8px 10px', borderRadius: 7, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--os-danger)', fontVariantNumeric: 'tabular-nums' }}>
                {leadList.filter((l: any) => (l.stage ?? '').includes('LOST')).length}
              </div>
              <div style={{ fontSize: 9, color: 'var(--os-text-4)' }}>Lost</div>
            </div>
            <div style={{ flex: 1, padding: '8px 10px', borderRadius: 7, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#579bfc', fontVariantNumeric: 'tabular-nums' }}>
                {leadList.filter((l: any) => !['CLOSED_WON','CLOSED_LOST','WON','LOST'].some(s => (l.stage ?? '').includes(s))).length}
              </div>
              <div style={{ fontSize: 9, color: 'var(--os-text-4)' }}>Active</div>
            </div>
          </div>
        </div>

        {/* ── Lead / Deal list ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Flame size={13} color="#f59e0b" />
            <span style={S.cardH}>Deal Velocity — Hot Leads</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {leadList.slice(0, 8).length === 0 ? (
              <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>No leads found</div>
            ) : leadList.slice(0, 8).map((l: any, i: number) => {
              const isOpen = expandedLead === (l.id ?? i.toString())
              return (
                <div key={l.id ?? i}>
                  <div
                    style={{ ...S.row, cursor: 'pointer', justifyContent: 'space-between' }}
                    onClick={() => setExpandedLead(isOpen ? null : (l.id ?? i.toString()))}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                      <Building2 size={11} color="var(--os-text-3)" />
                      <span style={{ fontSize: 11.5, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {l.company ?? l.name ?? l.title ?? 'Lead'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {l.value != null && <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{fmt(l.value, '$')}</span>}
                      <span style={{ ...S.badge, background: stageColor(l.stage ?? '') + '18', color: stageColor(l.stage ?? '') }}>
                        {(l.stage ?? l.status ?? '—').replace(/_/g, ' ')}
                      </span>
                      {isOpen ? <ChevronUp size={11} color="var(--os-text-4)" /> : <ChevronDown size={11} color="var(--os-text-4)" />}
                    </div>
                  </div>
                  {isOpen && (
                    <div style={{ padding: '8px 12px', background: 'var(--os-surface-3)', borderRadius: '0 0 7px 7px', marginTop: 1, fontSize: 11, color: 'var(--os-text-3)', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                      {l.contactName && <span>Contact: <b style={{ color: 'var(--os-text-1)' }}>{l.contactName}</b></span>}
                      {l.probability && <span>Prob: <b style={{ color: 'var(--os-text-1)' }}>{l.probability}%</b></span>}
                      {l.expectedCloseDate && <span>Close: <b style={{ color: 'var(--os-text-1)' }}>{new Date(l.expectedCloseDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</b></span>}
                      {l.source && <span>Source: <b style={{ color: 'var(--os-text-1)' }}>{l.source}</b></span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Client ARR Breakdown ── */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Star size={13} color="#10b981" />
          <span style={S.cardH}>Active Client ARR Breakdown</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {clientList.slice(0, 8).length === 0 ? (
            <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: 12 }}>No clients found</div>
          ) : clientList.slice(0, 8).map((c: any, i: number) => {
            const rev = c.arr ?? c.annualRevenue ?? c.revenue ?? null
            return (
              <div key={c.id ?? i} style={S.row}>
                <Building2 size={11} color="var(--os-text-3)" />
                <span style={{ flex: 1, fontSize: 11.5, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.name ?? c.company ?? 'Client'}
                </span>
                {rev != null && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                    {fmt(rev, '$')}
                  </span>
                )}
                <span style={{ ...S.badge, background: '#10b98118', color: '#10b981', flexShrink: 0 }}>
                  {c.status ?? c.tier ?? 'ACTIVE'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

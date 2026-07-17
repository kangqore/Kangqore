import { useState } from 'react'
import { TrendingUp, Users, Zap, Target, ArrowRight, BarChart2 } from 'lucide-react'
import { useMarketingStore } from '../store'

const GREEN  = '#10b981'
const BLUE   = '#2564ea'
const AMBER  = '#f59e0b'
const PURPLE = '#7c3aed'
const TEAL   = '#0d9488'
const RED    = '#ef4444'
const SLATE  = '#6b7280'

type AttributionModel = 'first-touch' | 'last-touch' | 'linear'

const UTM_DATA = [
  { source: 'linkedin.com',  medium: 'social',   campaign: 'Thought Leadership', sessions: 4820, leads: 19, mqls: 12, revenue: 485000 },
  { source: 'google.com',    medium: 'cpc',      campaign: 'Enterprise SaaS',    sessions: 3160, leads: 14, mqls: 7,  revenue: 292000 },
  { source: '(direct)',      medium: '(none)',    campaign: '(none)',              sessions: 6200, leads: 11, mqls: 6,  revenue: 245000 },
  { source: 'partner-ref',   medium: 'referral', campaign: 'Partner Programme',   sessions: 820,  leads: 10, mqls: 8,  revenue: 620000 },
  { source: 'content-hub',   medium: 'organic',  campaign: 'Vertical Content',    sessions: 2240, leads: 8,  mqls: 5,  revenue: 198000 },
  { source: 'email',         medium: 'email',    campaign: 'Nurture Sequence',    sessions: 1480, leads: 6,  mqls: 4,  revenue: 165000 },
  { source: 'healthtech-eu', medium: 'event',    campaign: 'HealthTech Europe',   sessions: 420,  leads: 5,  mqls: 3,  revenue: 142000 },
]

const FUNNEL_STAGES = [
  { label: 'Website Visits', value: 19140, icon: Users,     color: SLATE  },
  { label: 'Leads',          value: 73,    icon: Target,    color: BLUE   },
  { label: 'MQLs',           value: 45,    icon: Zap,       color: TEAL   },
  { label: 'SQLs',           value: 18,    icon: TrendingUp, color: PURPLE },
  { label: 'Customers',      value: 2,     icon: ArrowRight, color: GREEN  },
]

const MODEL_CFG: Record<AttributionModel, { label: string; desc: string }> = {
  'first-touch': { label: 'First Touch',  desc: '100% credit to the first channel a visitor came from' },
  'last-touch':  { label: 'Last Touch',   desc: '100% credit to the channel immediately before conversion' },
  'linear':      { label: 'Linear',       desc: 'Equal credit split across all touchpoints in the path' },
}

function fmtK(n: number) { return n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(0)}K` : `₹${n}` }

function BarChart({ data, valueKey, colorFn }: {
  data:     Array<{ source: string; [k: string]: number | string }>
  valueKey: string
  colorFn:  (v: number) => string
}) {
  const max = Math.max(...data.map(d => Number(d[valueKey]))) || 1
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map(row => {
        const v   = Number(row[valueKey])
        const pct = Math.max(3, (v / max) * 100)
        const col = colorFn(v)
        return (
          <div key={row.source} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ minWidth: 110, fontSize: 10, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.source}</div>
            <div style={{ flex: 1, height: 18, background: 'var(--os-border)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: col, borderRadius: 4, transition: 'width 0.5s' }} />
            </div>
            <div style={{ minWidth: 52, fontSize: 10, fontWeight: 700, color: col, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
              {typeof v === 'number' && valueKey === 'revenue' ? fmtK(v) : v.toLocaleString()}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AttribRevenue(model: AttributionModel, data: typeof UTM_DATA) {
  if (model === 'first-touch') return data.map(d => ({ ...d, attrib: d.revenue }))
  if (model === 'last-touch')  return data.map(d => ({ ...d, attrib: Math.round(d.revenue * (d.mqls / 45)) }))
  const total = data.reduce((s, d) => s + d.revenue, 0)
  return data.map(d => ({ ...d, attrib: Math.round(total * (d.mqls / 45)) }))
}

export function LeadAttribution() {
  const { campaigns, metrics } = useMarketingStore()
  const [model, setModel] = useState<AttributionModel>('first-touch')

  const attributed = AttribRevenue(model, UTM_DATA)
  const totalPipeline = campaigns.reduce((s, c) => s + c.revenue, 0)
  const totalLeads    = campaigns.reduce((s, c) => s + c.leads, 0)
  const totalMQLs     = campaigns.reduce((s, c) => s + c.mqls, 0)
  const totalSQLs     = campaigns.reduce((s, c) => s + c.sqls, 0)
  const convRate      = totalLeads > 0 ? ((totalMQLs / totalLeads) * 100).toFixed(0) : '0'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--os-text-1)', margin: 0 }}>Lead Attribution</h2>
        <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: '3px 0 0' }}>Channel performance · funnel conversion · revenue attribution model</p>
      </div>

      {/* Funnel */}
      <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '18px 20px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: SLATE, marginBottom: 14 }}>Conversion Funnel</div>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
          {FUNNEL_STAGES.map((stage, i) => {
            const prev  = i > 0 ? FUNNEL_STAGES[i - 1].value : stage.value
            const pct   = i > 0 ? ((stage.value / prev) * 100).toFixed(0) : '100'
            const Icon  = stage.icon
            return (
              <div key={stage.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative' }}>
                {i > 0 && (
                  <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', fontSize: 8, fontWeight: 700, color: SLATE, background: 'var(--os-card)', padding: '1px 3px', zIndex: 1 }}>
                    {pct}%
                  </div>
                )}
                <div style={{ width: '100%', background: stage.color + '12', borderLeft: i > 0 ? `1px dashed ${stage.color}25` : undefined, borderRight: i < FUNNEL_STAGES.length - 1 ? `1px dashed ${stage.color}25` : undefined, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <Icon style={{ width: 16, height: 16, color: stage.color }} />
                  <div style={{ fontSize: 20, fontWeight: 900, color: stage.color, fontVariantNumeric: 'tabular-nums' }}>
                    {stage.value >= 1000 ? `${(stage.value / 1000).toFixed(1)}k` : stage.value}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'center' }}>{stage.label}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--os-border)', flexWrap: 'wrap' }}>
          {[
            { label: 'Lead → MQL Rate', value: convRate + '%',       color: TEAL   },
            { label: 'MQL → SQL Rate',  value: totalMQLs > 0 ? `${((totalSQLs / totalMQLs) * 100).toFixed(0)}%` : '0%', color: PURPLE },
            { label: 'SQL → Customer',  value: totalSQLs > 0 ? `${((2 / totalSQLs) * 100).toFixed(0)}%` : '0%', color: GREEN  },
            { label: 'Pipeline Total',  value: fmtK(totalPipeline),  color: AMBER  },
          ].map(k => (
            <div key={k.label} style={{ flex: 1, minWidth: 100 }}>
              <div style={{ fontSize: 9, color: SLATE, fontWeight: 700 }}>{k.label}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: k.color, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Channel MQLs */}
        <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: SLATE, marginBottom: 14 }}>MQLs by Channel</div>
          <BarChart data={UTM_DATA} valueKey="mqls" colorFn={v => v >= 10 ? GREEN : v >= 5 ? TEAL : BLUE} />
        </div>

        {/* Leads by source */}
        <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: SLATE, marginBottom: 14 }}>Leads by Source</div>
          <BarChart data={UTM_DATA} valueKey="leads" colorFn={v => v >= 15 ? GREEN : v >= 8 ? TEAL : BLUE} />
        </div>
      </div>

      {/* Attribution model */}
      <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: SLATE }}>Revenue Attribution</div>
          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
            {(Object.keys(MODEL_CFG) as AttributionModel[]).map(m => (
              <button key={m} onClick={() => setModel(m)} style={{
                fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 7,
                background: model === m ? BLUE + '14' : 'var(--os-surface-3)',
                color: model === m ? BLUE : SLATE,
                border: `1px solid ${model === m ? BLUE + '40' : 'var(--os-border)'}`,
                cursor: 'pointer',
              }}>
                {MODEL_CFG[m].label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 10, color: SLATE, marginBottom: 14 }}>{MODEL_CFG[model].desc}</div>
        <BarChart data={attributed.map(d => ({ ...d, revenue: d.attrib }))} valueKey="revenue" colorFn={v => v >= 400000 ? GREEN : v >= 200000 ? TEAL : BLUE} />
      </div>

      {/* UTM breakdown table */}
      <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ background: 'var(--os-surface-0)', padding: '12px 0', borderBottom: '1px solid var(--os-border)', display: 'grid', gridTemplateColumns: '140px 100px 80px 60px 60px 80px 90px' }}>
          {['Source', 'Campaign', 'Sessions', 'Leads', 'MQLs', 'SQLs', 'Pipeline'].map((h, i) => (
            <div key={i} style={{ paddingLeft: i === 0 ? 16 : 0, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-3)' }}>{h}</div>
          ))}
        </div>
        {UTM_DATA.sort((a, b) => b.mqls - a.mqls).map(row => (
          <div key={row.source} style={{ display: 'grid', gridTemplateColumns: '140px 100px 80px 60px 60px 80px 90px', alignItems: 'center', borderBottom: '1px solid var(--os-border)', minHeight: 44 }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-0)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ paddingLeft: 16, fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)' }}>{row.source}</div>
            <div style={{ fontSize: 10, color: 'var(--os-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{row.campaign}</div>
            <div style={{ fontSize: 10, fontVariantNumeric: 'tabular-nums', color: 'var(--os-text-2)' }}>{row.sessions.toLocaleString()}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: BLUE, fontVariantNumeric: 'tabular-nums' }}>{row.leads}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, fontVariantNumeric: 'tabular-nums' }}>{row.mqls}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE, fontVariantNumeric: 'tabular-nums' }}>{row.mqls >= 6 ? Math.ceil(row.mqls * 0.4) : row.mqls >= 3 ? Math.ceil(row.mqls * 0.35) : 0}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: row.revenue >= 400000 ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums', paddingRight: 14 }}>{fmtK(row.revenue)}</div>
          </div>
        ))}
      </div>

      {/* Monthly trend */}
      <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '16px 18px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: SLATE, marginBottom: 14 }}>MQL Trend vs Spend — Last 5 Months</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
          {metrics.map((m, i) => {
            const mqlH = (m.mqls / 25) * 80
            const spendH = (m.spend / 10000) * 80
            return (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 70 }}>
                  <div style={{ flex: 1, background: TEAL + '50', borderRadius: '3px 3px 0 0', height: mqlH }} title={`${m.mqls} MQLs`} />
                  <div style={{ flex: 1, background: RED + '30', borderRadius: '3px 3px 0 0', height: spendH }} title={`₹${(m.spend / 1000).toFixed(0)}K spend`} />
                </div>
                <div style={{ fontSize: 8, color: SLATE, whiteSpace: 'nowrap' }}>{m.month.split(' ')[0]}</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: TEAL }}>{m.mqls}</div>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 8, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: SLATE }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: TEAL + '50' }} /> MQLs
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: SLATE }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: RED + '30' }} /> Spend
          </div>
        </div>
      </div>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import {
  TrendingUp, DollarSign, Users, Zap, AlertTriangle,
  ArrowRight, Activity, Target, BarChart3,
} from 'lucide-react'
import { adminApi, isDemo } from '@lib/api'

// ─── Design tokens ──────────────────────────────────────────────────────────────

const GREEN  = '#10b981'
const BLUE   = '#2564ea'
const AMBER  = '#f59e0b'
const PURPLE = '#7c3aed'
const TEAL   = '#0d9488'
const RED    = '#ef4444'
const GOLD   = '#d4a017'

// ─── Types ──────────────────────────────────────────────────────────────────────

interface CrmLead {
  id:             string
  company:        string
  stage:          string
  score:          number
  value:          number
  projectedValue: number
}

interface CustomerDeployment {
  id:           string
  customerName: string
  pack:         string
  milestone:    string
  currentOis:   number
  coig:         number
  goLiveAt:     string | null
}

// ─── Static pipeline config ───────────────────────────────────────────────────

const STAGE_CONFIG: Record<string, { label: string; color: string; convRate: number }> = {
  won:         { label: 'Won',         color: GREEN,  convRate: 1.00 },
  negotiation: { label: 'Negotiation', color: TEAL,   convRate: 0.80 },
  proposal:    { label: 'Proposal',    color: BLUE,   convRate: 0.60 },
  qualified:   { label: 'Qualified',   color: PURPLE, convRate: 0.30 },
  contacted:   { label: 'Contacted',   color: AMBER,  convRate: 0.12 },
  new:         { label: 'New',         color: '#6b7280', convRate: 0.05 },
}

const DEMO_LEADS: CrmLead[] = [
  { id: 'l13', company: 'Birla Digital Labs',  stage: 'negotiation', score: 95, value: 2500000,  projectedValue: 2500000 },
  { id: 'l14', company: 'HDFC Bank Digital',   stage: 'proposal',    score: 88, value: 18000000, projectedValue: 18000000 },
  { id: 'l15', company: 'Bajaj Finserv',       stage: 'qualified',   score: 76, value: 12000000, projectedValue: 12000000 },
]

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000)     return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
}

// ─── Waterfall row ────────────────────────────────────────────────────────────

function WaterfallRow({
  label, value, pct, color, isLast = false,
}: { label: string; value: number; pct: number; color: string; isLast?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-2)', width: 130, flexShrink: 0 }}>{label}</span>
        <div style={{ flex: 1, height: 28, borderRadius: 6, background: 'var(--os-surface-0)', overflow: 'hidden', position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${Math.max(4, pct)}%`,
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            borderRadius: 6,
            transition: 'width 0.8s ease',
          }} />
          <div style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            fontSize: 11, fontWeight: 800, color: isLast ? color : 'var(--os-text-1)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {fmtINR(value)}
          </div>
        </div>
        {!isLast && <ArrowRight style={{ width: 12, height: 12, color: 'var(--os-text-4)', flexShrink: 0 }} />}
      </div>
    </div>
  )
}

// ─── Lead row ─────────────────────────────────────────────────────────────────

function LeadRow({ lead, maxVal }: { lead: CrmLead; maxVal: number }) {
  const cfg     = STAGE_CONFIG[lead.stage] ?? STAGE_CONFIG['new']
  const weighted = lead.value * cfg.convRate
  const barPct  = Math.max(4, (lead.value / maxVal) * 100)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px',
      background: 'var(--os-surface-3)', borderRadius: 10,
      border: '1px solid var(--os-border)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)' }}>{lead.company}</span>
          <span style={{
            fontSize: 9, padding: '2px 7px', borderRadius: 4,
            background: cfg.color + '15', color: cfg.color, fontWeight: 700,
          }}>{cfg.label}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: GOLD, marginLeft: 'auto' }}>
            WAANDA {lead.score}
          </span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: 'var(--os-surface-0)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${barPct}%`, background: cfg.color, borderRadius: 3, transition: 'width 0.6s ease' }} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{fmtINR(lead.value)}</span>
        <span style={{ fontSize: 9, color: cfg.color, fontWeight: 600 }}>
          {fmtINR(Math.round(weighted))} prob.
        </span>
      </div>
    </div>
  )
}

// ─── Signal card ──────────────────────────────────────────────────────────────

function SignalCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string; sub: string; color: string
}) {
  return (
    <div style={{
      background: 'var(--os-card)', borderRadius: 12, padding: '14px 16px',
      border: `1px solid var(--os-border)`,
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
        <Icon style={{ width: 13, height: 13, color }} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--os-text-1)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: 10, color, fontWeight: 600, marginTop: 4 }}>{sub}</div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function RevenuePipelinePage() {
  const { data: leadsRaw = [], isLoading: loadingLeads } = useQuery<CrmLead[]>({
    queryKey: ['revenue-pipeline-leads'],
    queryFn:  () => adminApi('/admin/eqore/leads'),
    enabled:  !isDemo(),
    staleTime: 60_000,
  })

  const { data: deployments = [], isLoading: loadingDeps } = useQuery<CustomerDeployment[]>({
    queryKey: ['revenue-pipeline-deps'],
    queryFn:  () => adminApi('/admin/enterprise/customer-deployments'),
    enabled:  !isDemo(),
    staleTime: 60_000,
  })

  const leads = isDemo() || leadsRaw.length === 0 ? DEMO_LEADS : leadsRaw

  const totalPipeline = leads.reduce((s, l) => s + (l.value ?? 0), 0)

  const weightedPipeline = leads.reduce((s, l) => {
    const cfg = STAGE_CONFIG[l.stage] ?? STAGE_CONFIG['new']
    return s + (l.value ?? 0) * cfg.convRate
  }, 0)

  const liveCustomers = deployments.filter(d => ['LIVE','GROWING','MATURE'].includes(d.milestone))
  const totalCoig     = liveCustomers.reduce((s, d) => s + (d.coig ?? 0), 0)
  const avgOis        = liveCustomers.length > 0
    ? liveCustomers.reduce((s, d) => s + (d.currentOis ?? 0), 0) / liveCustomers.length
    : 0

  const isLoading = loadingLeads || loadingDeps

  // Waterfall stages
  const waterfallRows = [
    { label: 'Total CRM Pipeline',     value: totalPipeline,    pct: 100,                                            color: PURPLE },
    { label: 'Probability-Weighted',   value: weightedPipeline, pct: (weightedPipeline / totalPipeline) * 100,      color: BLUE },
    { label: 'Expected Annual ARR',    value: weightedPipeline * 0.85, pct: (weightedPipeline * 0.85 / totalPipeline) * 100, color: TEAL },
    { label: 'COIG Revenue Impact',    value: weightedPipeline * 0.85 * 0.15, pct: (weightedPipeline * 0.85 * 0.15 / totalPipeline) * 100, color: GREEN },
  ]

  if (isLoading && deployments.length === 0 && leadsRaw.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ height: 28, width: 260, borderRadius: 8, background: 'var(--os-surface-0)' }} className="animate-pulse" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height: 80, borderRadius: 10, background: 'var(--os-surface-0)' }} className="animate-pulse" />)}
        </div>
      </div>
    )
  }

  const maxLeadVal = Math.max(...leads.map(l => l.value ?? 0), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <TrendingUp style={{ width: 20, height: 20, color: GREEN }} />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--os-text-1)', margin: 0 }}>Revenue Intelligence</h2>
        </div>
        <p style={{ fontSize: 12, color: 'var(--os-text-3)', margin: 0 }}>
          CRM pipeline → probability-weighted ARR → COIG™ impact waterfall
        </p>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <SignalCard icon={DollarSign} label="Total Pipeline"  value={fmtINR(totalPipeline)}                       sub={`${leads.length} prospects`}            color={PURPLE} />
        <SignalCard icon={Target}     label="Prob. Weighted"  value={fmtINR(Math.round(weightedPipeline))}       sub="Expected close value"                   color={BLUE}   />
        <SignalCard icon={Activity}   label="Live COIG™ Gain" value={liveCustomers.length > 0 ? `+${totalCoig.toFixed(1)}` : '—'} sub={`${liveCustomers.length} active customers`} color={TEAL}   />
        <SignalCard icon={BarChart3}  label="Avg OIS™"        value={liveCustomers.length > 0 ? avgOis.toFixed(1) : '—'}         sub="Across live deployments"                color={GREEN}  />
      </div>

      {/* Waterfall */}
      <div style={{
        background: 'var(--os-card)', border: '1px solid var(--os-border)',
        borderRadius: 14, padding: '20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <TrendingUp style={{ width: 14, height: 14, color: GREEN }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--os-text-1)' }}>Pipeline → COIG Waterfall</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {waterfallRows.map((r, i) => (
            <WaterfallRow
              key={r.label}
              label={r.label}
              value={r.value}
              pct={r.pct}
              color={r.color}
              isLast={i === waterfallRows.length - 1}
            />
          ))}
        </div>
        <div style={{
          marginTop: 16, padding: '10px 14px',
          background: GREEN + '08', border: `1px solid ${GREEN}20`, borderRadius: 8,
          fontSize: 10, color: 'var(--os-text-3)', lineHeight: 1.6,
        }}>
          <strong style={{ color: GREEN }}>How this works:</strong> Each prospect is weighted by stage conversion probability
          (Negotiation 80%, Proposal 60%, Qualified 30%). COIG Revenue Impact estimates the downstream operational
          intelligence gain as 15% of expected ARR — the value unlocked by running WAANDA Enterprise.
        </div>
      </div>

      {/* CRM leads breakdown */}
      <div style={{
        background: 'var(--os-card)', border: '1px solid var(--os-border)',
        borderRadius: 14, padding: '20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Users style={{ width: 14, height: 14, color: BLUE } } />
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--os-text-1)' }}>CRM Pipeline — Enterprise Prospects</span>
          <span style={{
            marginLeft: 'auto', fontSize: 9, fontWeight: 700, padding: '3px 8px',
            borderRadius: 10, background: GOLD + '18', color: GOLD, border: `1px solid ${GOLD}30`,
          }}>{fmtINR(totalPipeline)} total</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {leads.map(l => <LeadRow key={l.id} lead={l} maxVal={maxLeadVal} />)}
        </div>
      </div>

      {/* Live customer health signals */}
      {liveCustomers.length > 0 && (
        <div style={{
          background: 'var(--os-card)', border: '1px solid var(--os-border)',
          borderRadius: 14, padding: '20px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Zap style={{ width: 14, height: 14, color: TEAL }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--os-text-1)' }}>Live Customer — Revenue at Risk Signals</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {liveCustomers.map(d => {
              const oisPct = d.currentOis ?? 0
              const risk   = oisPct < 60 ? 'HIGH' : oisPct < 75 ? 'MEDIUM' : 'LOW'
              const rCol   = risk === 'HIGH' ? RED : risk === 'MEDIUM' ? AMBER : GREEN
              const daysSince = d.goLiveAt ? Math.floor((Date.now() - new Date(d.goLiveAt).getTime()) / 86400000) : 0
              return (
                <div key={d.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 10,
                  background: 'var(--os-surface-3)', border: `1px solid ${rCol}20`,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)' }}>{d.customerName}</span>
                      <span style={{ fontSize: 9, color: 'var(--os-text-4)' }}>{d.pack}</span>
                      <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginLeft: 'auto' }}>Day {daysSince}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 }}>
                      <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--os-text-4)' }}>OIS™</span>
                      <div style={{ width: 80, height: 4, borderRadius: 3, background: 'var(--os-surface-0)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${oisPct}%`, background: rCol, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 800, color: rCol, fontVariantNumeric: 'tabular-nums' }}>{oisPct}</span>
                      <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginLeft: 8 }}>COIG™ +{(d.coig ?? 0).toFixed(1)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {risk !== 'LOW' && (
                      <AlertTriangle style={{ width: 12, height: 12, color: rCol }} />
                    )}
                    <span style={{
                      fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6,
                      background: rCol + '15', color: rCol,
                    }}>{risk} RISK</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {liveCustomers.length === 0 && (
        <div style={{
          padding: '32px 24px', textAlign: 'center',
          background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 14,
        }}>
          <Activity style={{ width: 28, height: 28, color: 'var(--os-text-4)', margin: '0 auto 8px' }} />
          <p style={{ fontSize: 12, color: 'var(--os-text-3)', margin: 0 }}>No live customers yet.</p>
          <p style={{ fontSize: 11, color: 'var(--os-text-4)', marginTop: 4 }}>
            Activate a customer deployment to see COIG health signals here.
          </p>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@lib/api'
import {
  Brain, TrendingUp, FolderKanban, DollarSign,
  Users, Cpu, GitMerge, RefreshCw, CheckCircle2,
  AlertTriangle, AlertOctagon, ChevronRight, Lightbulb,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type CoachCategory = 'DELIVERY' | 'FINANCE' | 'PIPELINE' | 'INTELLIGENCE' | 'CROSS_DEPT'
type Priority      = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

interface CoachingInsight {
  id:             string
  category:       CoachCategory
  pattern:        string
  evidence:       Record<string, unknown>
  insight:        string
  recommendation: string
  priority:       Priority
  oisImpact:      number
  confidence:     number
  isActed:        boolean
  actedAt:        string | null
  generatedAt:    string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SURFACE = 'var(--os-card)'
const BORDER  = 'var(--os-border)'
const TEXT1   = 'var(--os-text-1)'
const TEXT2   = 'var(--os-text-2)'
const GREEN   = '#00c875'
const BLUE    = '#2564ea'
const GOLD    = '#eab308'
const PURPLE  = '#a855f7'
const TEAL    = '#0ea5e9'
const RED     = '#e2445c'

const PRIORITY_COLOR: Record<Priority, string> = {
  CRITICAL: RED, HIGH: '#fdab3d', MEDIUM: BLUE, LOW: GREEN,
}

const CATEGORY_META: Record<CoachCategory, { label: string; icon: any; color: string }> = {
  DELIVERY:      { label: 'Delivery',      icon: FolderKanban, color: TEAL   },
  FINANCE:       { label: 'Finance',       icon: DollarSign,   color: GOLD   },
  PIPELINE:      { label: 'Pipeline',      icon: TrendingUp,   color: BLUE   },
  INTELLIGENCE:  { label: 'Intelligence',  icon: Cpu,          color: PURPLE },
  CROSS_DEPT:    { label: 'Cross-Dept',    icon: GitMerge,     color: RED    },
}

// ── Insight card ──────────────────────────────────────────────────────────────

function InsightCard({ insight, onAct }: { insight: CoachingInsight; onAct: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const meta     = CATEGORY_META[insight.category]
  const pColor   = PRIORITY_COLOR[insight.priority]
  const CatIcon  = meta.icon

  return (
    <div style={{
      background:  insight.isActed ? `${GREEN}08` : SURFACE,
      border:      `1px solid ${insight.isActed ? `${GREEN}40` : BORDER}`,
      borderLeft:  `3px solid ${pColor}`,
      borderRadius: 10,
      padding:     '14px 16px',
      opacity:     insight.isActed ? 0.7 : 1,
      transition:  'all 0.2s',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          flexShrink: 0, width: 32, height: 32, borderRadius: 8,
          background: `${meta.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CatIcon size={14} style={{ color: meta.color }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, color: meta.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {meta.label}
            </span>
            <span style={{
              fontSize: 9, background: `${pColor}20`, color: pColor,
              padding: '1px 6px', borderRadius: 8, fontWeight: 700, textTransform: 'uppercase',
            }}>
              {insight.priority}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: 9, color: TEXT2 }}>
              {insight.confidence}% confidence
            </span>
          </div>
          <p style={{ fontSize: 12, fontWeight: 600, color: TEXT1, margin: 0, lineHeight: 1.4 }}>
            {insight.pattern}
          </p>
        </div>
      </div>

      {/* Insight text */}
      <div style={{
        margin: '10px 0 0 42px',
        fontSize: 12, color: TEXT2, lineHeight: 1.6,
      }}>
        {insight.insight}
      </div>

      {/* Recommendation */}
      <div style={{
        margin: '8px 0 0 42px',
        display: 'flex', alignItems: 'flex-start', gap: 6,
        background: `${BLUE}0c`, border: `1px solid ${BLUE}22`,
        borderRadius: 7, padding: '7px 10px',
      }}>
        <Lightbulb size={11} style={{ color: BLUE, flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 11, color: TEXT1, margin: 0, lineHeight: 1.5 }}>
          {insight.recommendation}
        </p>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        margin: '10px 0 0 42px',
      }}>
        <span style={{
          fontSize: 9, background: `${GREEN}18`, color: GREEN,
          padding: '2px 7px', borderRadius: 8, fontWeight: 700,
        }}>
          +{insight.oisImpact.toFixed(1)} OIS
        </span>

        {/* Evidence toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            fontSize: 10, color: TEXT2, background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, padding: 0,
          }}
        >
          Evidence
          <ChevronRight size={11} style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
        </button>

        {!insight.isActed ? (
          <button
            onClick={() => onAct(insight.id)}
            style={{
              marginLeft: 'auto', fontSize: 10, background: `${GREEN}20`,
              color: GREEN, border: `1px solid ${GREEN}44`,
              borderRadius: 7, padding: '3px 10px', cursor: 'pointer', fontWeight: 600,
            }}
          >
            Mark Acted
          </button>
        ) : (
          <span style={{ marginLeft: 'auto', fontSize: 10, color: GREEN, fontWeight: 600 }}>
            <CheckCircle2 size={11} style={{ display: 'inline', marginRight: 3 }} />
            Acted {insight.actedAt ? new Date(insight.actedAt).toLocaleDateString() : ''}
          </span>
        )}
      </div>

      {/* Evidence panel */}
      {expanded && (
        <div style={{
          margin: '8px 0 0 42px', background: 'var(--os-surface-0)',
          borderRadius: 7, padding: '8px 10px',
        }}>
          {Object.entries(insight.evidence).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 8, fontSize: 10, marginBottom: 3 }}>
              <span style={{ color: TEXT2, minWidth: 120 }}>{k}</span>
              <span style={{ color: TEXT1, fontWeight: 600 }}>{JSON.stringify(v)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function EnterpriseCoachPage() {
  const qc = useQueryClient()
  const [filter, setFilter] = useState<CoachCategory | 'ALL'>('ALL')

  const { data: insights = [], isLoading } = useQuery<CoachingInsight[]>({
    queryKey: ['enterprise-coach'],
    queryFn:  () => adminApi('/admin/enterprise/coach'),
    staleTime: 60_000,
  })

  const refresh = useMutation({
    mutationFn: () => adminApi('/admin/enterprise/coach/refresh', { method: 'POST' }),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['enterprise-coach'] }),
  })

  const act = useMutation({
    mutationFn: (id: string) => adminApi(`/admin/enterprise/coach/${id}/act`, { method: 'POST' }),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['enterprise-coach'] }),
  })

  const visible    = filter === 'ALL' ? insights : insights.filter(i => i.category === filter)
  const critical   = insights.filter(i => i.priority === 'CRITICAL').length
  const high       = insights.filter(i => i.priority === 'HIGH').length
  const totalOIS   = insights.reduce((s, i) => s + i.oisImpact, 0)
  const unacted    = insights.filter(i => !i.isActed).length

  const categories = (['ALL', 'DELIVERY', 'FINANCE', 'PIPELINE', 'INTELLIGENCE', 'CROSS_DEPT'] as const)

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 10, color: TEXT2 }}>
        <Brain size={16} style={{ animation: 'spin 1s linear infinite' }} />
        WAANDA is scanning patterns across departments…
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Brain size={16} style={{ color: PURPLE }} />
            <h2 style={{ fontSize: 15, fontWeight: 800, color: TEXT1, margin: 0 }}>Enterprise Coach™</h2>
            <span style={{ fontSize: 9, background: `${PURPLE}18`, color: PURPLE, padding: '2px 7px', borderRadius: 8, fontWeight: 700 }}>
              WAANDA
            </span>
          </div>
          <p style={{ fontSize: 11, color: TEXT2, margin: 0 }}>
            Cross-department patterns that no single team can see
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Summary chips */}
          {critical > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${RED}15`, borderRadius: 8, padding: '4px 10px' }}>
              <AlertOctagon size={11} style={{ color: RED }} />
              <span style={{ fontSize: 10, color: RED, fontWeight: 700 }}>{critical} critical</span>
            </div>
          )}
          {high > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `#fdab3d18`, borderRadius: 8, padding: '4px 10px' }}>
              <AlertTriangle size={11} style={{ color: '#fdab3d' }} />
              <span style={{ fontSize: 10, color: '#fdab3d', fontWeight: 700 }}>{high} high</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${GREEN}15`, borderRadius: 8, padding: '4px 10px' }}>
            <TrendingUp size={11} style={{ color: GREEN }} />
            <span style={{ fontSize: 10, color: GREEN, fontWeight: 700 }}>+{totalOIS.toFixed(1)} OIS potential</span>
          </div>
          <button
            onClick={() => refresh.mutate()}
            disabled={refresh.isPending}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 10, background: SURFACE, color: TEXT2,
              border: `1px solid ${BORDER}`, borderRadius: 7,
              padding: '5px 10px', cursor: 'pointer',
            }}
          >
            <RefreshCw size={11} style={{ animation: refresh.isPending ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Category filter tabs ── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {categories.map(cat => {
          const meta   = cat === 'ALL' ? null : CATEGORY_META[cat]
          const count  = cat === 'ALL' ? insights.length : insights.filter(i => i.category === cat).length
          const active = filter === cat
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 11, fontWeight: active ? 700 : 500,
                color: active ? (meta?.color ?? BLUE) : TEXT2,
                background: active ? `${meta?.color ?? BLUE}15` : 'transparent',
                border: `1px solid ${active ? (meta?.color ?? BLUE) + '44' : BORDER}`,
                borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {meta && <meta.icon size={11} />}
              {cat === 'ALL' ? 'All' : meta?.label}
              {count > 0 && (
                <span style={{
                  fontSize: 9, background: active ? `${meta?.color ?? BLUE}30` : 'var(--os-surface-0)',
                  color: active ? (meta?.color ?? BLUE) : TEXT2,
                  borderRadius: 6, padding: '0px 5px', fontWeight: 700,
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
        {unacted > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT2, alignSelf: 'center' }}>
            {unacted} unacted
          </span>
        )}
      </div>

      {/* ── Insights list ── */}
      {visible.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: TEXT2 }}>
          <Users size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p style={{ fontSize: 13, margin: 0 }}>No patterns detected in this category.</p>
          <p style={{ fontSize: 11, marginTop: 6 }}>
            As more data flows through Projects, Finance, and Sales — WAANDA will surface patterns here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visible.map(insight => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onAct={(id) => act.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      {insights.length > 0 && (
        <div style={{
          fontSize: 10, color: TEXT2, textAlign: 'center',
          borderTop: `1px solid ${BORDER}`, paddingTop: 12,
        }}>
          Patterns generated {new Date(insights[0].generatedAt).toLocaleString('en-GB', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
          })} · Refreshes every 24h or on demand · Acting on insights logs to Adoption Intelligence
        </div>
      )}
    </div>
  )
}

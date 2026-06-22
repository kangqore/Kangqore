/**
 * WorkflowBuilder — Apple-grade rebuild
 * 4-surface dark system, no light-theme classes
 */
import { useState, useEffect } from 'react'
import {
  Play, GitBranch, Bell, Clock, CheckSquare, Zap, Link,
  ChevronRight, CheckCircle2, XCircle, PauseCircle, FileEdit,
  TrendingUp, Timer, RotateCcw, Tag,
} from 'lucide-react'
import { useWorkflowsStore } from '../store'
import type { WorkflowStep, Workflow } from '../types'

// ── Design tokens ─────────────────────────────────────────────────────────────

const BG    = '#080c18'
const CARD  = '#0d1117'
const RAISE = '#121d30'
const EDGE  = '#1e2b40'
const BLUE   = '#2564ea'
const PURPLE = '#7f53f9'
const GREEN  = '#00c875'
const AMBER  = '#fdab3d'
const RED    = '#e2445c'
const SLATE  = '#64748b'
const EASE   = 'cubic-bezier(0.16, 1, 0.3, 1)'

let _inj = false
function ensureKf() {
  if (_inj) return; _inj = true
  const s = document.createElement('style')
  s.textContent = `@keyframes _fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`
  document.head.appendChild(s)
}
const anim = (d: number): React.CSSProperties => ({ animation: `_fadeUp 0.55s ${EASE} ${d}ms both` })

// ── Step type config (all dark) ────────────────────────────────────────────────

const STEP_CONFIG: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  action:       { label: 'Action',      color: BLUE,   Icon: Play         },
  condition:    { label: 'Condition',   color: AMBER,  Icon: GitBranch    },
  notification: { label: 'Notify',      color: GREEN,  Icon: Bell         },
  delay:        { label: 'Wait',        color: SLATE,  Icon: Clock        },
  approval:     { label: 'Approval',    color: PURPLE, Icon: CheckSquare  },
  integration:  { label: 'Integration', color: RED,    Icon: Link         },
}

// ── Workflow status config ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { color: string; Icon: React.ElementType; label: string }> = {
  active:   { color: GREEN,  Icon: CheckCircle2, label: 'Active'   },
  paused:   { color: AMBER,  Icon: PauseCircle,  label: 'Paused'   },
  draft:    { color: SLATE,  Icon: FileEdit,     label: 'Draft'    },
  archived: { color: RED,    Icon: XCircle,      label: 'Archived' },
}

const CAT_COLOR: Record<string, string> = {
  sales: BLUE, delivery: GREEN, hr: PURPLE, finance: AMBER, ops: SLATE, marketing: RED,
}

// ── Step node ─────────────────────────────────────────────────────────────────

function StepNode({
  step, index, isSelected, isLast, onClick,
}: {
  step: WorkflowStep
  index: number
  isSelected: boolean
  isLast: boolean
  onClick: () => void
}) {
  const cfg   = STEP_CONFIG[step.type] ?? STEP_CONFIG.action
  const { Icon, color } = cfg

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
      {/* Connector column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 28 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: isSelected ? `${color}20` : RAISE,
          border: `1px solid ${isSelected ? color : EDGE}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: isSelected ? color : '#334155',
          fontVariantNumeric: 'tabular-nums', marginTop: 14,
        }}>
          {index + 1}
        </div>
        {!isLast && (
          <div style={{ width: 1, flex: 1, background: `linear-gradient(to bottom, ${EDGE}, transparent)`, margin: '4px 0' }} />
        )}
      </div>

      {/* Node card */}
      <button
        onClick={onClick}
        style={{
          flex: 1, textAlign: 'left', padding: '14px 16px',
          borderRadius: 14, marginBottom: isLast ? 0 : 10,
          background: isSelected ? `${color}0a` : CARD,
          border: `1px solid ${isSelected ? color : EDGE}`,
          borderLeft: `3px solid ${color}`,
          cursor: 'pointer',
          boxShadow: isSelected ? `0 0 20px ${color}15, inset 0 1px 0 rgba(13,17,23,0.4)` : `inset 0 1px 0 rgba(255,255,255,0.02)`,
          transition: `all 0.2s ${EASE}`,
        }}
        onMouseEnter={e => {
          if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = `${color}50`
        }}
        onMouseLeave={e => {
          if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = EDGE
        }}
      >
        {/* Type chip + icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            background: `${color}16`, border: `1px solid ${color}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon style={{ width: 11, height: 11, color }} />
          </div>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            color, background: `${color}12`, border: `1px solid ${color}20`,
            padding: '2px 6px', borderRadius: 4,
          }}>
            {cfg.label}
          </span>
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', margin: '0 0 4px' }}>{step.name}</p>
        <p style={{ fontSize: 11, color: '#475569', margin: 0, lineHeight: 1.5 }}>{step.description}</p>
      </button>
    </div>
  )
}

// ── Workflow list row ──────────────────────────────────────────────────────────

function WorkflowRow({ wf, isSelected, onClick }: { wf: Workflow; isSelected: boolean; onClick: () => void }) {
  const sc       = STATUS_CONFIG[wf.status] ?? STATUS_CONFIG.draft
  const catColor = CAT_COLOR[wf.category] ?? SLATE
  const rate     = wf.runsTotal > 0 ? Math.round((wf.runsSuccess / wf.runsTotal) * 100) : null

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        background: isSelected ? `${BLUE}08` : 'transparent',
        borderLeft: `3px solid ${isSelected ? BLUE : 'transparent'}`,
        borderBottom: `1px solid ${EDGE}`,
        cursor: 'pointer', transition: `all 0.15s ${EASE}`,
      }}
      onMouseEnter={e => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.background = `${RAISE}`
      }}
      onMouseLeave={e => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'
      }}
    >
      {/* Status dot */}
      <div style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: `${sc.color}12`, border: `1px solid ${sc.color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <sc.Icon style={{ width: 13, height: 13, color: sc.color }} />
      </div>

      {/* Name + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 12, fontWeight: 600, color: isSelected ? '#f1f5f9' : '#94a3b8',
          margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {wf.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: catColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {wf.category}
          </span>
          <span style={{ fontSize: 9, color: '#1e2b40' }}>·</span>
          <span style={{ fontSize: 10, color: '#334155' }}>{wf.steps.length} steps</span>
          {rate !== null && (
            <>
              <span style={{ fontSize: 9, color: '#1e2b40' }}>·</span>
              <span style={{ fontSize: 10, color: rate >= 90 ? GREEN : rate >= 70 ? AMBER : RED }}>
                {rate}%
              </span>
            </>
          )}
        </div>
      </div>

      <ChevronRight style={{ width: 13, height: 13, color: '#334155', flexShrink: 0 }} />
    </button>
  )
}

// ── Step detail panel ─────────────────────────────────────────────────────────

function StepDetail({ step }: { step: WorkflowStep }) {
  const cfg = STEP_CONFIG[step.type] ?? STEP_CONFIG.action

  return (
    <div style={{
      ...anim(0),
      marginTop: 16, borderRadius: 16, padding: '20px 20px',
      background: `${cfg.color}06`, border: `1px solid ${cfg.color}20`,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: `${cfg.color}16`, border: `1px solid ${cfg.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <cfg.Icon style={{ width: 14, height: 14, color: cfg.color }} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{step.name}</p>
          <p style={{ fontSize: 10, color: cfg.color, margin: '2px 0 0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Step {step.order} · {cfg.label}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div style={{ padding: '10px 12px', borderRadius: 10, background: RAISE, border: `1px solid ${EDGE}` }}>
          <p style={{ fontSize: 9, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>Type</p>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
            color: cfg.color, background: `${cfg.color}14`, border: `1px solid ${cfg.color}25`,
          }}>
            {cfg.label}
          </span>
        </div>
        <div style={{ padding: '10px 12px', borderRadius: 10, background: RAISE, border: `1px solid ${EDGE}` }}>
          <p style={{ fontSize: 9, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>Order</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>Step {step.order}</p>
        </div>
      </div>

      <div style={{ padding: '12px 14px', borderRadius: 10, background: RAISE, border: `1px solid ${EDGE}` }}>
        <p style={{ fontSize: 9, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Description</p>
        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{step.description}</p>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function WorkflowBuilder() {
  const { workflows, selectedId, setSelected } = useWorkflowsStore()
  const [selectedStep, setSelectedStep] = useState<string | null>(null)

  useEffect(() => { ensureKf() }, [])

  const wf   = workflows.find(w => w.id === selectedId) ?? workflows[0]
  const step = wf?.steps.find(s => s.id === selectedStep)

  if (!wf) return (
    <div style={{ padding: 48, textAlign: 'center', color: '#334155', fontSize: 13 }}>
      No workflows found.
    </div>
  )

  const sc         = STATUS_CONFIG[wf.status] ?? STATUS_CONFIG.draft
  const catColor   = CAT_COLOR[wf.category] ?? SLATE
  const successRate = wf.runsTotal > 0 ? Math.round((wf.runsSuccess / wf.runsTotal) * 100) : null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>

      {/* ── Left: workflow list ─────────────────────────────────────────── */}
      <div style={{
        ...anim(0),
        borderRadius: 20, overflow: 'hidden',
        background: CARD, border: `1px solid ${EDGE}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03)`,
      }}>
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${EDGE}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GitBranch style={{ width: 14, height: 14, color: BLUE }} />
            <p style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Workflows</p>
            <span style={{
              marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
              color: BLUE, background: `${BLUE}14`, border: `1px solid ${BLUE}25`,
            }}>
              {workflows.length}
            </span>
          </div>
        </div>
        <div>
          {workflows.map(w => (
            <WorkflowRow
              key={w.id}
              wf={w}
              isSelected={w.id === (selectedId ?? wf.id)}
              onClick={() => { setSelected(w.id); setSelectedStep(null) }}
            />
          ))}
        </div>
      </div>

      {/* ── Right: canvas ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Canvas card */}
        <div style={{
          ...anim(60),
          borderRadius: 20, overflow: 'hidden',
          background: CARD, border: `1px solid ${EDGE}`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03)`,
        }}>

          {/* Canvas header */}
          <div style={{
            padding: '18px 24px', borderBottom: `1px solid ${EDGE}`,
            background: RAISE,
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{wf.name}</h3>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 999, flexShrink: 0,
                  color: catColor, background: `${catColor}14`, border: `1px solid ${catColor}25`,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {wf.category}
                </span>
              </div>
              <p style={{ fontSize: 11, color: '#475569', margin: '4px 0 0', lineHeight: 1.5 }}>{wf.description}</p>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
              {wf.runsTotal > 0 && (
                <>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 10, color: '#334155', margin: '0 0 2px' }}>Runs</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', margin: 0, fontVariantNumeric: 'tabular-nums' }}>{wf.runsTotal}</p>
                  </div>
                  {successRate !== null && (
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: '#334155', margin: '0 0 2px' }}>Success</p>
                      <p style={{
                        fontSize: 14, fontWeight: 700, margin: 0, fontVariantNumeric: 'tabular-nums',
                        color: successRate >= 90 ? GREEN : successRate >= 70 ? AMBER : RED,
                      }}>{successRate}%</p>
                    </div>
                  )}
                  {wf.avgDuration > 0 && (
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: '#334155', margin: '0 0 2px' }}>Avg</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', margin: 0 }}>{wf.avgDuration}m</p>
                    </div>
                  )}
                </>
              )}

              {/* Status badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 12px', borderRadius: 10,
                background: `${sc.color}12`, border: `1px solid ${sc.color}25`,
              }}>
                <sc.Icon style={{ width: 12, height: 12, color: sc.color }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: sc.color }}>{sc.label}</span>
              </div>

              {wf.status === 'draft' && (
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '7px 14px', borderRadius: 10, border: 'none',
                  background: BLUE, color: '#fff', fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', boxShadow: `0 4px 14px ${BLUE}40`,
                  transition: `all 0.2s ${EASE}`,
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${BLUE}55`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 14px ${BLUE}40`}
                >
                  <Play style={{ width: 11, height: 11 }} />
                  Activate
                </button>
              )}
            </div>
          </div>

          {/* Canvas body */}
          <div style={{ padding: '24px 24px' }}>

            {/* Trigger block */}
            <div style={{
              ...anim(80),
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 18px', borderRadius: 14, marginBottom: 24,
              background: `${PURPLE}08`,
              border: `1px solid ${PURPLE}20`,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: `inset 0 1px 0 rgba(13,17,23,0.4), 0 4px 16px ${PURPLE}0a`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: `${PURPLE}16`, border: `1px solid ${PURPLE}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap style={{ width: 16, height: 16, color: PURPLE }} />
              </div>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: PURPLE, margin: '0 0 4px' }}>
                  Trigger
                </p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', margin: 0 }}>{wf.triggerConfig}</p>
              </div>
            </div>

            {/* Steps flow */}
            <div>
              {wf.steps.map((s, i) => (
                <div key={s.id} style={{ animation: `_fadeUp 0.55s ${EASE} ${100 + i * 50}ms both` }}>
                  <StepNode
                    step={s}
                    index={i}
                    isSelected={selectedStep === s.id}
                    isLast={i === wf.steps.length - 1}
                    onClick={() => setSelectedStep(selectedStep === s.id ? null : s.id)}
                  />
                </div>
              ))}
            </div>

            {/* Step detail inline */}
            {step && <StepDetail step={step} />}

          </div>
        </div>

        {/* Meta footer: tags + owner + run info */}
        <div style={{
          ...anim(200),
          marginTop: 16, borderRadius: 16, padding: '14px 20px',
          background: CARD, border: `1px solid ${EDGE}`,
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        }}>

          {/* Tags */}
          {wf.tags.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag style={{ width: 11, height: 11, color: '#334155' }} />
              {wf.tags.map(t => (
                <span key={t} style={{
                  fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 999,
                  color: '#475569', background: RAISE, border: `1px solid ${EDGE}`,
                }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div style={{ flex: 1 }} />

          {/* Owner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              background: `${BLUE}20`, border: `1px solid ${BLUE}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700, color: BLUE,
            }}>
              {wf.owner.charAt(0)}
            </div>
            <span style={{ fontSize: 11, color: '#475569' }}>{wf.owner}</span>
          </div>

          {/* Last run */}
          {wf.lastRun && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <RotateCcw style={{ width: 11, height: 11, color: '#334155' }} />
              <span style={{ fontSize: 11, color: '#475569' }}>
                Last: {wf.lastRun.slice(0, 16).replace('T', ' ')}
              </span>
            </div>
          )}

          {/* Next run */}
          {wf.nextRun && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Timer style={{ width: 11, height: 11, color: '#334155' }} />
              <span style={{ fontSize: 11, color: '#475569' }}>
                Next: {wf.nextRun.slice(0, 16).replace('T', ' ')}
              </span>
            </div>
          )}

          {/* Success rate bar */}
          {successRate !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp style={{ width: 11, height: 11, color: '#334155' }} />
              <div style={{ width: 60, height: 4, borderRadius: 99, background: EDGE, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  width: `${successRate}%`,
                  background: successRate >= 90 ? GREEN : successRate >= 70 ? AMBER : RED,
                  transition: `width 0.8s ${EASE}`,
                }} />
              </div>
              <span style={{ fontSize: 10, color: '#475569', fontVariantNumeric: 'tabular-nums' }}>
                {wf.runsSuccess}/{wf.runsTotal}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

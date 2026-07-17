import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Building2, Plus, Edit2, Trash2, Globe2, TrendingUp, Activity,
  ChevronDown, ChevronUp, Mail, X, Check, Users, Zap, Settings2,
  BarChart3, Calendar, Shield, FileText, RefreshCw,
} from 'lucide-react'
import { adminApi } from '@lib/api'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface CustomerDeployment {
  id:           string
  customerName: string
  industry:     string
  pack:         string
  goLiveAt:     string | null
  currentOis:   number
  coig:         number
  milestone:    string
  contactName:  string | null
  contactEmail: string | null
  notes:        string | null
  createdAt:    string
}

// ─── Design tokens ─────────────────────────────────────────────────────────────

const GREEN  = '#10b981'
const BLUE   = '#2564ea'
const AMBER  = '#f59e0b'
const PURPLE = '#7c3aed'
const TEAL   = '#0d9488'
const RED    = '#ef4444'
const GOLD   = '#fbbf24'

const MILESTONE_CONFIG: Record<string, { color: string; label: string; order: number }> = {
  ONBOARDING: { color: AMBER,  label: 'Onboarding', order: 1 },
  LIVE:       { color: GREEN,  label: 'Live',        order: 2 },
  GROWING:    { color: TEAL,   label: 'Growing',     order: 3 },
  MATURE:     { color: BLUE,   label: 'Mature',      order: 4 },
  RENEWAL:    { color: PURPLE, label: 'Renewal',     order: 5 },
  CHURNED:    { color: RED,    label: 'Churned',     order: 6 },
}

const PIPELINE_STAGES = ['ONBOARDING', 'LIVE', 'GROWING', 'MATURE', 'RENEWAL']

const EMPTY_FORM = {
  customerName: '',
  industry:     '',
  pack:         'professional-services',
  milestone:    'ONBOARDING',
  contactName:  '',
  contactEmail: '',
  notes:        '',
}

function fmt(n: number) { return n.toFixed(1) }
function oisColor(n: number) { return n >= 80 ? GREEN : n >= 65 ? AMBER : RED }
function coigColor(n: number) { return n >= 10 ? GREEN : n >= 5 ? AMBER : 'var(--os-text-4)' }

// ─── Customer card ─────────────────────────────────────────────────────────────

function CustomerCard({
  d, onEdit, onDelete, onActivate,
}: { d: CustomerDeployment; onEdit: () => void; onDelete: () => void; onActivate?: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const mc = MILESTONE_CONFIG[d.milestone] ?? { color: 'var(--os-text-4)', label: d.milestone, order: 0 }
  const oCol = oisColor(d.currentOis ?? 0)
  const cCol = coigColor(d.coig ?? 0)

  return (
    <div style={{
      background: 'var(--os-card)',
      border: `1px solid var(--os-border)`,
      borderTop: `3px solid ${mc.color}`,
      borderRadius: 12,
      overflow: 'hidden',
      transition: 'box-shadow 0.15s, border-color 0.15s',
      boxShadow: 'var(--os-shadow-card)',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 24px ${mc.color}18` }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--os-shadow-card)' }}
    >
      <div style={{ padding: '14px 16px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--os-text-1)', lineHeight: 1.3 }}>{d.customerName}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
                background: mc.color + '18', color: mc.color,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>{mc.label}</span>
              {d.industry && (
                <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>{d.industry}</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <button onClick={onEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 5px', color: 'var(--os-text-4)', borderRadius: 5 }}>
              <Edit2 style={{ width: 12, height: 12 }} />
            </button>
            <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 5px', color: RED + '88', borderRadius: 5 }}>
              <Trash2 style={{ width: 12, height: 12 }} />
            </button>
          </div>
        </div>

        {/* OIS + COIG metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div style={{
            background: oCol + '0c', border: `1px solid ${oCol}22`, borderRadius: 8, padding: '8px 10px',
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>OIS™</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: oCol, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{fmt(d.currentOis ?? 0)}</div>
          </div>
          <div style={{
            background: cCol !== 'var(--os-text-4)' ? cCol + '0c' : 'var(--os-surface-3)',
            border: `1px solid ${cCol !== 'var(--os-text-4)' ? cCol + '22' : 'var(--os-border-subtle)'}`,
            borderRadius: 8, padding: '8px 10px',
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>COIG™</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: cCol, marginTop: 1 }}>+</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: cCol, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{fmt(d.coig ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* Pack + go-live */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{
            fontSize: 9, padding: '2px 7px', borderRadius: 4,
            background: PURPLE + '12', color: PURPLE, fontWeight: 600,
          }}>{d.pack}</span>
          {d.goLiveAt && (
            <span style={{ fontSize: 9, color: 'var(--os-text-4)' }}>
              Live: {new Date(d.goLiveAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
            </span>
          )}
        </div>

        {/* ONBOARDING spotlight */}
        {d.milestone === 'ONBOARDING' && (
          <div style={{
            background: AMBER + '09', border: `1px solid ${AMBER}25`,
            borderRadius: 8, padding: '8px 10px', marginBottom: 8,
          }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: AMBER, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
              Blueprint · Customization in Progress
            </div>
            {d.goLiveAt && (() => {
              const days = Math.ceil((new Date(d.goLiveAt).getTime() - Date.now()) / 86400000)
              return (
                <div style={{ fontSize: 10, color: 'var(--os-text-3)', fontWeight: 600 }}>
                  {days > 0 ? `${days}d to target go-live` : 'Go-live target reached'}
                </div>
              )
            })()}
          </div>
        )}

        {/* ONBOARDING actions */}
        {d.milestone === 'ONBOARDING' && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <a
              href="/kangqore-view/admin/kangqore-immp/blueprint-customize"
              style={{
                flex: 1, background: BLUE + '10', border: `1px solid ${BLUE}30`,
                borderRadius: 7, padding: '7px 10px',
                fontSize: 10, fontWeight: 700, color: BLUE,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                textDecoration: 'none',
              }}
            >
              <Settings2 style={{ width: 11, height: 11 }} />
              Customize Blueprint
            </a>
            {onActivate && (
              <button
                onClick={onActivate}
                style={{
                  flex: 1,
                  background: GREEN + '10', border: `1px solid ${GREEN}30`,
                  borderRadius: 7, padding: '7px 10px',
                  fontSize: 10, fontWeight: 700, color: GREEN,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}
              >
                <Globe2 style={{ width: 11, height: 11 }} />
                Activate → LIVE
              </button>
            )}
          </div>
        )}

        {/* Expand: contact + notes */}
        {(d.contactName || d.notes) && (
          <>
            <button
              onClick={() => setExpanded(e => !e)}
              style={{
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                fontSize: 9, fontWeight: 600, color: 'var(--os-text-4)',
                paddingTop: 6, borderTop: '1px solid var(--os-border-subtle)',
              }}
            >
              {expanded ? <ChevronUp style={{ width: 10, height: 10 }} /> : <ChevronDown style={{ width: 10, height: 10 }} />}
              {expanded ? 'Less' : 'Details'}
            </button>
            {expanded && (
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {d.contactName && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail style={{ width: 10, height: 10, color: 'var(--os-text-4)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-2)' }}>{d.contactName}</div>
                      {d.contactEmail && <div style={{ fontSize: 9, color: 'var(--os-text-4)' }}>{d.contactEmail}</div>}
                    </div>
                  </div>
                )}
                {d.notes && (
                  <p style={{ fontSize: 10, color: 'var(--os-text-4)', lineHeight: 1.5, margin: 0 }}>{d.notes}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Activation modal ──────────────────────────────────────────────────────────

function ActivationModal({
  d, onConfirm, onCancel, isPending,
}: { d: CustomerDeployment; onConfirm: (ois: number) => void; onCancel: () => void; isPending: boolean }) {
  const [ois, setOis] = useState(62)

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: 'var(--os-card)', border: `1px solid ${GREEN}44`,
        borderRadius: 14, padding: 24, width: 380, maxWidth: '90vw',
        boxShadow: `0 16px 48px ${GREEN}18`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Globe2 style={{ width: 16, height: 16, color: GREEN }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--os-text-1)' }}>Activate Customer</span>
          <button onClick={onCancel} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--os-text-4)' }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: '0 0 18px', lineHeight: 1.6 }}>
          Moving <strong style={{ color: 'var(--os-text-1)' }}>{d.customerName}</strong> from{' '}
          <span style={{ color: AMBER, fontWeight: 700 }}>Onboarding</span> to{' '}
          <span style={{ color: GREEN, fontWeight: 700 }}>LIVE</span>. Set the Day 0 OIS™ baseline to lock the starting score.
        </p>

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 10, color: 'var(--os-text-3)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            Day 0 OIS™ Score
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="range" min={0} max={100} value={ois}
              onChange={e => setOis(Number(e.target.value))}
              style={{ flex: 1, accentColor: oisColor(ois) }}
            />
            <span style={{ fontSize: 24, fontWeight: 900, color: oisColor(ois), minWidth: 38, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{ois}</span>
          </div>
          <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 5 }}>
            Typical enterprise Day 0: 55–70 · Target after 90 days: ≥80
          </div>
        </div>

        {d.goLiveAt && (
          <div style={{
            background: GREEN + '0a', border: `1px solid ${GREEN}20`, borderRadius: 8, padding: '8px 12px',
            fontSize: 10, color: GREEN, fontWeight: 700, marginBottom: 18,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Activity style={{ width: 11, height: 11 }} />
            Go-live date: {new Date(d.goLiveAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onConfirm(ois)}
            disabled={isPending}
            style={{
              flex: 1, background: GREEN, color: '#fff', border: 'none',
              borderRadius: 8, padding: '9px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              opacity: isPending ? 0.6 : 1,
            }}
          >
            <Globe2 style={{ width: 13, height: 13 }} />
            {isPending ? 'Activating…' : 'Confirm Activation'}
          </button>
          <button
            onClick={onCancel}
            style={{
              background: 'var(--os-surface-3)', color: 'var(--os-text-2)',
              border: '1px solid var(--os-border)', borderRadius: 8,
              padding: '9px 14px', fontSize: 12, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Add / Edit form ───────────────────────────────────────────────────────────

function DeploymentForm({
  editId, form, setForm, onSubmit, onCancel, isPending,
}: {
  editId: string | null
  form: typeof EMPTY_FORM
  setForm: (fn: (prev: typeof EMPTY_FORM) => typeof EMPTY_FORM) => void
  onSubmit: () => void
  onCancel: () => void
  isPending: boolean
}) {
  return (
    <div style={{
      background: 'var(--os-card)', border: `1px solid ${BLUE}44`,
      borderRadius: 12, padding: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--os-text-1)' }}>
          {editId ? 'Edit Deployment' : 'New Customer Deployment'}
        </span>
        <button onClick={onCancel} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--os-text-4)' }}>
          <X style={{ width: 14, height: 14 }} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {([
          ['customerName', 'Customer Name *', 'text'],
          ['industry',     'Industry',        'text'],
          ['pack',         'Pack',            'text'],
          ['contactName',  'Contact Name',    'text'],
          ['contactEmail', 'Contact Email',   'email'],
        ] as [keyof typeof EMPTY_FORM, string, string][]).map(([key, label, type]) => (
          <div key={key}>
            <label style={{ fontSize: 10, color: 'var(--os-text-3)', fontWeight: 700, letterSpacing: '0.05em', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>
              {label}
            </label>
            <input
              type={type}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              style={{
                width: '100%', background: 'var(--os-surface-0)', border: '1px solid var(--os-border)',
                borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--os-text-1)',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        ))}

        <div>
          <label style={{ fontSize: 10, color: 'var(--os-text-3)', fontWeight: 700, letterSpacing: '0.05em', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>
            Milestone
          </label>
          <select
            value={form.milestone}
            onChange={e => setForm(f => ({ ...f, milestone: e.target.value }))}
            style={{
              width: '100%', background: 'var(--os-surface-0)', border: '1px solid var(--os-border)',
              borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none',
            }}
          >
            {Object.entries(MILESTONE_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontSize: 10, color: 'var(--os-text-3)', fontWeight: 700, letterSpacing: '0.05em', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>
          Notes
        </label>
        <textarea
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          rows={2}
          style={{
            width: '100%', background: 'var(--os-surface-0)', border: '1px solid var(--os-border)',
            borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--os-text-1)',
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button
          onClick={onSubmit}
          disabled={isPending || !form.customerName.trim()}
          style={{
            background: BLUE, color: '#fff', border: 'none', borderRadius: 7,
            padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, opacity: isPending ? 0.6 : 1,
          }}
        >
          <Check style={{ width: 13, height: 13 }} />
          {editId ? 'Save Changes' : 'Add Deployment'}
        </button>
        <button
          onClick={onCancel}
          style={{
            background: 'var(--os-surface-3)', color: 'var(--os-text-2)',
            border: '1px solid var(--os-border)', borderRadius: 7,
            padding: '8px 14px', fontSize: 12, cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─── Customer Health Section ────────────────────────────────────────────────────

function HealthBar({ value, target, color }: { value: number; target: number; color: string }) {
  const pct = Math.min(100, (value / 100) * 100)
  const tpct = Math.min(100, (target / 100) * 100)
  return (
    <div style={{ position: 'relative', height: 8, borderRadius: 6, background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: color, borderRadius: 6, transition: 'width 0.6s ease' }} />
      <div style={{
        position: 'absolute', top: '50%', left: `${tpct}%`, transform: 'translate(-50%, -50%)',
        width: 2, height: '130%', background: '#fff4', borderRadius: 2,
      }} />
    </div>
  )
}

function CustomerHealthCard({ d }: { d: CustomerDeployment }) {
  const daysSinceLive = d.goLiveAt
    ? Math.floor((Date.now() - new Date(d.goLiveAt).getTime()) / 86400000)
    : 0
  const oCol   = oisColor(d.currentOis ?? 0)
  const target = d.currentOis && d.currentOis < 80 ? 80 : 90

  const pillars = [
    { label: 'Adoption',    pct: Math.min(95, (d.currentOis ?? 0) * 0.92 + 2) },
    { label: 'Governance',  pct: Math.min(95, (d.currentOis ?? 0) * 0.88 + 5) },
    { label: 'Intelligence',pct: Math.min(95, (d.currentOis ?? 0) * 0.85 + 4) },
    { label: 'Value',       pct: Math.min(95, (d.currentOis ?? 0) * 0.78 + 6) },
  ]

  return (
    <div style={{
      background: 'var(--os-card)', border: `1px solid ${GREEN}22`,
      borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--os-text-1)' }}>{d.customerName}</div>
          <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2 }}>{d.pack} · {d.industry}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Calendar style={{ width: 10, height: 10, color: 'var(--os-text-4)' }} />
          <span style={{ fontSize: 9, color: 'var(--os-text-4)', fontWeight: 600 }}>Day {daysSinceLive}</span>
        </div>
      </div>

      {/* OIS trajectory */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>OIS™ Trajectory</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: oCol, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{d.currentOis ?? 0}</span>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', fontWeight: 600 }}>/ {target} target</span>
          </div>
        </div>
        <HealthBar value={d.currentOis ?? 0} target={target} color={oCol} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: 'var(--os-text-4)', marginTop: 4 }}>
          <span>Day 0</span>
          <span style={{ color: oCol, fontWeight: 700 }}>Current</span>
          <span>Day 90 target: {target}</span>
        </div>
      </div>

      {/* Pillar breakdown */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>Pillar Health</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {pillars.map(p => (
            <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--os-text-3)', width: 80, flexShrink: 0 }}>{p.label}</span>
              <div style={{ flex: 1, height: 5, borderRadius: 4, background: 'var(--os-surface-0)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p.pct}%`, background: `linear-gradient(90deg, ${TEAL}, ${GREEN})`, borderRadius: 4, transition: 'width 0.7s ease' }} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-2)', width: 26, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{p.pct.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* COIG + quick actions */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <div style={{ flex: 1, background: TEAL + '0c', border: `1px solid ${TEAL}20`, borderRadius: 8, padding: '8px 10px' }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>COIG™</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: TEAL }}>+</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: TEAL, fontVariantNumeric: 'tabular-nums' }}>{fmt(d.coig ?? 0)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: BLUE + '10', border: `1px solid ${BLUE}25`,
            borderRadius: 7, padding: '5px 9px', fontSize: 9, fontWeight: 700, color: BLUE, cursor: 'pointer',
          }}>
            <BarChart3 style={{ width: 10, height: 10 }} /> QBR
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: AMBER + '10', border: `1px solid ${AMBER}25`,
            borderRadius: 7, padding: '5px 9px', fontSize: 9, fontWeight: 700, color: AMBER, cursor: 'pointer',
          }}>
            <Shield style={{ width: 10, height: 10 }} /> Risk
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border)',
            borderRadius: 7, padding: '5px 9px', fontSize: 9, fontWeight: 700, color: 'var(--os-text-3)', cursor: 'pointer',
          }}>
            <FileText style={{ width: 10, height: 10 }} /> Report
          </button>
        </div>
      </div>
    </div>
  )
}

function CustomerHealthSection({ deployments }: { deployments: CustomerDeployment[] }) {
  const [collapsed, setCollapsed] = useState(false)
  const live = deployments.filter(d => ['LIVE', 'GROWING', 'MATURE'].includes(d.milestone))
  if (live.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <Activity style={{ width: 13, height: 13, color: GREEN }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Live Customer Health
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
            background: GREEN + '15', color: GREEN, border: `1px solid ${GREEN}30`,
          }}>{live.length} LIVE</span>
          {collapsed ? <ChevronDown style={{ width: 12, height: 12, color: 'var(--os-text-4)' }} /> : <ChevronUp style={{ width: 12, height: 12, color: 'var(--os-text-4)' }} />}
        </button>
        <div style={{ flex: 1, height: 1, background: GREEN + '25' }} />
        <button
          onClick={() => {}}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--os-text-4)', fontSize: 9, fontWeight: 600 }}
        >
          <RefreshCw style={{ width: 10, height: 10 }} /> Refresh
        </button>
      </div>
      {!collapsed && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {live.map(d => <CustomerHealthCard key={d.id} d={d} />)}
        </div>
      )}
    </div>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export function DeploymentsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editId,   setEditId]   = useState<string | null>(null)
  const [form,     setForm]     = useState({ ...EMPTY_FORM })

  const { data: deployments = [], isLoading } = useQuery<CustomerDeployment[]>({
    queryKey: ['customer-deployments'],
    queryFn:  () => adminApi('/admin/enterprise/customer-deployments'),
    refetchInterval: 60_000,
  })

  const createMut = useMutation({
    mutationFn: (data: typeof EMPTY_FORM) =>
      adminApi('/admin/enterprise/customer-deployments', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-deployments'] })
      setShowForm(false); setForm({ ...EMPTY_FORM })
    },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<typeof EMPTY_FORM> }) =>
      adminApi(`/admin/enterprise/customer-deployments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-deployments'] })
      setEditId(null); setForm({ ...EMPTY_FORM }); setShowForm(false)
    },
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminApi(`/admin/enterprise/customer-deployments/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customer-deployments'] }),
  })

  const [activatingId, setActivatingId] = useState<string | null>(null)
  const activatingDep = deployments.find(d => d.id === activatingId) ?? null

  const activateMut = useMutation({
    mutationFn: ({ id, ois }: { id: string; ois: number }) =>
      adminApi(`/admin/enterprise/customer-deployments/${id}`, { method: 'PATCH', body: JSON.stringify({ milestone: 'LIVE', currentOis: ois }) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-deployments'] })
      setActivatingId(null)
    },
  })

  function startEdit(d: CustomerDeployment) {
    setEditId(d.id)
    setForm({ customerName: d.customerName, industry: d.industry, pack: d.pack, milestone: d.milestone, contactName: d.contactName ?? '', contactEmail: d.contactEmail ?? '', notes: d.notes ?? '' })
    setShowForm(true)
  }

  function submitForm() {
    if (!form.customerName.trim()) return
    if (editId) updateMut.mutate({ id: editId, data: form })
    else        createMut.mutate(form)
  }

  // Pipeline stages: group deployments by milestone in funnel order
  const pipelineGroups = PIPELINE_STAGES.map(stage => ({
    stage,
    cfg: MILESTONE_CONFIG[stage],
    items: deployments.filter(d => d.milestone === stage),
  }))

  const liveCount  = deployments.filter(d => ['LIVE','GROWING','MATURE'].includes(d.milestone)).length
  const avgOis     = deployments.length > 0 ? deployments.reduce((s, d) => s + (d.currentOis ?? 0), 0) / deployments.length : 0
  const totalCoig  = deployments.reduce((s, d) => s + (d.coig ?? 0), 0)
  const targetSlot = deployments.length === 0 ? 'Customer Zero' : deployments.length === 1 ? 'Customer One' : `Customer ${deployments.length + 1}`

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-pulse">
        <div style={{ height: 28, width: 240, borderRadius: 8, background: 'var(--os-surface-0)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: 72, borderRadius: 10, background: 'var(--os-surface-0)' }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--os-text-1)', margin: 0, lineHeight: 1.2 }}>Customer Deployments</h2>
          <p style={{ fontSize: 12, color: 'var(--os-text-3)', margin: '4px 0 0' }}>
            Enterprise deployments · OIS, COIG, and commercial milestones
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm({ ...EMPTY_FORM }) }}
          style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            background: BLUE, color: '#fff', border: 'none', borderRadius: 8,
            padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}
        >
          <Plus style={{ width: 13, height: 13 }} /> Add Customer
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Deployments', value: String(deployments.length), icon: Building2, col: BLUE   },
          { label: 'Live Customers',    value: String(liveCount),           icon: Activity,  col: GREEN  },
          { label: 'Avg OIS™',          value: deployments.length > 0 ? avgOis.toFixed(1) : '—', icon: TrendingUp, col: TEAL },
          { label: 'Total COIG™',       value: deployments.length > 0 ? `+${totalCoig.toFixed(1)}` : '—', icon: Zap, col: GOLD },
        ].map(k => (
          <div key={k.label} style={{
            background: 'var(--os-card)', border: `1px solid var(--os-border)`,
            borderLeft: `3px solid ${k.col}`, borderRadius: 12, padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{k.label}</span>
              <k.icon style={{ width: 12, height: 12, color: k.col }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--os-text-1)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <DeploymentForm
          editId={editId} form={form} setForm={setForm}
          onSubmit={submitForm} onCancel={() => { setShowForm(false); setEditId(null); setForm({ ...EMPTY_FORM }) }}
          isPending={createMut.isPending || updateMut.isPending}
        />
      )}

      {/* Activation modal */}
      {activatingDep && (
        <ActivationModal
          d={activatingDep}
          onConfirm={ois => activateMut.mutate({ id: activatingDep.id, ois })}
          onCancel={() => setActivatingId(null)}
          isPending={activateMut.isPending}
        />
      )}

      {/* Pipeline funnel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Customer Pipeline
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--os-border)' }} />
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
            background: GOLD + '18', color: GOLD, border: `1px solid ${GOLD}30`,
          }}>Target: {targetSlot}</span>
        </div>

        {/* Stage columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {pipelineGroups.map(({ stage, cfg, items }) => (
            <div key={stage} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Stage header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px',
                background: cfg.color + '0c', borderRadius: 8,
                border: `1px solid ${cfg.color}20`,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, flex: 1 }}>{cfg.label}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 8,
                  background: cfg.color + '20', color: cfg.color,
                }}>{items.length}</span>
              </div>

              {/* Cards in this stage */}
              {items.map(d => (
                <CustomerCard
                  key={d.id} d={d}
                  onEdit={() => startEdit(d)}
                  onDelete={() => { if (confirm(`Delete ${d.customerName}?`)) deleteMut.mutate(d.id) }}
                  onActivate={d.milestone === 'ONBOARDING' ? () => setActivatingId(d.id) : undefined}
                />
              ))}

              {/* Empty slot */}
              {items.length === 0 && (
                <div style={{
                  background: 'var(--os-surface-3)',
                  border: `1px dashed ${cfg.color}30`,
                  borderRadius: 10, padding: '20px 12px',
                  textAlign: 'center',
                }}>
                  <span style={{ fontSize: 9, color: cfg.color + '80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Empty
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live customer health */}
      <CustomerHealthSection deployments={deployments} />

      {/* Churned (separate section below pipeline) */}
      {deployments.filter(d => d.milestone === 'CHURNED').length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Churned</span>
            <div style={{ flex: 1, height: 1, background: RED + '30' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
            {deployments.filter(d => d.milestone === 'CHURNED').map(d => (
              <CustomerCard
                key={d.id} d={d}
                onEdit={() => startEdit(d)}
                onDelete={() => { if (confirm(`Delete ${d.customerName}?`)) deleteMut.mutate(d.id) }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {deployments.length === 0 && !showForm && (
        <div style={{
          padding: '48px 24px', textAlign: 'center',
          background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 14,
        }}>
          <Users style={{ width: 36, height: 36, color: 'var(--os-text-4)', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--os-text-2)', margin: 0 }}>No customer deployments yet</p>
          <p style={{ fontSize: 12, color: 'var(--os-text-4)', marginTop: 4, marginBottom: 16 }}>
            Kangqore Global is Customer Zero. Add the first external customer above.
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: BLUE, color: '#fff', border: 'none', borderRadius: 8,
              padding: '8px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}
          >
            + Add Customer One
          </button>
        </div>
      )}
    </div>
  )
}

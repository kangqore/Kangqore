import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@lib/api'
import {
  Brain, Send, CheckCircle2, Clock, ChevronRight, ChevronDown,
  Shield, Zap, AlertTriangle, TrendingUp, FileText, RefreshCw,
  Scale,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface DecisionOption {
  label:          string
  recommendation: string
  pros:           string[]
  cons:           string[]
  roi:            string
  confidence:     number
}

interface DecisionEvidence {
  source:  string
  type:    string
  weight:  number
  snippet: string
}

interface EnterpriseDecision {
  id:          string
  question:    string
  reasoning:   string
  evidence:    DecisionEvidence[]
  options:     DecisionOption[]
  selected:    string | null
  selectedBy:  string | null
  outcome:     string | null
  confidence:  number
  agentsMixed: string[]
  status:      string
  createdAt:   string
  resolvedAt:  string | null
}

interface EnterprisePolicy {
  id:          string
  name:        string
  description: string | null
  trigger:     string
  condition:   Record<string, unknown>
  effect:      string
  priority:    number
  enabled:     boolean
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SURFACE  = 'var(--os-card)'
const BORDER   = 'var(--os-border)'
const TEXT1    = 'var(--os-text-1)'
const TEXT2    = 'var(--os-text-2)'
const BLUE     = '#2564ea'
const GREEN    = '#00c875'
const GOLD     = '#eab308'
const PURPLE   = '#a855f7'
const RED      = '#e2445c'
const TEAL     = '#0ea5e9'

const EFFECT_COLOR: Record<string, string> = {
  ALLOW:            GREEN,
  DENY:             RED,
  REQUIRE_APPROVAL: GOLD,
  NOTIFY:           BLUE,
}

const SOURCE_COLOR: Record<string, string> = {
  delivery:     TEAL,
  finance:      GOLD,
  pipeline:     BLUE,
  intelligence: PURPLE,
  ois:          GREEN,
  cross_dept:   RED,
}

const STATUS_COLOR: Record<string, string> = {
  OPEN:     BLUE,
  DECIDED:  GREEN,
  EXECUTED: PURPLE,
  CLOSED:   TEXT2,
}

// ── Option Card ───────────────────────────────────────────────────────────────

function OptionCard({
  option,
  index,
  isSelected,
  decided,
  onSelect,
}: {
  option:     DecisionOption
  index:      number
  isSelected: boolean
  decided:    boolean
  onSelect:   () => void
}) {
  const [open, setOpen] = useState(index === 0)
  const color = [BLUE, GREEN, GOLD][index] ?? BLUE

  return (
    <div style={{
      border:       `1.5px solid ${isSelected ? color : BORDER}`,
      borderLeft:   `4px solid ${color}`,
      borderRadius: 10,
      background:   isSelected ? `${color}08` : SURFACE,
      overflow:     'hidden',
      transition:   'all 0.2s',
    }}>
      {/* Header */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            10,
          padding:        '12px 14px',
          cursor:         'pointer',
          userSelect:     'none',
        }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          background:  `${color}20`,
          border:      `2px solid ${color}`,
          display:     'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink:  0,
          fontSize:    10, fontWeight: 800, color,
        }}>
          {index + 1}
        </div>

        <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: TEXT1 }}>
          {option.label}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 9, background: `${color}20`, color, padding: '2px 7px',
            borderRadius: 8, fontWeight: 700,
          }}>
            {option.confidence}% confidence
          </span>
          {open ? <ChevronDown size={13} style={{ color: TEXT2 }} /> : <ChevronRight size={13} style={{ color: TEXT2 }} />}
        </div>
      </div>

      {/* Body */}
      {open && (
        <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 12, color: TEXT2, margin: '10px 0 12px', lineHeight: 1.6 }}>
            {option.recommendation}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Pros</p>
              {option.pros.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 5, marginBottom: 2 }}>
                  <span style={{ color: GREEN, fontSize: 10 }}>+</span>
                  <span style={{ fontSize: 11, color: TEXT2 }}>{p}</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Cons</p>
              {option.cons.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 5, marginBottom: 2 }}>
                  <span style={{ color: RED, fontSize: 10 }}>−</span>
                  <span style={{ fontSize: 11, color: TEXT2 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: `${PURPLE}0a`, border: `1px solid ${PURPLE}22`,
            borderRadius: 7, padding: '6px 10px', marginBottom: 12,
            fontSize: 11, color: TEXT1,
          }}>
            <span style={{ color: PURPLE, fontWeight: 700, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Expected ROI  </span>
            {option.roi}
          </div>

          {!decided && (
            <button
              onClick={(e) => { e.stopPropagation(); onSelect() }}
              style={{
                width:        '100%',
                background:   isSelected ? `${color}20` : color,
                color:        isSelected ? color : '#fff',
                border:       `1px solid ${color}`,
                borderRadius: 8,
                padding:      '7px 0',
                fontSize:     11,
                fontWeight:   700,
                cursor:       'pointer',
                transition:   'all 0.15s',
              }}
            >
              {isSelected ? '✓ Selected' : `Choose Option ${index + 1}`}
            </button>
          )}
          {decided && isSelected && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: GREEN, fontSize: 11, fontWeight: 700 }}>
              <CheckCircle2 size={13} />
              Decision recorded
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Decision Card ─────────────────────────────────────────────────────────────

function DecisionCard({
  decision,
  onResolve,
}: {
  decision: EnterpriseDecision
  onResolve: (id: string, selected: string) => void
}) {
  const [expanded,  setExpanded]  = useState(false)
  const [showEv,    setShowEv]    = useState(false)
  const [pending,   setPending]   = useState<string | null>(null)
  const decided = decision.status !== 'OPEN'
  const statusColor = STATUS_COLOR[decision.status] ?? TEXT2

  const handleSelect = async (label: string) => {
    if (decided) return
    setPending(label)
    await onResolve(decision.id, label)
    setPending(null)
  }

  return (
    <div style={{
      border:       `1px solid ${BORDER}`,
      borderRadius: 12,
      background:   SURFACE,
      overflow:     'hidden',
    }}>
      {/* Header */}
      <div
        style={{ padding: '14px 16px', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Brain size={14} style={{ color: PURPLE, flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 9, background: `${statusColor}20`, color: statusColor,
                padding: '1px 7px', borderRadius: 8, fontWeight: 700, textTransform: 'uppercase',
              }}>
                {decision.status}
              </span>
              <span style={{ fontSize: 9, color: TEXT2 }}>
                {new Date(decision.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: 9, color: TEXT2 }}>
                {decision.confidence}% confidence
              </span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: TEXT1, margin: 0, lineHeight: 1.4 }}>
              {decision.question}
            </p>
          </div>
          {expanded ? <ChevronDown size={14} style={{ color: TEXT2, flexShrink: 0 }} /> : <ChevronRight size={14} style={{ color: TEXT2, flexShrink: 0 }} />}
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: '14px 16px' }}>
          {/* Agents */}
          {decision.agentsMixed.length > 0 && (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
              {decision.agentsMixed.map(a => (
                <span key={a} style={{
                  fontSize: 9, background: `${PURPLE}15`, color: PURPLE,
                  padding: '2px 7px', borderRadius: 8, fontWeight: 600,
                }}>
                  {a}
                </span>
              ))}
            </div>
          )}

          {/* Reasoning */}
          <div style={{
            background: `${BLUE}08`, border: `1px solid ${BLUE}22`,
            borderRadius: 8, padding: '10px 12px', marginBottom: 14,
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: BLUE, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
              WAANDA Reasoning
            </p>
            <p style={{ fontSize: 12, color: TEXT1, margin: 0, lineHeight: 1.6 }}>
              {decision.reasoning}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {decision.options.map((opt, i) => (
              <OptionCard
                key={i}
                option={opt}
                index={i}
                isSelected={decision.selected === opt.label}
                decided={decided}
                onSelect={() => handleSelect(opt.label)}
              />
            ))}
            {pending && (
              <div style={{ fontSize: 10, color: TEXT2, textAlign: 'center', padding: 4 }}>
                Recording decision…
              </div>
            )}
          </div>

          {/* Evidence toggle */}
          <button
            onClick={() => setShowEv(e => !e)}
            style={{
              fontSize: 10, color: TEXT2, background: 'none', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, padding: 0, marginBottom: showEv ? 8 : 0,
            }}
          >
            <FileText size={10} /> Evidence sources
            <ChevronRight size={10} style={{ transform: showEv ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
          </button>

          {showEv && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {decision.evidence.map((ev, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--os-surface-0)', borderRadius: 7, padding: '6px 10px',
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                    background: SOURCE_COLOR[ev.type] ?? TEXT2,
                  }} />
                  <span style={{ fontSize: 10, color: TEXT2, minWidth: 100 }}>{ev.source}</span>
                  <span style={{ fontSize: 11, color: TEXT1, flex: 1 }}>{ev.snippet}</span>
                  <span style={{ fontSize: 9, color: TEXT2 }}>{Math.round(ev.weight * 100)}% weight</span>
                </div>
              ))}
            </div>
          )}

          {/* Resolved state */}
          {decided && decision.selected && (
            <div style={{
              marginTop: 12, display: 'flex', alignItems: 'center', gap: 6,
              background: `${GREEN}0c`, border: `1px solid ${GREEN}30`,
              borderRadius: 8, padding: '8px 12px',
            }}>
              <CheckCircle2 size={13} style={{ color: GREEN }} />
              <span style={{ fontSize: 11, color: TEXT1 }}>
                <strong>Decision:</strong> {decision.selected}
                {decision.selectedBy && ` — by ${decision.selectedBy}`}
                {decision.resolvedAt && ` on ${new Date(decision.resolvedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Policy Row ────────────────────────────────────────────────────────────────

function PolicyRow({
  policy,
  onToggle,
  onDelete,
}: {
  policy:   EnterprisePolicy
  onToggle: (id: string, enabled: boolean) => void
  onDelete: (id: string) => void
}) {
  const color = EFFECT_COLOR[policy.effect] ?? TEXT2

  return (
    <div style={{
      display:      'flex',
      alignItems:   'center',
      gap:          10,
      padding:      '10px 14px',
      borderBottom: `1px solid ${BORDER}`,
      opacity:      policy.enabled ? 1 : 0.5,
    }}>
      <Shield size={12} style={{ color, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: TEXT1, margin: 0 }}>{policy.name}</p>
        {policy.description && (
          <p style={{ fontSize: 10, color: TEXT2, margin: '2px 0 0' }}>{policy.description}</p>
        )}
      </div>
      <span style={{
        fontSize: 9, background: `${color}20`, color, padding: '2px 8px',
        borderRadius: 8, fontWeight: 700, textTransform: 'uppercase', flexShrink: 0,
      }}>
        {policy.effect}
      </span>
      <code style={{ fontSize: 9, color: TEXT2, background: 'var(--os-surface-0)', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>
        {policy.trigger}
      </code>
      <button
        onClick={() => onToggle(policy.id, !policy.enabled)}
        style={{
          width: 28, height: 16, borderRadius: 8, border: 'none', cursor: 'pointer', flexShrink: 0,
          background: policy.enabled ? GREEN : BORDER, transition: 'background 0.2s', position: 'relative',
        }}
      >
        <div style={{
          position:   'absolute',
          width:      12, height: 12, borderRadius: '50%', background: '#fff',
          top:        2, left: policy.enabled ? 14 : 2,
          transition: 'left 0.2s',
        }} />
      </button>
      <button
        onClick={() => onDelete(policy.id)}
        style={{ background: 'none', border: 'none', color: RED, cursor: 'pointer', fontSize: 11, padding: '2px 4px' }}
      >
        ×
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Tab = 'decisions' | 'policies'

export function DecisionEnginePage() {
  const qc = useQueryClient()
  const [tab,      setTab]      = useState<Tab>('decisions')
  const [question, setQuestion] = useState('')
  const [asking,   setAsking]   = useState(false)
  const [filter,   setFilter]   = useState<string>('ALL')

  // New policy form state
  const [showPolicyForm, setShowPolicyForm] = useState(false)
  const [pName,   setPName]   = useState('')
  const [pDesc,   setPDesc]   = useState('')
  const [pTrigger, setPTrigger] = useState('*')
  const [pEffect, setPEffect] = useState('REQUIRE_APPROVAL')

  const { data: decisions = [], isLoading: dLoading } = useQuery<EnterpriseDecision[]>({
    queryKey: ['enterprise-decisions', filter],
    queryFn:  () => adminApi(`/admin/enterprise/decisions${filter !== 'ALL' ? `?status=${filter}` : ''}`),
    staleTime: 30_000,
  })

  const { data: policies = [], isLoading: pLoading } = useQuery<EnterprisePolicy[]>({
    queryKey: ['enterprise-policies'],
    queryFn:  () => adminApi('/admin/enterprise/policies'),
    staleTime: 60_000,
    enabled:  tab === 'policies',
  })

  const askMutation = useMutation({
    mutationFn: (q: string) => adminApi('/admin/enterprise/decisions', { method: 'POST', body: JSON.stringify({ question: q }) }),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['enterprise-decisions'] }); setQuestion('') },
  })

  const resolveMutation = useMutation({
    mutationFn: ({ id, selected }: { id: string; selected: string }) =>
      adminApi(`/admin/enterprise/decisions/${id}/resolve`, { method: 'POST', body: JSON.stringify({ selected }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enterprise-decisions'] }),
  })

  const togglePolicyMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      adminApi(`/admin/enterprise/policies/${id}/toggle`, { method: 'PATCH', body: JSON.stringify({ enabled }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enterprise-policies'] }),
  })

  const deletePolicyMutation = useMutation({
    mutationFn: (id: string) => adminApi(`/admin/enterprise/policies/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enterprise-policies'] }),
  })

  const createPolicyMutation = useMutation({
    mutationFn: (data: object) => adminApi('/admin/enterprise/policies', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['enterprise-policies'] })
      setShowPolicyForm(false)
      setPName(''); setPDesc(''); setPTrigger('*'); setPEffect('REQUIRE_APPROVAL')
    },
  })

  const handleAsk = async () => {
    if (!question.trim() || asking) return
    setAsking(true)
    await askMutation.mutateAsync(question.trim())
    setAsking(false)
  }

  const open   = decisions.filter(d => d.status === 'OPEN').length
  const decided = decisions.filter(d => d.status === 'DECIDED').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Scale size={16} style={{ color: BLUE }} />
            <h2 style={{ fontSize: 15, fontWeight: 800, color: TEXT1, margin: 0 }}>Decision Engine</h2>
            <span style={{ fontSize: 9, background: `${BLUE}18`, color: BLUE, padding: '2px 7px', borderRadius: 8, fontWeight: 700 }}>
              WAANDA
            </span>
          </div>
          <p style={{ fontSize: 11, color: TEXT2, margin: 0 }}>
            Structured enterprise reasoning — options, evidence, outcomes
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {open > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${BLUE}15`, borderRadius: 8, padding: '4px 10px' }}>
              <Clock size={11} style={{ color: BLUE }} />
              <span style={{ fontSize: 10, color: BLUE, fontWeight: 700 }}>{open} open</span>
            </div>
          )}
          {decided > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${GREEN}15`, borderRadius: 8, padding: '4px 10px' }}>
              <CheckCircle2 size={11} style={{ color: GREEN }} />
              <span style={{ fontSize: 10, color: GREEN, fontWeight: 700 }}>{decided} decided</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={{ display: 'flex', gap: 2, borderBottom: `1px solid ${BORDER}`, marginBottom: 4 }}>
        {(['decisions', 'policies'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontSize:     11, fontWeight: tab === t ? 700 : 500,
              color:        tab === t ? BLUE : TEXT2,
              background:   'none',
              border:       'none',
              borderBottom: `2px solid ${tab === t ? BLUE : 'transparent'}`,
              padding:      '6px 14px',
              cursor:       'pointer',
              textTransform: 'capitalize',
              marginBottom:  -1,
            }}
          >
            {t === 'decisions' ? 'Decisions' : 'Policy Engine'}
          </button>
        ))}
      </div>

      {/* ── Decisions tab ── */}
      {tab === 'decisions' && (
        <>
          {/* Ask WAANDA */}
          <div style={{
            background:   `${BLUE}08`,
            border:       `1px solid ${BLUE}22`,
            borderRadius: 12,
            padding:      '14px 16px',
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: BLUE, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>
              Ask WAANDA a strategic question
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAsk()}
                placeholder="e.g. Should we take on a new enterprise client given current delivery load?"
                style={{
                  flex:         1,
                  background:   SURFACE,
                  border:       `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding:      '8px 12px',
                  fontSize:     12,
                  color:        TEXT1,
                  outline:      'none',
                }}
              />
              <button
                onClick={handleAsk}
                disabled={!question.trim() || asking}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          5,
                  background:   BLUE,
                  color:        '#fff',
                  border:       'none',
                  borderRadius: 8,
                  padding:      '8px 14px',
                  fontSize:     11,
                  fontWeight:   700,
                  cursor:       question.trim() && !asking ? 'pointer' : 'default',
                  opacity:      question.trim() && !asking ? 1 : 0.5,
                }}
              >
                {asking
                  ? <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
                  : <Send size={12} />}
                {asking ? 'Reasoning…' : 'Decide'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {[
                'Should we expand capacity this quarter?',
                'Where is our biggest revenue risk today?',
                'Which project deserves most attention this week?',
              ].map(s => (
                <button
                  key={s}
                  onClick={() => setQuestion(s)}
                  style={{
                    fontSize:     10,
                    color:        BLUE,
                    background:   `${BLUE}10`,
                    border:       `1px solid ${BLUE}25`,
                    borderRadius: 6,
                    padding:      '3px 9px',
                    cursor:       'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['ALL', 'OPEN', 'DECIDED', 'EXECUTED'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  fontSize:     10, fontWeight: filter === f ? 700 : 500,
                  color:        filter === f ? BLUE : TEXT2,
                  background:   filter === f ? `${BLUE}15` : 'transparent',
                  border:       `1px solid ${filter === f ? `${BLUE}44` : BORDER}`,
                  borderRadius: 7,
                  padding:      '4px 10px',
                  cursor:       'pointer',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Decision list */}
          {dLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, gap: 8, color: TEXT2 }}>
              <Brain size={14} style={{ animation: 'spin 1s linear infinite' }} />
              Loading decisions…
            </div>
          ) : decisions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: TEXT2 }}>
              <Scale size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontSize: 13, margin: 0 }}>No decisions yet.</p>
              <p style={{ fontSize: 11, marginTop: 6 }}>
                Ask WAANDA a strategic question — it will pull live context from Projects, Finance, and Sales.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {decisions.map(d => (
                <DecisionCard
                  key={d.id}
                  decision={d}
                  onResolve={(id, selected) => resolveMutation.mutateAsync({ id, selected })}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Policy Engine tab ── */}
      {tab === 'policies' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <Shield size={13} style={{ color: GOLD }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: TEXT1 }}>Policy Engine</span>
              </div>
              <p style={{ fontSize: 10, color: TEXT2, margin: 0 }}>
                Guard rails that evaluate before any KIMMP action fires
              </p>
            </div>
            <button
              onClick={() => setShowPolicyForm(p => !p)}
              style={{
                display:      'flex', alignItems: 'center', gap: 5,
                fontSize:     10, fontWeight: 700,
                background:   GOLD, color: '#000',
                border:       'none', borderRadius: 7,
                padding:      '6px 12px', cursor: 'pointer',
              }}
            >
              <Zap size={11} />
              New Policy
            </button>
          </div>

          {/* New policy form */}
          {showPolicyForm && (
            <div style={{
              background:   `${GOLD}08`,
              border:       `1px solid ${GOLD}33`,
              borderRadius: 10,
              padding:      '14px 16px',
              display:      'flex',
              flexDirection: 'column',
              gap:          10,
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
                New Policy
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input
                  placeholder="Policy name *"
                  value={pName}
                  onChange={e => setPName(e.target.value)}
                  style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 7, padding: '7px 10px', fontSize: 11, color: TEXT1, outline: 'none' }}
                />
                <input
                  placeholder="Description (optional)"
                  value={pDesc}
                  onChange={e => setPDesc(e.target.value)}
                  style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 7, padding: '7px 10px', fontSize: 11, color: TEXT1, outline: 'none' }}
                />
                <input
                  placeholder="Trigger (e.g. EXTERNAL_API_CALL or *)"
                  value={pTrigger}
                  onChange={e => setPTrigger(e.target.value)}
                  style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 7, padding: '7px 10px', fontSize: 11, color: TEXT1, outline: 'none' }}
                />
                <select
                  value={pEffect}
                  onChange={e => setPEffect(e.target.value)}
                  style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 7, padding: '7px 10px', fontSize: 11, color: TEXT1 }}
                >
                  <option value="ALLOW">ALLOW</option>
                  <option value="DENY">DENY</option>
                  <option value="REQUIRE_APPROVAL">REQUIRE APPROVAL</option>
                  <option value="NOTIFY">NOTIFY</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowPolicyForm(false)}
                  style={{ fontSize: 10, background: 'none', border: `1px solid ${BORDER}`, borderRadius: 7, padding: '5px 12px', cursor: 'pointer', color: TEXT2 }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => createPolicyMutation.mutate({ name: pName, description: pDesc, trigger: pTrigger, effect: pEffect, condition: {}, priority: 0 })}
                  disabled={!pName.trim()}
                  style={{
                    fontSize: 10, fontWeight: 700,
                    background: pName.trim() ? GOLD : BORDER,
                    color:      pName.trim() ? '#000' : TEXT2,
                    border:     'none', borderRadius: 7,
                    padding:    '5px 14px', cursor: pName.trim() ? 'pointer' : 'default',
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          )}

          {/* Policy list */}
          {pLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100, gap: 8, color: TEXT2 }}>
              <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
              Loading…
            </div>
          ) : policies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: TEXT2 }}>
              <Shield size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontSize: 13, margin: 0 }}>No policies defined.</p>
              <p style={{ fontSize: 11, marginTop: 6 }}>
                Policies evaluate before any KIMMP agent fires an action — DENY blocks it, REQUIRE_APPROVAL escalates to L3.
              </p>
            </div>
          ) : (
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
              {policies.map(p => (
                <PolicyRow
                  key={p.id}
                  policy={p}
                  onToggle={(id, enabled) => togglePolicyMutation.mutate({ id, enabled })}
                  onDelete={(id) => deletePolicyMutation.mutate(id)}
                />
              ))}
            </div>
          )}

          {/* Explanation */}
          <div style={{
            background:   'var(--os-surface-0)',
            borderRadius: 10,
            padding:      '12px 14px',
            display:      'flex',
            gap:          10,
          }}>
            <AlertTriangle size={13} style={{ color: GOLD, flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: TEXT1, margin: '0 0 4px' }}>How the Policy Engine works</p>
              <p style={{ fontSize: 10, color: TEXT2, margin: 0, lineHeight: 1.6 }}>
                Before any KIMMP agent fires an action (L0–L3), policies are evaluated highest-priority first.
                A <strong style={{ color: RED }}>DENY</strong> match blocks the action entirely.
                A <strong style={{ color: GOLD }}>REQUIRE_APPROVAL</strong> match escalates to L3 regardless of the agent's proposed level.
                A <strong style={{ color: BLUE }}>NOTIFY</strong> match fires a signal but allows the action.
                <strong style={{ color: GREEN }}> ALLOW</strong> explicitly permits, useful to override a broader DENY.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div style={{ fontSize: 9, color: TEXT2, textAlign: 'center', paddingTop: 4 }}>
        Decision Engine v1.0 · Context pulled from Projects, Finance, Pipeline, Intelligence · Decisions recorded to EnterpriseMemory
      </div>
    </div>
  )
}

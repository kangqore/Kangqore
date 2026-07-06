/**
 * ClientFeedback — Apple-grade rebuild
 * Same 4-surface design system: BG/CARD/RAISE/EDGE
 */
import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Send, CheckCircle2, Star } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { api, isDemo } from '@lib/api'
import { useClientFeedback } from '../useClientData'

// ── Design tokens ─────────────────────────────────────────────────────────────

const CARD  = 'var(--os-card)'
const RAISE = 'var(--os-surface)'
const EDGE  = 'var(--os-border)'
const GREEN  = '#00c875'
const AMBER  = '#fdab3d'
const RED    = '#e2445c'
const BLUE   = '#579bfc'
const EASE   = 'cubic-bezier(0.16, 1, 0.3, 1)'

let _inj = false
function ensureKf() {
  if (_inj) return; _inj = true
  const s = document.createElement('style')
  s.textContent = `@keyframes _fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`
  document.head.appendChild(s)
}
const anim = (d: number): React.CSSProperties => ({ animation: `_fadeUp 0.55s ${EASE} ${d}ms both` })

// ── NPS helpers ───────────────────────────────────────────────────────────────

function npsColor(score: number): string {
  if (score >= 9) return GREEN
  if (score >= 7) return AMBER
  return RED
}

function npsLabel(score: number): { label: string; description: string } {
  if (score >= 9) return { label: 'Promoter',  description: 'You\'re a Promoter — thank you!' }
  if (score >= 7) return { label: 'Passive',   description: 'You\'re Passive — help us improve.' }
  return               { label: 'Detractor', description: 'You\'re a Detractor — we want to do better.' }
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_FEEDBACK = [
  {
    id: 'fb1', npsScore: 9,
    comment: 'The team has been incredibly responsive and the delivery quality has been excellent. The HIPAA compliance work was particularly thorough.',
    project: { title: 'HIPAA Compliance Layer' }, createdAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'fb2', npsScore: 7,
    comment: 'Good progress overall. Would appreciate more frequent status updates — sometimes we are left guessing on milestone timing.',
    project: { title: 'Patient Portal v2' }, createdAt: '2026-04-15T09:00:00Z',
  },
]

const PROJECTS = [
  { id: 'pj1', title: 'Patient Portal v2' },
  { id: 'pj5', title: 'Analytics Dashboard' },
]

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

// ── NPS button ────────────────────────────────────────────────────────────────

function NpsBtn({ score, selected, onSelect }: { score: number; selected: boolean; onSelect: () => void }) {
  const color = npsColor(score)
  return (
    <button onClick={onSelect} style={{
      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
      fontSize: 13, fontWeight: 700, cursor: 'pointer',
      background: selected ? color : 'var(--os-surface)',
      border: `1px solid ${selected ? color : 'var(--os-border)'}`,
      color: selected ? '#fff' : color,
      transform: selected ? 'scale(1.1)' : 'scale(1)',
      boxShadow: selected ? `0 0 14px ${color}50` : 'none',
      transition: `all 0.2s ${EASE}`,
      fontVariantNumeric: 'tabular-nums',
    }}>
      {score}
    </button>
  )
}

// ── Score summary ring ────────────────────────────────────────────────────────

function ScoreSummary({ avg, count }: { avg: number; count: number }) {
  const color = npsColor(Math.round(avg))
  const { label } = npsLabel(Math.round(avg))

  return (
    <div style={{
      ...anim(0),
      borderRadius: 20, padding: '24px 28px',
      background: `linear-gradient(145deg, ${RAISE} 0%, ${CARD} 70%)`,
      border: `1px solid ${EDGE}`,
      boxShadow: `0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(37,100,234,0.06)`,
      display: 'flex', alignItems: 'center', gap: 32,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 90% 50%, ${color}10 0%, transparent 60%)`,
      }} />

      {/* Big score */}
      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 56, fontWeight: 900, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {avg.toFixed(1)}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--os-text-2)', marginTop: 6 }}>
          Your NPS
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 64, background: EDGE, flexShrink: 0 }} />

      {/* Details */}
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 999, marginBottom: 10,
          background: `${color}14`, border: `1px solid ${color}30`,
        }}>
          <Star style={{ width: 11, height: 11, color }} />
          <span style={{ fontSize: 11, fontWeight: 700, color }}>{label}</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--os-text-2)', margin: 0 }}>
          Based on <strong style={{ color: 'var(--os-text-2)' }}>{count}</strong> feedback submission{count !== 1 ? 's' : ''}
        </p>
        <p style={{ fontSize: 11, color: 'var(--os-text-2)', margin: '6px 0 0' }}>
          {avg >= 9 ? 'Your satisfaction is exceptional.' : avg >= 7 ? 'There is room to improve — we\'re listening.' : 'We take this seriously and will address your concerns.'}
        </p>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function ClientFeedback() {
  const { data }    = useClientFeedback()
  const feedbacks   = ((data as typeof MOCK_FEEDBACK | undefined)?.length ? data as typeof MOCK_FEEDBACK : MOCK_FEEDBACK)
  const queryClient = useQueryClient()

  useEffect(() => { ensureKf() }, [])

  const [nps,       setNps]       = useState<number | null>(null)
  const [comment,   setComment]   = useState('')
  const [projectId, setProjectId] = useState(PROJECTS[0].id)
  const [submitted, setSubmitted] = useState(false)
  const [focused,   setFocused]   = useState<'textarea' | 'select' | null>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!isDemo()) await api.post('/feedback', { projectId, npsScore: nps, comment })
    },
    onSuccess: () => {
      setSubmitted(true)
      queryClient.invalidateQueries({ queryKey: ['client', 'feedback'] })
    },
  })

  const avg = feedbacks.length
    ? Math.round(feedbacks.reduce((s, f) => s + f.npsScore, 0) / feedbacks.length * 10) / 10
    : null

  const labelCss = {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
    color: 'var(--os-text-2)', display: 'block', marginBottom: 8,
  }

  const inputBase: React.CSSProperties = {
    width: '100%', background: RAISE, border: `1px solid ${EDGE}`,
    borderRadius: 10, padding: '10px 12px', fontSize: 13, color: 'var(--os-text-1)',
    outline: 'none', transition: `border-color 0.15s`, resize: 'vertical' as const,
    fontFamily: 'inherit',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <KIMMPSignalBar module="Feedback" />

      {/* Header */}
      <div style={anim(0)}>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)', margin: 0 }}>Feedback</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--os-text-2)', margin: '6px 0 0' }}>Your satisfaction matters — share how we're doing</p>
      </div>

      {/* Score summary */}
      {avg !== null && <ScoreSummary avg={avg} count={feedbacks.length} />}

      {/* Submit form */}
      {submitted ? (
        <div style={{
          ...anim(80),
          borderRadius: 20, padding: '40px 28px', textAlign: 'center',
          background: CARD, border: `1px solid ${EDGE}`,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: `${GREEN}14`, border: `1px solid ${GREEN}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <CheckCircle2 style={{ width: 24, height: 24, color: GREEN }} />
          </div>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--os-text-1)', margin: '0 0 8px' }}>Thank you for your feedback!</p>
          <p style={{ fontSize: 13, color: 'var(--os-text-2)', margin: '0 0 24px' }}>We read every response and use it to improve.</p>
          <button
            onClick={() => { setSubmitted(false); setNps(null); setComment('') }}
            style={{
              padding: '9px 20px', borderRadius: 10,
              background: RAISE, border: `1px solid ${EDGE}`,
              color: 'var(--os-text-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
            Submit another
          </button>
        </div>
      ) : (
        <div style={{
          ...anim(80),
          borderRadius: 20, padding: 28,
          background: CARD, border: `1px solid ${EDGE}`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03)`,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--os-text-1)', margin: '0 0 6px' }}>Share your feedback</h3>
          <p style={{ fontSize: 12, color: 'var(--os-text-2)', margin: '0 0 24px' }}>How likely are you to recommend Kangqore to a colleague?</p>

          {/* Project */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelCss}>Project</label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              onFocus={() => setFocused('select')}
              onBlur={() => setFocused(null)}
              style={{ ...inputBase, borderColor: focused === 'select' ? `${BLUE}60` : EDGE, appearance: 'none', cursor: 'pointer' }}>
              {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>

          {/* NPS scale */}
          <div style={{ marginBottom: 8 }}>
            <label style={labelCss}>
              How likely are you to recommend us? <span style={{ color: 'var(--os-text-2)', fontWeight: 500 }}>(0 = not likely · 10 = extremely likely)</span>
            </label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Array.from({ length: 11 }, (_, i) => (
                <NpsBtn key={i} score={i} selected={nps === i} onSelect={() => setNps(i)} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 10, color: 'var(--os-text-2)' }}>Not likely</span>
              <span style={{ fontSize: 10, color: 'var(--os-text-2)' }}>Extremely likely</span>
            </div>
          </div>

          {/* Score interpretation */}
          {nps !== null && (() => {
            const color = npsColor(nps)
            const { label, description } = npsLabel(nps)
            return (
              <div style={{
                margin: '16px 0 24px',
                padding: '12px 16px', borderRadius: 12,
                background: `${color}10`, border: `1px solid ${color}25`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: `${color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 900, color,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {nps}
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.04em' }}>{label}</span>
                  <p style={{ fontSize: 12, color: 'var(--os-text-2)', margin: '2px 0 0' }}>{description}</p>
                </div>
              </div>
            )
          })()}

          {/* Comment */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelCss}>What's one thing we could do better? <span style={{ color: 'var(--os-text-2)', fontWeight: 500 }}>(optional)</span></label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              onFocus={() => setFocused('textarea')}
              onBlur={() => setFocused(null)}
              rows={3}
              placeholder="Your comment…"
              style={{ ...inputBase, borderColor: focused === 'textarea' ? `${BLUE}60` : EDGE }}
            />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              disabled={nps === null || isPending}
              onClick={() => mutate()}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10, border: 'none',
                background: nps === null ? RAISE : BLUE,
                color: nps === null ? 'var(--os-text-2)' : '#fff',
                fontSize: 13, fontWeight: 600,
                cursor: nps === null ? 'not-allowed' : 'pointer',
                boxShadow: nps !== null ? `0 4px 14px ${BLUE}40` : 'none',
                transition: `all 0.2s ${EASE}`,
              }}>
              <Send style={{ width: 13, height: 13 }} />
              {isPending ? 'Submitting…' : 'Submit feedback'}
            </button>
          </div>
        </div>
      )}

      {/* History */}
      {feedbacks.length > 0 && (
        <div style={anim(160)}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--os-text-2)', margin: '0 0 12px' }}>
            Previous Submissions
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {feedbacks.map((f, i) => {
              const color = npsColor(f.npsScore)
              const { label } = npsLabel(f.npsScore)
              return (
                <div key={f.id} style={{
                  animation: `_fadeUp 0.55s ${EASE} ${180 + i * 60}ms both`,
                  borderRadius: 16, padding: '16px 20px',
                  background: CARD, border: `1px solid ${EDGE}`,
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                }}>
                  {/* Score bubble */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: `${color}14`, border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 900, color,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {f.npsScore}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
                        color, background: `${color}14`, border: `1px solid ${color}25`,
                      }}>{label}</span>
                      <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>{f.project?.title}</span>
                    </div>
                    {f.comment && (
                      <p style={{ fontSize: 13, color: 'var(--os-text-2)', margin: '0 0 6px', lineHeight: 1.6 }}>{f.comment}</p>
                    )}
                    <p style={{ fontSize: 10, color: 'var(--os-text-3)', margin: 0 }}>{fmtDate(f.createdAt)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

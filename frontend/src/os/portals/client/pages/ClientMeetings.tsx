/**
 * ClientMeetings — Apple-grade rebuild
 * Same design system as ClientDashboard (BG/CARD/RAISE/EDGE, 4-surface, 8pt grid)
 */
import { useEffect } from 'react'
import { Video, Phone, MapPin, ExternalLink, Calendar, Clock, User, Plus } from 'lucide-react'
import { useClientMeetings } from '../useClientData'
import { useNavigate } from 'react-router-dom'

// ── Design tokens (same 4-surface system) ────────────────────────────────────

const BG    = '#080c18'
const CARD  = 'rgba(15, 23, 42, 0.4)'
const RAISE = 'rgba(30, 41, 59, 0.6)'
const EDGE  = 'rgba(30, 41, 59, 0.6)'

const BLUE   = '#2564ea'
const PURPLE = '#7f53f9'
const GREEN  = '#00c875'
const AMBER  = '#fdab3d'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

let _injected = false
function ensureKeyframes() {
  if (_injected) return; _injected = true
  const s = document.createElement('style')
  s.textContent = `@keyframes _fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }`
  document.head.appendChild(s)
}
const anim = (d: number): React.CSSProperties => ({ animation: `_fadeUp 0.55s ${EASE} ${d}ms both` })

// ── Platform config ───────────────────────────────────────────────────────────

const PLATFORM: Record<string, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  ZOOM:        { label: 'Zoom',        color: '#2D8CFF', bg: 'rgba(45,140,255,0.1)',  Icon: Video  },
  GOOGLE_MEET: { label: 'Google Meet', color: '#34a853', bg: 'rgba(52,168,83,0.1)',   Icon: Video  },
  TEAMS:       { label: 'Teams',       color: '#5059c9', bg: 'rgba(80,89,201,0.1)',   Icon: Video  },
  PHONE:       { label: 'Phone',       color: '#64748b', bg: 'rgba(100,116,139,0.1)', Icon: Phone  },
  IN_PERSON:   { label: 'In Person',   color: AMBER,     bg: 'rgba(253,171,61,0.1)',  Icon: MapPin },
}
const getPlatform = (key: string) => PLATFORM[key] ?? PLATFORM.ZOOM

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtTime = (s: string) => new Date(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

function duration(start: string, end: string) {
  const m = (new Date(end).getTime() - new Date(start).getTime()) / 60000
  return m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m}m`
}

function countdownLabel(dateStr: string): string {
  const d   = new Date(dateStr)
  const now = new Date()
  const min = Math.round((d.getTime() - now.getTime()) / 60000)
  if (min < 0)         return 'Past'
  if (min < 60)        return `In ${min} min`
  if (min < 24 * 60)   return `Today at ${fmtTime(dateStr)}`
  if (min < 48 * 60)   return `Tomorrow at ${fmtTime(dateStr)}`
  const days = Math.floor(min / (24 * 60))
  return `In ${days} days · ${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}`
}

// ── Mock data (dates kept future-relative to 2026-06-19) ─────────────────────

const MOCK_MEETINGS = [
  {
    id: 'm1', title: 'Sprint 13 Review',
    platform: 'ZOOM',
    startTime: '2026-06-20T10:00:00', endTime: '2026-06-20T11:00:00',
    status: 'SCHEDULED', joinLink: 'https://zoom.us/j/99001122',
    creator: { name: 'Ravi Nair' },
    agenda: ['Review Sprint 12 progress report', 'Demo new patient flow', 'Align on UAT timeline'],
  },
  {
    id: 'm2', title: 'HIPAA Compliance Walkthrough',
    platform: 'GOOGLE_MEET',
    startTime: '2026-06-24T14:00:00', endTime: '2026-06-24T15:00:00',
    status: 'SCHEDULED', joinLink: 'https://meet.google.com/abc-defg-hij',
    creator: { name: 'Omar Khalid' },
    agenda: ['Audit log module walkthrough', 'Sign-off on BAA', 'Q&A'],
  },
  {
    id: 'm3', title: 'Monthly Steering Committee Q2',
    platform: 'ZOOM',
    startTime: '2026-06-30T09:00:00', endTime: '2026-06-30T10:30:00',
    status: 'SCHEDULED', joinLink: 'https://zoom.us/j/77665544',
    creator: { name: 'Ravi Nair' },
    agenda: [],
  },
  {
    id: 'm4', title: 'Monthly Steering Committee',
    platform: 'ZOOM',
    startTime: '2026-05-28T09:00:00', endTime: '2026-05-28T10:30:00',
    status: 'COMPLETED', joinLink: null,
    creator: { name: 'Mahesh Kumar' },
    agenda: [],
  },
  {
    id: 'm5', title: 'Analytics Dashboard Design Review',
    platform: 'ZOOM',
    startTime: '2026-05-14T11:00:00', endTime: '2026-05-14T12:00:00',
    status: 'COMPLETED', joinLink: null,
    creator: { name: 'Anika Roy' },
    agenda: [],
  },
  {
    id: 'm6', title: 'HIPAA Phase 1 Kickoff',
    platform: 'GOOGLE_MEET',
    startTime: '2026-04-02T10:00:00', endTime: '2026-04-02T11:00:00',
    status: 'COMPLETED', joinLink: null,
    creator: { name: 'Omar Khalid' },
    agenda: [],
  },
]

type Meeting = typeof MOCK_MEETINGS[0]

// ── Next-meeting hero ─────────────────────────────────────────────────────────

function NextMeetingHero({ meeting }: { meeting: Meeting }) {
  const p   = getPlatform(meeting.platform)
  const dur = duration(meeting.startTime, meeting.endTime)
  const cld = countdownLabel(meeting.startTime)

  return (
    <div style={{
      ...anim(0),
      borderRadius: 20,
      background: `linear-gradient(145deg, ${RAISE} 0%, ${CARD} 70%)`,
      border: `1px solid ${EDGE}`,
      boxShadow: `inset 0 1px 0 rgba(13,17,23,0.4), 0 0 0 0 ${p.color}`,
      padding: 28,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Platform color ambient */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 92% 15%, ${p.color}14 0%, transparent 55%)`,
      }} />

      <div style={{ position: 'relative' }}>
        {/* Label row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#334155' }}>
            Next Meeting
          </span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
            padding: '4px 12px', borderRadius: 999,
            color: p.color, background: p.bg, border: `1px solid ${p.color}25`,
          }}>
            <p.Icon style={{ width: 11, height: 11 }} />
            {p.label}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', margin: '0 0 10px', lineHeight: 1.2 }}>
          {meeting.title}
        </h3>

        {/* Time + organiser */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
            <Clock style={{ width: 13, height: 13 }} />
            {cld} · {dur}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569' }}>
            <User style={{ width: 12, height: 12 }} />
            {meeting.creator?.name}
          </span>
        </div>

        {/* Agenda if available */}
        {meeting.agenda?.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#334155', marginBottom: 10 }}>
              Agenda
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {meeting.agenda.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {meeting.joinLink ? (
            <a href={meeting.joinLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10, border: 'none',
                background: p.color, color: '#fff',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                boxShadow: `0 4px 18px ${p.color}40`,
                transition: `transform 0.15s ${EASE}, box-shadow 0.15s ${EASE}`,
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-1px)'; el.style.boxShadow = `0 8px 24px ${p.color}55` }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = `0 4px 18px ${p.color}40` }}>
                <ExternalLink style={{ width: 13, height: 13 }} />
                Join on {p.label}
              </button>
            </a>
          ) : null}
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 10,
            background: RAISE, border: `1px solid ${EDGE}`,
            color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            transition: `border-color 0.15s, color 0.15s`,
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${BLUE}40`; el.style.color = '#94a3b8' }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = EDGE; el.style.color = '#64748b' }}>
            <Calendar style={{ width: 13, height: 13 }} />
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Meeting row card ──────────────────────────────────────────────────────────

function MeetingRow({ meeting, delay = 0 }: { meeting: Meeting; delay?: number }) {
  const isPast = new Date(meeting.startTime) < new Date()
  const p      = getPlatform(meeting.platform)
  const dur    = duration(meeting.startTime, meeting.endTime)
  const day    = new Date(meeting.startTime).getDate()
  const mon    = new Date(meeting.startTime).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()
  const time   = fmtTime(meeting.startTime)

  return (
    <div style={{
      ...anim(delay),
      display: 'flex', alignItems: 'center', gap: 16,
      borderRadius: 14,
      background: isPast ? CARD : `linear-gradient(90deg, ${p.color}07 0%, ${CARD} 35%)`,
      border: `1px solid ${isPast ? EDGE : p.color + '28'}`,
      padding: '14px 18px',
      opacity: isPast ? 0.65 : 1,
      transition: `opacity 0.15s, transform 0.2s ${EASE}, box-shadow 0.2s ${EASE}`,
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement
      if (!isPast) { el.style.transform = 'translateX(2px)'; el.style.boxShadow = `0 0 0 1px ${p.color}20, 0 4px 16px rgba(0,0,0,0.2)` }
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement
      el.style.transform = 'none'; el.style.boxShadow = 'none'
    }}>

      {/* Date badge */}
      <div style={{
        width: 48, minWidth: 48, textAlign: 'center',
        padding: '8px 0', borderRadius: 10,
        background: isPast ? RAISE : `${p.color}12`,
        border: `1px solid ${isPast ? EDGE : p.color + '25'}`,
      }}>
        <p style={{
          fontSize: 22, fontWeight: 800, lineHeight: 1, margin: 0,
          fontVariantNumeric: 'tabular-nums',
          color: isPast ? '#334155' : p.color,
        }}>{day}</p>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', margin: '3px 0 0', color: '#334155' }}>
          {mon}
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: isPast ? '#475569' : '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {meeting.title}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 5, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#475569' }}>
            <Clock style={{ width: 10, height: 10 }} />
            {time} · {dur}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#334155' }}>
            <User style={{ width: 10, height: 10 }} />
            {meeting.creator?.name}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
            color: p.color, background: p.bg,
          }}>{p.label}</span>
        </div>
      </div>

      {/* Action */}
      {!isPast && meeting.joinLink ? (
        <a href={meeting.joinLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 8, border: 'none',
            background: p.color, color: '#fff',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            boxShadow: `0 2px 10px ${p.color}35`,
          }}>
            <p.Icon style={{ width: 11, height: 11 }} /> Join
          </button>
        </a>
      ) : isPast ? (
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 999,
          background: RAISE, color: '#334155', flexShrink: 0,
          border: `1px solid ${EDGE}`,
        }}>
          Completed
        </span>
      ) : (
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 999,
          background: `${GREEN}12`, color: GREEN, flexShrink: 0,
          border: `1px solid ${GREEN}25`,
        }}>
          Scheduled
        </span>
      )}
    </div>
  )
}

// ── Quick schedule ────────────────────────────────────────────────────────────

const QUICK_SLOTS = [
  { dur: '15 min', label: 'Quick Sync',       desc: 'Fast check-in on any blocker or question', color: GREEN  },
  { dur: '30 min', label: 'Project Review',   desc: 'Milestone update or delivery walkthrough',  color: BLUE   },
  { dur: '60 min', label: 'Strategy Session', desc: 'Deep-dive planning or retrospective',       color: PURPLE },
]

function QuickSchedule({ onRequest, delay = 0 }: { onRequest: () => void; delay?: number }) {
  return (
    <div style={{ ...anim(delay), display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#334155', margin: '0 0 4px' }}>
        Request a Meeting
      </p>
      {QUICK_SLOTS.map((slot, i) => (
        <button key={slot.dur} onClick={onRequest}
          style={{
            textAlign: 'left', padding: '14px 16px', borderRadius: 14,
            background: CARD, backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: `1px solid ${EDGE}`,
            cursor: 'pointer', width: '100%',
            transition: `border-color 0.15s ${EASE}, transform 0.15s ${EASE}`,
            animation: `_fadeUp 0.55s ${EASE} ${delay + i * 60}ms both`,
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${slot.color}35`; el.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = EDGE; el.style.transform = 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: `${slot.color}12`, border: `1px solid ${slot.color}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: slot.color, fontVariantNumeric: 'tabular-nums' }}>
                {slot.dur.split(' ')[0]}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>{slot.label}</p>
              <p style={{ fontSize: 11, color: '#475569', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slot.desc}</p>
            </div>
            <Plus style={{ width: 14, height: 14, color: '#334155', flexShrink: 0 }} />
          </div>
        </button>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function ClientMeetings() {
  const { data } = useClientMeetings()
  const navigate = useNavigate()

  useEffect(() => { ensureKeyframes() }, [])

  const raw: Meeting[] = (data as any)?.meetings?.length ? (data as any).meetings : MOCK_MEETINGS

  const now      = new Date()
  const upcoming = raw.filter(m => new Date(m.startTime) >= now)
    .sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime))
  const past = raw.filter(m => new Date(m.startTime) < now)
    .sort((a, b) => +new Date(b.startTime) - +new Date(a.startTime))

  const next = upcoming[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={anim(0)}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Meetings</h2>
        <p style={{ fontSize: 13, color: '#475569', margin: '6px 0 0' }}>
          {upcoming.length} upcoming · {past.length} completed
        </p>
      </div>

      {/* ── Next meeting spotlight ──────────────────────────────────────────── */}
      {next ? (
        <NextMeetingHero meeting={next} />
      ) : (
        <div style={{
          ...anim(60),
          borderRadius: 20, padding: 32, textAlign: 'center',
          background: CARD, backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: `1px dashed ${EDGE}`,
        }}>
          <Calendar style={{ width: 32, height: 32, color: '#1e2b40', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: '#334155', margin: 0 }}>No meetings scheduled</p>
          <p style={{ fontSize: 12, color: '#1e2b40', margin: '6px 0 0' }}>Request one below and your team will confirm within 24h.</p>
        </div>
      )}

      {/* ── Upcoming + Quick schedule ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>

        {/* Upcoming list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {upcoming.length > 1 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#334155', margin: '0 0 12px' }}>
                All Upcoming
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {upcoming.slice(1).map((m, i) => (
                  <MeetingRow key={m.id} meeting={m} delay={80 + i * 60} />
                ))}
              </div>
            </div>
          )}
          {upcoming.length === 0 && (
            <p style={{ fontSize: 13, color: '#334155', padding: '24px 0', textAlign: 'center' }}>
              No other meetings scheduled.
            </p>
          )}
        </div>

        {/* Quick schedule */}
        <QuickSchedule delay={120} onRequest={() => navigate('/kangqore-view/client/support')} />
      </div>

      {/* ── Past meetings ──────────────────────────────────────────────────── */}
      {past.length > 0 && (
        <div style={anim(300)}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#334155', margin: '0 0 12px' }}>
            Past Meetings
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {past.map((m, i) => (
              <MeetingRow key={m.id} meeting={m} delay={320 + i * 50} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

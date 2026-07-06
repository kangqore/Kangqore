import { useQuery } from '@tanstack/react-query'
import { Video, Phone, Users, MapPin, Clock, ExternalLink, CheckSquare, Square, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { cn } from '@design-system/cn'
import { api } from '@lib/api'

const INTERVIEWS = [
  {
    id: 'i1',
    stage: 'Screening Call',
    status: 'completed',
    format: 'PHONE',
    interviewer: 'Anika Roy',
    interviewerRole: 'Talent Lead',
    date: '2026-05-14T10:00:00Z',
    duration: 30,
    joinLink: null,
    notes: 'Strong culture fit confirmed. Good communication, clear thinking on architecture questions.',
    prep: [
      { text: 'Review Kangqore OS product overview', done: true  },
      { text: 'Prepare questions about the engineering team', done: true  },
      { text: 'Review your most recent project in detail', done: true  },
    ],
  },
  {
    id: 'i2',
    stage: 'Technical Interview',
    status: 'upcoming',
    format: 'VIDEO',
    interviewer: 'Dev Patel',
    interviewerRole: 'Head of Engineering',
    date: '2026-06-10T10:00:00Z',
    duration: 90,
    joinLink: 'https://zoom.us/j/12345678',
    notes: 'System design + live coding. Topics: distributed systems, PostgreSQL at scale, API design.',
    prep: [
      { text: 'Review system design patterns (CQRS, event sourcing)', done: true  },
      { text: 'Practice PostgreSQL query optimisation', done: false },
      { text: 'Prepare 2 examples of high-scale architecture decisions', done: false },
      { text: 'Review REST vs GraphQL trade-offs', done: false },
    ],
  },
  {
    id: 'i3',
    stage: 'Final Interview',
    status: 'scheduled',
    format: 'VIDEO',
    interviewer: 'C.O.D.E. & Ravi Nair',
    interviewerRole: 'CTO + Head of Delivery',
    date: '2026-06-18T14:00:00Z',
    duration: 60,
    joinLink: null,
    notes: 'Panel interview. Expect questions on leadership, cross-functional delivery, and long-term career goals.',
    prep: [
      { text: 'Prepare a 5-min intro on your career journey', done: false },
      { text: 'Research Kangqore\'s expansion plans (GCC, SEA)', done: false },
      { text: 'Prepare 3 examples of leading cross-functional work', done: false },
    ],
  },
]

const FORMAT_ICON: Record<string, React.ReactNode> = {
  PHONE:      <Phone   className="w-4 h-4 text-green-500"  />,
  VIDEO:      <Video   className="w-4 h-4 text-blue-500"   />,
  IN_PERSON:  <MapPin  className="w-4 h-4 text-orange-500" />,
  PANEL:      <Users   className="w-4 h-4 text-purple-500" />,
}

const STATUS_V: Record<string, 'neutral' | 'info' | 'success' | 'warning'> = {
  completed: 'neutral', upcoming: 'info', scheduled: 'warning',
}

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const fmtTime = (s: string) => new Date(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })

function PrepChecklist({ items }: { items: typeof INTERVIEWS[0]['prep'] }) {
  const done = items.filter(i => i.done).length
  return (
    <div>
      <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wide mb-2">
        Prep checklist · {done}/{items.length} done
      </p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            {item.done
              ? <CheckSquare className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              : <Square      className="w-4 h-4 text-[var(--os-text-1)] flex-shrink-0 mt-0.5" />
            }
            <span className={cn('text-sm', item.done ? 'text-[var(--os-text-2)] line-through' : 'text-[var(--os-text-1)]')}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

type Interview = typeof INTERVIEWS[0]

export function CareersInterviews() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const { data: liveMeetings } = useQuery({
    queryKey: ['careers', 'interviews'],
    queryFn: () => api.get('/meetings/job-seeker').then(r => r.data.meetings ?? []),
    staleTime: 1000 * 60 * 5,
  })

  const interviews: Interview[] = liveMeetings?.length
    ? (liveMeetings as Record<string, unknown>[]).map((m): Interview => ({
        id:              String(m.id),
        stage:           String(m.title ?? 'Interview'),
        status:          String(m.status ?? 'SCHEDULED') === 'COMPLETED' ? 'completed' : new Date(String(m.startTime)) > new Date() ? 'upcoming' : 'completed',
        format:          String(m.type ?? 'VIDEO'),
        interviewer:     String(m.host ?? 'Kangqore Team'),
        interviewerRole: 'Interviewer',
        date:            String(m.startTime),
        duration:        m.endTime ? Math.round((new Date(String(m.endTime)).getTime() - new Date(String(m.startTime)).getTime()) / 60000) : 60,
        joinLink:        m.joinLink ? String(m.joinLink) : null,
        notes:           '',
        prep:            [],
      }))
    : INTERVIEWS

  const upcoming = interviews.filter(i => i.status !== 'completed')
  const past     = interviews.filter(i => i.status === 'completed')

  const renderCard = (interview: Interview) => {
    const isOpen  = expanded === interview.id
    const isPast  = interview.status === 'completed'
    const isNext  = interview.status === 'upcoming'

    return (
      <Card key={interview.id} className={cn(isNext && 'border-blue-200 ring-1 ring-blue-100')}>
        {/* Header */}
        <button
          className="w-full flex items-start gap-4 text-left"
          onClick={() => setExpanded(isOpen ? null : interview.id)}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--os-surface)', border: '1px solid var(--os-border)' }}>
            {FORMAT_ICON[interview.format] ?? FORMAT_ICON.VIDEO}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>{interview.stage}</span>
              <Badge variant={STATUS_V[interview.status]} size="sm" dot>{interview.status}</Badge>
              {isNext && <Badge variant="info" size="sm">Next up</Badge>}
            </div>
            <p className="text-xs text-[var(--os-text-2)]">
              {interview.interviewer} · {interview.interviewerRole}
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--os-text-2)] flex-wrap">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{interview.duration} min</span>
              <span>{fmtDate(interview.date)}</span>
              <span>{fmtTime(interview.date)}</span>
            </div>
          </div>
          <ChevronDown className={cn('w-4 h-4 text-[var(--os-text-2)] flex-shrink-0 mt-1 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {/* Expanded */}
        {isOpen && (
          <div className="mt-4 pt-4 space-y-4" style={{ borderTop: '1px solid var(--os-border)' }}>
            {interview.notes && (
              <div>
                <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wide mb-1.5">
                  {isPast ? 'Feedback' : 'What to expect'}
                </p>
                <p className="text-sm text-[var(--os-text-1)] leading-relaxed">{interview.notes}</p>
              </div>
            )}

            <PrepChecklist items={interview.prep} />

            {!isPast && interview.joinLink && (
              <a href={interview.joinLink} target="_blank" rel="noreferrer">
                <Button variant="primary" size="sm" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Join interview
                </Button>
              </a>
            )}
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <KIMMPSignalBar module="Interviews" />
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Interviews</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>
          {upcoming.length} upcoming · {past.length} completed
        </p>
      </div>

      {upcoming.length > 0 && (
        <div>
          <p className="text-xs font-bold text-[var(--os-text-2)] uppercase tracking-widest mb-3">Upcoming</p>
          <div className="space-y-3">{upcoming.map(renderCard)}</div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <p className="text-xs font-bold text-[var(--os-text-2)] uppercase tracking-widest mb-3">Completed</p>
          <div className="space-y-3">{past.map(renderCard)}</div>
        </div>
      )}
    </div>
  )
}

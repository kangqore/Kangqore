import { Video, Clock, User, ExternalLink, FileText } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { useInvestorMeetings } from '../useInvestorData'

const MOCK_MEETINGS = [
  {
    id: 'm1', title: 'Q2 2026 Board Update', type: 'BOARD',
    startTime: '2026-06-18T15:00:00Z', endTime: '2026-06-18T16:30:00Z',
    status: 'SCHEDULED', joinLink: 'https://zoom.us/j/88776655',
    platform: 'ZOOM', host: 'C.O.D.E.',
    agenda: 'Q2 revenue review, pipeline update, strategic priorities for H2.',
  },
  {
    id: 'm2', title: 'Investor Check-in — Marcus Webb', type: 'CHECK_IN',
    startTime: '2026-06-25T10:00:00Z', endTime: '2026-06-25T10:30:00Z',
    status: 'SCHEDULED', joinLink: 'https://zoom.us/j/77665544',
    platform: 'ZOOM', host: 'C.O.D.E.',
    agenda: 'Informal monthly catch-up. No fixed agenda.',
  },
  {
    id: 'm3', title: 'Q1 2026 Board Review', type: 'BOARD',
    startTime: '2026-03-20T15:00:00Z', endTime: '2026-03-20T16:30:00Z',
    status: 'COMPLETED', joinLink: null,
    platform: 'ZOOM', host: 'C.O.D.E.',
    agenda: 'Q1 ARR £1.2M (+18% QoQ). Headcount plan approved. GCC expansion greenlit.',
  },
  {
    id: 'm4', title: 'Investor Check-in — Q1', type: 'CHECK_IN',
    startTime: '2026-02-15T10:00:00Z', endTime: '2026-02-15T10:30:00Z',
    status: 'COMPLETED', joinLink: null,
    platform: 'ZOOM', host: 'C.O.D.E.',
    agenda: 'Pipeline review, hiring update, product roadmap.',
  },
]

const TYPE_V: Record<string, 'brand' | 'info'> = {
  BOARD: 'brand', CHECK_IN: 'info',
}

const fmtTime = (s: string) => new Date(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
const duration = (s: string, e: string) => {
  const mins = (new Date(e).getTime() - new Date(s).getTime()) / 60000
  return mins >= 60 ? `${Math.floor(mins / 60)}h${mins % 60 ? ` ${mins % 60}m` : ''}` : `${mins}m`
}

type Meeting = typeof MOCK_MEETINGS[0]

function MeetingCard({ m }: { m: Meeting }) {
  const isPast = new Date(m.startTime) < new Date()
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-center w-14">
          <div className="text-2xl font-bold tracking-tight text-[#7c3aed] leading-none">{new Date(m.startTime).getDate()}</div>
          <div className="text-xs text-[var(--os-text-2)] uppercase">{new Date(m.startTime).toLocaleDateString('en-GB', { month: 'short' })}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>{m.title}</h3>
                <Badge variant={TYPE_V[m.type] ?? 'neutral'} size="sm">{m.type.replace('_', ' ')}</Badge>
              </div>
            </div>
            {isPast
              ? <Badge variant="neutral" size="sm">Completed</Badge>
              : <Badge variant="success" dot size="sm">Upcoming</Badge>
            }
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--os-text-2)] mb-2 flex-wrap">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{fmtTime(m.startTime)} · {duration(m.startTime, m.endTime)}</span>
            <span className="flex items-center gap-1.5"><Video className="w-3 h-3" />{m.platform}</span>
            <span className="flex items-center gap-1"><User className="w-3 h-3" />{m.host}</span>
          </div>
          {m.agenda && (
            <div className="flex items-start gap-1.5">
              <FileText className="w-3 h-3 text-[var(--os-text-2)] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[var(--os-text-2)] leading-relaxed">{m.agenda}</p>
            </div>
          )}
        </div>
        {!isPast && m.joinLink && (
          <a href={m.joinLink} target="_blank" rel="noreferrer" className="flex-shrink-0">
            <Button variant="primary" size="sm" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>Join</Button>
          </a>
        )}
      </div>
    </Card>
  )
}

export function InvestorMeetings() {
  const { data } = useInvestorMeetings()
  const apiMeetings = (data as any)?.meetings ?? []
  const meetings: Meeting[] = apiMeetings.length ? apiMeetings : MOCK_MEETINGS

  const now = new Date()
  const upcoming = meetings.filter(m => new Date(m.startTime) >= now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  const past = meetings.filter(m => new Date(m.startTime) < now)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

  return (
    <div className="space-y-8">
      <KIMMPSignalBar module="Meetings & Calls" />
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Board Meetings & Calls</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>{meetings.length} meetings · {upcoming.length} upcoming</p>
      </div>

      <div>
        <p className="text-xs font-bold text-[var(--os-text-2)] uppercase tracking-widest mb-3">Upcoming</p>
        {upcoming.length === 0
          ? <p className="text-sm text-[var(--os-text-2)] text-center py-6 border border-dashed rounded-xl" style={{ borderColor: 'var(--os-border)' }}>No upcoming meetings scheduled.</p>
          : <div className="space-y-3">{upcoming.map(m => <MeetingCard key={m.id} m={m} />)}</div>
        }
      </div>

      {past.length > 0 && (
        <div>
          <p className="text-xs font-bold text-[var(--os-text-2)] uppercase tracking-widest mb-3">Past meetings</p>
          <div className="space-y-3">{past.map(m => <MeetingCard key={m.id} m={m} />)}</div>
        </div>
      )}
    </div>
  )
}

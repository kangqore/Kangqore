import { Video, Phone, MapPin, ExternalLink, Calendar, Clock, User } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { useClientMeetings } from '../useClientData'

// ─── mock fallback ────────────────────────────────────────────────────────────

const MOCK_MEETINGS = [
  {
    id: 'm1', title: 'Sprint 13 Review', type: 'VIDEO', platform: 'ZOOM',
    startTime: '2026-06-10T10:00:00Z', endTime: '2026-06-10T11:00:00Z',
    status: 'SCHEDULED', joinLink: 'https://zoom.us/j/99001122',
    meetingMode: 'ONLINE', creator: { name: 'Ravi Nair', email: 'ravi@kangqore.com' },
  },
  {
    id: 'm2', title: 'HIPAA Compliance Walkthrough', type: 'VIDEO', platform: 'GOOGLE_MEET',
    startTime: '2026-06-17T14:00:00Z', endTime: '2026-06-17T15:00:00Z',
    status: 'SCHEDULED', joinLink: 'https://meet.google.com/abc-defg-hij',
    meetingMode: 'ONLINE', creator: { name: 'Omar Khalid', email: 'omar@kangqore.com' },
  },
  {
    id: 'm3', title: 'Monthly Steering Committee', type: 'VIDEO', platform: 'ZOOM',
    startTime: '2026-05-28T09:00:00Z', endTime: '2026-05-28T10:30:00Z',
    status: 'COMPLETED', joinLink: null,
    meetingMode: 'ONLINE', creator: { name: 'Mahesh Kumar', email: 'mahesh@kangqore.com' },
  },
  {
    id: 'm4', title: 'Analytics Dashboard Design Review', type: 'VIDEO', platform: 'ZOOM',
    startTime: '2026-05-14T11:00:00Z', endTime: '2026-05-14T12:00:00Z',
    status: 'COMPLETED', joinLink: null,
    meetingMode: 'ONLINE', creator: { name: 'Anika Roy', email: 'anika@kangqore.com' },
  },
]

const MOCK_CONSULTATIONS = [
  {
    id: 'c1', name: 'Patient Portal Consultation Request',
    service: 'Digital Transformation', status: 'SCHEDULED',
    scheduledAt: '2026-06-12T10:00:00Z', meetingLink: 'https://zoom.us/j/88776655',
    meetingMode: 'VIDEO', createdAt: '2026-06-01T09:00:00Z',
  },
]

// ─── helpers ─────────────────────────────────────────────────────────────────

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
const fmtTime = (s: string) => new Date(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
const duration = (start: string, end: string) => {
  const mins = (new Date(end).getTime() - new Date(start).getTime()) / 60000
  return mins >= 60 ? `${Math.floor(mins / 60)}h${mins % 60 ? ` ${mins % 60}m` : ''}` : `${mins}m`
}

const PLATFORM_ICON: Record<string, React.ReactNode> = {
  ZOOM:        <Video className="w-3.5 h-3.5 text-blue-500" />,
  GOOGLE_MEET: <Video className="w-3.5 h-3.5 text-green-500" />,
  TEAMS:       <Video className="w-3.5 h-3.5 text-purple-500" />,
  PHONE:       <Phone className="w-3.5 h-3.5 text-slate-500" />,
  IN_PERSON:   <MapPin className="w-3.5 h-3.5 text-orange-500" />,
}

function MeetingCard({ meeting }: { meeting: typeof MOCK_MEETINGS[0] }) {
  const isPast = new Date(meeting.startTime) < new Date()
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-center w-14">
          <div className="text-2xl font-bold text-[#2564ea] leading-none">
            {new Date(meeting.startTime).getDate()}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wide">
            {new Date(meeting.startTime).toLocaleDateString('en-GB', { month: 'short' })}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold text-white">{meeting.title}</h3>
            {isPast
              ? <Badge variant="neutral" size="sm">Completed</Badge>
              : <Badge variant="success" dot size="sm">Upcoming</Badge>
            }
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {fmtTime(meeting.startTime)} · {duration(meeting.startTime, meeting.endTime)}
            </span>
            <span className="flex items-center gap-1.5">
              {PLATFORM_ICON[meeting.platform] ?? PLATFORM_ICON.ZOOM}
              {meeting.platform?.replace('_', ' ')}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {meeting.creator?.name}
            </span>
          </div>
        </div>
        {!isPast && meeting.joinLink && (
          <a href={meeting.joinLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
            <Button variant="primary" size="sm" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
              Join
            </Button>
          </a>
        )}
      </div>
    </Card>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function ClientMeetings() {
  const { data } = useClientMeetings()

  const meetings: typeof MOCK_MEETINGS = (data as any)?.meetings?.length
    ? (data as any).meetings
    : MOCK_MEETINGS

  const consultations: typeof MOCK_CONSULTATIONS = (data as any)?.consultations?.length
    ? (data as any).consultations
    : MOCK_CONSULTATIONS

  const now = new Date()
  const upcoming = meetings
    .filter(m => new Date(m.startTime) >= now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  const past = meetings
    .filter(m => new Date(m.startTime) < now)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white">Meetings</h2>
        <p className="text-sm text-slate-500 mt-0.5">{meetings.length} total · {upcoming.length} upcoming</p>
      </div>

      {/* Consultation requests */}
      {consultations.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Consultation requests</p>
          <div className="space-y-3">
            {consultations.map(c => (
              <Card key={c.id} className="border-blue-100 bg-blue-50/40">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{c.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{c.service}</p>
                    {c.scheduledAt && (
                      <p className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Scheduled: {fmtDate(c.scheduledAt)} at {fmtTime(c.scheduledAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="info" size="sm">{c.status}</Badge>
                    {c.meetingLink && (
                      <a href={c.meetingLink} target="_blank" rel="noreferrer">
                        <Button variant="primary" size="sm" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>Join</Button>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Upcoming</p>
        {upcoming.length === 0
          ? <p className="text-sm text-slate-500 py-6 text-center border border-dashed border-[#2E2854] rounded-xl">No upcoming meetings scheduled.</p>
          : <div className="space-y-3">{upcoming.map(m => <MeetingCard key={m.id} meeting={m} />)}</div>
        }
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Past meetings</p>
          <div className="space-y-3">{past.map(m => <MeetingCard key={m.id} meeting={m} />)}</div>
        </div>
      )}
    </div>
  )
}

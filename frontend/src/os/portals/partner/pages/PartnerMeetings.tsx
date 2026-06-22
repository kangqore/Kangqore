import { Video, Clock, User, ExternalLink } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { usePartnerMeetings } from '../usePartnerData'

const MOCK_MEETINGS = [
  {
    id: 'm1', title: 'Sprint 14 Review — Urban Mobility', type: 'VIDEO', platform: 'ZOOM',
    startTime: '2026-06-10T10:00:00Z', endTime: '2026-06-10T11:00:00Z',
    status: 'SCHEDULED', joinLink: 'https://zoom.us/j/99001122',
    host: 'Mahesh Kumar',
  },
  {
    id: 'm2', title: 'GreenSpark Energy — Design Review', type: 'VIDEO', platform: 'GOOGLE_MEET',
    startTime: '2026-06-13T14:00:00Z', endTime: '2026-06-13T15:00:00Z',
    status: 'SCHEDULED', joinLink: 'https://meet.google.com/abc-defg-hij',
    host: 'Anika Roy',
  },
  {
    id: 'm3', title: 'Sprint 13 Review — Urban Mobility', type: 'VIDEO', platform: 'ZOOM',
    startTime: '2026-05-27T10:00:00Z', endTime: '2026-05-27T11:00:00Z',
    status: 'COMPLETED', joinLink: null,
    host: 'Mahesh Kumar',
  },
  {
    id: 'm4', title: 'Quantum Analytics — Final Handover', type: 'VIDEO', platform: 'ZOOM',
    startTime: '2026-05-20T15:00:00Z', endTime: '2026-05-20T16:00:00Z',
    status: 'COMPLETED', joinLink: null,
    host: 'Ravi Nair',
  },
]

const fmtTime = (s: string) => new Date(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
const duration = (start: string, end: string) => {
  const mins = (new Date(end).getTime() - new Date(start).getTime()) / 60000
  return mins >= 60 ? `${Math.floor(mins / 60)}h` : `${mins}m`
}

type Meeting = typeof MOCK_MEETINGS[0]

export function PartnerMeetings() {
  const { data: liveMeetings } = usePartnerMeetings()
  const meetings: Meeting[] = (liveMeetings?.length ? liveMeetings : MOCK_MEETINGS) as Meeting[]
  const now = new Date()
  const upcoming = meetings.filter(m => new Date(m.startTime) >= now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  const past = meetings.filter(m => new Date(m.startTime) < now)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

  const renderMeeting = (m: typeof meetings[0]) => {
    const isPast = new Date(m.startTime) < now
    return (
      <Card key={m.id} className="hover:shadow-md transition-all duration-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-center w-12">
            <div className="text-2xl font-bold tracking-tight text-os-success leading-none">
              {new Date(m.startTime).getDate()}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">
              {new Date(m.startTime).toLocaleDateString('en-GB', { month: 'short' })}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white">{m.title}</h3>
              {isPast
                ? <Badge variant="neutral" size="sm">Completed</Badge>
                : <Badge variant="success" dot size="sm">Upcoming</Badge>
              }
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{fmtTime(m.startTime)} · {duration(m.startTime, m.endTime)}</span>
              <span className="flex items-center gap-1.5"><Video className="w-3 h-3" />{m.platform?.replace('_', ' ')}</span>
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{m.host}</span>
            </div>
          </div>
          {!isPast && m.joinLink && (
            <a href={m.joinLink} target="_blank" rel="noreferrer">
              <Button variant="primary" size="sm" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>Join</Button>
            </a>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-white">Meetings</h2>
        <p className="text-sm text-slate-500 mt-0.5">{meetings.length} total · {upcoming.length} upcoming</p>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Upcoming</p>
        {upcoming.length === 0
          ? <p className="text-sm text-slate-500 text-center py-6 border border-dashed border-white/10 border-t-white/20 rounded-xl">No upcoming meetings.</p>
          : <div className="space-y-3">{upcoming.map(renderMeeting)}</div>
        }
      </div>

      {past.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Past meetings</p>
          <div className="space-y-3">{past.map(renderMeeting)}</div>
        </div>
      )}
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, Clock, Circle, MessageSquare, Calendar, User } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'

// ─── Status → stage mapping ───────────────────────────────────────────────────

const STATUS_TO_STAGE: Record<string, string> = {
  RECEIVED:     'applied',
  REVIEWING:    'screening',
  SHORTLISTED:  'screening',
  INTERVIEWING: 'technical',
  OFFERED:      'offer',
  REJECTED:     'final',
  WITHDRAWN:    'final',
}

const STAGES = [
  { id: 'applied',   label: 'Applied'             },
  { id: 'screening', label: 'Screening Call'       },
  { id: 'technical', label: 'Technical Interview'  },
  { id: 'final',     label: 'Final Interview'      },
  { id: 'offer',     label: 'Offer'                },
]

const MOCK_APP = {
  role: 'Senior Backend Engineer', appliedDate: '2026-05-08', status: 'INTERVIEWING',
  location: 'London, UK / Remote', salary: '£80k–£100k', notes: '', interviewedAt: '2026-05-28',
}

const MOCK_MESSAGES = [
  { from: 'Anika Roy', date: '2026-05-14', text: 'Great speaking with you today! Moving you to the technical round.' },
  { from: 'You',       date: '2026-05-15', text: 'Thanks! Looking forward to it. Happy anytime from Monday.'         },
]

export function MyApplication() {
  const { data: app, isLoading } = useQuery({
    queryKey: ['careers', 'my-application'],
    queryFn: () => api.get('/careers/my-application').then(r => r.data).catch(() => null),
    staleTime: 1000 * 60 * 5,
  })

  const { data: emails } = useQuery({
    queryKey: ['careers', 'emails'],
    queryFn: () => api.get('/careers/emails').then(r => r.data ?? []),
    staleTime: 1000 * 60 * 5,
  })

  const application = app ?? MOCK_APP
  const currentStage = STATUS_TO_STAGE[application.status] ?? 'applied'
  const currentIdx   = STAGES.findIndex(s => s.id === currentStage)
  const messages     = (emails as {from?: string; senderName?: string; body?: string; createdAt?: string}[])?.length
    ? emails.map((e: {from?: string; senderName?: string; body?: string; createdAt?: string}) => ({
        from: e.from ?? e.senderName ?? 'Team',
        date: e.createdAt ? new Date(e.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—',
        text: e.body ?? '',
      }))
    : MOCK_MESSAGES

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)] px-6 lg:px-10 py-10">
        <Spinner size="sm" /> Loading your application…
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <KIMMPSignalBar module="My Application" />
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>My Application</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>Track your application progress for {application.role} at Kangqore</p>
      </div>

      {/* Role card */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--os-text-1)' }}>{application.role}</h3>
              <p className="text-sm text-[var(--os-text-2)] mt-1">{application.location} · {application.salary}</p>
            </div>
            <Badge variant="info" size="sm" dot>In Progress</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Applied',       value: application.appliedDate                     },
              { label: 'Current Stage', value: STAGES.find(s => s.id === currentStage)?.label ?? '—' },
              { label: 'Salary',        value: application.salary                           },
            ].map(item => (
              <div key={item.label} className="rounded-xl p-3" style={{ background: 'var(--os-surface)', border: '1px solid var(--os-border)' }}>
                <p className="text-xs text-[var(--os-text-2)] mb-0.5">{item.label}</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress timeline */}
        <Card>
          <CardHeader><CardTitle>Application Progress</CardTitle></CardHeader>
          <CardBody className="space-y-4">
            {STAGES.map((stage, i) => {
              const isDone   = i < currentIdx
              const isActive = stage.id === currentStage
              const isFuture = i > currentIdx

              return (
                <div key={stage.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDone ? 'bg-green-100' : isActive ? 'bg-blue-100' : ''
                    }`}>
                      {isDone
                        ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                        : isActive
                          ? <Clock className="w-4 h-4 text-blue-600" />
                          : <Circle className="w-4 h-4 text-[var(--os-text-1)]" />
                      }
                    </div>
                    {i < STAGES.length - 1 && (
                      <div className={`w-px flex-1 my-1 ${isDone ? 'bg-green-200' : 'bg-slate-200'}`} style={{ minHeight: '16px' }} />
                    )}
                  </div>

                  <div className={`pb-4 flex-1 ${isFuture ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${isActive ? 'text-blue-700' : ''}`} style={!isActive ? { color: 'var(--os-text-1)' } : undefined}>{stage.label}</p>
                      {isActive && <Badge variant="info" size="sm" dot>Current</Badge>}
                    </div>
                    {isActive && application.interviewedAt && (
                      <p className="text-xs text-[var(--os-text-2)] mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{application.interviewedAt}
                      </p>
                    )}
                    {isActive && application.notes && (
                      <p className="text-xs text-[var(--os-text-2)] mt-1 leading-relaxed">{application.notes}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </CardBody>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {messages.map((msg: { from: string; date: string; text: string }, i: number) => {
              const isMe = msg.from === 'You'
              return (
                <div key={i} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isMe ? 'bg-blue-600 text-white' : 'bg-slate-200 text-[var(--os-text-2)]'
                  }`}>
                    {isMe ? 'Me' : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`flex-1 max-w-[85%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`rounded-xl px-3 py-2 text-sm ${
                      isMe ? 'bg-blue-600 text-white' : 'text-[var(--os-text-1)]'
                    }`}>
                      {msg.text}
                    </div>
                    <p className="text-[10px] text-[var(--os-text-2)] mt-1">{isMe ? 'You' : msg.from} · {msg.date}</p>
                  </div>
                </div>
              )
            })}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

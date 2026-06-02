import { CheckCircle2, Clock, Circle, MessageSquare, Calendar, User } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'

const MY_APPLICATION = {
  role: 'Senior Backend Engineer',
  company: 'Kangqore',
  appliedDate: '2026-05-08',
  currentStage: 'technical',
  hiringManager: 'Dev Patel',
  recruiter: 'Anika Roy',
  salary: '£80k–£100k',
  location: 'London, UK / Remote',

  stages: [
    { id: 'applied',   label: 'Applied',                 done: true,  date: '2026-05-08', note: 'Application received. KIMMP CV score: 79/100.'             },
    { id: 'screening', label: 'Screening Call',          done: true,  date: '2026-05-14', note: '30-min call with Anika Roy. Strong culture fit confirmed.'  },
    { id: 'technical', label: 'Technical Interview',     done: false, date: '2026-05-28', note: 'System design + live coding. Scheduled with Dev Patel.'     },
    { id: 'final',     label: 'Final Interview',         done: false, date: null,         note: 'Panel interview with CTO and Head of Delivery.'             },
    { id: 'offer',     label: 'Offer',                   done: false, date: null,         note: ''                                                           },
  ],

  messages: [
    { from: 'Anika Roy',  date: '2026-05-14', text: 'Great speaking with you today! Moving you to the technical round — Dev will reach out to schedule.'   },
    { from: 'You',        date: '2026-05-15', text: 'Thanks Anika! Looking forward to it. Happy anytime from Monday.'                                       },
    { from: 'Dev Patel',  date: '2026-05-20', text: 'Hi! I\'ve scheduled the technical interview for 28 May at 10:00 BST. A Zoom link is in your calendar.' },
    { from: 'You',        date: '2026-05-20', text: 'Perfect, confirmed. Thanks Dev!'                                                                       },
  ],
}

export function MyApplication() {
  const currentIdx = MY_APPLICATION.stages.findIndex(s => s.id === MY_APPLICATION.currentStage)

  return (
    <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">My Application</h2>
        <p className="text-sm text-slate-500 mt-1">Track your application progress for {MY_APPLICATION.role} at Kangqore.</p>
      </div>

      {/* Role card */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{MY_APPLICATION.role}</h3>
              <p className="text-sm text-slate-500 mt-1">{MY_APPLICATION.location} · {MY_APPLICATION.salary}</p>
            </div>
            <Badge variant="info" size="sm" dot>In Progress</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              { label: 'Applied',         value: MY_APPLICATION.appliedDate    },
              { label: 'Hiring Manager',  value: MY_APPLICATION.hiringManager  },
              { label: 'Recruiter',       value: MY_APPLICATION.recruiter      },
              { label: 'Current Stage',   value: MY_APPLICATION.stages.find(s => s.id === MY_APPLICATION.currentStage)?.label ?? '—' },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                <p className="text-sm font-semibold text-slate-900">{item.value}</p>
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
            {MY_APPLICATION.stages.map((stage, i) => {
              const isActive  = stage.id === MY_APPLICATION.currentStage
              const isFuture  = i > currentIdx

              return (
                <div key={stage.id} className="flex gap-4">
                  {/* Timeline node */}
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      stage.done ? 'bg-green-100' : isActive ? 'bg-blue-100' : 'bg-slate-100'
                    }`}>
                      {stage.done
                        ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                        : isActive
                          ? <Clock className="w-4 h-4 text-blue-600" />
                          : <Circle className="w-4 h-4 text-slate-300" />
                      }
                    </div>
                    {i < MY_APPLICATION.stages.length - 1 && (
                      <div className={`w-px flex-1 my-1 ${stage.done ? 'bg-green-200' : 'bg-slate-200'}`} style={{ minHeight: '16px' }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pb-4 flex-1 ${isFuture ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${isActive ? 'text-blue-700' : 'text-slate-900'}`}>{stage.label}</p>
                      {isActive && <Badge variant="info" size="sm" dot>Current</Badge>}
                    </div>
                    {stage.date && (
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{stage.date}
                      </p>
                    )}
                    {stage.note && (
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{stage.note}</p>
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
            {MY_APPLICATION.messages.map((msg, i) => {
              const isMe = msg.from === 'You'
              return (
                <div key={i} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isMe ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isMe ? 'Me' : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`flex-1 max-w-[85%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`rounded-xl px-3 py-2 text-sm ${
                      isMe ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {msg.text}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{isMe ? 'You' : msg.from} · {msg.date}</p>
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

import { useNavigate } from 'react-router-dom'
import { Phone, Mail, MapPin, ChevronLeft, Phone as PhoneIcon, Mail as MailIcon, Video, MessageSquare, GitCommit, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Progress } from '@design-system/components/Progress'
import { Divider } from '@design-system/components/Divider'
import { useLeadsStore } from '../store'
import type { LeadStage, ActivityType } from '../types'

const STAGE_ORDER: LeadStage[] = ['new','qualified','proposal','negotiation','won','lost']
const STAGE_COLOR: Record<LeadStage, string> = {
  new: 'bg-slate-300', qualified: 'bg-blue-400', proposal: 'bg-amber-400',
  negotiation: 'bg-violet-500', won: 'bg-green-500', lost: 'bg-red-400',
}
const STAGE_VARIANT: Record<LeadStage, 'neutral'|'info'|'warning'|'brand'|'success'|'danger'> = {
  new: 'neutral', qualified: 'info', proposal: 'warning', negotiation: 'brand', won: 'success', lost: 'danger',
}
const ACTIVITY_ICON: Record<ActivityType, React.ElementType> = {
  email: MailIcon, call: PhoneIcon, meeting: Video, note: MessageSquare,
  'score-change': TrendingUp, 'stage-change': GitCommit,
}
const ACTIVITY_COLOR: Record<ActivityType, string> = {
  email: 'bg-blue-100 text-blue-600', call: 'bg-green-100 text-green-600',
  meeting: 'bg-violet-100 text-violet-600', note: 'bg-amber-100 text-amber-600',
  'score-change': 'bg-[#2564ea]/10 text-[#2564ea]', 'stage-change': 'bg-slate-100 text-slate-600',
}
const SOURCE_VARIANT = {
  eQORE: 'brand', inbound: 'success', outbound: 'neutral',
  referral: 'info', event: 'warning', website: 'neutral',
} as const

export function LeadProfile() {
  const navigate = useNavigate()
  const { leads, selectedId, setSelected, leadSignals, leadActivities } = useLeadsStore()
  const lead       = leads.find(l => l.id === selectedId) ?? leads[0]
  const signals    = leadSignals(lead.id)
  const activities = leadActivities(lead.id)

  const stageIdx   = STAGE_ORDER.indexOf(lead.stage)
  const activeStages = STAGE_ORDER.filter(s => s !== 'lost')

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4"/>} onClick={() => navigate('/os/leads')}>
          Pipeline
        </Button>
        <select value={selectedId} onChange={e => setSelected(e.target.value)}
          className="ml-auto h-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 pl-3 pr-8 outline-none focus:border-[#2564ea] focus:ring-2 focus:ring-[#2564ea]/20">
          {leads.map(l => <option key={l.id} value={l.id}>{l.company}</option>)}
        </select>
      </div>

      {/* Header card */}
      <Card>
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2564ea] to-[#4ab6d4] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">{lead.company.slice(0,2).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h2 className="text-xl font-bold text-slate-900">{lead.company}</h2>
              <Badge variant={STAGE_VARIANT[lead.stage]} size="sm" dot>{lead.stage}</Badge>
              <Badge variant={SOURCE_VARIANT[lead.source]} size="sm">{lead.source}</Badge>
            </div>
            <p className="text-sm text-slate-500">{lead.contactName} · {lead.contactRole}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3"/>{lead.email}</span>
              {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3"/>{lead.phone}</span>}
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{lead.country}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{lead.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">£{(lead.value/1000).toFixed(0)}k</p>
              <p className="text-xs text-slate-400">deal value</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${lead.score >= 80 ? 'bg-green-500' : lead.score >= 60 ? 'bg-amber-400' : 'bg-slate-300'}`} />
              <span className="text-xl font-bold text-slate-800">{lead.score}</span>
              <span className="text-xs text-slate-400">eQORE score</span>
            </div>
            <Badge variant={lead.probability >= 60 ? 'success' : lead.probability >= 30 ? 'warning' : 'neutral'} size="sm">
              {lead.probability}% win probability
            </Badge>
          </div>
        </div>

        <Divider className="my-4" />

        {/* Stage progress */}
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Pipeline Stage</p>
          <div className="flex items-center gap-1">
            {activeStages.map((s, i) => {
              const isActive  = lead.stage === s
              const isPast    = STAGE_ORDER.indexOf(s) < stageIdx && lead.stage !== 'lost'
              const isLost    = lead.stage === 'lost'
              return (
                <div key={s} className="flex items-center flex-1">
                  <div className={cn(
                    'flex items-center justify-center rounded-full text-[10px] font-bold w-7 h-7 flex-shrink-0 transition-all',
                    isActive  ? `${STAGE_COLOR[s]} text-white scale-110` :
                    isPast    ? 'bg-green-100 text-green-600' :
                    isLost    ? 'bg-red-50 text-red-300' :
                    'bg-slate-100 text-slate-400'
                  )}>
                    {i + 1}
                  </div>
                  {i < activeStages.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 rounded ${isPast && !isLost ? 'bg-green-400' : 'bg-slate-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-1.5">
            {activeStages.map(s => (
              <span key={s} className={`text-[9px] font-medium capitalize flex-1 text-center ${lead.stage === s ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>{s}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 flex-wrap">
          {lead.tags.map(t => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-[#2564ea]/5 text-[#2564ea] font-medium border border-[#2564ea]/15">{t}</span>)}
        </div>
      </Card>

      {/* eQORE + activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* eQORE score breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#2564ea] to-[#4ab6d4] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">eQ</span>
              </div>
              <CardTitle>eQORE Score Breakdown</CardTitle>
            </div>
            <span className="text-2xl font-bold text-slate-900">{lead.score}</span>
          </CardHeader>
          {signals.length > 0 ? (
            <div className="space-y-3">
              {signals.map(sig => (
                <div key={sig.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize ${
                        sig.category === 'intent'       ? 'bg-red-50 text-red-600' :
                        sig.category === 'fit'          ? 'bg-[#2564ea]/8 text-[#2564ea]' :
                        sig.category === 'engagement'   ? 'bg-green-50 text-green-600' :
                        'bg-slate-100 text-slate-500'
                      }`}>{sig.category}</span>
                      <span className="text-xs text-slate-700 font-medium">{sig.signal}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">+{sig.contribution.toFixed(1)}</span>
                  </div>
                  <Progress value={sig.rawScore} size="sm" color={sig.rawScore >= 80 ? 'success' : sig.rawScore >= 60 ? 'warning' : 'brand'} />
                  <p className="text-[10px] text-slate-400 mt-0.5">{sig.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-6 text-center">No eQORE signals yet — score based on manual assessment</p>
          )}
        </Card>

        {/* Activity timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <Badge variant="neutral" size="sm">{activities.length}</Badge>
          </CardHeader>
          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.slice(0,7).map(act => {
                const Icon = ACTIVITY_ICON[act.type]
                return (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${ACTIVITY_COLOR[act.type]}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-slate-800 truncate">{act.title}</p>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{new Date(act.date).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
                      </div>
                      {act.metadata && <span className="text-[10px] font-semibold text-[#2564ea] bg-[#2564ea]/5 px-1.5 py-0.5 rounded mt-0.5 inline-block">{act.metadata}</span>}
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{act.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{act.owner}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-6 text-center">No activity yet</p>
          )}
        </Card>
      </div>

      {/* Stats row */}
      <Card padding="sm">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Industry',       value: lead.industry },
            { label: 'Owner',          value: lead.owner.split(' ')[0] },
            { label: 'Created',        value: new Date(lead.createdAt).toLocaleDateString('en-GB',{month:'short',year:'numeric'}) },
            { label: 'Last activity',  value: new Date(lead.lastActivity).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) },
            { label: 'Forecast',       value: `£${((lead.value * lead.probability)/100000).toFixed(0)}k weighted` },
          ].map(s => (
            <div key={s.label}>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{s.label}</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function cn(...cls: (string | boolean | undefined)[]) {
  return cls.filter(Boolean).join(' ')
}

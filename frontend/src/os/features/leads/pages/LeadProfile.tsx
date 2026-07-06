import { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { VisitorJourneyPanel } from '../../../components/VisitorJourneyPanel'
import { useQuery } from '@tanstack/react-query'
import { Phone, Mail, MapPin, ChevronLeft, Phone as PhoneIcon, Mail as MailIcon, Video, MessageSquare, GitCommit, TrendingUp, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Progress } from '@design-system/components/Progress'
import { Divider } from '@design-system/components/Divider'
import { api, isDemo } from '@lib/api'
import { useLeadsStore } from '../store'
import type { Lead, LeadStage, ActivityType } from '../types'

interface EqoreLeadDetailRaw extends Record<string, unknown> {
  id?: unknown
  companyName?: unknown
  name?: unknown
  role?: unknown
  email?: unknown
  phone?: unknown
  createdAt?: unknown
  updatedAt?: unknown
  sessionId?: unknown
  conversationId?: unknown
}

function toLeadFromDetail(e: EqoreLeadDetailRaw): Partial<Lead> {
  return {
    id:           String(e.id ?? ''),
    company:      String(e.companyName ?? e.company ?? 'Unknown'),
    contactName:  String(e.name ?? e.contactName ?? ''),
    contactRole:  String(e.role ?? e.contactRole ?? ''),
    email:        String(e.email ?? ''),
    phone:        e.phone ? String(e.phone) : undefined,
    createdAt:    String(e.createdAt ?? '').slice(0, 10),
    lastActivity: String(e.updatedAt ?? '').slice(0, 10),
  }
}

const STAGE_ORDER: LeadStage[] = ['new','qualified','proposal','negotiation','won','lost']
const STAGE_COLOR: Record<LeadStage, string> = {
  new: '#579bfc', qualified: '#fdab3d', proposal: '#7c3aed',
  negotiation: '#323338', won: '#00c875', lost: '#e2445c',
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
  'score-change': 'bg-os-blue/10 text-os-blue', 'stage-change': 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_var(--os-border),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-[var(--os-text-1)]',
}
const SOURCE_VARIANT = {
  eQORE: 'brand', inbound: 'success', outbound: 'neutral',
  referral: 'info', event: 'warning', website: 'neutral',
} as const

export function LeadProfile() {
  const navigate = useNavigate()
  const { id: paramId } = useParams<{ id: string }>()
  const { leads, isLoading, selectedId, setSelected, leadSignals, leadActivities, updateLead } = useLeadsStore()

  const resolvedId = paramId ?? selectedId
  const lead = leads.find(l => l.id === resolvedId) ?? leads[0]

  const { data: detailData } = useQuery({
    queryKey: ['lead', resolvedId],
    queryFn: () => api.get(`/admin/eqore/leads/${resolvedId}`).then(r => r.data.lead as EqoreLeadDetailRaw),
    staleTime: 60_000,
    enabled: !isDemo() && !!resolvedId,
  })

  useEffect(() => {
    if (detailData && resolvedId) {
      updateLead(resolvedId, toLeadFromDetail(detailData))
    }
  }, [detailData, resolvedId, updateLead])

  const signals    = lead ? leadSignals(lead.id) : []
  const activities = lead ? leadActivities(lead.id) : []

  if (isLoading && !lead) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-32 bg-[var(--os-surface-0)] rounded-xl animate-pulse" />
        <div className="h-40 bg-[var(--os-surface-0)] rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-64 bg-[var(--os-surface-0)] rounded-xl animate-pulse" />
          <div className="h-64 bg-[var(--os-surface-0)] rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20" style={{ color: 'var(--os-text-2)' }}>
        <p className="text-sm font-medium">No lead selected</p>
        <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4"/>} onClick={() => navigate('/kangqore-view/admin/leads')} className="mt-3">
          Back to Pipeline
        </Button>
      </div>
    )
  }

  const stageIdx   = STAGE_ORDER.indexOf(lead.stage)
  const activeStages = STAGE_ORDER.filter(s => s !== 'lost')

  // Score ring SVG
  const scoreColor = lead.score >= 80 ? '#00c875' : lead.score >= 60 ? '#fdab3d' : 'var(--os-text-2)'
  const r = 40, circ = 2 * Math.PI * r
  const dash = (lead.score / 100) * circ

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4"/>} onClick={() => navigate('/kangqore-view/admin/leads')}>
          Pipeline
        </Button>
        <select value={selectedId} onChange={e => setSelected(e.target.value)}
          className="ml-auto h-9 rounded-xl border border-[var(--os-border)] text-sm pl-3 pr-8 outline-none"
          style={{ background: 'var(--os-card)', color: 'var(--os-text-1)' }}>
          {leads.map(l => <option key={l.id} value={l.id}>{l.company}</option>)}
        </select>
      </div>

      {/* Header card — Salesforce style */}
      <div className="os-card p-5">
        {/* Stage progress strip at top */}
        <div className="mb-5">
          <div className="flex items-center gap-0">
            {activeStages.map((s, i) => {
              const isActive = lead.stage === s
              const isPast   = STAGE_ORDER.indexOf(s) < stageIdx && lead.stage !== 'lost'
              const stageC   = STAGE_COLOR[s]
              return (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={cn('w-full h-1.5 rounded-sm transition-all')}
                      style={{ background: isPast || isActive ? stageC : 'var(--os-border)' }} />
                    <span className="text-[9px] font-semibold mt-1.5 capitalize"
                      style={{ color: isActive ? stageC : 'var(--os-text-2)', fontWeight: isActive ? 700 : 500 }}>
                      {s}
                    </span>
                  </div>
                  {i < activeStages.length - 1 && <div className="w-1" />}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-start gap-5 flex-wrap">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-black text-xl shadow-lg"
            style={{ background: STAGE_COLOR[lead.stage] }}>
            {lead.company.slice(0,2).toUpperCase()}
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h2 className="text-2xl font-black tracking-tight text-white">{lead.company}</h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white capitalize"
                style={{ background: STAGE_COLOR[lead.stage] }}>{lead.stage}</span>
              <Badge variant={SOURCE_VARIANT[lead.source]} size="sm">{lead.source}</Badge>
            </div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--os-text-2)' }}>{lead.contactName} · {lead.contactRole}</p>

            {/* Info rows — Salesforce icon + label + value */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 text-xs">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--os-text-2)' }} />
                <span style={{ color: 'var(--os-text-2)' }}>Email</span>
                <span className="font-medium text-white">{lead.email}</span>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2.5 text-xs">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--os-text-2)' }} />
                  <span style={{ color: 'var(--os-text-2)' }}>Phone</span>
                  <span className="font-medium text-white">{lead.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-xs">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--os-text-2)' }} />
                <span style={{ color: 'var(--os-text-2)' }}>Country</span>
                <span className="font-medium text-white">{lead.country}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {lead.tags.map(t => <span key={t} className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: '#579bfc22', color: '#579bfc' }}>{t}</span>)}
            </div>
          </div>

          {/* Score ring — AI scoring panel */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <div className="relative">
              <svg width={100} height={100} className="-rotate-90">
                <circle cx={50} cy={50} r={r} fill="none" stroke="var(--os-border)" strokeWidth={10} />
                <circle cx={50} cy={50} r={r} fill="none" stroke={scoreColor} strokeWidth={10}
                  strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.5s ease' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{lead.score}</span>
                <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'var(--os-text-2)' }}>score</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black tracking-tight text-white">₹{(lead.value/1000).toFixed(0)}k</p>
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--os-text-2)' }}>deal value</p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: lead.probability >= 60 ? '#00c87522' : '#fdab3d22', color: lead.probability >= 60 ? '#00c875' : '#fdab3d' }}>
              {lead.probability}% win
            </span>
          </div>
        </div>
      </div>

      {/* eQORE transcript link */}
      {detailData?.sessionId && (
        <div className="os-card p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#579bfc22' }}>
            <span className="text-[#579bfc] text-[10px] font-black">eQ</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">eQORE conversation on file</p>
            <p className="text-[11px] text-[var(--os-text-2)]">This lead was captured via eQORE. Review the full chat transcript.</p>
          </div>
          <Link
            to={`/kangqore-view/admin/visitors/transcripts`}
            state={{ openId: String(detailData.sessionId) }}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-[#579bfc] hover:text-blue-300 transition-colors flex-shrink-0"
          >
            View transcript <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* eQORE + activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* eQORE score breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: '#579bfc' }}>
                <span className="text-white text-[10px] font-bold">eQ</span>
              </div>
              <CardTitle>eQORE Score Breakdown</CardTitle>
            </div>
            <span className="text-2xl font-black tracking-tight text-white">{lead.score}</span>
          </CardHeader>
          {signals.length > 0 ? (
            <div className="space-y-3">
              {signals.map(sig => (
                <div key={sig.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize text-white`}
                        style={{ background: sig.category === 'intent' ? '#e2445c' : sig.category === 'fit' ? '#579bfc' : sig.category === 'engagement' ? '#00c875' : '#323338' }}>
                        {sig.category}
                      </span>
                      <span className="text-xs font-medium text-white">{sig.signal}</span>
                    </div>
                    <span className="text-xs font-bold text-white">+{sig.contribution.toFixed(1)}</span>
                  </div>
                  <Progress value={sig.rawScore} size="sm" color={sig.rawScore >= 80 ? 'success' : sig.rawScore >= 60 ? 'warning' : 'brand'} />
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--os-text-2)' }}>{sig.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm py-6 text-center" style={{ color: 'var(--os-text-2)' }}>No eQORE signals yet — score based on manual assessment</p>
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
                  <div key={act.id} className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-[var(--os-surface-0)] border-b border-[var(--os-border)] last:border-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${ACTIVITY_COLOR[act.type]}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-white truncate">{act.title}</p>
                        <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--os-text-2)' }}>{new Date(act.date).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
                      </div>
                      {act.metadata && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block" style={{ color: '#579bfc', background: '#579bfc11' }}>{act.metadata}</span>}
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--os-text-2)' }}>{act.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm py-6 text-center" style={{ color: 'var(--os-text-2)' }}>No activity yet</p>
          )}
        </Card>
      </div>

      {/* Pre-registration visitor journey */}
      {lead.email && <VisitorJourneyPanel email={lead.email} />}

      {/* Stats row */}
      <div className="os-card p-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Industry',       value: lead.industry },
            { label: 'Owner',          value: lead.owner.split(' ')[0] },
            { label: 'Created',        value: new Date(lead.createdAt).toLocaleDateString('en-GB',{month:'short',year:'numeric'}) },
            { label: 'Last activity',  value: new Date(lead.lastActivity).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) },
            { label: 'Forecast',       value: `₹${((lead.value * lead.probability)/100000).toFixed(0)}k weighted` },
          ].map(s => (
            <div key={s.label}>
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--os-text-2)' }}>{s.label}</p>
              <p className="text-sm font-bold text-white mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function cn(...cls: (string | boolean | undefined)[]) {
  return cls.filter(Boolean).join(' ')
}

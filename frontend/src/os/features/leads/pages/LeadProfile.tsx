import React, { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Phone, Mail, MapPin, ChevronLeft, Video,
  MessageSquare, TrendingUp, GitCommit, ExternalLink,
  ArrowUpRight, Globe
} from 'lucide-react'
import { api, isDemo } from '@lib/api'
import { useLeadsStore } from '../store'
import { VisitorJourneyPanel } from '../../../components/VisitorJourneyPanel'
import type { Lead, LeadStage, ActivityType } from '../types'

// ── Constants ─────────────────────────────────────────────────────────────────

const STAGE_ORDER: LeadStage[] = ['new', 'qualified', 'proposal', 'negotiation', 'won']
const STAGE_COLOR: Record<LeadStage, string> = {
  new: '#94a3b8', qualified: '#3b82f6', proposal: '#8b5cf6',
  negotiation: '#f59e0b', won: '#10b981', lost: '#ef4444',
}
const STAGE_LABEL: Record<LeadStage, string> = {
  new: 'New', qualified: 'Qualified', proposal: 'Proposal',
  negotiation: 'Negotiation', won: 'Won', lost: 'Lost',
}

const ACTIVITY_ICON: Record<ActivityType, React.ElementType> = {
  email: Mail, call: Phone, meeting: Video, note: MessageSquare,
  'score-change': TrendingUp, 'stage-change': GitCommit,
}
const ACTIVITY_COLOR: Record<ActivityType, { bg: string; color: string }> = {
  email:          { bg: '#dbeafe', color: '#2563eb' },
  call:           { bg: '#dcfce7', color: '#16a34a' },
  meeting:        { bg: '#ede9fe', color: '#7c3aed' },
  note:           { bg: '#fef3c7', color: '#d97706' },
  'score-change': { bg: '#dbeafe', color: '#2564ea' },
  'stage-change': { bg: '#f1f5f9', color: '#475569' },
}

const SIGNAL_CATEGORY_COLOR: Record<string, string> = {
  intent: '#ef4444', fit: '#3b82f6', engagement: '#10b981', firmographic: '#8b5cf6',
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={120} height={120} className="-rotate-90">
        <circle cx={60} cy={60} r={r} fill="none" stroke="#e2e8f0" strokeWidth={10} />
        {/* Multi-color arc segments like Salesforce */}
        <circle cx={60} cy={60} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black" style={{ color, lineHeight: 1 }}>{score}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">eQORE</span>
      </div>
    </div>
  )
}

function LeadQueueCard({ lead, isActive, onClick }: { lead: Lead; isActive: boolean; onClick: () => void }) {
  const sc = STAGE_COLOR[lead.stage]
  const scoreColor = lead.score >= 80 ? '#10b981' : lead.score >= 60 ? '#f59e0b' : '#94a3b8'
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-xl transition-all duration-150 relative overflow-hidden group"
      style={{
        background: isActive ? `${sc}12` : 'transparent',
        border: `1px solid ${isActive ? sc : 'transparent'}`,
      }}
    >
      {isActive && <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r" style={{ background: sc }} />}
      <div className="flex items-center gap-2.5 pl-1.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[11px] font-black"
          style={{ background: sc }}>
          {lead.company.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">{lead.company}</p>
          <p className="text-[11px] text-slate-400 truncate">{lead.contactRole}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className="text-sm font-black" style={{ color: scoreColor }}>{lead.score}</span>
        </div>
      </div>
    </button>
  )
}

function JourneyBar({ stage }: { stage: LeadStage }) {
  const isLost = stage === 'lost'
  const activeIdx = STAGE_ORDER.indexOf(isLost ? 'won' : stage)

  return (
    <div className="w-full">
      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
        {/* Gradient fill up to active stage */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{
            width: isLost ? '100%' : `${((activeIdx + 1) / STAGE_ORDER.length) * 100}%`,
            background: isLost
              ? '#ef4444'
              : `linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)`,
          }}
        />
        {/* Stage dots */}
        {STAGE_ORDER.map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white"
            style={{
              left: `calc(${(i / (STAGE_ORDER.length - 1)) * 100}% - 5px)`,
              background: i <= activeIdx && !isLost ? '#fff' : '#e2e8f0',
              boxShadow: i <= activeIdx && !isLost ? '0 0 0 2px #3b82f6' : 'none',
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {STAGE_ORDER.map((s, i) => {
          const isActive = stage === s
          const isPast   = STAGE_ORDER.indexOf(s) < STAGE_ORDER.indexOf(isLost ? 'new' : stage)
          return (
            <span key={s}
              className="text-[10px] font-semibold capitalize"
              style={{
                color: isActive ? STAGE_COLOR[s] : isPast ? '#94a3b8' : '#cbd5e1',
                fontWeight: isActive ? 700 : 500,
              }}>
              {STAGE_LABEL[s]}
            </span>
          )
        })}
        {isLost && <span className="text-[10px] font-bold text-red-500">Lost</span>}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

interface EqoreLeadDetailRaw extends Record<string, unknown> {
  id?: unknown; companyName?: unknown; name?: unknown; role?: unknown
  email?: unknown; phone?: unknown; createdAt?: unknown; updatedAt?: unknown
  sessionId?: unknown; conversationId?: unknown
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

export function LeadProfile() {
  const navigate = useNavigate()
  const { id: paramId } = useParams<{ id: string }>()
  const { leads, isLoading, selectedId, setSelected, leadSignals, leadActivities, updateLead } = useLeadsStore()

  const resolvedId = paramId ?? selectedId
  const lead = leads.find(l => l.id === resolvedId) ?? leads[0]

  const { data: detailData } = useQuery({
    queryKey: ['lead', resolvedId],
    queryFn: async () => {
      try {
        const r = await api.get(`/admin/eqore/leads/${resolvedId}`)
        return r.data.lead as EqoreLeadDetailRaw
      } catch {
        return null
      }
    },
    staleTime: 60_000,
    enabled: !!resolvedId,
    retry: false,
  })

  useEffect(() => {
    if (detailData && resolvedId) updateLead(resolvedId, toLeadFromDetail(detailData))
  }, [detailData, resolvedId, updateLead])

  const signals    = lead ? leadSignals(lead.id) : []
  const activities = lead ? leadActivities(lead.id) : []
  const activeLeads = leads.filter(l => l.stage !== 'lost').slice(0, 8)

  if (isLoading && !lead) {
    return (
      <div className="flex gap-5 h-full animate-pulse">
        <div className="w-56 flex-shrink-0 space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-slate-100" />)}
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-32 rounded-2xl bg-slate-100" />
          <div className="h-8 rounded-xl bg-slate-100 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-48 rounded-2xl bg-slate-100 col-span-2" />
            <div className="h-48 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-sm font-medium text-slate-500">No lead selected</p>
        <button
          onClick={() => navigate('/kangqore-view/admin/leads')}
          className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Pipeline
        </button>
      </div>
    )
  }

  const sc = STAGE_COLOR[lead.stage]
  const topSignals = signals.slice(0, 4)

  return (
    <div className="flex gap-0 h-full min-h-0 -mx-6 -mt-6 lg:-mx-10 lg:-mt-8">

      {/* ── LEFT: Work Queue ──────────────────────────────────────── */}
      <div className="w-56 flex-shrink-0 border-r border-slate-100 flex flex-col bg-white/60 overflow-hidden">
        <div className="px-4 pt-5 pb-3 flex-shrink-0">
          <button
            onClick={() => navigate('/kangqore-view/admin/leads')}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors mb-4"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Pipeline
          </button>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Work Queue</p>
          <p className="text-[11px] text-slate-400">{activeLeads.length} active leads</p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
          {activeLeads.map(l => (
            <LeadQueueCard
              key={l.id}
              lead={l}
              isActive={l.id === lead.id}
              onClick={() => setSelected(l.id)}
            />
          ))}
        </div>
      </div>

      {/* ── CENTER + RIGHT ───────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto bg-[#f8faff]">

        {/* Profile header */}
        <div className="bg-white border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-black text-lg shadow-sm"
              style={{ background: `linear-gradient(135deg, ${sc} 0%, ${sc}cc 100%)` }}>
              {lead.company.slice(0, 2).toUpperCase()}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-0.5">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{lead.company}</h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize text-white"
                  style={{ background: sc }}>{STAGE_LABEL[lead.stage]}</span>
                {lead.stage === 'won' && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">✓ Closed Won</span>}
              </div>
              <p className="text-sm text-slate-500">{lead.contactName} · {lead.contactRole} · {lead.country}</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {[
                { icon: Mail,  label: 'Email', href: `mailto:${lead.email}` },
                { icon: Phone, label: 'Call',  href: lead.phone ? `tel:${lead.phone}` : undefined },
                { icon: Video, label: 'Meet',  href: undefined },
                { icon: MessageSquare, label: 'Note', href: undefined },
              ].map(({ icon: Icon, label, href }) => (
                <a key={label}
                  href={href ?? '#'}
                  title={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-slate-500 hover:text-blue-600"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
              <div className="w-px h-5 bg-slate-200 mx-1" />
              <span className="text-xs font-semibold text-blue-600 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100">
                ₹{(lead.value / 1000).toFixed(0)}k deal
              </span>
            </div>
          </div>

          {/* Journey bar */}
          <div className="mt-5">
            <JourneyBar stage={lead.stage} />
          </div>
        </div>

        {/* 3-col body */}
        <div className="flex flex-1 min-h-0 divide-x divide-slate-100">

          {/* Contact info */}
          <div className="w-64 flex-shrink-0 p-5 space-y-5 bg-white">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Lead Information</p>
              <div className="space-y-3">
                {[
                  { icon: Globe,   label: 'Company',  value: lead.company     },
                  { icon: MapPin,  label: 'Country',  value: lead.country     },
                  { icon: Mail,    label: 'Email',    value: lead.email       },
                  { icon: Phone,   label: 'Phone',    value: lead.phone ?? '—'},
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-medium">{label}</p>
                      <p className="text-[13px] font-semibold text-slate-800 truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Source + tags */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Source</p>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full capitalize"
                style={{ background: '#dbeafe', color: '#2563eb' }}>
                {lead.source}
              </span>
            </div>

            {lead.tags.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {lead.tags.map(t => (
                    <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Key stats */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              {[
                { label: 'Industry',      value: lead.industry },
                { label: 'Owner',         value: lead.owner },
                { label: 'Win chance',    value: `${lead.probability}%` },
                { label: 'Weighted',      value: `₹${((lead.value * lead.probability) / 100000).toFixed(0)}k` },
                { label: 'Created',       value: new Date(lead.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) },
                { label: 'Last activity', value: new Date(lead.lastActivity).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) },
              ].map(s => (
                <div key={s.label} className="flex items-baseline justify-between">
                  <p className="text-[11px] text-slate-400">{s.label}</p>
                  <p className="text-[12px] font-semibold text-slate-700">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity timeline */}
          <div className="flex-1 min-w-0 p-5 overflow-y-auto">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Activity Timeline</p>

            {/* eQORE transcript link */}
            {detailData?.sessionId && (
              <div className="mb-4 p-3 rounded-xl flex items-center gap-3 bg-blue-50 border border-blue-100">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[9px] font-black">eQ</span>
                </div>
                <p className="text-xs font-medium text-blue-800 flex-1">eQORE conversation on file</p>
                <Link to="/kangqore-view/admin/visitors/transcripts" state={{ openId: String(detailData.sessionId) }}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 flex-shrink-0">
                  View <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}

            <div className="space-y-1">
              {activities.length > 0 ? activities.slice(0, 10).map(act => {
                const Icon = ACTIVITY_ICON[act.type]
                const c    = ACTIVITY_COLOR[act.type]
                return (
                  <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white transition-colors">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: c.bg, color: c.color }}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-semibold text-slate-800 truncate">{act.title}</p>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {new Date(act.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      {act.metadata && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block"
                          style={{ background: '#dbeafe', color: '#2563eb' }}>{act.metadata}</span>
                      )}
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{act.description}</p>
                    </div>
                  </div>
                )
              }) : (
                <p className="text-sm text-slate-400 py-8 text-center">No activity recorded yet</p>
              )}
            </div>

            {/* Visitor journey */}
            {lead.email && (
              <div className="mt-6">
                <VisitorJourneyPanel email={lead.email} />
              </div>
            )}
          </div>

          {/* eQORE AI Score panel */}
          <div className="w-64 flex-shrink-0 p-5 bg-white space-y-5 overflow-y-auto">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">AI Scoring</p>
              <ScoreRing score={lead.score} />
              <p className="text-sm font-semibold text-slate-600 mt-2">eQORE Lead Score</p>
            </div>

            {/* Win probability */}
            <div className="p-3 rounded-xl bg-slate-50">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[11px] font-semibold text-slate-500">Win probability</p>
                <span className="text-sm font-black"
                  style={{ color: lead.probability >= 60 ? '#10b981' : '#f59e0b' }}>
                  {lead.probability}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${lead.probability}%`,
                    background: lead.probability >= 60 ? '#10b981' : '#f59e0b',
                  }} />
              </div>
            </div>

            {/* Top signals */}
            {topSignals.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">Top Signals ✦</p>
                <div className="space-y-2.5">
                  {topSignals.map(sig => (
                    <div key={sig.id} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                        style={{ background: SIGNAL_CATEGORY_COLOR[sig.category] ?? '#94a3b8' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-slate-700 leading-tight">{sig.signal}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full"
                              style={{ width: `${sig.rawScore}%`, background: SIGNAL_CATEGORY_COLOR[sig.category] ?? '#94a3b8' }} />
                          </div>
                          <span className="text-[10px] text-slate-400 flex-shrink-0">+{sig.contribution.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="space-y-2 pt-2">
              <button className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #2564ea 0%, #4ab6d4 100%)' }}>
                Send Email
              </button>
              <button className="w-full py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5">
                Move Stage <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Score breakdown categories */}
            {topSignals.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">By Category</p>
                {(['intent', 'fit', 'engagement', 'firmographic'] as const).map(cat => {
                  const catSigs = signals.filter(s => s.category === cat)
                  if (!catSigs.length) return null
                  const avg = Math.round(catSigs.reduce((s, x) => s + x.rawScore, 0) / catSigs.length)
                  return (
                    <div key={cat} className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] capitalize text-slate-500 w-20 flex-shrink-0">{cat}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${avg}%`, background: SIGNAL_CATEGORY_COLOR[cat] }} />
                      </div>
                      <span className="text-[10px] text-slate-400 w-7 text-right">{avg}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

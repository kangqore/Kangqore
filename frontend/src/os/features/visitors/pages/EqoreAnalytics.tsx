import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ChatCircle, Target, TrendUp, ThumbsUp, ThumbsDown, Lightning, ArrowLeft } from '@phosphor-icons/react'
import { api } from '@lib/api'

const DAYS_OPTIONS = [7, 14, 30, 90] as const

const INTENT_COLORS: Record<string, string> = {
  pricing:    'bg-amber-500/20 text-amber-300',
  services:   'bg-blue-500/20 text-blue-300',
  comparison: 'bg-purple-500/20 text-purple-300',
  scheduling: 'bg-green-500/20 text-green-300',
  contact:    'bg-green-500/20 text-green-300',
  support:    'bg-slate-500/20 text-slate-300',
  roadmap:    'bg-cyan-500/20 text-cyan-300',
  lead:       'bg-pink-500/20 text-pink-300',
  careers:    'bg-indigo-500/20 text-indigo-300',
  company:    'bg-slate-500/20 text-slate-400',
  other:      'bg-slate-700/20 text-slate-400',
}

function pct(n: number, total: number) {
  if (!total) return 0
  return Math.round((n / total) * 100)
}

function Stat({ label, value, sub, color = 'text-[var(--os-text-1)]' }: {
  label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div className="os-card p-4">
      <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)] mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">{sub}</p>}
    </div>
  )
}

export function EqoreAnalytics() {
  const [days, setDays] = useState<typeof DAYS_OPTIONS[number]>(30)

  const { data, isLoading } = useQuery({
    queryKey: ['concierge-analytics', days],
    queryFn:  () => api.get(`/admin/concierge/analytics?days=${days}`).then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })

  const conversionPct   = data ? Math.round((data.conversionRate || 0) * 100) : 0
  const citationPct     = data ? Math.round((data.citationCoverage || 0) * 100) : 0
  const feedbackTotal   = data?.feedback?.total ?? 0
  const feedbackUpPct   = feedbackTotal ? Math.round(((data?.feedback?.up ?? 0) / feedbackTotal) * 100) : 0
  const intents: { intent: string; count: number }[] = data?.intents ?? []
  const totalIntents    = intents.reduce((s, i) => s + i.count, 0)
  const topQuestions: { sample: string; count: number }[] = data?.topQuestions ?? []
  const dropoff: { turn: number; count: number }[] = data?.dropoffByTurn ?? []
  const tokensByDay: { day: string; input: number; output: number; turns: number }[] = data?.tokensByDay ?? []
  const maxDayTurns     = Math.max(1, ...tokensByDay.map(d => d.turns))

  return (
    <div className="space-y-5">
      {/* Sub-nav */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Link
            to="/kangqore-view/admin/visitors"
            className="text-[11px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] flex items-center gap-1.5 px-3 py-1.5 rounded-2xl hover:bg-[var(--os-surface-0)] border border-transparent hover:border-[var(--os-border)] transition-all"
          >
            <ArrowLeft size={12} /> Visitors
          </Link>
          <span className="text-[11px] font-semibold text-[var(--os-text-1)] px-3 py-1.5 bg-[var(--os-surface-0)] rounded-2xl border border-[var(--os-border)]">eQORE Analytics</span>
          <Link
            to="/kangqore-view/admin/visitors/transcripts"
            className="text-[11px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] px-3 py-1.5 rounded-2xl hover:bg-[var(--os-surface-0)] border border-transparent hover:border-[var(--os-border)] transition-all flex items-center gap-1.5"
          >
            <ChatCircle size={12} /> Transcripts
          </Link>
        </div>
        <div className="flex items-center gap-1 bg-[var(--os-surface-0)] rounded-2xl p-1 border border-[var(--os-border)]">
          {DAYS_OPTIONS.map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-2xl transition-all ${
                days === d
                  ? 'bg-[var(--os-card)] text-[var(--os-text-1)] shadow-sm'
                  : 'text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="os-card p-4 h-20 animate-pulse bg-[var(--os-surface-0)]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat label="Conversations"    value={data?.conversations ?? 0}        />
          <Stat label="Total turns"      value={data?.totalTurns ?? 0}           sub={`${data?.conversations ? Math.round(data.totalTurns / data.conversations * 10) / 10 : 0} avg per conv`} />
          <Stat label="Leads captured"   value={data?.leadsCaptured ?? 0}        sub={`${conversionPct}% conversion`} color="text-green-400" />
          <Stat label="Citation coverage" value={`${citationPct}%`}              sub="responses citing KB" />
        </div>
      )}

      {/* Feedback + tokens summary */}
      {!isLoading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="os-card p-4 flex items-center gap-4">
            <ThumbsUp size={20} className="text-green-400" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)]">Positive feedback</p>
              <p className="text-2xl font-black text-green-400">{data.feedback?.up ?? 0}</p>
              <p className="text-[10px] text-[var(--os-text-2)]">{feedbackUpPct}% of rated</p>
            </div>
            <ThumbsDown size={20} className="text-red-400 ml-auto" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)]">Negative</p>
              <p className="text-2xl font-black text-red-400">{data.feedback?.down ?? 0}</p>
            </div>
          </div>
          <div className="os-card p-4">
            <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)] mb-2">Token spend ({days}d)</p>
            <div className="space-y-1.5">
              {[
                { label: 'Input',      value: data.tokens?.input ?? 0,     color: 'bg-blue-500'  },
                { label: 'Output',     value: data.tokens?.output ?? 0,    color: 'bg-green-500' },
                { label: 'Cache read', value: data.tokens?.cacheRead ?? 0, color: 'bg-amber-500' },
              ].map(t => (
                <div key={t.label} className="flex items-center gap-2">
                  <span className="text-[9px] w-14 text-[var(--os-text-2)]">{t.label}</span>
                  <span className={`h-1.5 rounded-full ${t.color}`} style={{ width: `${Math.min(100, Math.round(t.value / 1000))}px` }} />
                  <span className="text-[10px] text-[var(--os-text-1)] font-semibold">{(t.value / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </div>
          <div className="os-card p-4">
            <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)] mb-2 flex items-center gap-1.5">
              <Lightning size={11} /> Guardrail trips
            </p>
            {(data.guardrailTrips ?? []).length === 0
              ? <p className="text-xs text-[var(--os-text-2)]">No trips in window.</p>
              : (data.guardrailTrips ?? []).map((g: { rule: string; count: number }) => (
                <div key={g.rule} className="flex items-center justify-between py-1 border-b border-[var(--os-border)] last:border-0">
                  <span className="text-[11px] text-[var(--os-text-2)]">{g.rule}</span>
                  <span className="text-[11px] font-bold text-red-400">{g.count}</span>
                </div>
              ))
            }
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Intent distribution */}
        <div className="os-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--os-border)] flex items-center gap-2">
            <Target size={13} className="text-[var(--os-text-2)]" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--os-text-2)]">Intent distribution</span>
          </div>
          <div className="p-5 space-y-2.5">
            {isLoading
              ? [1,2,3,4].map(i => <div key={i} className="h-5 rounded bg-[var(--os-surface-0)] animate-pulse" />)
              : intents.length === 0
                ? <p className="text-xs text-[var(--os-text-2)]">No intent data yet.</p>
                : intents.map(({ intent, count }) => (
                  <div key={intent}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${INTENT_COLORS[intent] ?? 'bg-slate-700/20 text-slate-400'}`}>
                        {intent}
                      </span>
                      <span className="text-[10px] text-[var(--os-text-2)]">{count} · {pct(count, totalIntents)}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-[var(--os-surface-0)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-500/60 transition-all duration-500"
                        style={{ width: `${pct(count, totalIntents)}%` }}
                      />
                    </div>
                  </div>
                ))
            }
          </div>
        </div>

        {/* Drop-off by turn */}
        <div className="os-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--os-border)] flex items-center gap-2">
            <TrendUp size={13} className="text-[var(--os-text-2)]" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--os-text-2)]">Conversation depth</span>
          </div>
          <div className="p-5 space-y-2">
            {isLoading
              ? [1,2,3,4].map(i => <div key={i} className="h-5 rounded bg-[var(--os-surface-0)] animate-pulse" />)
              : dropoff.length === 0
                ? <p className="text-xs text-[var(--os-text-2)]">No depth data yet.</p>
                : dropoff.slice(0, 8).map(({ turn, count }) => {
                    const maxCount = Math.max(1, ...dropoff.map(d => d.count))
                    return (
                      <div key={turn} className="flex items-center gap-3">
                        <span className="text-[10px] w-12 text-right text-[var(--os-text-2)] flex-shrink-0">{turn} turn{turn !== 1 ? 's' : ''}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-[var(--os-surface-0)] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-500/60"
                            style={{ width: `${pct(count, maxCount)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[var(--os-text-2)] w-8 flex-shrink-0">{count}</span>
                      </div>
                    )
                  })
            }
          </div>
        </div>

        {/* Activity sparkline */}
        {!isLoading && tokensByDay.length > 0 && (
          <div className="os-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--os-border)] flex items-center gap-2">
              <ChatCircle size={13} className="text-[var(--os-text-2)]" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--os-text-2)]">Daily conversation activity</span>
            </div>
            <div className="p-5">
              <div className="flex items-end gap-1 h-20">
                {tokensByDay.slice(-30).map(({ day, turns }) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-0.5 group relative" title={`${day}: ${turns} turns`}>
                    <div
                      className="w-full rounded-t bg-blue-500/50 group-hover:bg-blue-400/70 transition-colors min-h-[2px]"
                      style={{ height: `${Math.max(2, (turns / maxDayTurns) * 72)}px` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-[var(--os-text-2)]">{tokensByDay[0]?.day?.slice(5)}</span>
                <span className="text-[9px] text-[var(--os-text-2)]">{tokensByDay[tokensByDay.length - 1]?.day?.slice(5)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Top questions */}
        <div className="os-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--os-border)] flex items-center gap-2">
            <ChatCircle size={13} className="text-[var(--os-text-2)]" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--os-text-2)]">Top questions</span>
          </div>
          <div className="divide-y divide-[var(--os-border)]">
            {isLoading
              ? [1,2,3,4].map(i => <div key={i} className="p-3 h-10 animate-pulse bg-[var(--os-surface-0)]" />)
              : topQuestions.length === 0
                ? <p className="p-5 text-xs text-[var(--os-text-2)]">No question data yet.</p>
                : topQuestions.slice(0, 10).map((q, i) => (
                  <div key={i} className="px-5 py-2.5 flex items-start gap-3">
                    <span className="text-[10px] w-5 text-right text-[var(--os-text-2)] flex-shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-[11px] text-[var(--os-text-1)] flex-1 leading-relaxed">"{q.sample}"</p>
                    {q.count > 1 && (
                      <span className="text-[9px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded-full flex-shrink-0">×{q.count}</span>
                    )}
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

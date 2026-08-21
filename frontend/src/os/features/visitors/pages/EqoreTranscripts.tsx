import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChatCircle, ArrowLeft, CaretLeft, CaretRight, ArrowUpRight, Check, User } from '@phosphor-icons/react'
import { api } from '@lib/api'

function fmt(date: string) {
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const INTENT_COLORS: Record<string, string> = {
  pricing:    'bg-amber-500/10 text-amber-400 border-amber-500/20',
  services:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  comparison: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  scheduling: 'bg-green-500/10 text-green-400 border-green-500/20',
  contact:    'bg-green-500/10 text-green-400 border-green-500/20',
  support:    'bg-slate-500/10 text-slate-400 border-slate-500/20',
  roadmap:    'bg-cyan-500/10 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent border-cyan-500/20',
}

function TranscriptDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['transcript-detail', id],
    queryFn: () => api.get(`/admin/concierge/transcripts/${id}`).then(r => r.data),
  })

  if (isLoading) return (
    <div className="space-y-3">
      {[1,2,3,4].map(i => (
        <div key={i} className="os-card p-4">
          <div className="h-3 w-3/4 bg-[var(--os-surface-0)] rounded animate-pulse mb-2" />
          <div className="h-3 w-1/2 bg-[var(--os-surface-0)] rounded animate-pulse" />
        </div>
      ))}
    </div>
  )

  if (!data) return <div className="os-card p-10 text-center text-[var(--os-text-2)] text-sm">Transcript not found.</div>

  const messages: any[] = data.messages ?? []
  const intents: Record<string, number> = data.intents ?? {}

  return (
    <div className="space-y-5 max-w-3xl">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[11px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
      >
        <ArrowLeft size={13} /> Back to transcripts
      </button>

      {/* Header */}
      <div className="os-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)] mb-1">Conversation</p>
            <p className="text-sm font-mono text-[var(--os-text-1)]">{data.id}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-1">{fmt(data.createdAt)} · {messages.length} messages</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {data.leadCaptured && (
              <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Check size={9} weight="bold" /> Lead captured
              </span>
            )}
            {data.visitorUuid && (
              <button
                onClick={() => navigate(`/kangqore-view/admin/visitors?uuid=${data.visitorUuid}`)}
                className="text-[10px] text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1 transition-colors"
                title="View visitor profile"
              >
                <User size={10} /> {String(data.visitorUuid).slice(0, 12)}…
              </button>
            )}
          </div>
        </div>

        {Object.keys(intents).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-[var(--os-border)]">
            {Object.entries(intents).map(([intent, count]) => (
              <span key={intent} className={`text-[10px] border px-2 py-0.5 rounded-full font-semibold ${INTENT_COLORS[intent] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                {intent} ×{count}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Message thread */}
      <div className="os-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--os-border)] flex items-center gap-2">
          <ChatCircle size={13} className="text-[var(--os-text-2)]" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--os-text-2)]">Full conversation</span>
        </div>
        <div className="p-5 space-y-4">
          {messages.map((m: any, i: number) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-6 h-6 rounded-2xl bg-[var(--os-surface-0)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ChatCircle size={12} className="text-[#2564ea]" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-600/20 text-[var(--os-text-1)] rounded-br-sm'
                  : 'bg-[var(--os-surface-0)] text-[var(--os-text-1)] rounded-bl-sm'
              }`}>
                {m.content}
                {m.timestamp && (
                  <p className="text-[9px] text-[var(--os-text-2)] mt-1 text-right">
                    {new Date(m.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function EqoreTranscripts() {
  const location = useLocation()
  const [page, setPage]       = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(
    (location.state as any)?.openId ?? null
  )

  const { data, isLoading } = useQuery({
    queryKey: ['transcripts', page],
    queryFn: () => api.get(`/admin/concierge/transcripts?page=${page}&limit=20`).then(r => r.data),
    staleTime: 1000 * 30,
  })

  if (selectedId) return <TranscriptDetail id={selectedId} onBack={() => setSelectedId(null)} />

  const transcripts: any[] = data?.transcripts ?? []
  const total: number      = data?.total ?? 0
  const pages              = data?.pages ?? 1

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-[var(--os-text-1)]">eQORE Transcripts</h2>
          <p className="text-xs text-[var(--os-text-2)]">{total} conversations stored</p>
        </div>
      </div>

      {/* Table */}
      <div className="os-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--os-border)]">
                {['First message', 'Turns', 'Intents', 'Lead', 'Last active', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--os-border)]">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3 rounded bg-[var(--os-surface-0)] animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))}
              {!isLoading && transcripts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[var(--os-text-2)] text-sm">
                    No conversations recorded yet.
                  </td>
                </tr>
              )}
              {!isLoading && transcripts.map((t: any) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className="border-b border-[var(--os-border)] hover:bg-[var(--os-surface-0)] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 max-w-[280px]">
                    <p className="truncate text-[var(--os-text-1)]">{t.firstMessage ?? '—'}</p>
                    <p className="text-[10px] text-[var(--os-text-2)] font-mono mt-0.5">{String(t.id).slice(0, 12)}…</p>
                  </td>
                  <td className="px-4 py-3 font-bold text-[var(--os-text-1)]">{t.turnCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(t.intents ?? []).slice(0, 2).map((intent: string) => (
                        <span key={intent} className={`text-[9px] border px-1.5 py-0.5 rounded-full font-semibold ${INTENT_COLORS[intent] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                          {intent}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {t.leadCaptured
                      ? <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 w-fit"><Check size={9} weight="bold" />Lead</span>
                      : <span className="text-[var(--os-text-2)]">—</span>}
                  </td>
                  <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{timeAgo(t.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <ArrowUpRight size={13} className="text-[var(--os-text-2)]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--os-border)]">
            <span className="text-[11px] text-[var(--os-text-2)]">Page {page} of {pages} · {total} total</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-2xl border border-[var(--os-border)] disabled:opacity-30 hover:bg-[var(--os-surface-0)] transition-colors"
              >
                <CaretLeft size={13} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="p-1.5 rounded-2xl border border-[var(--os-border)] disabled:opacity-30 hover:bg-[var(--os-surface-0)] transition-colors"
              >
                <CaretRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

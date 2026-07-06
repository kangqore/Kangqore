import { useState } from 'react'
import {
  Brain, Check, RotateCcw, TrendingUp, AlertTriangle,
  Lightbulb, Zap, Target, Trash2, BookOpen,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { useKIMMPStore, type InsightCategory, type MemoryEntry } from '@store/kimmp'

const CATEGORY_CONFIG: Record<InsightCategory, {
  label: string
  color: string
  bg: string
  Icon: React.FC<{ className?: string }>
}> = {
  revenue:     { label: 'Revenue',     color: 'text-[#00c875]', bg: 'bg-[#00c875]', Icon: ({ className }) => <TrendingUp    className={className ?? 'w-3.5 h-3.5'} /> },
  risk:        { label: 'Risk',        color: 'text-[#e2445c]', bg: 'bg-[#e2445c]', Icon: ({ className }) => <AlertTriangle className={className ?? 'w-3.5 h-3.5'} /> },
  opportunity: { label: 'Opportunity', color: 'text-[#0073ea]', bg: 'bg-[#0073ea]', Icon: ({ className }) => <Lightbulb     className={className ?? 'w-3.5 h-3.5'} /> },
  ops:         { label: 'Operations',  color: 'text-[#fdab3d]', bg: 'bg-[#fdab3d]', Icon: ({ className }) => <Zap           className={className ?? 'w-3.5 h-3.5'} /> },
  talent:      { label: 'Talent',      color: 'text-[#7f53f9]', bg: 'bg-[#7f53f9]', Icon: ({ className }) => <Target        className={className ?? 'w-3.5 h-3.5'} /> },
}

const LEARNED_PATTERNS = [
  {
    id: 'lp1',
    icon: AlertTriangle,
    color: '#e2445c',
    title: 'Financial risks are always critical',
    body: 'Every budget or cash signal in Finance has been escalated to critical within 48h. KIMMP now pre-classifies Finance risk signals at critical priority.',
  },
  {
    id: 'lp2',
    icon: TrendingUp,
    color: '#00c875',
    title: 'Deals stall at 10 days — win rate drops sharply',
    body: 'Historical analysis of 14 closed deals: win rate drops from 81% to 52% once a negotiation exceeds 10 days without contact. KIMMP fires a revenue signal at day 8.',
  },
  {
    id: 'lp3',
    icon: Target,
    color: '#7f53f9',
    title: 'Offers not accepted within 48h rarely close',
    body: 'Offers accepted in <24h: 94% close. >48h: 58% close. KIMMP triggers a talent signal at the 48h mark for all open offers.',
  },
  {
    id: 'lp4',
    icon: Lightbulb,
    color: '#0073ea',
    title: 'Usage spikes above 3× signal upsell readiness',
    body: 'Clients who exceed 3× their 30-day usage baseline convert to a higher tier in 71% of cases within 6 weeks. KIMMP watches all client usage trends and flags above threshold.',
  },
  {
    id: 'lp5',
    icon: Zap,
    color: '#fdab3d',
    title: 'Three consecutive below-velocity sprints = delivery risk',
    body: 'Analysis of 6 past project overruns: all preceded by 3+ sprints below target velocity. KIMMP now tracks rolling 3-sprint average and escalates at the third miss.',
  },
]

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function MemoryEntryRow({ entry }: { entry: MemoryEntry }) {
  const config = CATEGORY_CONFIG[entry.signalCategory]
  return (
    <div className="flex items-start gap-4 p-6 transition-transform hover:-translate-y-1" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 16px 32px rgba(0,0,0,0.04)' }}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${config.bg} text-white`}>
        <config.Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[var(--os-text-1)] leading-tight">{entry.signalTitle}</p>
        {entry.note && <p className="text-xs text-[var(--os-text-2)] mt-1">{entry.note}</p>}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="neutral" size="sm">{config.label}</Badge>
          <span className="text-[10px] text-[var(--os-text-2)] font-semibold">{formatTimestamp(entry.timestamp)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-green-600 bg-green-50/50 px-3 py-1.5 rounded-full">
          <Check className="w-3.5 h-3.5" />
          {entry.action === 'acted' ? 'Acted' : 'Acknowledged'}
        </div>
      </div>
    </div>
  )
}

export function MemoryPage() {
  const { memoryEntries, acknowledgedIds, unacknowledgeSignal, insights } = useKIMMPStore()
  const [view, setView] = useState<'log' | 'patterns'>('log')

  const acknowledgedSignals = insights.filter(i => acknowledgedIds.includes(i.id))

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3 pb-5 mb-1 border-b border-[var(--os-border)]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center flex-shrink-0 shadow-lg">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-[var(--os-text-1)]">KIMMP Memory</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">
            What KIMMP has learned about your business — and what you've actioned.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 w-fit mb-6">
        {([
          { key: 'log',      label: `Action Log (${memoryEntries.length})` },
          { key: 'patterns', label: `Learned Patterns (${LEARNED_PATTERNS.length})` },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setView(t.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              view === t.key
                ? 'text-white'
                : 'bg-[var(--os-card)] text-[var(--os-text-2)] shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:text-[var(--os-text-1)]'
            }`}
            style={view === t.key ? { background: 'linear-gradient(135deg, #7c3aed 0%, #2564ea 100%)', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Action Log */}
      {view === 'log' && (
        <div className="space-y-6">

          {/* Currently acknowledged */}
          {acknowledgedSignals.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Currently Acknowledged ({acknowledgedSignals.length})
              </h3>
              <div className="space-y-3">
                {acknowledgedSignals.map(signal => (
                  <div key={signal.id} className="flex items-center gap-4 p-5 transition-transform hover:-translate-y-1" style={{ background: 'rgba(34,197,94,0.06)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 16px 32px rgba(34,197,94,0.1)' }}>
                    <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="flex-1 text-sm font-bold text-[var(--os-text-2)] line-through opacity-70">{signal.title}</p>
                    <Badge variant="neutral" size="sm">{signal.module}</Badge>
                    <button
                      onClick={() => unacknowledgeSignal(signal.id)}
                      title="Restore to active signals"
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all bg-white shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Memory log */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              Action History
            </h3>
            {memoryEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 32px 64px rgba(0,0,0,0.04)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#7c3aed20', color: '#7c3aed' }}>
                  <Brain className="w-6 h-6 text-[#7c3aed]" />
                </div>
                <p className="text-base font-bold text-[var(--os-text-1)]">No actions recorded yet</p>
                <p className="text-sm text-[var(--os-text-2)] mt-1.5 max-w-xs">
                  When you acknowledge a signal on the Intelligence tab, KIMMP logs it here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {memoryEntries.map(entry => (
                  <MemoryEntryRow key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Learned Patterns */}
      {view === 'patterns' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            These are patterns KIMMP has identified across your business data. They inform how signals are generated, prioritised, and timed.
          </p>
          {LEARNED_PATTERNS.map(pattern => {
            const Icon = pattern.icon
            return (
              <div key={pattern.id} className="p-6 transition-transform hover:-translate-y-1" style={{ background: `${pattern.color}10`, borderRadius: 'var(--os-radius-xl)', boxShadow: `0 16px 32px ${pattern.color}15` }}>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${pattern.color}20`, color: pattern.color }}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--os-text-1)] text-base">{pattern.title}</p>
                    <p className="text-sm text-[var(--os-text-2)] mt-1.5 leading-relaxed">{pattern.body}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

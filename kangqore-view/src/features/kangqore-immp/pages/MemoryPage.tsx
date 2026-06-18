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
    iconColor: 'text-[#e2445c] bg-red-50',
    title: 'Financial risks are always critical',
    body: 'Every budget or cash signal in Finance has been escalated to critical within 48h. KIMMP now pre-classifies Finance risk signals at critical priority.',
  },
  {
    id: 'lp2',
    icon: TrendingUp,
    iconColor: 'text-[#00c875] bg-green-50',
    title: 'Deals stall at 10 days — win rate drops sharply',
    body: 'Historical analysis of 14 closed deals: win rate drops from 81% to 52% once a negotiation exceeds 10 days without contact. KIMMP fires a revenue signal at day 8.',
  },
  {
    id: 'lp3',
    icon: Target,
    iconColor: 'text-[#7f53f9] bg-violet-50',
    title: 'Offers not accepted within 48h rarely close',
    body: 'Offers accepted in <24h: 94% close. >48h: 58% close. KIMMP triggers a talent signal at the 48h mark for all open offers.',
  },
  {
    id: 'lp4',
    icon: Lightbulb,
    iconColor: 'text-[#0073ea] bg-blue-50',
    title: 'Usage spikes above 3× signal upsell readiness',
    body: 'Clients who exceed 3× their 30-day usage baseline convert to a higher tier in 71% of cases within 6 weeks. KIMMP watches all client usage trends and flags above threshold.',
  },
  {
    id: 'lp5',
    icon: Zap,
    iconColor: 'text-[#fdab3d] bg-orange-50',
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
    <div className="flex items-start gap-3 p-4 rounded-xl border border-os-border bg-os-s1 hover:border-os-border transition-all">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg} text-white`}>
        <config.Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 leading-tight">{entry.signalTitle}</p>
        {entry.note && <p className="text-xs text-slate-500 mt-0.5">{entry.note}</p>}
        <div className="flex items-center gap-2 mt-1.5">
          <Badge variant="neutral" size="sm">{config.label}</Badge>
          <span className="text-[10px] text-slate-500">{formatTimestamp(entry.timestamp)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
          <Check className="w-3 h-3" />
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
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center flex-shrink-0 shadow-lg">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">KIMMP Memory</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            What KIMMP has learned about your business — and what you've actioned.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border border-os-border rounded-xl p-1 bg-slate-900 w-fit">
        {([
          { key: 'log',      label: `Action Log (${memoryEntries.length})` },
          { key: 'patterns', label: `Learned Patterns (${LEARNED_PATTERNS.length})` },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setView(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              view === t.key
                ? 'bg-os-s1 text-white shadow-sm border border-os-border'
                : 'text-slate-500 hover:text-slate-300'
            }`}
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
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Currently Acknowledged ({acknowledgedSignals.length})
              </h3>
              <div className="space-y-2">
                {acknowledgedSignals.map(signal => (
                  <div key={signal.id} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                    <div className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <p className="flex-1 text-sm font-medium text-slate-300 line-through opacity-70">{signal.title}</p>
                    <Badge variant="neutral" size="sm">{signal.module}</Badge>
                    <button
                      onClick={() => unacknowledgeSignal(signal.id)}
                      title="Restore to active signals"
                      className="w-6 h-6 rounded-md flex items-center justify-center text-slate-300 hover:text-slate-300 hover:bg-os-s1 transition-all"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Memory log */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              Action History
            </h3>
            {memoryEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-os-s1 rounded-2xl border border-os-border">
                <div className="w-12 h-12 rounded-2xl bg-os-s1 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-300">No actions recorded yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
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
              <div key={pattern.id} className="bg-os-s1 rounded-xl border border-os-border p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${pattern.iconColor}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{pattern.title}</p>
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{pattern.body}</p>
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

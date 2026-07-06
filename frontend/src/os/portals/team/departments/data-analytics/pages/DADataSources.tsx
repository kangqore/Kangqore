import { Sparkles } from 'lucide-react'
import { Database } from '@phosphor-icons/react'

const ACCENT = '#0284C7'

type SourceType = 'Database' | 'API' | 'File' | 'Streaming'

interface DataSource {
  name:      string
  type:      SourceType
  owner:     string
  records:   string
  lastSync:  string
  quality:   number
}

const SOURCES: DataSource[] = [
  { name: 'Salesforce CRM',           type: 'API',       owner: 'Vikram Rao',  records: '48,200',  lastSync: '2026-06-24 08:00', quality: 96 },
  { name: 'PostgreSQL — Production',  type: 'Database',  owner: 'Cyrus Irani', records: '1.2M',    lastSync: '2026-06-24 07:30', quality: 99 },
  { name: 'HubSpot Marketing',        type: 'API',       owner: 'Deepa Menon', records: '12,400',  lastSync: '2026-06-24 07:00', quality: 93 },
  { name: 'Xero Finance',             type: 'API',       owner: 'Vikram Rao',  records: '8,600',   lastSync: '2026-06-23 23:00', quality: 98 },
  { name: 'Zendesk Support',          type: 'API',       owner: 'Deepa Menon', records: '34,100',  lastSync: '2026-06-24 08:15', quality: 95 },
  { name: 'GitHub Metrics',           type: 'API',       owner: 'Cyrus Irani', records: '62,000',  lastSync: '2026-06-24 06:00', quality: 97 },
  { name: 'BambooHR',                 type: 'API',       owner: 'Vikram Rao',  records: '1,240',   lastSync: '2026-06-23 18:00', quality: 94 },
  { name: 'Kafka Event Stream',       type: 'Streaming', owner: 'Cyrus Irani', records: '12.4k/d', lastSync: 'Live',             quality: 99 },
  { name: 'Datadog Metrics',          type: 'Streaming', owner: 'Cyrus Irani', records: '4.8M/d',  lastSync: 'Live',             quality: 99 },
  { name: 'Google Analytics',         type: 'API',       owner: 'Deepa Menon', records: '2.1M',    lastSync: '2026-06-24 04:00', quality: 88 },
  { name: 'Excel Exports (Finance)',  type: 'File',      owner: 'Vikram Rao',  records: '18,400',  lastSync: '2026-06-23',       quality: 76 },
  { name: 'JIRA Project Data',        type: 'API',       owner: 'Cyrus Irani', records: '28,000',  lastSync: '2026-06-24 07:45', quality: 92 },
]

const TYPE_COLOR: Record<SourceType, string> = {
  Database:  '#7C3AED',
  API:       '#0284C7',
  File:      '#F59E0B',
  Streaming: '#10B981',
}

function QualityBar({ score }: { score: number }) {
  const color = score >= 95 ? '#10B981' : score >= 85 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-slate-700 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{score}%</span>
    </div>
  )
}

export function DADataSources() {
  const avgQuality = Math.round(SOURCES.reduce((acc, s) => acc + s.quality, 0) / SOURCES.length)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Database size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Data Sources</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Data source catalogue — type, ownership, sync status and quality scores.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sources',  value: String(SOURCES.length),                                             color: ACCENT },
          { label: 'APIs',           value: String(SOURCES.filter(s => s.type === 'API').length),            color: '#0284C7' },
          { label: 'Streaming',      value: String(SOURCES.filter(s => s.type === 'Streaming').length),      color: '#10B981' },
          { label: 'Avg Quality',    value: `${avgQuality}%`,                                                  color: avgQuality >= 95 ? '#10B981' : '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          Excel Finance exports have 76% quality — the lowest in the catalogue. Manual file-based ingestion is a data
          quality risk; recommend migrating to direct Xero API connection. Google Analytics at 88% should be investigated
          for missing or duplicate session data. The 2 streaming sources (Kafka, Datadog) are at 99% — the real-time
          data infrastructure is solid.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Source', 'Type', 'Owner', 'Records', 'Last Sync', 'Quality'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {SOURCES.map(s => {
                const tc = TYPE_COLOR[s.type]
                return (
                  <tr key={s.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{s.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>{s.type}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{s.owner}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{s.records}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap text-xs">{s.lastSync}</td>
                    <td className="px-4 py-3"><QualityBar score={s.quality} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

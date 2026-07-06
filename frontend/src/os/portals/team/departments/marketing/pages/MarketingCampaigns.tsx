import { Megaphone, Sparkles } from 'lucide-react'

const STATS = [
  { label: 'Active',    value: '8',  color: '#10B981' },
  { label: 'Scheduled', value: '3',  color: '#6366F1' },
  { label: 'Paused',    value: '2',  color: '#F59E0B' },
  { label: 'Completed', value: '14', color: '#EC4899' },
]

const CAMPAIGNS = [
  { name: 'Q2 Enterprise Outreach',  type: 'Lead Gen',   status: 'Active',    progress: 67 },
  { name: 'Kangqore OS Launch',      type: 'Awareness',  status: 'Active',    progress: 42 },
  { name: 'BIDS™ Product Series',    type: 'Lead Gen',   status: 'Scheduled', progress: null },
  { name: 'Partner Enablement Kit',  type: 'Enablement', status: 'Active',    progress: 88 },
  { name: 'Summer Webinar Series',   type: 'Awareness',  status: 'Scheduled', progress: null },
]

const STATUS_STYLES: Record<string, string> = {
  Active:    'bg-emerald-500/20 text-emerald-400',
  Scheduled: 'bg-blue-500/20 text-blue-400',
  Paused:    'bg-amber-500/20 text-amber-400',
  Completed: 'bg-slate-500/20 text-[var(--os-text-2)]',
}

export function MarketingCampaigns() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
          <Megaphone className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Campaigns</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Live campaign tracker with MQL targets and pipeline attribution.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Campaign table */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">All Campaigns</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[var(--os-text-2)] uppercase tracking-wider border-b border-white/[0.05]">
                <th className="text-left pb-3 font-medium">Campaign</th>
                <th className="text-left pb-3 font-medium">Type</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="text-left pb-3 font-medium w-40">Progress</th>
              </tr>
            </thead>
            <tbody className="space-y-0">
              {CAMPAIGNS.map(c => (
                <tr key={c.name} className="border-b border-white/[0.05] last:border-0">
                  <td className="py-3 pr-4 font-medium text-white">{c.name}</td>
                  <td className="py-3 pr-4 text-[var(--os-text-2)]">{c.type}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {c.progress !== null ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${c.progress}%`, backgroundColor: '#EC4899' }}
                          />
                        </div>
                        <span className="text-xs text-[var(--os-text-2)] w-8 text-right">{c.progress}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--os-text-2)]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KIMMP insight */}
      <div className="p-5 rounded-2xl border border-pink-500/20 bg-pink-500/5 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">KIMMP Insight</span>
        </div>
        <p className="text-sm text-[var(--os-text-1)] leading-relaxed">
          Q2 Enterprise Outreach is underperforming vs MQL target. Recommend increasing LinkedIn spend by 20% based on last quarter's conversion rate.
        </p>
      </div>
    </div>
  )
}

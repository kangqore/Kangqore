import { Calendar } from 'lucide-react'

const STATS = [
  { label: 'Upcoming',       value: '4',     color: '#EC4899' },
  { label: 'Past YTD',       value: '12',    color: '#6366F1' },
  { label: 'Attendees YTD',  value: '1,840', color: '#10B981' },
  { label: 'Leads Generated',value: '284',   color: '#F59E0B' },
]

const UPCOMING = [
  { name: 'Kangqore AI Summit',  type: 'Webinar',      date: '2026-07-15', detail: '200 registered' },
  { name: 'FinTech Leaders Forum',type: 'Conference',   date: '2026-08-02', detail: 'Sponsoring' },
  { name: 'BIDS™ Live Demo',      type: 'Product Demo', date: '2026-07-22', detail: '45 registered' },
  { name: 'Partner Summit',       type: 'Partner',      date: '2026-09-10', detail: 'Planning' },
]

const PAST = [
  { name: 'Kangqore OS Launch Webinar', date: '2026-05-20', attendees: 312, leads: 48 },
  { name: 'AI in Operations Panel',     date: '2026-05-08', attendees: 180, leads: 29 },
  { name: 'BIDS™ Masterclass (Series 1)',date: '2026-04-14', attendees: 240, leads: 61 },
  { name: 'Enterprise AI Roundtable',   date: '2026-03-22', attendees: 80,  leads: 22 },
  { name: 'Q1 Partner Enablement Day',  date: '2026-03-05', attendees: 145, leads: 38 },
]

const TYPE_STYLES: Record<string, string> = {
  Webinar:      'bg-blue-500/20 text-blue-400',
  Conference:   'bg-purple-500/20 text-purple-400',
  'Product Demo':'bg-emerald-500/20 text-emerald-400',
  Partner:      'bg-amber-500/20 text-amber-400',
}

export function MarketingEvents() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Events</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Upcoming events, sponsorships, and YTD lead generation from events.</p>
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

      {/* Upcoming events */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Upcoming Events</h2>
        <div className="space-y-2">
          {UPCOMING.map(e => (
            <div key={e.name} className="flex items-center gap-4 py-2.5 border-b border-white/[0.05] last:border-0">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{e.name}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">{e.date}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_STYLES[e.type] ?? 'bg-slate-500/20 text-[var(--os-text-2)]'}`}>
                {e.type}
              </span>
              <span className="text-xs text-[var(--os-text-2)] w-28 text-right">{e.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Past events */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Past Events (YTD)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[var(--os-text-2)] uppercase tracking-wider border-b border-white/[0.05]">
                <th className="text-left pb-3 font-medium">Event</th>
                <th className="text-left pb-3 font-medium">Date</th>
                <th className="text-right pb-3 font-medium">Attendees</th>
                <th className="text-right pb-3 font-medium">Leads</th>
              </tr>
            </thead>
            <tbody>
              {PAST.map(e => (
                <tr key={e.name} className="border-b border-white/[0.05] last:border-0">
                  <td className="py-2.5 pr-4 text-[var(--os-text-1)]">{e.name}</td>
                  <td className="py-2.5 pr-4 text-[var(--os-text-2)] text-xs">{e.date}</td>
                  <td className="py-2.5 text-right text-[var(--os-text-1)] font-medium">{e.attendees}</td>
                  <td className="py-2.5 text-right font-bold" style={{ color: '#EC4899' }}>{e.leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

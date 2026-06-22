import { Megaphone, Pin } from 'lucide-react'

const announcements = [
  {
    id: 1,
    title: 'Ops Centre Sprint 0 kicks off Monday',
    body: 'We are building the Operations Centre module this sprint — Issues Feed, Root Cause, Commitments, Entity Graph, and Change Log. This is the foundation for our enterprise ServiceNow replacement play. All hands on deck.',
    author: 'Mahesh Kumar',
    date: '23 Jun 2026',
    pinned: true,
    tag: 'Engineering',
    tagColor: '#6366F1',
  },
  {
    id: 2,
    title: 'Legacy frontend deletion target: 1 Aug 2026',
    body: 'kangqore-view/ is our target for deletion. The 30-day parallel run is in progress. All new feature work goes into frontend/src/os/ only. Ensure your branches target the OS directory.',
    author: 'Mahesh Kumar',
    date: '18 Jun 2026',
    pinned: true,
    tag: 'Infrastructure',
    tagColor: '#F59E0B',
  },
  {
    id: 3,
    title: 'SOC 2 Type I engagement starting Q3',
    body: 'We have formally kicked off our SOC 2 Type I readiness assessment. The trust services criteria mapping document will be shared next week. All engineers should review the access control and change management sections.',
    author: 'Mahesh Kumar',
    date: '15 Jun 2026',
    pinned: false,
    tag: 'Compliance',
    tagColor: '#10B981',
  },
  {
    id: 4,
    title: 'AEGIS Phase 1 complete — 80 agents live',
    body: 'Phase 1 of AEGIS is complete. 80 governance agents are active across 10 engines. GovernanceOps is fully live. Phases 2–4 stubs are active. Phase 2 scheduling begins after Ops Centre.',
    author: 'Mahesh Kumar',
    date: '10 Jun 2026',
    pinned: false,
    tag: 'Platform',
    tagColor: '#EC4899',
  },
]

export function TeamAnnouncements() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
          <Megaphone className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Announcements</h1>
          <p className="text-slate-500 mt-1 text-sm">Company-wide updates from leadership.</p>
        </div>
      </div>

      <div className="space-y-4">
        {announcements.map(a => (
          <div key={a.id} className="p-6 rounded-2xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                {a.pinned && <Pin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />}
                <h3 className="font-bold text-white text-[15px]">{a.title}</h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ color: a.tagColor, background: `${a.tagColor}18`, border: `1px solid ${a.tagColor}30` }}>{a.tag}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{a.body}</p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span>{a.author}</span>
              <span>·</span>
              <span>{a.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

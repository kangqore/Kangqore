import { useState } from 'react'
import { Megaphone, Pin, Bell, Archive } from 'lucide-react'

type AnnouncementTag = 'Engineering' | 'Infrastructure' | 'Compliance' | 'Platform' | 'Company' | 'Product'

interface Announcement {
  id: number
  title: string
  body: string
  author: string
  date: string
  pinned: boolean
  tag: AnnouncementTag
  tagColor: string
  read: boolean
}

const announcements: Announcement[] = [
  {
    id: 1,
    title: 'Ops Centre Sprint 0 — build starts now',
    body: 'We are building the Operations Centre module this sprint — Issues Feed, Root Cause, Commitments, Entity Graph, and Change Log. This is the foundation for our enterprise ServiceNow replacement play. All hands aligned. Ops Centre is Sprint 0 of the enterprise phase. Nothing blocks this.',
    author: 'C.O.D.E.',
    date: '23 Jun 2026',
    pinned: true,
    tag: 'Engineering',
    tagColor: '#6366F1',
    read: false,
  },
  {
    id: 2,
    title: 'TEAM and EXECUTIVE portal roles now live',
    body: 'Two new authenticated roles have been added to the platform — TEAM (internal staff) and EXECUTIVE (leadership suite). Both are live in the schema, auth routes, login UI, and portal routes. Staging deploy expected within 24h.',
    author: 'C.O.D.E.',
    date: '23 Jun 2026',
    pinned: true,
    tag: 'Platform',
    tagColor: '#EC4899',
    read: false,
  },
  {
    id: 3,
    title: 'Legacy frontend deletion target: 1 Aug 2026',
    body: 'kangqore-view/ is our target for deletion. The 30-day parallel run is in progress since 18 Jun. All new feature work goes into frontend/src/os/ only. Ensure your branches target the OS directory. Any PR touching kangqore-view/ after 1 Jul will be rejected.',
    author: 'C.O.D.E.',
    date: '18 Jun 2026',
    pinned: true,
    tag: 'Infrastructure',
    tagColor: '#F59E0B',
    read: true,
  },
  {
    id: 4,
    title: 'SOC 2 Type I engagement starting Q3',
    body: 'We have formally kicked off our SOC 2 Type I readiness assessment. The trust services criteria mapping document will be shared next week. All engineers should review the access control and change management sections. Rohan Mehta is the DRI.',
    author: 'C.O.D.E.',
    date: '15 Jun 2026',
    pinned: false,
    tag: 'Compliance',
    tagColor: '#10B981',
    read: true,
  },
  {
    id: 5,
    title: 'AEGIS Phase 1 complete — 80 agents live',
    body: 'Phase 1 of AEGIS is complete. 80 governance agents are active across 10 engines. GovernanceOps is fully live. Phases 2–4 stubs are active. Phase 2 scheduling begins after Ops Centre Sprint 0 ships.',
    author: 'C.O.D.E.',
    date: '10 Jun 2026',
    pinned: false,
    tag: 'Platform',
    tagColor: '#EC4899',
    read: true,
  },
  {
    id: 6,
    title: 'Desktop app (Electron) shipped to internal team',
    body: 'The Kangqore desktop app is available for internal testing. macOS and Windows builds are in /desktop. The desktop app wraps the OS at localhost:3001 and adds system-level notifications for P1/P2 Issues. Install instructions in the README.',
    author: 'Arjun Sharma',
    date: '5 Jun 2026',
    pinned: false,
    tag: 'Product',
    tagColor: '#06B6D4',
    read: true,
  },
]

type FilterMode = 'all' | 'unread' | 'pinned'

const unreadCount  = announcements.filter(a => !a.read).length
const pinnedCount  = announcements.filter(a => a.pinned).length

export function TeamAnnouncements() {
  const [filter, setFilter] = useState<FilterMode>('all')

  const visible = announcements.filter(a => {
    if (filter === 'unread') return !a.read
    if (filter === 'pinned') return a.pinned
    return true
  })

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F97316' }}>
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--os-text-1)' }}>Announcements</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--os-text-2)' }}>Company-wide updates from leadership.</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full flex-shrink-0" style={{ background: '#fdab3d', boxShadow: '0 2px 8px #fdab3d40' }}>
            <Bell className="w-3 h-3 text-white" />
            <span className="text-[11px] font-black text-white">{unreadCount} unread</span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1" style={{ borderBottom: '2px solid var(--os-border)' }}>
        {([
          ['all',    'All',    announcements.length],
          ['unread', 'Unread', unreadCount],
          ['pinned', 'Pinned', pinnedCount],
        ] as [FilterMode, string, number][]).map(([id, label, count]) => {
          const isActive = filter === id
          const ACCENT = '#F97316'
          return (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-[2px] transition-all duration-150"
              style={isActive
                ? { borderBottomColor: ACCENT, color: ACCENT }
                : { borderBottomColor: 'transparent', color: 'var(--os-text-2)' }
              }
            >
              {label}
              <span
                className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                style={isActive
                  ? { background: '#F97316', color: '#fff' }
                  : { background: 'var(--os-border)', color: 'var(--os-text-2)' }
                }
              >{count}</span>
            </button>
          )
        })}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {visible.map(a => (
          <div
            key={a.id}
            className="p-6 rounded-2xl transition-all duration-150"
            style={{
              background: 'var(--os-card)',
              border: !a.read ? `2px solid ${a.tagColor}` : '1px solid var(--os-border)',
              borderLeft: `4px solid ${a.tagColor}`,
              boxShadow: !a.read ? `0 2px 12px ${a.tagColor}20` : 'var(--os-shadow-card)',
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {a.pinned && <Pin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: a.tagColor }} />}
                {!a.read && (
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.tagColor }} />
                )}
                <h3 className="font-bold text-[15px] leading-snug" style={{ color: 'var(--os-text-1)' }}>{a.title}</h3>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className="text-[10px] font-black px-2.5 py-1 rounded-full"
                  style={{ background: a.tagColor, color: '#fff' }}
                >{a.tag}</span>
                {a.pinned && (
                  <Archive className="w-3.5 h-3.5 cursor-pointer transition-colors" style={{ color: 'var(--os-text-3)' }} />
                )}
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--os-text-2)' }}>{a.body}</p>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--os-text-3)' }}>
              <span className="font-semibold" style={{ color: 'var(--os-text-2)' }}>{a.author}</span>
              <span>·</span>
              <span>{a.date}</span>
            </div>
          </div>
        ))}

        {visible.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#F97316' }}>
              <Bell className="w-8 h-8 text-white" />
            </div>
            <p className="font-bold text-lg" style={{ color: 'var(--os-text-1)' }}>Nothing here</p>
            <p className="text-sm mt-1" style={{ color: 'var(--os-text-2)' }}>No announcements in this filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}

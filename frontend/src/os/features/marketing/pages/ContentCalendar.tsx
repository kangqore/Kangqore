import { useState } from 'react'
import { Plus, X, FileText, Video, Mic, Globe, BookOpen, Share2 } from 'lucide-react'
import { useMarketingStore } from '../store'
import type { ContentPiece } from '../types'

const GREEN  = '#10b981'
const BLUE   = '#2564ea'
const AMBER  = '#f59e0b'
const PURPLE = '#7c3aed'
const TEAL   = '#0d9488'
const RED    = '#ef4444'
const SLATE  = '#6b7280'

type ContentType = ContentPiece['type']
type ContentStatus = ContentPiece['status']

const TYPE_CFG: Record<ContentType, { label: string; icon: React.ElementType; color: string }> = {
  blog:       { label: 'Blog',       icon: Globe,    color: BLUE   },
  'case-study': { label: 'Case Study', icon: BookOpen, color: TEAL   },
  whitepaper: { label: 'Whitepaper', icon: FileText,  color: PURPLE },
  video:      { label: 'Video',      icon: Video,     color: RED    },
  webinar:    { label: 'Webinar',    icon: Mic,       color: AMBER  },
  social:     { label: 'Social',     icon: Share2,    color: GREEN  },
}

const STATUS_CFG: Record<ContentStatus, { label: string; color: string }> = {
  published: { label: 'Published', color: GREEN  },
  scheduled: { label: 'Scheduled', color: BLUE   },
  review:    { label: 'In Review', color: AMBER  },
  draft:     { label: 'Draft',     color: SLATE  },
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function ContentTypeIcon({ type, size = 12 }: { type: ContentType; size?: number }) {
  const cfg = TYPE_CFG[type]
  const Icon = cfg.icon
  return <Icon style={{ width: size, height: size, color: cfg.color }} />
}

function ContentRow({ cp }: { cp: ContentPiece }) {
  const tc = TYPE_CFG[cp.type]
  const sc = STATUS_CFG[cp.status]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 100px 70px 60px 80px', alignItems: 'center', borderBottom: '1px solid var(--os-border)', minHeight: 48 }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-0)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <ContentTypeIcon type={cp.type} size={13} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)', lineHeight: 1.3 }}>{cp.title}</div>
          <div style={{ fontSize: 9, color: SLATE, marginTop: 2 }}>{cp.author}</div>
        </div>
      </div>
      <div>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 7, background: tc.color + '12', color: tc.color }}>{tc.label}</span>
      </div>
      <div>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 7, background: sc.color + '12', color: sc.color }}>{sc.label}</span>
      </div>
      <div style={{ fontSize: 10, color: 'var(--os-text-3)', fontVariantNumeric: 'tabular-nums' }}>
        {cp.publishDate ? new Date(cp.publishDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-2)', fontVariantNumeric: 'tabular-nums' }}>
        {cp.views > 0 ? (cp.views >= 1000 ? `${(cp.views / 1000).toFixed(1)}k` : String(cp.views)) : '—'}
      </div>
      <div style={{ paddingRight: 14, fontSize: 11, fontWeight: 700, color: cp.leads > 0 ? TEAL : SLATE, fontVariantNumeric: 'tabular-nums' }}>
        {cp.leads > 0 ? `${cp.leads} leads` : '—'}
      </div>
    </div>
  )
}

function CalendarMonth({ year, month, pieces }: { year: number; month: number; pieces: ContentPiece[] }) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const byDay: Record<number, ContentPiece[]> = {}
  pieces.forEach(cp => {
    if (!cp.publishDate) return
    const d = new Date(cp.publishDate)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      byDay[day] = [...(byDay[day] ?? []), cp]
    }
  })

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ background: 'var(--os-surface-0)', padding: '12px 16px', borderBottom: '1px solid var(--os-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--os-text-1)' }}>{MONTHS[month]} {year}</span>
        <span style={{ fontSize: 10, color: SLATE }}>{Object.values(byDay).reduce((s, a) => s + a.length, 0)} pieces scheduled</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '8px 8px 4px' }}>
        {DAYS.map(d => (
          <div key={d} style={{ padding: '4px 0', textAlign: 'center', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: SLATE }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, padding: '0 8px 12px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
          const items = byDay[day] ?? []
          return (
            <div key={i} style={{
              minHeight: 52, padding: '4px 3px', borderRadius: 6,
              background: isToday ? BLUE + '14' : items.length > 0 ? 'var(--os-surface-0)' : 'transparent',
              border: `1px solid ${isToday ? BLUE + '30' : items.length > 0 ? 'var(--os-border)' : 'transparent'}`,
            }}>
              <div style={{ fontSize: 9, fontWeight: isToday ? 900 : 600, color: isToday ? BLUE : 'var(--os-text-3)', marginBottom: 3, textAlign: 'right', paddingRight: 3 }}>
                {day}
              </div>
              {items.slice(0, 2).map(cp => {
                const tc = TYPE_CFG[cp.type]
                const sc = STATUS_CFG[cp.status]
                return (
                  <div key={cp.id} title={cp.title} style={{ fontSize: 8, fontWeight: 700, padding: '1px 4px', borderRadius: 3, background: sc.color + '14', color: sc.color, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <tc.icon style={{ width: 8, height: 8, flexShrink: 0 }} />
                    {cp.title.split(' ').slice(0, 3).join(' ')}
                  </div>
                )
              })}
              {items.length > 2 && <div style={{ fontSize: 7, color: SLATE, paddingLeft: 3 }}>+{items.length - 2}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AddContentModal({ onAdd, onClose }: { onAdd: (cp: ContentPiece) => void; onClose: () => void }) {
  const [form, setForm] = useState({ title: '', type: 'blog' as ContentType, author: '', publishDate: '' })
  function submit() {
    if (!form.title || !form.author) return
    onAdd({ id: `cp-${Date.now()}`, ...form, status: 'draft', views: 0, leads: 0, tags: [] })
    onClose()
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: 'var(--os-card)', border: `1px solid ${BLUE}44`, borderRadius: 14, padding: 22, width: 380, maxWidth: '90vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--os-text-1)' }}>New Content Piece</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: 14, height: 14, color: SLATE }} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input type="text" placeholder="Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none' }} />
          <input type="text" placeholder="Author *" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
            style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none' }} />
          <input type="date" placeholder="Publish date" value={form.publishDate} onChange={e => setForm(f => ({ ...f, publishDate: e.target.value }))}
            style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none' }} />
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as ContentType }))}
            style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none' }}>
            {(Object.keys(TYPE_CFG) as ContentType[]).map(t => <option key={t} value={t}>{TYPE_CFG[t].label}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={submit} style={{ flex: 1, background: BLUE, color: '#fff', border: 'none', borderRadius: 7, padding: '8px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Create</button>
          <button onClick={onClose} style={{ background: 'var(--os-surface-3)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '8px 14px', fontSize: 12, cursor: 'pointer', color: 'var(--os-text-2)' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export function ContentCalendar() {
  const { content, campaigns, metrics, hydrate } = useMarketingStore()
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all')
  const [showAdd, setShowAdd] = useState(false)
  const today = new Date()

  function addContent(cp: ContentPiece) {
    hydrate({ campaigns, content: [...content, cp], metrics })
  }

  const filtered = filterType === 'all' ? content : content.filter(cp => cp.type === filterType)
  const totalViews = content.reduce((s, cp) => s + cp.views, 0)
  const totalLeads = content.reduce((s, cp) => s + cp.leads, 0)
  const published  = content.filter(cp => cp.status === 'published').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {showAdd && <AddContentModal onAdd={addContent} onClose={() => setShowAdd(false)} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--os-text-1)', margin: 0 }}>Content Calendar</h2>
          <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: '3px 0 0' }}>{content.length} pieces · {published} published</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          <Plus style={{ width: 13, height: 13 }} /> New Piece
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Published',    value: String(published), color: GREEN  },
          { label: 'In Pipeline',  value: String(content.length - published), color: AMBER  },
          { label: 'Total Views',  value: totalViews >= 1000 ? `${(totalViews/1000).toFixed(1)}k` : String(totalViews), color: BLUE   },
          { label: 'Leads from Content', value: String(totalLeads), color: TEAL   },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderLeft: `3px solid ${k.color}`, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: SLATE, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: k.color, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <CalendarMonth year={today.getFullYear()} month={today.getMonth()} pieces={content} />
        <CalendarMonth year={today.getFullYear()} month={(today.getMonth() + 1) % 12} pieces={content} />
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {(['all', ...Object.keys(TYPE_CFG)] as const).map(t => {
          const active = filterType === t
          const col = t === 'all' ? BLUE : TYPE_CFG[t as ContentType].color
          return (
            <button key={t} onClick={() => setFilterType(t as ContentType | 'all')} style={{
              fontSize: 10, fontWeight: 700, padding: '4px 11px', borderRadius: 20,
              background: active ? col + '18' : 'var(--os-surface-3)',
              color: active ? col : SLATE,
              border: `1px solid ${active ? col + '40' : 'var(--os-border)'}`,
              cursor: 'pointer',
            }}>
              {t === 'all' ? `All (${content.length})` : `${TYPE_CFG[t as ContentType].label} (${content.filter(cp => cp.type === t).length})`}
            </button>
          )
        })}
      </div>

      {/* Content list table */}
      <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 100px 70px 60px 80px', background: 'var(--os-surface-0)', padding: '10px 0', borderBottom: '1px solid var(--os-border)' }}>
          {['Title / Author', 'Type', 'Status', 'Publish', 'Views', 'Leads'].map((h, i) => (
            <div key={i} style={{ paddingLeft: i === 0 ? 16 : 0, paddingRight: 14, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-3)' }}>{h}</div>
          ))}
        </div>
        {filtered.map(cp => <ContentRow key={cp.id} cp={cp} />)}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: SLATE, fontSize: 12 }}>No content pieces yet</div>
        )}
      </div>
    </div>
  )
}

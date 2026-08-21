import { useState } from 'react'
import { BookOpen } from 'lucide-react'

const ACCENT = '#06B6D4'

interface KBArticle {
  id: string
  title: string
  category: string
  views: number
  helpfulPct: number
  lastUpdated: string
  author: string
  isNew?: boolean
}

const ARTICLES: KBArticle[] = [
  { id: 'KB-0041', title: 'SSO configuration guide (SAML 2.0 + OIDC)',             category: 'SSO',         views: 311, helpfulPct: 91, lastUpdated: '20 Jun 2026', author: 'Rahul V.',  isNew: true },
  { id: 'KB-0038', title: 'API authentication — generating and rotating tokens',    category: 'API',         views: 284, helpfulPct: 87, lastUpdated: '10 Jun 2026', author: 'Kavya R.' },
  { id: 'KB-0035', title: 'How to export reports and schedule automated delivery',  category: 'General',     views: 247, helpfulPct: 82, lastUpdated: '05 May 2026', author: 'Sneha G.' },
  { id: 'KB-0032', title: 'Billing FAQ — invoices, payment methods, and refunds',   category: 'Billing',     views: 218, helpfulPct: 79, lastUpdated: '28 Apr 2026', author: 'Priya N.' },
  { id: 'KB-0029', title: 'Managing user roles and permission levels',               category: 'Account',     views: 193, helpfulPct: 85, lastUpdated: '12 Apr 2026', author: 'Arjun S.' },
  { id: 'KB-0026', title: 'Webhook setup and signature verification guide',         category: 'Integration', views: 172, helpfulPct: 88, lastUpdated: '22 Mar 2026', author: 'Rahul V.' },
  { id: 'KB-0022', title: 'Password reset and multi-factor authentication (MFA)',   category: 'Account',     views: 214, helpfulPct: 90, lastUpdated: '14 Mar 2026', author: 'Sneha G.' },
  { id: 'KB-0018', title: 'Troubleshooting slow dashboard load times',               category: 'General',     views: 202, helpfulPct: 76, lastUpdated: '01 Feb 2026', author: 'Kavya R.' },
]

const CAT_COLOR: Record<string, string> = {
  SSO:         '#8B5CF6',
  API:         '#3B82F6',
  Billing:     '#10B981',
  Account:     '#F97316',
  Integration: '#EC4899',
  General:     '#06B6D4',
}

export function SupportKnowledgeBase() {
  const [search, setSearch] = useState('')

  const totalViews    = ARTICLES.reduce((a, k) => a + k.views, 0)
  const avgHelpful    = Math.round(ARTICLES.reduce((a, k) => a + k.helpfulPct, 0) / ARTICLES.length)
  const deflectionRate = '23%'

  const visible = search
    ? ARTICLES.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase())
      )
    : ARTICLES

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <BookOpen size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
          <p className="text-sm text-[var(--os-text-2)]">Self-service articles — reducing support ticket volume</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Articles',          value: String(ARTICLES.length), color: ACCENT    },
          { label: 'Total Views',       value: totalViews.toLocaleString(), color: '#8B5CF6' },
          { label: 'Avg Helpful Rate',  value: `${avgHelpful}%`,        color: '#10B981' },
          { label: 'Deflection Rate',   value: deflectionRate,          color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-white/10 text-sm text-[var(--os-text-1)] placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Article List */}
      <div className="space-y-2">
        {visible.map(a => {
          const cc = CAT_COLOR[a.category] ?? '#94A3B8'
          return (
            <div
              key={a.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${cc}22`, color: cc }}>
                    {a.category}
                  </span>
                  {a.isNew && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-white">{a.title}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">By {a.author} · Updated {a.lastUpdated}</p>
              </div>
              <div className="text-right w-20 shrink-0 hidden sm:block">
                <p className="text-xs text-[var(--os-text-2)]">Views</p>
                <p className="text-sm font-semibold text-white">{a.views}</p>
              </div>
              <div className="text-right w-24 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Helpful</p>
                <p className="text-sm font-semibold" style={{ color: a.helpfulPct >= 85 ? '#10B981' : a.helpfulPct >= 75 ? '#F59E0B' : '#EF4444' }}>
                  {a.helpfulPct}%
                </p>
              </div>
            </div>
          )
        })}
        {visible.length === 0 && (
          <div className="text-center py-12 text-[var(--os-text-2)] text-sm">
            No articles found for "{search}"
          </div>
        )}
      </div>
    </div>
  )
}

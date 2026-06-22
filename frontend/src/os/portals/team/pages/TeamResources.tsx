import { BookOpen, FileText, Link2, ExternalLink, Code2, Palette, Building2 } from 'lucide-react'

const quickLinks = [
  { label: 'GitHub',   href: '#', color: '#6B7280' },
  { label: 'Figma',    href: '#', color: '#A259FF' },
  { label: 'Notion',   href: '#', color: '#FFFFFF' },
  { label: 'Linear',   href: '#', color: '#5E6AD2' },
  { label: 'Slack',    href: '#', color: '#4A154B' },
  { label: 'Vercel',   href: '#', color: '#FFFFFF' },
]

const resources = [
  {
    category: 'Engineering',
    icon: Code2,
    color: '#6366F1',
    items: [
      { icon: FileText, label: 'Architecture Decision Records',     desc: 'OS design decisions, ADR format',          tag: 'Notion',  updated: '2 days ago' },
      { icon: FileText, label: 'API Reference — Internal',          desc: 'All backend routes, auth, payloads',       tag: 'Docs',    updated: '1 week ago' },
      { icon: Link2,    label: 'GitHub Monorepo',                   desc: 'Main repo — Kangqore platform',            tag: 'GitHub',  updated: 'Live'       },
      { icon: FileText, label: 'Prisma Schema Reference',           desc: 'Full entity model with relations',         tag: 'Docs',    updated: '3 days ago' },
      { icon: FileText, label: 'Environment Setup Guide',           desc: 'Local dev: ports, .env, Docker',           tag: 'MD',      updated: '1 week ago' },
      { icon: FileText, label: 'Playwright CI Playbook',            desc: 'Smoke tests, auth injection, CI gates',    tag: 'Docs',    updated: '5 days ago' },
    ]
  },
  {
    category: 'Design & Brand',
    icon: Palette,
    color: '#EC4899',
    items: [
      { icon: Link2,    label: 'Figma Design System',               desc: 'Component library & token palette',        tag: 'Figma',   updated: '4 days ago' },
      { icon: FileText, label: 'Brand Guidelines v3',               desc: 'Logo, colour system, typography',          tag: 'PDF',     updated: '1 month ago' },
      { icon: FileText, label: 'OS Token Reference',                desc: 'os-* tokens, hex values, usage rules',    tag: 'Docs',    updated: '1 week ago' },
      { icon: FileText, label: 'Icon System — Phosphor + Lucide',   desc: 'When to use which library',               tag: 'Docs',    updated: '2 weeks ago' },
    ]
  },
  {
    category: 'Company',
    icon: Building2,
    color: '#F97316',
    items: [
      { icon: FileText, label: 'Employee Handbook',                  desc: 'Policies, benefits, leave entitlements',  tag: 'PDF',     updated: 'Jan 2026'   },
      { icon: FileText, label: 'BIDS™ Product Spec v2',             desc: '16 pillars, 5 engines, deliverables',     tag: 'PDF',     updated: '3 weeks ago' },
      { icon: FileText, label: 'KIMMP / WAANDA Identity Doc',       desc: 'Technical vs commercial identity layers', tag: 'Notion',  updated: '1 week ago' },
      { icon: FileText, label: 'AEGIS Architecture Reference',      desc: '4 domains, 10 engines, 80 agents',        tag: 'Notion',  updated: '2 weeks ago' },
    ]
  },
]

export function TeamResources() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-10">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Resources</h1>
          <p className="text-slate-500 mt-1 text-sm">Documentation, handbooks, and tools for the Kangqore team.</p>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xs font-black tracking-widest uppercase text-slate-600 mb-3">Quick Links</h2>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map(({ label, href, color }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900/40 hover:border-white/25 hover:bg-slate-800/50 transition-all text-sm font-medium text-slate-300 hover:text-white"
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
              {label}
              <ExternalLink className="w-3 h-3 text-slate-600" />
            </a>
          ))}
        </div>
      </div>

      {/* Resource sections */}
      {resources.map(({ category, icon: CatIcon, color, items }) => (
        <section key={category}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `${color}20` }}>
              <CatIcon className="w-3.5 h-3.5" style={{ color }} />
            </div>
            <h2 className="text-base font-bold text-slate-200">{category}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map(({ icon: Icon, label, desc, tag, updated }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10 hover:border-white/20 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm group-hover:text-orange-300 transition-colors">{label}</p>
                  <p className="text-xs text-slate-500 truncate">{desc}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">{tag}</span>
                  <span className="text-[9px] text-slate-700">{updated}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

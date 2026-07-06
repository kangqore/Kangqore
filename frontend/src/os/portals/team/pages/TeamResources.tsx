import { BookOpen, FileText, Link2, ExternalLink, Code2, Palette, Building2 } from 'lucide-react'

const quickLinks = [
  { label: 'GitHub',   href: '#', bg: '#24292e', color: '#fff'    },
  { label: 'Figma',    href: '#', bg: '#A259FF', color: '#fff'    },
  { label: 'Notion',   href: '#', bg: '#000000', color: '#fff'    },
  { label: 'Linear',   href: '#', bg: '#5E6AD2', color: '#fff'    },
  { label: 'Slack',    href: '#', bg: '#4A154B', color: '#fff'    },
  { label: 'Vercel',   href: '#', bg: '#000000', color: '#fff'    },
]

const resources = [
  {
    category: 'Engineering',
    icon: Code2,
    color: '#6366F1',
    items: [
      { icon: FileText, label: 'Architecture Decision Records',     desc: 'OS design decisions, ADR format',          tag: 'Notion',  updated: '2 days ago'  },
      { icon: FileText, label: 'API Reference — Internal',          desc: 'All backend routes, auth, payloads',       tag: 'Docs',    updated: '1 week ago'  },
      { icon: Link2,    label: 'GitHub Monorepo',                   desc: 'Main repo — Kangqore platform',            tag: 'GitHub',  updated: 'Live'        },
      { icon: FileText, label: 'Prisma Schema Reference',           desc: 'Full entity model with relations',         tag: 'Docs',    updated: '3 days ago'  },
      { icon: FileText, label: 'Environment Setup Guide',           desc: 'Local dev: ports, .env, Docker',           tag: 'MD',      updated: '1 week ago'  },
      { icon: FileText, label: 'Playwright CI Playbook',            desc: 'Smoke tests, auth injection, CI gates',    tag: 'Docs',    updated: '5 days ago'  },
    ]
  },
  {
    category: 'Design & Brand',
    icon: Palette,
    color: '#EC4899',
    items: [
      { icon: Link2,    label: 'Figma Design System',               desc: 'Component library & token palette',        tag: 'Figma',   updated: '4 days ago'  },
      { icon: FileText, label: 'Brand Guidelines v3',               desc: 'Logo, colour system, typography',          tag: 'PDF',     updated: '1 month ago' },
      { icon: FileText, label: 'OS Token Reference',                desc: 'os-* tokens, hex values, usage rules',    tag: 'Docs',    updated: '1 week ago'  },
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

const TAG_COLORS: Record<string, string> = {
  Notion: '#000000', Figma: '#A259FF', GitHub: '#24292e',
  Docs: '#579bfc',   PDF: '#e2445c',   MD: '#00c875',
  Live: '#00c875',
}

export function TeamResources() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F97316' }}>
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--os-text-1)' }}>Resources</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--os-text-2)' }}>Documentation, handbooks, and tools for the Kangqore team.</p>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-[11px] font-black tracking-widest uppercase mb-3" style={{ color: 'var(--os-text-3)' }}>Quick Links</h2>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map(({ label, href, bg, color }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 hover:scale-105 hover:shadow-md"
              style={{ background: bg, color }}
            >
              {label}
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          ))}
        </div>
      </div>

      {/* Resource sections */}
      {resources.map(({ category, icon: CatIcon, color, items }) => (
        <section key={category}>
          {/* Section header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color }}>
              <CatIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold" style={{ color: 'var(--os-text-1)' }}>{category}</h2>
            <div className="h-px flex-1" style={{ background: 'var(--os-border)' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map(({ icon: Icon, label, desc, tag, updated }) => {
              const tagBg = TAG_COLORS[tag] ?? '#579bfc'
              return (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer group transition-all duration-150 hover:-translate-y-px"
                  style={{
                    background: 'var(--os-card)',
                    border: '1px solid var(--os-border)',
                    boxShadow: 'var(--os-shadow-card)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--os-border)' }}
                >
                  {/* Icon container — solid vibrant color */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate transition-colors duration-100" style={{ color: 'var(--os-text-1)' }}>{label}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--os-text-2)' }}>{desc}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className="text-[10px] font-black px-1.5 py-0.5 rounded"
                      style={{ background: tagBg, color: '#fff' }}
                    >{tag}</span>
                    <span className="text-[9px]" style={{ color: 'var(--os-text-3)' }}>{updated}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

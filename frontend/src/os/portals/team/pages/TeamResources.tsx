import { BookOpen, FileText, Link2, Download } from 'lucide-react'

const resources = [
  { category: 'Engineering',
    items: [
      { icon: FileText, label: 'Architecture Decision Records',  desc: 'OS design decisions, ADR format',     tag: 'Notion'  },
      { icon: FileText, label: 'API Reference — Internal',      desc: 'All backend routes, auth, payloads',  tag: 'Docs'    },
      { icon: Link2,    label: 'GitHub Repo',                   desc: 'Main monorepo — Kangqore',            tag: 'GitHub'  },
      { icon: FileText, label: 'Prisma Schema Reference',       desc: 'Full entity model with relations',    tag: 'Docs'    },
    ]
  },
  { category: 'Company',
    items: [
      { icon: FileText, label: 'Employee Handbook',         desc: 'Policies, benefits, leave',           tag: 'PDF'    },
      { icon: FileText, label: 'BIDS™ Product Spec v2',     desc: '16 pillars, 5 engines, deliverables', tag: 'PDF'    },
      { icon: FileText, label: 'Brand Guidelines',          desc: 'Logo, colour system, typography',     tag: 'PDF'    },
      { icon: Link2,    label: 'Figma Design System',       desc: 'Component library & tokens',          tag: 'Figma'  },
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

      {resources.map(section => (
        <section key={section.category}>
          <h2 className="text-base font-bold text-slate-200 mb-4">{section.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.items.map(({ icon: Icon, label, desc, tag }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10 hover:border-white/20 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm group-hover:text-orange-300 transition-colors">{label}</p>
                  <p className="text-xs text-slate-500 truncate">{desc}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-500">{tag}</span>
                  <Download className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

import { ArrowUpRight, Layers, Cpu, FileText, Building2 } from 'lucide-react'

const PILLARS = [
  { n: 1,  name: 'Business Strategy Intelligence™',      score: 'Strategy Maturity Score™',         color: 'bg-blue-500/10 border-blue-500/20 text-blue-300'    },
  { n: 2,  name: 'Leadership Intelligence™',             score: 'Leadership Effectiveness Score™',   color: 'bg-blue-500/10 border-blue-500/20 text-blue-300'    },
  { n: 3,  name: 'Financial Intelligence™',              score: 'Financial Health Score™',           color: 'bg-blue-500/10 border-blue-500/20 text-blue-300'    },
  { n: 4,  name: 'Operational Intelligence™',            score: 'Operational Efficiency Score™',     color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' },
  { n: 5,  name: 'Workforce Intelligence™',              score: 'Workforce Readiness Score™',        color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' },
  { n: 6,  name: 'Customer Intelligence™',               score: 'Customer Experience Score™',        color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' },
  { n: 7,  name: 'Sales Intelligence™',                  score: 'Revenue Engine Score™',             color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'     },
  { n: 8,  name: 'Growth Intelligence™',                 score: 'Digital Growth Score™',             color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'     },
  { n: 9,  name: 'Technology Intelligence™',             score: 'Technology Maturity Score™',        color: 'bg-violet-500/10 border-violet-500/20 text-violet-300' },
  { n: 10, name: 'Cloud & Infrastructure Intelligence™', score: 'Infrastructure Readiness Score™',   color: 'bg-violet-500/10 border-violet-500/20 text-violet-300' },
  { n: 11, name: 'Data Intelligence™',                   score: 'Data Maturity Score™',              color: 'bg-violet-500/10 border-violet-500/20 text-violet-300' },
  { n: 12, name: 'AI Intelligence™',                     score: 'AI Readiness Score™',               color: 'bg-violet-500/10 border-violet-500/20 text-violet-300' },
  { n: 13, name: 'Automation Intelligence™',             score: 'Automation Maturity Score™',        color: 'bg-violet-500/10 border-violet-500/20 text-violet-300' },
  { n: 14, name: 'Cybersecurity Intelligence™',          score: 'Cyber Resilience Score™',           color: 'bg-rose-500/10 border-rose-500/20 text-rose-300'     },
  { n: 15, name: 'Governance & Risk Intelligence™',      score: 'Governance Maturity Score™',        color: 'bg-rose-500/10 border-rose-500/20 text-rose-300'     },
  { n: 16, name: 'Transformation Intelligence™',         score: 'Transformation Readiness Score™',   color: 'bg-amber-500/10 border-amber-500/20 text-amber-300'  },
]

const ENGINES = [
  { name: 'Cognition Intelligence Engine™', color: 'bg-violet-500/10 border-violet-500/20 text-violet-300', desc: 'AI & GenAI readiness, data maturity for AI, automation potential, AI governance' },
  { name: 'Foundry Intelligence Engine™',   color: 'bg-blue-500/10 border-blue-500/20 text-blue-300',       desc: 'Infrastructure health, cloud readiness, engineering maturity, platform resilience' },
  { name: 'Reimagine Intelligence Engine™', color: 'bg-amber-500/10 border-amber-500/20 text-amber-300',   desc: 'Modernisation priority, legacy debt exposure, transformation readiness, change capability' },
  { name: 'Shield Intelligence Engine™',    color: 'bg-rose-500/10 border-rose-500/20 text-rose-300',      desc: 'Security posture, risk & compliance gap, AI governance coverage, operational trust' },
  { name: 'Platforms Intelligence Engine™', color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',     desc: 'Enterprise platform utilisation, integration complexity, process maturity, consolidation opportunity' },
  { name: 'Growth Intelligence Engine™',    color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300', desc: 'Revenue engine score, marketing performance gaps, conversion bottlenecks, digital visibility' },
]

const DELIVERABLES = [
  'Diagnostic Scorecard™',
  'Executive Intelligence Report™',
  'Transformation Blueprint™',
  'Risk Register™',
  'Opportunity Register™',
  'Service Prescription Matrix™',
  '30/60/90/180-Day Roadmap™',
  'Executive Board Presentation™',
  'Executive Workshop™',
  'ROI Projection Report™',
]

const INDUSTRIES = [
  'Manufacturing', 'Education', 'Healthcare', 'Financial Services',
  'Retail & Commerce', 'SaaS & Technology', 'Government', 'Startup', 'Enterprise', 'Non-Profit',
]

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string | number; color: string
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export function BidsOverviewPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-950/40 via-violet-950/30 to-slate-900/60 p-8">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-os-blue/20 border border-os-blue/30 text-os-cyan text-[10px] font-semibold uppercase tracking-widest">
                Flagship Product
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">BIDS™</h1>
            <p className="text-slate-300 text-sm font-medium mb-0.5">Business Diagnostic Intelligence System™</p>
            <p className="text-slate-400 text-sm max-w-lg mt-3">
              The Enterprise MRI for Business, Technology, Operations, AI, Security, and Growth.
              Diagnose before you transform — find invisible constraints, not just visible symptoms.
            </p>
            <p className="text-os-cyan text-xs font-semibold tracking-wide mt-4 italic">
              "Diagnose the Enterprise. Unlock the Potential."
            </p>
          </div>
          <a
            href="/contact"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-os-blue to-os-cyan text-white text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity flex-shrink-0"
          >
            Request Diagnostic Assessment
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Layers}    label="Diagnostic Pillars"   value="16"  color="bg-blue-600"    />
        <StatCard icon={Cpu}       label="Intelligence Engines"  value="6"   color="bg-violet-600"  />
        <StatCard icon={FileText}  label="Standard Deliverables" value="10"  color="bg-emerald-600" />
        <StatCard icon={Building2} label="Industry Editions"     value="10"  color="bg-amber-600"   />
      </div>

      {/* 16 Pillars */}
      <div>
        <h2 className="text-base font-semibold text-slate-100 mb-4">The 16 Diagnostic Intelligence Pillars™</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PILLARS.map(p => (
            <div key={p.n} className={`rounded-xl border p-4 ${p.color.replace(/text-\S+/, '')} bg-white/[0.02]`}>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pillar {p.n}</span>
              <p className={`text-sm font-semibold mt-1 ${p.color.split(' ').find(c => c.startsWith('text-'))}`}>{p.name}</p>
              <p className="text-[11px] text-slate-500 mt-1.5">{p.score}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Engines */}
      <div>
        <h2 className="text-base font-semibold text-slate-100 mb-4">The 6 Intelligence Engines™</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ENGINES.map(e => (
            <div key={e.name} className={`rounded-xl border p-5 ${e.color.replace(/text-\S+/, '')} bg-white/[0.02]`}>
              <p className={`text-sm font-semibold ${e.color.split(' ').find(c => c.startsWith('text-'))}`}>{e.name}</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables + Industries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-100 mb-4">Standard Deliverables (every engagement)</h2>
          <ol className="space-y-2">
            {DELIVERABLES.map((d, i) => (
              <li key={d} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-os-blue/20 text-os-cyan text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                {d}
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-100 mb-4">Industry Editions</h2>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map(ind => (
              <span key={ind} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-medium">
                {ind}
              </span>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-xs text-slate-400 leading-relaxed">
              Each industry edition adapts the 16 pillars and 6 engines with sector-specific benchmarks,
              regulatory contexts, and maturity thresholds — ensuring every diagnostic is precisely
              calibrated to the client's operating environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

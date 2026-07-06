import { ExternalLink, TrendingUp, Globe, Star, AlertTriangle } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

const COVERAGE = [
  {
    id: 'c1', pub: 'Forbes', tier: 'Tier 1', date: 'June 2026',
    headline: 'Kangqore Launches BIDS™ Intelligence Suite — The ServiceNow for AI-Native Businesses',
    excerpt: 'Kangqore\'s BIDS™ platform consolidates 16 intelligence pillars into a single operating layer, targeting the fast-growing mid-market AI services segment.',
  },
  {
    id: 'c2', pub: 'TechCrunch', tier: 'Tier 1', date: 'May 2026',
    headline: 'How Kangqore\'s WAANDA AI Is Redefining the Consulting OS',
    excerpt: 'The WAANDA system — a digital twin of the company\'s operations — monitors 6 strategic dimensions in real time and surfaces autonomous recommendations.',
  },
  {
    id: 'c3', pub: 'Wired', tier: 'Tier 1', date: 'May 2026',
    headline: 'The Rise of the Agentic Consultancy',
    excerpt: 'Kangqore is among a handful of firms building AI systems that can act autonomously on behalf of clients — from procurement to performance management.',
  },
  {
    id: 'c4', pub: 'Business Insider', tier: 'Tier 2', date: 'April 2026',
    headline: 'Kangqore Recognised Among Top AI-Native Consulting Firms in 2026',
    excerpt: 'The company placed in the top 10 of Business Insider\'s annual ranking of AI-native professional services providers.',
  },
  {
    id: 'c5', pub: 'The Information', tier: 'Tier 1', date: 'April 2026',
    headline: 'New Agentic AI Capabilities Change the Unit Economics of Consulting',
    excerpt: 'Kangqore\'s platform-first model enables delivery ratios that traditional consulting firms struggle to match, with AI handling 60–70% of research and analysis tasks.',
  },
  {
    id: 'c6', pub: 'VentureBeat', tier: 'Tier 2', date: 'March 2026',
    headline: 'Inside the Platform That Wants to Become the OS for Every AI Business',
    excerpt: 'A deep-dive into Kangqore OS\'s architecture and the ambition to replace fragmented enterprise software stacks with a single, AI-wired operating environment.',
  },
  {
    id: 'c7', pub: 'Financial Times', tier: 'Tier 1', date: 'February 2026',
    headline: 'AI Consulting Firms Post Record Growth as Enterprise Adoption Accelerates',
    excerpt: 'Kangqore was cited alongside three other AI-native firms showing ARR growth above 40% year-on-year, outpacing the broader consulting market by 8x.',
  },
]

const STATS = [
  { label: 'Tier 1 Placements', value: '5', icon: Star    },
  { label: 'Total Coverage Pieces', value: '23', icon: Globe    },
  { label: 'Estimated Reach', value: '14M+', icon: TrendingUp },
]

const TIER_COLOR: Record<string, string> = {
  'Tier 1': 'bg-os-blue/10 text-os-blue',
  'Tier 2': 'bg-slate-500/10 text-[var(--os-text-2)]',
}

export function JournalistCoverage() {
  return (
    <div className="space-y-8">
      <KIMMPSignalBar module="Press Coverage" />
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Press Coverage</h1>
        <p className="text-[var(--os-text-2)] mt-1 text-sm">Sample press coverage and media appearances. H1 2026.</p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300 leading-relaxed">
          <span className="font-bold">ILLUSTRATIVE SAMPLE — Not verified coverage.</span> Headlines, excerpts, and statistics shown are placeholders representing the type of coverage Kangqore is pursuing. They do not represent confirmed or published articles. Contact{' '}
          <a href="mailto:press@kangqore.com" className="underline">press@kangqore.com</a> to verify coverage or arrange a media briefing.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="os-card p-4 text-center">
            <Icon className="w-5 h-5 text-pink-400 mx-auto mb-2" />
            <p className="text-2xl font-extrabold" style={{ color: 'var(--os-text-1)' }}>{value}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-0.5">{label}</p>
            <p className="text-[10px] text-amber-400/70 mt-0.5 italic">illustrative</p>
          </div>
        ))}
      </div>

      {/* Coverage list */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-4">Sample Coverage</h2>
        <div className="space-y-3">
          {COVERAGE.map(({ id, pub, tier, date, headline, excerpt }) => (
            <div
              key={id}
              title="Coverage link available on request — contact press@kangqore.com"
              className="os-card p-4 hover:shadow-md transition-all group cursor-default"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>{pub}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TIER_COLOR[tier]}`}>{tier}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-[var(--os-text-2)]">{date}</span>
                  <span className="flex items-center gap-1 text-xs text-[var(--os-text-2)] group-hover:text-amber-400 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                    On request
                  </span>
                </div>
              </div>
              <p className="text-sm font-semibold text-[var(--os-text-1)] mb-1">{headline}</p>
              <p className="text-xs text-[var(--os-text-2)] line-clamp-2">{excerpt}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-300">
        To pitch a story or arrange an interview,{' '}
        <a href="mailto:press@kangqore.com" className="underline">contact the press team</a>. We aim to respond within 24 hours.
      </div>
    </div>
  )
}

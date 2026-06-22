import { Newspaper, Download, ExternalLink, Mail, Image, FileText } from 'lucide-react'

const resources = [
  { icon: Image,    label: 'Brand Assets',   desc: 'Logos, photos, brand guidelines',  tag: 'ZIP'  },
  { icon: FileText, label: 'Press Kit',       desc: 'Company overview & fact sheet',    tag: 'PDF'  },
  { icon: FileText, label: 'Executive Bios',  desc: 'Leadership profiles & headshots',  tag: 'PDF'  },
  { icon: FileText, label: 'Product Sheets',  desc: 'BIDS™ and service one-pagers',     tag: 'PDF'  },
]

const latestNews = [
  { date: 'June 2026',  headline: 'Kangqore Launches BIDS™ Intelligence Suite for Mid-Market Enterprises' },
  { date: 'May 2026',   headline: 'Kangqore Recognised Among Top AI-Native Consulting Firms' },
  { date: 'April 2026', headline: 'New Agentic AI Capabilities Added to Core Platform' },
]

export function JournalistHome() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
          <Newspaper className="w-6 h-6 text-pink-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Press &amp; Media Hub</h1>
          <p className="text-slate-500 mt-1 text-sm">Resources for verified press and media professionals covering Kangqore.</p>
        </div>
      </div>

      {/* Press contact */}
      <div className="p-5 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-semibold text-slate-200 text-sm">Press Enquiries</p>
          <p className="text-slate-500 text-xs mt-0.5">For interviews, quotes, or media requests</p>
        </div>
        <a
          href="mailto:press@kangqore.com"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 transition-colors"
        >
          <Mail className="w-4 h-4" />
          press@kangqore.com
        </a>
      </div>

      {/* Resources */}
      <section>
        <h2 className="text-base font-bold text-slate-200 mb-4">Press Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resources.map(({ icon: Icon, label, desc, tag }) => (
            <div key={label} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-200 text-sm">{label}</p>
                <p className="text-slate-500 text-xs truncate">{desc}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-500">{tag}</span>
                <Download className="w-4 h-4 text-slate-500 hover:text-slate-300 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest news */}
      <section>
        <h2 className="text-base font-bold text-slate-200 mb-4">Latest News</h2>
        <div className="space-y-3">
          {latestNews.map(({ date, headline }) => (
            <div key={headline} className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 hover:shadow-sm transition-shadow group">
              <span className="text-xs font-semibold text-slate-500 mt-0.5 whitespace-nowrap">{date}</span>
              <p className="flex-1 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{headline}</p>
              <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-500 flex-shrink-0 transition-colors" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

import { Newspaper, Download, ExternalLink, Mail, Image, FileText, AlertTriangle } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

const resources = [
  { icon: Image,    label: 'Brand Assets',   desc: 'Logos, photos, brand guidelines',  tag: 'ZIP'  },
  { icon: FileText, label: 'Press Kit',       desc: 'Company overview & fact sheet',    tag: 'PDF'  },
  { icon: FileText, label: 'Executive Bios',  desc: 'Leadership profiles & headshots',  tag: 'PDF'  },
  { icon: FileText, label: 'Product Sheets',  desc: 'BIDS™ and service one-pagers',     tag: 'PDF'  },
]

const sampleCoverage = [
  { date: 'June 2026',  headline: 'Kangqore Launches BIDS™ Intelligence Suite for Mid-Market Enterprises' },
  { date: 'May 2026',   headline: 'Kangqore Recognised Among Top AI-Native Consulting Firms' },
  { date: 'April 2026', headline: 'New Agentic AI Capabilities Added to Core Platform' },
]

export function JournalistHome() {
  return (
    <div className="space-y-10">
      <KIMMPSignalBar module="Press Hub" />
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
          <Newspaper className="w-6 h-6 text-pink-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Press &amp; Media Hub</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Resources for verified press and media professionals covering Kangqore.</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300 leading-relaxed">
          <span className="font-bold">SAMPLE CONTENT — For demonstration only.</span> Press assets and coverage samples shown here are placeholders. For verified press kits, high-resolution assets, and confirmed media coverage, contact{' '}
          <a href="mailto:press@kangqore.com" className="underline">press@kangqore.com</a>.
        </p>
      </div>

      {/* Press contact */}
      <div className="p-5 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-semibold text-[var(--os-text-1)] text-sm">Press Enquiries</p>
          <p className="text-[var(--os-text-2)] text-xs mt-0.5">For interviews, quotes, or media requests</p>
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
        <h2 className="text-base font-bold text-[var(--os-text-1)] mb-4">Press Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resources.map(({ icon: Icon, label, desc, tag }) => (
            <div key={label} className="flex items-center gap-4 p-4 rounded-2xl os-card hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[var(--os-surface)] flex items-center justify-center flex-shrink-0" style={{ border: '1px solid var(--os-border)' }}>
                <Icon className="w-5 h-5 text-[var(--os-text-2)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--os-text-1)] text-sm">{label}</p>
                <p className="text-[var(--os-text-2)] text-xs truncate">{desc}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded text-[var(--os-text-2)]" style={{ background: 'var(--os-surface)', border: '1px solid var(--os-border)' }}>{tag}</span>
                <a
                  href={`mailto:press@kangqore.com?subject=Press+Asset+Request:+${encodeURIComponent(label)}`}
                  title="Request this asset from the press team"
                >
                  <Download className="w-4 h-4 text-[var(--os-text-2)] hover:text-pink-400 cursor-pointer transition-colors" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sample coverage */}
      <section>
        <h2 className="text-base font-bold text-[var(--os-text-1)] mb-4">Sample Coverage</h2>
        <div className="space-y-3">
          {sampleCoverage.map(({ date, headline }) => (
            <div
              key={headline}
              title="Coverage link available on request — contact press@kangqore.com"
              className="flex items-start gap-4 p-4 rounded-2xl os-card hover:shadow-md transition-shadow group cursor-default"
            >
              <span className="text-xs font-semibold text-[var(--os-text-2)] mt-0.5 whitespace-nowrap">{date}</span>
              <p className="flex-1 text-sm font-medium text-[var(--os-text-1)] group-hover:text-[var(--os-text-1)] transition-colors">{headline}</p>
              <ExternalLink className="w-4 h-4 text-[var(--os-text-2)] group-hover:text-pink-400 flex-shrink-0 transition-colors" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
